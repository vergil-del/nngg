import { createCanvas, loadImage } from "canvas";
import axios from "axios";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const config = {
  name: "صفع2",
  description: "صفعة قوية فيها وشين 😂",
  category: "تسلية",
  usage: "رد على شخص أو منشنه",
  cooldown: 5,
  credits: "XaviaTeam"
};

const imageURL = "https://i.postimg.cc/W3TPYK6t/a4f0af6f18bc5fae50516adc66a255da.jpg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getAvatar(uid) {
  try {
    const url = `https://graph.facebook.com/${uid}/picture?width=256&height=256`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return await loadImage(response.data);
  } catch {
    return null;
  }
}

async function onCall({ message }) {
  const { mentions, senderID, messageReply } = message;
  const mentionIDs = Object.keys(mentions);

  // تحديد الهدف
  let targetID;
  if (mentionIDs.length > 0) {
    targetID = mentionIDs[0];
  } else if (messageReply?.senderID) {
    targetID = messageReply.senderID;
  } else {
    return message.reply("👋 منشن زول أو رد على رسالتو عشان تصفعو!");
  }

  if (targetID === senderID)
    return message.reply("😂 ما ممكن تصفع نفسك يا نجم!");

  const senderName = global.data.users[senderID]?.name || "مجهول";
  const targetName = global.data.users[targetID]?.name || "شخص ما";

  try {
    const [bgImage, senderAvatar, targetAvatar] = await Promise.all([
      axios.get(imageURL, { responseType: "arraybuffer" }).then(res => loadImage(res.data)),
      getAvatar(senderID),
      getAvatar(targetID)
    ]);

    const canvas = createCanvas(bgImage.width, bgImage.height);
    const ctx = canvas.getContext("2d");

    // خلفية الصفع
    ctx.drawImage(bgImage, 0, 0);

    const faceSize = 110;

    // ✨ الوجه الأول: المرسل (على اليسار في الصورة)
    if (senderAvatar) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(170, 160, faceSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(senderAvatar, 115, 105, faceSize, faceSize);
      ctx.restore();
    }

    // ✨ الوجه الثاني: المصفوع (على اليمين في الصورة)
    if (targetAvatar) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(470, 160, faceSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(targetAvatar, 415, 105, faceSize, faceSize);
      ctx.restore();
    }

    // كتابة النص في الأسفل
    const text = `${senderName} صفع ${targetName} 🔥`;
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;

    const textX = canvas.width / 2 - ctx.measureText(text).width / 2;
    const textY = canvas.height - 40;
    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);

    // إخراج الصورة
    const outPath = path.join(__dirname, "slap2_output.png");
    const stream = canvas.createPNGStream();
    const out = fs.createWriteStream(outPath);
    stream.pipe(out);

    out.on("finish", () => {
      message.reply({
        body: "💢 صفعوووووه!",
        attachment: fs.createReadStream(outPath)
      }, () => fs.unlinkSync(outPath));
    });

  } catch (err) {
    console.error(err);
    message.reply("❌ فشل في معالجة صورة الصفع.");
  }
}

export default {
  config,
  onCall
};
