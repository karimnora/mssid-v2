export type UserRole = 'ROLE_FREE' | 'ROLE_PREMIUM' | 'ROLE_ADMIN';

export const ROLE_DAILY_QUOTAS: Record<UserRole, number> = {
  ROLE_FREE: 3,
  ROLE_PREMIUM: 50,
  ROLE_ADMIN: 1000,
};

interface UsageRecord {
  count: number;
  resetAt: number; // timestamp in ms when quota resets (24 hours after first request)
}

interface CacheItem {
  responseText: string;
  cachedAt: number;
  hitsCount: number;
}

class AiRateLimiterAndCacheService {
  private userUsageStore = new Map<string, UsageRecord>();
  private questionCache = new Map<string, CacheItem>();
  private totalHitsSaved = 0;
  private totalQueriesHandled = 0;

  // Normalize string for cache matching (removes Arabic tashkeel, lowercases, trims)
  public normalizeString(str: string): string {
    if (!str) return '';
    return str
      .trim()
      .toLowerCase()
      .replace(/[\u064B-\u0652]/g, '') // Remove Arabic short vowels (tashkeel)
      .replace(/[أإآ]/g, 'ا') // Normalize alef variations
      .replace(/ة/g, 'ه') // Normalize teh marbuta
      .replace(/[^\w\s\u0600-\u06FF]/g, '') // Strip punctuation
      .replace(/\s+/g, ' '); // Collapse spaces
  }

  // Generate unique deterministic cache key from parameters
  public generateCacheKey(params: {
    promptType?: string;
    topic?: string;
    question?: string;
    grade?: string;
    subject?: string;
    type?: string;
    examId?: number | string;
  }): string {
    const pType = params.promptType || params.type || 'explain';
    const normTopic = this.normalizeString(params.topic || '');
    const normQuestion = this.normalizeString(params.question || '');
    const grade = (params.grade || '5AP').trim().toUpperCase();
    const subject = (params.subject || 'all').trim().toLowerCase();

    return `${pType}:${grade}:${subject}:${normTopic}:${normQuestion}`;
  }

  // Check response cache
  public getCachedResponse(cacheKey: string): { text: string; hits: number } | null {
    this.totalQueriesHandled++;
    const cached = this.questionCache.get(cacheKey);
    if (cached) {
      cached.hitsCount++;
      this.totalHitsSaved++;
      return { text: cached.responseText, hits: cached.hitsCount };
    }
    return null;
  }

  // Store response in cache (max 1000 items LRU-style)
  public setCachedResponse(cacheKey: string, responseText: string): void {
    if (this.questionCache.size >= 1000) {
      const firstKey = this.questionCache.keys().next().value;
      if (firstKey) this.questionCache.delete(firstKey);
    }
    this.questionCache.set(cacheKey, {
      responseText,
      cachedAt: Date.now(),
      hitsCount: 1,
    });
  }

  // Consume daily quota for a client identifier
  public checkAndConsumeQuota(
    clientId: string,
    role: UserRole = 'ROLE_FREE'
  ): { allowed: boolean; limit: number; remaining: number; resetHours: number } {
    const limit = ROLE_DAILY_QUOTAS[role] || ROLE_DAILY_QUOTAS.ROLE_FREE;
    const now = Date.now();
    const windowMs = 24 * 60 * 60 * 1000; // 24 Hours

    let record = this.userUsageStore.get(clientId);

    if (!record || now >= record.resetAt) {
      record = {
        count: 0,
        resetAt: now + windowMs,
      };
      this.userUsageStore.set(clientId, record);
    }

    if (record.count >= limit) {
      const remainingMs = record.resetAt - now;
      const resetHours = Math.max(1, Math.ceil(remainingMs / (1000 * 60 * 60)));
      return {
        allowed: false,
        limit,
        remaining: 0,
        resetHours,
      };
    }

    record.count++;
    const remaining = limit - record.count;
    const resetHours = Math.max(1, Math.ceil((record.resetAt - now) / (1000 * 60 * 60)));

    return {
      allowed: true,
      limit,
      remaining,
      resetHours,
    };
  }

  // Get quota status without incrementing
  public getQuotaStatus(
    clientId: string,
    role: UserRole = 'ROLE_FREE'
  ): { limit: number; remaining: number; resetHours: number } {
    const limit = ROLE_DAILY_QUOTAS[role] || ROLE_DAILY_QUOTAS.ROLE_FREE;
    const now = Date.now();

    const record = this.userUsageStore.get(clientId);
    if (!record || now >= record.resetAt) {
      return { limit, remaining: limit, resetHours: 24 };
    }

    const remaining = Math.max(0, limit - record.count);
    const resetHours = Math.max(1, Math.ceil((record.resetAt - now) / (1000 * 60 * 60)));
    return { limit, remaining, resetHours };
  }

  // Stats summary for admin / monitoring
  public getStatsSummary() {
    return {
      cacheSize: this.questionCache.size,
      totalQueriesHandled: this.totalQueriesHandled,
      totalHitsSaved: this.totalHitsSaved,
      hitRatio:
        this.totalQueriesHandled > 0
          ? `${((this.totalHitsSaved / this.totalQueriesHandled) * 100).toFixed(1)}%`
          : '0%',
      activeUsersTracked: this.userUsageStore.size,
      quotas: ROLE_DAILY_QUOTAS,
    };
  }
}

export const aiLimiterCache = new AiRateLimiterAndCacheService();
