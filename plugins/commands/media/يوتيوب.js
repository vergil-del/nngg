import axios from "axios";
import fs from "fs-extra";
import path from "path";
import ytdl from "@distube/ytdl-core";

const config = {
  name: "يوتيوب",
  aliases: ["yt", "تحميل"],
  description: "ابحث في يوتيوب ونزل فيديو mp3/mp4 مع اختيار الجودة وتأكيد التنزيل",
  usage: "<mp3 | mp4> <الكلمات> [جودة مثل 144/360/720...]",
  category: "ميديا",
  cooldown: 10,
  credits: "XaviaTeam"
};

const TEMP_PATH = "/tmp";
const VALID_QUALITIES = ["144", "240", "360", "480", "720", "1080"];

async function getYoutubeSearch(query) {
  const res = await axios.get(`https://yt.search.enable-plugins.repl.co/api/search?q=${encodeURIComponent(query)}`);
  return res.data?.videos?.slice(0, 5);
}

async function onCall({ message, args, api, event }) {
  const type = args[0];
  if (!["mp3", "mp4"].includes(type)) return message.reply("❌ الاستعمال:\nيوتيوب mp3 <كلمات>\nيوتيوب mp4 <كلمات> [جودة]");

  let quality = null;
  if (type === "mp4") {
    const lastArg = args[args.length - 1];
    if (VALID_QUALITIES.includes(lastArg)) {
      quality = lastArg + "p";
      args.pop();
    }
  }

  const query = args.slice(1).join(" ");
  if (!query) return message.reply("❌ اكتب الكلمات بعد النوع");

  const isLink = query.includes("youtube.com") || query.includes("youtu.be");
  if (isLink) return askToConfirmDownload(query, type, message, quality, event);

  const results = await getYoutubeSearch(query);
  if (!results || results.length === 0) return message.reply("❌ لم أجد نتائج.");

  let msg = `🎬 اختر الفيديو:\n`;
  results.forEach((vid, i) => {
    msg += `${i + 1}. ${vid.title} (${vid.duration})\n`;
  });
  msg += "\n⏱️ أرسل رقم الفيديو الذي تريده (1-5) خلال 20 ثانية.";

  message.reply(msg);

  global.client.handleReply.push({
    name: config.name,
    messageID: event.messageID,
    author: event.senderID,
    type: "choose",
    callback: async ({ event: replyEvent }) => {
      const index = parseInt(replyEvent.body);
      if (isNaN(index) || index < 1 || index > results.length)
        return message.reply("⚠️ رقم غير صحيح.");

      api.unsendMessage(replyEvent.messageReply.messageID);
      await askToConfirmDownload(results[index - 1].url, type, message, quality, replyEvent);
    }
  });
}

async function askToConfirmDownload(url, type, message, quality, event) {
  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const seconds = parseInt(info.videoDetails.lengthSeconds);
    const duration = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    const format = ytdl.chooseFormat(info.formats, {
      quality: quality || (type === "mp3" ? "highestaudio" : "highestvideo"),
      filter: type === "mp3" ? "audioonly" : "videoandaudio"
    });

    const estimatedSizeMB = (format.contentLength ? format.contentLength / 1024 / 1024 : 0).toFixed(2);
    const msg = `📽️ العنوان: ${title}\n⏱️ المدة: ${duration}\n📦 الحجم المتوقع: ${estimatedSizeMB}MB\n\n✅ هل تريد التنزيل؟ (نعم/لا)`;

    message.reply(msg);

    global.client.handleReply.push({
      name: config.name,
      messageID: event.messageID,
      author: event.senderID,
      type: "confirm",
      callback: async ({ event: confirmEvent }) => {
        const yes = ["نعم", "y", "yes", "اوك"];
        const no = ["لا", "n", "no", "الغاء"];

        if (yes.includes(confirmEvent.body.toLowerCase())) {
          message.reply("🔁 جاري التحميل...");
          await downloadFromURL(url, type, message, quality);
        } else {
          message.reply("❌ تم إلغاء التنزيل.");
        }
      }
    });
  } catch (err) {
    console.error(err);
    message.reply("⚠️ خطأ أثناء معالجة الفيديو.");
  }
}

async function downloadFromURL(videoURL, type, message, quality = null) {
  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title;
    const seconds = parseInt(info.videoDetails.lengthSeconds);
    const duration = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
    const extension = type === "mp3" ? "mp3" : "mp4";
    const filePath = path.join(TEMP_PATH, `yt-${Date.now()}.${extension}`);

    const stream = ytdl(videoURL, {
      filter: type === "mp3" ? "audioonly" : "videoandaudio",
      quality: quality || (type === "mp3" ? "highestaudio" : "highestvideo")
    });

    const file = fs.createWriteStream(filePath);
    stream.pipe(file);

    file.on("finish", async () => {
      await message.reply({
        body: `✅ تم التنزيل:\n📌 العنوان: ${title}\n⏱️ المدة: ${duration}`,
        attachment: fs.createReadStream(filePath)
      });
      fs.unlinkSync(filePath);
    });

    stream.on("error", () => message.reply("❌ خطأ أثناء التحميل."));
  } catch (err) {
    console.error(err);
    message.reply("⚠️ حصل خطأ أثناء التحميل أو الرابط غير صالح.");
  }
}

export default {
  config,
  onCall
};
