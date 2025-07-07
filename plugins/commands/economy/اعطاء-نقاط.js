const config = {
  name: "اعطاء-نقاط",
  description: "للمشرف فقط: إعطاء نقاط لعضو",
  usage: "@منشن + عدد النقاط",
  cooldown: 5,
  category: "فعاليات",
  permission: 1,
  credits: "XaviaTeam"
};

async function onCall({ message, event, args }) {
  const { mentions } = message;
  const points = parseInt(args[args.length - 1]);
  const { Users } = global.controllers;

  if (!mentions || isNaN(points))
    return message.reply("❗ استخدم: اعطاء-نقاط @العضو 10");

  for (const uid in mentions) {
    await Users.createIfNotExists(uid);
    const current = await Users.getData(uid, "eventPoints") || 0;
    await Users.setData(uid, { eventPoints: current + points });
  }

  return message.reply("✅ تمت إضافة النقاط بنجاح.");
}

export default {
  config,
  onCall
};
