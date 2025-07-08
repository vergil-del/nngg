const config = {
  name: "علوية",
  description: "يرسل صورة عشوائية للاعب ميسي عند كتابة الكلمة",
  usage: "علوية",
  category: "fun",
  cooldown: 5,
  credits: "XaviaTeam"
};

import axios from "axios";

async function onCall({ message, event }) {
  const keyword = event.body.toLowerCase();
  if (!keyword.includes("علوية")) return;

  try {
    const res = await axios.get(`https://api.popcat.xyz/image/messi`);
    const imgURL = res.data || "https://i.postimg.cc/Z5KrN1bJ/messi.jpg";

    message.reply({
      body: "🐐 صورة لميسي ✨",
      attachment: await global.getStreamFromURL(imgURL)
    });

  } catch (err) {
    console.error(err);
    message.reply("❌ فشل في جلب صورة ميسي.");
  }
}

export default {
  config,
  onCall
};
