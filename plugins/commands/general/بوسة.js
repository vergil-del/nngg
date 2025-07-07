import { createCanvas, loadImage } from "canvas";
import axios from "axios";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const config = {
  name: "بوسة",
  description: "ابوس شخص من المجموعة 😘",
  category: "تسلية",
  usage: "@منشن",
  cooldown: 5,
  credits: "XaviaTeam"
};

// صورة البوسة من Postimg
const imageURL = "https://i.postimg.cc/rsQNTXLs/kiss2.gif";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function onCall({ message }) {
  const { mentions, senderID } = message;
  const mentionIDs = Object.keys(mentions);

  if (!mentionIDs.length)
    return message.reply("😘 منشن شخص تبوسه!");

  const targetName = mentions[mentionIDs[0]].replace(/@/g, "");
  const senderName = global.data.users[senderID]?.name || "شخص مجهول";

  try {
    const response = await axios.get(imageURL, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    const image = await loadImage(buffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    // رسم صورة البوسة
    ctx.drawImage(image, 0, 0);

    // نص البوسة
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "pink";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    const text = `${senderName} بوس ${targetName} 💋`;
    const x = 20;
    const y = image.height - 40;

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);

    const outputPath = path.join(__dirname, "kiss_output.png");
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();

    stream.pipe(out);
    out.on("finish", () => {
      message.reply({
        body: "💋 البوسة وصلت!",
        attachment: fs.createReadStream(outputPath)
      }, () => fs.unlinkSync(outputPath)); // حذف بعد الإرسال
    });

  } catch (err) {
    console.error(err);
    message.reply("❌ حصل خطأ أثناء معالجة صورة البوسة.");
  }
}

export default {
  config,
  onCall
};
