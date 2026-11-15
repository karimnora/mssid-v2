// Run from frontend: node scripts/normalize-course-thousands.cjs [--write]
// Only string/template tokens are edited. Numeric literals and decimal punctuation stay intact.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function normalizeThousands(text) {
  // U+202F keeps the groups left-to-right inside Arabic and prevents mid-number line breaks.
  return text.replace(/(?<![\d.,\u00a0\u202f])([1-9]\d{0,2}(?:[, \u00a0\u202f]\d{3})+)(?![\d,])/g,
    value => value.replace(/[, \u00a0\u202f]/g, '\u202f'));
}

function run(write, banksOnly = false) {
  const changes = [];
  function scanFileBank() {
    for (const name of ['examsData.ts', 'challengesData.ts']) scan(path.resolve(__dirname, '../src/data', name));
  }
  function scan(dir) {
    const isFile = fs.statSync(dir).isFile();
    for (const entry of isFile ? [{ name: path.basename(dir), isDirectory: () => false }] : fs.readdirSync(dir, { withFileTypes: true })) {
      const file = isFile ? dir : path.join(dir, entry.name);
      if (entry.isDirectory()) scan(file);
      else if (file.endsWith('.ts') && !file.endsWith('.test.ts')) {
        const source = fs.readFileSync(file, 'utf8');
        const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
        const edits = [];
        function visit(node) {
          if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
            const from = node.getStart(tree);
            const raw = source.slice(from, node.end);
            const next = normalizeThousands(raw);
            if (raw !== next) edits.push({ from, to: node.end, next, line: tree.getLineAndCharacterOfPosition(from).line + 1, before: raw });
          }
          ts.forEachChild(node, visit);
        }
        visit(tree);
        if (edits.length) {
          changes.push({ file: path.relative(process.cwd(), file), strings: edits.length, examples: edits.slice(0, 2).map(({ line, before, next }) => ({ line, before, after: next })) });
          if (write) {
            let result = source;
            for (const edit of edits.reverse()) result = result.slice(0, edit.from) + edit.next + result.slice(edit.to);
            fs.writeFileSync(file, result);
          }
        }
      }
    }
  }
  for (const directory of banksOnly ? ['exams', 'challenges'] : ['courses']) scan(path.resolve(__dirname, '../src/data', directory));
  // Standalone banks use the same token-only transformation.
  if (banksOnly) scanFileBank();
  console.log(JSON.stringify({ applied: write, files: changes.length, strings: changes.reduce((sum, file) => sum + file.strings, 0), changes }, null, 2));
}

module.exports = { normalizeThousands };
if (require.main === module) run(process.argv.includes('--write'), process.argv.includes('--banks'));
