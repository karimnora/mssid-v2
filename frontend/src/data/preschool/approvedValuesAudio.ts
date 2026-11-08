import type { PreschoolLanguage } from './types';

export interface ApprovedValuesRecording {
  language: PreschoolLanguage;
  activityId: 'values-bismillah' | 'values-alhamdulillah';
  kind: 'prompt' | 'success';
  text: string;
  src: string;
  durationMs: number;
  sha256: string;
}
/** Supplied ElevenLabs clips. User-approved synthetic exception, 2026-11-08, for these two activities only. */
export const APPROVED_VALUES_RECORDINGS: readonly ApprovedValuesRecording[] = [
  {
    "language": "ar",
    "activityId": "values-bismillah",
    "kind": "prompt",
    "text": "سَنَأْكُلُ! نَقُولُ بِسْمِ اللَّهِ. اِلْمَسِ التُّفَّاحَة!",
    "src": "/sounds/preschool/ar/values-bismillah-approved-prompt-4d4945869703.mp3",
    "durationMs": 4284,
    "sha256": "4d49458697035e9a60a637d3856e18ebba700acbecc4215310e45bcd47c65261"
  },
  {
    "language": "ar",
    "activityId": "values-bismillah",
    "kind": "success",
    "text": "بِسْمِ اللَّهِ! أَحْسَنْت!",
    "src": "/sounds/preschool/ar/values-bismillah-approved-success-d3c251b8f2e8.mp3",
    "durationMs": 2273,
    "sha256": "d3c251b8f2e8c3639f538e9aa949b775465a145155ccd47b6d9c7ed30de05869"
  },
  {
    "language": "ar",
    "activityId": "values-alhamdulillah",
    "kind": "prompt",
    "text": "انْتَهَيْنَا مِنَ الأَكْل! نَقُولُ الحَمْدُ لِلَّهِ. اِلْمَسِ اليَدَيْن!",
    "src": "/sounds/preschool/ar/values-alhamdulillah-approved-prompt-386e72892ab7.mp3",
    "durationMs": 5068,
    "sha256": "386e72892ab7994af05d7af99cc10a9a424197eccb5f61869b0ba8e4b8ee4636"
  },
  {
    "language": "ar",
    "activityId": "values-alhamdulillah",
    "kind": "success",
    "text": "الحَمْدُ لِلَّهِ! شُكْراً!",
    "src": "/sounds/preschool/ar/values-alhamdulillah-approved-success-97a011396abb.mp3",
    "durationMs": 2429,
    "sha256": "97a011396abb6a5f7cc4dd9dd0099189912e990e6e83d24ab35f2855b1f9b477"
  },
  {
    "language": "fr",
    "activityId": "values-bismillah",
    "kind": "prompt",
    "text": "On va manger ! On dit Bismillah. Touche la pomme !",
    "src": "/sounds/preschool/fr/values-bismillah-approved-prompt-e3761dcce64c.mp3",
    "durationMs": 3631,
    "sha256": "e3761dcce64c31e4618ff25d8f8c851403e68f1d89428ff7cd3fd44439615fee"
  },
  {
    "language": "fr",
    "activityId": "values-bismillah",
    "kind": "success",
    "text": "Bismillah ! Bravo !",
    "src": "/sounds/preschool/fr/values-bismillah-approved-success-bbcec19644b2.mp3",
    "durationMs": 1959,
    "sha256": "bbcec19644b2333898dd6735f0ee49b8a141414231b2e0aeebdcd79f634e4bdf"
  },
  {
    "language": "fr",
    "activityId": "values-alhamdulillah",
    "kind": "prompt",
    "text": "On a fini de manger ! On dit Alhamdulillah. Touche les deux mains !",
    "src": "/sounds/preschool/fr/values-alhamdulillah-approved-prompt-5dc0c0e4105a.mp3",
    "durationMs": 4598,
    "sha256": "5dc0c0e4105aff17e9c76cfb66431a93025667c48319bf95972c6985ec038d99"
  },
  {
    "language": "fr",
    "activityId": "values-alhamdulillah",
    "kind": "success",
    "text": "Alhamdulillah ! Merci !",
    "src": "/sounds/preschool/fr/values-alhamdulillah-approved-success-ebfb520a4fae.mp3",
    "durationMs": 2116,
    "sha256": "ebfb520a4faed8e3bdf885886cd0d39b97304dd7df6ea30d2b59a5135911b977"
  },
  {
    "language": "en",
    "activityId": "values-bismillah",
    "kind": "prompt",
    "text": "We are going to eat! We say Bismillah. Touch the apple!",
    "src": "/sounds/preschool/en/values-bismillah-approved-prompt-ec48cfb2e081.mp3",
    "durationMs": 4362,
    "sha256": "ec48cfb2e081129d3776ce020364734c2a298691dda07364afe8e72ba54fc870"
  },
  {
    "language": "en",
    "activityId": "values-bismillah",
    "kind": "success",
    "text": "Bismillah! Well done!",
    "src": "/sounds/preschool/en/values-bismillah-approved-success-293cd4bf81ea.mp3",
    "durationMs": 2586,
    "sha256": "293cd4bf81ea49db39cfcc8a9ae0c448d8e638cf5d5c7747824bd57951ab766d"
  },
  {
    "language": "en",
    "activityId": "values-alhamdulillah",
    "kind": "prompt",
    "text": "We finished eating! We say Alhamdulillah. Touch the two hands!",
    "src": "/sounds/preschool/en/values-alhamdulillah-approved-prompt-993895a3e816.mp3",
    "durationMs": 4676,
    "sha256": "993895a3e8164cfd1964030318cc2746af54e0578cfff1f1407f15fd2fb3f432"
  },
  {
    "language": "en",
    "activityId": "values-alhamdulillah",
    "kind": "success",
    "text": "Alhamdulillah! Thank you!",
    "src": "/sounds/preschool/en/values-alhamdulillah-approved-success-b3c39f892a9e.mp3",
    "durationMs": 2429,
    "sha256": "b3c39f892a9eec75e44aacae7efb90047ccef95bb596b26ee10dcc6c87ee0913"
  }
];
