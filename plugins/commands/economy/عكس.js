const config = {
  name: "عكس",
  description: "اكتب الكلمة بالعكس لتحصل على نقاط",
  category: "فعاليات",
  cooldown: 5,
  credits: "XaviaTeam"
};

const words = ["موزان", "الشيطان", "أنمي", "مرحبا", "ذكاء"];

const active = new Map();

async function onCall({ message }) {
  const { senderID, threadID } = message;
  const { Users } = global.controllers;

  if (active.has(threadID)) return message.reply("⏳ في كلمة جارية الآن");

  const word = words[Math.floor(Math.random() * words.length)];
  const reversed = word.split("").reverse().join("");
  active.set(threadID, reversed);

  message.reply(`🔁 اكتب هذه الكلمة بالعكس:\n${word}`);

  const listener = async ({ body, senderID: answerID, threadID: msgTID }) => {
    if (msgTID !== threadID) return;
    if (body.trim() === reversed) {
      await Users.createIfNotExists(answerID);
      const points = await Users.getData(answerID, "eventPoints") || 0;
      await Users.setData(answerID, { eventPoints: points + 3 });
      message.reply("✅ إجابة صحيحة! +3 نقاط");
      active.delete(threadID);
      global.api.offMessage(listener);
    }
  };

  global.api.onMessage(listener);

  setTimeout(() => {
    if (active.has(threadID)) {
      message.reply(`⌛ انتهى الوقت! الإجابة كانت: ${reversed}`);
      active.delete(threadID);
      global.api.offMessage(listener);
    }
  }, 30000);
}

export default {
  config,
  onCall
};
