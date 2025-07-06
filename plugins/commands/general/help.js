import axios from "axios";

const config = {
  name: "help",
  aliases: ["مساعدة", "الاوامر"],
  description: "عرض جميع أوامر البوت حسب التصنيفات",
  usage: "[none]",
  cooldown: 3,
  credits: "XaviaTeam"
};

async function onCall({ message, args, commands }) {
  const categorized = {};

  for (const cmd of commands) {
    const category = cmd.config.category || "غير مصنفة";
    if (!categorized[category]) categorized[category] = [];
    categorized[category].push(`🔹 ${cmd.config.name}`);
  }

  let msg = "🧠 قائمة أوامر البوت:\n";

  for (const category in categorized) {
    const emoji = getEmojiForCategory(category);
    msg += `\n${emoji} ${category}\n${categorized[category].join('\n')}\n`;
  }

  msg += `\n━━━━━━━━━━━━━━\nالمطور: ᏉᎬᏒᎶᎥᏞ ᏕᏢᎯᏒᎠᎯ\n🌸 صلي على النبي ﷺ`;

  const img = await global.getStreamFromURL("https://i.postimg.cc/KYLkzTt3/inbound6281841933413965614.jpg");

  return message.reply({
    body: msg.trim(),
    attachment: img
  });
}

function getEmojiForCategory(name) {
  const n = name.toLowerCase();
  if (n.includes("fun") || n.includes("تسلية")) return "🎮";
  if (n.includes("group") || n.includes("مجموعة")) return "👥";
  if (n.includes("admin") || n.includes("مسؤول")) return "🛠️";
  if (n.includes("user") || n.includes("مستخدم")) return "👤";
  if (n.includes("owner") || n.includes("مطور")) return "👑";
  if (n.includes("event") || n.includes("فعالية")) return "🎉";
  if (n.includes("system") || n.includes("نظام")) return "⚙️";
  return "📦";
}

export default {
  config,
  onCall
};