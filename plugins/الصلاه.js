import axios from 'axios';
import { randomBytes } from 'crypto';

const countryInfo = {
    'مصر': { capital: 'القاهرة', code: 'EG', emoji: '🇪🇬' },
    'السعودية': { capital: 'الرياض', code: 'SA', emoji: '🇸🇦' },
    'الإمارات': { capital: 'أبوظبي', code: 'AE', emoji: '🇦🇪' },
    'الكويت': { capital: 'مدينة الكويت', code: 'KW', emoji: '🇰🇼' },
    'قطر': { capital: 'الدوحة', code: 'QA', emoji: '🇶🇦' },
    'البحرين': { capital: 'المنامة', code: 'BH', emoji: '🇧🇭' },
    'عمان': { capital: 'مسقط', code: 'OM', emoji: '🇴🇲' },
    'الأردن': { capital: 'عمان', code: 'JO', emoji: '🇯🇴' },
    'لبنان': { capital: 'بيروت', code: 'LB', emoji: '🇱🇧' },
    'العراق': { capital: 'بغداد', code: 'IQ', emoji: '🇮🇶' },
    'اليمن': { capital: 'صنعاء', code: 'YE', emoji: '🇾🇪' },
    'سوريا': { capital: 'دمشق', code: 'SY', emoji: '🇸🇾' },
    'فلسطين': { capital: 'القدس', code: 'PS', emoji: '🇵🇸' },
    'ليبيا': { capital: 'طرابلس', code: 'LY', emoji: '🇱🇾' },
    'تونس': { capital: 'تونس', code: 'TN', emoji: '🇹🇳' },
    'الجزائر': { capital: 'الجزائر', code: 'DZ', emoji: '🇩🇿' },
    'المغرب': { capital: 'الرباط', code: 'MA', emoji: '🇲🇦' },
    'السودان': { capital: 'الخرطوم', code: 'SD', emoji: '🇸🇩' },
    'موريتانيا': { capital: 'نواكشوط', code: 'MR', emoji: '🇲🇷' },
    'جيبوتي': { capital: 'جيبوتي', code: 'DJ', emoji: '🇩🇯' },
    'الصومال': { capital: 'مقديشو', code: 'SO', emoji: '🇸🇴' },
    'جزر القمر': { capital: 'موروني', code: 'KM', emoji: '🇰🇲' }
};

function convertTo12HourFormat(time) {
    const splitTime = time.split(':');
    let hours = parseInt(splitTime[0], 10);
    const minutes = splitTime[1];
    const meridiem = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12 || 12; 

    return `${hours}:${minutes} ${meridiem}`;
}

function convertTo24HourFormat(time) {
    const [hour, minute, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
    let hours = parseInt(hour, 10);
    if (period === 'م' && hours !== 12) {
        hours += 12;
    } else if (period === 'ص' && hours === 12) {
        hours = 0;
    }
    return `${hours.toString().padStart(2, '0')}:${minute}`;
}

const handler = async (m, { conn, text }) => {
    if (!text) {
        const countryList = Object.keys(countryInfo).map(country => ({
            header: country,
            title: country,
            description: '',
            id: `.مواقيت ${country}`
        }));

        return conn.relayMessage(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: {
                            title: '*❆━━━═⏣⊰🦇⊱⏣═━━━❆*\n\n*🦇⤺┇اخـتـر دولـة*\n'
                        },
                        body: {
                            text: '🦇⤺┇ *يرجى اختيار دولة للحصول على مواقيت الصلاة :*\n\n*❆━━━═⏣⊰🦇⊱⏣═━━━❆*'
                        },
                        nativeFlowMessage: {
                            buttons: [
                                {
                                    name: 'single_select',
                                    buttonParamsJson: JSON.stringify({
                                        title: '🦇قــائــمـة الــدول',
                                        sections: [
                                            {
                                                title: '🦇⤺┇ مواقيت الصلاة',
                                                highlight_label: 'صل على النبي',
                                                rows: countryList
                                            }
                                        ]
                                    }),
                                    messageParamsJson: ''
              },
              {
                name: "quick_reply",
                buttonParamsJson: '{"display_text":"الاوامــر🦇","id":".الاوامر"}'
              },              
              {
                name: "cta_url",
                buttonParamsJson: '{"display_text":"قـنـاتـنـا 🦇","url":"https://whatsapp.com/channel/0029VacQnLG6WaKulhudf01i","merchant_url":"https://whatsapp.com/channel/0029VacQnLG6WaKulhudf01i"}'
              }, 
            ]
          }
        }
      }
    }
  }, {});
  } 
    const country = text.trim().replace('.مواقيت ', '');
    const info = countryInfo[country];

    if (!info) {
        return m.reply('*❆━━━═⏣⊰🦇⊱⏣═━━━❆*\n\n*🦇⤺┇عذرًا، لم يتم تسجيل هذة الدولة في قاعدة بياناتي. يرجى التأكد من كتابة اسم الدولة بشكل صحيح.*\n\n*❆━━━═⏣⊰🦇⊱⏣═━━━❆*');
    }

    try {
        const prayerResponse = await axios.get(`http://api.aladhan.com/v1/timingsByCity?city=${info.capital}&country=${info.code}`);
        const prayerData = prayerResponse.data.data.timings;

        const fajr = convertTo12HourFormat(prayerData.Fajr);
        const sunrise = convertTo12HourFormat(prayerData.Sunrise);
        const dhuhr = convertTo12HourFormat(prayerData.Dhuhr);
        const asr = convertTo12HourFormat(prayerData.Asr);
        const maghrib = convertTo12HourFormat(prayerData.Maghrib);
        const isha = convertTo12HourFormat(prayerData.Isha);

        const message = `*❆━━━═⏣⊰🦇⊱⏣═━━━❆*\n\n*🕌 مواقيت الصلاة في* ${info.capital}، ${country} ${info.emoji} *اليوم:*\n\n- *🌅 الفجر:* ${fajr}\n\n- *☀️ الشروق:* ${sunrise}\n\n- *🕛 الظهر:* ${dhuhr}\n\n- *🕒 العصر:* ${asr}\n\n- *🌇 المغرب:* ${maghrib}\n\n- *🌙 العشاء:* ${isha}\n\n*❆━━━═⏣⊰🦇⊱⏣═━━━❆*`;
     return conn.sendMessage(m.chat,{ image :{ url : "https://telegra.ph/file/c03ea71e665b019c53d33.jpg" } , caption : message , mentions: [...message.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')}, { quoted: m })


        schedulePrayerNotifications(prayerData, info, conn);
    } catch (error) {
        console.error('*❆━━━═⏣⊰🦇⊱⏣═━━━❆*\n\n*🦇⤺┇حدث خطأ في الحصول على مواقيت الصلاة:*\n\n*❆━━━═⏣⊰🦇⊱⏣═━━━❆*', error);
        m.reply('*❆━━━═⏣⊰🦇⊱⏣═━━━❆*\n\n*🦇⤺┇عذرًا، لم أتمكن من العثور على مواقيت الصلاة لهذه المدينة.*\n\n*❆━━━═⏣⊰🦇⊱⏣═━━━❆*');
    }
}

function schedulePrayerNotifications(prayerData, info, conn) {
    const prayerTimes = [
        { name: 'الفجر', time: prayerData.Fajr },
        { name: 'الظهر', time: prayerData.Dhuhr },
        { name: 'العصر', time: prayerData.Asr },
        { name: 'المغرب', time: prayerData.Maghrib },
        { name: 'العشاء', time: prayerData.Isha }
    ];

    setInterval(async () => {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);

        prayerTimes.forEach(async prayer => {
            const prayerTime24 = convertTo24HourFormat(convertTo12HourFormat(prayer.time));
            if (currentTime === prayerTime24) {
                const message = `*❆━━━═⏣⊰🦇⊱⏣═━━━❆*\n\n🕌 *تنبيه:* حان الآن موعد صلاة ${prayer.name} في ${info.capital}، ${info.emoji}\n\n*❆━━━═⏣⊰🦇⊱⏣═━━━❆*`;
                
 
                let chats = Object.entries(conn.chats)
                    .filter(([_, chat]) => chat.isChats)
                    .map(v => v[0]);
                
                for (let id of chats) {
                    await conn
                        .copyNForward(
                            id,
                            conn.cMod(
                                'broadcast', 
                                message,
                                false
                            ),
                            true
                        )
                        .catch(_ => _);
                }
            }
        });
    }, 60000); 
}

handler.command = ['الصلاة', 'مواقيت'];
handler.tags = ['tools'];

export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

const randomID = length => randomBytes(Math.ceil(length * 0.5)).toString('hex').slice(0, length);
