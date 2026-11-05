import React from 'react';
import type { SubjectId } from '../../types';
import { useDesignMode } from '../../utils/designMode';
import math from '../../assets/labs/scenes/math.webp';
import language from '../../assets/labs/scenes/language.webp';
import science from '../../assets/labs/scenes/science.webp';
import geography from '../../assets/labs/scenes/geography.webp';
import history from '../../assets/labs/scenes/history.webp';
import creative from '../../assets/labs/scenes/creative.webp';
import mosque from '../../assets/labs/salat/backdrop-landscape.webp';
import electricity from '../../assets/labs/electricity/backdrop-landscape.webp';
import road from '../../assets/labs/road/backdrop-landscape.webp';
import souk from '../../assets/labs/souk/backdrop-landscape.webp';
import wudu from '../../assets/labs/wudu/backdrop-landscape.webp';
import speed from '../../assets/labs/speed/speed-landscape.webp';
import './labAtmosphere.css';

const GROUPS: readonly { image: string; ids: readonly string[] }[] = [
  { image: math, ids: ['soroban', 'geometry', 'converter', 'educational_calculator', 'multiplication', 'primary_math_ops', 'fractions_lab', 'area_grid', 'clock_trainer'] },
  { image: language, ids: ['arabic_conjugator', 'french_lab', 'english_lab', 'tamazight_lab', 'tamazight_curriculum', 'french_projects', 'english_audio_dialogues', 'syllable_studio', 'speed_reading'] },
  { image: science, ids: ['science_lab', 'human_anatomy', 'earth_cycles', 'primary_discovery'] },
  { image: geography, ids: ['wilayas_map', 'topography_map', 'world_flags_lab'] },
  { image: history, ids: ['history_museum'] },
  { image: creative, ids: ['touch_writing', 'cem_prep_lab', 'cahiers_lab'] },
  { image: mosque, ids: ['quran_lab', 'salat_lab', 'mosque_adab_lab'] },
  { image: electricity, ids: ['electricity'] },
  { image: road, ids: ['road_code_lab'] },
  { image: souk, ids: ['souk_lab', 'algerian_market'] },
  { image: wudu, ids: ['wudu_lab'] },
  { image: speed, ids: ['speed_lab'] },
];

/** Decoration only: exact diagrams, text, and interactive coordinates remain in each lab. */
export function LabAtmosphere({ subject }: { subject: SubjectId }) {
  const [mode] = useDesignMode();
  const scene = GROUPS.find(group => group.ids.includes(subject));
  if (mode !== 'world' || !scene) return null;
  return <div className="lab-atmosphere" aria-hidden="true" data-lab-art={subject}>
    <img src={scene.image} alt="" decoding="async" draggable={false} />
    <span className="lab-atmosphere-light" />
  </div>;
}
