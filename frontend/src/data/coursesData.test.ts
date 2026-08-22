import { describe, it, expect } from 'vitest';
import { COURSES_DATA } from './coursesData';
import { OFFICIAL_EXAMS_DATA } from './examsData';
import { PLAYFUL_PACKS } from './courses/1AP/playfulPacks';

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

  it('no 5AP math lesson is left as a premiumContentPending shell', () => {
    const pendingLessons = math5apLessons.filter((l) => l.premiumContentPending);
    expect(pendingLessons).toEqual([]);

    const division = math5apLessons.find((l) => l.id === 'math-5ap-division');
    expect(division).toBeDefined();
    expect(division!.quiz.length).toBeGreaterThanOrEqual(1);
    expect(division!.rulesAr.length).toBeGreaterThanOrEqual(2);
    expect(division!.detailedCourse).toBeDefined();
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

  it('every 4AP lesson should have summary, rules and key formulas', () => {
    math4apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(3);
      expect(lesson.keyFormulas).toBeDefined();
      expect(lesson.keyFormulas!.length).toBeGreaterThanOrEqual(1);
    });
  });

  // 2026 interactiveTool audit: interactiveTool is intentionally omitted (not defaulted to a
  // mismatched generic tool) on lessons where no existing tool genuinely fits the subject matter
  // (fractions-decimals, geometry-lines-polygons, proportionally-time-data). See LessonViewer.tsx's
  // hasRenderableInteractiveTool — an absent tool hides the tab rather than showing something wrong.
  it('every 4AP math lesson with an interactiveTool should have one relevant to its content', () => {
    math4apLessons.forEach((lesson) => {
      if (lesson.interactiveTool) {
        expect(['soroban', 'multiplication_table', 'unit_converter', 'geometry_visualizer']).toContain(lesson.interactiveTool);
      }
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
      'touch_writing',
      'tamazight_lab',
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

  // 2026 interactiveTool audit — completed across all 8 subjects (math/science first pass, then
  // arabic/french/english/history_geo/islamic/civics): every lab-style tool must carry its matching
  // per-lesson config, or LessonViewer.tsx's hasRenderableInteractiveTool hides the tab rather than
  // showing a blank screen (the old science_lab/history_geo_lab fallback bugs this now prevents).
  it('every lesson using a config-driven lab tool should carry its matching per-lesson config', () => {
    COURSES_DATA.forEach((lesson) => {
      switch (lesson.interactiveTool) {
        case 'science_lab':
          expect(lesson.gameplay_simulation).toBeDefined();
          break;
        case 'math_lab':
          expect(lesson.mathInteractive).toBeDefined();
          break;
        case 'islamic_lab':
          expect(lesson.islamicInteractive).toBeDefined();
          break;
        case 'civics_lab':
          expect(lesson.civicsInteractive).toBeDefined();
          break;
        case 'history_geo_lab':
          expect(lesson.historyGeoInteractive).toBeDefined();
          break;
        case 'french_dialogue_lab':
        case 'english_dialogue_lab':
          expect(lesson.languageInteractive).toBeDefined();
          break;
        default:
          break;
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
    // 2026 interactiveTool audit: history_geo_lab is no longer forced on every lesson — one 4AP
    // lesson (map-and-legend) intentionally has none, since no existing tool type covers map/legend
    // reading. Any lesson that DOES declare a tool must still use 'history_geo_lab'.
    historyGeoLessons.forEach((l) => {
      if (l.interactiveTool) expect(l.interactiveTool).toBe('history_geo_lab');
    });
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

  it('every 3AP science lesson should feature discovery situations, rules, progressive exercises, and educational game', () => {
    science3apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.objectiveAr).toBeTruthy();
      expect(lesson.discoveryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(3);
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

describe('2AP Pedagogical Curriculum Tests (young-learner foundational content)', () => {
  const grade2apLessons = COURSES_DATA.filter((course) => course.grade === '2AP');
  const bySubject = (subject: string) => grade2apLessons.filter((l) => l.subject === subject);

  it('should contain lessons for all 5 official 2AP subjects (math, arabic, science, islamic, civics)', () => {
    expect(bySubject('math').length).toBeGreaterThanOrEqual(8);
    expect(bySubject('arabic').length).toBeGreaterThanOrEqual(5);
    expect(bySubject('science').length).toBeGreaterThanOrEqual(4);
    expect(bySubject('islamic').length).toBeGreaterThanOrEqual(4);
    expect(bySubject('civics').length).toBeGreaterThanOrEqual(3);
  });

  it('every 2AP lesson should have a clear course sheet: title, summary, at least 3 rules, and objectives', () => {
    grade2apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(3);
      expect(lesson.objectivesAr).toBeDefined();
      expect(lesson.objectivesAr!.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('every 2AP lesson should have a detailedCourse with vocabulary, common mistakes, and a takeaway — required for RevisionSheetViewer', () => {
    grade2apLessons.forEach((lesson) => {
      expect(lesson.detailedCourse).toBeDefined();
      expect(lesson.detailedCourse!.introAr).toBeTruthy();
      expect(lesson.detailedCourse!.takeawayAr).toBeTruthy();
      expect(lesson.detailedCourse!.vocabulary).toBeDefined();
      expect(lesson.detailedCourse!.vocabulary!.length).toBeGreaterThanOrEqual(1);
      expect(lesson.detailedCourse!.commonMistakes).toBeDefined();
      expect(lesson.detailedCourse!.commonMistakes!.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('every 2AP lesson should have tiered progressive exercises and an educational game', () => {
    grade2apLessons.forEach((lesson) => {
      expect(lesson.progressiveExercises).toBeDefined();
      expect(lesson.progressiveExercises!.length).toBeGreaterThanOrEqual(2);
      expect(lesson.educationalGame).toBeDefined();
      expect(lesson.educationalGame!.items.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('every 2AP lesson should have an interactive quiz with exactly one correct, explained option', () => {
    grade2apLessons.forEach((lesson) => {
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(1);
      lesson.quiz.forEach((q) => {
        expect(q.questionAr).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        const correctOptions = q.options.filter((opt) => opt.isCorrect);
        expect(correctOptions.length).toBe(1);
        expect(correctOptions[0].explanationAr).toBeTruthy();
      });
    });
  });

  it('every 2AP lesson should declare an honest content provenance (never a guessed official_verified)', () => {
    grade2apLessons.forEach((lesson) => {
      expect(lesson.contentSource).toBeDefined();
      expect(lesson.contentSource).not.toBe('official_verified');
      expect(lesson.sourceNoteAr).toBeTruthy();
    });
  });

  it('every 2AP islamic/civics lesson using islamic_lab/civics_lab should carry the matching per-lesson interactive config', () => {
    bySubject('islamic').forEach((lesson) => {
      if (lesson.interactiveTool === 'islamic_lab') {
        expect(lesson.islamicInteractive).toBeDefined();
      }
    });
    bySubject('civics').forEach((lesson) => {
      if (lesson.interactiveTool === 'civics_lab') {
        expect(lesson.civicsInteractive).toBeDefined();
      }
    });
  });
});

describe('1AP Pedagogical Curriculum Tests (initiation year — no official exams, 100% playful)', () => {
  const grade1apLessons = COURSES_DATA.filter((course) => course.grade === '1AP');
  const bySubject1ap = (subject: string) => grade1apLessons.filter((l) => l.subject === subject);

  it('should contain lessons for all 5 official 1AP subjects (math, arabic, science, islamic, civics)', () => {
    expect(bySubject1ap('math').length).toBeGreaterThanOrEqual(5);
    expect(bySubject1ap('arabic').length).toBeGreaterThanOrEqual(5);
    expect(bySubject1ap('science').length).toBeGreaterThanOrEqual(3);
    expect(bySubject1ap('islamic').length).toBeGreaterThanOrEqual(3);
    expect(bySubject1ap('civics').length).toBeGreaterThanOrEqual(3);
  });

  it('1AP must never have official trimester exams (initiation year, no formal évaluation in Algeria)', () => {
    const exams1ap = OFFICIAL_EXAMS_DATA.filter((exam) => exam.grade === '1AP');
    expect(exams1ap.length).toBe(0);
  });

  it('every 1AP lesson should have a clear, very simple course sheet: title, summary, at least 3 rules, and objectives', () => {
    grade1apLessons.forEach((lesson) => {
      expect(lesson.titleAr).toBeTruthy();
      expect(lesson.summaryAr).toBeTruthy();
      expect(lesson.rulesAr.length).toBeGreaterThanOrEqual(3);
      expect(lesson.objectivesAr).toBeDefined();
      expect(lesson.objectivesAr!.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('every 1AP lesson should have a detailedCourse with vocabulary, common mistakes, and a takeaway — required for RevisionSheetViewer', () => {
    grade1apLessons.forEach((lesson) => {
      expect(lesson.detailedCourse).toBeDefined();
      expect(lesson.detailedCourse!.introAr).toBeTruthy();
      expect(lesson.detailedCourse!.takeawayAr).toBeTruthy();
      expect(lesson.detailedCourse!.vocabulary).toBeDefined();
      expect(lesson.detailedCourse!.vocabulary!.length).toBeGreaterThanOrEqual(1);
      expect(lesson.detailedCourse!.commonMistakes).toBeDefined();
      expect(lesson.detailedCourse!.commonMistakes!.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('every 1AP lesson should have playful tiered exercises and an educational game (no formal évaluation)', () => {
    grade1apLessons.forEach((lesson) => {
      expect(lesson.progressiveExercises).toBeDefined();
      expect(lesson.progressiveExercises!.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.progressiveExercises!.some((ex) => ex.type === 'qcm' || ex.type === 'matching')).toBe(true);
      expect(lesson.educationalGame).toBeDefined();
      expect(lesson.educationalGame!.items.length, lesson.id).toBeGreaterThanOrEqual(4);
      expect(lesson.trimesterEvaluation).toBeUndefined();
      expect(lesson.evaluationExercises).toBeUndefined();
    });
  });

  it('every 1AP lesson should have a light, visual quiz with exactly one correct, explained option', () => {
    grade1apLessons.forEach((lesson) => {
      expect(lesson.quiz.length, lesson.id).toBeGreaterThanOrEqual(4);
      lesson.quiz.forEach((q) => {
        expect(q.questionAr).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        const correctOptions = q.options.filter((opt) => opt.isCorrect);
        expect(correctOptions.length).toBe(1);
        expect(correctOptions[0].explanationAr).toBeTruthy();
      });
    });
  });

  it('every 1AP lesson has an extra tap-game pack (tests + matching)', () => {
    const ids = grade1apLessons.map((l) => l.id).sort();
    expect(Object.keys(PLAYFUL_PACKS).sort()).toEqual(ids);
  });

  it('every 1AP lesson should declare an honest content provenance (never a guessed official_verified)', () => {
    grade1apLessons.forEach((lesson) => {
      expect(lesson.contentSource).toBeDefined();
      expect(lesson.contentSource).not.toBe('official_verified');
      expect(lesson.sourceNoteAr).toBeTruthy();
    });
  });

  it('every 1AP islamic/civics lesson using islamic_lab/civics_lab should carry the matching per-lesson interactive config', () => {
    bySubject1ap('islamic').forEach((lesson) => {
      if (lesson.interactiveTool === 'islamic_lab') {
        expect(lesson.islamicInteractive).toBeDefined();
      }
    });
    bySubject1ap('civics').forEach((lesson) => {
      if (lesson.interactiveTool === 'civics_lab') {
        expect(lesson.civicsInteractive).toBeDefined();
      }
    });
  });

  it('1AP arabic completes the alphabet (ج ح خ، ز، ص ض ط ظ، hamza) plus oral and tanween', () => {
    const arabic = bySubject1ap('arabic');
    const blob = arabic.map((l) => `${l.titleAr} ${l.summaryAr}`).join(' ');
    ['جَ', 'حَ', 'خَ', 'زَ', 'صَ', 'ضَ', 'طَ', 'ظَ', 'هَمْزَة'].forEach((token) => {
      expect(blob, token).toMatch(new RegExp(token));
    });
    expect(arabic.some((l) => l.id === 'arabic-1ap-t1-oral-daily')).toBe(true);
    expect(arabic.some((l) => l.id === 'arabic-1ap-t3-tanween')).toBe(true);
    expect(arabic.some((l) => l.id === 'arabic-1ap-t2-letter-positions')).toBe(true);
  });

  it('1AP harakat lesson is fully vocalized and teaches tashkil of the four short vowels', () => {
    const lesson = bySubject1ap('arabic').find((l) => l.id === 'arabic-1ap-t1-harakat')!;
    const tashkeel = /[\u064B-\u0652]/;
    const blob = [
      lesson.summaryAr,
      lesson.discoveryAr,
      ...lesson.rulesAr,
      lesson.detailedCourse!.introAr,
      lesson.detailedCourse!.takeawayAr,
      ...lesson.detailedCourse!.vocabulary!.map((v) => `${v.termAr} ${v.definitionAr}`),
    ].join(' ');
    expect(blob).toMatch(tashkeel);
    ['الفَتْحَةُ', 'الضَّمَّةُ', 'الكَسْرَةُ', 'السُّكُونُ', 'التَّشْكِيلُ'].forEach((token) => {
      expect(blob, token).toContain(token);
    });
    lesson.rulesAr.forEach((rule) => {
      expect(rule).toMatch(tashkeel);
    });
    expect(lesson.discoveryAr).toMatch(/بَ/);
    expect(lesson.discoveryAr).toMatch(/بُ/);
    expect(lesson.discoveryAr).toMatch(/بِ/);
    expect(lesson.discoveryAr).toMatch(/بْ/);
    expect(blob).toMatch(/قَلْبٌ/);
    expect(blob).not.toMatch(/كِتَابْ/);
  });

  it('1AP islamic keeps short surahs, shahada as dhikr, and adab — not the five pillars as the core', () => {
    const islamic = bySubject1ap('islamic');
    const ids = islamic.map((l) => l.id);
    expect(ids).toContain('islamic-1ap-t1-fatiha-basmala');
    expect(ids).toContain('islamic-1ap-t2-short-surahs-ikhlas-nas');
    expect(ids).toContain('islamic-1ap-t1-surah-falaq-kawthar');
    expect(ids).toContain('islamic-1ap-t3-surah-masad-nasr');
    const shahada = islamic.find((l) => l.id === 'islamic-1ap-t2-shahada-pillars')!;
    expect(shahada.titleAr).toMatch(/الشَّهَادَتَيْنِ/);
    expect(shahada.titleAr).not.toMatch(/أَرْكَانِ الإِسْلَامِ/);
    const manners = islamic.find((l) => l.id === 'islamic-1ap-t3-thanks-manners')!;
    expect(manners.rulesAr.join(' ')).toContain('الصِّدْقُ');
    expect(manners.rulesAr.join(' ')).toContain('الطَّهَارَةُ');
  });

  it('1AP quran explorer lessons show every ayah of the assigned surahs, without audio copy', () => {
    const expected: Record<string, string[]> = {
      'islamic-1ap-t1-fatiha-basmala': ['سُورَةُ الفَاتِحَةِ'],
      'islamic-1ap-t1-surah-falaq-kawthar': ['سُورَةُ الفَلَقِ', 'سُورَةُ الكَوْثَرِ'],
      'islamic-1ap-t2-short-surahs-ikhlas-nas': ['سُورَةُ الإِخْلَاصِ', 'سُورَةُ النَّاسِ'],
      'islamic-1ap-t3-surah-masad-nasr': ['سُورَةُ المَسَدِ', 'سُورَةُ النَّصْرِ'],
    };
    const counts: Record<string, number> = {
      'سُورَةُ الفَاتِحَةِ': 7,
      'سُورَةُ الإِخْلَاصِ': 4,
      'سُورَةُ النَّاسِ': 6,
      'سُورَةُ الفَلَقِ': 5,
      'سُورَةُ الكَوْثَرِ': 3,
      'سُورَةُ النَّصْرِ': 3,
      'سُورَةُ المَسَدِ': 5,
    };
    bySubject1ap('islamic').forEach((lesson) => {
      const names = expected[lesson.id];
      if (!names) return;
      expect(lesson.islamicInteractive?.type).toBe('quran_explorer');
      if (lesson.islamicInteractive?.type !== 'quran_explorer') return;
      expect(lesson.islamicInteractive.introAr).not.toMatch(/استمع|لتسمع/);
      names.forEach((name) => {
        const ayahs = lesson.islamicInteractive!.type === 'quran_explorer'
          ? lesson.islamicInteractive.verses.filter((v) => v.surahAr === name)
          : [];
        expect(ayahs.length, `${lesson.id} ${name}`).toBe(counts[name]);
      });
    });
  });

  it('1AP does not put a soroban or unit converter on compare / word-problem sheets', () => {
    const math = bySubject1ap('math');
    expect(math.every((l) => l.interactiveTool !== 'unit_converter')).toBe(true);
    const noAbacus = [
      'math-1ap-t2-compare-quantities',
      'math-1ap-t3-compare-symbols',
      'math-1ap-t3-addition-and-time-money',
      'math-1ap-t1-grandeurs',
    ];
    noAbacus.forEach((id) => {
      const lesson = math.find((l) => l.id === id);
      expect(lesson, id).toBeDefined();
      expect(lesson!.interactiveTool).not.toBe('soroban');
    });
  });

  it('1AP maths follows the year grid: 0–9 then 10–49 then 50–99, no clock or money titles', () => {
    const math = bySubject1ap('math');
    const ids = math.map((l) => l.id);

    expect(ids).toContain('math-1ap-t1-grandeurs');
    expect(ids).toContain('math-1ap-t3-compare-symbols');
    expect(ids).toContain('math-1ap-t3-ruler-align');

    const sixToNine = math.find((l) => l.id === 'math-1ap-t2-numbers-6-10')!;
    expect(sixToNine.trimester).toBe(1);
    expect(sixToNine.titleAr).toMatch(/6/);
    expect(sixToNine.titleAr).not.toMatch(/10/);

    const tenToTwenty = math.find((l) => l.id === 'math-1ap-t2-numbers-11-20')!;
    expect(tenToTwenty.trimester).toBe(2);

    const twentyOneToFortyNine = math.find((l) => l.id === 'math-1ap-t3-complete-tens-up-to-90')!;
    expect(twentyOneToFortyNine.trimester).toBe(2);
    expect(twentyOneToFortyNine.titleAr).toMatch(/21/);
    expect(twentyOneToFortyNine.titleAr).toMatch(/49/);

    const fiftyToNinetyNine = math.find((l) => l.id === 'math-1ap-t3-place-value-and-n99')!;
    expect(fiftyToNinetyNine.trimester).toBe(3);
    expect(fiftyToNinetyNine.titleAr).toMatch(/50/);
    expect(fiftyToNinetyNine.titleAr).toMatch(/99/);
    expect(fiftyToNinetyNine.objectivesAr!.join(' ')).not.toMatch(/[<>]/);

    const problems = math.find((l) => l.id === 'math-1ap-t3-addition-and-time-money')!;
    expect(problems.titleAr).not.toMatch(/ساعة|نقود/);
    expect(problems.summaryAr).toMatch(/مسألة|مسائل/);

    math.forEach((lesson) => {
      expect(lesson.titleAr).not.toMatch(/ساعة|نقود/);
    });
  });
});


