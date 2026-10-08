import React from 'react';
import { PreschoolActivity, PreschoolLanguage } from '../../data/preschool/types';
import { catalogSurahByName } from '../../data/quranShortSurahsCatalog';
import { QuranMemorizePlayer } from '../QuranMemorizePlayer';

export const PreschoolQuranListen: React.FC<{
  activity: PreschoolActivity;
  language: PreschoolLanguage;
  onComplete: () => void;
}> = ({ activity, onComplete }) => {
  const nameAr = activity.visualAssets.quranSurahAr;
  const surah = nameAr ? catalogSurahByName(nameAr) : undefined;
  if (!surah) return null;

  return (
    <div className="w-full max-w-lg mx-auto" data-preschool-quran={surah.id}>
      <QuranMemorizePlayer
        verses={surah.verses}
        variant="kid"
        onSurahComplete={onComplete}
      />
    </div>
  );
};
