// scripts/build-tags.js
import axios from 'axios';
import fs from 'fs';

const excludedTagNames =  [
  "Genderswap","Loli","Boys' Love",
  "Incest","Reverse Harem",
  "Post-Apocalyptic","Sexual Violence",
  "Crossdressing","Girls' Love","Harem",
  "Wuxia","Doujinshi",
  "Shota","Gyaru"];

async function run() {
  const { data } = await axios('https://api.mangadex.org/manga/tag');
  const excludedTagIDs = data.data
    .filter(tag => excludedTagNames.includes(tag.attributes.name.en))
    .map(tag => tag.id);

  fs.writeFileSync('./src/request_params.js', `export const excludedTagIDs = ${JSON.stringify(excludedTagIDs)};`);
}
run();
