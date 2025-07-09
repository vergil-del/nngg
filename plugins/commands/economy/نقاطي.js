const config = {
  name: "نقاطي",
  aliases: ["نقاط"],
  description: "عرض عدد النقاط التي تملكها",
  usage: "",
  cooldown: 3,
  category: "فعاليات",
  credits: "XaviaTeam"
};

async function onCall({ message }) {
  const { Users } = global.controllers;
  const points = await Users.getData(message.senderID, "eventPoints") || 0;
  return message.reply(`🎯 نقاطك الحالية: ${points} نقطة`);
}

export default {
  config,
  onCall
};
