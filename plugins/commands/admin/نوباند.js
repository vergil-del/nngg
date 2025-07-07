const config = {
  name: "نوباند",
  aliases: ["فك-حظر", "unban"],
  description: "عرض وفك حظر المخربين",
  usage: "",
  category: "group",
  cooldown: 5,
  credits: "XaviaTeam"
};

const langData = {
  "ar_SY": {
    "noBanned": "✅ لا يوجد أي مخرب محظور حالياً.",
    "listHeader": "🧾 قائمة المخربين:\n\n",
    "entry": "{index}. {uid}\n🔹 السبب: {reason}\n📅 التاريخ: {date}\n",
    "askUnban": "\n✏️ أرسل رقم العضو لفك الحظر خلال 30 ثانية.",
    "unbanned": "✅ تم فك الحظر عن العضو: {uid}"
  }
};

async function onCall({ message, event, getLang }) {
  const users = await global.controllers.Users.getAll();
  const banned = users.filter(user => user.data?.bannedAsTroll === true);

  if (banned.length === 0) return message.reply(getLang("noBanned"));

  let msg = getLang("listHeader");
  banned.forEach((user, index) => {
    msg += getLang("entry", {
      index: index + 1,
      uid: user.uid,
      reason: user.data?.trollReason || "غير محدد",
      date: user.data?.trollDate || "غير محدد"
    });
  });
  msg += getLang("askUnban");

  message.reply(msg);

  global.client.handleReply.push({
    name: config.name,
    author: event.senderID,
    type: "unban_select",
    list: banned.map(u => u.uid),
    callback: async ({ event: replyEvent }) => {
      const index = parseInt(replyEvent.body);
      if (isNaN(index) || index < 1 || index > banned.length) {
        return message.reply("❌ رقم غير صالح.");
      }

      const removedUID = banned[index - 1].uid;
      await global.controllers.Users.setData(removedUID, {
        bannedAsTroll: false,
        trollReason: null,
        trollDate: null
      });

      return message.reply(getLang("unbanned", { uid: removedUID }));
    }
  });
}

export default {
  config,
  langData,
  onCall
};
