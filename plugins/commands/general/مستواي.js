const config = {
  name: "مستواي",
  version: "1.0",
  description: "عرض مستواك وعدد نقاطك",
  credits: "XaviaTeam",
  cooldown: 5,
  permissions: [0],
  category: "معلومات"
};

function onCall({ message, data }) {
  const { senderID, threadID } = message;

  const userData = data.users.get(senderID)?.data || {};
  const userInfo = data.users.get(senderID)?.info || {};
  const name = userInfo.name || "المستخدم";

  const exp = userData.exp || 0;
  const level = global.expToLevel(exp);
  const nextLevelExp = global.levelToExp(level + 1);
  const expNeeded = nextLevelExp - exp;

  const reply = `
🌟 | معلومات المستوى لـ ${name}

📊 نقاطك الحالية: ${exp}
⬆️ مستواك الحالي: ${level}
🧱 تحتاج إلى ${expNeeded} نقطة للوصول للمستوى التالي
  `.trim();

  message.reply(reply);
}

export default {
  config,
  onCall
};