import React, { useState } from 'react';
import { Star, Zap, ShieldCheck, Trophy, Rocket } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { XPProgressBar } from './XPProgressBar';

/**
 * Visual reference for the design-system kit — every variant of every
 * component, in one page. Not wired into the app's routing; mount it
 * temporarily (e.g. behind a dev-only flag) to review or screenshot it.
 */
export const DesignSystemShowcase: React.FC = () => {
  const [xp, setXp] = useState(35);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-6 space-y-10" dir="rtl">
      <header className="space-y-1">
        <h1 className="text-2xl font-black">🎨 نظام التصميم — مَسِيد DZ</h1>
        <p className="text-sm text-[var(--app-text-muted)]">Button · Card · Badge · XPProgressBar</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-black">الأزرار (Button)</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">إجابة صحيحة</Button>
          <Button variant="accent" icon={<Zap className="w-4 h-4" />}><span dir="ltr">+15 XP</span></Button>
          <Button variant="info">التالي</Button>
          <Button variant="danger">إعادة المحاولة</Button>
          <Button variant="ghost">إلغاء</Button>
          <Button variant="outline">تفاصيل</Button>
          <Button variant="primary" disabled>معطّل</Button>
          <Button variant="primary" loading>جارٍ التحميل</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm">صغير</Button>
          <Button variant="primary" size="md">متوسط</Button>
          <Button variant="primary" size="lg">كبير</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black">البطاقات (Card)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h3 className="font-black mb-1">بطاقة ثابتة</h3>
            <p className="text-sm text-[var(--app-text-muted)]">محتوى عادي بدون تفاعل.</p>
          </Card>
          <Card interactive onClick={() => setXp((v) => Math.min(100, v + 10))}>
            <h3 className="font-black mb-1">بطاقة تفاعلية</h3>
            <p className="text-sm text-[var(--app-text-muted)]">انقر لإضافة نقاط خبرة.</p>
          </Card>
          <Card padding="lg" className="border-l-4 border-l-[var(--brand-emerald)]">
            <h3 className="font-black mb-1">حشوة كبيرة</h3>
            <p className="text-sm text-[var(--app-text-muted)]">padding="lg"</p>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black">الشارات (Badge)</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="xp" icon={<Star className="w-3.5 h-3.5" />}><span dir="ltr">+50 XP</span></Badge>
          <Badge variant="success" icon={<ShieldCheck className="w-3.5 h-3.5" />}>مكتمل</Badge>
          <Badge variant="info">جديد</Badge>
          <Badge variant="danger">عاجل</Badge>
          <Badge variant="neutral">عادي</Badge>
          <Badge variant="xp" icon={<Trophy className="w-3.5 h-3.5" />} pop>وسام مُفكَّك للتو!</Badge>
        </div>
      </section>

      <section className="space-y-3 max-w-md">
        <h2 className="text-lg font-black">شريط التقدم (XPProgressBar)</h2>
        <Card>
          <XPProgressBar currentXp={xp} level={4} />
          <div className="mt-4">
            <Button variant="accent" icon={<Rocket className="w-4 h-4" />} onClick={() => setXp((v) => Math.min(100, v + 15))}>
              أضف 15 XP
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};
