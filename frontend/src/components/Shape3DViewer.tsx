
import React, { useRef, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Box, LayoutGrid, Layers } from 'lucide-react';

export type Solid3DId = 'cube' | 'cuboid' | 'cylinder' | 'pyramid' | 'prism';
export type ViewMode = 'solid' | 'exploded' | 'net';

export interface ShapeDimensions {
  a: number; // cube: edge | cuboid: length | cylinder: radius | pyramid: base side | prism: base side
  b: number; // cuboid: width | cylinder: height | pyramid: height | prism: height
  c: number; // cuboid: height (unused by other shapes)
}

interface Shape3DViewerProps {
  shapeId: Solid3DId;
  dims: ShapeDimensions;
  accentHex?: string;
}

const PX_PER_CM = 9;
const CYLINDER_SIDES = 16;

const VIEW_PRESETS: Record<'front' | 'corner' | 'top', { rx: number; ry: number }> = {
  front: { rx: 0, ry: 0 },
  corner: { rx: -20, ry: 35 },
  top: { rx: -85, ry: 20 },
};

export const Shape3DViewer: React.FC<Shape3DViewerProps> = ({ shapeId, dims, accentHex = '#a78bfa' }) => {
  const [rotate, setRotate] = useState({ rx: -20, ry: 35 });
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('solid');
  const dragState = useRef<{ dragging: boolean; lastX: number; lastY: number }>({ dragging: false, lastX: 0, lastY: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current = { dragging: true, lastX: e.clientX, lastY: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.lastX;
    const dy = e.clientY - dragState.current.lastY;
    dragState.current.lastX = e.clientX;
    dragState.current.lastY = e.clientY;
    setRotate((prev) => ({
      rx: Math.max(-85, Math.min(85, prev.rx - dy * 0.5)),
      ry: prev.ry + dx * 0.5,
    }));
  };
  const handlePointerUp = () => {
    dragState.current.dragging = false;
  };

  const explode = viewMode === 'exploded' ? 26 : 0;

  return (
    <div className="w-full space-y-3">
      {/* View mode toggle */}
      <div className="grid grid-cols-3 gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl p-1">
        {([
          { id: 'solid' as ViewMode, label: 'مجسّم', icon: Box },
          { id: 'exploded' as ViewMode, label: 'منظر متفجر', icon: Layers },
          { id: 'net' as ViewMode, label: 'الانفراد (Patron)', icon: LayoutGrid },
        ]).map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setViewMode(v.id)}
            className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
              viewMode === v.id ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <v.icon className="w-3.5 h-3.5" />
            <span>{v.label}</span>
          </button>
        ))}
      </div>

      {/* 3D Canvas */}
      <div
        className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center touch-none select-none"
        style={{ minHeight: 240, height: 260, perspective: 900 }}
        onPointerDown={viewMode !== 'net' ? handlePointerDown : undefined}
        onPointerMove={viewMode !== 'net' ? handlePointerMove : undefined}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {viewMode === 'net' ? (
          <ShapeNet shapeId={shapeId} dims={dims} accentHex={accentHex} />
        ) : (
          <div
            style={{
              transformStyle: 'preserve-3d',
              transform: `scale(${zoom}) rotateX(${rotate.rx}deg) rotateY(${rotate.ry}deg)`,
              transition: dragState.current.dragging ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <ShapeSolid shapeId={shapeId} dims={dims} accentHex={accentHex} explode={explode} />
          </div>
        )}

        {viewMode !== 'net' && (
          <div className="absolute bottom-2 inset-x-0 text-center text-[9px] text-slate-500 font-bold pointer-events-none">
            👆 اسحب لتدوير المجسم
          </div>
        )}
      </div>

      {/* Controls: zoom + view presets (only relevant for 3D modes) */}
      {viewMode !== 'net' && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.15).toFixed(2)))}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              title="تصغير"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              title="تكبير"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => { setRotate(VIEW_PRESETS.corner); setZoom(1); }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
              title="إعادة الضبط"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            {(['front', 'corner', 'top'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRotate(VIEW_PRESETS[v])}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                {v === 'front' ? 'أمامية' : v === 'corner' ? 'زاوية' : 'علوية'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- Solid (3D / exploded) rendering ----------

const Face: React.FC<{ w: number; h: number; transform: string; bg: string; border: string }> = ({ w, h, transform, bg, border }) => (
  <div
    style={{
      position: 'absolute',
      width: w,
      height: h,
      left: -w / 2,
      top: -h / 2,
      background: bg,
      border: `2px solid ${border}`,
      transform,
      backfaceVisibility: 'hidden',
    }}
  />
);

const ShapeSolid: React.FC<{ shapeId: Solid3DId; dims: ShapeDimensions; accentHex: string; explode: number }> = ({
  shapeId,
  dims,
  accentHex,
  explode,
}) => {
  const bg = `${accentHex}33`;
  const border = accentHex;

  if (shapeId === 'cube' || shapeId === 'cuboid') {
    const W = (shapeId === 'cube' ? dims.a : dims.a) * PX_PER_CM;
    const H = (shapeId === 'cube' ? dims.a : dims.c) * PX_PER_CM;
    const D = (shapeId === 'cube' ? dims.a : dims.b) * PX_PER_CM;
    return (
      <div style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
        <Face w={W} h={H} transform={`translateZ(${D / 2 + explode}px)`} bg={bg} border={border} />
        <Face w={W} h={H} transform={`rotateY(180deg) translateZ(${D / 2 + explode}px)`} bg={bg} border={border} />
        <Face w={D} h={H} transform={`rotateY(90deg) translateZ(${W / 2 + explode}px)`} bg={bg} border={border} />
        <Face w={D} h={H} transform={`rotateY(-90deg) translateZ(${W / 2 + explode}px)`} bg={bg} border={border} />
        <Face w={W} h={D} transform={`rotateX(90deg) translateZ(${H / 2 + explode}px)`} bg={bg} border={border} />
        <Face w={W} h={D} transform={`rotateX(-90deg) translateZ(${H / 2 + explode}px)`} bg={bg} border={border} />
      </div>
    );
  }

  if (shapeId === 'cylinder') {
    const r = dims.a * PX_PER_CM;
    const h = dims.b * PX_PER_CM;
    const stripAngle = 360 / CYLINDER_SIDES;
    const stripWidth = ((2 * Math.PI * r) / CYLINDER_SIDES) * 1.08;
    return (
      <div style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
        {Array.from({ length: CYLINDER_SIDES }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: stripWidth,
              height: h,
              left: -stripWidth / 2,
              top: -h / 2,
              background: bg,
              borderTop: `1px solid ${border}`,
              borderBottom: `1px solid ${border}`,
              transform: `rotateY(${i * stripAngle}deg) translateZ(${r + explode}px)`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            width: r * 2,
            height: r * 2,
            left: -r,
            top: -r,
            borderRadius: '50%',
            background: bg,
            border: `2px solid ${border}`,
            transform: `rotateX(90deg) translateZ(${h / 2 + explode}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: r * 2,
            height: r * 2,
            left: -r,
            top: -r,
            borderRadius: '50%',
            background: bg,
            border: `2px solid ${border}`,
            transform: `rotateX(-90deg) translateZ(${h / 2 + explode}px)`,
          }}
        />
      </div>
    );
  }

  if (shapeId === 'pyramid') {
    const base = dims.a * PX_PER_CM;
    const h = dims.b * PX_PER_CM;
    const half = base / 2;
    const slant = Math.sqrt(h * h + half * half);
    const tiltFromVerticalDeg = (Math.atan2(half, h) * 180) / Math.PI; // angle between the apex axis and each slant face

    return (
      <div style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
        {/* Base square (flat, at the bottom) */}
        <div
          style={{
            position: 'absolute',
            width: base,
            height: base,
            left: -half,
            top: -half,
            background: bg,
            border: `2px solid ${border}`,
            transform: `rotateX(90deg) translateZ(${h / 2 + explode}px)`,
          }}
        />
        {/* 4 triangular side faces: pivoted at their base edge (fixed on the ground), leaning inward to meet at the apex */}
        {[0, 90, 180, 270].map((angle) => (
          <div
            key={angle}
            style={{
              position: 'absolute',
              width: base,
              height: slant,
              left: -half,
              top: -slant,
              background: bg,
              border: `2px solid ${border}`,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transformOrigin: '50% 100%',
              transform: `translateY(${h / 2}px) rotateY(${angle}deg) translateZ(${half + explode}px) rotateX(${tiltFromVerticalDeg}deg)`,
            }}
          />
        ))}
      </div>
    );
  }

  // prism (triangular, equilateral-ish base), extruded along the depth (Z) axis
  {
    const base = dims.a * PX_PER_CM;
    const h = dims.b * PX_PER_CM;
    const inradius = base * 0.2887;
    const circumradius = base * 0.5774;
    const wallAngles = [0, 120, 240];
    const capVertexAngles = wallAngles.map((a) => a + 60); // vertices sit between adjacent walls
    const capBox = base * 1.8;
    const capPoints = capVertexAngles
      .map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = capBox / 2 + circumradius * Math.sin(rad);
        const y = capBox / 2 - circumradius * Math.cos(rad);
        return `${(x / capBox) * 100}% ${(y / capBox) * 100}%`;
      })
      .join(', ');

    return (
      <div style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
        {/* 3 rectangular side faces, extruded along Z (matching the end caps), one per triangle edge */}
        {wallAngles.map((angle) => (
          <Face
            key={angle}
            w={base}
            h={h}
            transform={`rotateZ(${angle}deg) translateY(${inradius + explode}px) rotateX(90deg)`}
            bg={bg}
            border={border}
          />
        ))}
        {/* Two triangular end caps (front & back) */}
        <div
          style={{
            position: 'absolute',
            width: capBox,
            height: capBox,
            left: -capBox / 2,
            top: -capBox / 2,
            background: bg,
            border: `2px solid ${border}`,
            clipPath: `polygon(${capPoints})`,
            transform: `translateZ(${h / 2 + explode}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: capBox,
            height: capBox,
            left: -capBox / 2,
            top: -capBox / 2,
            background: bg,
            border: `2px solid ${border}`,
            clipPath: `polygon(${capPoints})`,
            transform: `rotateY(180deg) translateZ(${h / 2 + explode}px)`,
          }}
        />
      </div>
    );
  }
};

// ---------- Flat net (patron dépliable) rendering ----------

const ShapeNet: React.FC<{ shapeId: Solid3DId; dims: ShapeDimensions; accentHex: string }> = ({ shapeId, dims, accentHex }) => {
  const bg = `${accentHex}33`;
  const border = accentHex;
  const cellStyle: React.CSSProperties = { background: bg, border: `2px solid ${border}` };

  if (shapeId === 'cube' || shapeId === 'cuboid') {
    const w = (shapeId === 'cube' ? dims.a : dims.a) * PX_PER_CM * 0.85;
    const hgt = (shapeId === 'cube' ? dims.a : dims.c) * PX_PER_CM * 0.85;
    const d = (shapeId === 'cube' ? dims.a : dims.b) * PX_PER_CM * 0.85;
    // Classic cross net: middle row = left(D) - front(W) - right(D) - back(W); top = top(W,D-height); bottom = bottom(W,D-height)
    return (
      <div className="flex flex-col items-center gap-1" style={{ transform: 'scale(0.9)' }}>
        <div style={{ ...cellStyle, width: w, height: d, marginInlineStart: w + 6 }} />
        <div className="flex gap-1">
          <div style={{ ...cellStyle, width: d, height: hgt }} />
          <div style={{ ...cellStyle, width: w, height: hgt }} />
          <div style={{ ...cellStyle, width: d, height: hgt }} />
          <div style={{ ...cellStyle, width: w, height: hgt }} />
        </div>
        <div style={{ ...cellStyle, width: w, height: d, marginInlineStart: w + 6 }} />
      </div>
    );
  }

  if (shapeId === 'cylinder') {
    const r = dims.a * PX_PER_CM * 0.75;
    const h = dims.b * PX_PER_CM * 0.75;
    const circumference = 2 * Math.PI * r;
    return (
      <div className="flex flex-col items-center gap-2">
        <div style={{ ...cellStyle, width: r * 2, height: r * 2, borderRadius: '50%' }} />
        <div style={{ ...cellStyle, width: Math.min(circumference, 260), height: h }} />
        <div style={{ ...cellStyle, width: r * 2, height: r * 2, borderRadius: '50%' }} />
      </div>
    );
  }

  if (shapeId === 'pyramid') {
    const base = dims.a * PX_PER_CM * 0.8;
    const h = dims.b * PX_PER_CM * 0.8;
    const slant = Math.sqrt(h * h + (base / 2) * (base / 2));
    return (
      <div className="flex flex-col items-center gap-1">
        <div
          style={{ ...cellStyle, width: base, height: slant, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        />
        <div className="flex items-center">
          <div style={{ ...cellStyle, width: slant * 0.9, height: base, clipPath: 'polygon(100% 50%, 0% 0%, 0% 100%)' }} />
          <div style={{ ...cellStyle, width: base, height: base }} />
          <div style={{ ...cellStyle, width: slant * 0.9, height: base, clipPath: 'polygon(0% 50%, 100% 0%, 100% 100%)' }} />
        </div>
        <div
          style={{ ...cellStyle, width: base, height: slant, clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
        />
      </div>
    );
  }

  // prism net: 2 triangles + 3 rectangles in a row
  const base = dims.a * PX_PER_CM * 0.75;
  const h = dims.b * PX_PER_CM * 0.75;
  const triHeight = base * 0.87;
  return (
    <div className="flex items-center gap-1">
      <div style={{ ...cellStyle, width: triHeight, height: base, clipPath: 'polygon(0% 50%, 100% 0%, 100% 100%)' }} />
      <div className="flex flex-col gap-1">
        <div style={{ ...cellStyle, width: h, height: base }} />
      </div>
      <div style={{ ...cellStyle, width: triHeight, height: base, clipPath: 'polygon(100% 50%, 0% 0%, 0% 100%)' }} />
    </div>
  );
};
