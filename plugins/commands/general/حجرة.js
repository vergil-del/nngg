const config = {
  name: "حجرة",
  aliases: ["حجر", "مقص", "ورقة"],
  description: "العب حجرة ورقة مقص مع البوت",
  usage: "<حجرة|ورقة|مقص>",
  cooldown: 3,
  credits: "XaviaTeam"
};

const choices = ["حجرة", "ورقة", "مقص"];

function determineResult(user, bot) {
  if (user === bot) return "🔁 تعادل!";
  if (
    (user === "حجرة" && bot === "مقص") ||
    (user === "ورقة" && bot === "حجرة") ||
    (user === "مقص" && bot === "ورقة")
  ) return "🎉 فزت!";
  return "😢 خسرت!";
}

async function onCall({ message, args }) {
  const userChoice = args[0];
  if (!choices.includes(userChoice)) {
    return message.reply("اكتب: حجرة أو ورقة أو مقص.");
  }

  const botChoice = choices[Math.floor(Math.random() * choices.length)];
  const result = determineResult(userChoice, botChoice);
  return message.reply(`📢 انت اخترت: ${userChoice}\n🤖 البوت اختار: ${botChoice}\n\n${result}`);
}

export default { config, onCall };
