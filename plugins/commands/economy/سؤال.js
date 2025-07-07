import stringSimilarity from "string-similarity";

const config = {
  name: "سؤال",
  description: "سؤال عشوائي تربح منو نقاط لو جاوبت صح",
  usage: "",
  cooldown: 5,
  category: "فعاليات",
  credits: "XaviaTeam"
};

const questions = [
  { q: "ما هي عاصمة اليابان؟", a: "طوكيو" },
  { q: "كم عدد سور القرآن الكريم؟", a: "114" },
  { q: "من هو موزان؟", a: "شرير قاتل الشياطين" },
  { q: "ما هي أقرب كوكب إلى الشمس؟", a: "عطارد" },
  { q: "كم عدد أركان الإسلام؟", a: "5" },
  { q: "ما اسم أكبر قارة في العالم؟", a: "آسيا" },
  { q: "من هو النبي الذي ابتلعه الحوت؟", a: "يونس" },
  { q: "ما هي عاصمة السودان؟", a: "الخرطوم" },
  { q: "كم عدد أيام السنة؟", a: "365" },
  { q: "ما اسم أسرع حيوان بري؟", a: "الفهد" }
];

const active = new Map();

async function onCall({ message }) {
  const { senderID, threadID } = message;
  const { Users } = global.controllers;

  if (active.has(threadID)) {
    return message.reply("🕒 يوجد سؤال جارٍ حالياً، جاوب عليه أولاً.");
  }

  const picked = questions[Math.floor(Math.random() * questions.length)];
  active.set(threadID, picked);

  message.reply(`🧠 السؤال:\n${picked.q}`);

  const listener = async ({ body, senderID: answerID, threadID: msgTID }) => {
    if (msgTID !== threadID) return;
    const userAnswer = body.trim().toLowerCase();
    const correctAnswer = picked.a.trim().toLowerCase();

    const similarity = stringSimilarity.compareTwoStrings(userAnswer, correctAnswer);

    if (similarity >= 0.75) {
      await Users.createIfNotExists(answerID);
      const current = await Users.getData(answerID, "eventPoints") || 0;
      await Users.setData(answerID, { eventPoints: current + 5 });

      message.reply(`✅ إجابة صحيحة!\n+5 نقاط لـ ${answerID}`);
      active.delete(threadID);
      global.api.offMessage(listener);
    }
  };

  global.api.onMessage(listener);

  // إلغاء بعد 30 ثانية
  setTimeout(() => {
    if (active.has(threadID)) {
      message.reply("⌛ انتهى الوقت! الإجابة كانت: " + picked.a);
      active.delete(threadID);
      global.api.offMessage(listener);
    }
  }, 30000);
}

export default {
  config,
  onCall
};
