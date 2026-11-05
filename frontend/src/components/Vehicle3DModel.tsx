import React from 'react';
import { motion } from 'motion/react';
import pedestrian from '../assets/labs/speed/v-pedestrian.webp';
import scooter from '../assets/labs/speed/v-scooter.webp';
import bike from '../assets/labs/speed/v-bike.webp';
import cityBus from '../assets/labs/speed/v-city_bus.webp';
import taxi from '../assets/labs/speed/v-taxi.webp';
import motorbike from '../assets/labs/speed/v-motorbike.webp';
import sportCar from '../assets/labs/speed/v-sport_car.webp';
import coradiaTrain from '../assets/labs/speed/v-coradia_train.webp';
import airplane from '../assets/labs/speed/v-airplane.webp';
import dust from '../assets/labs/speed/o-dust.webp';
import './speedLab.css';

/**
 * Rendered vehicles of the speed lab (docs/v2-labos-prompts-nanobanana.md, L03). Each image is
 * drawn in side view facing right; in Arabic the race runs right to left, so it is mirrored.
 * `height` is the drawn height in a race lane (wide vehicles are drawn lower).
 */
export const VEHICLE_SPRITES: Record<string, { src: string; height: number }> = {
  pedestrian: { src: pedestrian, height: 60 },
  scooter: { src: scooter, height: 58 },
  bike: { src: bike, height: 58 },
  city_bus: { src: cityBus, height: 46 },
  taxi: { src: taxi, height: 42 },
  motorbike: { src: motorbike, height: 52 },
  sport_car: { src: sportCar, height: 36 },
  coradia_train: { src: coradiaTrain, height: 34 },
  airplane: { src: airplane, height: 44 },
};

/** Small picture of a vehicle for lists, cards and results. */
export function VehicleIcon({ vehicleId, size = 40, className = '' }: { vehicleId: string; size?: number; className?: string }) {
  const sprite = VEHICLE_SPRITES[vehicleId];
  if (!sprite) return null;
  return (
    <img
      src={sprite.src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`speed-flip inline-block object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export interface Vehicle3DModelProps {
  vehicleId: string;
  color: string;
  isRacing?: boolean;
  turbo?: boolean;
  viewPerspective?: '2d' | '3d';
}

export const Vehicle3DModel: React.FC<Vehicle3DModelProps> = ({ vehicleId, color, isRacing = false, turbo = false, viewPerspective = '3d' }) => {
  const sprite = VEHICLE_SPRITES[vehicleId];
  const is3D = viewPerspective === '3d';
  if (!sprite) return null;
  return (
    <div className="relative flex items-center justify-center" data-vehicle={vehicleId} data-racing={isRacing || undefined}>
      {/* Speed lines behind the vehicle, stronger in turbo */}
      {isRacing && (
        <span className="speed-lines" data-turbo={turbo || undefined} style={{ ['--lane-color' as string]: color }} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
      {/* Dust puffing out behind */}
      {isRacing && (
        <motion.img
          src={dust}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="speed-flip absolute -start-10 bottom-0 w-12 pointer-events-none"
          animate={{ x: [0, -14], opacity: [0.85, 0], scale: [0.6, 1.2] }}
          transition={{ repeat: Infinity, duration: 0.5, ease: 'easeOut' }}
        />
      )}
      <motion.div
        animate={isRacing ? { y: [0, -3, 0], rotateZ: is3D ? [-0.6, 0.8, -0.6] : 0 } : { y: 0 }}
        transition={{ repeat: Infinity, duration: vehicleId === 'airplane' ? 1.2 : 0.35, ease: 'easeInOut' }}
      >
        <img
          src={sprite.src}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="speed-flip speed-vehicle block w-auto max-w-none"
          data-turbo={turbo || undefined}
          style={{ height: sprite.height }}
        />
      </motion.div>
      {/* Contact shadow on the road (the plane flies: a soft far shadow) */}
      <div
        className={`absolute -bottom-1 h-2.5 rounded-full mx-auto -z-10 ${vehicleId === 'airplane' ? 'w-12 bg-black/20 blur-sm' : 'w-16 bg-black/45 blur-[2px]'}`}
      />
    </div>
  );
};
