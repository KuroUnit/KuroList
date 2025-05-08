import axios from "axios";

const excludedTagNames = [
  "Genderswap","Loli","Boys' Love",
  "Incest","Reverse Harem",
  "Post-Apocalyptic","Sexual Violence",
  "Crossdressing","Girls' Love","Harem",
  "Wuxia","Doujinshi",
  "Shota","Gyaru"];

export const baseUrl = 'https://api.mangadex.org';
const tags = await axios(`${baseUrl}/manga/tag`);

let nameTag = tags.data.data.map(tag => tag.attributes.name.en)
console.log(JSON.stringify(nameTag))

export const excludedTagIDs = tags.data.data
  .filter(tag => excludedTagNames.includes(tag.attributes.name.en))
  .map(tag => tag.id);
