import React, { useRef, useState } from 'react';
import { PreschoolActivity } from '../../data/preschool/types';
import { playSuccessChime } from './usePreschoolAudio';

interface PreschoolMazeProps {
  activity: PreschoolActivity;
  onComplete: () => void;
}

const CANVAS_SIZE = 260;
// Generous catch radius around each waypoint — a 3-5 year old's finger is wide and imprecise, so the
// point is "did you travel through roughly this area", never pixel-perfect path following.
const WAYPOINT_TOLERANCE = 30;

// A stricter cousin of find_path: the traveler must pass near every waypoint along the way, not just
// land in the end zone. Order isn't enforced (a wandering finger still "visits" waypoints it crosses),
// which keeps this forgiving while still requiring the child to actually trace the route, not just
// jump straight from start to finish.
export const PreschoolMaze: React.FC<PreschoolMazeProps> = ({ activity, onComplete }) => {
  const waypoints = activity.visualAssets.mazeWaypoints || [];
  const travelerAsset = activity.visualAssets.mazeTravelerAsset || '🐭';
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const completedRef = useRef(false);
  const [travelerPos, setTravelerPos] = useState(waypoints[0] || { x: 0, y: 0 });
  const [visited, setVisited] = useState<Set<number>>(new Set(waypoints.length ? [0] : []));

  if (!waypoints.length) return null;

  const toLocalPoint = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const checkWaypoints = (point: { x: number; y: number }) => {
    setVisited((prev) => {
      let changed = false;
      const next = new Set(prev);
      waypoints.forEach((wp, i) => {
        if (next.has(i)) return;
        if (Math.hypot(point.x - wp.x, point.y - wp.y) <= WAYPOINT_TOLERANCE) {
          next.add(i);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (completedRef.current) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragging.current = true;
    const point = toLocalPoint(e.clientX, e.clientY);
    setTravelerPos(point);
    checkWaypoints(point);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current || completedRef.current) return;
    const point = toLocalPoint(e.clientX, e.clientY);
    setTravelerPos(point);
    checkWaypoints(point);
  };

  const finishIfComplete = () => {
    if (completedRef.current) return;
    setVisited((current) => {
      if (current.size === waypoints.length) {
        completedRef.current = true;
        playSuccessChime();
        setTimeout(onComplete, 900);
      }
      return current;
    });
  };

  const handlePointerUp = () => {
    dragging.current = false;
    finishIfComplete();
  };

  const guidePoints = waypoints.map((wp) => `${wp.x},${wp.y}`).join(' ');
  const solved = visited.size === waypoints.length;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        ref={svgRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="touch-none rounded-[2rem] border-4 border-sky-300 bg-sky-50 shadow-inner cursor-grab active:cursor-grabbing select-none"
      >
        <polyline points={guidePoints} fill="none" stroke="#bae6fd" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={guidePoints} fill="none" stroke="#7dd3fc" strokeWidth={3} strokeDasharray="6 8" strokeLinecap="round" />

        {waypoints.map((wp, i) => (
          <circle key={i} cx={wp.x} cy={wp.y} r={9} fill={visited.has(i) ? '#22c55e' : '#ffffff'} stroke="#38bdf8" strokeWidth={2} />
        ))}

        {waypoints[waypoints.length - 1] && (
          <text x={waypoints[waypoints.length - 1].x} y={waypoints[waypoints.length - 1].y - 22} textAnchor="middle" fontSize={34}>
            🏁
          </text>
        )}

        <text
          x={travelerPos.x}
          y={travelerPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={40}
          style={{ pointerEvents: 'none' }}
        >
          {travelerAsset}
        </text>
      </svg>

      <p className="text-sm font-black text-sky-700">
        {solved ? '🌟🌟🌟' : `${visited.size}/${waypoints.length} 🐾`}
      </p>
    </div>
  );
};
