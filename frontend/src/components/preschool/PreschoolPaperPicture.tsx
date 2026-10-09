import React from 'react';
import { COLORING_ART, ColoringArtId } from '../../data/preschool/coloringArt';
import { PreschoolLineArt } from './PreschoolLineArt';

/** Ink-saving symbols: counting and coloring must work on a monochrome printer. */
export const PreschoolPaperPicture: React.FC<{ asset: string; className?: string }> = ({ asset, className = '' }) => {
  const collection = asset.match(/🍎|🍊|🍋|🫒/gu);
  if (collection && collection.length > 1 && collection.join('') === asset) return <div className={`paper-picture paper-multiple ${className}`}>{collection.map((item,i)=><PreschoolPaperPicture key={i} asset={item}/>)}</div>;
  const art: Record<string, ColoringArtId> = { '🍎':'apple','⭐':'star_crescent','🌟':'star_crescent','🌴':'palm','🐪':'camel','⛵':'boat','🐟':'fish','🐠':'fish','🌸':'flower','☀️':'sun','🏠':'house','🕌':'mosque','🫒':'olive' };
  const id = asset.startsWith('art:') ? asset.slice(4) : art[asset];
  if (id && id in COLORING_ART && asset !== '⭐' && asset !== '🌟') return <PreschoolLineArt id={id as ColoringArtId} className={`paper-picture ${className}`} />;
  const circle = 'M20 50 A30 30 0 1 0 80 50 A30 30 0 1 0 20 50';
  const paths: Record<string,string[]> = {
    '🔷':['M50 8 L90 50 L50 92 L10 50 Z'],
    '🍉':['M10 26 H90 Q85 89 50 91 Q15 89 10 26 Z','M18 26 Q22 80 50 82 Q78 80 82 26 M35 43 V50 M65 43 V50 M50 59 V66'],
    '🍇':['M45 18 Q49 5 63 9 M33 29 A11 11 0 1 0 55 29 A11 11 0 1 0 33 29 M54 29 A11 11 0 1 0 76 29 A11 11 0 1 0 54 29 M22 50 A11 11 0 1 0 44 50 A11 11 0 1 0 22 50 M43 50 A11 11 0 1 0 65 50 A11 11 0 1 0 43 50 M33 71 A11 11 0 1 0 55 71 A11 11 0 1 0 33 71'],
    '🐐':['M25 32 Q16 7 27 6 L37 27 M75 32 Q84 7 73 6 L63 27 M25 32 L10 29 L24 45 M75 32 L90 29 L76 45 M26 29 Q50 19 74 29 L77 62 Q50 89 23 62 Z M34 45 H40 M60 45 H66 M45 63 L55 63 L50 70 Z M39 77 L50 94 L61 77'],
    '🐴':['M29 26 L22 7 L41 20 L60 10 L71 28 L80 68 Q65 90 34 83 L22 63 L38 49 Z M48 38 H54 M63 70 H67 M60 13 Q88 20 87 61 M24 64 L78 66'],
    '🧶':['M15 51 A35 35 0 1 0 85 51 A35 35 0 1 0 15 51 M25 25 Q30 71 70 79 M37 18 Q42 64 81 69 M18 42 Q54 36 79 31 M16 58 Q51 51 84 46 M51 85 Q70 99 91 91'],
    '⭐':['M50 8 L62 35 L92 38 L69 58 L76 89 L50 73 L24 89 L31 58 L8 38 L38 35 Z'],
    '🌟':['M50 8 L62 35 L92 38 L69 58 L76 89 L50 73 L24 89 L31 58 L8 38 L38 35 Z'],
    '🍊':[circle,'M50 19 Q61 3 76 13 Q64 29 50 19'], '🍋':['M13 49 Q28 10 64 19 L85 30 L90 48 Q74 87 37 81 L17 69 Z'],
    '🦋':['M48 44 Q15 3 10 35 Q3 61 42 58 Q8 61 17 87 Q33 99 48 61 M52 44 Q85 3 90 35 Q97 61 58 58 Q92 61 83 87 Q67 99 52 61 M48 35 H52 V78 H48 Z M49 35 L38 21 M51 35 L62 21'],
    '🐄':['M25 33 L10 20 L17 43 M75 33 L90 20 L83 43 M25 31 Q50 18 75 31 L80 68 Q50 95 20 68 Z M25 64 Q50 48 75 64 L73 77 Q50 91 27 77 Z M33 45 H39 M61 45 H67 M37 71 H40 M60 71 H63'],
    '🐑':['M18 40 Q6 17 29 18 Q35 3 52 17 Q75 6 80 30 Q99 37 82 60 L82 77 H70 V62 H30 V77 H18 Z M41 34 Q52 22 63 34 V63 Q52 77 41 63 Z'],
    '🐔':['M28 75 Q12 55 29 43 Q35 35 55 38 V24 Q66 10 77 23 L82 39 L95 44 L78 52 Q78 80 47 82 Z M48 56 Q27 50 35 70 M42 81 V93 M60 80 V93 M29 21 L40 35 L18 38 Z M67 28 H69'],
    '🐝':['M19 50 Q19 29 50 29 Q81 29 81 50 Q81 75 50 75 Q19 75 19 50 Z M34 32 V72 M50 30 V75 M65 32 V72 M35 28 Q19 1 42 9 L50 28 Q74 1 75 19 L65 30 M81 47 L93 53 L81 60 Z'],
    '🦆':['M18 60 Q42 77 55 50 L57 30 Q70 13 82 28 L89 42 L77 47 Q76 81 44 82 Q19 83 18 60 Z M79 32 L97 35 L80 42 M30 65 Q42 52 55 63'],
    '🐱':['M23 36 L20 9 L43 24 Q51 19 58 25 L80 9 L77 36 Q94 69 69 82 Q50 94 29 82 Q8 67 23 36 Z M30 48 H38 M62 48 H70 M46 63 L54 63 L50 69 Z M50 69 L50 77 M30 65 L8 58 M70 65 L92 58'],
    '🐶':['M24 31 Q8 19 7 48 Q7 68 27 61 M76 31 Q92 19 93 48 Q93 68 73 61 M25 25 Q50 8 75 25 L78 66 Q50 95 22 66 Z M32 45 H39 M61 45 H68 M44 64 L56 64 L50 72 Z'],
    '🥛':['M26 13 H74 L68 89 H32 Z M29 38 H71'], '🥚':['M26 59 Q25 13 50 11 Q75 13 74 59 Q72 90 50 90 Q28 90 26 59 Z'],
    '🍯':['M26 20 H74 V34 L82 41 V84 H18 V41 L26 34 Z M22 47 H78 M22 72 H78'],
    '⚪':[circle], '🔵':[circle], '🟡':[circle], '🟦':['M19 19 H81 V81 H19 Z'], '🟩':['M19 19 H81 V81 H19 Z'], '🟧':['M19 19 H81 V81 H19 Z','M28 28 L72 72 M28 72 L72 28'], '⬜':['M19 19 H81 V81 H19 Z'], '🔺':['M50 10 L90 86 H10 Z'], '❤️':['M50 87 L12 48 Q1 9 31 15 Q44 17 50 32 Q58 9 78 16 Q99 25 87 47 Z'],
    'scene:above':['M10 65 H90 V75 H10 Z','M35 30 A15 15 0 1 0 65 30 A15 15 0 1 0 35 30'],
    'scene:below':['M10 25 H90 V35 H10 Z','M35 70 A15 15 0 1 0 65 70 A15 15 0 1 0 35 70'],
    'scene:inside':['M15 20 H85 V88 H15 Z','M35 52 A15 15 0 1 0 65 52 A15 15 0 1 0 35 52'],
    'scene:outside':['M8 28 H48 V87 H8 Z','M63 69 A13 13 0 1 0 89 69 A13 13 0 1 0 63 69'],
    'face:happy':['M12 50 A38 38 0 1 0 88 50 A38 38 0 1 0 12 50','M30 39 H36 M64 39 H70 M28 60 Q50 87 72 60'],
    'face:sad':['M12 50 A38 38 0 1 0 88 50 A38 38 0 1 0 12 50','M30 39 H36 M64 39 H70 M28 73 Q50 47 72 73'],
    'face:angry':['M12 50 A38 38 0 1 0 88 50 A38 38 0 1 0 12 50','M26 29 L41 37 M59 37 L74 29 M30 43 H36 M64 43 H70 M31 72 Q50 50 69 72'],
  };
  if (paths[asset]) return <svg viewBox="0 0 100 100" className={`paper-picture ${className}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">{paths[asset].map((d,i)=><path key={i} d={d}/>)}</svg>;
  return <span className={`paper-picture paper-glyph ${className}`}>{asset}</span>;
};
