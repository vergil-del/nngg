const config = {
  name: "خمسين",
  description: "يراقب كلمات معينة ويرد بصورة",
  eventType: ["message"],
  credits: "XaviaTeam"
};

const keywords = [
  "قعدت",
  "كبير شديد",
  "شوفتو",
  "رقدت",
  "اديتو",
  "شلتو",
  "حسيت بيهو",
  "كان حار",
  "وجعني",
  "واي",
  "عملو لي"
];

const imageURL = "https://i.postimg.cc/KYLkzTt3/inbound6281841933413965614.jpg";
const replyText = "» قلتي لي شنو 🐸";

async function onCall({ message }) {
  const text = message.body?.toLowerCase();
  if (!text) return;

  const matched = keywords.find(word => text.includes(word));
  if (!matched) return;

  try {
    message.reply({
      body: replyText,
      attachment: await global.getStream(imageURL)
    });
  } catch (err) {
    console.error("خطأ في إرسال الصورة:", err);
  }
}

export default {
  config,
  onCall
};
