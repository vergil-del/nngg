const config = {
  name: "addc",
  version: "1.0",
  description: "إضافة أمر جديد",
  usage: "<اسم الأمر>.js <كود الأمر>",
  cooldown: 5,
  permissions: [2],
  credits: "مطور البوت"
}

const langData = {
  "ar_SY": {
    "missingFileName": "يرجى إدخال اسم الأمر",
    "missingCode": "يرجى إدخال كود الأمر",
    "fileExists": "الأمر موجود مسبقًا",
    "success": "تم إضافة الأمر {fileName} بنجاح"
  }
}

async function onCall({ message, args, getLang }) {
  if (!args[0]) return message.reply(getLang("missingFileName"));
  if (!args[1]) return message.reply(getLang("missingCode"));
  const fs = require("fs");
  const path = require("path");
  const fileName = args[0];
  const filePath = path.join(__dirname, '../plugins/commands/Admin/', fileName);
  const code = args.slice(1).join(" ");
  if (fs.existsSync(filePath)) return message.reply(getLang("fileExists"));
  fs.writeFileSync(filePath, code);
  message.reply(getLang("success").replace("{fileName}", fileName));
}

export default {
  config,
  langData,
  onCall
    }
