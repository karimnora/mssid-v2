import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users } from 'lucide-react';
import { ReadingStory } from '../../types';
import { TapSpeakButton } from './TapSpeakButton';

interface ArabicReadingStoryPanelProps {
  story: ReadingStory;
  renderArabicText: (text: string | undefined | null) => string;
  speakingKey?: string | null;
  onSpeak?: (key: string, text: string) => void;
}

const spring = { type: 'spring' as const, stiffness: 400, damping: 22 };

export const ArabicReadingStoryPanel: React.FC<ArabicReadingStoryPanelProps> = ({
  story,
  renderArabicText,
  speakingKey = null,
  onSpeak,
}) => (
  <div className="space-y-4" dir="rtl" data-reading-story="2ap">
    <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-sm">
      <BookOpen className="w-4 h-4 shrink-0" />
      <span>{story.titleAr ?? 'اقرأ النص مشكولاً'}</span>
    </div>

    {story.characters.length > 0 && (
      <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-4 space-y-2" data-reading-characters>
        <div className="flex items-center gap-2 text-xs font-black text-indigo-800">
          <Users className="w-4 h-4" />
          <span>شَخَصِيَّاتُ النَّصِّ</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {story.characters.map((ch) => (
            <div
              key={ch.nameAr}
              className="flex items-center gap-2 bg-white border border-indigo-100 rounded-2xl px-3 py-2 min-h-12"
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {ch.emoji}
              </span>
              <div className="text-right min-w-0">
                <p className="text-sm font-black text-slate-900">{renderArabicText(ch.nameAr)}</p>
                <p className="text-[11px] font-bold text-slate-500">{renderArabicText(ch.roleAr)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="grid gap-3 sm:grid-cols-2">
      {story.scenes.map((scene, i) => (
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: i * 0.04 }}
          className="rounded-3xl border border-[#E7E2D7] bg-white p-4 flex items-start gap-3 min-h-[5.5rem] shadow-sm"
          data-reading-scene={scene.id}
        >
          {onSpeak ? (
            <TapSpeakButton
              snippetKey={`scene-${scene.id}`}
              text={scene.textAr}
              speakingKey={speakingKey}
              onSpeak={onSpeak}
              size="md"
            />
          ) : null}
          <div className="flex-1 min-w-0 text-center sm:text-right space-y-1">
            <span className="text-3xl leading-none block" aria-hidden="true">
              {scene.emoji}
            </span>
            <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
              {renderArabicText(scene.textAr)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
