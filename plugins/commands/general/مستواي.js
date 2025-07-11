const config = {
  name: "مستواي",
  aliases: ["لفلي", "مستوى", "لفل"],
  description: "عرض مستواك وعدد تفاعلك واسمك.",
  usage: "",
  version: "1.1",
  cooldown: 3,
  permissions: [0],
  credits: "XaviaTeam",
  category: "معلومات"
};

// نفس دالة رفع المستوى الموجودة في الحدث
function expToLevel(exp) {
  let level = 0;
  while (exp >= 5 * level * level + 50 * level + 100) level++;
  return level;
}

// كم نقطة يحتاجها للمستوى المطلوب
function levelToExp(level) {
  return 5 * level * level + 50 * level + 100;
}

// توليد شريط تقدم جميل
function generateProgressBar(current, total, length = 20) {
  const progress = Math.floor((current / total) * length);
  const bar = "█".repeat(progress) + "░".repeat(length - progress);
  return bar;
}

async function onCall({ message }) {
  const { senderID } = message;
  const user = global.data.users.get(senderID);
  if (!user) return message.reply("❌ لا توجد بيانات لك في النظام بعد. أرسل بعض الرسائل أولاً.");

  const name = user?.info?.name || senderID;
  const exp = user?.data?.exp || 0;

  const currentLevel = expToLevel(exp);
  const expForCurrent = levelToExp(currentLevel);
  const expForNext = levelToExp(currentLevel + 1);
  const expInLevel = exp - expForCurrent;
  const totalExpThisLevel = expForNext - expForCurrent;
  const expLeft = expForNext - exp;

  const progressBar = generateProgressBar(expInLevel, totalExpThisLevel);

  const response = `
🌟 ︙مـعـلـومـات مـسـتـواك

👤︙الاسـم: ${name}
🎯︙نقـاط التـفـاعـل: ${exp}
🔢︙مستواك الحالي: ${currentLevel}
📈︙للوصول للمستوى القادم تحتاج: ${expLeft} نقطة

${progressBar} (${expInLevel}/${totalExpThisLevel})
`.trim();

  message.reply(response);
}

export default {
  config,
  onCall
};