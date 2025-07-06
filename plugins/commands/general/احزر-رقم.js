const config = {
  name: "احزر-رقم",
  aliases: ["رقم", "تخمين"],
  description: "يحاول المستخدم تخمين رقم من 1 إلى 10",
  usage: "<رقم>",
  cooldown: 3,
  credits: "XaviaTeam"
};

async function onCall({ message, args }) {
  const guess = parseInt(args[0]);
  if (!guess || guess < 1 || guess > 10) {
    return message.reply("اكتب رقم بين 1 و 10 🔢");
  }

  const secret = Math.floor(Math.random() * 10) + 1;
  if (guess === secret) {
    return message.reply(`🎉 صحيح! الرقم هو ${secret}`);
  } else {
    return message.reply(`❌ غلط! الرقم الصحيح كان ${secret}`);
  }
}

export default { config, onCall };
