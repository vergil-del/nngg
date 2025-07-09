const _6HOURS = 6 * 60 * 60 * 1000;
const _2HOURS = 2 * 60 * 60 * 1000;
const _3HOURS = 3 * 60 * 60 * 1000;
const _1HOURS = 1 * 60 * 60 * 1000;
const _30MINUTES = 30 * 60 * 1000;

const config = {
  name: "عمل",
  aliases: ["wk"],
  description: "قم بالعمل لكسب المال، مع فرصة نادرة لربح ضخم!",
  credits: "XaviaTeam + Muzan",
  extra: {
    min: 200,
    max: 1000,
    rareMin: 100000,
    rareMax: 1000000,
    rareChance: 2, // 2% chance
    delay: [_30MINUTES, _1HOURS, _3HOURS, _2HOURS, _6HOURS]
  }
};

const langData = {
  "ar_SY": {
    "work.selfNoData": "البيانات الخاصة بك ليست جاهزة.",
    "work.alreadyWorked": "لقد عملت، يمكنك العمل مرة أخرى بعد {time}.",
    "work.successfullyWorked": "لقد عملت وكسبت {amount} 💵",
    "work.rareSuccess": "🎉 حظ خارق! لقد وجدت فرصة عمل نادرة وربحت {amount} 💸💸💸",
    "work.failed": "حدث خطأ ما، حاول مرة أخرى."
  }
};

async function onCall({ message, extra, getLang }) {
  const { Users } = global.controllers;
  const { min, max, rareMin, rareMax, rareChance, delay } = extra;
  try {
    const userData = await Users.getData(message.senderID);
    if (!userData) return message.reply(getLang("work.selfNoData"));

    if (!userData.work) userData.work = { lastWorked: 0, delay: 0 };

    const timePassed = Date.now() - userData.work.lastWorked;
    if (timePassed < userData.work.delay)
      return message.reply(
        getLang("work.alreadyWorked", {
          time: global.msToHMS(userData.work.delay - timePassed),
        })
      );

    let amount, messageKey;

    // فرصة نادرة
    if (Math.random() * 100 < rareChance) {
      amount = global.random(rareMin, rareMax);
      messageKey = "work.rareSuccess";
    } else {
      amount = global.random(min, max);
      messageKey = "work.successfullyWorked";
    }

    await Users.increaseMoney(message.senderID, amount);

    // تحديد تأخير العمل القادم
    userData.work.lastWorked = Date.now();
    userData.work.delay = delay[global.random(0, delay.length - 1)];
    await Users.updateData(message.senderID, { work: userData.work });

    return message.reply(getLang(messageKey, { amount: global.addCommas(amount) }));
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
