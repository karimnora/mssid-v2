import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { NumberLine } from './components/manipulations/NumberLine';
import { PlaceValueTable } from './components/manipulations/PlaceValueTable';
import { TwoColumnProblem } from './components/manipulations/TwoColumnProblem';
import didou from './assets/design/home-v3/didou-greet.webp';
import './manipulationDemo.css';
function ManipulationDemo() {
    const [tab, setTab] = useState(0), [position, setPosition] = useState(1.2), [number, setNumber] = useState(999900n);
    return <main lang="ar" dir="rtl"><header><img src={didou} alt="ديدو" width="100" height="120"/><div><h1>ورشة النماذج مع ديدو</h1><p>للتجربة والمراجعة فقط. لا نقاط ولا نتائج محفوظة، وليست درسًا منشورًا.</p></div></header>
    <nav aria-label="نماذج المناولة">{['المستقيم المدرج', 'جدول المنازل', 'مسألة في عمودين'].map((label, i) => <button key={label} aria-pressed={tab === i} onClick={() => setTab(i)}>{label}</button>)}</nav>
    {tab === 0 ? <NumberLine min={0} max={5} step={0.1} value={position} onChange={setPosition}/> : tab === 1 ? <PlaceValueTable value={number} onChange={setNumber}/> : <TwoColumnProblem problem={{ statement: 'اشترت مريم كتابًا بـ 125 دج وكراسًا بـ 75 دج. كم دفعت؟', left: 125, right: 75, operation: '+', unit: 'دج' }}/>}
  </main>;
}
createRoot(document.getElementById('root')!).render(<ManipulationDemo />);
