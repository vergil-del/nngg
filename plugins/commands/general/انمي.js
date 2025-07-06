import axios from "axios";

const config = {
  name: "انمي",
  aliases: ["anime", "اقتراح-انمي", "أنمي"],
  description: "اقتراح أنمي عشوائي من قائمة أنميات شهيرة 🎌",
  usage: "",
  cooldown: 4,
  category: "تسلية",
  credits: "XaviaTeam"
};

async function onCall({ message }) {
  try {
    // نسحب قائمة أشهر الأنميات (top airing مثلاً)
    const res = await axios.get("https://api.jikan.moe/v4/top/anime?limit=25");
    const animeList = res.data.data;

    if (!animeList || animeList.length === 0) {
      return message.reply("😓 ما قدرت ألقى أي أنمي حالياً.");
    }

    const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];

    const msg = `🎌 اقتراح أنمي عشوائي لك:\n\n📺 الاسم: ${randomAnime.title}\n🎯 التصنيف: ${randomAnime.type}\n⭐ التقييم: ${randomAnime.score}\n📖 القصة: ${randomAnime.synopsis?.slice(0, 300) || "لا توجد قصة متاحة"}...\n📎 الرابط: ${randomAnime.url}`;

    const imgStream = await global.getStreamFromURL(randomAnime.images.jpg.image_url);

    return message.reply({
      body: msg,
      attachment: imgStream
    });
  } catch (err) {
    console.error(err);
    return message.reply("🚫 حصل خطأ أثناء جلب بيانات الأنمي.");
  }
}

export default {
  config,
  onCall
};
