const config = {
  name: "اسم-المجموعة",
  description: "تغيير اسم المجموعة (للمطور فقط)",
  usage: "<الاسم الجديد>",
  category: "المطور",
  cooldown: 3,
  permissions: [2], // المطور فقط
  credits: "XaviaTeam"
};

async function onCall({ message, api, args, event }) {
  const developerID = "61562119538523"; // ← آيدي المطور

  if (message.senderID !== developerID) {
    return message.reply("🚫 هذا الأمر مخصص للمطور فقط.");
  }

  const newName = args.join(" ");
  if (!newName) return message.reply("⚠️ الرجاء كتابة الاسم الجديد.\nمثال:\nاسم-المجموعة أبطال الأنمي");

  try {
    await api.setTitle(newName, event.threadID);
    message.reply(`✅ تم تغيير اسم المجموعة إلى:\n「 ${newName} 」`);
  } catch (err) {
    console.error(err);
    message.reply("❌ حدث خطأ أثناء تغيير اسم المجموعة.");
  }
}

export default {
  config,
  onCall
};
