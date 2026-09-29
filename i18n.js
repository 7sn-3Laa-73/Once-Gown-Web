/**
 * Once Gown - Luxury Bilingual Copywriting System
 * Native English (Default) & Native Arabic Copywriting Dictionaries
 */

const translations = {
  en: {
    // Top Announcement Bar
    "bar.openingSoon": "Official Boutique Launching Soon",
    "bar.countdownDays": "days",
    "bar.countdownHours": "hrs",
    "bar.countdownMinutes": "mins",
    "bar.countdownSeconds": "secs",
    "bar.cta": "List your gown early for priority feature",

    // Header
    "header.title": "Once Gown",
    "header.subtitle": "LUXURY COUTURE",
    "header.badge": "List New Gown",
    "header.switchRole": "Change Experience",

    // Ultra-Concise Role Selection Modal
    "role.modalTag": "ONCE GOWN",
    "role.modalTitle": "Select Experience",
    "role.modalSubtitle": "Welcome to Once Gown Luxury Couture",
    "role.sellerBadge": "SELLER",
    "role.sellerTitle": "I Want to List a Gown",
    "role.sellerDesc": "List your bridal or evening gown for rentals and sale.",
    "role.sellerBtn": "Start Listing →",
    "role.buyerBadge": "BUYER",
    "role.buyerTitle": "I Want to Shop Gowns",
    "role.buyerDesc": "Explore luxury bridal and evening collections.",
    "role.buyerBtn": "Preview Boutique →",

    // Ultra-Concise Buyer Coming Soon View
    "buyer.badge": "Coming soon",
    "buyer.title": "Your next occasion starts here. ✨",
    "buyer.subtitle": "We’re carefully building a collection of bridal and evening gowns available for rent.",
    "buyer.vipLabel": "Join the waitlist",
    "buyer.emailPlaceholder": "Enter your email...",
    "buyer.notifyBtn": "Join the waitlist →",
    "poll.question": "What are you looking for?",
    "poll.evening": "Evening gown",
    "poll.guest": "Wedding guest gown",
    "poll.engagement": "Engagement gown",
    "poll.bridal": "Bridal gown",
    "poll.gala": "Gala / formal gown",
    "poll.thanks": "Thank you! Your vote helps us shape the collection. 💛",
    "buyer.notifySuccess": "VIP Priority Saved.",
    "buyer.sellerPrompt": "Have a gown to list early?",
    "buyer.switchToSeller": "List Gown Now",

    // Progress Track
    "progress.stepPrefix": "Step",
    "progress.stepOf": "of 4",

    // Step Titles for Progress Header
    "step1.progressTitle": "Upload High-Quality Photos",
    "step2.progressTitle": "Specifications & Valuation",
    "step3.progressTitle": "Client Identity & Location",
    "step4.progressTitle": "Final Review & Authorization",

    // Step 1 Pane
    "step1.tag": "STEP 01",
    "step1.title": "Upload High-Quality Photos",
    "step1.subtitle": "",
    "step1.uploadLabel": "Gown Photography (Cover photo first)",
    "step1.uploadRequired": "*",
    "step1.uploadTitle": "Drag photography here or click to browse",
    "step1.uploadSubtitle": "Upload up to 10 high-quality photos capturing key details and silhouettes",
    "step1.uploadHelper": "Select your finest photo as the cover image to attract premium buyers.",
    "step1.listingTypeLabel": "Listing Preference",

    // Listing Options
    "listing.rentAndSell": "Rent & Sale",
    "listing.rentOnly": "Rent Only",
    "listing.sellOnly": "Sale Only",

    // Step 2 Pane
    "step2.tag": "STEP 02",
    "step2.title": "Specifications & Valuation",
    "step2.subtitle": "",
    "step2.colorLabel": "Primary Color Palette",
    "step2.colorCustomLabel": "Or select custom color:",

    // Color Names
    "color.pearlWhite": "Pearl White",
    "color.offWhite": "Off-White",
    "color.champagne": "Champagne",
    "color.roseBlush": "Rose Blush",
    "color.gold": "Gold",
    "color.silver": "Silver",
    "color.burgundy": "Burgundy",
    "color.black": "Black",

    // Pricing Section
    "step2.pricingDivider": "Valuation & Pricing",
    "step2.rentPriceLabel": "Rental Fee (EGP)",
    "step2.rentPricePlaceholder": "e.g. 3,500",
    "step2.sellPriceLabel": "Sale Price (EGP)",
    "step2.sellPriceOptional": "(Optional)",
    "step2.sellPricePlaceholder": "e.g. 12,000",

    // Specs Section
    "step2.specsDivider": "Sizing & Atelier",
    "step2.sizeLabel": "Label Size",
    "step2.sizeSelectDefault": "Select Size...",
    "step2.sizeCustom": "Bespoke / Custom Fit",
    "step2.brandLabel": "Designer / Maison",
    "step2.brandPlaceholder": "e.g. Dior, Temraza, Hany El Behairy...",
    "step2.weightLabel": "Recommended Weight",
    "step2.weightPlaceholder": "e.g. 55 - 65 kg",
    "step2.heightLabel": "Recommended Height",
    "step2.heightPlaceholder": "e.g. 160 - 170 cm",
    "step2.readyOrTailoredLabel": "Couture Type",
    "step2.ready": "Ready-to-wear",
    "step2.tailored": "Bespoke / Tailored",
    "step2.tailorNameLabel": "Atelier / Designer Name",
    "step2.tailorNamePlaceholder": "Enter atelier or designer name",

    // Step 3 Pane
    "step3.tag": "STEP 03",
    "step3.title": "Client Identity & Location",
    "step3.subtitle": "",
    "step3.ownerNameLabel": "Full Name",
    "step3.ownerNamePlaceholder": "e.g. Yasmine Ahmed Mahmoud",
    "step3.phoneLabel": "WhatsApp Number",
    "step3.phonePlaceholder": "01012345678",
    "step3.phoneHelper": "Your phone number remains strictly private and confidential",
    "step3.secondPhoneLabel": "Alternative Contact (Optional)",
    "step3.secondPhonePlaceholder": "01187654321",
    "step3.governorateLabel": "Governorate",
    "step3.governorateDefault": "Select Governorate...",
    "step3.cityLabel": "District / City",
    "step3.cityPlaceholder": "e.g. 5th Settlement, Maadi, Heliopolis...",
    "step3.addressLabel": "Detailed Address",
    "step3.addressPlaceholder": "Enter detailed pickup address for private courier coordination",
    "step3.addressHelper": "Address details shared only upon confirmed reservation.",

    // Step 4 Pane
    "step4.tag": "STEP 04",
    "step4.title": "Review & Authorization",
    "step4.subtitle": "",
    "step4.conditionLabel": "Garment Condition",
    "step4.conditionNew": "New (With Tags)",
    "step4.conditionWornOnce": "Worn Once",
    "step4.conditionWornTwice": "Worn Twice",
    "step4.conditionWornMore": "Worn 3+ Times",

    "step4.defectsLabel": "Flaws or Minor Notes?",
    "step4.defectsNo": "Flawless Condition",
    "step4.defectsYes": "Minor Notes Present",
    "step4.defectDetailsLabel": "Notes Description",
    "step4.defectDetailsPlaceholder": "Describe any minor mark or note near hemline...",

    "step4.alterationsLabel": "Allow Minor Custom Fitting?",
    "step4.alterationsYes": "Yes",
    "step4.alterationsNo": "No",
    "step4.alterationDetailsLabel": "Permitted Alterations",
    "step4.alterationDetailsPlaceholder": "e.g. Temporary basting or slight hem adjustment...",

    "step4.notesLabel": "Additional Instructions (Optional)",
    "step4.notesPlaceholder": "Any special care instructions or concierge notes...",

    "step4.agreement": "I confirm all provided details are accurate and authorize Once Gown to review and feature this piece on the platform.",

    // Review Summary Card Labels
    "review.ownerTitle": "Client Identity & Contact",
    "review.ownerName": "Name:",
    "review.phone": "WhatsApp:",
    "review.address": "Address:",
    "review.specsTitle": "Gown Specifications & Valuation",
    "review.brand": "Designer:",
    "review.color": "Color:",
    "review.size": "Size:",
    "review.rentPrice": "Rental Fee:",
    "review.sellPrice": "Sale Price:",
    "review.imageCount": "Attached Imagery:",
    "review.notesTitle": "Notes & Special Instructions",
    "review.notes": "Notes:",
    "review.none": "None",
    "review.notSpecified": "Not specified",
    "review.currency": "EGP",
    "review.photosCount": "photos",

    // Action Buttons & Navigation
    "nav.back": "Back",
    "nav.continue": "Continue",
    "nav.submit": "Submit Listing",
    "nav.saving": "Saving Listing...",
    "nav.autoSave": "Draft Saved",

    // Previews Overlay
    "preview.coverBadge": "Primary Cover",
    "preview.setCover": "Set Cover",
    "preview.remove": "Remove",

    // Success Screen & Tracking Link
    "success.title": "Listing Submitted Successfully",
    "success.message": "Our concierge team will review your submission and publish your piece on Once Gown shortly.",
    "success.resetBtn": "List Another Gown",
    "track.linkTitle": "Your Private Tracking Link",
    "track.linkDesc": "Keep or copy this unique link to check your gown's review status anytime:",
    "track.copyBtn": "Copy Tracking Link 📋",
    "track.copiedMsg": "Link Copied to Clipboard! ✨",
    "track.shareWaBtn": "Save to WhatsApp 📱",
    "track.viewNowBtn": "View Live Status Now 🌐",
    "track.modalTitle": "Gown Listing Status",
    "track.statusPending": "Pending Review ⏳",
    "track.pendingDesc": "Our concierge team is reviewing your gown details. Status will update live here.",
    "track.statusApproved": "Approved & Published ✨",
    "track.approvedDesc": "Congratulations! Your gown has been accepted and is live in the boutique collection.",
    "track.statusRejected": "Submission Not Approved ❌",
    "track.rejectedDesc": "Regrettably, your submission was not approved.",
    "track.rejectionReasonTitle": "Reason Provided by Concierge:",
    "track.myListingsBtn": "My Listed Gowns 👗",
    "header.trackBtn": "Track Status",

    // Validation Errors
    "error.photoRequired": "Please upload at least one photo of your gown",
    "error.colorRequired": "Please select the primary gown color",
    "error.rentPriceRequired": "Please specify the rental fee (EGP)",
    "error.sellPriceRequired": "Please specify the sale price (EGP)",
    "error.ownerNameRequired": "Please enter your full name",
    "error.phoneRequired": "Please enter a valid Egyptian WhatsApp number (e.g. 01012345678)",
    "error.governorateRequired": "Please select your governorate",
    "error.cityRequired": "Please enter your city/district",
    "error.addressRequired": "Please enter your detailed address",
    "error.agreementRequired": "Please accept the listing authorization terms before submitting"
  },

  ar: {
    // Top Announcement Bar
    "bar.openingSoon": "الافتتاح الرسمي للمتجر قريباً",
    "bar.countdownDays": "يوم",
    "bar.countdownHours": "س",
    "bar.countdownMinutes": "د",
    "bar.countdownSeconds": "ث",
    "bar.cta": "أدرجي فستانكِ الآن لتصدّر المعروضات الفاخرة",

    // Header
    "header.title": "Once Gown",
    "header.subtitle": "LUXURY COUTURE",
    "header.badge": "إدراج فستان جديد",
    "header.switchRole": "تغيير التجربة",

    // Ultra-Concise Role Selection Modal
    "role.modalTag": "ONCE GOWN",
    "role.modalTitle": "اختاري التجربة",
    "role.modalSubtitle": "أهلاً بكِ في منصة الفساتين الفاخرة",
    "role.sellerBadge": "بائعة",
    "role.sellerTitle": "أريد عرض فستاني",
    "role.sellerDesc": "أدرجي فستانكِ للبيع أو الإيجار لعميلات فاخرات.",
    "role.sellerBtn": "عرض الفستان ←",
    "role.buyerBadge": "مشترية",
    "role.buyerTitle": "أريد تسوق الفساتين",
    "role.buyerDesc": "تصفحي الفساتين الفاخرة من أشهر المصممين.",
    "role.buyerBtn": "معاينة المعرض ←",

    // Ultra-Concise Buyer Coming Soon View
    "buyer.badge": "قريباً",
    "buyer.title": "مناسبتكِ القادمة تبدأ من هنا ✨",
    "buyer.subtitle": "نعمل بعناية على تجهيز تشكيلة من فساتين الزفاف والسهرة المتاحة للإيجار.",
    "buyer.vipLabel": "انضمي إلى قائمة الانتظار",
    "buyer.emailPlaceholder": "ادخلي بريدك الإلكتروني...",
    "buyer.notifyBtn": "انضمي إلى قائمة الانتظار ←",
    "poll.question": "عن ماذا تبحثين؟",
    "poll.evening": "فستان سهرة",
    "poll.guest": "فستان حضور زفاف",
    "poll.engagement": "فستان خطوبة",
    "poll.bridal": "فستان زفاف",
    "poll.gala": "فستان حفلات رسمية",
    "poll.thanks": "شكراً لكِ! اختياركِ يساعدنا في تجهيز الويب سايت 💛",
    "buyer.notifySuccess": "تم حفظ أسبقيتكِ بنجاح.",
    "buyer.sellerPrompt": "تريدين عرض فستانكِ الآن؟",
    "buyer.switchToSeller": "إدراج فستاني الآن",

    // Progress Track
    "progress.stepPrefix": "الخطوة",
    "progress.stepOf": "من 4",

    // Step Titles for Progress Header
    "step1.progressTitle": "ارفعي صور عالية الجودة",
    "step2.progressTitle": "المواصفات والأسعار",
    "step3.progressTitle": "بيانات المالكة والتواصل",
    "step4.progressTitle": "التفاصيل والمراجعة النهائية",

    // Step 1 Pane
    "step1.tag": "الخطوة 01",
    "step1.title": "ارفعي صور عالية الجودة",
    "step1.subtitle": "",
    "step1.uploadLabel": "صور الفستان (الصورة الأولى هي الغلاف)",
    "step1.uploadRequired": "*",
    "step1.uploadTitle": "اسحبي صور الفستان هنا أو اضغطي للاختيار",
    "step1.uploadSubtitle": "ارفعي حتى 10 صور واضحة توضح الفستان من عدة زوايا",
    "step1.uploadHelper": "اختاري أحسن صورة واجعلها الأولى ليظهر إعلانك بشكل أنيق وجذاب.",
    "step1.listingTypeLabel": "نوع العرض في المنصة",

    // Listing Options
    "listing.rentAndSell": "للإيجار والبيع",
    "listing.rentOnly": "للإيجار فقط",
    "listing.sellOnly": "للبيع فقط",

    // Step 2 Pane
    "step2.tag": "الخطوة 02",
    "step2.title": "المواصفات والأسعار",
    "step2.subtitle": "",
    "step2.colorLabel": "لون الفستان الرئيسي",
    "step2.colorCustomLabel": "أو اختاري لون مخصص:",

    // Color Names
    "color.pearlWhite": "أبيض لؤلؤي",
    "color.offWhite": "أوف وايت",
    "color.champagne": "شامبين",
    "color.roseBlush": "وردي",
    "color.gold": "ذهبي",
    "color.silver": "فضي",
    "color.burgundy": "نبيتي",
    "color.black": "أسود",

    // Pricing Section
    "step2.pricingDivider": "تفاصيل الأسعار",
    "step2.rentPriceLabel": "سعر الإيجار (بالجنيه)",
    "step2.rentPricePlaceholder": "3500",
    "step2.sellPriceLabel": "سعر البيع (بالجنيه)",
    "step2.sellPriceOptional": "(اختياري)",
    "step2.sellPricePlaceholder": "12000",

    // Specs Section
    "step2.specsDivider": "تفاصيل المقاس والماركة",
    "step2.sizeLabel": "المقاس المكتوب",
    "step2.sizeSelectDefault": "اختر المقاس...",
    "step2.sizeCustom": "تفصيل / مقاس خاص",
    "step2.brandLabel": "الماركة / المصمم",
    "step2.brandPlaceholder": "مثال: Dior, Temraza, Hany El Behairy...",
    "step2.weightLabel": "مناسب للوزن تقريباً",
    "step2.weightPlaceholder": "مثال: 55 - 65 كجم",
    "step2.heightLabel": "مناسب للطول تقريباً",
    "step2.heightPlaceholder": "مثال: 160 - 170 سم",
    "step2.readyOrTailoredLabel": "جاهز أم تفصيل؟",
    "step2.ready": "جاهز",
    "step2.tailored": "تفصيل",
    "step2.tailorNameLabel": "اسم الأتيليه / مصمم التفصيل",
    "step2.tailorNamePlaceholder": "اكتبي اسم الأتيليه أو المصمم",

    // Step 3 Pane
    "step3.tag": "الخطوة 03",
    "step3.title": "بيانات المالكة والتواصل",
    "step3.subtitle": "",
    "step3.ownerNameLabel": "الاسم بالكامل",
    "step3.ownerNamePlaceholder": "مثال: ياسمين أحمد محمود",
    "step3.phoneLabel": "رقم الواتساب",
    "step3.phonePlaceholder": "01012345678",
    "step3.phoneHelper": "لن يظهر رقمك للعامة على المنصة",
    "step3.secondPhoneLabel": "رقم هاتف إضافي (اختياري)",
    "step3.secondPhonePlaceholder": "01187654321",
    "step3.governorateLabel": "المحافظة",
    "step3.governorateDefault": "اختر المحافظة...",
    "step3.cityLabel": "المدينة / المنطقة",
    "step3.cityPlaceholder": "مثال: التجمع الخامس، المعادي، مصر الجديدة...",
    "step3.addressLabel": "العنوان بالتفصيل",
    "step3.addressPlaceholder": "اكتبي العنوان التفصيلي لتسهيل معاينة وشحن الفستان",
    "step3.addressHelper": "لن يُشارك عنوانك إلا بعد تأكيد الاتفاق.",

    // Step 4 Pane
    "step4.tag": "الخطوة 04",
    "step4.title": "التفاصيل والمراجعة النهائية",
    "step4.subtitle": "",
    "step4.conditionLabel": "حالة الفستان",
    "step4.conditionNew": "جديد بالتكت",
    "step4.conditionWornOnce": "لبس مرة واحدة",
    "step4.conditionWornTwice": "لبس مرتين",
    "step4.conditionWornMore": "أكثر من مرتين",

    "step4.defectsLabel": "هل يوجد أي ملاحظات أو عيوب بسيطة؟",
    "step4.defectsNo": "لا، بحالة ممتازة",
    "step4.defectsYes": "نعم، يوجد ملاحظات",
    "step4.defectDetailsLabel": "توضيح العيوب",
    "step4.defectDetailsPlaceholder": "مثال: بقعة صغيرة بالقرب من الذيل...",

    // Success Screen & Tracking Link
    "success.title": "تم استلام طلبك بنجاح",
    "success.message": "سيقوم فريق Once Gown بمراجعة الطلب ونشر فستانكِ في أقرب وقت.",
    "success.resetBtn": "إضافة فستان آخر",
    "track.linkTitle": "رابط متابعة حالة الفستان الخاص بكِ",
    "track.linkDesc": "احفظي هذا الرابط أو انسخيه لمتابعة حالة مراجعة فستانكِ وقبوله في أي وقت:",
    "track.copyBtn": "نسخ رابط متابعة طلبكِ 📋",
    "track.copiedMsg": "تم نسخ الرابط بنجاح! ✨",
    "track.shareWaBtn": "حفظ الرابط في الواتساب 📱",
    "track.viewNowBtn": "معاينة حالة الطلب الآن 🌐",
    "track.modalTitle": "حالة طلب الفستان",
    "track.statusPending": "قيد المراجعة ⏳",
    "track.pendingDesc": "يقوم فريق Once Gown حالياً بمراجعة تفاصيل فستانكِ، وتتحدث الحالة هنا تلقائياً.",
    "track.statusApproved": "تم القبول والنشر ✨",
    "track.approvedDesc": "تهانينا! تم قبول فستانكِ وهو معروض حالياً بنجاح داخل تشكيلة البوتيك.",
    "track.statusRejected": "لم يتم القبول ❌",
    "track.rejectedDesc": "نعتذر، لم يتم قبول هذا الطلب في الوقت الحالي.",
    "track.rejectionReasonTitle": "سبب عدم القبول الموضح من الإدارة:",
    "track.myListingsBtn": "متابعة فساتيني 👗",
    "header.trackBtn": "متابعة فستاني",

    // Validation Errors
    "error.photoRequired": "الرجاء رفع صورة واحدة على الأقل للفستان",
    "error.colorRequired": "الرجاء اختيار لون الفستان الرئيسي أو توضيحه",
    "error.rentPriceRequired": "الرجاء تحديد سعر الإيجار (بالجنيه)",
    "error.sellPriceRequired": "الرجاء تحديد سعر البيع (بالجنيه)",
    "error.ownerNameRequired": "الرجاء إدخال الاسم بالكامل",
    "error.phoneRequired": "الرجاء إدخال رقم واتساب مصري صحيح (مثال: 01012345678)",
    "error.governorateRequired": "الرجاء اختيار المحافظة",
    "error.cityRequired": "الرجاء إدخال المدينة / المنطقة",
    "error.addressRequired": "الرجاء إدخال العنوان بالتفصيل",
    "review.ownerTitle": "بيانات المالك والتواصل",
    "review.ownerName": "الاسم:",
    "review.phone": "واتساب:",
    "review.address": "العنوان:",
    "review.specsTitle": "مواصفات الفستان والأسعار",
    "review.brand": "الماركة:",
    "review.color": "اللون:",
    "review.size": "المقاس:",
    "review.rentPrice": "سعر الإيجار:",
    "review.sellPrice": "سعر البيع:",
    "review.imageCount": "عدد الصور المرفقة:",
    "review.notesTitle": "الملاحظات وتفاصيل الفستان",
    "review.notes": "الملاحظات:",
    "review.none": "لا يوجد",
    "review.notSpecified": "غير محدد",
    "review.currency": "ج.م",
    "review.photosCount": "صور",

    // Action Buttons & Navigation
    "nav.back": "السابق",
    "nav.continue": "المتابعة",
    "nav.submit": "إرسال طلب الفستان",
    "nav.saving": "جاري حفظ الطلب...",
    "nav.autoSave": "تم الحفظ تلقائياً",

    // Previews Overlay
    "preview.coverBadge": "الصورة الرئيسية",
    "preview.setCover": "تعيين كغلاف",
    "preview.remove": "حذف",

    // Success Screen
    "success.title": "تم استلام طلبك بنجاح",
    "success.message": "سيقوم فريق Once Gown بمراجعة الطلب ونشر فستانكِ في أقرب وقت.",
    "success.resetBtn": "إضافة فستان آخر",

    // Validation Errors
    "error.photoRequired": "الرجاء رفع صورة واحدة على الأقل للفستان",
    "error.colorRequired": "الرجاء اختيار لون الفستان الرئيسي أو توضيحه",
    "error.rentPriceRequired": "الرجاء تحديد سعر الإيجار (بالجنيه)",
    "error.sellPriceRequired": "الرجاء تحديد سعر البيع (بالجنيه)",
    "error.ownerNameRequired": "الرجاء إدخال الاسم بالكامل",
    "error.phoneRequired": "الرجاء إدخال رقم واتساب مصري صحيح (مثال: 01012345678)",
    "error.governorateRequired": "الرجاء اختيار المحافظة",
    "error.cityRequired": "الرجاء إدخال المدينة / المنطقة",
    "error.addressRequired": "الرجاء إدخال العنوان بالتفصيل",
    "error.agreementRequired": "يجب الموافقة على صحة البيانات ونشر الفستان قبل الإرسال"
  }
};

class I18nService {
  constructor() {
    this.currentLang = localStorage.getItem('once_gown_lang') || 'en';
  }

  get lang() {
    return this.currentLang;
  }

  t(key) {
    const langDict = translations[this.currentLang] || translations.en;
    return langDict[key] || translations.en[key] || key;
  }

  setLanguage(lang) {
    if (!translations[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('once_gown_lang', lang);

    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    this.applyToDOM();
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  applyToDOM() {
    // Text content translation
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    // Placeholder translation
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      if (translation) {
        el.placeholder = translation;
      }
    });

    // Update active class on language toggle buttons
    document.querySelectorAll('.lang-option').forEach(el => {
      if (el.getAttribute('data-lang') === this.currentLang) {
        el.classList.add('active-lang');
      } else {
        el.classList.remove('active-lang');
      }
    });
  }
}

window.i18n = new I18nService();
