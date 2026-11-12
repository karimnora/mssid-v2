import React from 'react';
import { MotionConfig, motion, useReducedMotion } from 'motion/react';
import { Didou3DAvatar, type Didou3DAvatarProps } from './Didou3DAvatar';
import greeting from '../assets/v2-reused/didou-greet.webp';
import pointing from '../assets/v2-reused/didou-point.webp';
import cheering from '../assets/v2-reused/didou-cheer.webp';

type Props = Didou3DAvatarProps & { stage: 1 | 2 | 3; label: string };

/** Keep the actual equipped clothes/species; the illustrated fennec is for the default outfit. */
export function DidouPortrait({ stage, label, size = 'lg', ...avatar }: Props) {
  const reduced = useReducedMotion();
  const illustrated = (avatar.species ?? 'fennec') === 'fennec' && (avatar.outfitId ?? 'default') === 'default';
  const celebrating = avatar.isEating || avatar.mood === 'celebrating' || stage === 3;
  const source = celebrating ? cheering : stage === 1 ? greeting : pointing;
  return <MotionConfig reducedMotion="user">
    <div role="img" aria-label={label} className={`didou-portrait didou-portrait-${size}`} data-didou-stage={stage}>
      <div className="didou-portrait-halo" aria-hidden="true" />
      <motion.div className="didou-portrait-character" aria-hidden="true"
        style={{ width: `${stage === 1 ? 76 : stage === 2 ? 88 : 100}%` }}
        animate={!reduced && avatar.isEating ? { rotate: [0, -4, 4, 0] } : { rotate: 0 }}
        transition={{ duration: 0.65 }}>
        {illustrated ? <img src={source} alt="" width={440} height={640} decoding="async" /> : <Didou3DAvatar {...avatar} size={size} />}
      </motion.div>
      {stage === 3 && <span className="didou-portrait-crown" aria-hidden="true">👑</span>}
      {avatar.isEating && <span className="didou-portrait-food" aria-hidden="true">{avatar.eatingFoodIcon ?? '🌴'}</span>}
    </div>
  </MotionConfig>;
}
