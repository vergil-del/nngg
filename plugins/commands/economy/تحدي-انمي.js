const config = {
  name: "تحدي-انمي",
  description: "تحدي أنمي بين شخصين، أسرع واحد يجاوب صح يكسب نقاط",
  category: "فعاليات",
  cooldown: 10,
  credits: "XaviaTeam"
};

const questions = [
  { q: "من هو قاتل عائلة تانجيرو؟", a: "موزان" },
  { q: "ما اسم تقنية ناروتو الشهيرة المستنسخة؟", a: "راسينغان" },
  { q: "من هو صديق لوفي السايفر بول الذي لديه فاكهة نمر؟", a: "لوتشي" },
  { q: "في أنمي ديث نوت، ما اسم المحقق الذكي؟", a: "إل" },
  { q: "من هو قائد فيلق الاستطلاع الأقوى في هجوم العمالقة؟", a: "ليفاي" },
  { q: "ما اسم السيف الأسود المستخدم بواسطة إيتشيغو؟", a: "زنغيتسو" },
  { q: "من هو أول عملاق ظهر في هجوم العمالقة؟", a: "العملاق المدرع" },
  { q: "في أي أنمي يوجد شخصية تُدعى غون؟", a: "هانتر x هانتر" },
  { q: "ما اسم أخ ساسكي؟", a: "إيتاتشي" },
  { q: "من هو المعلم الأول لغوكو؟", a: "ماستر روشي" }
];

const active = new Set();

async function onCall({ message }) {
  const { mentions, threadID, senderID } = message;
  const { Users } = global.controllers;

  if (active.has(threadID)) return message.reply("⚠️ يوجد تحدي جاري حالياً في المجموعة.");

  const opponentID = Object.keys(mentions)[0];
  if (!opponentID || opponentID === senderID)
    return message.reply("🔁 منشن شخص لتحديه في الأنمي!");

  const challenger = senderID;
  const opponentName = mentions[opponentID].replace(/@/g, "");

  const question = questions[Math.floor(Math.random() * questions.length)];
  active.add(threadID);

  message.reply(`⚔️ تحدي أنمي بدأ بينك وبين ${opponentName}!\n\n❓ السؤال:\n${question.q}\nأول واحد يجاوب صح بياخد +5 نقاط`);

  const listener = async ({ body, senderID: answerID, threadID: msgTID }) => {
    if (msgTID !== threadID) return;
    if (![challenger, opponentID].includes(answerID)) return;

    if (body.trim().toLowerCase().includes(question.a.toLowerCase())) {
      await Users.createIfNotExists(answerID);
      const points = await Users.getData(answerID, "eventPoints") || 0;
      await Users.setData(answerID, { eventPoints: points + 5 });

      message.reply(`🎉 ${global.data.users[answerID]?.name || "فائز"} جاوب صح! +5 نقاط`);
      active.delete(threadID);
      global.api.offMessage(listener);
    }
  };

  global.api.onMessage(listener);

  setTimeout(() => {
    if (active.has(threadID)) {
      message.reply(`⌛ انتهى الوقت! كانت الإجابة: ${question.a}`);
      active.delete(threadID);
      global.api.offMessage(listener);
    }
  }, 30000);
}

export default {
  config,
  onCall
};
