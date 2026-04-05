const fs = require('fs');

const petFriendlyIds = new Set([
  3, 11, 12, 14, 15, 73, 19, 20, 21, 24, 29, 40, 43, 46, 47, 50, 55, 66
]);

const tsv = fs.readFileSync('restaurants.tsv', 'utf8');
const lines = tsv.trim().split('\n');

const newLines = lines.map((line, index) => {
  if (line.startsWith('ID\t')) {
    const parts = line.split('\t');
    parts[6] = '寵物友善';
    return parts.join('\t');
  }
  const parts = line.split('\t');
  if (parts.length < 15) return line;
  
  const id = parseInt(parts[0], 10);
  
  // Update the 7th column (index 6) to be pet friendly status
  parts[6] = petFriendlyIds.has(id) ? '是' : '否';
  
  return parts.join('\t');
});

fs.writeFileSync('restaurants.tsv', newLines.join('\n') + '\n', 'utf8');
console.log('Updated pet friendly status in restaurants.tsv');
