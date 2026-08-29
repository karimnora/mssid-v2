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

  'arabic-3ap-t1-nominal-verbal-sentences': pack('كَتَبَ التِّلْمِيذُ الفَرَضَ', [
    { word: 'كَتَبَ', correctTag: 'فعل ماضٍ', hint: 'الجملة فعلية لأنها تبدأ بفعل.' },
    { word: 'التِّلْمِيذُ', correctTag: 'فاعل', hint: 'من كتب؟' },
    { word: 'الفَرَضَ', correctTag: 'مفعول به', hint: 'ماذا كتب؟' },
  ]),
  'arabic-3ap-t1-demonstratives-expressions': pack('هَذَا قَلَمٌ', [
    { word: 'هَذَا', correctTag: 'مبتدأ', hint: 'اسم إشارة في محل مبتدأ.' },
    { word: 'قَلَمٌ', correctTag: 'خبر', hint: 'يخبر عن هذا.' },
  ]),
  'arabic-3ap-t2-singular-dual-plural': pack('فَتَحَ التِّلْمِيذَانِ النَّافِذَتَيْنِ', [
    { word: 'فَتَحَ', correctTag: 'فعل ماضٍ', hint: 'فعل ماضٍ.' },
    { word: 'التِّلْمِيذَانِ', correctTag: 'فاعل', hint: 'مثنى مرفوع بالألف.' },
    { word: 'النَّافِذَتَيْنِ', correctTag: 'مفعول به', hint: 'مثنى منصوب بالياء.' },
  ]),
  'arabic-3ap-t2-idafa-construct': pack('كِتَابُ التِّلْمِيذِ جَدِيدٌ', [
    { word: 'كِتَابُ', correctTag: 'مبتدأ', hint: 'مضاف مرفوع.' },
    { word: 'التِّلْمِيذِ', correctTag: 'اسم مجرور', hint: 'مضاف إليه مجرور.' },
    { word: 'جَدِيدٌ', correctTag: 'خبر', hint: 'خبر المبتدأ.' },
  ]),
  'arabic-3ap-t3-subject-object': pack('شَرِبَ الضَّيْفُ الحَلِيبَ', [
    { word: 'شَرِبَ', correctTag: 'فعل ماضٍ', hint: 'فعل ماضٍ.' },
    { word: 'الضَّيْفُ', correctTag: 'فاعل', hint: 'من شرب؟ مرفوع.' },
    { word: 'الحَلِيبَ', correctTag: 'مفعول به', hint: 'ماذا شرب؟ منصوب.' },
  ]),
  'arabic-3ap-t3-question-tools': pack('أَيْنَ جَلَسَ الضَّيْفُ؟', [
    { word: 'أَيْنَ', correctTag: 'اسم استفهام', hint: 'يسأل عن المكان.' },
    { word: 'جَلَسَ', correctTag: 'فعل ماضٍ', hint: 'فعل ماضٍ.' },
    { word: 'الضَّيْفُ', correctTag: 'فاعل', hint: 'من جلس؟' },
  ]),
  'arabic-3ap-t3-derived-words': pack('الكَاتِبُ يَكْتُبُ رِسَالَةً', [
    { word: 'الكَاتِبُ', correctTag: 'مبتدأ', hint: 'اسم فاعل من كتب.' },
    { word: 'يَكْتُبُ', correctTag: 'فعل مضارع', hint: 'فعل مضارع.' },
    { word: 'رِسَالَةً', correctTag: 'مفعول به', hint: 'ماذا يكتب؟' },
  ]),

  'arabic-4ap-parts-of-speech-sentences': pack('الجَوُّ صَحْوٌ فِي وَهْرَانَ', [
    { word: 'الجَوُّ', correctTag: 'مبتدأ', hint: 'اسم مرفوع بدأت به الجملة الاسمية.' },
    { word: 'صَحْوٌ', correctTag: 'خبر', hint: 'يخبر عن الجو.' },
    { word: 'فِي', correctTag: 'حرف جر', hint: 'حرف جر.' },
    { word: 'وَهْرَانَ', correctTag: 'اسم مجرور', hint: 'مجرور ممنوع من الصرف.' },
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
    { word: 'أَمِينٌ', correctTag: 'فاعل', hint: 'معطوف على سامي يتبعه في الرفع.' },
  ]),
  'arabic-4ap-kan-inna': pack('كَانَ البَحْرُ هَادِئاً', [
    { word: 'كَانَ', correctTag: 'فعل ماضٍ', hint: 'كان الناسخة.' },
    { word: 'البَحْرُ', correctTag: 'مبتدأ', hint: 'اسم كان مرفوع.' },
    { word: 'هَادِئاً', correctTag: 'خبر', hint: 'خبر كان منصوب.' },
  ]),
  'arabic-4ap-sifa-mawsuf': pack('قَرَأْتُ قِصَّةً مُمْتِعَةً', [
    { word: 'قَرَأْتُ', correctTag: 'فعل ماضٍ', hint: 'فعل ماضٍ والتاء فاعل.' },
    { word: 'قِصَّةً', correctTag: 'مفعول به', hint: 'مفعول به منصوب.' },
    { word: 'مُمْتِعَةً', correctTag: 'صفة (نعت)', hint: 'نعت يتبع القصة في النصب.' },
  ]),
  'arabic-4ap-asma-mawsula': pack('جَاءَ الَّذِي نَجَحَ', [
    { word: 'جَاءَ', correctTag: 'فعل ماضٍ', hint: 'فعل ماضٍ.' },
    { word: 'الَّذِي', correctTag: 'فاعل', hint: 'اسم موصول في محل فاعل.' },
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
  'arabic-4ap-verb-conjugation': pack('يَكْتُبُ الوَلَدُ وَيَكْتُبَانِ الوَلَدَانِ وَيَكْتُبُونَ الأَوْلَادُ', [
    { word: 'يَكْتُبُ', correctTag: 'مرفوع بالضمة', hint: 'فعل مضارع للغائب المفرد، علامة رفعه الضمة.' },
    { word: 'يَكْتُبَانِ', correctTag: 'مرفوع بثبوت النون', hint: 'فعل مضارع للغائبين (مثنى)، من الأفعال الخمسة.' },
    { word: 'يَكْتُبُونَ', correctTag: 'مرفوع بثبوت النون', hint: 'فعل مضارع لجماعة الغائبين، من الأفعال الخمسة.' },
  ]),
  'arabic-4ap-spelling-taa-hamza': pack('كَتَبَتْ المُعَلِّمَةُ', [
    { word: 'كَتَبَتْ', correctTag: 'تاء مفتوحة', hint: 'تاء الفعل، تبقى تاءً عند الوقف عليها.' },
    { word: 'المُعَلِّمَةُ', correctTag: 'تاء مربوطة', hint: 'اسم مؤنث، تُنطق هاءً عند الوقف عليها.' },
  ]),
  'arabic-4ap-hamza-mutawassita': pack('سَأَلَ التِّلْمِيذُ سُؤَالاً عَنْ فِئَةِ الحَيَوَانَاتِ', [
    { word: 'سَأَلَ', correctTag: 'همزة متوسطة على الألف', hint: 'أقوى الحركتين الفتحة، فكُتبت الهمزة على الألف.' },
    { word: 'سُؤَالاً', correctTag: 'همزة متوسطة على الواو', hint: 'قبلها ضمة، أقوى من الفتحة بعدها، فكُتبت على الواو.' },
    { word: 'فِئَةِ', correctTag: 'همزة متوسطة على النبرة', hint: 'قبلها كسرة، أقوى الحركات، فكُتبت على الياء (نبرة).' },
  ]),
};

export const ARABIC_CANVAS_2AP_DEFAULT = NAME_VERB_LETTER_2AP;

const LETTER_OR_SPELLING =
  /harakat|letters|madd|shadda|tanween|taa-|taa_open|hamza|lam-shamsiya|spelling/;

export function arabicCanvasPrefersDiacritics(lessonId: string, grade?: string): boolean {
  if (grade === '1AP') return lessonId.includes('harakat');
  return LETTER_OR_SPELLING.test(lessonId);
}
