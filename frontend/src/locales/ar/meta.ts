// "meta" namespace: chrome text for app-shell utility components that sit outside the main
// navigation/course flow — PWA install banner, app rating prompt, global error boundary, generic
// loading fallback, XP progress bar. See frontend/src/locales/ar/navigation.ts for the sibling
// namespace and the established key style.
export const meta = {
  // PwaInstallBanner.tsx
  pwaIosInstallHint:
    'لتثبيت التطبيق على جهازك: اضغط على زر المشاركة (Share) ثم اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen) 📲',
  pwaBannerTitle: 'ثبّت لعبة ودروس مَسيد على لوحتك أو هاتفك',
  pwaBannerBadge: 'سريع وخفيف 🚀',
  pwaBannerSubtitle: 'الوصول السريع بكبسة واحدة والتعلم بسهولة بدون انقطاع!',
  pwaInstallButton: 'تثبيت التطبيق الآن 🚀',
  pwaLaterButton: 'لاحقاً',
  pwaCloseAriaLabel: 'إغلاق',
  pwaInstalledSuccess: 'رائع! تم تثبيت تطبيق مَسيد DZ بنجاح على جهازك يا بطل 🎉',

  // AppRatingPrompt.tsx
  ratingCloseAriaLabel: 'إغلاق',
  ratingTitle: 'هل يعجبك تطبيق مَسِيد؟ 🌟',
  ratingSubtitle: 'قيّم تجربتك معنا بنجمة واحدة إلى خمس نجوم',
  ratingStarAriaLabel: '{count} نجوم',
  ratingThanksHighTitle: 'شكراً جزيلاً! 🎉',
  ratingThanksHighBody: 'نتمنى أن تترك لنا تقييماً على المتجر ليستفيد المزيد من التلاميذ.',
  ratingThanksLowTitle: 'شكراً على رأيك!',
  ratingThanksLowBody: 'يسعدنا أن تخبرنا كيف يمكننا التحسين.',
  ratingSendFeedbackButton: 'أرسل ملاحظاتك',

  // ErrorBoundary.tsx
  errorTitle: 'حَدَثَ خَطَأٌ غَيْرُ مُتَوَقَّعٍ',
  errorMessage: 'نَعْتَذِرُ، حَدَثَتْ مُشْكِلَةٌ فِي هَذِهِ الصَّفْحَةِ. اِضْغَطْ عَلَى الزِّرِّ أَدْنَاهُ لِلْعَوْدَةِ وَإِعَادَةِ المُحَاوَلَةِ.',
  errorReloadButton: '🔄 إِعَادَةُ التَّحْمِيلِ',

  // LoadingFallback.tsx
  loadingDefaultLabel: 'جاري التحميل...',

  // ui/XPProgressBar.tsx
  xpLevelLabel: 'المستوى {level}',
};
