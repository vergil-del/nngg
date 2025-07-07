import axios from "axios";
import fs from "fs-extra";

const config = {
  name: "علم",
  description: "خمن اسم الدولة من صورة العلم",
  category: "فعاليات",
  cooldown: 5,
  credits: "XaviaTeam"
};

const flags = [
  { country: "السودان", url: "https://flagcdn.com/w320/sd.png" },
  { country: "اليابان", url: "https://flagcdn.com/w320/jp.png" },
  { country: "ألمانيا", url: "https://flagcdn.com/w320/de.png" },
  { country: "فرنسا", url: "https://flagcdn.com/w320/fr.png" },
  { country: "إيطاليا", url: "https://flagcdn.com/w320/it.png" }
];

const active = new Map();

async function onCall({ message }) {
  const { senderID, threadID } = message;
  const { Users } = global.controllers;

  if (active.has(threadID)) return message.reply("⏳ يوجد علم جارٍ بالفعل.");

  const chosen = flags[Math.floor(Math.random() * flags.length)];
  active.set(threadID, chosen.country.toLowerCase());

  const path = __dirname + "/flag.png";
  const res = await axios.get(chosen.url, { responseType: "arraybuffer" });
  fs.writeFileSync(path, Buffer.from(res.data, "binary"));

  message.reply({
    body: "🇺🇳 ما اسم هذه الدولة؟",
    attachment: fs.createReadStream(path)
  });

  const listener = async ({ body, senderID: answerID, threadID: msgTID }) => {
    if (msgTID !== threadID) return;
    const guess = body.toLowerCase();
    if (guess.includes(active.get(threadID))) {
      await Users.createIfNotExists(answerID);
      const points = await Users.getData(answerID, "eventPoints") || 0;
      await Users.setData(answerID, { eventPoints: points + 5 });
      message.reply(`✅ إجابة صحيحة!\n+5 نقاط`);
      active.delete(threadID);
      global.api.offMessage(listener);
    }
  };

  global.api.onMessage(listener);

  setTimeout(() => {
    if (active.has(threadID)) {
      message.reply(`⌛ انتهى الوقت! الإجابة كانت: ${chosen.country}`);
      active.delete(threadID);
      global.api.offMessage(listener);
    }
  }, 30000);
}

export default {
  config,
  onCall
};
