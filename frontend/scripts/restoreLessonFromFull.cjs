// Inverse of stripLessonToShell.cjs: splice *.full.json back into a courses/*.ts lesson block.
const fs = require('fs');
const path = require('path');

const [, , lessonId, sourceFilePath] = process.argv;
if (!lessonId || !sourceFilePath) {
  console.error('Usage: node scripts/restoreLessonFromFull.cjs <lessonId> <path/to/source.ts>');
  process.exit(1);
}

const fullPath = path.join(__dirname, 'premium-content-out', `${lessonId}.full.json`);
const full = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
const src = fs.readFileSync(sourceFilePath, 'utf-8');
const lines = src.split('\n');

const idLineIdx = lines.findIndex((l) => l.trim() === `id: '${lessonId}',`);
if (idLineIdx === -1) {
  console.error(`Could not find "id: '${lessonId}'," in ${sourceFilePath}`);
  process.exit(1);
}

let startIdx = -1;
for (let i = idLineIdx; i >= 0; i--) {
  if (lines[i] === '{') {
    startIdx = i;
    break;
  }
}
let endIdx = -1;
for (let i = idLineIdx; i < lines.length; i++) {
  if (lines[i] === '},') {
    endIdx = i;
    break;
  }
}
if (startIdx === -1 || endIdx === -1) {
  console.error('Could not locate standalone { / }, block boundaries');
  process.exit(1);
}

function tsString(v) {
  return `'${String(v)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')}'`;
}
function tsValue(v, indent) {
  if (v === null) return 'null';
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    const items = v.map((item) => indent + '    ' + tsValue(item, indent + '    '));
    return '[\n' + items.join(',\n') + '\n' + indent + ']';
  }
  if (v && typeof v === 'object') {
    const keys = Object.keys(v);
    if (keys.length === 0) return '{}';
    const items = keys.map((k) => `${indent}    ${k}: ${tsValue(v[k], indent + '    ')},`);
    return '{\n' + items.join('\n') + '\n' + indent + '}';
  }
  if (typeof v === 'string') return tsString(v);
  return JSON.stringify(v);
}

const block = ['{'];
for (const [key, value] of Object.entries(full)) {
  block.push(`    ${key}: ${tsValue(value, '    ')},`);
}
block.push('},');

const newLines = [...lines.slice(0, startIdx), ...block, ...lines.slice(endIdx + 1)];
fs.writeFileSync(sourceFilePath, newLines.join('\n'), 'utf-8');
console.log(
  `Replaced lines ${startIdx + 1}-${endIdx + 1} (${endIdx - startIdx + 1} lines) with a ${block.length}-line full lesson.`
);
