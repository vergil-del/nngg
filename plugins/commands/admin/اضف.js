const fs = require('fs');
const path = require('path');

const config = {
  name: "اضف-امر",
  aliases: ["addcmd"],
  version: "1.0.0",
  description: "إضافة أمر جديد إلى البوت",
  usage: "<اسم الامر.js> <الفئة> <كود الامر>",
  credits: "XaviaTeam"
};

async function onCall({ message, args }) {
  if (message.senderID !== "61553754531086") {
    return message.reply("ليس لديك الصلاحية لاستخدام هذا الأمر");
  }

  if (args.length < 3) {
    return message.reply("الاستخدام: اضف امر <اسم الامر.js> <الفئة> <كود الامر>");
  }

  const fileName = args[0];
  const category = args[1];
  const code = args.slice(2).join(" ");

  const commandsPath = path.join(__dirname, 'plugins', 'commands');
  const categoryPath = path.join(commandsPath, category);

  if (!fs.existsSync(categoryPath)) {
    return message.reply(`لم يتم العثور على الفئة ${category}`);
  }

  const filePath = path.join(categoryPath, fileName);

  try {
    fs.writeFileSync(filePath, code);
    message.reply(`تم إضافة الأمر ${fileName} إلى الفئة ${category}`);
  } catch (error) {
    message.reply(`حدث خطأ أثناء إضافة الأمر: ${error.message}`);
  }
}

export default { config, onCall };


