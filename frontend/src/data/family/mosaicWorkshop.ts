import type { PrimaryGrade } from '../../types';
import type { Bilingual } from './familyContent';
export interface MosaicTask {
    id: string;
    rows: number;
    columns: number;
    target: number;
    rule: 'count' | 'rows' | 'rectangle' | 'fraction';
    prompt: Bilingual;
    hint: Bilingual;
    explanation: Bilingual;
}
const b = (fr: string, ar: string): Bilingual => ({ fr, ar });
const task = (grade: PrimaryGrade, step: number, rows: number, columns: number, target: number, rule: MosaicTask['rule'], prompt: Bilingual, hint: Bilingual, explanation: Bilingual): MosaicTask => ({ id: 'mosaic:' + grade + ':' + step, rows, columns, target, rule, prompt, hint, explanation });
export const MOSAIC_TASKS: Record<PrimaryGrade, MosaicTask[]> = {
    '1AP': [4, 6, 9].map((n, i) => task('1AP', i, 3, 3, n, 'count', b('Pose exactement ' + n + ' carreaux pour décorer la cour.', 'ضع ' + n + ' بلاطات بالضبط لتزيين الساحة.'), b('Touche une case à la fois. Tu peux retoucher une case pour enlever son carreau.', 'المس خانة واحدة كل مرة. المس البلاطة مجدداً لحذفها.'), b('Un geste, un carreau : il faut compter chaque case remplie une seule fois. Il y en a ' + n + '.', 'كل حركة تضيف بلاطة. نعدّ كل خانة ملوّنة مرة واحدة. عددها ' + n + '.'))),
    '2AP': [2, 3, 4].map((n, i) => task('2AP', i, 3, 4, n * 3, 'rows', b('Décore chacune des 3 rangées avec ' + n + ' carreaux.', 'زيّن كل صف من الصفوف الثلاثة بـ ' + n + ' بلاطات.'), b('Compte dans chaque rangée horizontale : les trois rangées doivent en avoir autant.', 'عدّ في كل صف أفقي. يجب أن تحتوي الصفوف الثلاثة على العدد نفسه.'), b('Trois groupes égaux : ' + n + ' + ' + n + ' + ' + n + ' = ' + n * 3 + ' carreaux.', 'ثلاث مجموعات متساوية: ' + n + ' + ' + n + ' + ' + n + ' = ' + n * 3 + ' بلاطات.'))),
    '3AP': [[2, 3], [3, 3], [3, 4]].map(([r, c], i) => task('3AP', i, 4, 4, r * c, 'rectangle', b('Construis un rectangle sans trou de ' + r * c + ' carreaux. Un carré est aussi accepté.', 'كوّن مستطيلاً متصلاً بلا فراغات من ' + r * c + ' بلاطات. يُقبل المربّع أيضاً.'), b('Les carreaux doivent former des rangées voisines de même longueur, alignées.', 'كوّن صفوفاً متجاورة بالطول نفسه ومصطفّة.'), b('Chaque carreau couvre une unité d’aire. Ce rectangle couvre ' + r * c + ' unités : on multiplie son nombre de rangées par son nombre de colonnes.', 'كل بلاطة تغطي وحدة مساحة. مساحة المستطيل ' + r * c + ' وحدات: نضرب عدد صفوفه في عدد أعمدته.'))),
    '4AP': [[1, 2], [3, 4], [2, 3]].map(([n, d], i) => task('4AP', i, 3, 4, 12 * n / d, 'fraction', b('La mosaïque a 12 cases égales. Colore ' + n + '/' + d + ' de sa surface.', 'للفسيفساء 12 خانة متساوية. لوّن ' + n + '/' + d + ' من مساحتها.'), b('Partage les 12 cases en ' + d + ' groupes égaux, puis prends ' + n + ' de ces groupes.', 'قسّم الخانات الاثنتي عشرة إلى ' + d + ' مجموعات متساوية ثم خذ ' + n + ' مجموعات.'), b('12 ÷ ' + d + ' × ' + n + ' = ' + 12 * n / d + ' cases. Les cases sont de même aire ; leur emplacement ne change pas la fraction.', '12 ÷ ' + d + ' × ' + n + ' = ' + 12 * n / d + ' خانات. الخانات متساوية المساحة؛ مكانها لا يغيّر الكسر.'))),
    '5AP': [
        task('5AP', 0, 2, 5, 4, 'fraction', b('Colore 2/5 des 10 cases égales.', 'لوّن 2/5 من الخانات العشر المتساوية.'), b('Un cinquième de 10 vaut 2. Cherche deux cinquièmes.', 'خُمس العدد 10 يساوي 2. ابحث عن خُمسَين.'), b('10 ÷ 5 × 2 = 4. Donc 2/5 = 4/10.', '10 ÷ 5 × 2 = 4. إذن 2/5 = 4/10.')),
        task('5AP', 1, 4, 5, 15, 'fraction', b('Colore 3/4 des 20 cases égales.', 'لوّن 3/4 من الخانات العشرين المتساوية.'), b('Un quart de 20 vaut 5. Prends trois groupes de 5.', 'رُبع 20 يساوي 5. خذ ثلاث مجموعات من 5.'), b('20 ÷ 4 × 3 = 15. Les 5 cases restantes représentent 1/4.', '20 ÷ 4 × 3 = 15. الخانات الخمس الباقية تمثل 1/4.')),
        task('5AP', 2, 4, 4, 4, 'fraction', b('Colore 25 % des 16 cases égales.', 'لوّن 25 % من الخانات الست عشرة المتساوية.'), b('25 % = 25/100 = 1/4. Cherche le quart de 16.', '25 % = 25/100 = 1/4. ابحث عن رُبع 16.'), b('16 ÷ 4 = 4. Quatre cases sur seize représentent 25 % de la surface.', '16 ÷ 4 = 4. أربع خانات من أصل ست عشرة تمثل 25 % من المساحة.')),
    ],
};
export function checkMosaic(task: MosaicTask, selected: readonly number[]): boolean {
    const cells = [...new Set(selected)];
    if (cells.length !== selected.length || cells.length !== task.target || cells.some(i => !Number.isInteger(i) || i < 0 || i >= task.rows * task.columns))
        return false;
    if (task.rule === 'rows')
        return Array.from({ length: task.rows }, (_, row) => cells.filter(i => Math.floor(i / task.columns) === row).length).every(n => n === task.target / task.rows);
    if (task.rule === 'rectangle') {
        const rows = cells.map(i => Math.floor(i / task.columns));
        const cols = cells.map(i => i % task.columns);
        return (Math.max(...rows) - Math.min(...rows) + 1) * (Math.max(...cols) - Math.min(...cols) + 1) === cells.length;
    }
    return true;
}
