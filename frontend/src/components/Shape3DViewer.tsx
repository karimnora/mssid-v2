import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { RotateCcw, Box, LayoutGrid, Layers } from 'lucide-react';

// ─────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────
export type Solid3DId = 'cube' | 'cuboid' | 'cylinder' | 'pyramid' | 'prism';
export type ViewMode = 'solid' | 'exploded' | 'net';
export type HighlightFeature = 'faces' | 'edges' | 'vertices' | null;

export interface ShapeDimensions {
  a: number; // cube edge | cuboid L | cylinder r | pyramid/prism base side
  b: number; // cuboid W  | cylinder h | pyramid/prism height
  c: number; // cuboid H
}

interface Shape3DViewerProps {
  shapeId: Solid3DId;
  dims: ShapeDimensions;
  accentHex?: string;
  highlightFeature?: HighlightFeature;
}

// ─────────────────────────────────────────────────────
// Constants & helpers
// ─────────────────────────────────────────────────────
const DISPLAY = 2.4; // target 3-D size in Three.js units
const EXPLODE_DIST = 0.55;
const FACE_PALETTE = ['#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#9061f9', '#b197fc'] as const;

function computeScale(id: Solid3DId, d: ShapeDimensions): number {
  const m =
    id === 'cube' ? d.a :
    id === 'cuboid' ? Math.max(d.a, d.b, d.c) :
    id === 'cylinder' ? Math.max(d.a * 2, d.b) :
    Math.max(d.a, d.b);
  return DISPLAY / Math.max(m, 1);
}

// ─────────────────────────────────────────────────────
// Cube / Cuboid scene — face-by-face PlaneGeometry
// supports solid / exploded / net animation via useFrame
// ─────────────────────────────────────────────────────
interface FaceSpec {
  solidP: THREE.Vector3; solidR: THREE.Euler;
  netP: THREE.Vector3; netR: THREE.Euler;
  exP: THREE.Vector3;
  w: number; h: number; col: string;
}

function buildFaces(W: number, H: number, D: number): FaceSpec[] {
  return [
    // Front z+
    { solidP: new THREE.Vector3(0, 0, D / 2), solidR: new THREE.Euler(0, 0, 0), netP: new THREE.Vector3(0, 0, 0), netR: new THREE.Euler(0, 0, 0), exP: new THREE.Vector3(0, 0, D / 2 + EXPLODE_DIST), w: W, h: H, col: FACE_PALETTE[0] },
    // Back z-
    { solidP: new THREE.Vector3(0, 0, -D / 2), solidR: new THREE.Euler(0, Math.PI, 0), netP: new THREE.Vector3(W + D, 0, 0), netR: new THREE.Euler(0, 0, 0), exP: new THREE.Vector3(0, 0, -D / 2 - EXPLODE_DIST), w: W, h: H, col: FACE_PALETTE[1] },
    // Right x+
    { solidP: new THREE.Vector3(W / 2, 0, 0), solidR: new THREE.Euler(0, -Math.PI / 2, 0), netP: new THREE.Vector3(W / 2 + D / 2, 0, 0), netR: new THREE.Euler(0, 0, 0), exP: new THREE.Vector3(W / 2 + EXPLODE_DIST, 0, 0), w: D, h: H, col: FACE_PALETTE[2] },
    // Left x-
    { solidP: new THREE.Vector3(-W / 2, 0, 0), solidR: new THREE.Euler(0, Math.PI / 2, 0), netP: new THREE.Vector3(-(W / 2 + D / 2), 0, 0), netR: new THREE.Euler(0, 0, 0), exP: new THREE.Vector3(-W / 2 - EXPLODE_DIST, 0, 0), w: D, h: H, col: FACE_PALETTE[3] },
    // Top y+
    { solidP: new THREE.Vector3(0, H / 2, 0), solidR: new THREE.Euler(-Math.PI / 2, 0, 0), netP: new THREE.Vector3(0, H / 2 + D / 2, 0), netR: new THREE.Euler(0, 0, 0), exP: new THREE.Vector3(0, H / 2 + EXPLODE_DIST, 0), w: W, h: D, col: FACE_PALETTE[4] },
    // Bottom y-
    { solidP: new THREE.Vector3(0, -H / 2, 0), solidR: new THREE.Euler(Math.PI / 2, 0, 0), netP: new THREE.Vector3(0, -(H / 2 + D / 2), 0), netR: new THREE.Euler(0, 0, 0), exP: new THREE.Vector3(0, -H / 2 - EXPLODE_DIST, 0), w: W, h: D, col: FACE_PALETTE[5] },
  ];
}

function CuboidScene({ W, H, D, accent, hl, vm, shapeId, dims }: {
  W: number; H: number; D: number;
  accent: string; hl: HighlightFeature; vm: ViewMode;
  shapeId: Solid3DId; dims: ShapeDimensions;
}) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>(Array(6).fill(null));
  const faces = useMemo(() => buildFaces(W, H, D), [W, H, D]);
  const facesRef = useRef(faces);
  const vmRef = useRef(vm);
  useEffect(() => { facesRef.current = faces; }, [faces]);
  useEffect(() => { vmRef.current = vm; }, [vm]);

  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, D)), [W, H, D]);
  const verts = useMemo<[number, number, number][]>(() => {
    const [hw, hh, hd] = [W / 2, H / 2, D / 2];
    return [[-hw,-hh,-hd],[hw,-hh,-hd],[hw,hh,-hd],[-hw,hh,-hd],[-hw,-hh,hd],[hw,-hh,hd],[hw,hh,hd],[-hw,hh,hd]];
  }, [W, H, D]);

  useFrame(() => {
    const mode = vmRef.current;
    facesRef.current.forEach((f, i) => {
      const m = meshRefs.current[i];
      if (!m) return;
      const tp = mode === 'net' ? f.netP : mode === 'exploded' ? f.exP : f.solidP;
      const tr = mode === 'net' ? f.netR : f.solidR;
      m.position.lerp(tp, 0.07);
      m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, tr.x, 0.07);
      m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, tr.y, 0.07);
      m.rotation.z = THREE.MathUtils.lerp(m.rotation.z, tr.z, 0.07);
    });
  });

  const dimLabel = shapeId === 'cube'
    ? `${dims.a} سم`
    : `${dims.a}×${dims.b}×${dims.c}`;

  return (
    <group>
      {faces.map((f, i) => (
        <mesh key={i} ref={el => { meshRefs.current[i] = el; }} castShadow receiveShadow>
          <planeGeometry args={[f.w, f.h]} />
          <meshStandardMaterial
            color={f.col}
            emissive={hl === 'faces' ? '#fb923c' : f.col}
            emissiveIntensity={hl === 'faces' ? 0.9 : 0.18}
            transparent opacity={0.82}
            side={THREE.DoubleSide}
            roughness={0.28} metalness={0.28}
          />
        </mesh>
      ))}
      {/* Edge outline */}
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color={hl === 'edges' ? '#fbbf24' : accent} transparent opacity={hl === 'edges' ? 1 : 0.55} />
      </lineSegments>
      {/* Vertex spheres */}
      {hl === 'vertices' && verts.map((p, i) => (
        <mesh key={`v${i}`} position={p}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
        </mesh>
      ))}
      {/* Dimension label */}
      {vm !== 'net' && (
        <Html position={[W / 2 + 0.35, H / 2 + 0.2, D / 2]} distanceFactor={8} zIndexRange={[0, 10]}>
          <div style={{ background: 'rgba(2,6,23,.9)', color: '#fbbf24', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 800, pointerEvents: 'none', whiteSpace: 'nowrap', direction: 'rtl' }}>
            {dimLabel}
          </div>
        </Html>
      )}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Cylinder scene
// ─────────────────────────────────────────────────────
function CylinderScene({ r, h, accent, hl }: { r: number; h: number; accent: string; hl: HighlightFeature }) {
  const cylGeo = useMemo(() => new THREE.CylinderGeometry(r, r, h, 32, 1, false), [r, h]);
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.CylinderGeometry(r, r, h, 16, 1, false)), [r, h]);

  // Top & bottom circle vertices (8 points around circumference)
  const circleVerts = useMemo<[number, number, number][]>(() => {
    const pts: [number, number, number][] = [[0, h/2, 0], [0, -h/2, 0]];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      pts.push([Math.cos(a) * r, h / 2, Math.sin(a) * r]);
      pts.push([Math.cos(a) * r, -h / 2, Math.sin(a) * r]);
    }
    return pts;
  }, [r, h]);

  return (
    <group>
      <mesh castShadow receiveShadow geometry={cylGeo}>
        <meshStandardMaterial
          color="#fb923c"
          emissive={hl === 'faces' ? '#f97316' : '#fb923c'}
          emissiveIntensity={hl === 'faces' ? 0.85 : 0.12}
          transparent opacity={0.8} roughness={0.28} metalness={0.28}
        />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color={hl === 'edges' ? '#fbbf24' : accent} transparent opacity={hl === 'edges' ? 1 : 0.5} />
      </lineSegments>
      {hl === 'vertices' && circleVerts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
        </mesh>
      ))}
      <Html position={[r + 0.3, 0, 0]} distanceFactor={8} zIndexRange={[0, 10]}>
        <div style={{ background: 'rgba(2,6,23,.9)', color: '#fbbf24', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 800, pointerEvents: 'none', whiteSpace: 'nowrap', direction: 'rtl' }}>
          r={Math.round(r / (DISPLAY / 10) * 10) / 10} | h
        </div>
      </Html>
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Pyramid scene (square base cone with 4 segments)
// ─────────────────────────────────────────────────────
function PyramidScene({ base, h, accent, hl }: { base: number; h: number; accent: string; hl: HighlightFeature }) {
  // For a square pyramid: circumradius = base * sqrt(2) / 2
  const circumR = base * Math.sqrt(2) / 2;
  const geo = useMemo(() => new THREE.ConeGeometry(circumR, h, 4, 1), [circumR, h]);
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.ConeGeometry(circumR, h, 4, 1)), [circumR, h]);

  const verts = useMemo<[number, number, number][]>(() => {
    const halfH = h / 2;
    const pts: [number, number, number][] = [[0, halfH, 0]]; // apex
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      pts.push([Math.cos(a) * circumR, -halfH, Math.sin(a) * circumR]);
    }
    return pts;
  }, [circumR, h]);

  return (
    <group>
      <mesh castShadow receiveShadow geometry={geo}>
        <meshStandardMaterial
          color="#f472b6"
          emissive={hl === 'faces' ? '#ec4899' : '#f472b6'}
          emissiveIntensity={hl === 'faces' ? 0.85 : 0.12}
          transparent opacity={0.8} roughness={0.28} metalness={0.28}
        />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color={hl === 'edges' ? '#fbbf24' : accent} transparent opacity={hl === 'edges' ? 1 : 0.5} />
      </lineSegments>
      {hl === 'vertices' && verts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Prism scene (triangular equilateral prism)
// ─────────────────────────────────────────────────────
function PrismScene({ side, h, accent, hl }: { side: number; h: number; accent: string; hl: HighlightFeature }) {
  const triH = side * Math.sqrt(3) / 2;
  const centY = triH / 3;

  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-side / 2, -centY);
    shape.lineTo(side / 2, -centY);
    shape.lineTo(0, triH - centY);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false });
    g.translate(0, 0, -h / 2);
    return g;
  }, [side, h, triH, centY]);

  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);

  const verts = useMemo<[number, number, number][]>(() => ([
    [-side/2, -centY, h/2], [side/2, -centY, h/2], [0, triH - centY, h/2],
    [-side/2, -centY, -h/2], [side/2, -centY, -h/2], [0, triH - centY, -h/2],
  ]), [side, h, triH, centY]);

  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      <mesh castShadow receiveShadow geometry={geo}>
        <meshStandardMaterial
          color="#34d399"
          emissive={hl === 'faces' ? '#10b981' : '#34d399'}
          emissiveIntensity={hl === 'faces' ? 0.85 : 0.12}
          transparent opacity={0.8} roughness={0.28} metalness={0.28}
        />
      </mesh>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color={hl === 'edges' ? '#fbbf24' : accent} transparent opacity={hl === 'edges' ? 1 : 0.5} />
      </lineSegments>
      {hl === 'vertices' && verts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────
// Scene content — picks the right sub-scene + lights
// ─────────────────────────────────────────────────────
function SceneContent({ shapeId, dims, accentHex, hl, vm }: {
  shapeId: Solid3DId; dims: ShapeDimensions; accentHex: string;
  hl: HighlightFeature; vm: ViewMode;
}) {
  const s = computeScale(shapeId, dims);

  if (shapeId === 'cube' || shapeId === 'cuboid') {
    const W = dims.a * s;
    const H = shapeId === 'cube' ? dims.a * s : dims.c * s;
    const D = shapeId === 'cube' ? dims.a * s : dims.b * s;
    return <CuboidScene W={W} H={H} D={D} accent={accentHex} hl={hl} vm={vm} shapeId={shapeId} dims={dims} />;
  }
  if (shapeId === 'cylinder') {
    return <CylinderScene r={dims.a * s} h={dims.b * s} accent={accentHex} hl={hl} />;
  }
  if (shapeId === 'pyramid') {
    return <PyramidScene base={dims.a * s} h={dims.b * s} accent={accentHex} hl={hl} />;
  }
  // prism
  return <PrismScene side={dims.a * s} h={dims.b * s} accent={accentHex} hl={hl} />;
}

// ─────────────────────────────────────────────────────
// SVG / CSS net view (same cross-layout, polished)
// ─────────────────────────────────────────────────────
const ShapeNet: React.FC<{ shapeId: Solid3DId; dims: ShapeDimensions; accentHex: string }> = ({ shapeId, dims, accentHex }) => {
  const bg = `${accentHex}33`;
  const border = accentHex;
  const cell: React.CSSProperties = { background: bg, border: `2px solid ${border}`, borderRadius: 3 };
  const PX = 8.5;

  if (shapeId === 'cube' || shapeId === 'cuboid') {
    const w = (shapeId === 'cube' ? dims.a : dims.a) * PX * 0.85;
    const hgt = (shapeId === 'cube' ? dims.a : dims.c) * PX * 0.85;
    const d = (shapeId === 'cube' ? dims.a : dims.b) * PX * 0.85;
    return (
      <div className="flex flex-col items-center gap-0.5" style={{ transform: 'scale(0.9)' }}>
        <div style={{ ...cell, width: w, height: d, marginInlineStart: w + 4 }} />
        <div className="flex gap-0.5">
          <div style={{ ...cell, width: d, height: hgt }} />
          <div style={{ ...cell, width: w, height: hgt }} />
          <div style={{ ...cell, width: d, height: hgt }} />
          <div style={{ ...cell, width: w, height: hgt }} />
        </div>
        <div style={{ ...cell, width: w, height: d, marginInlineStart: w + 4 }} />
      </div>
    );
  }
  if (shapeId === 'cylinder') {
    const r = dims.a * PX * 0.75;
    const h = dims.b * PX * 0.75;
    return (
      <div className="flex flex-col items-center gap-2">
        <div style={{ ...cell, width: r * 2, height: r * 2, borderRadius: '50%' }} />
        <div style={{ ...cell, width: Math.min(2 * Math.PI * r, 260), height: h }} />
        <div style={{ ...cell, width: r * 2, height: r * 2, borderRadius: '50%' }} />
      </div>
    );
  }
  if (shapeId === 'pyramid') {
    const base = dims.a * PX * 0.8;
    const h = dims.b * PX * 0.8;
    const slant = Math.sqrt(h * h + (base / 2) ** 2);
    return (
      <div className="flex flex-col items-center gap-0.5">
        <div style={{ ...cell, width: base, height: slant, clipPath: 'polygon(50% 0%,0% 100%,100% 100%)' }} />
        <div className="flex items-center gap-0.5">
          <div style={{ ...cell, width: slant * 0.9, height: base, clipPath: 'polygon(100% 50%,0% 0%,0% 100%)' }} />
          <div style={{ ...cell, width: base, height: base }} />
          <div style={{ ...cell, width: slant * 0.9, height: base, clipPath: 'polygon(0% 50%,100% 0%,100% 100%)' }} />
        </div>
        <div style={{ ...cell, width: base, height: slant, clipPath: 'polygon(50% 100%,0% 0%,100% 0%)' }} />
      </div>
    );
  }
  // prism
  const base = dims.a * PX * 0.75;
  const h = dims.b * PX * 0.75;
  const triH = base * 0.87;
  return (
    <div className="flex items-center gap-0.5">
      <div style={{ ...cell, width: triH, height: base, clipPath: 'polygon(0% 50%,100% 0%,100% 100%)' }} />
      <div style={{ ...cell, width: h, height: base }} />
      <div style={{ ...cell, width: h, height: base }} />
      <div style={{ ...cell, width: h, height: base }} />
      <div style={{ ...cell, width: triH, height: base, clipPath: 'polygon(100% 50%,0% 0%,0% 100%)' }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────
// Main export: Shape3DViewer
// ─────────────────────────────────────────────────────
export const Shape3DViewer: React.FC<Shape3DViewerProps> = ({
  shapeId, dims, accentHex = '#a78bfa', highlightFeature = null,
}) => {
  const [vm, setVm] = useState<ViewMode>('solid');
  const orbitRef = useRef<any>(null);

  const isCuboid = shapeId === 'cube' || shapeId === 'cuboid';
  const modes = isCuboid
    ? ([
        { id: 'solid' as ViewMode, labelAr: 'مجسّم', icon: Box },
        { id: 'exploded' as ViewMode, labelAr: 'مفكك', icon: Layers },
        { id: 'net' as ViewMode, labelAr: 'الباترون', icon: LayoutGrid },
      ])
    : ([
        { id: 'solid' as ViewMode, labelAr: 'مجسّم', icon: Box },
        { id: 'net' as ViewMode, labelAr: 'الباترون', icon: LayoutGrid },
      ]);

  return (
    <div className="w-full space-y-2.5" dir="rtl">
      {/* View mode toggle */}
      <div className="grid gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl p-1" style={{ gridTemplateColumns: `repeat(${modes.length}, 1fr)` }}>
        {modes.map(({ id, labelAr, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setVm(id)}
            className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${vm === id ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{labelAr}</span>
          </button>
        ))}
      </div>

      {/* Canvas + Net overlay container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800" style={{ height: 268 }}>
        {/* R3F Canvas — always mounted, fades when net mode */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: vm === 'net' ? 0 : 1 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          style={{ pointerEvents: vm === 'net' ? 'none' : 'auto' }}
        >
          <Canvas
            camera={{ position: [0, 0, 5.5], fov: 55 }}
            gl={{ antialias: true, alpha: true }}
            shadows
            style={{ background: 'rgb(2 6 23)' }}
          >
            {/* Lighting */}
            <ambientLight intensity={0.55} />
            <directionalLight position={[4, 8, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
            <pointLight position={[-4, -3, 3]} intensity={0.7} color="#6366f1" />
            <pointLight position={[3, 4, -3]} intensity={0.4} color="#f472b6" />

            {/* Shadow receiver plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
              <planeGeometry args={[30, 30]} />
              <shadowMaterial transparent opacity={0.25} />
            </mesh>

            {/* Shape */}
            <SceneContent shapeId={shapeId} dims={dims} accentHex={accentHex} hl={highlightFeature} vm={vm} />

            {/* Controls */}
            <OrbitControls
              ref={orbitRef}
              enableDamping
              dampingFactor={0.08}
              autoRotate={false}
              minDistance={1.8}
              maxDistance={12}
              enablePan={false}
            />
          </Canvas>
        </motion.div>

        {/* SVG net overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-slate-950"
          animate={{ opacity: vm === 'net' ? 1 : 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          style={{ pointerEvents: vm === 'net' ? 'auto' : 'none' }}
        >
          {/* Net label */}
          <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-amber-400/70 uppercase tracking-wider">
            الباترون (Patron Net)
          </div>
          <ShapeNet shapeId={shapeId} dims={dims} accentHex={accentHex} />
        </motion.div>

        {/* Hint tooltip */}
        {vm !== 'net' && (
          <div className="absolute bottom-2 inset-x-0 text-center text-[9px] text-slate-500 font-bold pointer-events-none select-none">
            👆 اسحب للتدوير • اضغط مرتين للتكبير
          </div>
        )}
      </div>

      {/* Zoom & reset controls */}
      {vm !== 'net' && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => { orbitRef.current?.reset(); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة الضبط</span>
          </button>
          <div className="text-[10px] font-mono text-slate-500 font-bold">
            {vm === 'exploded' ? '⚡ عرض مفكك' : '🔄 ثلاثي الأبعاد'}
          </div>
        </div>
      )}
    </div>
  );
};
