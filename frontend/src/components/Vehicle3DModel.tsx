import React, { useId } from 'react';
import { motion } from 'motion/react';

export interface Vehicle3DModelProps {
  vehicleId: string;
  emoji: string;
  color: string;
  isRacing?: boolean;
  turbo?: boolean;
  viewPerspective?: '2d' | '3d';
}

export const Vehicle3DModel: React.FC<Vehicle3DModelProps> = ({
  vehicleId,
  emoji,
  color,
  isRacing = false,
  turbo = false,
  viewPerspective = '3d',
}) => {
  const is3D = viewPerspective === '3d';
  // Every gradient id below must be unique per rendered instance, not just per vehicleId — a race
  // with the same vehicle (or a taxi + sport_car, which share the window/wheel gradients) on both
  // lanes previously duplicated these ids across two <svg> elements in the same document, so the
  // browser resolved every url(#...) reference to whichever definition it saw first, corrupting
  // the second vehicle's colors (wrong windows/wheels, or a train/plane rendered in the other's
  // gradient). useId() ties each gradient to this specific component instance.
  const uid = useId();

  // Render specialized vector 3D models for key vehicles
  const renderSpecialized3D = () => {
    switch (vehicleId) {
      case 'sport_car':
      case 'taxi': {
        const isTaxi = vehicleId === 'taxi';
        const carColor = isTaxi ? '#eab308' : '#ef4444';
        const roofColor = isTaxi ? '#ca8a04' : '#b91c1c';

        return (
          <div className="relative w-28 h-16 flex items-center justify-center [transform-style:preserve-3d]">
            {/* 3D Car Vector SVG */}
            <svg viewBox="0 0 140 70" className="w-full h-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.6)]">
              <defs>
                <linearGradient id={`carBodyGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={carColor} />
                  <stop offset="100%" stopColor={roofColor} />
                </linearGradient>
                <linearGradient id={`windowGrad-${uid}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#bae6fd" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <radialGradient id={`wheelGrad-${uid}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="40%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
              </defs>

              {/* Headlights beam when racing */}
              {isRacing && (
                <path d="M 125 40 L 160 30 L 160 55 L 125 48 Z" fill="#fef08a" opacity="0.4" />
              )}

              {/* Main Body Aero Chassis */}
              <path
                d="M 15 45 C 10 45 5 40 10 32 C 15 25 35 25 45 20 C 55 12 85 10 105 18 C 115 22 125 28 130 36 C 135 44 130 46 125 46 Z"
                fill={`url(#carBodyGrad-${uid})`}
                stroke="#1e293b"
                strokeWidth="1.5"
              />

              {/* Cabin Glass Windshield */}
              <path
                d="M 50 21 C 58 14 82 12 98 19 C 105 23 110 28 114 34 L 46 34 Z"
                fill={`url(#windowGrad-${uid})`}
                stroke="#0f172a"
                strokeWidth="1"
              />

              {/* Taxi Roof Sign */}
              {isTaxi && (
                <g>
                  <rect x="70" y="6" width="22" height="7" rx="2" fill="#ffffff" stroke="#000" strokeWidth="1" />
                  <text x="73" y="12" fontSize="5" fontWeight="900" fill="#000">TAXI</text>
                </g>
              )}

              {/* Side racing strip */}
              {!isTaxi && (
                <path d="M 20 34 L 125 34 L 120 37 L 22 37 Z" fill="#ffffff" opacity="0.8" />
              )}

              {/* Front and Back Wheels with rotation effect */}
              <g>
                {/* Back Wheel */}
                <circle cx="35" cy="46" r="11" fill={`url(#wheelGrad-${uid})`} stroke="#000" strokeWidth="2" />
                <circle cx="35" cy="46" r="4" fill="#ffffff" />
                {isRacing && (
                  <line x1="35" y1="36" x2="35" y2="56" stroke="#fff" strokeWidth="1" strokeDasharray="2 2" />
                )}

                {/* Front Wheel */}
                <circle cx="105" cy="46" r="11" fill={`url(#wheelGrad-${uid})`} stroke="#000" strokeWidth="2" />
                <circle cx="105" cy="46" r="4" fill="#ffffff" />
                {isRacing && (
                  <line x1="105" y1="36" x2="105" y2="56" stroke="#fff" strokeWidth="1" strokeDasharray="2 2" />
                )}
              </g>

              {/* Tail light & Headlight */}
              <rect x="7" y="32" width="4" height="6" rx="1" fill="#ef4444" />
              <rect x="126" y="36" width="5" height="7" rx="1" fill="#facc15" />
            </svg>
          </div>
        );
      }

      case 'coradia_train': {
        return (
          <div className="relative w-32 h-16 flex items-center justify-center [transform-style:preserve-3d]">
            <svg viewBox="0 0 160 70" className="w-full h-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.6)]">
              <defs>
                <linearGradient id={`coradiaGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="40%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              {/* Train Sleek Aerodynamic Body */}
              <path
                d="M 10 44 L 10 18 C 10 18 100 16 130 20 C 145 24 155 35 155 44 Z"
                fill={`url(#coradiaGrad-${uid})`}
                stroke="#475569"
                strokeWidth="1.5"
              />
              {/* Green Algerian Railway Stripe (SNTF) */}
              <path d="M 10 30 L 148 30 L 140 34 L 10 34 Z" fill="#16a34a" />
              <path d="M 10 35 L 140 35 L 135 38 L 10 38 Z" fill="#dc2626" />

              {/* Windows */}
              <rect x="25" y="20" width="14" height="7" rx="1" fill="#0284c7" />
              <rect x="45" y="20" width="14" height="7" rx="1" fill="#0284c7" />
              <rect x="65" y="20" width="14" height="7" rx="1" fill="#0284c7" />
              <rect x="85" y="20" width="14" height="7" rx="1" fill="#0284c7" />
              {/* Driver Windshield */}
              <path d="M 115 21 L 140 23 L 138 31 L 115 31 Z" fill="#0f172a" />

              {/* Wheels / Bogies */}
              <circle cx="30" cy="46" r="6" fill="#1e293b" />
              <circle cx="45" cy="46" r="6" fill="#1e293b" />
              <circle cx="105" cy="46" r="6" fill="#1e293b" />
              <circle cx="120" cy="46" r="6" fill="#1e293b" />
            </svg>
          </div>
        );
      }

      case 'city_bus': {
        return (
          <div className="relative w-28 h-16 flex items-center justify-center [transform-style:preserve-3d]">
            <svg viewBox="0 0 130 70" className="w-full h-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.6)]">
              <rect x="10" y="15" width="110" height="32" rx="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
              <rect x="10" y="22" width="110" height="4" fill="#ffffff" />
              {/* School Bus Windows */}
              <rect x="18" y="18" width="14" height="10" rx="1" fill="#bae6fd" />
              <rect x="36" y="18" width="14" height="10" rx="1" fill="#bae6fd" />
              <rect x="54" y="18" width="14" height="10" rx="1" fill="#bae6fd" />
              <rect x="72" y="18" width="14" height="10" rx="1" fill="#bae6fd" />
              <rect x="90" y="18" width="22" height="10" rx="2" fill="#0f172a" />

              {/* Bus Wheels */}
              <circle cx="35" cy="48" r="9" fill="#0f172a" />
              <circle cx="35" cy="48" r="3" fill="#cbd5e1" />
              <circle cx="95" cy="48" r="9" fill="#0f172a" />
              <circle cx="95" cy="48" r="3" fill="#cbd5e1" />
            </svg>
          </div>
        );
      }

      case 'airplane': {
        return (
          <div className="relative w-28 h-16 flex items-center justify-center [transform-style:preserve-3d]">
            <svg viewBox="0 0 140 70" className="w-full h-full drop-shadow-[0_10px_12px_rgba(0,0,0,0.5)]">
              <defs>
                <linearGradient id={`planeGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>
              {/* Fuselage */}
              <path d="M 10 32 C 10 32 100 24 125 30 C 135 32 135 38 125 40 C 100 46 10 38 10 38 Z" fill={`url(#planeGrad-${uid})`} stroke="#64748b" strokeWidth="1" />
              {/* Tail Fin */}
              <path d="M 12 33 L 5 12 L 20 12 L 30 33 Z" fill="#0284c7" />
              {/* Wings */}
              <path d="M 65 35 L 45 55 L 60 55 L 85 35 Z" fill="#0284c7" />
              {/* Cockpit */}
              <path d="M 115 30 L 125 32 L 120 35 L 112 34 Z" fill="#0f172a" />
            </svg>
          </div>
        );
      }

      default:
        // Default Rich 3D Render with Emoji & Ground Reflection
        return (
          <div className="relative flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              {emoji}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Dynamic 3D Turbo Fire Thrusters */}
      {turbo && (
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="absolute -start-7 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none z-10"
        >
          <span className="text-xl">🔥</span>
          <span className="text-sm">⚡</span>
        </motion.div>
      )}

      {/* Speed Dust Trail */}
      {isRacing && (
        <motion.div
          animate={{ x: [-5, -20], opacity: [0.8, 0], scale: [0.8, 1.4] }}
          transition={{ repeat: Infinity, duration: 0.4 }}
          className="absolute -start-5 top-1/2 translate-y-1 text-slate-300 opacity-60 text-xs pointer-events-none"
        >
          💨
        </motion.div>
      )}

      {/* Render 3D Model with Physics Wobble */}
      <motion.div
        animate={
          isRacing
            ? {
                y: [0, -3, 0],
                rotateZ: is3D ? [-1, 2, -1] : [0, 0, 0],
              }
            : { y: 0 }
        }
        transition={{ repeat: Infinity, duration: 0.35, ease: 'easeInOut' }}
      >
        {renderSpecialized3D()}
      </motion.div>

      {/* 3D Oval Contact Ground Shadow */}
      <div className="absolute -bottom-1 w-16 h-2.5 bg-black/60 rounded-full blur-xs mx-auto -z-10" />
    </div>
  );
};
