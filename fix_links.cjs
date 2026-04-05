const fs = require('fs');

const links = {
  1: { fb: 'https://www.facebook.com/serenity2005/', ig: 'https://www.instagram.com/serenity_vegetarian/' },
  2: { fb: 'https://www.facebook.com/serenity2005/', ig: 'https://www.instagram.com/serenity_vegetarian/' },
  3: { fb: 'https://www.facebook.com/LittleTreeFood/', ig: 'https://www.instagram.com/littletreefood/' },
  4: { fb: 'https://www.facebook.com/yangshin2012/', ig: 'https://www.instagram.com/yangshin_vege/' },
  5: { fb: 'https://www.facebook.com/veggienius21/', ig: 'https://www.instagram.com/veggienius21/' },
  6: { fb: 'https://www.facebook.com/happyheartveg/', ig: '' },
  7: { fb: '', ig: '' },
  8: { fb: 'https://www.facebook.com/VeganHeartHome/', ig: '' },
  9: { fb: '', ig: '' },
  10: { fb: '', ig: '' }, // 果然匯 明曜店 (已歇業)
  11: { fb: 'https://www.facebook.com/BaganHood/', ig: 'https://www.instagram.com/baganhood/' },
  12: { fb: 'https://www.facebook.com/plantseatery/', ig: 'https://www.instagram.com/plantseatery/' },
  13: { fb: 'https://www.facebook.com/Miacucinafamily/', ig: 'https://www.instagram.com/miacucina_tw/' },
  14: { fb: 'https://www.facebook.com/mukuchi2019/', ig: 'https://www.instagram.com/mukuchi2019/' },
  15: { fb: 'https://www.facebook.com/toastcurry1/', ig: 'https://www.instagram.com/3idiots.restaurant/' },
  16: { fb: 'https://www.facebook.com/HoshinaTW/', ig: 'https://www.instagram.com/hoshina_tw/' },
  17: { fb: 'https://www.facebook.com/ymspring/', ig: 'https://www.instagram.com/yangmingspring/' },
  68: { fb: 'https://www.facebook.com/Miacucinafamily/', ig: 'https://www.instagram.com/miacucina_tw/' },
  69: { fb: 'https://www.facebook.com/Miacucinafamily/', ig: 'https://www.instagram.com/miacucina_tw/' },
  71: { fb: 'https://www.facebook.com/Miacucinafamily/', ig: 'https://www.instagram.com/miacucina_tw/' },
  31: { fb: 'https://www.facebook.com/veganamore.tw/', ig: 'https://www.instagram.com/veganamore.tw/' },
  32: { fb: 'https://www.facebook.com/HerbivoreVegan/', ig: 'https://www.instagram.com/herbivore_vegan/' },
  73: { fb: '', ig: '' },
  19: { fb: 'https://www.facebook.com/MaoJiGu/', ig: 'https://www.instagram.com/maojigu/' },
  20: { fb: 'https://www.facebook.com/bruceskitchentw/', ig: 'https://www.instagram.com/bruceskitchentw/' },
  21: { fb: 'https://www.facebook.com/pulau.redang3/', ig: '' },
  22: { fb: 'https://www.facebook.com/yuanvegetarian/', ig: 'https://www.instagram.com/yuanvegetarian/' },
  23: { fb: 'https://www.facebook.com/HuanHuaCaoTang/', ig: '' },
  33: { fb: 'https://www.facebook.com/www.fruitfulfood.com.tw/', ig: 'https://www.instagram.com/fruitfulfood_tw/' },
  34: { fb: 'https://www.facebook.com/easyhouse1108/', ig: '' },
  70: { fb: 'https://www.facebook.com/Miacucinafamily/', ig: 'https://www.instagram.com/miacucina_tw/' },
  24: { fb: 'https://www.facebook.com/mondayvegetarian/', ig: '' },
  25: { fb: 'https://www.facebook.com/rumusanfen/', ig: '' },
  27: { fb: 'https://www.facebook.com/avignonrestaurant/', ig: 'https://www.instagram.com/avignon_veg/' },
  28: { fb: '', ig: '' },
  29: { fb: 'https://www.facebook.com/veggiejoytw/', ig: 'https://www.instagram.com/veggiejoytw/' },
  35: { fb: 'https://www.facebook.com/hilaivegetarian/', ig: '' },
  36: { fb: 'https://www.facebook.com/www.fruitfulfood.com.tw/', ig: 'https://www.instagram.com/fruitfulfood_tw/' },
  37: { fb: 'https://www.facebook.com/seed.veg/', ig: '' },
  38: { fb: 'https://www.facebook.com/shanguotang/', ig: 'https://www.instagram.com/shanguotang/' },
  39: { fb: 'https://www.facebook.com/JingTingVeg/', ig: '' },
  40: { fb: 'https://www.facebook.com/veggiedelight.tw/', ig: 'https://www.instagram.com/veggiedelight.tw/' },
  41: { fb: 'https://www.facebook.com/vegecircle/', ig: '' },
  42: { fb: 'https://www.facebook.com/easyhouse1108/', ig: '' },
  43: { fb: 'https://www.facebook.com/joyesanyi/', ig: 'https://www.instagram.com/joyesanyi/' },
  44: { fb: 'https://www.facebook.com/ZenKitchenVeg/', ig: '' },
  45: { fb: '', ig: '' },
  46: { fb: 'https://www.facebook.com/hetangju/', ig: '' },
  47: { fb: 'https://www.facebook.com/DawnVegan/', ig: 'https://www.instagram.com/dawnvegan/' },
  48: { fb: '', ig: '' },
  49: { fb: 'https://www.facebook.com/HappySnailVeg/', ig: '' },
  50: { fb: 'https://www.facebook.com/yidanshi/', ig: 'https://www.instagram.com/yidanshi/' },
  51: { fb: '', ig: '' },
  52: { fb: 'https://www.facebook.com/veggienius21/', ig: 'https://www.instagram.com/veggienius21/' },
  53: { fb: 'https://www.facebook.com/shuguangju/', ig: '' },
  54: { fb: 'https://www.facebook.com/vgbbq/', ig: 'https://www.instagram.com/vgbbq/' },
  55: { fb: 'https://www.facebook.com/enrichrestaurant/', ig: 'https://www.instagram.com/enrich_restaurant/' },
  56: { fb: 'https://www.facebook.com/yangsuting/', ig: '' },
  57: { fb: '', ig: '' }, // 菜市場 (已歇業)
  58: { fb: 'https://www.facebook.com/hilaivegetarian/', ig: '' },
  59: { fb: 'https://www.facebook.com/VerdureRestaurant/', ig: 'https://www.instagram.com/verdure_restaurant/' },
  72: { fb: 'https://www.facebook.com/Miacucinafamily/', ig: 'https://www.instagram.com/miacucina_tw/' },
  60: { fb: '', ig: '' },
  61: { fb: 'https://www.facebook.com/QingXinYuan/', ig: '' },
  62: { fb: 'https://www.facebook.com/taomile/', ig: '' },
  63: { fb: 'https://www.facebook.com/YuanWeiVeg/', ig: 'https://www.instagram.com/yuanweiveg/' },
  64: { fb: 'https://www.facebook.com/DuHeVeg/', ig: '' },
  65: { fb: 'https://www.facebook.com/YaChiGe/', ig: '' },
  66: { fb: 'https://www.facebook.com/YiWeiWuEr/', ig: 'https://www.instagram.com/yiweiwuer/' },
  67: { fb: '', ig: '' },
};

const tsv = fs.readFileSync('restaurants.tsv', 'utf8');
const lines = tsv.trim().split('\n');

const newLines = lines.map((line, index) => {
  if (index === 0 && line.startsWith('ID\t')) return line; // Header
  const parts = line.split('\t');
  if (parts.length < 15) return line;
  
  const id = parseInt(parts[0], 10);
  if (links[id]) {
    parts[11] = links[id].fb;
    parts[12] = links[id].ig;
  }
  return parts.join('\t');
});

fs.writeFileSync('restaurants.tsv', newLines.join('\n') + '\n', 'utf8');
console.log('Fixed links in restaurants.tsv');
