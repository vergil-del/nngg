const config = {
  name: "لاست",
  aliases: ["groups", "botsgroups"],
  description: "عرض قائمة المجموعات الموجود بها البوت مع إمكانية مغادرة أي مجموعة",
  usage: "",
  category: "admin",
  cooldown: 5,
  credits: "XaviaTeam"
};

const langData = {
  "ar_SY": {
    "notDev": "❌ هذا الأمر للمطور فقط!",
    "noGroups": "❌ لا توجد مجموعات مسجلة.",
    "groupListHeader": "📜 قائمة المجموعات:\n\n",
    "groupItem": "{index}. {name} | الأعضاء: {members} | ID: {threadID}",
    "chooseIndex": "\n\n✏️ أرسل رقم المجموعة للمغادرة خلال 30 ثانية.",
    "leftNotice": "🚪 تمت أمرة البوت بمغادرة المجموعة.\nللمزيد من المعلومات الرجاء التواصل مع المطور:\nhttps://www.facebook.com/profile.php?id=61562119538523"
  }
};

async function onCall({ message, api, event, getLang }) {
  const devID = "61562119538523";
  if (event.senderID != devID) return message.reply(getLang("notDev"));

  const threads = await api.getThreadList(100, null, ["INBOX"]);
  const groupList = threads.filter(t => t.isGroup && t.participantIDs.length > 1);

  if (groupList.length === 0) return message.reply(getLang("noGroups"));

  let msg = getLang("groupListHeader");
  groupList.forEach((group, index) => {
    msg += getLang("groupItem", {
      index: index + 1,
      name: group.name || "بدون اسم",
      members: group.participantIDs.length,
      threadID: group.threadID
    }) + "\n";
  });
  msg += getLang("chooseIndex");

  message.reply(msg);

  global.client.handleReply.push({
    name: config.name,
    messageID: event.messageID,
    author: event.senderID,
    type: "choose_group",
    groupList,
    callback: async ({ event: replyEvent, groupList }) => {
      const index = parseInt(replyEvent.body);
      if (isNaN(index) || index < 1 || index > groupList.length) {
        return message.reply("❌ رقم غير صالح.");
      }

      const targetGroup = groupList[index - 1];
      await api.sendMessage(getLang("leftNotice"), targetGroup.threadID);
      await api.removeUserFromGroup(global.botID, targetGroup.threadID);
      return message.reply("✅ تم مغادرة المجموعة.");
    }
  });
}

export default {
  config,
  langData,
  onCall
};
