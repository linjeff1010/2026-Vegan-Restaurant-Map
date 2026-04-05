import * as fs from 'fs';

const tsv = fs.readFileSync('restaurants.tsv', 'utf8');
const lines = tsv.trim().split('\n');

// Find the header row index
let headerIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('ID\t')) {
    headerIndex = i;
    break;
  }
}

const dataLines = headerIndex !== -1 ? lines.slice(headerIndex + 1) : lines;

const restaurants = dataLines.map(line => {
  const [id, name, city, address, phone, typesStr, petFriendly, rating, reviews, desc, link, fb, ig, lat, lng] = line.split('\t');
  
  if (!id || id === 'ID') return null;

  let types = typesStr.split(',').map(t => t.trim());
  // Convert '奶蛋素' back to '奶素', '蛋素' if needed, or keep it.
  // Wait, the types in constants.ts should match VegType ('純素' | '奶素' | '蛋素' | '五辛素')
  if (types.includes('奶蛋素')) {
    types = types.filter(t => t !== '奶蛋素');
    types.push('奶素', '蛋素');
  }

  return {
    id: parseInt(id, 10),
    name,
    types,
    rating: parseFloat(rating) || 0,
    reviews: parseInt(reviews, 10) || 0,
    city,
    address,
    desc,
    lat: parseFloat(lat) || 0,
    lng: parseFloat(lng) || 0,
    link,
    phone: phone === '無電話' || phone === '無提供' || phone === '已停用' ? phone : phone,
    fb: fb || null,
    ig: ig || null,
    petFriendly: petFriendly === '是'
  };
}).filter(Boolean);

const constantsContent = `import { Restaurant } from './types';

export const RESTAURANT_DATA: Restaurant[] = ${JSON.stringify(restaurants, null, 2)};
`;

fs.writeFileSync('src/constants.ts', constantsContent, 'utf8');
console.log('constants.ts updated');
