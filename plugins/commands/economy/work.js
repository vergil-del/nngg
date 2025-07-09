const _6HOURS = 6 * 60 * 60 * 1000;
const _2HOURS = 2 * 60 * 60 * 1000;
const _3HOURS = 3 * 60 * 60 * 1000;
const _1HOURS = 1 * 60 * 60 * 1000;
const _30MINUTES = 30 * 60 * 1000;

const config = {
  name: "عمل",
  aliases: ["wk"],
  description: "قم بعمل عشوائي للحصول على ذهب 🪙، مع فرصة لربح ضخم أو شغل محشش!",
  credits: "XaviaTeam + Muzan",
  extra: {
    min: 100,
    max: 700,
    rareMin: 10000,
    rareMax: 50000,
    rareChance: 3, // 3% فرصة نادرة
    delay: [_30MINUTES, _1HOURS, _2HOURS, _3HOURS, _6HOURS]
  }
};

const langData = {
  "ar_SY": {
    "work.selfNoData": "🔁 بياناتك غير جاهزة بعد.",
    "work.alreadyWorked": "⏳ لقد اشتغلت، ارجع بعد: {time}.",
    "work.successfullyWorked": "✅ اشتغلت كـ \"{job}\" وربحت {amount} ذهب 🪙",
    "work.rareSuccess": "💥 فرصة نادرة! اشتغلت كـ \"{job}\" وربحت {amount} ذهب 🪙",
    "work.failed": "❌ فشل أثناء تنفيذ العمل."
  }
};

const jobs = [
  // 20 مهنة عادية
  "مزارع", "نجار", "سائق تاكسي", "خباز", "كهربائي", "حلاق", "صائغ ذهب", "سائق شاحنة", "صيدلي", "معلم", 
  "طبيب", "مهندس", "جزار", "صياد", "مبرمج", "بائع خضار", "عامل بناء", "مدرب جيم", "مصور", "حارس أمن",

  // 10 مهن مضحكة ومحششة
  "مطارد فراخ في السوق 😂", 
  "مراقب في مجموعة واتساب ساكت 😐", 
  "فنان شحاتة محترف 😭", 
  "بائع كلام فارغ في تويتر 🐦", 
  "خربت فرح وطلعت أجري 🏃‍♂️", 
  "نمت جنب كباية شاي ☕", 
  "مراقب خيالاتو في الحوش 🌚", 
  "جربت أكون ذكي بس الشبكة قطعت 📶", 
  "صرفت معاشي على PUBG 💸", 
  "اشتغلت كـ نصيحة في حالة واتساب 💬"
];

async function onCall({ message, extra, getLang }) {
  const { Currencies } = global.controllers;
  const { min, max, rareMin, rareMax, rareChance, delay } = extra;

  try {
    const data = await Currencies.getData(message.senderID);
    if (!data) return message.reply(getLang("work.selfNoData"));

    if (!data.work) data.work = { lastWorked: 0, delay: 0 };
    const elapsed = Date.now() - data.work.lastWorked;

    if (elapsed < data.work.delay) {
      const remaining = global.msToHMS(data.work.delay - elapsed);
      return message.reply(getLang("work.alreadyWorked", { time: remaining }));
    }

    const isRare = Math.random() * 100 < rareChance;
    const amount = global.random(isRare ? rareMin : min, isRare ? rareMax : max);
    const job = jobs[Math.floor(Math.random() * jobs.length)];

    await Currencies.increaseGold(message.senderID, amount);

    data.work.lastWorked = Date.now();
    data.work.delay = delay[Math.floor(Math.random() * delay.length)];
    await Currencies.setData(message.senderID, data);

    const msgKey = isRare ? "work.rareSuccess" : "work.successfullyWorked";
    return message.reply(getLang(msgKey, {
      job,
      amount: global.addCommas(amount)
    }));
  } catch (err) {
    console.error(err);
    return message.reply(getLang("work.failed"));
  }
}

export default {
  config,
  langData,
  onCall
};
