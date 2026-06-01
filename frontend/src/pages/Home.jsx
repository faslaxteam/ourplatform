import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Globe, ChevronDown, PenLine, User, Star,
  Eye, BookOpen, Flame, Sparkles, ChevronLeft, ChevronRight,
  Languages, X, Menu, TrendingUp, Clock, Heart
} from "lucide-react";

// ─────────────────────────────────────────────
// 1. LANGUAGE CONFIG
// ─────────────────────────────────────────────

const LANGUAGES = {
  en:  { label: "English",    script: "Latin",      dir: "ltr", fontClass: "font-en" },
  ar:  { label: "العربية",    script: "Arabic",     dir: "rtl", fontClass: "font-ar" },
  zh:  { label: "中文",        script: "Chinese",    dir: "ltr", fontClass: "font-zh" },
  ml:  { label: "മലയാളം",     script: "Malayalam",  dir: "ltr", fontClass: "font-ml" },
  ta:  { label: "தமிழ்",      script: "Tamil",      dir: "ltr", fontClass: "font-ta" },
  hi:  { label: "हिन्दी",     script: "Devanagari", dir: "ltr", fontClass: "font-hi" },
  bn:  { label: "বাংলা",      script: "Bengali",    dir: "ltr", fontClass: "font-bn" },
  gu:  { label: "ગુજરાતી",   script: "Gujarati",   dir: "ltr", fontClass: "font-gu" },
  kn:  { label: "ಕನ್ನಡ",     script: "Kannada",    dir: "ltr", fontClass: "font-kn" },
  mr:  { label: "मराठी",      script: "Devanagari", dir: "ltr", fontClass: "font-mr" },
  or:  { label: "ଓଡ଼ିଆ",     script: "Odia",       dir: "ltr", fontClass: "font-or" },
  pa:  { label: "ਪੰਜਾਬੀ",    script: "Gurmukhi",   dir: "ltr", fontClass: "font-pa" },
  te:  { label: "తెలుగు",     script: "Telugu",     dir: "ltr", fontClass: "font-te" },
  ur:  { label: "اردو",       script: "Nastaliq",   dir: "rtl", fontClass: "font-ur" },
  es: { label: "Español",   script: "Latin",    dir: "ltr", fontClass: "font-es" },
fr: { label: "Français",  script: "Latin",    dir: "ltr", fontClass: "font-fr" },
pt: { label: "Português", script: "Latin",    dir: "ltr", fontClass: "font-pt" },
ja: { label: "日本語",     script: "Japanese", dir: "ltr", fontClass: "font-ja" },
ko: { label: "한국어",     script: "Korean",   dir: "ltr", fontClass: "font-ko" },
th: { label: "ภาษาไทย",  script: "Thai",     dir: "ltr", fontClass: "font-th" },
ru: { label: "Русский",   script: "Cyrillic", dir: "ltr", fontClass: "font-ru" },
};

const LANG_GROUPS = [
  { groupLabel: "Global Scripts", keys: ["en", "ar", "zh", "es", "fr", "pt", "ru"] },
  { groupLabel: "East & Southeast Asian", keys: ["ja", "ko", "th"] },
  { groupLabel: "Indian Scripts", keys: ["ml", "ta", "hi", "bn", "gu", "kn", "mr", "or", "pa", "te", "ur"] },
];

// ─────────────────────────────────────────────
// 2. TRANSLATIONS (UI strings)
// ─────────────────────────────────────────────
const T = {
  en: {
    home: "Home", browse: "Browse", write: "Write", login: "Login",
    searchPlaceholder: "Search stories, authors...",
    trending: "Trending Stories", newArrivals: "New Arrivals",
    featuredTitle: "Discover Worlds Without Borders",
    featuredSub: "Read stories from every language, instantly translated to yours.",
    readNow: "Read Now", addToList: "Add to List",
    originalIn: "Originally in", views: "Views",
    genres: { all: "All", romance: "Romance", fantasy: "Fantasy", horror: "Horror", thriller: "Thriller", scifi: "Sci-Fi", drama: "Drama" },
    autoTranslating: "Auto-translating to",
    topPicks: "Top Picks For You", continueReading: "Continue Reading",
    filterBy: "Filter by Language", seeAll: "See All",
  },
  ar: {
    home: "الرئيسية", browse: "تصفح", write: "اكتب", login: "تسجيل الدخول",
    searchPlaceholder: "ابحث عن قصص، مؤلفين...",
    trending: "القصص الرائجة", newArrivals: "وصل حديثاً",
    featuredTitle: "اكتشف عوالم بلا حدود",
    featuredSub: "اقرأ قصصاً من كل لغة، مترجمة فوراً إلى لغتك.",
    readNow: "اقرأ الآن", addToList: "أضف إلى القائمة",
    originalIn: "الأصل بالـ", views: "مشاهدة",
    genres: { all: "الكل", romance: "رومانسي", fantasy: "خيال", horror: "رعب", thriller: "إثارة", scifi: "خيال علمي", drama: "دراما" },
    autoTranslating: "ترجمة تلقائية إلى",
    topPicks: "مختارات خاصة لك", continueReading: "تابع القراءة",
    filterBy: "تصفية حسب اللغة", seeAll: "عرض الكل",
  },
  zh: {
    home: "首页", browse: "浏览", write: "写作", login: "登录",
    searchPlaceholder: "搜索故事、作者...",
    trending: "热门故事", newArrivals: "最新上架",
    featuredTitle: "跨越语言，探索世界",
    featuredSub: "阅读来自各种语言的故事，即时翻译成您的语言。",
    readNow: "立即阅读", addToList: "加入书单",
    originalIn: "原文语言", views: "阅读量",
    genres: { all: "全部", romance: "浪漫", fantasy: "奇幻", horror: "恐怖", thriller: "惊悚", scifi: "科幻", drama: "剧情" },
    autoTranslating: "自动翻译为",
    topPicks: "为您推荐", continueReading: "继续阅读",
    filterBy: "按语言筛选", seeAll: "查看全部",
  },
  ml: {
    home: "ഹോം", browse: "ബ്രൗസ്", write: "എഴുതുക", login: "ലോഗിൻ",
    searchPlaceholder: "കഥകൾ, എഴുത്തുകാർ...",
    trending: "ട്രെൻഡിങ് കഥകൾ", newArrivals: "പുതിയ വരവ്",
    featuredTitle: "അതിർത്തികളില്ലാത്ത ലോകങ്ങൾ കണ്ടെത്തുക",
    featuredSub: "ഏത് ഭാഷയിലെ കഥകളും നിങ്ങളുടെ ഭാഷയിൽ വായിക്കൂ.",
    readNow: "ഇപ്പോൾ വായിക്കൂ", addToList: "ലിസ്റ്റിൽ ചേർക്കൂ",
    originalIn: "മൂലഭാഷ", views: "കാഴ്ചകൾ",
    genres: { all: "എല്ലാം", romance: "പ്രണയം", fantasy: "ഫാന്റസി", horror: "ഭീതി", thriller: "ത്രില്ലർ", scifi: "ശാസ്ത്രകഥ", drama: "നാടകം" },
    autoTranslating: "സ്വയം പരിഭാഷ:",
    topPicks: "നിങ്ങൾക്കായി", continueReading: "വായന തുടരുക",
    filterBy: "ഭാഷ അനുസരിച്ച്", seeAll: "എല്ലാം കാണൂ",
  },
  ta: {
    home: "முகப்பு", browse: "உலாவு", write: "எழுது", login: "உள்நுழை",
    searchPlaceholder: "கதைகள், ஆசிரியர்கள்...",
    trending: "பிரபலமான கதைகள்", newArrivals: "புதிய வருகை",
    featuredTitle: "எல்லைகளற்ற உலகங்களை கண்டறியுங்கள்",
    featuredSub: "எந்த மொழியிலும் கதைகள் படிக்கலாம், உங்கள் மொழியில்.",
    readNow: "இப்போது படி", addToList: "பட்டியலில் சேர்",
    originalIn: "மூல மொழி", views: "காட்சிகள்",
    genres: { all: "அனைத்தும்", romance: "காதல்", fantasy: "கற்பனை", horror: "பயமுறுத்தல்", thriller: "சஞ்சலம்", scifi: "அறிவியல்", drama: "நாடகம்" },
    autoTranslating: "தானாக மொழிபெயர்ப்பு:",
    topPicks: "உங்களுக்கான தேர்வுகள்", continueReading: "படிப்பை தொடர்",
    filterBy: "மொழி வடிகட்டு", seeAll: "அனைத்தும் பார்",
  },
  hi: {
    home: "होम", browse: "ब्राउज़", write: "लिखें", login: "लॉगिन",
    searchPlaceholder: "कहानियाँ, लेखक खोजें...",
    trending: "ट्रेंडिंग कहानियाँ", newArrivals: "नई आमद",
    featuredTitle: "सीमाओं से परे दुनियाएँ खोजें",
    featuredSub: "हर भाषा की कहानियाँ, आपकी भाषा में पढ़ें।",
    readNow: "अभी पढ़ें", addToList: "सूची में जोड़ें",
    originalIn: "मूल भाषा", views: "व्यूज़",
    genres: { all: "सभी", romance: "रोमांस", fantasy: "फैंटेसी", horror: "हॉरर", thriller: "थ्रिलर", scifi: "साइ-फाई", drama: "नाटक" },
    autoTranslating: "स्वत: अनुवाद हो रहा है",
    topPicks: "आपके लिए चुने गए", continueReading: "पढ़ना जारी रखें",
    filterBy: "भाषा से फ़िल्टर करें", seeAll: "सभी देखें",
  },
  bn: {
    home: "হোম", browse: "ব্রাউজ", write: "লিখুন", login: "লগইন",
    searchPlaceholder: "গল্প, লেখক খুঁজুন...",
    trending: "ট্রেন্ডিং গল্প", newArrivals: "নতুন আগমন",
    featuredTitle: "সীমানা ছাড়িয়ে জগৎ আবিষ্কার করুন",
    featuredSub: "প্রতিটি ভাষার গল্প, আপনার ভাষায় পড়ুন।",
    readNow: "এখনই পড়ুন", addToList: "তালিকায় যোগ করুন",
    originalIn: "মূল ভাষা", views: "ভিউ",
    genres: { all: "সব", romance: "রোমান্স", fantasy: "ফ্যান্টাসি", horror: "হরর", thriller: "থ্রিলার", scifi: "সায়েন্স ফিকশন", drama: "নাটক" },
    autoTranslating: "স্বয়ংক্রিয় অনুবাদ হচ্ছে",
    topPicks: "আপনার জন্য পিক", continueReading: "পড়া চালিয়ে যান",
    filterBy: "ভাষা দিয়ে ফিল্টার", seeAll: "সব দেখুন",
  },
  gu: {
    home: "હોમ", browse: "બ્રાઉઝ", write: "લખો", login: "લૉગિન",
    searchPlaceholder: "વાર્તાઓ, લેખક શોધો...",
    trending: "ટ્રેન્ડિંગ વાર્તાઓ", newArrivals: "નવી આવક",
    featuredTitle: "સીમાઓ વિના વિશ્વ શોધો",
    featuredSub: "દરેક ભાષાની વાર્તાઓ, તમારી ભાષામાં વાંચો.",
    readNow: "અત્યારે વાંચો", addToList: "સૂચિમાં ઉમેરો",
    originalIn: "મૂળ ભાષા", views: "વ્યૂઝ",
    genres: { all: "બધા", romance: "રોમાન્સ", fantasy: "ફેન્ટસી", horror: "હૉરર", thriller: "થ્રિલર", scifi: "વૈજ્ઞાનિક", drama: "નાટક" },
    autoTranslating: "સ્વયં અનુવાદ:",
    topPicks: "તમારા માટે પસંદ", continueReading: "વાંચવાનું ચાલુ",
    filterBy: "ભાષા ફિલ્ટર", seeAll: "બધા જુઓ",
  },
  kn: {
    home: "ಮುಖಪುಟ", browse: "ಬ್ರೌಸ್", write: "ಬರೆಯಿರಿ", login: "ಲಾಗಿನ್",
    searchPlaceholder: "ಕಥೆಗಳು, ಲೇಖಕರು...",
    trending: "ಟ್ರೆಂಡಿಂಗ್ ಕಥೆಗಳು", newArrivals: "ಹೊಸ ಆಗಮನ",
    featuredTitle: "ಗಡಿಯಿಲ್ಲದ ಪ್ರಪಂಚ ಅನ್ವೇಷಿಸಿ",
    featuredSub: "ಪ್ರತಿ ಭಾಷೆಯ ಕಥೆಗಳು, ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಓದಿ.",
    readNow: "ಈಗ ಓದಿ", addToList: "ಪಟ್ಟಿಗೆ ಸೇರಿಸಿ",
    originalIn: "ಮೂಲ ಭಾಷೆ", views: "ವೀಕ್ಷಣೆಗಳು",
    genres: { all: "ಎಲ್ಲಾ", romance: "ರೋಮಾನ್ಸ್", fantasy: "ಫ್ಯಾಂಟಸಿ", horror: "ಭಯ", thriller: "ರೋಮಾಂಚ", scifi: "ವಿಜ್ಞಾನ ಕಥೆ", drama: "ನಾಟಕ" },
    autoTranslating: "ಸ್ವಯಂ ಅನುವಾದ:",
    topPicks: "ನಿಮಗಾಗಿ ಆಯ್ಕೆಗಳು", continueReading: "ಓದುವುದನ್ನು ಮುಂದುವರಿಸಿ",
    filterBy: "ಭಾಷೆ ಫಿಲ್ಟರ್", seeAll: "ಎಲ್ಲಾ ನೋಡಿ",
  },
  mr: {
    home: "मुखपृष्ठ", browse: "ब्राउझ", write: "लिहा", login: "लॉगिन",
    searchPlaceholder: "कथा, लेखक शोधा...",
    trending: "ट्रेंडिंग कथा", newArrivals: "नवे आगमन",
    featuredTitle: "सीमांपलीकडील जग शोधा",
    featuredSub: "प्रत्येक भाषेतील कथा, आपल्या भाषेत वाचा.",
    readNow: "आता वाचा", addToList: "यादीत जोडा",
    originalIn: "मूळ भाषा", views: "व्ह्यूज",
    genres: { all: "सर्व", romance: "रोमान्स", fantasy: "फँटसी", horror: "भयकथा", thriller: "थ्रिलर", scifi: "विज्ञानकथा", drama: "नाटक" },
    autoTranslating: "स्वयं भाषांतर:",
    topPicks: "तुमच्यासाठी निवड", continueReading: "वाचन सुरू ठेवा",
    filterBy: "भाषेनुसार फिल्टर", seeAll: "सर्व पाहा",
  },
  or: {
    home: "ହୋମ", browse: "ବ୍ରାଉଜ", write: "ଲେଖ", login: "ଲଗଇନ",
    searchPlaceholder: "କାହାଣୀ, ଲେଖକ ଖୋଜ...",
    trending: "ଟ୍ରେଣ୍ଡିଂ କାହାଣୀ", newArrivals: "ନୂଆ ଆଗମନ",
    featuredTitle: "ସୀମା ବିନା ଦୁନିଆ ଆବିଷ୍କାର କର",
    featuredSub: "ଯେ କୌଣସି ଭାଷାର କାହାଣୀ, ଆପଣଙ୍କ ଭାଷାରେ ପଢ଼ନ୍ତୁ।",
    readNow: "ଏବେ ପଢ଼ନ୍ତୁ", addToList: "ତାଲିକାରେ ଯୋଡ଼ନ୍ତୁ",
    originalIn: "ମୂଳ ଭାଷା", views: "ଦୃଶ୍ୟ",
    genres: { all: "ସବୁ", romance: "ପ୍ରେମ", fantasy: "ଫ୍ୟାଣ୍ଟାସି", horror: "ଭୟ", thriller: "ଥ୍ରିଲର", scifi: "ବିଜ୍ଞାନ", drama: "ନାଟ୍ୟ" },
    autoTranslating: "ଅଟୋ ଅନୁବାଦ:",
    topPicks: "ଆପଣଙ୍କ ପାଇଁ", continueReading: "ପଢ଼ା ଜାରି ରଖ",
    filterBy: "ଭାଷା ଫିଲ୍ଟର", seeAll: "ସବୁ ଦେଖ",
  },
  pa: {
    home: "ਹੋਮ", browse: "ਬ੍ਰਾਊਜ਼", write: "ਲਿਖੋ", login: "ਲੌਗਿਨ",
    searchPlaceholder: "ਕਹਾਣੀਆਂ, ਲੇਖਕ ਖੋਜੋ...",
    trending: "ਟ੍ਰੈਂਡਿੰਗ ਕਹਾਣੀਆਂ", newArrivals: "ਨਵੀਆਂ ਆਮਦਾਂ",
    featuredTitle: "ਸੀਮਾਵਾਂ ਤੋਂ ਪਰੇ ਸੰਸਾਰ ਖੋਜੋ",
    featuredSub: "ਹਰ ਭਾਸ਼ਾ ਦੀਆਂ ਕਹਾਣੀਆਂ, ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਪੜ੍ਹੋ।",
    readNow: "ਹੁਣੇ ਪੜ੍ਹੋ", addToList: "ਸੂਚੀ ਵਿੱਚ ਜੋੜੋ",
    originalIn: "ਮੂਲ ਭਾਸ਼ਾ", views: "ਵਿਊਜ਼",
    genres: { all: "ਸਭ", romance: "ਰੋਮਾਂਸ", fantasy: "ਫੈਂਟਸੀ", horror: "ਡਰਾਵਣਾ", thriller: "ਥ੍ਰਿਲਰ", scifi: "ਵਿਗਿਆਨ", drama: "ਨਾਟਕ" },
    autoTranslating: "ਆਟੋ ਅਨੁਵਾਦ:",
    topPicks: "ਤੁਹਾਡੇ ਲਈ ਚੋਣ", continueReading: "ਪੜ੍ਹਨਾ ਜਾਰੀ ਰੱਖੋ",
    filterBy: "ਭਾਸ਼ਾ ਫਿਲਟਰ", seeAll: "ਸਭ ਦੇਖੋ",
  },
  te: {
    home: "హోమ్", browse: "బ్రౌజ్", write: "రాయండి", login: "లాగిన్",
    searchPlaceholder: "కథలు, రచయితలు...",
    trending: "ట్రెండింగ్ కథలు", newArrivals: "కొత్త రాకలు",
    featuredTitle: "హద్దులు లేని ప్రపంచాలను కనుగొనండి",
    featuredSub: "ప్రతి భాషలో కథలు, మీ భాషలో చదవండి.",
    readNow: "ఇప్పుడు చదవండి", addToList: "జాబితాకు జోడించు",
    originalIn: "మూల భాష", views: "వీక్షణలు",
    genres: { all: "అన్నీ", romance: "రొమాన్స్", fantasy: "ఫాంటసీ", horror: "భయం", thriller: "థ్రిల్లర్", scifi: "సైన్స్ ఫిక్షన్", drama: "నాటకం" },
    autoTranslating: "స్వయంచాలక అనువాదం:",
    topPicks: "మీకోసం ఎంచుకున్నవి", continueReading: "చదవడం కొనసాగించు",
    filterBy: "భాష వడపోత", seeAll: "అన్నీ చూడండి",
  },
  ur: {
    home: "ہوم", browse: "براؤز", write: "لکھیں", login: "لاگ ان",
    searchPlaceholder: "کہانیاں، مصنف تلاش کریں...",
    trending: "ٹرینڈنگ کہانیاں", newArrivals: "نئی آمد",
    featuredTitle: "حدوں سے پرے دنیاوں کو دریافت کریں",
    featuredSub: "ہر زبان کی کہانیاں، اپنی زبان میں پڑھیں۔",
    readNow: "ابھی پڑھیں", addToList: "فہرست میں شامل کریں",
    originalIn: "اصل زبان", views: "مناظر",
    genres: { all: "سب", romance: "رومانس", fantasy: "تخیل", horror: "خوف", thriller: "سنسنی", scifi: "سائنس فکشن", drama: "ڈراما" },
    autoTranslating: "خودکار ترجمہ:",
    topPicks: "آپ کے لیے انتخاب", continueReading: "پڑھنا جاری رکھیں",
    filterBy: "زبان سے فلٹر", seeAll: "سب دیکھیں",
  },
  es: {
  home: "Inicio", browse: "Explorar", write: "Escribir", login: "Ingresar",
  searchPlaceholder: "Buscar historias, autores...",
  trending: "Historias en tendencia", newArrivals: "Nuevas llegadas",
  featuredTitle: "Descubre mundos sin fronteras",
  featuredSub: "Lee historias de cualquier idioma, traducidas al tuyo al instante.",
  readNow: "Leer ahora", addToList: "Añadir a la lista",
  originalIn: "Original en", views: "Vistas",
  genres: { all: "Todo", romance: "Romance", fantasy: "Fantasía", horror: "Terror", thriller: "Suspenso", scifi: "Ciencia ficción", drama: "Drama" },
  autoTranslating: "Traduciendo automáticamente a",
  topPicks: "Seleccionado para ti", continueReading: "Continuar leyendo",
  filterBy: "Filtrar por idioma", seeAll: "Ver todo",
},
fr: {
  home: "Accueil", browse: "Parcourir", write: "Écrire", login: "Connexion",
  searchPlaceholder: "Rechercher des histoires, auteurs...",
  trending: "Histoires tendance", newArrivals: "Nouveautés",
  featuredTitle: "Découvrez des mondes sans frontières",
  featuredSub: "Lisez des histoires dans toutes les langues, traduites instantanément.",
  readNow: "Lire maintenant", addToList: "Ajouter à la liste",
  originalIn: "Origine", views: "Vues",
  genres: { all: "Tout", romance: "Romance", fantasy: "Fantaisie", horror: "Horreur", thriller: "Thriller", scifi: "Science-fiction", drama: "Drame" },
  autoTranslating: "Traduction automatique en",
  topPicks: "Sélection pour vous", continueReading: "Continuer la lecture",
  filterBy: "Filtrer par langue", seeAll: "Tout voir",
},
pt: {
  home: "Início", browse: "Explorar", write: "Escrever", login: "Entrar",
  searchPlaceholder: "Buscar histórias, autores...",
  trending: "Histórias em alta", newArrivals: "Novidades",
  featuredTitle: "Descubra mundos sem fronteiras",
  featuredSub: "Leia histórias em qualquer idioma, traduzidas instantaneamente para o seu.",
  readNow: "Ler agora", addToList: "Adicionar à lista",
  originalIn: "Original em", views: "Visualizações",
  genres: { all: "Tudo", romance: "Romance", fantasy: "Fantasia", horror: "Terror", thriller: "Suspense", scifi: "Ficção científica", drama: "Drama" },
  autoTranslating: "Traduzindo automaticamente para",
  topPicks: "Selecionado para você", continueReading: "Continuar lendo",
  filterBy: "Filtrar por idioma", seeAll: "Ver tudo",
},
ja: {
  home: "ホーム", browse: "ブラウズ", write: "書く", login: "ログイン",
  searchPlaceholder: "ストーリー、著者を検索...",
  trending: "人気のストーリー", newArrivals: "新着",
  featuredTitle: "国境のない世界を発見しよう",
  featuredSub: "あらゆる言語のストーリーを、あなたの言語で読もう。",
  readNow: "今すぐ読む", addToList: "リストに追加",
  originalIn: "原語", views: "閲覧数",
  genres: { all: "すべて", romance: "ロマンス", fantasy: "ファンタジー", horror: "ホラー", thriller: "スリラー", scifi: "SF", drama: "ドラマ" },
  autoTranslating: "自動翻訳中:",
  topPicks: "あなたへのおすすめ", continueReading: "読書を続ける",
  filterBy: "言語でフィルター", seeAll: "すべて見る",
},
ko: {
  home: "홈", browse: "탐색", write: "쓰기", login: "로그인",
  searchPlaceholder: "이야기, 작가 검색...",
  trending: "인기 이야기", newArrivals: "신규 작품",
  featuredTitle: "경계 없는 세계를 발견하세요",
  featuredSub: "모든 언어의 이야기를 당신의 언어로 읽어보세요.",
  readNow: "지금 읽기", addToList: "목록에 추가",
  originalIn: "원본 언어", views: "조회수",
  genres: { all: "전체", romance: "로맨스", fantasy: "판타지", horror: "공포", thriller: "스릴러", scifi: "SF", drama: "드라마" },
  autoTranslating: "자동 번역 중:",
  topPicks: "당신을 위한 추천", continueReading: "계속 읽기",
  filterBy: "언어로 필터", seeAll: "전체 보기",
},
th: {
  home: "หน้าแรก", browse: "เรียกดู", write: "เขียน", login: "เข้าสู่ระบบ",
  searchPlaceholder: "ค้นหาเรื่องราว นักเขียน...",
  trending: "เรื่องราวยอดนิยม", newArrivals: "มาใหม่",
  featuredTitle: "ค้นพบโลกที่ไร้พรมแดน",
  featuredSub: "อ่านเรื่องราวจากทุกภาษา แปลเป็นภาษาของคุณได้ทันที",
  readNow: "อ่านเลย", addToList: "เพิ่มในรายการ",
  originalIn: "ต้นฉบับภาษา", views: "ยอดดู",
  genres: { all: "ทั้งหมด", romance: "โรแมนซ์", fantasy: "แฟนตาซี", horror: "สยองขวัญ", thriller: "ระทึกขวัญ", scifi: "นิยายวิทยาศาสตร์", drama: "ดราม่า" },
  autoTranslating: "กำลังแปลอัตโนมัติเป็น",
  topPicks: "แนะนำสำหรับคุณ", continueReading: "อ่านต่อ",
  filterBy: "กรองตามภาษา", seeAll: "ดูทั้งหมด",
},
ru: {
  home: "Главная", browse: "Обзор", write: "Написать", login: "Войти",
  searchPlaceholder: "Поиск историй, авторов...",
  trending: "В тренде", newArrivals: "Новинки",
  featuredTitle: "Открой миры без границ",
  featuredSub: "Читай истории на любом языке, мгновенно переведённые на твой.",
  readNow: "Читать", addToList: "В список",
  originalIn: "Оригинал на", views: "Просмотры",
  genres: { all: "Все", romance: "Романтика", fantasy: "Фэнтези", horror: "Ужасы", thriller: "Триллер", scifi: "Фантастика", drama: "Драма" },
  autoTranslating: "Автоперевод на",
  topPicks: "Подборка для вас", continueReading: "Продолжить чтение",
  filterBy: "Фильтр по языку", seeAll: "Все",
},
};

// ─────────────────────────────────────────────
// 3. MOCK STORIES DATA
// ─────────────────────────────────────────────
const STORIES_DATA = [
  {
    id: 1,
    originalLanguage: "ta",
    genre: "romance",
    rating: 4.8,
    views: "2.4M",
    chapters: 112,
    coverGradient: "from-rose-900 via-pink-800 to-fuchsia-900",
    coverEmoji: "🌺",
    translations: {
      en: { title: "Jasmine in the Rain", author: "Priya Sundaram", summary: "A timeless love story set against the monsoon-soaked streets of Chennai." },
      ta: { title: "மழையில் மல்லிகை", author: "பிரியா சுந்தரம்", summary: "சென்னையின் மழை நனைந்த தெருக்களில் நிகழும் காலமெல்லாம் நிலைக்கும் காதல் கதை." },
      ml: { title: "മഴയിൽ മുല്ല", author: "പ്രിയ സുന്ദരം", summary: "ചെന്നൈയുടെ മഴ നനഞ്ഞ തെരുവുകളിൽ ഒരു ശാശ്വത പ്രണയ കഥ." },
      hi: { title: "बारिश में चमेली", author: "प्रिया सुन्दरम", summary: "चेन्नई की बारिश से भीगी सड़कों पर एक शाश्वत प्रेम कहानी।" },
      ar: { title: "الياسمين في المطر", author: "بريا سوندارام", summary: "قصة حب خالدة تدور في شوارع تشيناي المبللة بالمطر." },
      zh: { title: "雨中茉莉", author: "普里亚·桑达拉姆", summary: "一段发生在金奈雨湿街道的永恒爱情故事。" },
      bn: { title: "বৃষ্টিতে চামেলি", author: "প্রিয়া সুন্দরাম", summary: "চেন্নাইয়ের বৃষ্টিভেজা রাস্তায় এক চিরন্তন প্রেমের গল্প।" },
      te: { title: "వానలో మల్లె", author: "ప్రియా సుందరం", summary: "చెన్నైలోని వర్షసిక్త వీధుల్లో ఒక శాశ్వత ప్రేమ కథ." },
      ur: { title: "بارش میں چنبیلی", author: "پریا سندرم", summary: "چنائی کی بارش میں بھیگی گلیوں میں ایک لازوال محبت کی کہانی۔" },
      es: { title: "Jazmín bajo la lluvia", author: "Priya Sundaram", summary: "Una historia de amor atemporal en las calles empapadas de monzón de Chennai." },
fr: { title: "Jasmin sous la pluie", author: "Priya Sundaram", summary: "Une histoire d'amour intemporelle dans les rues mouillées de Chennai sous la mousson." },
pt: { title: "Jasmim na chuva", author: "Priya Sundaram", summary: "Uma história de amor atemporal nas ruas encharcadas de monção de Chennai." },
ja: { title: "雨の中のジャスミン", author: "プリヤ・スンダラム", summary: "モンスーンに濡れたチェンナイの街を舞台にした、永遠の愛の物語。" },
ko: { title: "빗속의 자스민", author: "프리야 순다람", summary: "몬순으로 젖어든 첸나이 거리를 배경으로 한 시대를 초월한 사랑 이야기." },
th: { title: "มะลิในสายฝน", author: "ปริยา ซุนดารัม", summary: "เรื่องราวความรักอันเหนือกาลเวลาบนถนนชุ่มฝนมรสุมของเมืองเจนไน" },
ru: { title: "Жасмин под дождём", author: "Прия Сундарам", summary: "Вечная история любви на залитых муссонными дождями улицах Ченнаи." },
      default: { title: "Jasmine in the Rain", author: "Priya Sundaram", summary: "A timeless love story set against the monsoon-soaked streets of Chennai." },
    },
  },
  {
    id: 2,
    originalLanguage: "mr",
    genre: "fantasy",
    rating: 4.9,
    views: "5.1M",
    chapters: 87,
    coverGradient: "from-indigo-900 via-violet-800 to-purple-900",
    coverEmoji: "⚔️",
    translations: {
      en: { title: "The Forgotten Kingdom", author: "Rohan Kulkarni", summary: "An epic saga of a warrior who awakens ancient magic to reclaim a stolen throne." },
      mr: { title: "विसरलेलं राज्य", author: "रोहन कुलकर्णी", summary: "एका योद्ध्याची महाकथा जो चोरलेलं सिंहासन परत मिळवण्यासाठी प्राचीन जादू जागवतो." },
      hi: { title: "भूला हुआ राज्य", author: "रोहन कुलकर्णी", summary: "एक योद्धा की महागाथा जो चुराए सिंहासन को पुनः प्राप्त करने के लिए प्राचीन जादू जगाता है।" },
      ta: { title: "மறந்த இராஜ்யம்", author: "ரோஹன் குல்கர்ணி", summary: "திருடப்பட்ட அரியணையை மீட்க பண்டைய மந்திரத்தை விழிப்படைவிக்கும் வீரரின் மகாகாவியம்." },
      ml: { title: "മറന്ന രാജ്യം", author: "രോഹൻ കുൽക്കർണി", summary: "മോഷ്ടിക്കപ്പെട്ട സിംഹാസനം വീണ്ടെടുക്കാൻ പ്രാചീന മന്ത്രം ഉണർത്തുന്ന ഒരു യോദ്ധാവിന്റെ മഹാകഥ." },
      ar: { title: "المملكة المنسية", author: "روهان كولكارني", summary: "ملحمة محارب يوقظ سحراً قديماً لاستعادة عرش مسروق." },
      zh: { title: "被遗忘的王国", author: "罗汉·库尔卡尼", summary: "一名战士唤醒古老魔法，夺回被盗王位的史诗传奇。" },
      bn: { title: "ভুলে যাওয়া রাজ্য", author: "রোহন কুলকার্নি", summary: "একজন যোদ্ধার মহাকাব্য যে চুরি হওয়া সিংহাসন ফিরে পেতে প্রাচীন জাদু জাগায়।" },
      te: { title: "మరచిపోయిన రాజ్యం", author: "రోహన్ కుల్కర్ణి", summary: "దొంగలించబడిన సింహాసనాన్ని తిరిగి పొందేందుకు పురాతన మంత్రాన్ని మేల్కొల్పే యోధుని మహాకావ్యం." },
      ur: { title: "بھولا ہوا سلطنت", author: "روہن کولکرنی", summary: "ایک جنگجو کی مہاکہانی جو چوری شدہ تخت واپس لینے کے لیے قدیم جادو جگاتا ہے۔" },
      es: { title: "El reino olvidado", author: "Rohan Kulkarni", summary: "La saga épica de un guerrero que despierta magia ancestral para reclamar un trono robado." },
fr: { title: "Le royaume oublié", author: "Rohan Kulkarni", summary: "La saga épique d'un guerrier qui éveille une magie ancienne pour reconquérir un trône volé." },
pt: { title: "O reino esquecido", author: "Rohan Kulkarni", summary: "A saga épica de um guerreiro que desperta magia ancestral para reconquistar um trono roubado." },
ja: { title: "忘れられた王国", author: "ロハン・クルカルニ", summary: "盗まれた王位を取り戻すために古代の魔法を目覚めさせた戦士の壮大な物語。" },
ko: { title: "잊혀진 왕국", author: "로한 쿨카르니", summary: "빼앗긴 왕좌를 되찾기 위해 고대 마법을 깨운 전사의 장대한 서사시." },
th: { title: "อาณาจักรที่ถูกลืม", author: "โรฮัน กุลกาณี", summary: "มหากาพย์ของนักรบที่ปลุกพลังเวทมนตร์โบราณเพื่อเรียกคืนบัลลังก์ที่ถูกขโมย" },
ru: { title: "Забытое королевство", author: "Рохан Кулкарни", summary: "Эпическая сага о воине, пробудившем древнюю магию, чтобы вернуть украденный трон." },
      default: { title: "The Forgotten Kingdom", author: "Rohan Kulkarni", summary: "An epic saga of a warrior who awakens ancient magic to reclaim a stolen throne." },
    },
  },
  {
    id: 3,
    originalLanguage: "en",
    genre: "scifi",
    rating: 4.7,
    views: "3.8M",
    chapters: 64,
    coverGradient: "from-cyan-900 via-teal-800 to-emerald-900",
    coverEmoji: "🚀",
    translations: {
      en: { title: "Stellar Drift", author: "Maya Chen", summary: "Humanity's last ship hurtles toward an unknown signal from the edge of the galaxy." },
      hi: { title: "तारों का प्रवाह", author: "माया चेन", summary: "मानवता का आखिरी जहाज आकाशगंगा के किनारे से एक अज्ञात संकेत की ओर बढ़ता है।" },
      ml: { title: "നക്ഷത്ര ഒഴുക്ക്", author: "മായ ചെൻ", summary: "ക്ഷീരപഥത്തിന്റെ അറ്റത്ത് നിന്ന് ഒരു അജ്ഞാത സിഗ്നലിലേക്ക് മനുഷ്യരാശിയുടെ അവസാന കപ്പൽ കുതിക്കുന്നു." },
      ta: { title: "விண்மீன் ஓட்டம்", author: "மாயா சென்", summary: "பால்வீதியின் விளிம்பிலிருந்து அறியப்படாத சமிக்ஞைக்கு மனிதகுலத்தின் கடைசி கப்பல் விரைகிறது." },
      ar: { title: "الانجراف النجمي", author: "مايا تشن", summary: "آخر سفينة للبشرية تنطلق نحو إشارة مجهولة من حافة المجرة." },
      zh: { title: "星际漂流", author: "陈玛雅", summary: "人类最后一艘飞船向银河系边缘的神秘信号全速飞驰。" },
      bn: { title: "তারার প্রবাহ", author: "মায়া চেন", summary: "মানবতার শেষ জাহাজ ছায়াপথের প্রান্ত থেকে একটি অজানা সংকেতের দিকে ছুটছে।" },
      te: { title: "నక్షత్ర ప్రవాహం", author: "మాయా చెన్", summary: "గెలాక్సీ అంచు నుండి తెలియని సిగ్నల్ వైపు మానవాళి చివరి నౌక వేగంగా వెళ్తోంది." },
      ur: { title: "ستاروں کی رو", author: "مایا چین", summary: "کہکشاں کے کنارے سے ایک نامعلوم اشارے کی طرف انسانیت کا آخری جہاز تیزی سے بڑھ رہا ہے۔" },
      es: { title: "Deriva estelar", author: "Maya Chen", summary: "La última nave de la humanidad se lanza hacia una señal desconocida desde el borde de la galaxia." },
fr: { title: "Dérive stellaire", author: "Maya Chen", summary: "Le dernier vaisseau de l'humanité fonce vers un signal inconnu venu du bord de la galaxie." },
pt: { title: "Deriva estelar", author: "Maya Chen", summary: "A última nave da humanidade avança velozmente em direção a um sinal desconhecido da borda da galáxia." },
ja: { title: "星の漂流", author: "マヤ・チェン", summary: "人類最後の宇宙船が、銀河の端から届く謎の信号へと突き進む。" },
ko: { title: "항성 표류", author: "마야 천", summary: "인류의 마지막 우주선이 은하계 끝에서 오는 미지의 신호를 향해 질주한다." },
th: { title: "ล่องลอยในดวงดาว", author: "มายา เฉิน", summary: "ยานพาหนะสุดท้ายของมนุษยชาติพุ่งไปสู่สัญญาณลึกลับจากขอบของกาแล็กซี" },
ru: { title: "Звёздный дрейф", author: "Майя Чен", summary: "Последний корабль человечества мчится к неизвестному сигналу с края галактики." },
      default: { title: "Stellar Drift", author: "Maya Chen", summary: "Humanity's last ship hurtles toward an unknown signal from the edge of the galaxy." },
    },
  },
  {
    id: 4,
    originalLanguage: "te",
    genre: "horror",
    rating: 4.6,
    views: "1.9M",
    chapters: 45,
    coverGradient: "from-red-950 via-red-900 to-stone-900",
    coverEmoji: "👁️",
    translations: {
      en: { title: "The Seventh Night", author: "Arjun Reddy", summary: "A folklore curse awakens in a remote village, claiming one soul every seven nights." },
      te: { title: "ఏడవ రాత్రి", author: "అర్జున్ రెడ్డి", summary: "ఒక మారుమూల గ్రామంలో జానపద శాపం మేల్కొని ప్రతి ఏడు రాత్రులకు ఒక ఆత్మను తీసుకుంటుంది." },
      ml: { title: "ഏഴാം രാത്രി", author: "അർജുൻ റെഡ്ഡി", summary: "ഒരു വിദൂര ഗ്രാമത്തിൽ ഒരു നാടോടി ശാപം ഉണർന്ന്, ഏഴ് രാത്രി കൂടുമ്പോഴൊരു ആത്മാവിനെ അവകാശപ്പെടുന്നു." },
      ta: { title: "ஏழாவது இரவு", author: "அர்ஜுன் ரெட்டி", summary: "தொலைதூர கிராமத்தில் நாட்டுப்புற சாபம் விழித்து, ஒவ்வொரு ஏழு இரவுகளுக்கும் ஒரு ஆன்மாவை கோருகிறது." },
      hi: { title: "सातवीं रात", author: "अर्जुन रेड्डी", summary: "एक दूरदराज गाँव में लोक-श्राप जागता है और हर सात रात एक आत्मा का दावा करता है।" },
      ar: { title: "الليلة السابعة", author: "أرجون ريدي", summary: "لعنة فلكلورية تستيقظ في قرية نائية، تطالب بروح واحدة كل سبع ليالٍ." },
      zh: { title: "第七夜", author: "阿尔琼·雷迪", summary: "一个偏远村庄里，民间诅咒苏醒，每隔七夜夺走一个灵魂。" },
      bn: { title: "সপ্তম রাত", author: "অর্জুন রেড্ডি", summary: "একটি প্রত্যন্ত গ্রামে লোককথার অভিশাপ জেগে ওঠে, প্রতি সাত রাতে একটি আত্মা দাবি করে।" },
      ur: { title: "ساتویں رات", author: "ارجن ریڈی", summary: "ایک دور دراز گاؤں میں لوک کہانی کی لعنت جاگ اٹھتی ہے، ہر سات راتوں میں ایک روح لیتی ہے۔" },
      es: { title: "La séptima noche", author: "Arjun Reddy", summary: "Una maldición folclórica despierta en un pueblo remoto, reclamando un alma cada siete noches." },
fr: { title: "La septième nuit", author: "Arjun Reddy", summary: "Une malédiction folklorique s'éveille dans un village isolé, réclamant une âme toutes les sept nuits." },
pt: { title: "A sétima noite", author: "Arjun Reddy", summary: "Uma maldição folclórica desperta em uma aldeia remota, reivindicando uma alma a cada sete noites." },
ja: { title: "七夜目", author: "アルジュン・レッディ", summary: "辺境の村に民間伝承の呪いが目覚め、七夜ごとにひとつの魂を奪っていく。" },
ko: { title: "일곱 번째 밤", author: "아르준 레디", summary: "외딴 마을에서 민간 저주가 깨어나 일곱 밤마다 한 영혼씩 앗아간다." },
th: { title: "คืนที่เจ็ด", author: "อาร์จุน เรดดี้", summary: "คำสาปพื้นบ้านตื่นขึ้นในหมู่บ้านห่างไกล คร่าชีวิตทุกเจ็ดคืน" },
ru: { title: "Седьмая ночь", author: "Арджун Редди", summary: "Фольклорное проклятие пробуждается в далёкой деревне, забирая одну душу каждые семь ночей." },
      default: { title: "The Seventh Night", author: "Arjun Reddy", summary: "A folklore curse awakens in a remote village, claiming one soul every seven nights." },
    },
  },
  {
    id: 5,
    originalLanguage: "hi",
    genre: "thriller",
    rating: 4.5,
    views: "4.2M",
    chapters: 99,
    coverGradient: "from-amber-900 via-orange-900 to-red-900",
    coverEmoji: "🔍",
    translations: {
      en: { title: "Shadows in Delhi", author: "Kavita Sharma", summary: "A journalist unravels a political conspiracy that reaches the highest corridors of power." },
      hi: { title: "दिल्ली की परछाईं", author: "कविता शर्मा", summary: "एक पत्रकार एक राजनीतिक षड्यंत्र को उजागर करती है जो सत्ता के सर्वोच्च गलियारों तक पहुँचता है।" },
      ml: { title: "ഡൽഹിയിലെ നിഴലുകൾ", author: "കവിത ശർമ", summary: "ഒരു മാധ്യമ പ്രവർത്തക ഏറ്റവും ഉയർന്ന അധികാര ഇടനാഴികൾ വരെ എത്തുന്ന ഒരു രാഷ്ട്രീയ ഗൂഢാലോചന വെളിപ്പെടുത്തുന്നു." },
      ta: { title: "டெல்லியில் நிழல்கள்", author: "கவிதா சர்மா", summary: "ஒரு பத்திரிகையாளர் அதிகார மிக உயர்ந்த அரங்குகள் வரை பரவும் ஒரு அரசியல் சதியை கண்டுபிடிக்கிறாள்." },
      ar: { title: "ظلال في دلهي", author: "كافيتا شارما", summary: "صحفية تكشف مؤامرة سياسية تمتد إلى أعلى مستويات السلطة." },
      zh: { title: "德里的阴影", author: "卡维塔·夏尔马", summary: "一名记者揭开一场延伸至最高权力走廊的政治阴谋。" },
      bn: { title: "দিল্লির ছায়া", author: "কবিতা শর্মা", summary: "একজন সাংবাদিক একটি রাজনৈতিক ষড়যন্ত্র উন্মোচন করেন যা ক্ষমতার সর্বোচ্চ করিডোরে পৌঁছায়।" },
      te: { title: "ఢిల్లీలో నీడలు", author: "కవిత శర్మ", summary: "ఒక జర్నలిస్ట్ అధికారం యొక్క అత్యున్నత కారిడార్ల వరకు చేరే రాజకీయ కుట్రను వెల్లడిస్తుంది." },
      ur: { title: "دہلی کے سائے", author: "کویتا شرما", summary: "ایک صحافی ایک سیاسی سازش کو اجاگر کرتی ہے جو اقتدار کے اعلیٰ ترین ایوانوں تک پہنچتی ہے۔" },
      es: { title: "Sombras en Delhi", author: "Kavita Sharma", summary: "Una periodista descubre una conspiración política que llega a los más altos corredores del poder." },
fr: { title: "Ombres à Delhi", author: "Kavita Sharma", summary: "Une journaliste dévoile un complot politique qui atteint les plus hautes sphères du pouvoir." },
pt: { title: "Sombras em Delhi", author: "Kavita Sharma", summary: "Uma jornalista desvenda uma conspiração política que chega aos mais altos corredores do poder." },
ja: { title: "デリーの影", author: "カヴィタ・シャルマ", summary: "記者が権力の最高位にまで及ぶ政治的陰謀を暴いていく。" },
ko: { title: "델리의 그림자", author: "카비타 샤르마", summary: "한 기자가 권력의 최고 중심부까지 뻗어 있는 정치적 음모를 파헤친다." },
th: { title: "เงาในเดลี", author: "กาวิตา ชาร์มา", summary: "นักข่าวหญิงเปิดโปงสมคบคิดทางการเมืองที่แทรกซึมถึงระดับสูงสุดของอำนาจ" },
ru: { title: "Тени Дели", author: "Кавита Шарма", summary: "Журналистка раскрывает политический заговор, достигающий высших коридоров власти." },
      default: { title: "Shadows in Delhi", author: "Kavita Sharma", summary: "A journalist unravels a political conspiracy that reaches the highest corridors of power." },
    },
  },
  {
    id: 6,
    originalLanguage: "bn",
    genre: "drama",
    rating: 4.7,
    views: "1.6M",
    chapters: 58,
    coverGradient: "from-sky-900 via-blue-800 to-indigo-900",
    coverEmoji: "🎭",
    translations: {
      en: { title: "Monsoon Letters", author: "Ananya Das", summary: "Two estranged siblings reconnect through handwritten letters after twenty years of silence." },
      bn: { title: "বর্ষার চিঠি", author: "অনন্যা দাস", summary: "দুই বিচ্ছিন্ন ভাই-বোন বিশ বছরের নীরবতার পর হাতে লেখা চিঠির মাধ্যমে পুনরায় সংযুক্ত হয়।" },
      ml: { title: "മഴക്കാല കത്തുകൾ", author: "അനന്യ ദാസ്", summary: "ഇരുപത് വർഷത്തെ മൗനത്തിനു ശേഷം കൈയ്യെഴുത്ത് കത്തുകളിലൂടെ രണ്ട് അകന്ന ഭ്രാതൃ-ഭഗിനികൾ വീണ്ടും ഒന്നാകുന്നു." },
      hi: { title: "मानसून के पत्र", author: "अनन्या दास", summary: "बीस साल की चुप्पी के बाद दो अलग हुए भाई-बहन हस्तलिखित पत्रों के ज़रिए फिर से जुड़ते हैं।" },
      ar: { title: "رسائل الموسم", author: "أنانيا داس", summary: "أخوان متنافران يتواصلان مجدداً عبر رسائل مكتوبة بخط اليد بعد عشرين عاماً من الصمت." },
      zh: { title: "季风信笺", author: "阿南亚·达斯", summary: "两个疏离的兄妹在沉默二十年后，通过手写信重新联系。" },
      ta: { title: "பருவமழை கடிதங்கள்", author: "அனன்யா தாஸ்", summary: "இருபது ஆண்டு மௌனத்திற்கு பிறகு இரண்டு பிரிந்த சகோதரர்கள் கையால் எழுதிய கடிதங்கள் வழியாக மீண்டும் இணைகிறார்கள்." },
      te: { title: "రుతుపవన ఉత్తరాలు", author: "అనన్య దాస్", summary: "ఇరవై సంవత్సరాల మౌనం తర్వాత రెండు దూరమైన తోడబుట్టినవారు చేత్తో రాసిన ఉత్తరాల ద్వారా మళ్లీ కనెక్ట్ అవుతారు." },
      ur: { title: "مانسون کے خطوط", author: "انانیا داس", summary: "بیس سال کی خاموشی کے بعد دو بچھڑے ہوئے بہن بھائی ہاتھ سے لکھے خطوط کے ذریعے دوبارہ جڑتے ہیں۔" },
      es: { title: "Cartas del monzón", author: "Ananya Das", summary: "Dos hermanos distanciados se reconectan a través de cartas escritas a mano después de veinte años de silencio." },
fr: { title: "Lettres de mousson", author: "Ananya Das", summary: "Deux frères et sœurs éloignés se reconnectent à travers des lettres manuscrites après vingt ans de silence." },
pt: { title: "Cartas da monção", author: "Ananya Das", summary: "Dois irmãos distantes se reconectam por meio de cartas escritas à mão após vinte anos de silêncio." },
ja: { title: "モンスーンの手紙", author: "アナンヤ・ダス", summary: "二十年の沈黙の後、疎遠になった兄妹が手書きの手紙を通じて再びつながる。" },
ko: { title: "몬순 편지", author: "아난야 다스", summary: "이십 년의 침묵 끝에 멀어진 남매가 손으로 쓴 편지를 통해 다시 연결된다." },
th: { title: "จดหมายมรสุม", author: "อนันยา ดาส", summary: "พี่น้องที่ห่างเหินกันสองคนกลับมาเชื่อมต่อกันผ่านจดหมายเขียนมือหลังจากเงียบหายไปยี่สิบปี" },
ru: { title: "Муссонные письма", author: "Ананья Дас", summary: "Два разлучённых брата и сестра снова связываются через рукописные письма после двадцати лет молчания." },
      default: { title: "Monsoon Letters", author: "Ananya Das", summary: "Two estranged siblings reconnect through handwritten letters after twenty years of silence." },
    },
  },
];

const HERO_BANNERS = [
  {
    gradient: "from-violet-950 via-purple-900 to-fuchsia-950",
    accent: "#c084fc",
    emoji: "✨",
    storyId: 2,
  },
  {
    gradient: "from-rose-950 via-pink-900 to-rose-950",
    accent: "#fb7185",
    emoji: "🌹",
    storyId: 1,
  },
  {
    gradient: "from-cyan-950 via-sky-900 to-indigo-950",
    accent: "#38bdf8",
    emoji: "🌌",
    storyId: 3,
  },
];

const GENRE_KEYS = ["all", "romance", "fantasy", "horror", "thriller", "scifi", "drama"];

// ─────────────────────────────────────────────
// 4. HELPER: get story text for current lang
// ─────────────────────────────────────────────
function getStoryText(story, lang) {
  return story.translations[lang] || story.translations["default"] || story.translations["en"];
}

// ─────────────────────────────────────────────
// 5. SHIMMER COMPONENT
// ─────────────────────────────────────────────
function TranslatingShimmer({ lang }) {
  const t = T[lang] || T["en"];
  return (
    <div className="absolute inset-0 z-10 rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 px-4">
        <div className="flex items-center gap-2 text-amber-300">
          <Languages size={18} className="animate-pulse" />
          <span className="text-xs font-medium tracking-wide animate-pulse">
            {t.autoTranslating} {LANGUAGES[lang]?.label}...
          </span>
        </div>
        <div className="space-y-2 w-full">
          {[1, 0.8, 0.6].map((w, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full bg-gradient-to-r from-amber-500/30 via-amber-300/60 to-amber-500/30 animate-pulse"
              style={{ width: `${w * 100}%`, animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 6. STORY CARD
// ─────────────────────────────────────────────
function StoryCard({ story, lang }) {
   const navigate = useNavigate(); 
  const [translating, setTranslating] = useState(false);
  const [displayedLang, setDisplayedLang] = useState(lang);
  const prevLangRef = useRef(lang);

  useEffect(() => {
    if (prevLangRef.current === lang) return;
    prevLangRef.current = lang;

    // If the story is already in the target language, no shimmer needed
    if (story.originalLanguage === lang) {
      setDisplayedLang(lang);
      return;
    }

    setTranslating(true);
    const timer = setTimeout(() => {
      setTranslating(false);
      setDisplayedLang(lang);
    }, 900 + Math.random() * 600);
    return () => clearTimeout(timer);
  }, [lang, story.originalLanguage]);

  const text = getStoryText(story, displayedLang);
  const t = T[lang] || T["en"];
  const isRTL = LANGUAGES[lang]?.dir === "rtl";
  const originLang = LANGUAGES[story.originalLanguage]?.label || story.originalLanguage;

  const genreColors = {
    romance: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    fantasy: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    horror: "bg-red-500/20 text-red-300 border-red-500/30",
    thriller: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    scifi: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    drama: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  };

  return (
    <div className="group relative bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 flex flex-col">
      {/* Cover */}
      <div className={`relative h-44 bg-gradient-to-br ${story.coverGradient} flex items-center justify-center overflow-hidden`}>
        <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform duration-500">{story.coverEmoji}</span>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-transparent opacity-60" />
        {/* Genre badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full border ${genreColors[story.genre] || "bg-white/10 text-white/70"}`}>
            {t.genres[story.genre]}
          </span>
        </div>
        {/* Original language badge */}
        <div className="absolute bottom-3 right-3">
          <span className="text-[10px] bg-black/50 text-white/60 px-2 py-1 rounded-full border border-white/10">
            {t.originalIn}: {originLang}
          </span>
        </div>
        {translating && <TranslatingShimmer lang={lang} />}
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-1 p-4 gap-2 ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
        <h3 className="text-white font-semibold text-base leading-snug line-clamp-2 tracking-tight" style={{ lineHeight: "1.4" }}>
          {text.title}
        </h3>
        <p className="text-white/40 text-xs">{text.author}</p>
        <p className="text-white/55 text-xs leading-relaxed line-clamp-2 flex-1" style={{ lineHeight: "1.65" }}>
          {text.summary}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-1 text-white/40 text-xs">
            <Eye size={11} />
            <span>{story.views}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 text-xs">
            <Star size={11} fill="currentColor" />
            <span>{story.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-white/40 text-xs">
            <BookOpen size={11} />
            <span>{story.chapters}</span>
          </div>
        </div>
        <button onClick={() => navigate(`/story/${story.id}`)} className="mt-2 w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-all duration-200 border border-white/5 hover:border-white/10">
          {t.readNow}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 7. HERO CAROUSEL
// ─────────────────────────────────────────────
function HeroCarousel({ lang }) {
  const [current, setCurrent] = useState(0);
  const t = T[lang] || T["en"];
  const isRTL = LANGUAGES[lang]?.dir === "rtl";

  useEffect(() => {
    const iv = setInterval(() => setCurrent((c) => (c + 1) % HERO_BANNERS.length), 5000);
    return () => clearInterval(iv);
  }, []);

  const banner = HERO_BANNERS[current];
  const story = STORIES_DATA.find((s) => s.id === banner.storyId);
  const text = getStoryText(story, lang);

  return (
    <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden">
      {HERO_BANNERS.map((b, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-gradient-to-br ${b.gradient} transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")" }} />

      <div className={`absolute inset-0 flex flex-col justify-end p-7 md:p-10 ${isRTL ? "items-end text-right" : "items-start text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: banner.accent }} />
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: banner.accent }}>
            {t.trending}
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-2 drop-shadow-lg" style={{ lineHeight: "1.25" }}>
          {text.title}
        </h2>
        <p className="text-white/60 text-sm max-w-md mb-5" style={{ lineHeight: "1.65" }}>
          {text.summary}
        </p>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-black transition-all hover:scale-105" style={{ backgroundColor: banner.accent }}>
            {t.readNow}
          </button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all">
            {t.addToList}
          </button>
        </div>
      </div>

      {/* Controls */}
      <button onClick={() => setCurrent((c) => (c - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition-all">
        <ChevronLeft size={16} />
      </button>
      <button onClick={() => setCurrent((c) => (c + 1) % HERO_BANNERS.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition-all">
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_BANNERS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-white" : "w-1.5 bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 8. LANGUAGE DROPDOWN
// ─────────────────────────────────────────────
function LanguageDropdown({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-sm transition-all"
      >
        <Globe size={14} />
        <span className="hidden sm:inline max-w-[72px] truncate">{LANGUAGES[lang]?.label}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#13131f] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 z-50 py-2 max-h-80 overflow-y-auto overflow-x-hidden">
          {LANG_GROUPS.map((grp) => (
            <div key={grp.groupLabel}>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/25">{grp.groupLabel}</div>
              {grp.keys.map((k) => (
                <button
                  key={k}
                  onClick={() => { setLang(k); setOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${lang === k ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                >
                  <span>{LANGUAGES[k].label}</span>
                  <span className="text-[10px] text-white/25">{LANGUAGES[k].script}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 9. NAVBAR
// ─────────────────────────────────────────────
function Navbar({ lang, setLang }) {
  const t = T[lang] || T["en"];
  const isRTL = LANGUAGES[lang]?.dir === "rtl";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-[#080810]/90 backdrop-blur-xl border-b border-white/5" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="font-black text-lg text-white tracking-tight hidden sm:block">FasLax</span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 mx-4">
          {[t.home, t.browse].map((label) => (
            <button key={label} className="px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 relative max-w-sm">
          <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-white/30 ${isRTL ? "right-3" : "left-3"}`} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            dir={isRTL ? "rtl" : "ltr"}
            className={`w-full bg-white/5 border border-white/10 rounded-xl py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all ${isRTL ? "pr-9 pl-4" : "pl-9 pr-4"}`}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <LanguageDropdown lang={lang} setLang={setLang} />
          <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all hover:scale-105">
            <PenLine size={14} />
            {t.write}
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
            <User size={15} />
          </button>
          <button className="md:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 px-4 py-3 flex flex-col gap-1" dir={isRTL ? "rtl" : "ltr"}>
          {[t.home, t.browse, t.write, t.login].map((label) => (
            <button key={label} className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─────────────────────────────────────────────
// 10. GENRE TABS
// ─────────────────────────────────────────────
function GenreTabs({ lang, activeGenre, setActiveGenre }) {
  const t = T[lang] || T["en"];
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {GENRE_KEYS.map((key) => (
        <button
          key={key}
          onClick={() => setActiveGenre(key)}
          className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeGenre === key ? "bg-violet-600 text-white" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5"}`}
        >
          {t.genres[key]}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 11. SECTION HEADER
// ─────────────────────────────────────────────
function SectionHeader({ title, icon: Icon, seeAllLabel, isRTL }) {
  return (
    <div className={`flex items-center justify-between mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
        <Icon size={18} className="text-violet-400" />
        <h2 className="text-white font-bold text-xl tracking-tight">{title}</h2>
      </div>
      <button className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors">{seeAllLabel}</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// 12. STATS BAR
// ─────────────────────────────────────────────
function StatsBar({ lang }) {
  const isRTL = LANGUAGES[lang]?.dir === "rtl";
  const stats = [
    { value: "21", label: "Languages" },
    { value: "50M+", label: "Readers" },
    { value: "2M+", label: "Stories" },
    { value: "∞", label: "Translations" },
  ];
  return (
    <div className="grid grid-cols-4 gap-3 my-8">
      {stats.map((s) => (
        <div key={s.label} className={`bg-white/3 border border-white/5 rounded-2xl p-4 text-center`} dir={isRTL ? "rtl" : "ltr"}>
          <div className="text-2xl font-black text-white">{s.value}</div>
          <div className="text-xs text-white/35 mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 13. MAIN HOME COMPONENT
// ─────────────────────────────────────────────
export default function Home() {
  const [lang, setLang] = useState("en");
  const [activeGenre, setActiveGenre] = useState("all");
  const isRTL = LANGUAGES[lang]?.dir === "rtl";
  const t = T[lang] || T["en"];

  // Update document direction
  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, [lang, isRTL]);

  const filteredStories = activeGenre === "all"
    ? STORIES_DATA
    : STORIES_DATA.filter((s) => s.genre === activeGenre);

  return (
    <div className="min-h-screen bg-[#080810] text-white" dir={isRTL ? "rtl" : "ltr"}>
      {/* Global font scale for Indian scripts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;700&family=Noto+Sans+Malayalam:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;600;700&family=Noto+Sans+Kannada:wght@400;600;700&family=Noto+Sans+Bengali:wght@400;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Sans+SC:wght@400;700&family=Noto+Sans+JP:wght@400;600;700&family=Noto+Sans+KR:wght@400;600;700&family=Noto+Sans+Thai:wght@400;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        :lang(ml), :lang(ta), :lang(te), :lang(kn) { font-family: 'Noto Sans Malayalam', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Kannada', sans-serif; line-height: 1.8; }
        :lang(hi), :lang(mr) { font-family: 'Noto Serif Devanagari', serif; line-height: 1.75; }
        :lang(bn) { font-family: 'Noto Sans Bengali', sans-serif; line-height: 1.75; }
        :lang(ur) { font-family: 'Noto Nastaliq Urdu', serif; line-height: 2; }
        :lang(zh) { font-family: 'Noto Sans SC', sans-serif; }
        :lang(ja) { font-family: 'Noto Sans JP', sans-serif; line-height: 1.85; }
:lang(ko) { font-family: 'Noto Sans KR', sans-serif; line-height: 1.75; }
:lang(th) { font-family: 'Noto Sans Thai', sans-serif; line-height: 2; }
:lang(es), :lang(fr), :lang(pt), :lang(ru) { font-family: system-ui, sans-serif; }
.lang-dropdown::-webkit-scrollbar { width: 4px; }
.lang-dropdown::-webkit-scrollbar-track { background: transparent; }
.lang-dropdown::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer-slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
      `}</style>

      <Navbar lang={lang} setLang={setLang} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Hero */}
        <HeroCarousel lang={lang} />

        {/* Stats */}
        <StatsBar lang={lang} />

        {/* Featured tagline */}
        <div className={`text-center py-6 ${isRTL ? "text-right" : "text-left"} sm:text-center`} dir={isRTL ? "rtl" : "ltr"}>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3 tracking-tight" style={{ lineHeight: "1.15" }}>
            {t.featuredTitle}
          </h1>
          <p className="text-white/45 text-base max-w-2xl mx-auto" style={{ lineHeight: "1.7" }}>
            {t.featuredSub}
          </p>
        </div>

        {/* Trending stories */}
        <section>
          <SectionHeader title={t.trending} icon={Flame} seeAllLabel={t.seeAll} isRTL={isRTL} />
          <GenreTabs lang={lang} activeGenre={activeGenre} setActiveGenre={setActiveGenre} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            {filteredStories.map((story) => (
              <StoryCard key={story.id} story={story} lang={lang} />
            ))}
          </div>
        </section>

        {/* New Arrivals (same stories, alternate layout strip) */}
        <section>
          <SectionHeader title={t.newArrivals} icon={TrendingUp} seeAllLabel={t.seeAll} isRTL={isRTL} />
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {STORIES_DATA.slice().reverse().map((story) => {
              const text = getStoryText(story, lang);
              return (
                <div key={story.id} className={`shrink-0 w-44 bg-[#0f0f1a] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all hover:-translate-y-1`}>
                  <div className={`h-28 bg-gradient-to-br ${story.coverGradient} flex items-center justify-center`}>
                    <span className="text-4xl opacity-60">{story.coverEmoji}</span>
                  </div>
                  <div className={`p-3 ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
                    <p className="text-white text-xs font-semibold line-clamp-2" style={{ lineHeight: "1.4" }}>{text.title}</p>
                    <p className="text-white/35 text-[10px] mt-1">{text.author}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={9} fill="currentColor" className="text-amber-400" />
                      <span className="text-amber-400 text-[10px]">{story.rating}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Continue Reading strip */}
        <section>
          <SectionHeader title={t.continueReading} icon={Clock} seeAllLabel={t.seeAll} isRTL={isRTL} />
          <div className="space-y-2">
            {STORIES_DATA.slice(0, 3).map((story) => {
              const text = getStoryText(story, lang);
              const progress = [62, 34, 88][story.id % 3];
              return (
                <div key={story.id} className={`flex items-center gap-4 bg-white/3 hover:bg-white/5 border border-white/5 rounded-2xl p-3.5 transition-all cursor-pointer ${isRTL ? "flex-row-reverse" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${story.coverGradient} flex items-center justify-center shrink-0 text-2xl`}>{story.coverEmoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{text.title}</p>
                    <p className="text-white/35 text-xs mt-0.5">{text.author}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-[10px] text-white/30 shrink-0">{progress}%</span>
                    </div>
                  </div>
                  <Heart size={14} className="text-white/20 hover:text-pink-400 transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/5 py-8 px-6 text-center text-white/20 text-xs" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <BookOpen size={10} className="text-white" />
          </div>
          <span className="font-black text-white/40">FasLax</span>
        </div>
        <p>© 2025 FasLax · Stories across every language · Powered by universal translation</p>
      </footer>
    </div>
  );
}