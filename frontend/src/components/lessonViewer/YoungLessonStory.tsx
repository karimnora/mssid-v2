import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Home } from 'lucide-react';
import { CourseLesson } from '../../types';
import { stripArabicTashkeel } from '../../utils/textFormatter';
import { parsePlayfulSnippet, splitPlayfulLines, stripLatinGlosses } from './youngLessonLayout';
import { TapSpeakButton } from './TapSpeakButton';
import { ArabicReadingStoryPanel } from './ArabicReadingStoryPanel';

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
  const vocabulary = (lesson.detailedCourse?.vocabulary || []).slice(0, 6);
  const homeHint = lesson.detailedCourse?.visualizationHintAr;
  const takeaway = lesson.detailedCourse?.takeawayAr;
  const [showHomeActivity, setShowHomeActivity] = useState(false);
  // Nearly every 1AP title already carries a real emoji ("الأَشْكَالُ: ... 🔺"). Reusing it as the
  // last-resort fallback keeps any snippet without its own emoji on-topic instead of landing on an
  // unrelated DEFAULT_TILES pick. However, for multi-item titles (e.g. letter groups "🍌🐝🍋"),
  // a single emoji must not bleed across distinct concepts.
  const titleEmojis = show(lesson.titleAr).match(/\p{Extended_Pictographic}/gu) || [];
  const isMultiItemTitle = titleEmojis.length > 1;
  const themeEmoji = isMultiItemTitle ? undefined : parsePlayfulSnippet(show(lesson.titleAr)).emoji;

  return (
    <div className="space-y-6" dir="rtl" data-lesson-story="1ap">
      {lesson.readingStory && (
        <ArabicReadingStoryPanel story={lesson.readingStory} renderArabicText={text => show(text ?? '')} speakingKey={speakingKey} onSpeak={onSpeak} />
      )}
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

      {vocabulary.length > 0 && (
        <div className="space-y-3" data-lesson-vocab="1ap">
          <h3 className="text-sm font-black text-slate-700 text-center">كَلِمَاتٌ جَدِيدَةٌ 📚</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {vocabulary.map((entry, i) => {
              const termShown = show(entry.termAr);
              const defShown = show(entry.definitionAr);
              const snippet = parsePlayfulSnippet(termShown, i + 10, themeEmoji);
              const key = `vocab-${i}`;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-[#E7E2D7] bg-white px-3 py-4 flex items-center gap-3 min-h-[5.5rem] min-w-0 shadow-sm"
                >
                  <TapSpeakButton
                    snippetKey={key}
                    text={snippet.speak || termShown}
                    speakingKey={speakingKey}
                    onSpeak={onSpeak}
                    size="lg"
                  />
                  <div className="flex-1 flex flex-col items-center justify-center gap-0.5 text-center min-w-0">
                    <span className="text-3xl sm:text-4xl leading-none" aria-hidden="true">
                      {snippet.letterVisual ?? snippet.emoji}
                    </span>
                    <p className="text-lg sm:text-xl font-black text-[#1E293B] leading-snug break-words">
                      {snippet.headline}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 leading-snug line-clamp-2">{defShown}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {example && (() => {
        const problemSnippet = parsePlayfulSnippet(show(example.problem), 6, themeEmoji);
        // "كم عدد التفاحات؟ 🍎🍎🍎" → "3 تفاحات": the answer shows the same three apples only when its
        // number matches the picture; otherwise a single picture, never a wrong quantity.
        const problemPictures = problemSnippet.emoji.match(/\p{Extended_Pictographic}\uFE0F?/gu) ?? [];
        const answerNumber = Number(show(example.solution).match(/\d+/)?.[0]);
        const sameQuantity = problemPictures.length > 1 && problemPictures.length === answerNumber && !problemSnippet.emoji.includes(' ');
        const siblingEmoji = problemSnippet.letterVisual ? undefined : sameQuantity ? problemSnippet.emoji : problemPictures[0] ?? problemSnippet.emoji;
        const solutionSnippet = parsePlayfulSnippet(show(example.solution), 7, siblingEmoji);
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

      {homeHint && (
        <div className="rounded-3xl border border-[#E7E2D7] bg-[#FFF8E7] overflow-hidden" data-lesson-home-activity="1ap">
          <button
            type="button"
            onClick={() => setShowHomeActivity((v) => !v)}
            aria-expanded={showHomeActivity}
            className="w-full min-h-[60px] flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-[#5A3B00] cursor-pointer"
          >
            <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>نشاط مع وليّ الأمر 🏠</span>
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${showHomeActivity ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence initial={false}>
            {showHomeActivity && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3 px-4 pb-4 border-t border-[#F5D98A]/60 pt-3">
                  <TapSpeakButton
                    snippetKey="home-activity"
                    text={show(homeHint)}
                    speakingKey={speakingKey}
                    onSpeak={onSpeak}
                    size="lg"
                  />
                  <p className="text-sm font-bold text-[#5A3B00] leading-relaxed flex-1 min-w-0">{show(homeHint)}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {takeaway && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          data-lesson-takeaway="1ap"
          className="flex items-start gap-3 rounded-3xl border border-[#F5D98A] bg-[#FFF8E7] px-4 py-4 min-h-12"
        >
          <TapSpeakButton
            snippetKey="takeaway"
            text={show(takeaway)}
            speakingKey={speakingKey}
            onSpeak={onSpeak}
            size="lg"
          />
          <p className="text-base sm:text-lg font-black text-[#5A3B00] leading-snug flex-1 min-w-0">
            <span className="mr-1" aria-hidden="true">💡</span>
            أتذكر: {show(takeaway)}
          </p>
        </motion.div>
      )}
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
  // Several pictures to count (🍎🍎🍎🍎🍎) must stay on screen: smaller, and allowed to wrap.
  const manyPictures = (visual.match(/\p{Extended_Pictographic}/gu) ?? []).length > 2;

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
        <span data-playful-visual className={`${manyPictures ? 'text-2xl sm:text-3xl tracking-wide break-words max-w-full' : 'text-4xl sm:text-5xl'} leading-tight font-black text-slate-800 dark:text-white inline-block py-0.5 select-none`} aria-hidden="true">
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
