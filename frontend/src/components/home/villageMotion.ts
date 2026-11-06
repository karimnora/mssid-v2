/** Durations in seconds. Only transform/opacity; the motion preference overrides every preset. */
export const motionTokens = {
  feedback: 0.18,
  entrance: 0.32,
  float: 2.4,
  breath: 1.4,
  idle: 3.8,
  cheer: 0.65,
  reactionHold: 1.8,
  butterflyWing: 0.7,
  beeWing: 0.5,
  birdWing: 0.85,
  steps: 1.2,
  flight: 4.8,
  exit: 0.18,
  hover: 0.18,
} as const;
export const springs = {
  press: { type: "spring" as const, stiffness: 340, damping: 25 },
};
