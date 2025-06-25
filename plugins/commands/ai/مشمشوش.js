import axios from 'axios';

const config = {
  name: 'مشمش',
  version: '1.0',
  permissions: 0,
  credits: 'rapido',
  description: 'gemini ai with image support',
  commandCategory: 'ai',
  usages: '[text] (reply to image)',
  cooldown: 5
};

async function onCall({ message, args, getLang }) {
  const text = args.join(' ');
  if (!text || text === '') return message.reply("داير شنو يا بل ಠ_ಠ ؟");
  if (text.includes('من مطورك') || text.includes('من صنعك')) return message.reply("تم تطويري من قبل صلاح الدين المعروف بي Rako San ");
  if (text.includes('من أنت')) return message.reply(" أنا مشمش، مصمم من قبل عمك صلاح الدين لمساعدتك في الحصول على المعلومات 🐢.");
  if (!text || text === 'مطورك') return message.reply("مطوري صلاح عمك  يا ناعم 🐸");
  if (text.includes('صلاح الدين ') || text.includes('راكو سان')) return message.reply("عمك وعم الجميع 🐸💖");
  if (text.includes('اسمك')) || text.includes('اسمك منو')) return message.reply("اسمي مشمش يا دنقلا 🐸");

  // الردود المحلية على الأسئلة الشائعة
  if (!text || text === '') return message.reply("مرحبًا! كيف يمكنني مساعدتك؟ 🐸");
  if (text.includes('كيفك') || text.includes('كيف حالك')) return message.reply("تمام، أنا بخير. شكرًا على السؤال! 🐸");
  if (text.includes('من أنت')) return message.reply("أنا بوت، مصمم لمساعدتك في الحصول على المعلومات. 🐸");

  try {
    let imageUrl;
    if (message.messageReply?.attachments?.[0]?.type === "photo") {
      imageUrl = message.messageReply.attachments[0].url;
    }
    const api = `https://rapido.zetsu.xyz/api/gemini?chat=${encodeURIComponent(text)}&uid=${message.senderID}${imageUrl ? `&imageUrl=${encodeURIComponent(imageUrl)}` : ''}`;
    const res = await axios.get(api);
    
    // تعديل الرد من الAPI بشكل قاصف
    let response = res.data.response;
    if (isStupidQuestion(text)) {
      response = `اوه يالك من غبي، ${response} 🐸`;
    } else if (isLoveQuestion(text)) {
      response = `لا أستطيع أن أضيع وقتي مع شخص مثلك، ${response} 🐸`;
    } else if (isViolentQuestion(text)) {
      response = `أنت مجنون؟ لا أستطيع أن أساعدك في هذا، ${response} 🐸`;
    } else {
      response = `برنامج لغوي، لكن لا أعتقد أنك تستطيع فهم ما أقول، ${response} 🐸`;
    }
    
    message.reply(response);
  } catch (e) {
    message.reply(e);
  }
}

// دالة للتحقق من الأسئلة الغبية
function isStupidQuestion(text) {
  const stupidQuestions = ['تاكل', 'تشرب', 'تحب', 'تبوس', 'اضرب', 'هات فلوس'];
  return stupidQuestions.some(question => text.includes(question));
}

// دالة للتحقق من الأسئلة الرومانسية
function isLoveQuestion(text) {
  const loveQuestions = ['احبك', 'بحبك', 'في حبك'];
  return loveQuestions.some(question => text.includes(question));
}

// دالة للتحقق من الأسئلة العنيفة
function isViolentQuestion(text) {
  const violentQuestions = ['اضرب', 'اقتل', 'اهدم'];
  return violentQuestions.some(question => text.includes(question));
}

export default { config, onCall };
