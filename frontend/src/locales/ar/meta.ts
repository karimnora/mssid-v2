// "meta" namespace: chrome text for app-shell utility components that sit outside the main
// navigation/course flow — PWA install banner, app rating prompt, global error boundary, generic
// loading fallback, XP progress bar. See frontend/src/locales/ar/navigation.ts for the sibling
// namespace and the established key style.
export const meta = {
  installSubtitle: 'افتح مَسيد بسهولة من جهازك.',
  installGooglePlay: 'التحميل من Google Play',
  installHomeScreen: 'إضافة إلى الشاشة الرئيسية',
  installIosHelp: 'في Safari، افتح قائمة المشاركة ثم اختر «إضافة إلى الشاشة الرئيسية». إذا كنت تستخدم متصفحاً آخر، افتح هذا الموقع في Safari أولاً.',
  installError: 'تعذر بدء التثبيت. حاول مجدداً أو استخدم قائمة المتصفح.',
  reviewTitle: 'رأيك في مَسيد',
  reviewStoreDescription: 'يمكنك إضافة تقييم وتعليق مباشرة على Google Play.',
  reviewContactDescription: 'شارك ملاحظاتك مع فريق مَسيد.',
  reviewGooglePlay: 'التقييم على Google Play',
  reviewSuggestion: 'إرسال اقتراح',
  reviewOpenError: 'تعذر فتح Google Play. حاول بعد قليل.',
  appVersion: 'الإصدار {version} · البناء {build}',
  offlineTitle: 'التعلم دون اتصال',
  offlineOnline: 'الاتصال بالإنترنت متاح',
  offlineDisconnected: 'أنت غير متصل بالإنترنت',
  offlineContent: 'قد تبقى المحتويات المتوفرة على هذا الجهاز متاحة دون إنترنت. افتح الدروس المطلوبة قبل قطع الاتصال.',
  offlineLimits: 'تسجيل الدخول والمعلم الذكي والمحتويات التي تتطلب جلبها من الخادم تحتاج إلى الإنترنت.',
  offlineNoSync: 'هذه النافذة لا تحمّل حزماً ولا تزامن تقدمك. أغلقها للعودة إلى دروسك.',
  offlineBack: 'العودة إلى الدروس',
  networkOffline: 'لم يتم رصد اتصال بالإنترنت. اتصل بالشبكة ثم حاول مجدداً.',
  networkSlow: 'الخادم يستغرق وقتاً للرد. يرجى الانتظار.',
  networkTimeout: 'لم يرد الخادم في الوقت المحدد. تحقق من الاتصال ثم حاول مجدداً.',
  networkUnavailable: 'تعذر الاتصال بالخادم. تحقق من الشبكة ثم حاول مجدداً.',
  networkWriteUncertain: 'لم يصل رد الخادم. تحقق من حفظ الإجراء قبل إرساله مرة أخرى.',
  networkRetry: 'حاول مجدداً',
  parentGateTitle: 'بوابة الوالدين',
  parentGateBody: 'هذا الإجراء مخصص لولي الأمر. للمتابعة، يرجى حل العملية الحسابية التالية:',
  parentGateAnswer: 'اكتب الناتج هنا',
  parentGateError: 'إجابة غير صحيحة، حاول مجدداً.',
  parentGateContinue: 'متابعة',
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
