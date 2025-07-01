import axios from 'axios';

const config = {
  name: 'اوتشيها',
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
  
  // الردود المحلية على الأسئلة الشائعة
  if (!text || text === '') return message.reply("دابي عمك (𖠂ᴗ𖠂)");
  if (text.includes('كيفك') || text.includes('كيف حالك')) return message.reply("تمام، أنا بخير. شكرًا على السؤال! 🐸");
  if (text.includes('من أنت')) return message.reply("أنا مشمش، مصمم لمساعدتك في الحصول 100090544069481 المعلومات. 🐸");

  try {
    let imageUrl;
    if (message.messageReply?.attachments?.[0]?.type === "photo") {
      imageUrl = message.messageReply.attachments[0].url;
    }
    const api = `https://rapido.zetsu.xyz/api/gemini?chat=${encodeURIComponent(text)}&uid=${message.senderID}${imageUrl ? `&imageUrl=${encodeURIComponent(imageUrl)}` : ''}`;
    const res = await axios.get(api);
    
    // تعديل الرد من الAPI
    let response = res.data.response;
    response = response.replace(/أنا/g, '(𖠂ᴗ𖠂)');
    response = response.replace(/مرحبًا/g, 'اوها يبدو انك تحتاج الى مساعدة');
    response = `اها يبدو انك ${getInsult()}, ${response} 🐸`;
    
    message.reply(response);
  } catch (e) {
    message.reply(e);
  }
}

// دالة للحصول على إهانة عشوائية
function getInsult() {
  const insults = ['احمق', 'غبي', 'مجنون', 'جاهل', 'متهور', 'تلفان'];
  return insults[Math.floor(Math.random() * insults.length)];
}

export default { config, onCall };
