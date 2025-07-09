const config = { name: "مجموعات", aliases: ["groups", "قروبات"], description: "عرض جميع المجموعات الموجود فيها البوت مع خيار المغادرة أو الحظر", usage: "", cooldown: 5, permissions: [2], credits: "XaviaTeam", isAbsolute: true };

const langData = { "ar_SY": { "list": "🔹 قائمة المجموعات:\n\n{list}\n\nاكتب رقم المجموعة التي تريد مغادرتها أو اكتب block <الرقم> لحظرها خلال 30 ثانية.", "invalid": "❌ الرقم غير صحيح أو غير موجود.", "left": "✅ غادر البوت المجموعة بنجاح.\n📩 للتواصل مع المطور:\n{devLink}\n🔧 المطور: {devName}", "blocked": "🚫 تم حظر المجموعة بنجاح. لن يعمل البوت فيها مجددًا.", "error": "⚠️ حدث خطأ أثناء محاولة تنفيذ العملية." } };

const blockedGroups = global.blockedGroups || (global.blockedGroups = []);

async function onCall({ message, getLang, event }) { try { const threads = await global.api.getThreadList(100, null, ["INBOX"]); const groups = threads.filter(g => g.isGroup);

if (groups.length == 0)
  return message.reply("❌ لا يوجد مجموعات حاليًا.");

const msg = getLang("list", {
  list: groups.map((g, i) => `${i + 1}. ${g.name} (${g.threadID})`).join("\n")
});

message.reply(msg).then(res => {
  global.client.handleReply.push({
    name: config.name,
    messageID: res.messageID,
    author: event.senderID,
    type: "choose-group",
    groups
  });
});

} catch (err) { console.error(err); message.reply(getLang("error")); } }

async function handleReply({ event, Reply, message, getLang }) { const input = event.body.trim(); const isBlock = input.toLowerCase().startsWith("block"); const indexStr = isBlock ? input.split(" ")[1] : input; const index = parseInt(indexStr);

if (isNaN(index) || index < 1 || index > Reply.groups.length) return message.reply(getLang("invalid"));

const group = Reply.groups[index - 1]; const devName = global.config.BOTNAME || "البوت"; const devLink = global.config.CONTACT || "https://facebook.com/mozan50sama";

try { if (isBlock) { if (!blockedGroups.includes(group.threadID)) blockedGroups.push(group.threadID);

await global.api.removeUserFromGroup(global.botID, group.threadID);
  await message.send(getLang("blocked"), group.threadID);
  return message.reply(`🚫 تم حظر ومغادرة المجموعة: ${group.name}`);
} else {
  await global.api.removeUserFromGroup(global.botID, group.threadID);
  await message.send(getLang("left", { devName, devLink }), group.threadID);
  return message.reply(`✅ غادر البوت من المجموعة: ${group.name}`);
}

} catch (err) { console.error(err); message.reply(getLang("error")); } }

export default { config, langData, onCall, handleReply };

