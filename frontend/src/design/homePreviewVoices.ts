import welcome from '../assets/design/home-v3/voices/welcome.mp3';
import stories from '../assets/design/home-v3/voices/stories.mp3';
import workshop from '../assets/design/home-v3/voices/workshop.mp3';
import games from '../assets/design/home-v3/voices/games.mp3';
import butterfly from '../assets/design/home-v3/voices/butterfly.mp3';
import discovery from '../assets/design/home-v3/voices/discovery.mp3';
export const HOME_VOICES = {
  "welcome": {
    "text": "مَرْحَبًا! أَنَا دِيدُو، صَدِيقُكَ فِي مَسِيد. سَأُرِيكَ أَمَاكِنَ اللَّعِبِ وَالتَّعَلُّمِ. هَيَّا نَبْدَأْ!",
    "durationMs": 6750,
    "src": welcome
  },
  "stories": {
    "text": "هَذِهِ دَارُ الحِكَايَاتِ! نَسْتَمِعُ، نَقْرَأُ، وَنَكْتَشِفُ أَشْيَاءَ جَدِيدَةً. هَلْ نَدْخُلُ؟",
    "durationMs": 8800,
    "src": stories
  },
  "workshop": {
    "text": "فِي وَرْشَةِ الاِكْتِشَافِ، نُجَرِّبُ بِأَيْدِينَا وَنُفَكِّرُ مَعًا. مَاذَا سَنَكْتَشِفُ اليَوْمَ؟",
    "durationMs": 8050,
    "src": workshop
  },
  "games": {
    "text": "هَذِهِ حَدِيقَةُ الأَلْعَابِ! نَلْعَبُ، نُلَاحِظُ، وَنَتَعَلَّمُ. هَيَّا نَنْطَلِقْ!",
    "durationMs": 7450,
    "src": games
  },
  "butterfly": {
    "text": "وَجَدْتَ الفَرَاشَةَ! أَنْتَ مُسْتَكْشِفٌ رَائِعٌ!",
    "durationMs": 4200,
    "src": butterfly
  },
  "discovery": {
    "text": "وَاو! اِكْتِشَافٌ جَمِيلٌ! أَحْسَنْتَ يَا صَدِيقِي!",
    "durationMs": 5150,
    "src": discovery
  }
} as const;
