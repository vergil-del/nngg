export default {
  config: {
    name: "mozansense",
    type: "message",
    description: "يتفاعل مع رسائل المطور تلقائياً بالإيموجي عند ذكر موزان",
    author: "XaviaTeam"
  },

  async onMessage({ event, api }) {
    const MOZAN_ID = "61562119538523";

    // فقط تفاعل مع رسائل المطور
    if (event.senderID !== MOZAN_ID) return;

    // تحقق من وجود الكلمة "موزان" حتى لو ضمن كلمة أخرى
    const body = event.body?.toLowerCase();
    if (!body || !body.includes("موزان")) return;

    // اختار إيموجي عشوائي للتفاعل
    const emojis = ["👑", "🔥", "🫡", "❄️", "✨", "🖤", "💎", "⚡", "🥷", "🐦‍⬛"' "🦦", "✨"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    // تفاعل مع الرسالة
    api.setMessageReaction(randomEmoji, event.messageID, () => {}, true);
  }
};
