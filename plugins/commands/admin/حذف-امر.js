import fs from "fs-extra";
import path from "path";

const config = {
  name: "حذف-أمر",
  aliases: ["delcmd", "deletecmd"],
  description: "حذف أمر من البوت نهائيًا (للمشرف فقط)",
  usage: "<اسم_الأمر>",
  cooldown: 5,
  credits: "XaviaTeam"
};

const langData = {
  "ar_SY": {
    notOwner: "❌ هذا الأمر للمشرف فقط.",
    missingCommand: "📌 الرجاء كتابة اسم الأمر الذي تريد حذفه.",
    notFound: "❗ لم يتم العثور على ملف الأمر '{cmd}'.",
    success: "✅ تم حذف الأمر '{cmd}' بنجاح.",
    protected: "⚠️ لا يمكنك حذف هذا الأمر المحمي."
  }
};

const OWNER_ID = "123456789"; // ← غيّر دا لمعرفك
const CMD_FOLDER = "./Plugins/commands";
const PROTECTED_CMDS = ["حذف-أمر", "تعطيل"]; // أوامر محمية من الحذف

async function onCall({ message, args, getLang }) {
  const { senderID } = message;
  if (senderID !== OWNER_ID) return message.reply(getLang("notOwner"));

  const cmdName = args[0]?.toLowerCase();
  if (!cmdName) return message.reply(getLang("missingCommand"));

  if (PROTECTED_CMDS.includes(cmdName)) return message.reply(getLang("protected"));

  const searchAndDelete = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        const result = searchAndDelete(fullPath);
        if (result) return result;
      } else {
        const baseName = path.basename(file, ".js").toLowerCase();
        if (baseName === cmdName) {
          fs.unlinkSync(fullPath);
          return fullPath;
        }
      }
    }
    return null;
  };

  const deletedPath = searchAndDelete(CMD_FOLDER);

  if (!deletedPath) return message.reply(getLang("notFound", { cmd: cmdName }));

  return message.reply(getLang("success", { cmd: cmdName }));
}

export default {
  config,
  langData,
  onCall
};
