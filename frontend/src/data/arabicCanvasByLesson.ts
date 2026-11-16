/** Per-lesson grammar sentence for arabic_canvas — not the two global 4AP/5AP phrases. */
export type CanvasGrammarWord = {
  id: string;
  word: string;
  correctTag: string;
  hint: string;
};

export type CanvasGrammarSentence = {
  sentence: string;
  words: CanvasGrammarWord[];
};

function pack(sentence: string, words: Omit<CanvasGrammarWord, 'id'>[]): CanvasGrammarSentence {
  return { sentence, words: words.map((w, i) => ({ ...w, id: `w${i + 1}` })) };
}

const NAME_VERB_LETTER_2AP = pack('يَلْعَبُ الوَلَدُ فِي السَّاحَةِ', [
  { word: 'يَلْعَبُ', correctTag: 'فعل', hint: 'يدل على حدث: نلعب، يلعب، لعبت.' },
  { word: 'الوَلَدُ', correctTag: 'اسم', hint: 'يدل على إنسان. يمكن إدخال ال.' },
  { word: 'فِي', correctTag: 'حرف', hint: 'لا اسم ولا فعل. يربط الكلمتين.' },
  { word: 'السَّاحَةِ', correctTag: 'اسم', hint: 'مكان. اسم مجرور هنا لكن في 2AP نقول: اسم فقط.' },
]);

export const ARABIC_CANVAS_BY_LESSON: Record<string, CanvasGrammarSentence> = {
  'arabic-2ap-t1-family-school-demonstratives': pack('هَذَا قَلَمٌ وَهَذِهِ مِمْحَاةٌ', [
    { word: 'هَذَا', correctTag: 'اسم', hint: 'اسم إشارة للمذكر.' },
    { word: 'قَلَمٌ', correctTag: 'اسم', hint: 'شيء نكتبه به.' },
    { word: 'وَ', correctTag: 'حرف', hint: 'حرف عطف.' },
    { word: 'هَذِهِ', correctTag: 'اسم', hint: 'اسم إشارة للمؤنث.' },
    { word: 'مِمْحَاةٌ', correctTag: 'اسم', hint: 'شيء نمسح به.' },
  ]),
  'arabic-2ap-t2-personal-pronouns': pack('أَنَا تِلْمِيذٌ وَنَحْنُ تَلَامِيذُ', [
    { word: 'أَنَا', correctTag: 'اسم', hint: 'ضمير المتكلم المفرد — اسم.' },
    { word: 'تِلْمِيذٌ', correctTag: 'اسم', hint: 'يدل على شخص.' },
    { word: 'وَ', correctTag: 'حرف', hint: 'حرف عطف.' },
    { word: 'نَحْنُ', correctTag: 'اسم', hint: 'ضمير المتكلم الجمع.' },
    { word: 'تَلَامِيذُ', correctTag: 'اسم', hint: 'جمع تلميذ.' },
  ]),
  'arabic-2ap-t2-time-place-words': pack('جَلَسَ الطِّفْلُ أَمَامَ البَابِ', [
    { word: 'جَلَسَ', correctTag: 'فعل', hint: 'حدث في الماضي.' },
    { word: 'الطِّفْلُ', correctTag: 'اسم', hint: 'من جلس؟' },
    { word: 'أَمَامَ', correctTag: 'اسم', hint: 'ظرف مكان — في 2AP نعدّه اسماً.' },
    { word: 'البَابِ', correctTag: 'اسم', hint: 'مكان.' },
  ]),
  'arabic-2ap-t3-nature-nutrition-play': pack('أَكَلَ الوَلَدُ تُفَّاحَةً', [
    { word: 'أَكَلَ', correctTag: 'فعل', hint: 'حدث الأكل.' },
    { word: 'الوَلَدُ', correctTag: 'اسم', hint: 'من أكل؟' },
    { word: 'تُفَّاحَةً', correctTag: 'اسم', hint: 'ماذا أكل؟' },
  ]),
  'arabic-2ap-t3-question-words-conjunctions': pack('هَلْ كَتَبَ سَامِي الدَّرْسَ؟', [
    { word: 'هَلْ', correctTag: 'حرف', hint: 'حرف استفهام.' },
    { word: 'كَتَبَ', correctTag: 'فعل', hint: 'حدث الكتابة.' },
    { word: 'سَامِي', correctTag: 'اسم', hint: 'من كتب؟' },
    { word: 'الدَّرْسَ', correctTag: 'اسم', hint: 'ماذا كتب؟' },
  ]),
  'arabic-2ap-t2-lam-shamsiya-qamariya': pack('الشَّمْسُ حَارَّةٌ وَالقَمَرُ مُنِيرٌ وَالنَّهْرُ صَافٍ وَالبَيْتُ كَبِيرٌ', [
    { word: 'الشَّمْسُ', correctTag: 'لام شمسية', hint: 'الشين من الحروف الشمسية: اللام تُكتب ولا تُنطق، وتُدغم في الشين.' },
    { word: 'القَمَرُ', correctTag: 'لام قمرية', hint: 'القاف من الحروف القمرية: اللام تُنطق بوضوح.' },
    { word: 'النَّهْرُ', correctTag: 'لام شمسية', hint: 'النون من الحروف الشمسية: اللام لا تُنطق.' },
    { word: 'البَيْتُ', correctTag: 'لام قمرية', hint: 'الباء من الحروف القمرية: اللام تُنطق بوضوح.' },
  ]),
  'arabic-2ap-t2-tanween-three-types': pack('شَرِبَ الوَلَدُ حَلِيبًا لَذِيذًا وَأَكَلَ تُفَّاحَةٌ حَمْرَاءُ فِي بَيْتٍ جَمِيلٍ', [
    { word: 'حَلِيبًا', correctTag: 'تنوين الفتح', hint: 'فتحتان في آخر الكلمة، صوته "أَنْ"، ويُكتب غالباً بألف.' },
    { word: 'تُفَّاحَةٌ', correctTag: 'تنوين الضم', hint: 'ضمتان في آخر الكلمة، صوته "أُنْ".' },
    { word: 'بَيْتٍ', correctTag: 'تنوين الكسر', hint: 'كسرتان في آخر الكلمة، صوته "إِنْ"، يأتي غالباً بعد حرف جر.' },
  ]),
  'arabic-2ap-t3-taa-marbouta-maftouha': pack('كَتَبَتِ المُعَلِّمَةُ قِصَّةً جَمِيلَةً فِي البَيْتِ', [
    { word: 'كَتَبَتِ', correctTag: 'تاء مفتوحة', hint: 'تاء الفعل، تُنطق تاءً دائماً ولا تتحول هاءً عند الوقف.' },
    { word: 'المُعَلِّمَةُ', correctTag: 'تاء مربوطة', hint: 'تاء في آخر اسم مؤنث، تُنطق هاءً عند الوقف عليها.' },
    { word: 'قِصَّةً', correctTag: 'تاء مربوطة', hint: 'اسم مؤنث ينتهي بتاء مربوطة، تُنطق هاءً عند الوقف.' },
    { word: 'البَيْتِ', correctTag: 'تاء مفتوحة', hint: 'تاء أصلية من جذر الكلمة (ب-ي-ت)، وليست تاء تأنيث، فهي مفتوحة دائماً.' },
  ]),
  'arabic-2ap-t3-gender-number': pack('التِّلْمِيذُ مُجْتَهِدٌ وَالتِّلْمِيذَةُ مُجْتَهِدَةٌ وَالتَّلَامِيذُ مُجْتَهِدُونَ وَالتِّلْمِيذَاتُ مُجْتَهِدَاتٌ', [
    { word: 'التِّلْمِيذُ', correctTag: 'مذكر مفرد', hint: 'اسم مذكر يدل على شخص واحد، نشير إليه بـ"هذا".' },
    { word: 'التِّلْمِيذَةُ', correctTag: 'مؤنث مفرد', hint: 'تاء مربوطة في الآخر، نشير إليه بـ"هذه".' },
    { word: 'التَّلَامِيذُ', correctTag: 'مذكر جمع', hint: 'يدل على أكثر من تلميذ واحد (ذكور).' },
    { word: 'التِّلْمِيذَاتُ', correctTag: 'مؤنث جمع', hint: 'ألف وتاء في الآخر، يدل على أكثر من تلميذة واحدة.' },
  ]),

  'arabic-3ap-t1-nominal-verbal-sentences': pack('كَتَبَ التِّلْمِيذُ الفَرَضَ', [
    { word: 'كَتَبَ', correctTag: 'فعل ماضٍ', hint: 'الجملة فعلية لأنها تبدأ بفعل.' },
    { word: 'التِّلْمِيذُ', correctTag: 'مَنْ قَامَ بِالفِعْلِ؟', hint: 'من كتب؟' },
    { word: 'الفَرَضَ', correctTag: 'عَلَى مَاذَا وَقَعَ الفِعْلُ؟', hint: 'ماذا كتب؟' },
  ]),
  'arabic-3ap-t1-demonstratives-expressions': pack('هَذَا قَلَمٌ', [
    { word: 'هَذَا', correctTag: 'مبتدأ', hint: 'اسم إشارة في محل مبتدأ.' },
    { word: 'قَلَمٌ', correctTag: 'خبر', hint: 'يخبر عن هذا.' },
  ]),
  'arabic-3ap-t2-singular-dual-plural': pack('فَتَحَ التِّلْمِيذَانِ النَّافِذَتَيْنِ', [
    { word: 'فَتَحَ', correctTag: 'فعل ماضٍ', hint: 'فعل ماضٍ.' },
    { word: 'التِّلْمِيذَانِ', correctTag: 'مَنْ قَامَ بِالفِعْلِ؟', hint: 'مثنى ينتهي بـ (انِ).' },
    { word: 'النَّافِذَتَيْنِ', correctTag: 'عَلَى مَاذَا وَقَعَ الفِعْلُ؟', hint: 'مثنى ينتهي بـ (يْنِ).' },
  ]),
  'arabic-3ap-t2-idafa-construct': pack('كِتَابُ التِّلْمِيذِ جَدِيدٌ', [
    { word: 'كِتَابُ', correctTag: 'مضاف', hint: 'مضاف مرفوع.' },
    { word: 'التِّلْمِيذِ', correctTag: 'مضاف إليه', hint: 'مضاف إليه مجرور.' },
    { word: 'جَدِيدٌ', correctTag: 'خبر', hint: 'خبر المبتدأ.' },
  ]),
  'arabic-3ap-t3-subject-object': pack('شَرِبَ الضَّيْفُ الحَلِيبَ', [
    { word: 'شَرِبَ', correctTag: 'فعل ماضٍ', hint: 'فعل ماضٍ.' },
    { word: 'الضَّيْفُ', correctTag: 'مَنْ قَامَ بِالفِعْلِ؟', hint: 'من شرب؟' },
    { word: 'الحَلِيبَ', correctTag: 'عَلَى مَاذَا وَقَعَ الفِعْلُ؟', hint: 'ماذا شرب؟' },
  ]),
  'arabic-3ap-t3-question-tools': pack('أَيْنَ جَلَسَ الضَّيْفُ؟', [
    { word: 'أَيْنَ', correctTag: 'اسم استفهام', hint: 'يسأل عن المكان.' },
    { word: 'جَلَسَ', correctTag: 'فعل ماضٍ', hint: 'فعل ماضٍ.' },
    { word: 'الضَّيْفُ', correctTag: 'فاعل', hint: 'من جلس؟' },
  ]),
  'arabic-3ap-t3-derived-words': pack('كَتَبَ الكَاتِبُ مَكْتُوباً فِي المَكْتَبَةِ', [
    { word: 'كَتَبَ', correctTag: 'فعل', hint: 'الفعل الأصلي في عائلة الكلمة (الجذر: ك-ت-ب).' },
    { word: 'الكَاتِبُ', correctTag: 'اسم فاعل', hint: 'من قام بالكتابة — اسم فاعل من نفس الجذر.' },
    { word: 'مَكْتُوباً', correctTag: 'اسم مفعول', hint: 'ما وقعت عليه الكتابة — اسم مفعول من نفس الجذر.' },
    { word: 'المَكْتَبَةِ', correctTag: 'اسم مكان', hint: 'مكان الكتب — اسم مكان من نفس الجذر.' },
  ]),

  'arabic-4ap-parts-of-speech-sentences': pack('يَغْرِسُ الفَلَّاحُ الشَّجَرَةَ', [
    { word: 'يَغْرِسُ', correctTag: 'فعل مضارع', hint: 'فعل مضارع مرفوع تبدأ به الجملة الفعلية.' },
    { word: 'الفَلَّاحُ', correctTag: 'فاعل', hint: 'من يغرس؟ فاعل مرفوع.' },
    { word: 'الشَّجَرَةَ', correctTag: 'مفعول به', hint: 'ماذا يغرس؟ مفعول به منصوب.' },
  ]),
  'arabic-4ap-fail-maf3ul-irab': pack('زَرَعَ الفَلَّاحُ القَمْحَ', [
    { word: 'زَرَعَ', correctTag: 'فعل ماضٍ', hint: 'فعل ماضٍ مبني.' },
    { word: 'الفَلَّاحُ', correctTag: 'فاعل', hint: 'من زرع؟ مرفوع بالضمة.' },
    { word: 'القَمْحَ', correctTag: 'مفعول به', hint: 'ماذا زرع؟ منصوب بالفتحة.' },
  ]),
  'arabic-4ap-huruf-atf': pack('جَاءَ سَامِي وَأَمِينٌ', [
    { word: 'جَاءَ', correctTag: 'فعل ماضٍ', hint: 'فعل ماضٍ.' },
    { word: 'سَامِي', correctTag: 'فاعل', hint: 'فاعل مرفوع.' },
    { word: 'وَ', correctTag: 'حرف عطف', hint: 'حرف عطف يتبع المعطوف المعطوف عليه في الحركة.' },
    { word: 'أَمِينٌ', correctTag: 'معطوف', hint: 'معطوف على سامي يتبعه في الرفع.' },
  ]),
  'arabic-4ap-kan-inna': pack('كَانَ البَحْرُ هَادِئاً', [
    { word: 'كَانَ', correctTag: 'فعل ماضٍ', hint: 'كان الناسخة.' },
    { word: 'البَحْرُ', correctTag: 'اسم كان', hint: 'اسم كان مرفوع.' },
    { word: 'هَادِئاً', correctTag: 'خبر كان', hint: 'خبر كان منصوب.' },
  ]),
  'arabic-4ap-sifa-mawsuf': pack('قَرَأْتُ قِصَّةً مُمْتِعَةً', [
    { word: 'قَرَأْتُ', correctTag: 'فعل ماضٍ', hint: 'فعل ماضٍ والتاء فاعل.' },
    { word: 'قِصَّةً', correctTag: 'مفعول به', hint: 'مفعول به منصوب.' },
    { word: 'مُمْتِعَةً', correctTag: 'صفة (نعت)', hint: 'نعت يتبع القصة في النصب.' },
  ]),
  'arabic-4ap-asma-mawsula': pack('جَاءَ الَّذِي نَجَحَ', [
    { word: 'جَاءَ', correctTag: 'فعل ماضٍ', hint: 'فعل ماضٍ.' },
    { word: 'الَّذِي', correctTag: 'اسم موصول (في محل رفع فاعل)', hint: 'اسم موصول في محل فاعل.' },
    { word: 'نَجَحَ', correctTag: 'فعل ماضٍ', hint: 'صلة الموصول.' },
  ]),
  'arabic-4ap-written-production': pack('المَدْرَسَةُ بَيْتُ العِلْمِ', [
    { word: 'المَدْرَسَةُ', correctTag: 'مبتدأ', hint: 'مبتدأ مرفوع.' },
    { word: 'بَيْتُ', correctTag: 'خبر', hint: 'خبر مرفوع وهو مضاف.' },
    { word: 'العِلْمِ', correctTag: 'اسم مجرور', hint: 'مضاف إليه.' },
  ]),

  'arabic-3ap-t1-conjugation-past-present': pack('أَنَا أَكْتُبُ وَأَنْتَ كَتَبْتَ', [
    { word: 'أَنَا', correctTag: 'ضمير متكلم', hint: 'ضمير للمتكلم المفرد.' },
    { word: 'أَكْتُبُ', correctTag: 'فعل مضارع', hint: 'يدل على حدث في الحاضر، مع ضمير المتكلم.' },
    { word: 'أَنْتَ', correctTag: 'ضمير مخاطب', hint: 'ضمير للمخاطب المذكر.' },
    { word: 'كَتَبْتَ', correctTag: 'فعل ماضٍ', hint: 'يدل على حدث انتهى، مع ضمير المخاطب.' },
  ]),
  'arabic-3ap-t1-ta-open-closed': pack('كَتَبَتِ البِنْتُ القِصَّةَ تَحْتَ الشَّجَرَةِ', [
    { word: 'كَتَبَتِ', correctTag: 'تاء مفتوحة', hint: 'تاء الفعل، تُنطق تاءً دائماً حتى عند الوقف.' },
    { word: 'البِنْتُ', correctTag: 'لام قمرية', hint: 'الباء من حروف اللام القمرية: اللام تُنطق.' },
    { word: 'القِصَّةَ', correctTag: 'تاء مربوطة', hint: 'اسم مؤنث، تُنطق هاءً عند الوقف عليه.' },
    { word: 'الشَّجَرَةِ', correctTag: 'لام شمسية', hint: 'الشين من حروف اللام الشمسية: اللام لا تُنطق وتُدغم.' },
  ]),
  'arabic-3ap-t2-imperative-prohibition': pack('يَا وَلَدُ اُكْتُبِ الدَّرْسَ وَلَا تَلْعَبْ', [
    { word: 'يَا', correctTag: 'أداة نداء', hint: 'تُستعمل لنداء شخص.' },
    { word: 'وَلَدُ', correctTag: 'منادى', hint: 'الاسم الذي نناديه.' },
    { word: 'اُكْتُبِ', correctTag: 'فعل أمر', hint: 'يطلب القيام بعمل.' },
    { word: 'لَا', correctTag: 'لا الناهية', hint: 'تجزم الفعل المضارع وتفيد النهي.' },
    { word: 'تَلْعَبْ', correctTag: 'فعل مضارع مجزوم', hint: 'مجزوم بلا الناهية، علامة جزمه السكون.' },
  ]),
  'arabic-3ap-t2-hamza-waal': pack('اِنْتَظَرَ أَحْمَدُ وَسَأَلَ', [
    { word: 'اِنْتَظَرَ', correctTag: 'همزة وصل', hint: 'فعل ماضٍ من فعل خماسي، يبدأ دائماً بهمزة وصل.' },
    { word: 'أَحْمَدُ', correctTag: 'همزة قطع', hint: 'اسم علم، همزته همزة قطع تُنطق دائماً.' },
    { word: 'وَ', correctTag: 'حرف عطف', hint: 'يربط بين الفعلين.' },
    { word: 'سَأَلَ', correctTag: 'همزة متوسطة على الألف', hint: 'توسّطت الهمزة الكلمة بعد فتحة فكُتبت على الألف.' },
  ]),

  'arabic-4ap-verb-mu3tal': pack('وَعَدَ الوَلَدُ وَقَالَ الحَقَّ وَدَعَا صَدِيقَهُ وَرَوَى قِصَّةً', [
    { word: 'وَعَدَ', correctTag: 'فعل مثال', hint: 'حرف العلة (الواو) في أول الفعل.' },
    { word: 'قَالَ', correctTag: 'فعل أجوف', hint: 'حرف العلة في وسط الفعل (أصله قَوَلَ).' },
    { word: 'دَعَا', correctTag: 'فعل ناقص', hint: 'حرف العلة في آخر الفعل.' },
    { word: 'رَوَى', correctTag: 'فعل لفيف', hint: 'يحتوي على حرفي علة متتاليين (الواو والياء).' },
  ]),
  'arabic-4ap-verb-conjugation': pack('هُوَ يَكْتُبُ وَهُمَا يَكْتُبَانِ وَهُمْ يَكْتُبُونَ', [
    { word: 'يَكْتُبُ', correctTag: 'فعل مضارع مفرد', hint: 'فعل مضارع مع ضمير الغائب المفرد (هو)، علامة رفعه الضمة.' },
    { word: 'يَكْتُبَانِ', correctTag: 'فعل مضارع مثنى (من الأفعال الخمسة)', hint: 'فعل مضارع مع ضمير الغائبين (هما)، من الأفعال الخمسة، علامة رفعه ثبوت النون.' },
    { word: 'يَكْتُبُونَ', correctTag: 'فعل مضارع جمع (من الأفعال الخمسة)', hint: 'فعل مضارع مع ضمير جماعة الغائبين (هم)، من الأفعال الخمسة، علامة رفعه ثبوت النون.' },
  ]),
  'arabic-4ap-spelling-taa-hamza': pack('كَتَبَتِ المُعَلِّمَةُ', [
    { word: 'كَتَبَتْ', correctTag: 'تاء مفتوحة', hint: 'تاء الفعل، تبقى تاءً عند الوقف عليها.' },
    { word: 'المُعَلِّمَةُ', correctTag: 'تاء مربوطة', hint: 'اسم مؤنث، تُنطق هاءً عند الوقف عليها.' },
  ]),
  'arabic-4ap-hamza-mutawassita': pack('سَأَلَ التِّلْمِيذُ سُؤَالاً عَنْ فِئَةِ الحَيَوَانَاتِ', [
    { word: 'سَأَلَ', correctTag: 'همزة متوسطة على الألف', hint: 'أقوى الحركتين الفتحة، فكُتبت الهمزة على الألف.' },
    { word: 'سُؤَالاً', correctTag: 'همزة متوسطة على الواو', hint: 'قبلها ضمة، أقوى من الفتحة بعدها، فكُتبت على الواو.' },
    { word: 'فِئَةِ', correctTag: 'همزة متوسطة على النبرة', hint: 'قبلها كسرة، أقوى الحركات، فكُتبت على الياء (نبرة).' },
  ]),

  'arabic-5ap-bare-augmented-participles': pack('كَتَبَ الكَاتِبُ نَصّاً مَكْتُوباً ثُمَّ اسْتَخْرَجَ خُلَاصَةً', [
    { word: 'كَتَبَ', correctTag: 'فعل مجرد', hint: 'فعل ثلاثي أصوله (ك، ت، ب) فقط، بلا حرف زائد.' },
    { word: 'الكَاتِبُ', correctTag: 'اسم فاعل', hint: 'من قام بالكتابة. من الثلاثي على وزن «فاعل» (كتب ➔ كاتب).' },
    { word: 'مَكْتُوباً', correctTag: 'اسم مفعول', hint: 'ما وقعت عليه الكتابة. من الثلاثي على وزن «مفعول» (كتب ➔ مكتوب).' },
    { word: 'اسْتَخْرَجَ', correctTag: 'فعل مزيد', hint: 'زيد عن أصله الثلاثي «خَرَجَ» بثلاثة أحرف (ا، س، ت).' },
  ]),

  'arabic-5ap-spelling-taas': pack('سَافَرَتِ المُمَرِّضَاتُ فِي وَقْتٍ مُبَكِّرٍ إِلَى القَرْيَةِ', [
    { word: 'سَافَرَتِ', correctTag: 'تاء مفتوحة', hint: 'فعل ماضٍ — الأفعال تُكتب دائماً بتاء مفتوحة.' },
    { word: 'المُمَرِّضَاتُ', correctTag: 'تاء مفتوحة', hint: 'جمع مؤنث سالم، ينتهي دائماً بتاء مفتوحة.' },
    { word: 'وَقْتٍ', correctTag: 'تاء مفتوحة', hint: 'اسم ثلاثي ساكن الوسط (و-ق-ت)، فتُكتب تاؤه مفتوحة.' },
    { word: 'القَرْيَةِ', correctTag: 'تاء مربوطة', hint: 'اسم مفرد مؤنث، تُنطق هاءً عند الوقف عليه.' },
  ]),

  'arabic-5ap-spelling-hamzas': pack('أَكَلَ أُسْتَاذٌ عِنْدَ الشَّاطِئِ ثُمَّ سُئِلَ عَنِ اسْمِهِ', [
    { word: 'أَكَلَ', correctTag: 'همزة قطع', hint: 'تُرسم وتُنطق دائماً، ولا تسقط في درج الكلام.' },
    { word: 'أُسْتَاذٌ', correctTag: 'همزة قطع', hint: 'اسم همزته همزة قطع تُرسم وتُنطق دائماً.' },
    { word: 'الشَّاطِئِ', correctTag: 'همزة متطرفة على الياء', hint: 'الحرف الذي قبل الهمزة (الطاء) مكسور، فتُرسم على الياء (النبرة).' },
    { word: 'سُئِلَ', correctTag: 'همزة متوسطة على الياء', hint: 'كسرة الهمزة أقوى من ضمة ما قبلها في سُلّم قوة الحركات، فكُتبت على الياء.' },
    { word: 'اسْمِهِ', correctTag: 'همزة وصل', hint: 'تُرسم ألفاً بلا همزة وتسقط نطقاً في درج الكلام.' },
  ]),
};

export const ARABIC_CANVAS_2AP_DEFAULT = NAME_VERB_LETTER_2AP;

const LETTER_OR_SPELLING =
  /harakat|letters|madd|shadda|tanween|taa-|taa_open|hamza|lam-shamsiya|spelling/;

export function arabicCanvasPrefersDiacritics(lessonId: string, grade?: string): boolean {
  if (grade === '1AP') return lessonId.includes('harakat');
  return LETTER_OR_SPELLING.test(lessonId);
}
