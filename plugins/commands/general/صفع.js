import axios from "axios";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const config = {
  name: "صفع",
  description: "قوم بصفع شخص من المجموعة 😂",
  category: "تسلية",
  usage: "@منشن",
  cooldown: 5,
  credits: "XaviaTeam"
};

// رابط صورة الصفع
const imageURL = "https://i.postimg.cc/mg8fnhqW/slap1.gif";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function onCall({ message }) {
  const { mentions, senderID } = message;
  const mentionIDs = Object.keys(mentions);

  if (!mentionIDs.length)
    return message.reply("👋 منشن شخص لصفعه!");

  const targetName = mentions[mentionIDs[0]].replace(/@/g, "");
  const senderName = global.data.users[senderID]?.name || "شخص مجهول";

  const filePath = path.join(__dirname, "temp_slap.gif");

  try {
    const response = await axios.get(imageURL, { responseType: "stream" });
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    writer.on("finish", () => {
      message.reply({
        body: `💢 ${senderName} صفع ${targetName} صفعة محترمة! 😂`,
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath)); // حذف الصورة بعد الإرسال
    });

    writer.on("error", () => {
      message.reply("❌ فشل تحميل صورة الصفع.");
    });

  } catch (err) {
    console.error(err);
    message.reply("❌ حصل خطأ أثناء جلب الصورة.");
  }
}

export default {
  config,
  onCall
};
