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

// دالة لحساب كم نقطة نحتاجها للوصول لمستوى معين
function levelToExp(level) {
  return 5 * (level ** 2) + 50 * level + 100;
}

// توليد شريط التقدم بناءً على النسبة
function generateProgressBar(current, total, length = 20) {
  const progress = Math.floor((current / total) * length);
  const bar = "█".repeat(progress) + "░".repeat(length - progress);
  return bar;
}

async function onCall({ message }) {
  const { senderID } = message;

  const user = global.data.users.get(senderID);
  if (!user) return message.reply("❌ لم يتم العثور على بياناتك بعد، تفاعل قليلاً أولًا!");

  const name = user?.info?.name || senderID;
  const exp = user?.data?.exp || 0;
  const currentLevel = global.expToLevel(exp);
  const expForCurrent = levelToExp(currentLevel);
  const expForNext = levelToExp(currentLevel + 1);
  const expInLevel = exp - expForCurrent;
  const totalExpThisLevel = expForNext - expForCurrent;
  const expLeft = expForNext - exp;

  const progressBar = generateProgressBar(expInLevel, totalExpThisLevel);

  const response = `
🌟 | مـعـلـومـات مـسـتـواك

👤 الاسم: ${name}
📊 التفاعل: ${exp} نقطة
🆙 المستوى: ${currentLevel}
⬆️ للمستوى القادم: ${expLeft} نقطة

${progressBar} (${expInLevel}/${totalExpThisLevel})
`.trim();

  message.reply(response);
}

export default {
  config,
  onCall
};