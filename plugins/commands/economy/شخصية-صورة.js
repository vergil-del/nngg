const config = {
  name: "شخصية-صورة",
  description: "تعرف على شخصية الأنمي من الصورة",
  category: "فعاليات",
  cooldown: 5,
  credits: "XaviaTeam"
};

const characters = [
  { name: "موزان", img: "https://i.postimg.cc/W3D0wGNg/mozan.jpg" },
  { name: "تانجيرو", img: "https://i.postimg.cc/SKzpZJLV/tanjiro.jpg" },
  { name: "ناروتو", img: "https://i.postimg.cc/wvmbhZTV/naruto.jpg" },
  { name: "ليفاي", img: "https://i.postimg.cc/t45yWkRQ/levi.jpg" }
];

const active = new Map();

import axios from "axios";
import fs from "fs-extra";

async function onCall({ message }) {
  const { threadID } = message;
  const { Users } = global.controllers;

  if (active.has(threadID)) return message.reply("⏳ في شخصية حالياً");

  const chosen = characters[Math.floor(Math.random() * characters.length)];
  active.set(threadID, chosen.name.toLowerCase());

  const res = await axios.get(chosen.img, { responseType: "arraybuffer" });
  const filePath = __dirname + "/anime-char.jpg";
  fs.writeFileSync(filePath, Buffer.from(res.data, "binary"));

  message.reply({
    body: "👤 من هذه الشخصية؟",
    attachment: fs.createReadStream(filePath)
  });

  const listener = async ({ body, senderID, threadID: msgTID }) => {
    if (msgTID !== threadID) return;
    if (body.toLowerCase().includes(chosen.name.toLowerCase())) {
      await Users.createIfNotExists(senderID);
      const points = await Users.getData(senderID, "eventPoints") || 0;
      await Users.setData(senderID, { eventPoints: points + 5 });
      message.reply("✅ أحسنت! +5 نقاط");
      active.delete(threadID);
      global.api.offMessage(listener);
    }
  };

  global.api.onMessage(listener);

  setTimeout(() => {
    if (active.has(threadID)) {
      message.reply(`⌛ الوقت انتهى! كانت الإجابة: ${chosen.name}`);
      active.delete(threadID);
      global.api.offMessage(listener);
    }
  }, 30000);
}

export default {
  config,
  onCall
};
