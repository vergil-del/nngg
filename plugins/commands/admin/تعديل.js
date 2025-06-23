const fs = require('fs');
const path = require('path');

const config = {
  name: "تعديل-امر",
  aliases: ["editcmd"],
  version: "1.0.0",
  description: "تعديل أمر في البوت",
  usage: "<اسم الامر.js> <الفئة> <كود الامر الجديد>",
  credits: "XaviaTeam"
};

async function onCall({ message, args }) {
  if (message.senderID !== "61553754531086") {
    return message.reply("ليس لديك الصلاحية لاستخدام هذا الأمر");
  }

  if (args.length < 3) {
    return message.reply("الاستخدام: تعديل امر <اسم الامر.js> <الفئة> <كود الامر الجديد>");
  }

  const fileName = args[0];
  const category = args[1];
  const code = args.slice(2).join(" ");

  const commandsPath = path.join(__dirname, 'plugins', 'commands');
  const categoryPath = path.join(commandsPath, category);
  const filePath = path.join(categoryPath, fileName);

  if (!fs.existsSync(categoryPath)) {
    return message.reply(`لم يتم العثور على الفئة ${category}`);
  }

  if (!fs.existsSync(filePath)) {
    return message.reply(`لم يتم العثور على الأمر ${fileName} في الفئة ${category}`);
  }

  try {
    fs.writeFileSync(filePath, code);
    message.reply(`تم تعديل الأمر ${fileName} في الفئة ${category}`);
  } catch (error) {
    message.reply(`حدث خطأ أثناء تعديل الأمر: ${error.message}`);
  }
}

export default { config, onCall };
