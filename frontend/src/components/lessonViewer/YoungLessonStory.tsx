import React from 'react';
import { motion } from 'motion/react';
import { CourseLesson } from '../../types';
import { stripArabicTashkeel } from '../../utils/textFormatter';
import { parsePlayfulSnippet, splitPlayfulLines, stripLatinGlosses } from './youngLessonLayout';
import { TapSpeakButton } from './TapSpeakButton';

interface YoungLessonStoryProps {
  lesson: CourseLesson;
  tashkeelEnabled?: boolean;
  speakingKey?: string | null;
  onSpeak?: (key: string, text: string) => void;
}

const spring = { type: 'spring' as const, stiffness: 400, damping: 22 };
const FALLBACK_SPEAK = (_key: string, _text: string) => {};

export const YoungLessonStory: React.FC<YoungLessonStoryProps> = ({
  lesson,
  tashkeelEnabled = true,
  speakingKey = null,
  onSpeak = FALLBACK_SPEAK,
}) => {
  const show = (raw: string) => {
    const withMarks = tashkeelEnabled ? raw : stripArabicTashkeel(raw);
    return stripLatinGlosses(withMarks);
  };

  const discoveryLines = lesson.discoveryAr ? splitPlayfulLines(show(lesson.discoveryAr)) : [];
  const cards = (lesson.rulesAr || []).slice(0, 8);
  const example = lesson.examplesAr?.[0];
  // Nearly every 1AP title already carries a real emoji ("الأَشْكَالُ: ... 🔺"). Reusing it as the
  // last-resort fallback keeps any snippet without its own emoji on-topic instead of landing on an
  // unrelated DEFAULT_TILES pick (a star for a bike wheel, a clover for "3 apples"...).
  const themeEmoji = parsePlayfulSnippet(show(lesson.titleAr)).emoji;

  return (
    <div className="space-y-6" dir="rtl" data-lesson-story="1ap">
      {discoveryLines.map((line, i) => {
        const snippet = parsePlayfulSnippet(line, i, themeEmoji);
        const key = `discovery-${i}`;
        return (
          <PlayfulSpeakCard
            key={key}
            snippetKey={key}
            snippet={snippet}
            speakingKey={speakingKey}
            onSpeak={onSpeak}
            tone="sky"
            tashkeelEnabled={tashkeelEnabled}
          />
        );
      })}

      {cards.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {cards.map((rule, i) => {
            const snippet = parsePlayfulSnippet(show(rule), i + 2, themeEmoji);
            const key = `rule-${i}`;
            return (
              <PlayfulSpeakCard
                key={key}
                snippetKey={key}
                snippet={snippet}
                speakingKey={speakingKey}
                onSpeak={onSpeak}
                tone="white"
                tashkeelEnabled={tashkeelEnabled}
              />
            );
          })}
        </div>
      )}

      {example && (() => {
        const problemSnippet = parsePlayfulSnippet(show(example.problem), 6, themeEmoji);
        const solutionSnippet = parsePlayfulSnippet(show(example.solution), 7, problemSnippet.emoji);
        return (
          <div className="space-y-3">
            <PlayfulSpeakCard
              snippetKey="example-problem"
              snippet={problemSnippet}
              speakingKey={speakingKey}
              onSpeak={onSpeak}
              tone="amber"
              tashkeelEnabled={tashkeelEnabled}
            />
            <PlayfulSpeakCard
              snippetKey="example-solution"
              snippet={solutionSnippet}
              speakingKey={speakingKey}
              onSpeak={onSpeak}
              tone="emerald"
              tashkeelEnabled={tashkeelEnabled}
            />
          </div>
        );
      })()}
    </div>
  );
};

const TONE: Record<string, string> = {
  sky: 'bg-sky-50 border-sky-100',
  white: 'bg-white border-[var(--app-card-border)]',
  amber: 'bg-amber-50 border-amber-100',
  emerald: 'bg-emerald-50 border-emerald-100',
};

const PlayfulSpeakCard: React.FC<{
  snippetKey: string;
  snippet: ReturnType<typeof parsePlayfulSnippet>;
  speakingKey: string | null;
  onSpeak: (key: string, text: string) => void;
  tone: keyof typeof TONE;
  tashkeelEnabled: boolean;
}> = ({ snippetKey, snippet, speakingKey, onSpeak, tone, tashkeelEnabled }) => {
  const headline = tashkeelEnabled ? snippet.headline : stripArabicTashkeel(snippet.headline);
  const whisper = snippet.whisper
    ? tashkeelEnabled
      ? snippet.whisper
      : stripArabicTashkeel(snippet.whisper)
    : '';
  const visual = snippet.letterVisual ?? snippet.emoji;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={spring}
      className={`rounded-3xl border px-3 py-4 sm:px-5 sm:py-5 flex items-center gap-3 min-h-[6.5rem] min-w-0 shadow-sm ${TONE[tone]}`}
    >
      <TapSpeakButton
        snippetKey={snippetKey}
        text={snippet.speak}
        speakingKey={speakingKey}
        onSpeak={onSpeak}
        size="lg"
      />
      {/* Display only — the loudspeaker button above is the single, unambiguous way to listen.
          No onClick here: a duplicate tap zone doing the same thing as the button made a child
          reasonably wonder whether tapping the picture/text was a selectable answer. */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 text-center min-w-0">
        <span className="text-4xl sm:text-5xl leading-none" aria-hidden="true">
          {visual}
        </span>
        <p className="text-xl sm:text-2xl font-black text-[#1E293B] leading-snug break-words">{headline}</p>
        {whisper ? (
          <p className="text-sm font-bold text-slate-500 leading-snug line-clamp-2">{whisper}</p>
        ) : null}
      </div>
    </motion.div>
  );
};
