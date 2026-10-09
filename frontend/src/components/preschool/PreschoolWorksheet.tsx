import React from 'react';
import { PrintableWorksheet, isWorksheetAvailableInLanguage } from '../../data/preschool/printablesData';
import { PreschoolLanguage } from '../../data/preschool/types';
import { PreschoolLineArt } from './PreschoolLineArt';
import { PreschoolPaperPicture } from './PreschoolPaperPicture';

const words = {
  ar: { name:'الاسم',date:'التاريخ',guide:'أتتبّع النموذج',try:'أجرّب وحدي',draw:'أرسم أو أكتب وحدي',listen:'ألاحظ النموذج',count:'أعدّ، ثم أكتب العدد',tell:'أرتّب الصور، ثم أحكي القصة',parent:'نشاط مع شخص بالغ',school:'مَسِيد DZ — التحضيري',cut:'أقصّ مع شخص بالغ، ثم ألصق هنا',circle:'أحيط الشكل المطلوب' },
  fr: { name:'Prénom',date:'Date',guide:'Je suis le modèle',try:'J’essaie sans modèle',draw:'Je dessine ou j’écris seul',listen:'J’observe le modèle',count:'Je compte, puis j’écris le nombre',tell:'Je découpe, je remets dans l’ordre et je raconte',parent:'À faire avec un adulte',school:'Mssid DZ — Préscolaire',cut:'Je découpe avec un adulte, puis je colle ici',circle:'J’entoure la bonne image' },
  en: { name:'Name',date:'Date',guide:'I follow the model',try:'I try without a model',draw:'I draw or write on my own',listen:'I look at the model',count:'I count, then write the number',tell:'I cut, put in order and tell the story',parent:'With a grown-up',school:'Mssid DZ — Preschool',cut:'I cut with a grown-up, then paste here',circle:'I circle the right picture' },
};

const GuideRow: React.FC<{ glyph:string; repeat:number; guided:boolean }> = ({ glyph, repeat, guided }) => (
  <div className="paper-writing-row" dir={/\p{Script=Arabic}/u.test(glyph) ? 'rtl' : 'ltr'}>
    {Array.from({length:Math.min(repeat,8)},(_,i)=><div key={i} className="paper-writing-cell"><span className={guided ? (i===0?'paper-model':'paper-trace') : 'paper-empty'}>{guided ? glyph : '\u00a0'}</span></div>)}
  </div>
);

export const WorksheetBody: React.FC<{ sheet:PrintableWorksheet; language:PreschoolLanguage }> = ({sheet,language}) => {
  const t=words[language];
  switch(sheet.kind) {
    case 'letter_trace': {
      const rows=sheet.traceRows ?? [];
      if (!rows.length) return null;
      const guidedCount = Math.max(5, rows.length);
      const exercises = [
        ...Array.from({length:guidedCount},(_,i)=>({row:rows[i%rows.length],guided:true})),
        ...Array.from({length:3},(_,i)=>({row:rows[i%rows.length],guided:false})),
      ];
      return <div className="worksheet-body paper-tracing">
        <div className="paper-letter-intro"><span className="paper-large-glyph">{rows.map(r=>r.glyph).join('  ')}</span>{(sheet.glyphPictureI18n?.[language] ?? sheet.glyphPicture) && <PreschoolPaperPicture asset={(sheet.glyphPictureI18n?.[language] ?? sheet.glyphPicture)!}/>}</div>
        {sheet.glyphWord && <p className="paper-word">{sheet.glyphWord[language]}</p>}
        <p className="paper-step">{t.guide}</p>
        {exercises.map(({row,guided},i)=><React.Fragment key={i}>{i===guidedCount&&<p className="paper-step">{t.try}</p>}<GuideRow glyph={row.glyph} repeat={8} guided={guided}/></React.Fragment>)}
      </div>;
    }
    case 'line_trace': {
      const paths=sheet.tracePaths ?? [];
      const practice=Array.from({length:Math.max(6,paths.length)},(_,i)=>paths[i%paths.length]);
      return <div className="worksheet-body paper-graphism">{practice.map((path,i)=><div className="paper-path-row" key={i}>
        <PreschoolPaperPicture asset={path.startIcon}/><svg viewBox="0 0 800 100" preserveAspectRatio="none"><circle cx="12" cy="50" r="7" fill="currentColor"/><path d={path.d} fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="9 7"/></svg><PreschoolPaperPicture asset={path.endIcon}/>
      </div>)}<div className="paper-draw-space"><span>{t.draw}</span></div></div>;
    }
    case 'count_and_color': return <div className="worksheet-body paper-counting">
      {(sheet.countRows??[]).map((row,i)=><div className="paper-count-row" key={i}><div className="paper-collection">{row.count===0?<div className="paper-zero-tray"/>:Array.from({length:row.count},(_,j)=><PreschoolPaperPicture key={j} asset={row.icon}/>)}</div><span>=</span><div className="paper-answer-box"/></div>)}
      <p className="paper-step">{t.try}</p><div className="paper-draw-space"><span>{t.draw}</span></div>
      {sheet.traceRows?.map((row,i)=><GuideRow key={i} glyph={row.glyph} repeat={row.repeatCount} guided/>)}
    </div>;
    case 'match_pairs': {
      const pairs=sheet.matchPairs??[];
      return <div className="worksheet-body paper-matching">{pairs.map((pair,i)=><div className="paper-match-row" key={i}><div><PreschoolPaperPicture asset={pair.left}/><b>○</b></div><div><b>○</b><PreschoolPaperPicture asset={pairs[pairs.length-1-i].right}/></div></div>)}<div className="paper-draw-space"><span>{t.draw}</span></div></div>;
    }
    case 'odd_one_out': return <div className="worksheet-body paper-logic">{sheet.oddOneOutSets?.map((set,i)=><div className="paper-odd-row" key={i}>{set.items.map((asset,j)=><div key={j}><PreschoolPaperPicture asset={asset}/></div>)}</div>)}<div className="paper-draw-space"><span>{t.draw}</span></div></div>;
    case 'cut_along_lines': return <div className="worksheet-body paper-cut"><div className="paper-cut-items">{sheet.cutShapes?.map((asset,i)=><div key={i}><PreschoolPaperPicture asset={asset}/></div>)}</div><p className="paper-step">{t.cut}</p><div className="paper-paste-targets">{sheet.cutShapes?.map((_,i)=><div key={i}/>)}</div></div>;
    case 'story_order': return <div className="worksheet-body paper-story"><p className="paper-step">{t.tell}</p><div className="paper-story-slots">{[1,2,3].map(n=><div key={n}><b>{n}</b></div>)}</div><div className="paper-story-cards">{[...(sheet.storyFrames??[])].reverse().map((frame,i)=><div key={i}><PreschoolPaperPicture asset={frame.asset}/><span>{frame.caption[language]}</span></div>)}</div><div className="paper-draw-space"><span>{t.draw}</span></div></div>;
    case 'coloring_page': return <div className="worksheet-body paper-coloring">{sheet.coloringShapeId&&<PreschoolLineArt id={sheet.coloringShapeId} className="paper-coloring-art"/>}<div className="paper-colors">{Array.from({length:6},(_,i)=><span key={i}/>)}</div></div>;
    default: return null;
  }
};

export const PreschoolWorksheet: React.FC<{sheet:PrintableWorksheet;language:PreschoolLanguage}> = ({sheet,language}) => {
  const t=words[language];
  if (!isWorksheetAvailableInLanguage(sheet, language)) return null;
  const discover = {ar:'أنشطة أكثر على',fr:'Encore plus d’activités sur',en:'More activities at'}[language];
  return <article lang={language} dir={language==='ar'?'rtl':'ltr'} data-preschool-printable="true" data-worksheet-id={sheet.id} className="printable-sheet preschool-worksheet">
    <header className="paper-header"><div className="paper-heading"><span>{t.school}</span><span>{t.parent}</span></div><h3>{sheet.titleI18n[language]}</h3><div className="paper-identity"><span>{t.name} : ....................................</span><span>{t.date} : ....................</span></div></header>
    <p className="paper-instruction">{sheet.instructionI18n[language]}</p>
    <WorksheetBody sheet={sheet} language={language}/>
    <footer className="paper-footer"><strong>{t.school}</strong><span>{discover} <a dir="ltr" href="https://mssid-dz.com">mssid-dz.com</a></span></footer>
  </article>;
};
