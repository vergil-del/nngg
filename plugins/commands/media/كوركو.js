const config = {
  name: "كوركو",
  description: "يرسل صورة عشوائية لرونالدو عند كتابة كوركو",
  usage: "كوركو",
  category: "fun",
  cooldown: 5,
  credits: "XaviaTeam"
};

import axios from "axios";

async function onCall({ message, event }) {
  const keyword = event.body.toLowerCase();
  if (!keyword.includes("كوركو")) return;

  try {
    const res = await axios.get(`https://api.popcat.xyz/image/ronaldo`);
    const imgURL = res.data || "https://i.postimg.cc/fWBK1Q9S/ronaldo.jpg";

    const imgStream = await global.getStreamFromURL(imgURL);
    message.reply({
      body: "⚽ صورة عشوائية لـ كريستيانو رونالدو 💪",
      attachment: imgStream
    });

  } catch (err) {
    console.error(err);
    message.reply("❌ حصل خطأ أثناء جلب صورة كوركو.");
  }
}

export default {
  config,
  onCall
};
