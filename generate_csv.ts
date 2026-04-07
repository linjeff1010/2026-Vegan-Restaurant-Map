import { RESTAURANT_DATA } from './src/constants';
import * as fs from 'fs';

const rows = RESTAURANT_DATA.map(r => {
  let typesStr = r.types.join(', ');
  
  return [
    r.id,
    r.name,
    r.city,
    r.address,
    r.phone || '',
    typesStr,
    r.petFriendly ? '是' : '否',
    r.rating || '',
    r.reviews || '',
    (r.desc || '').replace(/\n/g, ' '),
    r.link || '',
    r.fb || '',
    r.ig || '',
    r.lat || '',
    r.lng || ''
  ].join('\t');
});

fs.writeFileSync('restaurants.tsv', rows.join('\n'), 'utf8');
console.log('TSV generated');
