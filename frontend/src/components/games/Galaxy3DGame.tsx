/**
 * Galaxy3DGame.tsx — مجرة النجوم 3D
 * Beautiful 3D space scene using @react-three/fiber + @react-three/drei.
 * Collect all glowing stars floating in 3D space before time runs out.
 * 4 levels: more stars, less time.
 */
import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';

export interface Galaxy3DGameProps {
  onExit?: () => void;
  onComplete?: (xp: number) => void;
  language?: 'ar' | 'fr' | 'en';
}

interface StarData {
  id: number;
  position: [number, number, number];
  color: string;
  collected: boolean;
  scale: number;
}

interface LevelCfg {
  starCount: number;
  timeLimit: number;
  spread: number;
  speed: number;
  label: string;
}

const LEVEL_CFGS: LevelCfg[] = [
  { starCount: 8,  timeLimit: 50, spread: 5, speed: 0.4, label: 'L1' },
  { starCount: 12, timeLimit: 50, spread: 7, speed: 0.55, label: 'L2' },
  { starCount: 16, timeLimit: 55, spread: 8, speed: 0.7, label: 'L3' },
  { starCount: 20, timeLimit: 60, spread: 9, speed: 0.9, label: 'L4' },
];

const STAR_COLORS = [
  '#fbbf24', '#f97316', '#ef4444', '#a855f7',
  '#3b82f6', '#06b6d4', '#22c55e', '#ec4899',
];

function generateStars(cfg: LevelCfg): StarData[] {
  return Array.from({ length: cfg.starCount }, (_, i) => {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = cfg.spread * 0.5 + Math.random() * cfg.spread * 0.5;
    return {
      id: i,
      position: [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ] as [number, number, number],
      color: STAR_COLORS[i % STAR_COLORS.length],
      collected: false,
      scale: 0.8 + Math.random() * 0.5,
    };
  });
}

// ─── CollectibleStar ──────────────────────────────────────────────────────────
const CollectibleStar: React.FC<{
  data: StarData;
  onCollect: (id: number) => void;
  orbitSpeed: number;
}> = ({ data, onCollect, orbitSpeed }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [popped, setPopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const startPhase = useRef(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    if (!meshRef.current || popped) return;
    const t = clock.getElapsedTime();
    // Float up/down + rotate
    meshRef.current.position.y = data.position[1] + Math.sin(t * orbitSpeed + startPhase.current) * 0.4;
    meshRef.current.rotation.y += 0.015;
    meshRef.current.rotation.z += 0.008;
    const s = data.scale * (hovered ? 1.3 : 1) * (1 + Math.sin(t * 2 + startPhase.current) * 0.07);
    meshRef.current.scale.setScalar(s);
  });

  if (data.collected) return null;

  return (
    <mesh
      ref={meshRef}
      position={data.position}
      onClick={(e) => {
        e.stopPropagation();
        if (popped) return;
        setPopped(true);
        onCollect(data.id);
      }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <octahedronGeometry args={[0.45, 0]} />
      <meshStandardMaterial
        color={data.color}
        emissive={data.color}
        emissiveIntensity={hovered ? 2.5 : 1.4}
        roughness={0.15}
        metalness={0.6}
      />
    </mesh>
  );
};

// ─── Burst particles ──────────────────────────────────────────────────────────
const BurstParticle: React.FC<{ position: THREE.Vector3; color: string; onDone: () => void }> = ({
  position,
  color,
  onDone,
}) => {
  const count = 18;
  const velocities = useRef(
    Array.from({ length: count }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
    ))
  );
  const posArr = useRef(new Float32Array(count * 3));
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const lifeRef = useRef(0);

  useFrame((_, delta) => {
    lifeRef.current += delta;
    if (lifeRef.current > 0.6) { onDone(); return; }
    for (let i = 0; i < count; i++) {
      const v = velocities.current[i];
      posArr.current[i * 3]     = position.x + v.x * lifeRef.current;
      posArr.current[i * 3 + 1] = position.y + v.y * lifeRef.current;
      posArr.current[i * 3 + 2] = position.z + v.z * lifeRef.current;
    }
    if (geoRef.current) {
      geoRef.current.setAttribute('position', new THREE.BufferAttribute(posArr.current, 3));
      geoRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" array={posArr.current} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.18} transparent opacity={Math.max(0, 1 - lifeRef.current / 0.6)} sizeAttenuation />
    </points>
  );
};

// ─── Scene ────────────────────────────────────────────────────────────────────
const GalaxyScene: React.FC<{
  stars: StarData[];
  onCollect: (id: number) => void;
  orbitSpeed: number;
}> = ({ stars, onCollect, orbitSpeed }) => {
  const [bursts, setBursts] = useState<Array<{ id: number; pos: THREE.Vector3; color: string }>>([]);
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 12);
  }, [camera]);

  const handleCollect = useCallback((id: number) => {
    const star = stars.find((s) => s.id === id);
    if (!star) return;
    setBursts((prev) => [
      ...prev,
      { id: Date.now(), pos: new THREE.Vector3(...star.position), color: star.color },
    ]);
    onCollect(id);
  }, [stars, onCollect]);

  return (
    <>
      <Stars radius={80} depth={50} count={6000} factor={5} saturation={0.5} fade speed={0.5} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffffff" />
      <pointLight position={[8, 4, -4]} intensity={1.5} color="#7c3aed" />
      <pointLight position={[-6, -4, 6]} intensity={1.2} color="#0ea5e9" />

      {stars.map((star) => (
        <CollectibleStar
          key={star.id}
          data={star}
          onCollect={handleCollect}
          orbitSpeed={orbitSpeed}
        />
      ))}

      {bursts.map((b) => (
        <BurstParticle
          key={b.id}
          position={b.pos}
          color={b.color}
          onDone={() => setBursts((prev) => prev.filter((x) => x.id !== b.id))}
        />
      ))}

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const Galaxy3DGame: React.FC<Galaxy3DGameProps> = ({ onExit, onComplete, language = 'ar' }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const [phase, setPhase] = useState<'select' | 'play' | 'win' | 'lose'>('select');
  const [stars, setStars] = useState<StarData[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [collected, setCollected] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cfg = LEVEL_CFGS[levelIdx];

  const startLevel = useCallback((idx: number) => {
    setLevelIdx(idx);
    const c = LEVEL_CFGS[idx];
    setStars(generateStars(c));
    setCollected(0);
    setTimeLeft(c.timeLimit);
    setPhase('play');
  }, []);

  useEffect(() => {
    if (phase !== 'play') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase('lose');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const handleCollect = useCallback((id: number) => {
    setStars((prev) => prev.map((s) => s.id === id ? { ...s, collected: true } : s));
    setCollected((c) => {
      const next = c + 1;
      if (next >= cfg.starCount) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(() => setPhase('win'), 400);
      }
      return next;
    });
  }, [cfg.starCount]);

  const LEVEL_LABELS = [
    { ar: 'الفضاء الهادئ', fr: 'Espace Tranquille', stars: 8, time: 50 },
    { ar: 'كوكبة النجوم', fr: 'Constellation', stars: 12, time: 50 },
    { ar: 'عاصفة النجوم', fr: 'Tempête d\'Étoiles', stars: 16, time: 55 },
    { ar: 'مجرة النجوم', fr: 'Galaxie des Étoiles', stars: 20, time: 60 },
  ];

  if (phase === 'select') {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950 p-4 pb-8" dir="rtl">
        <div className="w-full flex items-center justify-between mb-6">
          <button onClick={onExit} className="bg-white/10 rounded-2xl px-4 py-2 text-white/80 font-bold text-sm">
            ← خروج
          </button>
          <h1 className="text-xl font-extrabold text-white">🌌 مجرة النجوم 3D</h1>
          <div />
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {LEVEL_LABELS.map((lbl, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startLevel(i)}
              className="rounded-3xl overflow-hidden shadow-xl"
            >
              <div className={`bg-gradient-to-br ${['from-indigo-600 to-purple-700', 'from-violet-600 to-pink-700', 'from-blue-600 to-indigo-800', 'from-purple-700 to-rose-700'][i]} p-5`}>
                <div className="text-4xl mb-2">{['🌟', '⭐⭐', '💫💫', '🌌'][i]}</div>
                <p className="text-white font-extrabold text-sm">{lbl.ar}</p>
                <p className="text-white/70 text-xs italic">{lbl.fr}</p>
                <div className="flex justify-between mt-2 text-xs text-white/60">
                  <span>⭐ {lbl.stars}</span>
                  <span>⏱ {lbl.time}s</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <p className="text-white/40 text-xs mt-6 text-center">
          اجمع جميع النجوم قبل انتهاء الوقت!<br/>
          <span className="italic">Collecte toutes les étoiles avant la fin du temps !</span>
        </p>
      </div>
    );
  }

  if (phase === 'win' || phase === 'lose') {
    const earned = phase === 'win' ? 25 * (levelIdx + 1) : 0;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950 p-4" dir="rtl">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 20 }}
          className="bg-white rounded-4xl shadow-2xl p-8 text-center max-w-xs w-full"
        >
          <div className="text-6xl mb-3">{phase === 'win' ? '🌌' : '⏱️'}</div>
          <h2 className={`text-2xl font-extrabold mb-1 ${phase === 'win' ? 'text-indigo-600' : 'text-rose-600'}`}>
            {phase === 'win' ? 'جمعت كل النجوم!' : 'انتهى الوقت!'}
          </h2>
          <p className="text-slate-500 mb-2">
            نجوم مجمّعة: {collected} / {cfg.starCount}
          </p>
          {phase === 'win' && (
            <div className="bg-amber-50 rounded-2xl px-4 py-2 mb-4 text-amber-700 font-bold text-lg">
              +{earned} XP ⭐
            </div>
          )}
          <div className="flex gap-2 mb-5 justify-center">
            <button onClick={() => startLevel(levelIdx)} className="bg-slate-100 text-slate-700 rounded-2xl px-5 py-2 font-bold text-sm">
              إعادة
            </button>
            <button onClick={() => setPhase('select')} className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl px-5 py-2 font-bold text-sm shadow">
              اختيار المستوى
            </button>
            {phase === 'win' && (
              <button onClick={() => onComplete?.(earned)} className="bg-gradient-to-br from-emerald-400 to-green-500 text-white rounded-2xl px-5 py-2 font-bold text-sm shadow">
                إنهاء 🏅
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const activeCfg = LEVEL_CFGS[levelIdx];
  const timerPct = timeLeft / activeCfg.timeLimit;

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-950 pb-4" dir="rtl">
      {/* HUD */}
      <div className="w-full flex items-center justify-between px-4 pt-3 pb-2 bg-black/40 backdrop-blur">
        <button onClick={onExit} className="bg-white/10 rounded-xl px-3 py-1.5 text-white/80 font-bold text-sm">
          ← خروج
        </button>
        <div className="text-center">
          <p className="text-white font-extrabold text-sm">
            ⭐ {collected} / {activeCfg.starCount}
          </p>
        </div>
        <div className={`font-extrabold text-lg ${timerPct < 0.3 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
          ⏱ {timeLeft}s
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-1.5 bg-white/10">
        <motion.div
          className={`h-full rounded-full transition-colors duration-500 ${timerPct > 0.5 ? 'bg-emerald-400' : timerPct > 0.25 ? 'bg-amber-400' : 'bg-rose-500'}`}
          animate={{ width: `${timerPct * 100}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 w-full" style={{ minHeight: 0 }}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full text-white/50 text-sm">
            جارٍ تحميل الفضاء...
          </div>
        }>
          <Canvas
            camera={{ position: [0, 0, 12], fov: 65 }}
            style={{ width: '100%', height: '100%' }}
          >
            <GalaxyScene
              stars={stars}
              onCollect={handleCollect}
              orbitSpeed={activeCfg.speed}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Instructions */}
      <div className="w-full px-4 pb-2 text-center">
        <p className="text-white/40 text-xs">
          انقر على النجوم لجمعها | Clique sur les étoiles pour les collecter
        </p>
      </div>
    </div>
  );
};
