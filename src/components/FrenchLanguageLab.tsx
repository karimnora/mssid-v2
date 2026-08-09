import React, { useState } from 'react';
import { speakText } from '../utils/speech';
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  MessageCircle,
  Pencil,
  Award,
  Languages,
  Check,
  X,
  PlayCircle,
  HelpCircle,
  Search,
  Filter
} from 'lucide-react';

interface FrenchVerbData {
  verb: string;
  translationAr: string;
  group: 'Auxiliaire' | '1er groupe (-er)' | '2ème groupe (-ir)' | '3ème groupe (Irrégulier)' | 'Verbe pronominal';
  ruleFr: string;
  ruleAr: string;
  presents: Record<string, { full: string; stem: string; ending: string }>;
  futur: Record<string, { full: string; stem: string; ending: string }>;
  passeCompose: Record<string, { full: string; stem: string; ending: string }>;
  imparfait: Record<string, { full: string; stem: string; ending: string }>;
}

const FRENCH_VERBS_DATABASE: FrenchVerbData[] = [
  {
    verb: 'être',
    translationAr: 'كَانَ / يَكُونُ (فِعْلُ الكَيْنُونَةِ)',
    group: 'Auxiliaire',
    ruleFr: 'L\'auxiliaire être est essentiel pour exprimer l\'état et former le passé composé.',
    ruleAr: 'فِعْلُ الكَيْنُونَةِ (être) مُهِمٌّ جِدّاً لِلتَّعْبِيرِ عَنِ الحَالَةِ وَلِتَكْوِينِ المَاضِي المُرَكَّبِ.',
    presents: {
      'Je': { full: 'Je suis', stem: 'Je ', ending: 'suis' },
      'Tu': { full: 'Tu es', stem: 'Tu ', ending: 'es' },
      'Il / Elle / On': { full: 'Il / Elle est', stem: 'Il / Elle ', ending: 'est' },
      'Nous': { full: 'Nous sommes', stem: 'Nous ', ending: 'sommes' },
      'Vous': { full: 'Vous êtes', stem: 'Vous ', ending: 'êtes' },
      'Ils / Elles': { full: 'Ils / Elles sont', stem: 'Ils / Elles ', ending: 'sont' },
    },
    futur: {
      'Je': { full: 'Je serai', stem: 'ser', ending: 'ai' },
      'Tu': { full: 'Tu seras', stem: 'ser', ending: 'as' },
      'Il / Elle / On': { full: 'Il / Elle sera', stem: 'ser', ending: 'a' },
      'Nous': { full: 'Nous serons', stem: 'ser', ending: 'ons' },
      'Vous': { full: 'Vous serez', stem: 'ser', ending: 'ez' },
      'Ils / Elles': { full: 'Ils / Elles seront', stem: 'ser', ending: 'ont' },
    },
    passeCompose: {
      'Je': { full: 'J\'ai été', stem: 'J\'ai ', ending: 'été' },
      'Tu': { full: 'Tu as été', stem: 'Tu as ', ending: 'été' },
      'Il / Elle / On': { full: 'Il / Elle a été', stem: 'Il / Elle a ', ending: 'été' },
      'Nous': { full: 'Nous avons été', stem: 'Nous avons ', ending: 'été' },
      'Vous': { full: 'Vous avez été', stem: 'Vous avez ', ending: 'été' },
      'Ils / Elles': { full: 'Ils / Elles ont été', stem: 'Ils / Elles ont ', ending: 'été' },
    },
    imparfait: {
      'Je': { full: 'J\'étais', stem: 'ét', ending: 'ais' },
      'Tu': { full: 'Tu étais', stem: 'ét', ending: 'ais' },
      'Il / Elle / On': { full: 'Il / Elle était', stem: 'ét', ending: 'ait' },
      'Nous': { full: 'Nous étions', stem: 'ét', ending: 'ions' },
      'Vous': { full: 'Vous étiez', stem: 'ét', ending: 'iez' },
      'Ils / Elles': { full: 'Ils / Elles étaient', stem: 'ét', ending: 'aient' },
    }
  },
  {
    verb: 'avoir',
    translationAr: 'مَلَكَ / لَدَيْهِ (فِعْلُ المِلْكِيَّةِ)',
    group: 'Auxiliaire',
    ruleFr: 'L\'auxiliaire avoir permet d\'exprimer la possession et sert d\'auxiliaire au passé composé.',
    ruleAr: 'فِعْلُ المِلْكِيَّةِ (avoir) يُعَبِّرُ عَنِ المِلْكِيَّةِ وَيُسْتَخْدَمُ كَفِعْلٍ مُسَاعِدٍ فِي المَاضِي المُرَكَّبِ.',
    presents: {
      'Je': { full: 'J\'ai', stem: 'J\'', ending: 'ai' },
      'Tu': { full: 'Tu as', stem: 'Tu ', ending: 'as' },
      'Il / Elle / On': { full: 'Il / Elle a', stem: 'Il / Elle ', ending: 'a' },
      'Nous': { full: 'Nous avons', stem: 'Nous ', ending: 'avons' },
      'Vous': { full: 'Vous avez', stem: 'Vous ', ending: 'avez' },
      'Ils / Elles': { full: 'Ils / Elles ont', stem: 'Ils / Elles ', ending: 'ont' },
    },
    futur: {
      'Je': { full: 'J\'aurai', stem: 'aur', ending: 'ai' },
      'Tu': { full: 'Tu auras', stem: 'aur', ending: 'as' },
      'Il / Elle / On': { full: 'Il / Elle aura', stem: 'aur', ending: 'a' },
      'Nous': { full: 'Nous aurons', stem: 'aur', ending: 'ons' },
      'Vous': { full: 'Vous aurez', stem: 'aur', ending: 'ez' },
      'Ils / Elles': { full: 'Ils / Elles auront', stem: 'aur', ending: 'ont' },
    },
    passeCompose: {
      'Je': { full: 'J\'ai eu', stem: 'J\'ai ', ending: 'eu' },
      'Tu': { full: 'Tu as eu', stem: 'Tu as ', ending: 'eu' },
      'Il / Elle / On': { full: 'Il / Elle a eu', stem: 'Il / Elle a ', ending: 'eu' },
      'Nous': { full: 'Nous avons eu', stem: 'Nous avons ', ending: 'eu' },
      'Vous': { full: 'Vous avez eu', stem: 'Vous avez ', ending: 'eu' },
      'Ils / Elles': { full: 'Ils / Elles ont eu', stem: 'Ils / Elles ont ', ending: 'eu' },
    },
    imparfait: {
      'Je': { full: 'J\'avais', stem: 'av', ending: 'ais' },
      'Tu': { full: 'Tu avais', stem: 'av', ending: 'ais' },
      'Il / Elle / On': { full: 'Il / Elle avait', stem: 'av', ending: 'ait' },
      'Nous': { full: 'Nous avions', stem: 'av', ending: 'ions' },
      'Vous': { full: 'Vous aviez', stem: 'av', ending: 'iez' },
      'Ils / Elles': { full: 'Ils / Elles avaient', stem: 'av', ending: 'aient' },
    }
  },
  {
    verb: 'chanter',
    translationAr: 'غَنَّى / يُغَنِّي (مِنَ المَجْمُوعَةِ الأُولَى -ER)',
    group: '1er groupe (-er)',
    ruleFr: 'Les verbes du 1er groupe (-er) prennent au présent : -e, -es, -e, -ons, -ez, -ent.',
    ruleAr: 'أَفْعَالُ المَجْمُوعَةِ الأُولَى (-er) فِي الحَاضِرِ نَحْذِفُ er وَنُضِيفُ: -e, -es, -e, -ons, -ez, -ent.',
    presents: {
      'Je': { full: 'Je chante', stem: 'chant', ending: 'e' },
      'Tu': { full: 'Tu chantes', stem: 'chant', ending: 'es' },
      'Il / Elle / On': { full: 'Il / Elle chante', stem: 'chant', ending: 'e' },
      'Nous': { full: 'Nous chantons', stem: 'chant', ending: 'ons' },
      'Vous': { full: 'Vous chantez', stem: 'chant', ending: 'ez' },
      'Ils / Elles': { full: 'Ils / Elles chantent', stem: 'chant', ending: 'ent' },
    },
    futur: {
      'Je': { full: 'Je chanterai', stem: 'chanter', ending: 'ai' },
      'Tu': { full: 'Tu chanteras', stem: 'chanter', ending: 'as' },
      'Il / Elle / On': { full: 'Il / Elle chantera', stem: 'chanter', ending: 'a' },
      'Nous': { full: 'Nous chanterons', stem: 'chanter', ending: 'ons' },
      'Vous': { full: 'Vous chanterez', stem: 'chanter', ending: 'ez' },
      'Ils / Elles': { full: 'Ils / Elles chanteront', stem: 'chanter', ending: 'ont' },
    },
    passeCompose: {
      'Je': { full: 'J\'ai chanté', stem: 'J\'ai chant', ending: 'é' },
      'Tu': { full: 'Tu as chanté', stem: 'Tu as chant', ending: 'é' },
      'Il / Elle / On': { full: 'Il / Elle a chanté', stem: 'Il / Elle a chant', ending: 'é' },
      'Nous': { full: 'Nous avons chanté', stem: 'Nous avons chant', ending: 'é' },
      'Vous': { full: 'Vous avez chanté', stem: 'Vous avez chant', ending: 'é' },
      'Ils / Elles': { full: 'Ils / Elles ont chanté', stem: 'Ils / Elles ont chant', ending: 'é' },
    },
    imparfait: {
      'Je': { full: 'Je chantais', stem: 'chant', ending: 'ais' },
      'Tu': { full: 'Tu chantais', stem: 'chant', ending: 'ais' },
      'Il / Elle / On': { full: 'Il / Elle chantait', stem: 'chant', ending: 'ait' },
      'Nous': { full: 'Nous chantions', stem: 'chant', ending: 'ions' },
      'Vous': { full: 'Vous chantiez', stem: 'chant', ending: 'iez' },
      'Ils / Elles': { full: 'Ils / Elles me me chantaient', stem: 'chant', ending: 'aient' },
    }
  },
  {
    verb: 'finir',
    translationAr: 'أَنْهَى / يُنْهِي (مِنَ المَجْمُوعَةِ الثَّانِيَةِ -IR)',
    group: '2ème groupe (-ir)',
    ruleFr: 'Les verbes du 2ème groupe (-ir) prennent au présent : -is, -is, -it, -issons, -issez, -issent.',
    ruleAr: 'أَفْعَالُ المَجْمُوعَةِ الثَّانِيَةِ (-ir) فِي الحَاضِرِ نَحْذِفُ ir وَنُضِيفُ: -is, -is, -it, -issons, -issez, -issent.',
    presents: {
      'Je': { full: 'Je finis', stem: 'fin', ending: 'is' },
      'Tu': { full: 'Tu finis', stem: 'fin', ending: 'is' },
      'Il / Elle / On': { full: 'Il / Elle finit', stem: 'fin', ending: 'it' },
      'Nous': { full: 'Nous finissons', stem: 'fin', ending: 'issons' },
      'Vous': { full: 'Vous finissez', stem: 'fin', ending: 'issez' },
      'Ils / Elles': { full: 'Ils / Elles finissent', stem: 'fin', ending: 'issent' },
    },
    futur: {
      'Je': { full: 'Je me me me finirai', stem: 'finir', ending: 'ai' },
      'Tu': { full: 'Tu finiras', stem: 'finir', ending: 'as' },
      'Il / Elle / On': { full: 'Il / Elle finira', stem: 'finir', ending: 'a' },
      'Nous': { full: 'Nous finirons', stem: 'finir', ending: 'ons' },
      'Vous': { full: 'Vous finirez', stem: 'finir', ending: 'ez' },
      'Ils / Elles': { full: 'Ils / Elles finiront', stem: 'finir', ending: 'ont' },
    },
    passeCompose: {
      'Je': { full: 'J\'ai fini', stem: 'J\'ai fin', ending: 'i' },
      'Tu': { full: 'Tu as fini', stem: 'Tu as fin', ending: 'i' },
      'Il / Elle / On': { full: 'Il / Elle a fini', stem: 'Il / Elle a fin', ending: 'i' },
      'Nous': { full: 'Nous avons fini', stem: 'Nous avons fin', ending: 'i' },
      'Vous': { full: 'Vous avez fini', stem: 'Vous avez fin', ending: 'i' },
      'Ils / Elles': { full: 'Ils / Elles ont fini', stem: 'Ils / Elles ont fin', ending: 'i' },
    },
    imparfait: {
      'Je': { full: 'Je finissais', stem: 'finiss', ending: 'ais' },
      'Tu': { full: 'Tu finissais', stem: 'finiss', ending: 'ais' },
      'Il / Elle / On': { full: 'Il / Elle finissait', stem: 'finiss', ending: 'ait' },
      'Nous': { full: 'Nous finissions', stem: 'finiss', ending: 'ions' },
      'Vous': { full: 'Vous finissiez', stem: 'finiss', ending: 'iez' },
      'Ils / Elles': { full: 'Ils / Elles me finissaient', stem: 'finiss', ending: 'aient' },
    }
  },
  {
    verb: 'faire',
    translationAr: 'فَعَلَ / عَمِلَ / يَفْعَلُ (المَجْمُوعَةُ الثَّالِثَةُ)',
    group: '3ème groupe (Irrégulier)',
    ruleFr: 'Le verbe faire change de forme au présent : Je fais, Tu fais, Il fait, Nous faisons, Vous faites, Ils font.',
    ruleAr: 'فِعْلُ hacer/faire يَتَغَيَّرُ جَذْرُهُ: Je fais, Nous faisons, Vous faites, Ils font.',
    presents: {
      'Je': { full: 'Je fais', stem: 'fa', ending: 'is' },
      'Tu': { full: 'Tu fais', stem: 'fa', ending: 'is' },
      'Il / Elle / On': { full: 'Il / Elle fait', stem: 'fa', ending: 'it' },
      'Nous': { full: 'Nous faisons', stem: 'fais', ending: 'ons' },
      'Vous': { full: 'Vous faites', stem: 'fait', ending: 'es' },
      'Ils / Elles': { full: 'Ils / Elles font', stem: 'f', ending: 'ont' },
    },
    futur: {
      'Je': { full: 'Je ferai', stem: 'fer', ending: 'ai' },
      'Tu': { full: 'Tu feras', stem: 'fer', ending: 'as' },
      'Il / Elle / On': { full: 'Il / Elle fera', stem: 'fer', ending: 'a' },
      'Nous': { full: 'Nous ferons', stem: 'fer', ending: 'ons' },
      'Vous': { full: 'Vous ferez', stem: 'fer', ending: 'ez' },
      'Ils / Elles': { full: 'Ils / Elles feront', stem: 'fer', ending: 'ont' },
    },
    passeCompose: {
      'Je': { full: 'J\'ai fait', stem: 'J\'ai fa', ending: 'it' },
      'Tu': { full: 'Tu as fait', stem: 'Tu as fa', ending: 'it' },
      'Il / Elle / On': { full: 'Il / Elle a fait', stem: 'Il / Elle a fa', ending: 'it' },
      'Nous': { full: 'Nous avons fait', stem: 'Nous avons fa', ending: 'it' },
      'Vous': { full: 'Vous avez fait', stem: 'Vous avez fa', ending: 'it' },
      'Ils / Elles': { full: 'Ils / Elles ont fait', stem: 'Ils / Elles ont fa', ending: 'it' },
    },
    imparfait: {
      'Je': { full: 'Je faisais', stem: 'fais', ending: 'ais' },
      'Tu': { full: 'Tu faisais', stem: 'fais', ending: 'ais' },
      'Il / Elle / On': { full: 'Il / Elle faisait', stem: 'fais', ending: 'ait' },
      'Nous': { full: 'Nous faisions', stem: 'fais', ending: 'ions' },
      'Vous': { full: 'Vous faisiez', stem: 'fais', ending: 'iez' },
      'Ils / Elles': { full: 'Ils / Elles faisaient', stem: 'fais', ending: 'aient' },
    }
  },
  {
    verb: 'aller',
    translationAr: 'ذَهَبَ / يَذْهَبُ (المَجْمُوعَةُ الثَّالِثَةُ)',
    group: '3ème groupe (Irrégulier)',
    ruleFr: 'Le verbe aller utilise l\'auxiliaire être au passé composé : Je suis allé(e).',
    ruleAr: 'فِعْلُ الذهاب (aller) يُصَرَّفُ مَعَ فِعْلِ الكَيْنُونَةِ être فِي المَاضِي المُرَكَّبِ.',
    presents: {
      'Je': { full: 'Je vais', stem: 'v', ending: 'ais' },
      'Tu': { full: 'Tu vas', stem: 'v', ending: 'as' },
      'Il / Elle / On': { full: 'Il / Elle va', stem: 'v', ending: 'a' },
      'Nous': { full: 'Nous allons', stem: 'all', ending: 'ons' },
      'Vous': { full: 'Vous allez', stem: 'all', ending: 'ez' },
      'Ils / Elles': { full: 'Ils / Elles vont', stem: 'v', ending: 'ont' },
    },
    futur: {
      'Je': { full: 'Je irai', stem: 'ir', ending: 'ai' },
      'Tu': { full: 'Tu iras', stem: 'ir', ending: 'as' },
      'Il / Elle / On': { full: 'Il / Elle ira', stem: 'ir', ending: 'a' },
      'Nous': { full: 'Nous irons', stem: 'ir', ending: 'ons' },
      'Vous': { full: 'Vous irez', stem: 'ir', ending: 'ez' },
      'Ils / Elles': { full: 'Ils / Elles iront', stem: 'ir', ending: 'ont' },
    },
    passeCompose: {
      'Je': { full: 'Je suis allé(e)', stem: 'Je suis all', ending: 'é' },
      'Tu': { full: 'Tu es allé(e)', stem: 'Tu es all', ending: 'é' },
      'Il / Elle / On': { full: 'Il / Elle est allé(e)', stem: 'Il / Elle est all', ending: 'é' },
      'Nous': { full: 'Nous sommes allé(e)s', stem: 'Nous sommes all', ending: 'és' },
      'Vous': { full: 'Vous êtes allé(e)s', stem: 'Vous êtes all', ending: 'és' },
      'Ils / Elles': { full: 'Ils / Elles sont allé(e)s', stem: 'Ils / Elles sont all', ending: 'és' },
    },
    imparfait: {
      'Je': { full: 'J\'allais', stem: 'all', ending: 'ais' },
      'Tu': { full: 'Tu allais', stem: 'all', ending: 'ais' },
      'Il / Elle / On': { full: 'Il / Elle allait', stem: 'all', ending: 'ait' },
      'Nous': { full: 'Nous allions', stem: 'all', ending: 'ions' },
      'Vous': { full: 'Vous alliez', stem: 'all', ending: 'iez' },
      'Ils / Elles': { full: 'Ils / Elles me me allaient', stem: 'all', ending: 'aient' },
    }
  },
  {
    verb: 'se laver',
    translationAr: 'اِغْتَسَلَ / يَغْتَسِلُ (فِعْلٌ مُنْعَكِسٌ)',
    group: 'Verbe pronominal',
    ruleFr: 'Les verbes pronominaux utilisent un pronom réfléchi (me, te, se, nous, vous, se) et être au passé composé.',
    ruleAr: 'الأَفْعَالُ المُنْعَكِسَةُ (se) تَسْتَخْدِمُ الضَمَائِرَ المُنْعَكِسَةَ (me, te, se...) وَتَأْخُذُ être فِي المَاضِي المُرَكَّبِ.',
    presents: {
      'Je': { full: 'Je me lave', stem: 'Je me lav', ending: 'e' },
      'Tu': { full: 'Tu te laves', stem: 'Tu te lav', ending: 'es' },
      'Il / Elle / On': { full: 'Il / Elle se lave', stem: 'Il / Elle se lav', ending: 'e' },
      'Nous': { full: 'Nous nous lavons', stem: 'Nous nous lav', ending: 'ons' },
      'Vous': { full: 'Vous vous lavez', stem: 'Vous vous lav', ending: 'ez' },
      'Ils / Elles': { full: 'Ils / Elles se lavent', stem: 'Ils / Elles se lav', ending: 'ent' },
    },
    futur: {
      'Je': { full: 'Je me laverai', stem: 'Je me laver', ending: 'ai' },
      'Tu': { full: 'Tu te laveras', stem: 'Tu te laver', ending: 'as' },
      'Il / Elle / On': { full: 'Il / Elle se lavera', stem: 'Il / Elle se laver', ending: 'a' },
      'Nous': { full: 'Nous nous laverons', stem: 'Nous nous laver', ending: 'ons' },
      'Vous': { full: 'Vous vous laverez', stem: 'Vous vous laver', ending: 'ez' },
      'Ils / Elles': { full: 'Ils / Elles se laveront', stem: 'Ils / Elles se laver', ending: 'ont' },
    },
    passeCompose: {
      'Je': { full: 'Je me suis lavé(e)', stem: 'Je me suis lav', ending: 'é' },
      'Tu': { full: 'Tu t\'es lavé(e)', stem: 'Tu t\'es lav', ending: 'é' },
      'Il / Elle / On': { full: 'Il / Elle s\'est lavé(e)', stem: 'Il / Elle s\'est lav', ending: 'é' },
      'Nous': { full: 'Nous nous sommes lavé(e)s', stem: 'Nous nous sommes lav', ending: 'és' },
      'Vous': { full: 'Vous vous êtes lavé(e)s', stem: 'Vous vous êtes lav', ending: 'és' },
      'Ils / Elles': { full: 'Ils / Elles se sont lavé(e)s', stem: 'Ils / Elles se sont lav', ending: 'és' },
    },
    imparfait: {
      'Je': { full: 'Je me lavais', stem: 'Je me lav', ending: 'ais' },
      'Tu': { full: 'Tu te lavais', stem: 'Tu te lav', ending: 'ais' },
      'Il / Elle / On': { full: 'Il / Elle se lavait', stem: 'Il / Elle se lav', ending: 'ait' },
      'Nous': { full: 'Nous nous lavions', stem: 'Nous nous lav', ending: 'ions' },
      'Vous': { full: 'Vous vous laviez', stem: 'Vous vous lav', ending: 'iez' },
      'Ils / Elles': { full: 'Ils / Elles se lavaient', stem: 'Ils / Elles se lav', ending: 'aient' },
    }
  }
];

interface FrenchLabProps {
  initialTab?: 'conjugator' | 'vocab' | 'dialogue' | 'grammar_fix' | 'production';
  grade?: string;
}

export const FrenchLanguageLab: React.FC<FrenchLabProps> = ({ initialTab = 'conjugator', grade = '4AP' }) => {
  const [activeTab, setActiveTab] = useState<'conjugator' | 'vocab' | 'dialogue' | 'grammar_fix' | 'production'>(initialTab);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  // Conjugator State
  const [selectedVerb, setSelectedVerb] = useState<FrenchVerbData>(FRENCH_VERBS_DATABASE[0]);
  const [selectedTense, setSelectedTense] = useState<'presents' | 'futur' | 'passeCompose' | 'imparfait'>('presents');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Quiz Game State
  const [quizScore, setQuizScore] = useState<number>(0);
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);

  const QUIZ_QUESTIONS = [
    {
      sentenceFr: 'Amina ____ un bel oiseau dans le jardin.',
      verbName: 'voir (présent)',
      options: ['vois', 'voit', 'voyons'],
      correct: 'voit',
      explanation: 'Avec "Amina" (elle / 3ème personne du singulier), le verbe voir au présent s\'écrit "voit".'
    },
    {
      sentenceFr: 'Demain, nous ____ au parc de loisirs.',
      verbName: 'aller (futur)',
      options: ['allons', 'irons', 'irez'],
      correct: 'irons',
      explanation: 'Au futur simple avec "nous", le verbe aller devient "nous irons".'
    },
    {
      sentenceFr: 'Les pompiers ____ le feu rapidement.',
      verbName: 'éteindre / finir (passé composé)',
      options: ['ont fini', 'as fini', 'avons fini'],
      correct: 'ont fini',
      explanation: 'Avec "Les pompiers" (ils), l\'auxiliaire avoir au passé composé est "ont fini".'
    }
  ];

  const handleSpeak = (text: string) => {
    setSpeakingText(text);
    speakText(text, 'fr-FR', 0.85).then(() => {
      setSpeakingText(null);
    });
  };

  const tenseTitleMap = {
    presents: 'Présent de l\'indicatif (الحَاضِرُ)',
    futur: 'Futur simple (المُسْتَقْبَلُ)',
    passeCompose: 'Passé composé (المَاضِي المُرَكَّبُ)',
    imparfait: 'Imparfait (المَاضِي المُسْتَمِرُّ / 5AP)'
  };

  const filteredVerbs = FRENCH_VERBS_DATABASE.filter(v =>
    v.verb.toLowerCase().includes(searchFilter.toLowerCase()) ||
    v.translationAr.includes(searchFilter) ||
    v.group.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6 dir-rtl" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-500/20 text-sky-400 rounded-2xl border border-sky-500/30">
            <Languages className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-sky-300">
              أَدَاةُ تَصْرِيفِ الأَفْعَالِ الفَرَنْسِيَّةِ التَّفَاعُلِيَّةِ (Conjugueur de Verbes 3AP-5AP)
            </h2>
            <p className="text-xs text-slate-400">
              تصريف تفاعلي شامل وممتع للأفعال المقررة في المنهاج الجزائري الرسمي مع النطق الصوتي والقواعد
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-sky-400" />
            <span>خاصية النطق الصوتي (Audio Vocalisé)</span>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('conjugator')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'conjugator'
              ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-lg scale-[1.02]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>1. أَدَاةُ تَصْرِيفِ الأَفْعَالِ (Conjugaison)</span>
        </button>

        <button
          onClick={() => setActiveTab('vocab')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'vocab'
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg scale-[1.02]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. المفردات والمطابقة (Vocabulaire)</span>
        </button>

        <button
          onClick={() => setActiveTab('dialogue')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'dialogue'
              ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg scale-[1.02]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>3. الحوار المسموع (Dialogues)</span>
        </button>

        <button
          onClick={() => setActiveTab('grammar_fix')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
            activeTab === 'grammar_fix'
              ? 'bg-purple-500 text-white border-purple-300 shadow-lg scale-[1.02]'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>4. تصحيح الجمل والقواعد</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE CONJUGATOR ENGINE */}
      {activeTab === 'conjugator' && (
        <div className="space-y-6">
          {/* Verb Selection & Search Bar */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-sky-300">
                <Search className="w-4 h-4" />
                <span>اختر الفعل المراد تصريفه أو ابحث عنه:</span>
              </div>
              <input
                type="text"
                placeholder="ابحث عن فعل بالفرنسية أو بالعربية..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            {/* Verb Cards Grid */}
            <div className="flex flex-wrap gap-2.5">
              {filteredVerbs.map((v) => {
                const isSelected = selectedVerb.verb === v.verb;
                return (
                  <button
                    key={v.verb}
                    onClick={() => {
                      setSelectedVerb(v);
                      handleSpeak(v.verb);
                    }}
                    className={`px-4 py-3 rounded-2xl border text-right transition-all cursor-pointer font-sans text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-black border-sky-300 shadow-lg scale-[1.03] ring-2 ring-sky-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-black tracking-tight">{v.verb}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                        isSelected ? 'bg-slate-950 text-sky-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {v.group}
                      </span>
                    </div>
                    <span className={`text-[11px] mt-1 ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                      {v.translationAr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Verb Conjugation Card */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-sky-500/30 space-y-6 shadow-xl">
            {/* Header of Active Verb */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-sky-300 font-sans tracking-wide">{selectedVerb.verb}</span>
                  <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1 rounded-xl text-xs font-bold">
                    {selectedVerb.group}
                  </span>
                  <button
                    onClick={() => handleSpeak(selectedVerb.verb)}
                    className="p-2 bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 rounded-xl border border-sky-500/30 transition-all cursor-pointer"
                    title="نطق اسم الفعل"
                  >
                    <Volume2 className={`w-4 h-4 ${speakingText === selectedVerb.verb ? 'text-amber-400 animate-pulse' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-amber-300 mt-1 font-bold">{selectedVerb.translationAr}</p>
              </div>

              {/* Tense Selector Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex-wrap">
                {(['presents', 'futur', 'passeCompose', 'imparfait'] as const).map((tenseKey) => (
                  <button
                    key={tenseKey}
                    onClick={() => setSelectedTense(tenseKey)}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer font-sans ${
                      selectedTense === tenseKey
                        ? 'bg-sky-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {tenseKey === 'presents' && 'Présent (الحاضر)'}
                    {tenseKey === 'futur' && 'Futur (المستقبل)'}
                    {tenseKey === 'passeCompose' && 'Passé composé (الماضي)'}
                    {tenseKey === 'imparfait' && 'Imparfait (5AP)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Rule Tip Box */}
            <div className="bg-slate-900/90 border border-sky-500/30 p-4 rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-black">
                <HelpCircle className="w-4 h-4" />
                <span>قاعدة تصريف هذا الفعل ({tenseTitleMap[selectedTense]}):</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans font-medium">{selectedVerb.ruleFr}</p>
              <p className="text-sky-300 leading-relaxed font-semibold">{selectedVerb.ruleAr}</p>
            </div>

            {/* Conjugation Table Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-300 flex items-center justify-between">
                <span> جدول التصريف مع الضمائر الشخصية (Pronoms Personnels):</span>
                <span className="text-[11px] text-amber-400">💡 انقر على النطق المسموع لكل ضَمِير!</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(selectedVerb[selectedTense] as Record<string, { full: string; stem: string; ending: string }>).map(([pronoun, item]) => {
                  return (
                    <div
                      key={pronoun}
                      className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-sky-500/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black bg-slate-800 text-sky-300 px-3 py-1.5 rounded-xl border border-slate-700 shrink-0 font-sans">
                          {pronoun}
                        </span>
                        <div className="font-sans text-base font-black text-white">
                          <span className="text-slate-200">{item.stem}</span>
                          <span className="text-amber-400 underline decoration-amber-400 underline-offset-4">{item.ending}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSpeak(item.full)}
                        className="p-2.5 bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 rounded-xl border border-sky-500/30 transition-all cursor-pointer"
                        title="استمع للنطق الصوتي الكامل"
                      >
                        <Volume2 className={`w-4 h-4 ${speakingText === item.full ? 'text-amber-400 animate-bounce' : ''}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Conjugation Challenge Game */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-amber-300 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>تحدي واختبار تصريف الأفعال السريع (Jeu de Conjugaison):</span>
                </h4>
                <span className="text-xs font-extrabold text-emerald-400 font-mono">
                  النتيجة: {quizScore} نقاط 🏆
                </span>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                <p className="text-xs text-slate-300 font-bold">
                  السؤال {currentQuizIdx + 1} / {QUIZ_QUESTIONS.length}: أكمل الفراغ بالصيغة المصرّفة الصحيحة للفعل:
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-sans text-sm font-black text-sky-300 dir-ltr text-left">
                  {QUIZ_QUESTIONS[currentQuizIdx].sentenceFr}
                  <span className="text-xs text-slate-400 block mt-1 font-mono">
                    [{QUIZ_QUESTIONS[currentQuizIdx].verbName}]
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 dir-ltr">
                  {QUIZ_QUESTIONS[currentQuizIdx].options.map((opt) => {
                    const isSelected = userAnswer === opt;
                    const isCorrect = opt === QUIZ_QUESTIONS[currentQuizIdx].correct;
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          setUserAnswer(opt);
                          if (isCorrect) {
                            setQuizScore((s) => s + 10);
                          }
                          handleSpeak(opt);
                        }}
                        className={`p-3 rounded-xl border font-sans text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500'
                              : 'bg-rose-950 border-rose-400 text-rose-200'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {userAnswer !== null && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
                    <p className="text-slate-200 font-bold">{QUIZ_QUESTIONS[currentQuizIdx].explanation}</p>
                    <button
                      onClick={() => {
                        setUserAnswer(null);
                        setCurrentQuizIdx((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
                      }}
                      className="px-4 py-1.5 bg-amber-500 text-slate-950 font-black rounded-lg text-xs cursor-pointer"
                    >
                      السؤال التالي ➔
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VOCABULAIRE & MATCHING */}
      {activeTab === 'vocab' && (
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-amber-300">📚 المفردات والمطابقة للمراحل المتقدمة</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            استكشف مفردات الدروس والمشاريع المقررة (الحيوانات، المهن، الكوارث الطبيعية) واستمع لنطقها.
          </p>
        </div>
      )}

      {/* TAB 3: DIALOGUES */}
      {activeTab === 'dialogue' && (
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-emerald-300">🗣️ الحوارات الصوتية التفاعلية</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            استمع للحوارات الرسمية المقررة في كتاب اللغة الفرنسية (زيارة حديقة التجارب بالحامة، التعبير عن المهنة المستقبليّة).
          </p>
        </div>
      )}

      {/* TAB 4: GRAMMAIRE */}
      {activeTab === 'grammar_fix' && (
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-purple-300">🔍 قواعد اللغة وتصحيح الأخطاء</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            تدرب على قواعد التوافق بين الفاعل والفعل (Accord du sujet et du verbe) وصياغة الجملة السليمة.
          </p>
        </div>
      )}
    </div>
  );
};
