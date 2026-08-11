import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  Subtitles,
  Gauge,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export interface VideoQuestion {
  id: string;
  atSecond: number;
  questionAr: string;
  options: string[];
  correctIdx: number;
  explanationAr?: string;
}

interface InteractiveVideoPlayerProps {
  videoUrl: string;
  subtitleUrl?: string;
  titleAr: string;
  questions?: VideoQuestion[];
  onComplete?: (score: number) => void;
}

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2] as const;

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  videoUrl,
  subtitleUrl,
  titleAr,
  questions = [],
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<(typeof SPEED_OPTIONS)[number]>(1);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [triggeredIds, setTriggeredIds] = useState<Set<string>>(new Set());
  const [activeQuestion, setActiveQuestion] = useState<VideoQuestion | null>(null);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const sortedQuestions = useMemo(() => [...questions].sort((a, b) => a.atSecond - b.atSecond), [questions]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);

    if (activeQuestion) return; // already paused for a question
    const due = sortedQuestions.find((q) => !triggeredIds.has(q.id) && video.currentTime >= q.atSecond);
    if (due) {
      video.pause();
      setActiveQuestion(due);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
      setTriggeredIds((prev) => new Set(prev).add(due.id));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const t = Number(e.target.value);
    video.currentTime = t;
    setCurrentTime(t);
  };

  const changeSpeed = (rate: (typeof SPEED_OPTIONS)[number]) => {
    const video = videoRef.current;
    if (video) video.playbackRate = rate;
    setPlaybackRate(rate);
    setIsSpeedMenuOpen(false);
  };

  const toggleSubtitles = () => {
    const video = videoRef.current;
    if (video && video.textTracks.length > 0) {
      video.textTracks[0].mode = subtitlesOn ? 'hidden' : 'showing';
    }
    setSubtitlesOn((v) => !v);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const confirmAnswer = () => {
    if (selectedOptionIdx === null || !activeQuestion) return;
    setIsAnswered(true);
    if (selectedOptionIdx === activeQuestion.correctIdx) {
      setScore((s) => s + 10);
    }
  };

  const resumeVideo = () => {
    const wasLast = sortedQuestions[sortedQuestions.length - 1]?.id === activeQuestion?.id;
    setActiveQuestion(null);
    setSelectedOptionIdx(null);
    setIsAnswered(false);
    videoRef.current?.play();
    if (wasLast && onComplete) onComplete(score);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-3 sm:p-5 space-y-3 dir-rtl" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-100">{titleAr}</h3>
        {sortedQuestions.length > 0 && (
          <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/30">
            {triggeredIds.size} / {sortedQuestions.length} أسئلة • {score} نقطة
          </span>
        )}
      </div>

      <div ref={containerRef} className="relative bg-black rounded-2xl overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full max-h-[420px] bg-black"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onClick={togglePlay}
        >
          {subtitleUrl && <track kind="subtitles" src={subtitleUrl} srcLang="ar" label="العربية" default />}
        </video>

        {/* Question overlay: pauses playback until answered */}
        {activeQuestion && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-xs">
                <HelpCircle className="w-4 h-4" />
                <span>سؤال سريع! ⏸️ الفيديو متوقف مؤقتاً</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-100">{activeQuestion.questionAr}</p>

              <div className="grid grid-cols-1 gap-2">
                {activeQuestion.options.map((opt, idx) => {
                  let style = 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700';
                  if (isAnswered) {
                    if (idx === activeQuestion.correctIdx) style = 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold';
                    else if (idx === selectedOptionIdx) style = 'bg-rose-950 border-rose-500 text-rose-300';
                    else style = 'bg-slate-900 border-slate-800 text-slate-500';
                  } else if (idx === selectedOptionIdx) {
                    style = 'bg-indigo-600 border-indigo-400 text-white font-bold';
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => !isAnswered && setSelectedOptionIdx(idx)}
                      className={`text-right p-2.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && idx === activeQuestion.correctIdx && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isAnswered && idx === selectedOptionIdx && idx !== activeQuestion.correctIdx && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && activeQuestion.explanationAr && (
                <div className="text-[11px] text-slate-300 bg-slate-950 border border-slate-800 p-2.5 rounded-xl leading-relaxed">
                  💡 {activeQuestion.explanationAr}
                </div>
              )}

              {!isAnswered ? (
                <button
                  onClick={confirmAnswer}
                  disabled={selectedOptionIdx === null}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  تحقق من الإجابة
                </button>
              ) : (
                <button
                  onClick={resumeVideo}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span>متابعة مشاهدة الفيديو</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 w-9 shrink-0" dir="ltr">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 accent-indigo-500 cursor-pointer"
            style={{ background: `linear-gradient(to left, #6366f1 ${progressPercent}%, #334155 ${progressPercent}%)` }}
          />
          <span className="text-[10px] font-mono text-slate-400 w-9 shrink-0" dir="ltr">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePlay}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {subtitleUrl && (
              <button
                type="button"
                onClick={toggleSubtitles}
                className={`p-2.5 rounded-xl border cursor-pointer ${subtitlesOn ? 'bg-slate-800 border-indigo-500/50 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                title="ترجمة نصية"
              >
                <Subtitles className="w-4 h-4" />
              </button>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSpeedMenuOpen((v) => !v)}
                className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer flex items-center gap-1"
                title="سرعة العرض"
              >
                <Gauge className="w-4 h-4" />
                <span className="text-[10px] font-bold">{playbackRate}x</span>
              </button>
              {isSpeedMenuOpen && (
                <div className="absolute bottom-full mb-2 right-0 bg-slate-900 border border-slate-700 rounded-xl p-1.5 w-20 z-10 shadow-xl">
                  {SPEED_OPTIONS.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => changeSpeed(rate)}
                      className={`w-full text-center px-2 py-1 rounded-lg text-xs ${playbackRate === rate ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
