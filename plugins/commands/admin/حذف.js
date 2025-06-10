const config = {
  name: "حذف",
  version: "1.0",
  description: "حذف أمر",
  usage: "<اسم الأمر>.js",
  cooldown: 5,
  permissions: [2],
  credits: "مطور البوت"
}

const langData = {
  "ar_SY": {
    "missingFileName": "يرجى إدخال اسم الأمر",
    "fileNotFound": "الأمر غير موجود",
    "success": "تم حذف الأمر {fileName} بنجاح",
    "error": "حدث خطأ أثناء حذف الأمر"
  }
}

async function onCall({ message, args, getLang }) {
  if (!args[0]) return message.reply(getLang("missingFileName"));
  const fs = require("fs");
  const path = require("path");
  const fileName = args[0];
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) return message.reply(getLang("fileNotFound"));
  try {
    fs.unlinkSync(filePath);
    message.reply(getLang("success").replace("{fileName}", fileName));
  } catch (error) {
    message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall
      }
