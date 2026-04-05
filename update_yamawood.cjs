const fs = require('fs');

const tsv = fs.readFileSync('restaurants.tsv', 'utf8');
const lines = tsv.trim().split('\n');

const newLines = lines.map(line => {
  const parts = line.split('\t');
  // ID 25: 入木三分 無菜單蔬食
  if (parts[0] === '25') {
    parts[11] = 'https://www.facebook.com/yamawood/';
  }
  return parts.join('\t');
});

fs.writeFileSync('restaurants.tsv', newLines.join('\n') + '\n', 'utf8');
console.log('Updated 入木三分 FB link');
