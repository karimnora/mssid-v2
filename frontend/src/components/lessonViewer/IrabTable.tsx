import React from 'react';
import { motion } from 'motion/react';

export interface IrabTableRow {
  wordAr: string;
  analysisAr: string;
}

interface IrabTableProps {
  rows: IrabTableRow[];
  /** Default الكلمة — right-hand column in RTL. */
  wordLabelAr?: string;
  /** Default إعرابها. Pass دَوْرُهَا فِي الجُمْلَةِ for 3AP (no case marks). */
  analysisLabelAr?: string;
}

/**
 * Official Algerian two-column grammar table (CLAUDE.md Module Iʿrāb):
 * الكلمة | إعرابها. First header cell is الكلمة so RTL puts it on the right.
 */
export const IrabTable: React.FC<IrabTableProps> = ({
  rows,
  wordLabelAr = 'الكَلِمَةُ',
  analysisLabelAr = 'إِعْرَابُهَا',
}) => {
  if (rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-amber-200/80 bg-amber-50/60 p-1" dir="rtl">
      <table className="w-full min-w-[280px] border-collapse text-right" data-irab-table>
        <caption className="sr-only">
          {wordLabelAr} و{analysisLabelAr}
        </caption>
        <thead>
          <tr className="bg-amber-100 text-slate-900">
            <th scope="col" className="px-4 py-3 text-xs font-black rounded-tr-2xl">
              {wordLabelAr}
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-black rounded-tl-2xl">
              {analysisLabelAr}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <motion.tr
              key={`${row.wordAr}-${idx}`}
              className="border-t border-amber-200/80 bg-white"
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            >
              <td className="px-4 py-3.5 text-sm font-black text-slate-900 min-h-12 align-middle">
                {row.wordAr}
              </td>
              <td className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed align-middle">
                {row.analysisAr}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export function irabAnalysisHeaderForGrade(grade: string): string {
  return grade === '3AP' ? 'دَوْرُهَا فِي الجُمْلَةِ' : 'إِعْرَابُهَا';
}
