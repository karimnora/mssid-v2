import { describe, it, expect } from 'vitest';
import { COURSES_DATA } from './coursesData';

describe('5AP Mathematics Pedagogical Curriculum Tests', () => {
  const math5apLessons = COURSES_DATA.filter(
    (course) => course.grade === '5AP' && course.subject === 'math'
  );

  it('should contain lessons for all 4 official 5AP domains', () => {
    expect(math5apLessons.length).toBeGreaterThanOrEqual(10);

    const categories = new Set(math5apLessons.map((l) => l.categoryAr));
    expect(categories.has('الأعداد والحساب')).toBe(true);
    expect(categories.has('المقادير والقياس')).toBe(true);
    expect(categories.has('الهندسة والفضاء')).toBe(true);
    expect(categories.has('التناسبية وتنظيم المعطيات')).toBe(true);
  });

  it('every lesson should have a clear course sheet with summary and rules', () => {
    math5apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('every lesson should have solved situation-problems (examplesAr)', () => {
    math5apLessons.forEach((lesson) => {
      expect(lesson.examplesAr).toBeDefined();
      expect(lesson.examplesAr!.length).toBeGreaterThanOrEqual(1);

      lesson.examplesAr!.forEach((ex) => {
        expect(ex.problem).toBeTruthy();
        expect(ex.solution).toBeTruthy();
      });
    });
  });

  it('every lesson should have an interactive quiz with correct options and explanations', () => {
    math5apLessons.forEach((lesson) => {
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);

      lesson.quiz.forEach((q) => {
        expect(q.questionAr).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(2);

        const correctOptions = q.options.filter((opt) => opt.isCorrect);
        expect(correctOptions.length).toBe(1);

        const correctOpt = correctOptions[0];
        expect(correctOpt.explanationAr).toBeTruthy();
      });
    });
  });
});

describe('4AP Mathematics Pedagogical Curriculum Tests', () => {
  const math4apLessons = COURSES_DATA.filter(
    (course) => course.grade === '4AP' && course.subject === 'math'
  );

  it('should contain lessons covering 4AP official Algerian curriculum domains', () => {
    expect(math4apLessons.length).toBeGreaterThanOrEqual(8);

    const categories = new Set(math4apLessons.map((l) => l.categoryAr));
    expect(categories.has('الأعداد والحساب')).toBe(true);
    expect(categories.has('المقادير والقياس')).toBe(true);
    expect(categories.has('الهندسة والفضاء')).toBe(true);
    expect(categories.has('تنظيم المعطيات والتناسبية')).toBe(true);
  });

  it('every 4AP lesson should have summary, rules, key formulas and interactive tool', () => {
    math4apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(3);
      expect(lesson.keyFormulas).toBeDefined();
      expect(lesson.keyFormulas!.length).toBeGreaterThanOrEqual(1);
      expect(lesson.interactiveTool).toBeTruthy();
    });
  });

  it('every 4AP lesson should have solved situation-problems and QCM quizzes with explanations', () => {
    math4apLessons.forEach((lesson) => {
      expect(lesson.examplesAr).toBeDefined();
      expect(lesson.examplesAr!.length).toBeGreaterThanOrEqual(1);

      lesson.examplesAr!.forEach((ex) => {
        expect(ex.problem).toBeTruthy();
        expect(ex.solution).toBeTruthy();
      });

      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);
      lesson.quiz.forEach((q) => {
        expect(q.questionAr).toBeTruthy();
        const correctOptions = q.options.filter((opt) => opt.isCorrect);
        expect(correctOptions.length).toBe(1);
        expect(correctOptions[0].explanationAr).toBeTruthy();
      });
    });
  });
});

describe('4AP French (Langue Française) Pedagogical Curriculum Tests', () => {
  const french4apLessons = COURSES_DATA.filter(
    (course) => course.grade === '4AP' && course.subject === 'french'
  );

  it('should contain lessons covering 4AP official Algerian 2nd Generation curriculum projects', () => {
    expect(french4apLessons.length).toBeGreaterThanOrEqual(6);

    const categories = new Set(french4apLessons.map((l) => l.categoryAr));
    expect(categories.has('Projet 1 : C\'est notre quartier ! - Séquence 1')).toBe(true);
    expect(categories.has('Projet 1 : C\'est notre quartier ! - Séquence 2')).toBe(true);
    expect(categories.has('Projet 2 : C\'est un grand événement ! - Séquence 1')).toBe(true);
    expect(categories.has('Projet 2 : C\'est un grand événement ! - Séquence 2')).toBe(true);
    expect(categories.has('Projet 3 : À la mer / Dans la nature - Séquence 1')).toBe(true);
    expect(categories.has('Projet 3 : À la mer / Dans la nature - Séquence 2')).toBe(true);
  });

  it('every 4AP French lesson should have summary, rules, key formulas and interactive tool', () => {
    french4apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(3);
      expect(lesson.keyFormulas).toBeDefined();
      expect(lesson.keyFormulas!.length).toBeGreaterThanOrEqual(1);
      expect(lesson.interactiveTool).toBe('french_lab');
    });
  });

  it('every 4AP French lesson should have solved examples and QCM quizzes with explanations', () => {
    french4apLessons.forEach((lesson) => {
      expect(lesson.examplesAr).toBeDefined();
      expect(lesson.examplesAr!.length).toBeGreaterThanOrEqual(1);

      lesson.examplesAr!.forEach((ex) => {
        expect(ex.problem).toBeTruthy();
        expect(ex.solution).toBeTruthy();
      });

      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);
      lesson.quiz.forEach((q) => {
        expect(q.questionAr).toBeTruthy();
        const correctOptions = q.options.filter((opt) => opt.isCorrect);
        expect(correctOptions.length).toBe(1);
        expect(correctOptions[0].explanationAr).toBeTruthy();
      });
    });
  });
});

describe('4AP English Language (اللغة الإنجليزية) Pedagogical Curriculum Tests', () => {
  const english4apLessons = COURSES_DATA.filter(
    (course) => course.grade === '4AP' && course.subject === 'english'
  );

  it('should contain lessons covering 4AP official Algerian 2nd Generation units', () => {
    expect(english4apLessons.length).toBeGreaterThanOrEqual(6);

    const categories = new Set(english4apLessons.map((l) => l.categoryAr));
    expect(categories.has('Unit 1: Family & Friends')).toBe(true);
    expect(categories.has('Unit 2: School & Classroom')).toBe(true);
    expect(categories.has('Unit 3: My Home & Rooms')).toBe(true);
    expect(categories.has('Unit 4: Food & Meals')).toBe(true);
    expect(categories.has('Unit 5: Pets & Animals')).toBe(true);
    expect(categories.has('Unit 6: Games & Hobbies')).toBe(true);
  });

  it('every 4AP English lesson should have summary, rules, key formulas and english_lab tool', () => {
    english4apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(3);
      expect(lesson.keyFormulas).toBeDefined();
      expect(lesson.keyFormulas!.length).toBeGreaterThanOrEqual(1);
      expect(lesson.interactiveTool).toBe('english_lab');
    });
  });

  it('every 4AP English lesson should have solved examples and QCM quizzes with explanations', () => {
    english4apLessons.forEach((lesson) => {
      expect(lesson.examplesAr).toBeDefined();
      expect(lesson.examplesAr!.length).toBeGreaterThanOrEqual(1);

      lesson.examplesAr!.forEach((ex) => {
        expect(ex.problem).toBeTruthy();
        expect(ex.solution).toBeTruthy();
      });

      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);
      lesson.quiz.forEach((q) => {
        expect(q.questionAr).toBeTruthy();
        const correctOptions = q.options.filter((opt) => opt.isCorrect);
        expect(correctOptions.length).toBe(1);
        expect(correctOptions[0].explanationAr).toBeTruthy();
      });
    });
  });
});

describe('4AP Arabic Language (اللغة العربية) Pedagogical Curriculum Tests', () => {
  const arabic4apLessons = COURSES_DATA.filter(
    (course) => course.grade === '4AP' && course.subject === 'arabic'
  );

  it('should contain lessons covering 4AP official Algerian curriculum domains', () => {
    expect(arabic4apLessons.length).toBeGreaterThanOrEqual(7);

    const categories = new Set(arabic4apLessons.map((l) => l.categoryAr));
    expect(categories.has('التراكيب النحوية')).toBe(true);
    expect(categories.has('الصرف والتحويل')).toBe(true);
    expect(categories.has('الإملاء والخط')).toBe(true);
    expect(categories.has('التعبير والإنتاج الكتابي')).toBe(true);
  });

  it('every 4AP Arabic lesson should have summary, rules, key formulas and interactive tool', () => {
    arabic4apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(3);
      expect(lesson.keyFormulas).toBeDefined();
      expect(lesson.keyFormulas!.length).toBeGreaterThanOrEqual(1);
      expect(lesson.interactiveTool).toBeTruthy();
    });
  });

  it('every 4AP Arabic lesson should have solved situation-problems and QCM quizzes with explanations', () => {
    arabic4apLessons.forEach((lesson) => {
      expect(lesson.examplesAr).toBeDefined();
      expect(lesson.examplesAr!.length).toBeGreaterThanOrEqual(1);

      lesson.examplesAr!.forEach((ex) => {
        expect(ex.problem).toBeTruthy();
        expect(ex.solution).toBeTruthy();
      });

      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);
      lesson.quiz.forEach((q) => {
        expect(q.questionAr).toBeTruthy();
        const correctOptions = q.options.filter((opt) => opt.isCorrect);
        expect(correctOptions.length).toBe(1);
        expect(correctOptions[0].explanationAr).toBeTruthy();
      });
    });
  });
});

describe('5AP Arabic Language (اللغة العربية) Pedagogical Curriculum Tests', () => {
  const arabic5apLessons = COURSES_DATA.filter(
    (course) => course.grade === '5AP' && course.subject === 'arabic'
  );

  it('should cover all main official domains: Grammar, Morphology, Orthography, and Integration', () => {
    expect(arabic5apLessons.length).toBeGreaterThanOrEqual(8);

    const categories = new Set(arabic5apLessons.map((l) => l.categoryAr));
    expect(categories.has('التراكيب النحوية')).toBe(true);
    expect(categories.has('الصرف والتصريف')).toBe(true);
    expect(categories.has('الإملاء والظواهر اللغوية')).toBe(true);
    expect(categories.has('التعبير الكتابي والأنماط النصوصية')).toBe(true);
  });

  it('every Arabic lesson should feature Tashkeel vocalised rules and examples', () => {
    arabic5apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(2);

      // Check that rules contain Arabic diacritical marks (Tashkeel)
      const hasDiacritics = lesson.rulesAr.some((rule) => /[\u064B-\u0652]/.test(rule));
      expect(hasDiacritics).toBe(true);
    });
  });

  it('every Arabic lesson should include a solved integration situation or parsing model', () => {
    arabic5apLessons.forEach((lesson) => {
      expect(lesson.examplesAr).toBeDefined();
      expect(lesson.examplesAr!.length).toBeGreaterThanOrEqual(1);

      lesson.examplesAr!.forEach((ex) => {
        expect(ex.problem).toBeTruthy();
        expect(ex.solution).toBeTruthy();
      });
    });
  });

  it('every Arabic lesson should contain interactive QCM quizzes with explanations', () => {
    arabic5apLessons.forEach((lesson) => {
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);

      lesson.quiz.forEach((q) => {
        expect(q.questionAr).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(2);

        const correctOptions = q.options.filter((opt) => opt.isCorrect);
        expect(correctOptions.length).toBe(1);

        const correctOpt = correctOptions[0];
        expect(correctOpt.explanationAr).toBeTruthy();
      });
    });
  });
});

describe('5AP Sciences et Technologie (التربية العلمية والتكنولوجية) Pedagogical Curriculum Tests', () => {
  const science5apLessons = COURSES_DATA.filter(
    (course) => course.grade === '5AP' && course.subject === 'science'
  );

  it('should contain lessons for all official 5AP Science domains', () => {
    expect(science5apLessons.length).toBeGreaterThanOrEqual(10);

    const categories = new Set(science5apLessons.map((l) => l.categoryAr));
    expect(categories.has('الإنسان والصحة')).toBe(true);
    expect(categories.has('الأحياء والتكيف مع الوسط')).toBe(true);
    expect(categories.has('الأحياء والتكاثر عند الكائنات الحية')).toBe(true);
    expect(categories.has('المادة والتكنولوجيا')).toBe(true);
  });

  it('every science lesson should have clear summaries, rules, and key formulas or guidelines', () => {
    science5apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(2);
      expect(lesson.keyFormulas).toBeDefined();
      expect(lesson.keyFormulas!.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('every science lesson should include solved situation-problems (examplesAr) with clinical/experimental diagnosis', () => {
    science5apLessons.forEach((lesson) => {
      expect(lesson.examplesAr).toBeDefined();
      expect(lesson.examplesAr!.length).toBeGreaterThanOrEqual(1);

      lesson.examplesAr!.forEach((ex) => {
        expect(ex.problem).toBeTruthy();
        expect(ex.solution).toBeTruthy();
      });
    });
  });

  it('every science lesson should feature evaluation quizzes with correct choices and detailed explanations', () => {
    science5apLessons.forEach((lesson) => {
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);

      lesson.quiz.forEach((q) => {
        expect(q.questionAr).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(2);

        const correctOptions = q.options.filter((opt) => opt.isCorrect);
        expect(correctOptions.length).toBe(1);

        const correctOpt = correctOptions[0];
        expect(correctOpt.explanationAr).toBeTruthy();
      });
    });
  });

  it('should contain full interactive gameplay_simulation logic for the 3 specified Science 5AP modules', () => {
    const circuitLesson = science5apLessons.find((l) => l.id === 'science-5ap-electric-circuit');
    expect(circuitLesson?.gameplay_simulation?.type).toBe('circuit_builder');
    if (circuitLesson?.gameplay_simulation?.type === 'circuit_builder') {
      expect(circuitLesson.gameplay_simulation.availableComponents.length).toBeGreaterThanOrEqual(4);
      expect(circuitLesson.gameplay_simulation.combinations.length).toBe(3);
      expect(circuitLesson.gameplay_simulation.combinations.some((c) => c.success)).toBe(true);
      expect(circuitLesson.gameplay_simulation.combinations.some((c) => c.messageFr.includes('isolant'))).toBe(true);
    }

    const safetyLesson = science5apLessons.find((l) => l.id === 'science-5ap-electrical-safety');
    expect(safetyLesson?.gameplay_simulation?.type).toBe('safety_roleplay');
    if (safetyLesson?.gameplay_simulation?.type === 'safety_roleplay') {
      expect(safetyLesson.gameplay_simulation.choices.length).toBe(3);
      expect(safetyLesson.gameplay_simulation.choices.some((c) => c.statusLabelAr.includes('ELECTROCUTION'))).toBe(true);
    }

    const mixtureLesson = science5apLessons.find((l) => l.id === 'science-5ap-matter-mixtures');
    expect(mixtureLesson?.gameplay_simulation?.type).toBe('mixtures_lab');
    if (mixtureLesson?.gameplay_simulation?.type === 'mixtures_lab') {
      expect(mixtureLesson.gameplay_simulation.mixtures.length).toBeGreaterThanOrEqual(2);
      expect(
        mixtureLesson.gameplay_simulation.mixtures[0].availableMethods.some(
          (m) => m.id === 'filtration' && m.isCorrect
        )
      ).toBe(true);
    }
  });

  it('every lesson with an interactiveTool should specify a valid tool', () => {
    const validTools = [
      'soroban',
      'unit_converter',
      'geometry_visualizer',
      'multiplication_table',
      'arabic_conjugator',
      'science_lab',
      'french_lab',
      'english_lab',
      'history_geo_lab',
      'islamic_lab',
      'arabic_canvas',
      'civics_lab',
      'math_lab',
      'french_dialogue_lab',
      'english_dialogue_lab'
    ];
    COURSES_DATA.forEach((lesson) => {
      if (lesson.interactiveTool) {
        expect(validTools).toContain(lesson.interactiveTool);
      }
    });
  });

  it('should contain full lessons and lab tools for French, English, History & Geography, and Islamic Education 5AP', () => {
    const frenchLessons = COURSES_DATA.filter((l) => l.subject === 'french');
    const englishLessons = COURSES_DATA.filter((l) => l.subject === 'english');
    const historyGeoLessons = COURSES_DATA.filter((l) => l.subject === 'history_geo');
    const islamicLessons = COURSES_DATA.filter((l) => l.subject === 'islamic');

    expect(frenchLessons.length).toBeGreaterThanOrEqual(3);
    expect(englishLessons.length).toBeGreaterThanOrEqual(3);
    expect(historyGeoLessons.length).toBeGreaterThanOrEqual(7);
    expect(islamicLessons.length).toBeGreaterThanOrEqual(6);

    // French/English 4AP lessons use the shared grade-wide conjugator ('french_lab'/'english_lab'),
    // while 5AP lessons carry a per-lesson dedicated tool ('french_dialogue_lab'/'english_dialogue_lab').
    expect(frenchLessons.every((l) => l.interactiveTool === 'french_lab' || l.interactiveTool === 'french_dialogue_lab')).toBe(true);
    expect(englishLessons.every((l) => l.interactiveTool === 'english_lab' || l.interactiveTool === 'english_dialogue_lab')).toBe(true);
    expect(historyGeoLessons.every((l) => l.interactiveTool === 'history_geo_lab')).toBe(true);
    expect(islamicLessons.every((l) => l.interactiveTool === 'islamic_lab')).toBe(true);
  });
});

describe('4AP Science and Technology Curriculum Tests', () => {
  const science4apLessons = COURSES_DATA.filter(
    (course) => course.grade === '4AP' && course.subject === 'science'
  );

  it('should contain lessons covering all official 4AP science domains', () => {
    expect(science4apLessons.length).toBeGreaterThanOrEqual(7);

    const categories = new Set(science4apLessons.map((l) => l.categoryAr));
    expect(categories.has('الإنسان والصحة')).toBe(true);
    expect(categories.has('النباتات والحياة (الإيكولوجيا)')).toBe(true);
    expect(categories.has('المادة والعالم المادي')).toBe(true);
    expect(categories.has('الفلك والزمن')).toBe(true);
  });

  it('every 4AP science lesson should have summary, rules, formulas, examples, and science_lab tool', () => {
    science4apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(2);
      expect(lesson.keyFormulas).toBeDefined();
      expect(lesson.keyFormulas!.length).toBeGreaterThanOrEqual(1);
      expect(lesson.examplesAr).toBeDefined();
      expect(lesson.examplesAr!.length).toBeGreaterThanOrEqual(1);
      expect(lesson.interactiveTool).toBe('science_lab');
      expect(lesson.gameplay_simulation).toBeDefined();
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(2);

      lesson.quiz.forEach((q) => {
        expect(q.questionAr).toBeTruthy();
        const correctOpt = q.options.find((opt) => opt.isCorrect);
        expect(correctOpt).toBeDefined();
        expect(correctOpt?.explanationAr).toBeTruthy();
      });
    });
  });
});

describe('3AP English Language Pedagogical Curriculum Tests', () => {
  const english3apLessons = COURSES_DATA.filter(
    (course) => course.grade === '3AP' && course.subject === 'english'
  );

  it('should contain full lessons covering all 3AP official Algerian 2nd Generation units across trimesters', () => {
    expect(english3apLessons.length).toBeGreaterThanOrEqual(5);

    const sequenceTitles = new Set(english3apLessons.map((l) => l.sequenceAr));
    expect(sequenceTitles.has('Unit 1 - Sequence 1: Hello & Welcome (Greetings & Alphabet)')).toBe(true);
    expect(sequenceTitles.has('Unit 1 - Sequence 2: My Family, Friends & Numbers 1-10')).toBe(true);
    expect(sequenceTitles.has('Unit 2 - Sequence 1: My School Objects & Classroom Commands')).toBe(true);
    expect(sequenceTitles.has('Unit 3 - Sequence 1: Colors, Shapes & My Home')).toBe(true);
    expect(sequenceTitles.has('Unit 4 - Sequence 1: My Toys, Pets & Expressing Likes')).toBe(true);
    expect(sequenceTitles.has('Unit 5 - Sequence 1: My Body Parts & Annual 3AP English Synthesis')).toBe(true);
  });

  it('every 3AP English lesson should have summary, rules, interactive tool, progressive exercises and educational game', () => {
    english3apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.objectiveAr).toBeTruthy();
      expect(lesson.discoveryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(3);
      expect(lesson.interactiveTool).toBe('english_lab');
      expect(lesson.progressiveExercises).toBeDefined();
      expect(lesson.progressiveExercises!.length).toBeGreaterThanOrEqual(2);
      expect(lesson.educationalGame).toBeDefined();
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);
    });
  });
});

describe('3AP Science & Technology Pedagogical Curriculum Tests', () => {
  const science3apLessons = COURSES_DATA.filter(
    (course) => course.grade === '3AP' && course.subject === 'science'
  );

  it('should contain full lessons covering all 3AP official Algerian 2nd Generation science sequences across trimesters', () => {
    expect(science3apLessons.length).toBeGreaterThanOrEqual(6);

    const sequenceTitles = new Set(science3apLessons.map((l) => l.sequenceAr));
    expect(sequenceTitles.has('الوحدة 1 - السلسلة 1: التنفس والجهد العضلي ونبض القلب')).toBe(true);
    expect(sequenceTitles.has('الوحدة 1 - السلسلة 2: التغذية المتوازنة والمجموعات الغذائية الست')).toBe(true);
    expect(sequenceTitles.has('الوحدة 2 - السلسلة 1: نمو النبات الأخضر والإنتاش والحاجة للماء والضوء')).toBe(true);
    expect(sequenceTitles.has('الوحدة 2 - السلسلة 2: التكيف عند الحيوانات (النظام الغذائي والتنقل)')).toBe(true);
    expect(sequenceTitles.has('الوحدة 3 - السلسلة 1: حالات المادة (الصلبة والسائلة) وقياس الكتل والميزان')).toBe(true);
    expect(sequenceTitles.has('الوحدة 3 - السلسلة 2: قياس الوقت والمحرار والدارة الكهربائية البسيطة')).toBe(true);
  });

  it('every 3AP science lesson should feature discovery situations, rules, science_lab tool, progressive exercises, and educational game', () => {
    science3apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.objectiveAr).toBeTruthy();
      expect(lesson.discoveryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(3);
      expect(lesson.interactiveTool).toBe('science_lab');
      expect(lesson.examplesAr).toBeDefined();
      expect(lesson.examplesAr!.length).toBeGreaterThanOrEqual(2);
      expect(lesson.progressiveExercises).toBeDefined();
      expect(lesson.progressiveExercises!.length).toBeGreaterThanOrEqual(2);
      expect(lesson.educationalGame).toBeDefined();
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);

      lesson.quiz.forEach((q) => {
        expect(q.questionAr).toBeTruthy();
        const correctOpt = q.options.find((opt) => opt.isCorrect);
        expect(correctOpt).toBeDefined();
        expect(correctOpt?.explanationAr).toBeTruthy();
      });
    });
  });
});


