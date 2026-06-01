import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

// ── Language config (mirrors Home Page's 14-language system) ─────────────────
const LANGUAGES = [
  { code: "en", label: "English", rtl: false },
  { code: "ar", label: "العربية", rtl: true },
  { code: "zh", label: "中文", rtl: false },
  { code: "es", label: "Español", rtl: false },
  { code: "fr", label: "Français", rtl: false },
  { code: "pt", label: "Português", rtl: false },
  { code: "ru", label: "Русский", rtl: false },
  { code: "ja", label: "日本語", rtl: false },
  { code: "ko", label: "한국어", rtl: false },
  { code: "th", label: "ภาษาไทย", rtl: false },
  { code: "ml", label: "മലയാളം", rtl: false },
  { code: "ta", label: "தமிழ்", rtl: false },
  { code: "hi", label: "हिन्दी", rtl: false },
  { code: "bn", label: "বাংলা", rtl: false },
  { code: "gu", label: "ગુજરાતી", rtl: false },
  { code: "kn", label: "ಕನ್ನಡ", rtl: false },
  { code: "mr", label: "मराठी", rtl: false },
  { code: "or", label: "ଓଡ଼ିଆ", rtl: false },
  { code: "pa", label: "ਪੰਜਾਬੀ", rtl: false },
  { code: "te", label: "తెలుగు", rtl: false },
  { code: "ur", label: "اردو", rtl: true },
];

// ── Simulated translations for demo content ──────────────────────────────────
const TRANSLATIONS = {
  en: {
    title: "Echoes of the Forgotten Kingdom",
    summary:
      "When a disgraced scholar discovers an ancient manuscript hidden beneath the ruins of a long-lost dynasty, she unknowingly triggers a chain of events that will reshape the very fabric of her world. Pursued by shadowy factions and haunted by visions of a past she cannot explain, Aria must decipher the manuscript's secrets before the kingdom's dormant magic is claimed by those who would use it to enslave nations. A sweeping tale of betrayal, redemption, and the enduring power of truth.",
    chapters: [
      "The Shattered Seal", "A Scholar's Disgrace", "Whispers in the Ruins",
      "The First Cipher", "Blood on the Parchment", "The Hidden Court",
      "Shadows of the Old Empire", "Aria's Gambit", "The Nameless Faction",
      "Fire and Ink", "The Betrayer's Mark", "Gates of the Forgotten",
      "A Kingdom Remembered", "The Last Inscription", "The Echo Returns",
    ],
    readFirst: "Read First Chapter",
    addLibrary: "Add to Library",
    storySummary: "Story Summary",
    chaptersTitle: "Chapters",
    free: "Free",
    coins: "Coins",
    unlock: "to Unlock",
    views: "Views",
    translating: "Auto-translating...",
    chapter: "Chapter",
  },
  ml: {
    title: "മറക്കപ്പെട്ട രാജ്യത്തിന്റെ പ്രതിധ്വനികൾ",
    summary:
      "ഒരു അപമാനിതയായ പണ്ഡിതൻ ഒരു നഷ്ടപ്പെട്ട രാജവംശത്തിന്റെ അവശിഷ്ടങ്ങൾക്കടിയിൽ ഒളിഞ്ഞിരിക്കുന്ന ഒരു പ്രാചീന കൈയെഴുത്തുപ്രതി കണ്ടെത്തുമ്പോൾ, അവൾ അറിയാതെ ഒരു സംഭവ പരമ്പരയ്ക്ക് തുടക്കമിടുന്നു. ആ കൈയെഴുത്തുപ്രതിയുടെ രഹസ്യങ്ങൾ കണ്ടെത്തി ആ ഉറങ്ങുന്ന മാന്ത്രിക ശക്തി ആരുടെ കൈകളിലുമെത്തുന്നതിന് മുൻപ് ആരിയ അത് സ്വന്തമാക്കണം. വഞ്ചന, മോക്ഷം, സത്യത്തിന്റെ ശക്തി എന്നിവയുടെ ഒരു ഇതിഹാസ കഥ.",
    chapters: [
      "തകർന്ന മുദ്ര", "ഒരു പണ്ഡിതന്റെ അപമാനം", "അവശിഷ്ടങ്ങളിലെ മന്ത്രണങ്ങൾ",
      "ആദ്യ സൂത്രം", "ചർമ്മത്തിൽ രക്തം", "മറഞ്ഞ കോടതി",
      "പഴയ സാമ്രാജ്യത്തിന്റെ നിഴലുകൾ", "ആരിയയുടെ ചൂതുകളി", "പേരില്ലാത്ത വിഭാഗം",
      "തീയും മഷിയും", "ദ്രോഹിയുടെ അടയാളം", "മറക്കപ്പെട്ടവരുടെ ദ്വാരങ്ങൾ",
      "ഓർക്കുന്ന ഒരു രാജ്യം", "അവസാന ലിഖിതം", "പ്രതിധ്വനി മടങ്ങുന്നു",
    ],
    readFirst: "ആദ്യ അദ്ധ്യായം വായിക്കുക",
    addLibrary: "ലൈബ്രറിയിൽ ചേർക്കുക",
    storySummary: "കഥാ സംഗ്രഹം",
    chaptersTitle: "അദ്ധ്യായങ്ങൾ",
    free: "സൗജന്യം",
    coins: "നാണയങ്ങൾ",
    unlock: "അൺലോക്ക് ചെയ്യാൻ",
    views: "കാഴ്ചകൾ",
    translating: "സ്വയം പരിഭാഷപ്പെടുത്തുന്നു...",
    chapter: "അദ്ധ്യായം",
  },
  hi: {
    title: "विस्मृत राज्य की प्रतिध्वनियाँ",
    summary:
      "जब एक अपमानित विद्वान एक लंबे समय से खोए हुए राजवंश के खंडहरों के नीचे छिपी एक प्राचीन पांडुलिपि की खोज करती है, तो वह अनजाने में एक ऐसी घटनाओं की श्रृंखला को जन्म देती है जो उसकी दुनिया के ताने-बाने को पुनः आकार देगी। विश्वासघात, मोक्ष और सत्य की स्थायी शक्ति की एक व्यापक गाथा।",
    chapters: [
      "टूटी हुई मुहर", "एक विद्वान की अपमान", "खंडहरों में फुसफुसाहट",
      "पहला सांकेतिक लिपि", "चर्मपत्र पर रक्त", "छिपी हुई अदालत",
      "पुराने साम्राज्य की छाया", "आरिया का दाँव", "अनाम गुट",
      "अग्नि और स्याही", "विश्वासघाती की निशान", "भुलाए गए के द्वार",
      "याद किया गया राज्य", "अंतिम शिलालेख", "प्रतिध्वनि लौटती है",
    ],
    readFirst: "पहला अध्याय पढ़ें",
    addLibrary: "पुस्तकालय में जोड़ें",
    storySummary: "कहानी का सारांश",
    chaptersTitle: "अध्याय",
    free: "मुफ़्त",
    coins: "सिक्के",
    unlock: "अनलॉक करने के लिए",
    views: "दृश्य",
    translating: "स्वतः अनुवाद हो रहा है...",
    chapter: "अध्याय",
  },
  ta: {
    title: "மறக்கப்பட்ட இராஜ்யத்தின் எதிரொலிகள்",
    summary:
      "ஒரு இழிவுற்ற அறிஞர் நீண்ட காலமாக இழந்த ஒரு வம்சத்தின் இடிபாடுகளுக்கு கீழே மறைந்திருக்கும் ஒரு பழங்கால கையெழுத்து பிரதியை கண்டுபிடிக்கும்போது, அவள் அறியாமலேயே ஒரு நிகழ்வுகளின் சங்கிலியை தூண்டுகிறாள். துரோகம், மீட்பு மற்றும் உண்மையின் நிலையான சக்தியின் ஒரு விரிவான கதை.",
    chapters: [
      "உடைந்த முத்திரை", "ஒரு அறிஞரின் அவமானம்", "இடிபாடுகளில் ஓசைகள்",
      "முதல் சைஃபர்", "சர்ம்மத்தில் இரத்தம்", "மறைந்த நீதிமன்றம்",
      "பழைய சாம்ராஜ்யத்தின் நிழல்கள்", "ஆரியாவின் சூதாட்டம்", "பெயரில்லா பிரிவு",
      "தீ மற்றும் மை", "துரோகியின் அடையாளம்", "மறக்கப்பட்டவர்களின் வாயில்கள்",
      "நினைவுகூரப்படும் இராஜ்யம்", "கடைசி கல்வெட்டு", "எதிரொலி திரும்புகிறது",
    ],
    readFirst: "முதல் அத்தியாயம் படிக்க",
    addLibrary: "நூலகத்தில் சேர்க்க",
    storySummary: "கதை சுருக்கம்",
    chaptersTitle: "அத்தியாயங்கள்",
    free: "இலவசம்",
    coins: "நாணயங்கள்",
    unlock: "திறக்க",
    views: "பார்வைகள்",
    translating: "தானாக மொழிபெயர்க்கிறது...",
    chapter: "அத்தியாயம்",
  },
  ar: {
    title: "أصداء المملكة المنسية",
    summary:
      "عندما تكتشف عالمة مهانة مخطوطة قديمة مخفية تحت أنقاض سلالة مفقودة منذ أمد بعيد، تطلق عن غير قصد سلسلة من الأحداث ستعيد تشكيل نسيج عالمها. ملحمة شاملة عن الخيانة والفداء والقوة الدائمة للحقيقة.",
    chapters: [
      "الختم المكسور", "عار عالمة", "همسات في الأنقاض",
      "الشفرة الأولى", "دم على الرق", "المحكمة الخفية",
      "ظلال الإمبراطورية القديمة", "مقامرة آريا", "الفصيل المجهول",
      "النار والحبر", "علامة الخائن", "بوابات المنسيين",
      "مملكة تُذكر", "النقش الأخير", "يعود الصدى",
    ],
    readFirst: "اقرأ الفصل الأول",
    addLibrary: "أضف إلى المكتبة",
    storySummary: "ملخص القصة",
    chaptersTitle: "الفصول",
    free: "مجاني",
    coins: "عملات",
    unlock: "للفتح",
    views: "المشاهدات",
    translating: "جارٍ الترجمة التلقائية...",
    chapter: "الفصل",
  },
  ur: {
    title: "فراموش شدہ سلطنت کی گونج",
    summary:
      "جب ایک رسوا عالمہ ایک دیرینہ گمشدہ خاندان کے کھنڈرات کے نیچے چھپی ایک قدیم مخطوطہ دریافت کرتی ہے، تو وہ انجانے میں ایک ایسا سلسلہ شروع کردیتی ہے جو اس کی دنیا کو نئی شکل دے گا۔ خیانت، نجات اور سچائی کی دائمی طاقت کی ایک وسیع داستان۔",
    chapters: [
      "ٹوٹی مہر", "ایک عالمہ کی بدنامی", "کھنڈرات میں سرگوشیاں",
      "پہلا کوڈ", "چمڑے پر خون", "چھپی عدالت",
      "پرانی سلطنت کے سائے", "آریا کا داؤ", "بے نام گروہ",
      "آگ اور روشنائی", "غدار کا نشان", "فراموش شدگان کے دروازے",
      "یاد کی گئی سلطنت", "آخری کتبہ", "گونج واپس آتی ہے",
    ],
    readFirst: "پہلا باب پڑھیں",
    addLibrary: "لائبریری میں شامل کریں",
    storySummary: "کہانی کا خلاصہ",
    chaptersTitle: "ابواب",
    free: "مفت",
    coins: "سکے",
    unlock: "کھولنے کے لیے",
    views: "مناظر",
    translating: "خودکار ترجمہ ہو رہا ہے...",
    chapter: "باب",
  },
  zh: {
    title: "被遗忘王国的回响",
    summary:
      "当一位蒙羞的学者在一个失落已久的王朝遗迹下发现一份古老的手稿时，她无意中触发了一系列将重塑她世界结构的事件。一部关于背叛、救赎以及真理永恒力量的宏大故事。",
    chapters: [
      "破碎的印记", "学者的耻辱", "废墟中的低语",
      "第一个密码", "羊皮纸上的血", "隐藏的法庭",
      "旧帝国的阴影", "阿里亚的赌注", "无名派系",
      "火与墨水", "叛徒的印记", "被遗忘者之门",
      "被铭记的王国", "最后的铭文", "回响归来",
    ],
    readFirst: "阅读第一章",
    addLibrary: "添加到书库",
    storySummary: "故事简介",
    chaptersTitle: "章节",
    free: "免费",
    coins: "金币",
    unlock: "解锁",
    views: "阅读量",
    translating: "自动翻译中...",
    chapter: "第",
  },
  ja: {
    title: "忘れられた王国のこだま",
    summary:
      "不名誉な学者が、長い間失われた王朝の廃墟の下に隠された古代の写本を発見したとき、彼女は知らずして世界の構造を作り直す一連の出来事を引き起こします。裏切り、贖罪、そして真実の永続する力についての壮大な物語。",
    chapters: [
      "割れた封印", "学者の恥辱", "廃墟のささやき",
      "最初の暗号", "羊皮紙の血", "隠れた法廷",
      "旧帝国の影", "アリアの賭け", "名なき派閥",
      "火とインク", "裏切り者の印", "忘れられし者の門",
      "記憶された王国", "最後の碑文", "こだまが戻る",
    ],
    readFirst: "第1章を読む",
    addLibrary: "ライブラリに追加",
    storySummary: "あらすじ",
    chaptersTitle: "章",
    free: "無料",
    coins: "コイン",
    unlock: "アンロック",
    views: "閲覧数",
    translating: "自動翻訳中...",
    chapter: "第",
  },
};

// Fallback: languages without specific translations reuse English
const getT = (lang) =>
  TRANSLATIONS[lang] || TRANSLATIONS["en"];

// Coins cost for locked chapters (chapters 11–15)
const COIN_COSTS = { 11: 3, 12: 3, 13: 5, 14: 5, 15: 8 };

// Chapter release dates
const RELEASE_DATES = [
  "Jan 5, 2025", "Jan 12, 2025", "Jan 19, 2025", "Jan 26, 2025",
  "Feb 2, 2025", "Feb 9, 2025", "Feb 16, 2025", "Feb 23, 2025",
  "Mar 2, 2025", "Mar 9, 2025", "Mar 16, 2025", "Mar 23, 2025",
  "Mar 30, 2025", "Apr 6, 2025", "Apr 13, 2025",
];

// ── Spinner component ─────────────────────────────────────────────────────────
function TranslationLoader({ text }) {
    const { id } = useParams();
  return (
    <div className="flex items-center gap-3 py-6 px-4 justify-center">
      <svg
        className="animate-spin h-5 w-5 text-amber-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor" strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      <span className="text-sm font-medium text-amber-300 tracking-wide animate-pulse">
        {text}
      </span>
    </div>
  );
}

// ── Coin icon ─────────────────────────────────────────────────────────────────
function CoinIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" className="text-amber-400" fill="currentColor" />
      <circle cx="10" cy="10" r="6.5" fill="none" stroke="#92400e" strokeWidth="1" />
      <text
        x="10" y="14"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill="#92400e"
      >
        ₿
      </text>
    </svg>
  );
}

// ── Share button popover ──────────────────────────────────────────────────────
function ShareButton() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-200 backdrop-blur-sm"
      aria-label="Share story"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-400">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}

// ── Language Selector ─────────────────────────────────────────────────────────
const LANG_GROUPS = [
  { groupLabel: "Global Scripts", keys: ["en", "ar", "zh", "es", "fr", "pt", "ru"] },
  { groupLabel: "East & Southeast Asian", keys: ["ja", "ko", "th"] },
  { groupLabel: "Indian Scripts", keys: ["ml", "ta", "hi", "bn", "gu", "kn", "mr", "or", "pa", "te", "ur"] },
];
function LanguageSelector({ currentLang, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === currentLang);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-300">
          <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.992a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.992A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
        </svg>
        <span>{current?.label}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 w-52 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="py-1 max-h-72 overflow-y-auto scrollbar-hide">
  {LANG_GROUPS.map((grp) => (
    <div key={grp.groupLabel}>
      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/25">
        {grp.groupLabel}
      </div>
      {grp.keys.map((k) => {
        const lang = LANGUAGES.find((l) => l.code === k);
        if (!lang) return null;
        return (
          <button
            key={lang.code}
            onClick={() => { onChange(lang.code); setOpen(false); }}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
              lang.code === currentLang
                ? "bg-amber-500/20 text-amber-300"
                : "text-gray-300 hover:bg-white/5"
            }`}
          >
            <span>{lang.label}</span>
            {lang.rtl && <span className="text-xs text-gray-500 ml-auto">RTL</span>}
            {lang.code === currentLang && (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400 ml-auto">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  ))}
</div>
        </div>
      )}
    </div>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div
      className={`bg-white/10 animate-pulse rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

// ── Chapter row ───────────────────────────────────────────────────────────────
function ChapterRow({ index, name, date, locked, coinCost, t, isRTL, lang }) {
  const chapterNumber = index + 1;
  const isChapterNameInChinese = lang === "zh";
  const isChapterNameInJapanese = lang === "ja";

  const chapterLabel =
    isChapterNameInChinese
      ? `${t.chapter}${chapterNumber}章`
      : isChapterNameInJapanese
      ? `${t.chapter}${chapterNumber}章`
      : `${t.chapter} ${chapterNumber}`;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`group flex items-center gap-3 sm:gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer
        ${locked
          ? "opacity-80 hover:opacity-100 hover:bg-white/5"
          : "hover:bg-amber-500/5 hover:border-amber-500/20"
        }
        border border-transparent`}
    >
      {/* Chapter number pill */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold
          ${locked
            ? "bg-gray-700/60 text-gray-500"
            : "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20"
          }`}
      >
        {chapterNumber}
      </div>

      {/* Chapter name */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate leading-snug
            ${locked ? "text-gray-500" : "text-gray-200 group-hover:text-white"}`}
        >
          {chapterLabel} · {name}
        </p>
        <p className="text-xs text-gray-600 mt-0.5">{date}</p>
      </div>

      {/* Badge */}
      <div className="flex-shrink-0">
        {locked ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-900/40 text-amber-400 border border-amber-800/50">
            <CoinIcon className="w-3.5 h-3.5" />
            {coinCost} {t.coins}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-900/30 text-emerald-400 border border-emerald-800/40">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3" aria-hidden="true">
              <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm3.707-9.293a1 1 0 00-1.414-1.414L7 7.586 5.707 6.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {t.free}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main StoryDetail component ────────────────────────────────────────────────
export default function StoryDetail({
  story = {
    title: "Echoes of the Forgotten Kingdom",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
    author: { name: "Aria Voss", avatar: "https://i.pravatar.cc/150?img=47" },
    genre: "Fantasy",
    summary: "", // will be populated from translations
    views: 2847392,
    originalLanguage: "en",
  },
}) {
  const [lang, setLang] = useState("en");
  const [translating, setTranslating] = useState(false);
  const [displayData, setDisplayData] = useState(null);
  const [libraryAdded, setLibraryAdded] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const isRTL = LANGUAGES.find((l) => l.code === lang)?.rtl ?? false;

  // Handle language change with simulated translation delay
  useEffect(() => {
    const needsTranslation = lang !== story.originalLanguage;
    if (needsTranslation) {
      setTranslating(true);
      setDisplayData(null);
      const timer = setTimeout(() => {
        setTranslating(false);
        setDisplayData(getT(lang));
      }, 1400);
      return () => clearTimeout(timer);
    } else {
      setTranslating(false);
      setDisplayData(getT(lang));
    }
  }, [lang, story.originalLanguage]);

  const t = displayData || getT("en");
  const formattedViews = new Intl.NumberFormat().format(story.views);

  // Google Fonts for multi-script support
  useEffect(() => {
    const style = document.createElement("style");
style.textContent = `.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`;
document.head.appendChild(style);
return () => {
  document.head.removeChild(link);
  document.head.removeChild(style);
};
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;500;700&family=Noto+Sans+Devanagari:wght@400;500;700&family=Noto+Sans+Tamil:wght@400;500;700&family=Noto+Sans+Telugu:wght@400;500;700&family=Noto+Sans+Kannada:wght@400;500;700&family=Noto+Sans+Bengali:wght@400;500;700&family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&family=Noto+Sans+Thai:wght@400;500;700&family=Crimson+Pro:wght@400;600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Script-aware font family
  const scriptFont = {
  ml: "'Noto Sans Malayalam', sans-serif",
  hi: "'Noto Sans Devanagari', sans-serif",
  mr: "'Noto Sans Devanagari', sans-serif",
  pa: "'Noto Sans Devanagari', sans-serif",
  gu: "'Noto Sans Devanagari', sans-serif",
  or: "'Noto Sans Devanagari', sans-serif",
  ta: "'Noto Sans Tamil', sans-serif",
  te: "'Noto Sans Telugu', sans-serif",
  kn: "'Noto Sans Kannada', sans-serif",
  bn: "'Noto Sans Bengali', sans-serif",
  ar: "'Noto Naskh Arabic', serif",
  ur: "'Noto Nastaliq Urdu', serif",
  zh: "'Noto Sans SC', sans-serif",
  ja: "'Noto Sans JP', sans-serif",
  ko: "'Noto Sans KR', sans-serif",
  th: "'Noto Sans Thai', sans-serif",
  es: "system-ui, sans-serif",
  fr: "system-ui, sans-serif",
  pt: "system-ui, sans-serif",
  ru: "system-ui, sans-serif",
  en: "inherit",
}[lang] || "inherit";

  return (
    <div
      className="min-h-screen bg-[#080810] text-white"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ fontFamily: scriptFont }}
    >
      {/* ── Top Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#080810]/90 backdrop-blur-xl border-b border-white/5">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Browse</span>
        </button>

        <div className="flex items-center gap-2">
  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-white">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  </div>
  <span className="text-sm font-black tracking-tight text-white">FasLax</span>
</div>

        <LanguageSelector currentLang={lang} onChange={setLang} />
      </nav>

      {/* ── Hero: Blurred cover + crisp art ── */}
      <header className="relative pt-16 overflow-hidden min-h-[420px] sm:min-h-[520px]">
        {/* Full-bleed blurred background */}
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url(${story.coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(32px) brightness(0.3) saturate(1.4)",
          }}
          aria-hidden="true"
        />
        {/* Deep gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#0d0d14]/60 to-[#0d0d14]"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-0">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            {/* Cover art */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="relative w-36 sm:w-44 group">
                <div className="absolute -inset-1 bg-amber-500/20 rounded-2xl blur-md group-hover:bg-amber-500/30 transition-all" aria-hidden="true" />
                <img
                  src={story.coverImage}
                  alt={`Cover art for ${story.title}`}
                  className="relative w-full aspect-[2/3] object-cover rounded-xl shadow-2xl border border-white/10"
                />
              </div>
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0 text-center sm:text-left" dir={isRTL ? "rtl" : "ltr"}>
              {/* Genre badge */}
              <span className="inline-block mb-3 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {story.genre}
              </span>

              {/* Title */}
              {translating ? (
                <div className="mb-3">
                  <Skeleton className="h-7 w-4/5 mb-2" />
                  <Skeleton className="h-7 w-3/5" />
                </div>
              ) : (
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3 text-white" style={{ fontFamily: "'Crimson Pro', Georgia, serif", fontWeight: 600 }}>
                  {t.title}
                </h1>
              )}

              {/* Author */}
              <button className="inline-flex items-center gap-2.5 mb-4 group/author">
                <img
                  src={story.author.avatar}
                  alt={story.author.name}
                  className="w-8 h-8 rounded-full border-2 border-amber-500/40 object-cover"
                />
                <span className="text-sm text-gray-400 group-hover/author:text-amber-300 transition-colors">
                  {story.author.name}
                </span>
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gray-600 group-hover/author:text-amber-400 transition-colors">
                  <path fillRule="evenodd" d="M4.72 3.22a.75.75 0 011.06 1.06L2.56 7.5h10.69a.75.75 0 010 1.5H2.56l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.5a.75.75 0 010-1.06l4.5-4.5z" clipRule="evenodd" transform="rotate(180 8 8)" />
                </svg>
              </button>

              {/* Views */}
              <div className="flex items-center gap-1.5 justify-center sm:justify-start text-gray-500 text-sm mb-6">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-600" aria-hidden="true">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>{formattedViews} {t.views}</span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition-all duration-200">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  {t.readFirst}
                </button>

                <button
                  onClick={() => setLibraryAdded((v) => !v)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 active:scale-95
                    ${libraryAdded
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                    }`}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform ${libraryAdded ? "scale-110" : ""}`} aria-hidden="true">
                    {libraryAdded ? (
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 010 1.414l-2.293 2.293H8a1 1 0 110 2H4a1 1 0 01-1-1V4zm13 0a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L16 9.586V4z" clipRule="evenodd" />
                    ) : (
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    )}
                  </svg>
                  {t.addLibrary}
                </button>

                <ShareButton />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">

        {/* Summary section */}
        <section className="mt-10 mb-8" aria-labelledby="summary-heading">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 bg-amber-500 rounded-full" aria-hidden="true" />
            <h2
              id="summary-heading"
              className="text-base font-bold text-white uppercase tracking-wider"
            >
              {t.storySummary}
            </h2>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 sm:p-6">
            {translating ? (
              <TranslationLoader text={getT(lang).translating || "Auto-translating..."} />
            ) : (
              <>
                <p
                  className={`text-gray-300 leading-relaxed text-sm sm:text-base transition-all duration-300 ${
                    summaryExpanded ? "" : "line-clamp-4"
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {t.summary}
                </p>
                <button
                  onClick={() => setSummaryExpanded((v) => !v)}
                  className="mt-3 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wide"
                >
                  {summaryExpanded ? "Show less ↑" : "Read more ↓"}
                </button>
              </>
            )}
          </div>
        </section>

        {/* Chapters section */}
        <section aria-labelledby="chapters-heading">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-amber-500 rounded-full" aria-hidden="true" />
              <h2
                id="chapters-heading"
                className="text-base font-bold text-white uppercase tracking-wider"
              >
                {t.chaptersTitle}
              </h2>
            </div>
            <span className="text-xs text-gray-600 font-medium">
              15 {t.chaptersTitle}
            </span>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
            {/* Table header */}
            <div
              className="flex items-center gap-3 sm:gap-4 px-4 py-2.5 border-b border-white/[0.06] text-xs font-semibold text-gray-600 uppercase tracking-widest"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="w-9 text-center">#</div>
              <div className="flex-1">{t.chaptersTitle}</div>
              <div className="hidden sm:block w-24 text-right">Date</div>
              <div className="w-24 text-right">Access</div>
            </div>

            {/* Chapter rows */}
            {translating ? (
              <div className="px-4 py-6 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 flex-shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-6 w-20 flex-shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {t.chapters.map((name, i) => (
                  <ChapterRow
                    key={i}
                    index={i}
                    name={name}
                    date={RELEASE_DATES[i]}
                    locked={i >= 10}
                    coinCost={COIN_COSTS[i + 1]}
                    t={t}
                    isRTL={isRTL}
                    lang={lang}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Paywall upsell banner */}
          <div className="mt-4 flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-900/30 to-amber-800/10 border border-amber-700/30">
            <div className="flex-shrink-0">
              <CoinIcon className="w-10 h-10" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-300">
                Unlock premium chapters
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Chapters 11–15 require coins. Get 50 coins for ₹49.
              </p>
            </div>
            <button className="ml-auto flex-shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black text-xs font-bold transition-all">
              Get Coins
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}