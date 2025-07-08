const config = {
  name: "لاعبين",
  description: "سؤال عشوائي عن لاعبين كرة قدم، جاوب واربح!",
  usage: "",
  category: "fun",
  cooldown: 10,
  credits: "XaviaTeam"
};

import stringSimilarity from "string-similarity";

const questions = [
  {
    question: "🇵🇹 من هو اللاعب الذي يُعرف بـ الدون ويلعب في النصر السعودي؟",
    answer: "كريستيانو رونالدو"
  },
  {
    question: "🇦🇷 من فاز بكأس العالم 2022 مع الأرجنتين؟",
    answer: "ليونيل ميسي"
  },
  {
    question: "🇧🇷 من هو اللاعب البرازيلي الذي يُلقب بـ نيمو؟",
    answer: "نيمار"
  },
  {
    question: "🇪🇬 من هو نجم نادي ليفربول الإنجليزي والمنتخب المصري؟",
    answer: "محمد صلاح"
  },
  {
    question: "🇫🇷 من هو مهاجم فرنسا الذي أبدع في كأس العالم 2018 و2022؟",
    answer: "كيليان مبابي"
  },
  {
    question: "🇸🇦 من هو اللاعب السعودي الذي سجل هدف في الأرجنتين في كأس العالم 2022؟",
    answer: "سالم الدوسري"
  },
  {
    question: "من هو اللاعب الذي لعب لبرشلونة وباريس سان جيرمان؟",
    answer: "نيمار"
  }
];

async function onCall({ message, event }) {
  const random = questions[Math.floor(Math.random() * questions.length)];
  message.reply(random.question);

  global.client.handleReply.push({
    name: config.name,
    messageID: event.messageID,
    author: event.senderID,
    correctAnswer: random.answer,
    callback: async ({ event: reply }) => {
      const similarity = stringSimilarity.compareTwoStrings(
        reply.body.toLowerCase().trim(),
        random.answer.toLowerCase()
      );

      if (similarity >= 0.7) {
        message.reply(`🎉 إجابة صحيحة يا بطل يا ${reply.senderID}! 👑`);
      } else {
        message.reply(`❌ غلط.. جرب تاني!\nالإجابة الصحيحة كانت: ${random.answer}`);
      }
    }
  });
}

export default {
  config,
  onCall
};
