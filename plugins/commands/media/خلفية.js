import axios from "axios";
import cheerio from "cheerio";

const config = {
  name: "خلفية",
  aliases: ["خلفيات", "background"],
  description: "جلب خلفية من Pinterest حسب الكلمة المطلوبة",
  usage: "<كلمة البحث>",
  cooldown: 5,
  credits: "XaviaTeam"
};

async function onCall({ message, args }) {
  if (!args[0]) return message.reply("❌ اكتب كلمة للبحث عن الخلفية.\nمثال: خلفية أنمي");

  const query = encodeURIComponent(args.join(" "));
  const url = `https://www.pinterest.com/search/pins/?q=${query}`;

  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(res.data);
    const imageLinks = [];

    $("img").each((_, el) => {
      const src = $(el).attr("src");
      if (src && src.startsWith("https://i.pinimg.com")) {
        imageLinks.push(src);
      }
    });

    if (imageLinks.length === 0) {
      return message.reply("😞 ما لقيت أي خلفية بالكلمة دي.");
    }

    const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    return message.reply({ body: "📸 الخلفية المطلوبة:", attachment: await global.getStreamFromURL(randomImage) });

  } catch (err) {
    console.error(err);
    return message.reply("❌ حصل خطأ أثناء جلب الخلفية.");
  }
}

export default {
  config,
  onCall
};
