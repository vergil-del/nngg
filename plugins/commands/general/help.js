const config = {
  name: "help",
  aliases: ["الاوامر", "مساعدة"],
  description: "عرض جميع الأوامر المتاحة حسب التصنيفات",
  usage: "[اسم الأمر]",
  cooldown: 3,
  category: "نظام",
  credits: "XaviaTeam"
};

import fs from "fs";
import path from "path";

async function onCall({ message, args }) {
  const commandsPath = path.join(process.cwd(), "Plugins", "commands");

  // لو المستخدم كتب /help [اسم أمر]
  if (args[0]) {
    const allFolders = fs.readdirSync(commandsPath);
    for (const folder of allFolders) {
      const folderPath = path.join(commandsPath, folder);
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const command = await import(path.join(folderPath, file));
        const allNames = [command.config.name, ...(command.config.aliases || [])];
        if (allNames.includes(args[0])) {
          return message.reply(
            `📘 معلومات عن الأمر "${command.config.name}":\n\n` +
            `📝 الوصف: ${command.config.description || "لا يوجد"}\n` +
            `📂 التصنيف: ${command.config.category || "غير محدد"}\n` +
            `📌 الاستخدام: ${command.config.usage || "لا يوجد"}\n` +
            `⏱️ التبريد: ${command.config.cooldown || 3} ثواني`
          );
        }
      }
    }

    return message.reply("❌ لم يتم العثور على الأمر المطلوب.");
  }

  // عرض جميع الأوامر حسب التصنيفات
  const categories = {};

  const folders = fs.readdirSync(commandsPath);
  for (const folder of folders) {
    const folderPath = path.join(commandsPath, folder);
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      try {
        const command = await import(path.join(folderPath, file));
        const category = command.config.category || "غير مصنف";
        if (!categories[category]) categories[category] = [];
        categories[category].push(command.config.name);
      } catch (e) {
        continue; // تجاهل أي أمر فيه خلل
      }
    }
  }

  let helpMessage = "📚 قائمة الأوامر المتاحة:\n";

  for (const [cat, cmds] of Object.entries(categories)) {
    helpMessage += `\n🗂️ ${cat}:\n› ${cmds.join(" | ")}\n`;
  }

  helpMessage += "\n\nالمطور: ᏉᎬᏒᎶᎥᏞ ᏕᏢᎯᏒᎠᎯ\n💬 صلي على النبي ﷺ";

  const imgURL = "https://i.postimg.cc/KYLkzTt3/inbound6281841933413965614.jpg";
  const imgStream = await global.getStreamFromURL(imgURL);

  return message.reply({
    body: helpMessage,
    attachment: imgStream
  });
}

export default {
  config,
  onCall
};
