const fs = require('node:fs'); const path = require('node:path'); const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const source = path.join(root, 'frontend/src');
const entries = [];
function files(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(x => x.isDirectory()?files(path.join(dir,x.name)):[path.join(dir,x.name)]); }
for (const file of files(source).filter(f=>/\.(ts|tsx)$/.test(f)&&! /\.(test|spec)\./.test(f))) {
 const text=fs.readFileSync(file,'utf8');if(!/localStorage|progressStorage|ownerStorageKey/.test(text))continue;
 const ast=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true), constants=new Map();
 function collect(n){if(ts.isVariableDeclaration(n)&&n.initializer&&ts.isStringLiteral(n.initializer))constants.set(n.name.getText(ast),n.initializer.text);ts.forEachChild(n,collect);}collect(ast);
 function walk(n){
  if(ts.isCallExpression(n)&&ts.isPropertyAccessExpression(n.expression)&&['getItem','setItem','removeItem','clear'].includes(n.expression.name.text)) {
   const receiver=n.expression.expression.getText(ast);
   if(/localStorage|progressStorage|^storage$/.test(receiver)) {
    const arg=n.arguments[0], expression=arg?.getText(ast)??null;
    const key=arg&&ts.isStringLiteral(arg)?arg.text:constants.get(expression)??null;
    const location=ast.getLineAndCharacterOfPosition(n.getStart(ast));
    entries.push({file:path.relative(root,file).replace(/\\/g,'/'),line:location.line+1,operation:n.expression.name.text,receiver,key,expression});
   }
  }
  ts.forEachChild(n,walk);
 }walk(ast);
}
const output=path.join(root,'docs/design/audit-prescolaire');fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'storage-inventory.json'),JSON.stringify({scope:'Runtime frontend/src; excludes tests. Dynamic expressions retained for manual review; localStorage aliases and progressStorage included.',calls:entries.length,files:new Set(entries.map(x=>x.file)).size,entries},null,2)+'\n');
console.log(JSON.stringify({calls:entries.length,files:new Set(entries.map(x=>x.file)).size}));
