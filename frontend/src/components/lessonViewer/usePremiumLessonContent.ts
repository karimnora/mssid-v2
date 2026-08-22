import { useEffect, useState } from 'react';
import { CourseLesson } from '../../types';
import { springBootApi } from '../../services/springBootApi';

export function usePremiumLessonContent(lessonProp: CourseLesson) {
  const [premiumContent, setPremiumContent] = useState<Partial<CourseLesson> | null>(null);
  const [premiumFetchState, setPremiumFetchState] = useState<'idle' | 'loading' | 'forbidden' | 'error' | 'done'>('idle');

  useEffect(() => {
    setPremiumContent(null);
    if (!lessonProp.premiumContentPending) {
      setPremiumFetchState('idle');
      return;
    }
    setPremiumFetchState('loading');
    let cancelled = false;
    springBootApi.getPremiumLessonContent(lessonProp.id).then((res) => {
      if (cancelled) return;
      if (res.status === 200 && res.data) {
        setPremiumContent(res.data);
        setPremiumFetchState('done');
      } else if (res.status === 403) {
        setPremiumFetchState('forbidden');
      } else {
        setPremiumFetchState('error');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [lessonProp.id, lessonProp.premiumContentPending]);

  const lesson: CourseLesson = premiumContent ? { ...lessonProp, ...premiumContent } : lessonProp;
  return { lesson, premiumFetchState };
}
