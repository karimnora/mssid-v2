import { CourseLesson } from '../../../types';

export const TAMAZIGHT_5AP: CourseLesson[] = [
  {
    id: 'tamazight-5ap-taseddast-noms-verbes',
    grade: '5AP',
    subject: 'tamazight',
    trimester: 1,
    categoryAr: 'Asenfar 1 : Taseddast d Tira (مشروع 1: القواعد والتركيب)',
    titleAr: 'Isem d Umyag deg Tmaziɣt (الاسم والفعل في اللغة الأمازيغية)',
    summaryAr: 'التمييز بين الاسم (Isem) والفعل (Amyag)، حالات الاسم (حالة العزل وحالة الإسناد / Addad ilelli d waddad amaruz)، وأزمنة الفعل الأساسية.',
    objectivesAr: [
      'التمييز بين الاسم والفعل والصفة في الجملة الأمازيغية.',
      'التعرف على التغير الحاصل في بداية الاسم عند التركيب (Addad amaruz).',
      'بناء جمل بسيطة تتكون من فاعل وفعل ومفعول به.',
    ],
    detailedCourse: {
      introAr: 'تتميز قواعد اللغة الأمازيغية بدقة عالية في صياغة الكلمات وحالات الاسم. يتحول الحرف الصوتي الأول من الاسم في حالة الإسناد (مثل: Argaz ➔ Wergaz / Taddart ➔ Teddart).',
      vocabulary: [
        { termAr: 'Isem (ⵉⵙⴻⵎ)', definitionAr: 'الاسم (شخص، حيوان، شيء أو فكرة).' },
        { termAr: 'Amyag (ⴰⵎⵢⴰⴳ)', definitionAr: 'الفعل (حدث مقترن بزمن).' },
        { termAr: 'Tafyirt (ⵜⴰⴼⵢⵉⵔⵜ)', definitionAr: 'الجملة المفيدة.' },
        { termAr: 'Amqim (ⴰⵎⵇⵉⵎ)', definitionAr: 'الضمير (Nek = أنا, Kečč = أنتَ, Kemm = أنتِ...).' },
      ],
      visualizationHintAr: 'الضمائر الأساسية: Nek (أنا)، Kečč (أنتَ)، Kemm (أنتِ)، Netta (هو)، Netthat (هي)، Nekni (نحن).',
      commonMistakes: [
        {
          mistakeAr: 'نسيان تغيير الحرف الأول في حالة الفاعل المسند (Addad amaruz).',
          correctionAr: 'عندما يكون الاسم فاعلاً بعد الفعل يتغير أوله: Yura wergaz (كتب الرجلُ) وليس Yura argaz.',
        },
      ],
      takeawayAr: 'الجملة الأمازيغية الفعلية تبدأ عادة بالفعل يليه الفاعل ثم المفعول به (SVO / VSO).',
    },
    rulesAr: [
      'الاسم يبدأ غالباً بحرف صوتي (a, i, u) : Argaz (رجل), Ikerri (كبش), Udi (زبدة/دهن).',
      'اسم المؤنث يبدأ وينتهي بحرف T...T : Tamurt (أرض/وطن), Tasa (كبد/عاطفة), Takurt (كرة).',
      'الفعل يتصرف مع الضمائر في أزمنة: الماضي (Izri)، المضارع المستمر (Urmir ussid)، والمستقبل (Ad + Amyag).',
    ],
    keyFormulas: [
      { labelAr: 'صيغة التأنيث العامة', formulaAr: 'Isem amalay (A...) ➔ Isem unti (T...t) : Aqcic (ولد) ➔ Taqcict (بنت)' },
    ],
    examplesAr: [
      {
        problem: 'حول الكلمات التالية إلى المؤنث:\n1. Aqcic (ولد)\n2. Argaz (رجل)\n3. Amdakkel (صديق)',
        solution: '1. Taqcict (بنت)\n2. Tameṭṭut (امرأة)\n3. Tamdakkelt (صديقة)',
      },
    ],
    interactiveTool: 'tamazight_lab',
    quiz: [
      {
        id: 'q1',
        questionAr: 'ما هو مؤنث كلمة « Amdakkel » (صديق) ؟',
        options: [
          { id: 'a', textAr: 'Tamdakkelt (ⵜⴰⵎⴷⴰⴽⴽⴻⵍⵜ)', isCorrect: true, explanationAr: 'صحيح! نضيف T في البداية و t في النهاية.' },
          { id: 'b', textAr: 'Aqcic', isCorrect: false },
          { id: 'c', textAr: 'Yemma', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'tamazight-5ap-tinfusin-djeha-uccen',
    grade: '5AP',
    subject: 'tamazight',
    trimester: 2,
    categoryAr: 'Asenfar 2 : Tinfusin d Wansayen (مشروع 2: الحكايات والقصص التراثية)',
    titleAr: 'Tinfusin n Djeḥa d Wuccen (حكايات جحا والذئب/ابن آوى في التراث الجزائري)',
    summaryAr: 'قراءة وفهم نصوص قصصية من الحكايات الشعبية الجزائرية (Djeḥa d Wuccen)، استخلاص الحِكَم والقيم الأخلاقية وتنمية الرصيد اللغوي والتعبيري.',
    objectivesAr: [
      'قراءة وفهم نص قصصي تراثي بالخط التيفيناغي واللاتيني.',
      'تحديد شخصيات القصة (Djeḥa, Uccen, Ikerri, Agellid).',
      'استخلاص العِبرة الأخلاقية والانتصار للحق والحكمة والذكاء.',
    ],
    detailedCourse: {
      introAr: 'الحكاية الشعبية (Tanfust / ⵜⴰⵏⴼⵓⵙⵜ) وعاء حكمة الأجداد. قصص جحا (Djeḥa) وابن آوى (Uccen) تعلم الأطفال الفطنة والصدق والابتعاد عن الطمع والحيلة السيئة.',
      vocabulary: [
        { termAr: 'Tanfust (ⵜⴰⵏⴼⵓⵙⵜ)', definitionAr: 'الحكاية / القصة الشعبية الخالدة.' },
        { termAr: 'Uccen (ⵓⵛⵛⴻⵏ)', definitionAr: 'ابن آوى / الذئب (رمز المكر والحيلة).' },
        { termAr: 'Djeḥa (ⵊⵓⵃⴰ)', definitionAr: 'جحا (شخصية الحكمة الفكاهية والذكاء الطريف).' },
        { termAr: 'Tagant (ⵜⴰⴳⴰⵏⵜ)', definitionAr: 'الغابة والطبيعة العذراء.' },
      ],
      visualizationHintAr: 'تبدأ القصص التراثية عادة بعبارة: « Machaho ! Tellem-chaho ! » (ماشا هُو ! تلّمْ شَاهُو ! = كان يا ما كان في قديم الزمان).',
      commonMistakes: [
        {
          mistakeAr: 'الاعتقاد بأن القصة للتسلية فقط.',
          correctionAr: 'كل حكاية شعبية تحمل رسالة تربوية وأخلاقية عميقة تغرس القيم النبيلة في نفوس الناشئة.',
        },
      ],
      takeawayAr: 'الحكمة والذكاء والعدالة تنتصر دائماً على المكر والأنانية.',
    },
    rulesAr: [
      'افتتاح القصة التراثية : Machaho ! (ماشا هو ! - كان يا ما كان).',
      'اختتام القصة : D tanfust-iw tefra, ad tili d tayri d lehna (وانتهت حكايتي بالمحبة والسلام).',
      'استعمال أفعال الماضي لسرد الأحداث المشوقة.',
    ],
    keyFormulas: [
      { labelAr: 'عبارة افتتاح القصص التراثية', formulaAr: 'Machaho ! Tellem-chaho ! (مَاشَاهُو ! تَلاّمْ شَاهُو !)' },
    ],
    examplesAr: [
      {
        problem: 'اقرأ الجملة التالية واستخرج العبرة:\n« Djeḥa d uccen llan deg tebḥirt, Djeḥa yesseqdec lefhamat-is, ma d uccen yeɣli deg leɣrur-is. »',
        solution: 'جحا استعمل فطنته وعدله فنجح، بينما ابن آوى طمع في كل شيء فوقع في حيلته (الطمع يفسد ما جمع).',
      },
    ],
    interactiveTool: 'tamazight_lab',
    quiz: [
      {
        id: 'q1',
        questionAr: 'ما هي العبارة التراثية الشهيرة التي تبدأ بها الحكايات الأمازيغية ؟',
        options: [
          { id: 'a', textAr: 'Machaho ! Tellem-chaho ! (ⵎⴰⵛⴰⵀⵓ !)', isCorrect: true, explanationAr: 'ممتاز! ماشاهو تعني كان يا ما كان وهي بداية الحكاية الأمازيغية التراثية.' },
          { id: 'b', textAr: 'Ar tufat', isCorrect: false },
          { id: 'c', textAr: 'Tanemmirt', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'tamazight-5ap-agellid-tagant-environnement',
    grade: '5AP',
    subject: 'tamazight',
    trimester: 3,
    categoryAr: 'Asenfar 3 : Tawennaḍt d Yiɣersiwen (مشروع 3: البيئة والحيوانات)',
    titleAr: 'Agellid n Tagant d Uḥareb n Twennaḍt (حيوانات الجزائر وحماية الطبيعة)',
    summaryAr: 'تسمية الحيوانات البرية الجزائرية (الفنك، الأيل البربري، الأسد الإفريقي، النسر) والتعرف على واجب حماية الغابات والتنوع البيولوجي الوطني.',
    objectivesAr: [
      'تسمية الحيوانات الأمازيغية: Aɣilas (الفهد), Awrɣ (الفنك), Izem (الأسد), Ayerẓiẓ (النمر البربري), Igider (النسر).',
      'كتابة نداء للمحافظة على البيئة والغابات الجزائرية (Aḥareb n tgana).',
      'إدراك أهمية التنوع الحيوي في جبال جرجرة والونشريس والأوراس والصحراء الكبرى.',
    ],
    detailedCourse: {
      introAr: 'تزخر الجزائر بثروة حيوانية ونباتية فريدة من جبال جرجرة والأوراس إلى رمال الأهقار والتاسيلي. الحفاظ على هذه الثروة واجب وطني وإنساني.',
      vocabulary: [
        { termAr: 'Izem (ⵉⵣⴻⵎ)', definitionAr: 'الأسد (رمز الشجاعة والقوة).' },
        { termAr: 'Awrɣ / Aɣilas (ⴰⵡⵔⵖ / ⴰⵖⵉⵍⴰⵙ)', definitionAr: 'الفنك الصحراوي / الفهد الإفريقي.' },
        { termAr: 'Igider (ⵉⴳⵉⴷⴻⵔ)', definitionAr: 'النسر الحائم في قمم الجبال.' },
        { termAr: 'Tawennaḍt (ⵜⴰⵡⴻⵏⵏⴰⴹⵜ)', definitionAr: 'البيئة والطبيعة المحيطة بنا.' },
      ],
      visualizationHintAr: 'الفنك (Didou / Awrɣ) هو الرمز الوطني للذكاء والقدرة على التأقلم في الصحراء الجزائرية.',
      commonMistakes: [
        {
          mistakeAr: 'إشعال النار في الغابات أو رمي النفايات البلاستيكية.',
          correctionAr: 'حماية الطبيعة مسؤوليتنا جميعاً: نغرس الأشجار ونحافظ على نظافة الأودية والجبال.',
        },
      ],
      takeawayAr: 'Aḥareb n twennaḍt = حماية البيئة وحفظ ثروات وطننا الحبيب للأجيال القادمة.',
    },
    rulesAr: [
      'Izem (الأسد) - Igider (النسر) - Awrɣ (الفنك) - Ikerri (الكبش) - Taylellut (السنونو).',
      'شعار الحفاظ على الطبيعة : « Iḍarren deg lqaɛa, tiṭ ɣer yigenni, afus deg ufus i twennaḍt » (أقدامنا على الأرض وعيوننا نحو السماء يداً بيد لحماية بيئتنا).',
    ],
    keyFormulas: [
      { labelAr: 'نداء حماية البيئة', formulaAr: 'Neddukel i wakken ad neḥrez taganin d waman n tmurt-nneɣ ! (نتحد لحماية غابات ومياه وطننا)' },
    ],
    examplesAr: [
      {
        problem: 'ما هو اسم حيوان الفنك بالأمازيغية؟',
        solution: 'Awrɣ neɣ Akeɛbub n tneẓruft (الفنك ذو الأذنين الطويلتين والفراء الذهبي الجميل).',
      },
    ],
    interactiveTool: 'tamazight_lab',
    quiz: [
      {
        id: 'q1',
        questionAr: 'ما معنى كلمة « Igider » (ⵉⴳⵉⴷⴻⵔ) ؟',
        options: [
          { id: 'a', textAr: 'النسر / العقاب', isCorrect: true, explanationAr: 'أحسنت! Igider هو النسر المحلق في سماء جبال الأوراس وجرجرة الشامخة.' },
          { id: 'b', textAr: 'السمكة', isCorrect: false },
          { id: 'c', textAr: 'الأرنب', isCorrect: false },
        ],
      },
    ],
  },
];
