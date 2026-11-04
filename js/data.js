/**
 * Easy Online Services - Aaple Sarkar & CSC Seva Kendra
 * Default Data & Configuration
 * Helpline: 9834005538
 */

const DEFAULT_SETTINGS = {
  kendraName: "Easy Online Services",
  kendraTagline: "आपले सरकार व सीएससी महा-ई-सेवा केंद्र",
  ownerName: "Authorized VLE / संचालक",
  phone: "9834005538",
  whatsapp: "9834005538",
  email: "easyonlineservices.mh@gmail.com",
  address: "गाळा क्र. ४, ग्रामपंचायत संकुल, मुख्य बाजारपेठ, तहसील कार्यालयाजवळ, महाराष्ट्र - ४१३५०१",
  kendraId: "CSC-MH-2026-9834",
  aapleSarkarId: "AS-SETU-44092",
  upiId: "9834005538@upi",
  bankName: "State Bank of India (भारतीय स्टेट बँक)",
  accountNo: "39482019482",
  accountHolder: "Easy Online Services",
  ifscCode: "SBIN0001429",
  qrImageUrl: "", // If empty, dynamic UPI QR will be rendered
  workingHours: "सोमवार - शनिवार: सकाळी ८:०० ते रात्री ९:०० | रविवार: सकाळी ९:०० ते दु. २:००",
  noticeText: "📢 अर्ज सुरू: मुख्यमंत्री माझी लाडकी बहीण योजना, PM किसान 19वा हप्ता e-KYC, उत्पन्नाचा दाखला (१ व ३ वर्षे) व नवीन रेशन कार्ड अर्ज चालू आहेत! अधिक माहितीसाठी संपर्क: ९८३४००५५३८",
  copyrightNotice: "© 2026 Easy Online Services. All Rights Reserved. सर्व हक्क राखीव. Owned & Operated by Easy Online Services Kendra. Unauthorized copying is strictly prohibited."
};

const DEFAULT_SERVICES = [
  // --- REVENUE DEPARTMENT (महसूल विभाग) ---
  {
    id: "srv-income-cert",
    category: "revenue",
    titleEn: "Income Certificate (1 & 3 Years)",
    titleMr: "तहसीलदार उत्पन्न दाखला (१ व ३ वर्षे)",
    descEn: "Official Income Certificate issued by Revenue Dept (Tehsildar) for scholarship, ration card, and welfare schemes.",
    descMr: "महाविद्यालयात शिष्यवृत्ती, शैक्षणिक सवलत व विविध शासकीय योजनांसाठी तहसीलदार स्वाक्षरीचा अधिकृत दाखला.",
    govFee: 33,
    processingFee: 67,
    totalFee: 100,
    days: "2-3 Days",
    icon: "file-text",
    requiredDocs: [
      "Aadhaar Card (आधार कार्ड)",
      "Ration Card (रेशन कार्ड प्रत)",
      "Talathi Income Report / Salary Slip (तलाठी अहवाल / वेतन दाखला)",
      "Applicant Passport Photo (अर्जदाराचा फोटो)",
      "Self Declaration Form / Hamipatra (हमीपत्र)"
    ],
    active: true
  },
  {
    id: "srv-caste-cert",
    category: "revenue",
    titleEn: "Caste Certificate (SC/ST/OBC/VJNT/SBC/SEBC)",
    titleMr: "जात प्रमाणपत्र (SC / ST / OBC / VJNT / SEBC)",
    descEn: "Caste Certificate from Sub-Divisional Officer (SDO / Prant) for reservation, education, and jobs.",
    descMr: "उपविभागीय अधिकारी (प्रांत) यांच्याकडून अधिकृत डिजिटल स्वाक्षरीचे जात प्रमाणपत्र.",
    govFee: 50,
    processingFee: 100,
    totalFee: 150,
    days: "5-7 Days",
    icon: "award",
    requiredDocs: [
      "Applicant Aadhaar Card & School Leaving (अर्जदाराचा आधार व शाळा सोडल्याचा दाखला)",
      "Father's School Leaving / TC / Birth Proof (वडिलांचा शाळा सोडल्याचा दाखला)",
      "Caste Proof of Relative pre-1967/1961 (कुटुंबातील जुना जातीचा पुरावा)",
      "Ration Card (रेशन कार्ड)",
      "Affidavit / Hamipatra (विहित नमुन्यातील प्रतिज्ञापत्र)"
    ],
    active: true
  },
  {
    id: "srv-domicile-cert",
    category: "revenue",
    titleEn: "Age, Nationality & Domicile Certificate",
    titleMr: "अधिवास व राष्ट्रीयत्व प्रमाणपत्र (Domicile)",
    descEn: "Essential Maharashtra State Residence Proof for government jobs, admissions, and competitive exams.",
    descMr: "महाराष्ट्रातील रहिवासी असल्याचे सिद्ध करणारे आवश्यक प्रमाणपत्र. सर्व प्रवेश व नोकर भरतीसाठी सक्तीचे.",
    govFee: 33,
    processingFee: 87,
    totalFee: 120,
    days: "3-5 Days",
    icon: "shield-check",
    requiredDocs: [
      "Aadhaar Card (आधार कार्ड)",
      "School Leaving Certificate / TC (शाळा सोडल्याचा दाखला)",
      "15 Years Residence Proof / Electricity Bill / Grampanchayat Tax Receipt (१५ वर्षांचा वास्तव्याचा पुरावा)",
      "Father's Domicile or Ration Card (वडिलांचा दाखला / रेशन कार्ड)",
      "Passport Size Photo (फोटो)"
    ],
    active: true
  },
  {
    id: "srv-non-creamy-layer",
    category: "revenue",
    titleEn: "Non-Creamy Layer Certificate (NCL)",
    titleMr: "नॉन-क्रिमीलेअर प्रमाणपत्र (उन्नत व प्रगत गट)",
    descEn: "Mandatory certificate for OBC, VJNT, SBC candidates to avail reservation benefits based on 3-year income.",
    descMr: "मागील ३ वर्षांच्या उत्पन्नावर आधारित आरक्षणाचे लाभ मिळवण्यासाठी लागणारे आवश्यक प्रमाणपत्र.",
    govFee: 50,
    processingFee: 100,
    totalFee: 150,
    days: "4-6 Days",
    icon: "file-check",
    requiredDocs: [
      "Caste Certificate (जात प्रमाणपत्र)",
      "Last 3 Years Income Certificate from Tehsildar (मागील ३ वर्षांचा तहसीलदार उत्पन्न दाखला)",
      "Applicant Aadhaar Card (अर्जदाराचा आधार कार्ड)",
      "Ration Card (रेशन कार्ड)",
      "Self Declaration Form (स्वयंघोषणापत्र)"
    ],
    active: true
  },
  {
    id: "srv-712-extract",
    category: "revenue",
    titleEn: "Digitally Signed 7/12 & 8A Extract",
    titleMr: "डिजिटल स्वाक्षरीचा सातबारा (7/12) व ८अ उतारा",
    descEn: "Official Mahabhulekh certified land record with QR code and digital signature valid for all legal and bank purposes.",
    descMr: "सर्व बँका, कोर्ट व शासकीय कामांसाठी १००% कायदेशीर ग्राह्य असणारा अधिकृत डिजिटल स्वाक्षरी ७/१२ उतारा.",
    govFee: 15,
    processingFee: 25,
    totalFee: 40,
    days: "Instant (10 Min)",
    icon: "map",
    requiredDocs: [
      "District, Taluka & Village Name (जिल्हा, तालुका व गावाचे नाव)",
      "Survey Number / Gat Number / Khata Number (गट क्रमांक किंवा खाते क्रमांक)"
    ],
    active: true
  },
  {
    id: "srv-solvency-cert",
    category: "revenue",
    titleEn: "Solvency Certificate (ऐपत दाखला)",
    titleMr: "तहसीलदार ऐपत दाखला (Solvency)",
    descEn: "Financial stability and property valuation certificate required for court bails, government tenders, and contracts.",
    descMr: "कोर्ट जामीन, शासकीय कंत्राट व निविदा प्रक्रियेसाठी आवश्यक असणारा मालमत्ता ऐपत दाखला.",
    govFee: 50,
    processingFee: 150,
    totalFee: 200,
    days: "5-7 Days",
    icon: "briefcase",
    requiredDocs: [
      "Property 7/12 or Valuation Report (मालमत्ता ७/१२ किंवा मूल्यांकन अहवाल)",
      "Aadhaar & PAN Card (आधार व पॅन कार्ड)",
      "Bank Statement / IT Returns (बँक स्टेटमेंट / आयकर विवरण)",
      "Affidavit on Stamp Paper (स्टॅम्प पेपरवरील प्रतिज्ञापत्र)"
    ],
    active: true
  },

  // --- IDENTITY & CIVIC (ओळखपत्र व नागरी सेवा) ---
  {
    id: "srv-pan-card",
    category: "identity",
    titleEn: "New PAN Card / PAN Card Correction",
    titleMr: "नवीन पॅन कार्ड / पॅन दुरुस्ती (NSDL / UTI)",
    descEn: "Instant e-PAN delivery within 48 hours and physical biometric PVC PAN card delivered to home address.",
    descMr: "नवीन पॅन कार्ड किंवा नाव, जन्मतारीख दुरुस्ती. ४८ तासांत ई-पॅन व १० दिवसांत ओरिजिनल कार्ड घरपोच.",
    govFee: 107,
    processingFee: 93,
    totalFee: 200,
    days: "2-3 Days (e-PAN)",
    icon: "credit-card",
    requiredDocs: [
      "Aadhaar Card with Mobile Linked (आधार कार्ड मोबाईल लिंक असलेले)",
      "2 Passport Size Photographs (२ पासपोर्ट फोटो)",
      "Signature on White Paper (स्वाक्षरी)",
      "Old PAN Card Copy (दुरुस्ती असल्यास जुने पॅन कार्ड)"
    ],
    active: true
  },
  {
    id: "srv-aadhaar-services",
    category: "identity",
    titleEn: "Aadhaar Services & PVC Card Order",
    titleMr: "आधार कार्ड सेवा, अपॉइंटमेंट व ओरिजिनल PVC कार्ड",
    descEn: "Aadhaar demographic update appointment, document update (free mandatory), and official UIDAI PVC card.",
    descMr: "अधिकृत UIDAI स्मार्ट पीव्हीसी आधार कार्ड ऑर्डर, नाव/पत्ता अपडेट अपॉइंटमेंट व बायोमेट्रिक सेवा.",
    govFee: 50,
    processingFee: 50,
    totalFee: 100,
    days: "Same Day / PVC 7 Days",
    icon: "user-check",
    requiredDocs: [
      "Aadhaar Number (आधार क्रमांक)",
      "Mobile OTP / Fingerprint (मोबाईल ओटीपी किंवा बायोमेट्रिक)"
    ],
    active: true
  },
  {
    id: "srv-voter-id",
    category: "identity",
    titleEn: "Voter ID Card (New / Correction / Shift)",
    titleMr: "मतदार ओळखपत्र (नवीन नोंदणी / दुरुस्ती)",
    descEn: "NVSP Election Commission voter registration, address change, and high-quality EPIC card generation.",
    descMr: "नवीन मतदारांसाठी नोंदणी, नाव किंवा पत्ता बदल आणि नवीन स्मार्ट डिजिटल व्होटर कार्ड डाऊनलोड.",
    govFee: 0,
    processingFee: 80,
    totalFee: 80,
    days: "7-10 Days",
    icon: "check-circle",
    requiredDocs: [
      "Aadhaar Card (आधार कार्ड)",
      "Age Proof / 10th Marksheet or LC (वय पुरावा)",
      "Address Proof / Electricity Bill (पत्ता पुरावा)",
      "Passport Photo (फोटो)",
      "Family Member Voter ID (कुटुंबातील एकाचे मतदार कार्ड)"
    ],
    active: true
  },
  {
    id: "srv-ration-card",
    category: "identity",
    titleEn: "Ration Card (New / Member Add / Division)",
    titleMr: "रेशन कार्ड (नवीन / नाव वाढवणे / विभक्त करणे)",
    descEn: "Food & Civil Supplies Dept online application for BPL/APL/NFSA ration card and family member update.",
    descMr: "नवीन रेशन कार्ड, कुटुंबातील नवीन सदस्यांचे नाव वाढवणे, नाव कमी करणे किंवा विभक्त रेशन कार्ड अर्ज.",
    govFee: 20,
    processingFee: 80,
    totalFee: 100,
    days: "7-14 Days",
    icon: "shopping-bag",
    requiredDocs: [
      "Existing Ration Card (चालू रेशन कार्ड मूळ प्रत)",
      "Aadhaar Cards of all Family Members (कुटुंबातील सर्व सदस्यांचे आधार कार्ड)",
      "Child Birth Certificate / Leaving Certificate for new addition (जन्म दाखला / शाळा सोडल्याचा दाखला)",
      "Gas Connection details (गॅस पासबुक झेरॉक्स)"
    ],
    active: true
  },
  {
    id: "srv-ayushman-card",
    category: "identity",
    titleEn: "Ayushman Bharat Golden Card (PM-JAY)",
    titleMr: "आयुष्मान भारत गोल्डन कार्ड (₹५ लाख मोफत उपचार)",
    descEn: "Free ₹5 Lakh cash-less medical treatment card applicable in all empanelled government and private hospitals.",
    descMr: "शासकीय व नामांकित खाजगी रुग्णालयांत दरवर्षी ₹५ लाखांपर्यंत मोफत कॅशलेस उपचार मिळवून देणारे कार्ड.",
    govFee: 0,
    processingFee: 50,
    totalFee: 50,
    days: "1-2 Days",
    icon: "heart-pulse",
    requiredDocs: [
      "Ration Card with Name in List (रेशन कार्ड / यादीत नाव असलेला पुरावा)",
      "Aadhaar Card (आधार कार्ड)",
      "Mobile Number for OTP (मोबाईल नंबर)"
    ],
    active: true
  },
  {
    id: "srv-eshram-card",
    category: "identity",
    titleEn: "E-Shram Card Registration",
    titleMr: "ई-श्रम कार्ड नोंदणी (असंघटित कामगार)",
    descEn: "Ministry of Labour portal registration for unorganized workers with ₹2 Lakh accident insurance cover.",
    descMr: "असंघटित क्षेत्रातील कामगार, शेतमजूर, बांधकाम कामगार यांच्यासाठी केंद्र सरकारचे २ लाख विमा संरक्षण कार्ड.",
    govFee: 0,
    processingFee: 50,
    totalFee: 50,
    days: "Instant",
    icon: "hard-hat",
    requiredDocs: [
      "Aadhaar Card with Mobile Link (आधार कार्ड)",
      "Bank Account Passbook (बँक पासबुक)",
      "Nominee Details (वारसदाराचे नाव व माहिती)"
    ],
    active: true
  },

  // --- WELFARE & PENSIONS (कल्याणकारी व पेन्शन योजना) ---
  {
    id: "srv-ladki-bahin",
    category: "welfare",
    titleEn: "Mukhyamantri Majhi Ladki Bahin Yojana",
    titleMr: "मुख्यमंत्री माझी लाडकी बहीण योजना (₹१,५००/महिना)",
    descEn: "Maharashtra Government flagship scheme providing ₹1,500 monthly direct bank transfer to eligible women.",
    descMr: "२१ ते ६५ वयोगटातील महिलांना दरमहा ₹१,५०० आर्थिक सहाय्य देणारी महाराष्ट्र शासनाची योजना. तात्काळ अचूक अर्ज.",
    govFee: 0,
    processingFee: 60,
    totalFee: 60,
    days: "1-2 Days",
    icon: "smile",
    requiredDocs: [
      "Aadhaar Card of Applicant Woman (महिला अर्जदाराचे आधार कार्ड)",
      "Aadhaar Linked Bank Passbook / DBT Active (बँक पासबुक)",
      "Ration Card (Orange / Yellow) (रेशन कार्ड)",
      "Income Certificate or Hamipatra (उत्पन्न दाखला किंवा हमीपत्र)",
      "Passport Photo (फोटो)"
    ],
    active: true
  },
  {
    id: "srv-sanjay-gandhi-pension",
    category: "welfare",
    titleEn: "Sanjay Gandhi Niradhar Pension Scheme",
    titleMr: "संजय गांधी निराधार अनुदान योजना (₹१,५००/महिना)",
    descEn: "Monthly pension for destitute, disabled persons, widows, and critically ill citizens below poverty line.",
    descMr: "निराधार, विधवा, दिव्यांग व दुर्धर आजारी व्यक्तींसाठी शासनाकडून मिळणारी मासिक पेन्शन योजना.",
    govFee: 0,
    processingFee: 120,
    totalFee: 120,
    days: "10-15 Days",
    icon: "user-plus",
    requiredDocs: [
      "Age Proof / Leaving / Aadhaar (वय दाखला)",
      "Income Certificate under ₹21,000 (तहसीलदार उत्पन्न दाखला)",
      "Disability / Widow / Destitute Certificate (दिव्यांग / मृत्यू दाखला)",
      "15 Years Residence Proof (१५ वर्षे रहिवासी दाखला)",
      "Bank Account details (बँक खाते)"
    ],
    active: true
  },
  {
    id: "srv-shravanbal-yojana",
    category: "welfare",
    titleEn: "Shravanbal Seva State Pension Yojana",
    titleMr: "श्रावणबाळ सेवा राज्य निवृत्तीवेतन योजना (ज्येष्ठ नागरिक)",
    descEn: "Old-age pension scheme for senior citizens aged 65 years and above in Maharashtra.",
    descMr: "६५ वर्षे किंवा त्याहून अधिक वयाच्या वृद्ध नागरिकांसाठी राज्य शासनाची मासिक निवृत्तीवेतन पेन्शन.",
    govFee: 0,
    processingFee: 120,
    totalFee: 120,
    days: "10-15 Days",
    icon: "users",
    requiredDocs: [
      "Aadhaar Card & Age Proof (आधार कार्ड व वयाचा पुरावा ६५+ वर्षे)",
      "Income Certificate under ₹21,000 / BPL Card (तहसीलदार उत्पन्न दाखला / दारिद्र्यरेषेचा दाखला)",
      "Maharashtra Domicile (अधिवास दाखला)",
      "Bank Passbook (बँक पासबुक)"
    ],
    active: true
  },
  {
    id: "srv-mahadbt-scholarship",
    category: "welfare",
    titleEn: "MahaDBT Student Post-Matric Scholarship",
    titleMr: "महाडीबीटी पोस्ट मॅट्रिक शिष्यवृत्ती अर्ज",
    descEn: "Government of Maharashtra scholarship application for 11th, 12th, Degree, Diploma, Engineering, Medical students.",
    descMr: "महाविद्यालयात शिकणाऱ्या सर्व मागासवर्गीय, ईबीसी व अल्पसंख्याक विद्यार्थ्यांसाठी शासकीय स्कॉलरशिप अर्ज.",
    govFee: 0,
    processingFee: 150,
    totalFee: 150,
    days: "3-5 Days",
    icon: "graduation-cap",
    requiredDocs: [
      "Caste & Non-Creamy Layer (जात व नॉन क्रिमीलेअर)",
      "Current Year Income Certificate (चालू वर्षाचा तहसीलदार उत्पन्न दाखला)",
      "College Admission Fee Receipt (कॉलेज प्रवेश फी पावती)",
      "10th, 12th, Previous Year Marksheet (मागील वर्षाच्या गुणपत्रिका)",
      "Aadhaar NPCI Bank Linking Proof (बँक खाते आधार लिंक पुरावा)",
      "Ration Card & Domicile (रेशन कार्ड व डोमिसाईल)"
    ],
    active: true
  },

  // --- AGRICULTURE & FARMER SCHEMES (कृषी व शेतकरी योजना) ---
  {
    id: "srv-pm-kisan",
    category: "farmer",
    titleEn: "PM Kisan Samman Nidhi & e-KYC (₹6,000/yr)",
    titleMr: "पीएम किसान सन्मान निधी नवीन नोंदणी व ई-केवायसी",
    descEn: "Registration, OTP/Biometric e-KYC, land seeding, and DBT bank account linking for PM Kisan ₹6,000/year.",
    descMr: "शेतकऱ्यांना दरवर्षी ₹६,००० मिळवून देणारी योजना. नवीन शेतकरी नोंदणी, बायोमेट्रिक e-KYC व जमीन नोंद दुरुस्ती.",
    govFee: 15,
    processingFee: 55,
    totalFee: 70,
    days: "1-3 Days",
    icon: "sun",
    requiredDocs: [
      "Aadhaar Card (आधार कार्ड)",
      "Digitally Signed 7/12 & 8A Extract (डिजिटल ७/१२ व ८अ उतारा)",
      "Bank Account Passbook (बँक पासबुक)",
      "Mobile for Aadhaar OTP (मोबाईल नंबर)"
    ],
    active: true
  },
  {
    id: "srv-pik-vima",
    category: "farmer",
    titleEn: "Pradhan Mantri Fasal Bima Yojana (Crop Insurance)",
    titleMr: "प्रधानमंत्री पीक विमा योजना (खरीप व रब्बी हंगाम)",
    descEn: "Government crop insurance against natural calamities, drought, pest attacks, and heavy rainfall.",
    descMr: "अतिवृष्टी, दुष्काळ व नैसर्गिक आपत्तीपासून पिकांचे संरक्षण करणारा अधिकृत शासन पीक विमा अर्ज.",
    govFee: 1,
    processingFee: 49,
    totalFee: 50,
    days: "Same Day",
    icon: "cloud-rain",
    requiredDocs: [
      "Updated 7/12 & 8A with Crop Sowing Note (पिकपेरा नोंद असलेला ७/१२ उतारा)",
      "Bank Account Linked with Aadhaar (आधार लिंक बँक खाते)",
      "Sowing Self Declaration (पिकपेरा स्वयंघोषणापत्र)"
    ],
    active: true
  },
  {
    id: "srv-solar-pump",
    category: "farmer",
    titleEn: "Magel Tyala Solar Pump Yojana (KUSUM / MSEB)",
    titleMr: "मागेल त्याला सौर कृषी पंप योजना (९०% ते ९५% अनुदान)",
    descEn: "Government subsidy of up to 90-95% for 3 HP, 5 HP, and 7.5 HP solar water pumps for agricultural land.",
    descMr: "शेतीसाठी सौर कृषी पंप मिळवून देणारा अर्ज. ९०% ते ९५% शासकीय अनुदानासह मोफत वीज.",
    govFee: 0,
    processingFee: 150,
    totalFee: 150,
    days: "3-5 Days",
    icon: "zap",
    requiredDocs: [
      "7/12 & 8A Extract with Water Source Entry (पाण्याचा स्त्रोत नोंद असलेला ७/१२)",
      "NOC of other share holders if joint land (सामाईक खातेदार संमतीपत्र)",
      "Aadhaar Card & Caste Certificate (आधार व जात प्रमाणपत्र)",
      "Bank Passbook (बँक पासबुक)"
    ],
    active: true
  },

  // --- BUSINESS & LICENSING (व्यवसाय व कायदेशीर सेवा) ---
  {
    id: "srv-udyam-msme",
    category: "business",
    titleEn: "Udyam MSME Registration (उद्योग आधार)",
    titleMr: "उद्यम एमएसएमई नोंदणी (उद्योग आधार प्रमाणपत्र)",
    descEn: "Central Ministry of MSME registration certificate for shops, small businesses, and startups for bank loans.",
    descMr: "सर्व प्रकारच्या दुकाने, व्यवसाय व उद्योगांसाठी केंद्र सरकारचे अधिकृत उद्योग आधार. मुद्रा लोनसाठी उपयुक्त.",
    govFee: 0,
    processingFee: 200,
    totalFee: 200,
    days: "1-2 Days",
    icon: "briefcase",
    requiredDocs: [
      "Aadhaar Card of Business Owner (मालकाचे आधार कार्ड)",
      "PAN Card (पॅन कार्ड)",
      "Bank Account Details (व्यवसाय बँक खाते)",
      "Business Name & Activity details (व्यवसायाचे नाव व पत्ता)"
    ],
    active: true
  },
  {
    id: "srv-shop-act",
    category: "business",
    titleEn: "Shop Act License / Gumasta (Intimation / Registration)",
    titleMr: "शॉप ॲक्ट परवाना / गुमास्ता लायसन्स",
    descEn: "Maharashtra Municipal / Labour Dept commercial license required to operate shops, offices, and open current accounts.",
    descMr: "महाराष्ट्र कामगार विभागाचा अधिकृत गुमास्ता परवाना. चालू बँक खाते उघडण्यासाठी व व्यवसाय सुरू करण्यासाठी अनिवार्य.",
    govFee: 24,
    processingFee: 176,
    totalFee: 200,
    days: "1-3 Days",
    icon: "store",
    requiredDocs: [
      "Shop Board Photo with Marathi Nameplate (मराठी पाट्यासह दुकानाचा फोटो)",
      "Owner Aadhaar & PAN Card (मालकाचे आधार व पॅन)",
      "Shop Rent Agreement / Property Tax Receipt (भाडेकरार किंवा कर पावती)",
      "Electricity Bill (लाईट बिल)"
    ],
    active: true
  },
  {
    id: "srv-food-license",
    category: "business",
    titleEn: "FSSAI Food License / Registration (अन्न सुरक्षा परवाना)",
    titleMr: "एफएसएसएआय अन्न सुरक्षा नोंदणी (FSSAI Food License)",
    descEn: "Mandatory food safety license for hotels, canteens, bakeries, grocery stores, sweet shops, and dairy.",
    descMr: "हॉटेल, किराणा, बेकरी, डेअरी व खाद्यपदार्थ विक्रेत्यांसाठी अन्न व औषध प्रशासनाचा सक्तीचा परवाना.",
    govFee: 100,
    processingFee: 200,
    totalFee: 300,
    days: "3-5 Days",
    icon: "coffee",
    requiredDocs: [
      "Owner Photo & Aadhaar Card (फोटो व आधार कार्ड)",
      "Business Address Proof / Rent Agreement (जागेचा पुरावा)",
      "List of Food Items to be sold (विक्री करावयाच्या पदार्थांची यादी)"
    ],
    active: true
  },
  {
    id: "srv-pcc-police",
    category: "business",
    titleEn: "Police Clearance Certificate (PCC)",
    titleMr: "पोलीस चारित्र्य पडताळणी प्रमाणपत्र (PCC)",
    descEn: "State Police character verification certificate for jobs, defense, security agencies, and passport visa.",
    descMr: "खाजगी व शासकीय नोकऱ्या, सुरक्षा गार्ड व व्हिसा प्रक्रियेसाठी पोलीस विभागाचे चारित्र्य पडताळणी प्रमाणपत्र.",
    govFee: 125,
    processingFee: 125,
    totalFee: 250,
    days: "7-10 Days",
    icon: "shield",
    requiredDocs: [
      "Aadhaar Card (आधार कार्ड)",
      "School Leaving Certificate (शाळा सोडल्याचा दाखला)",
      "Address Proof / Ration Card (पत्ता पुरावा)",
      "Company Job Offer Letter / Reason Letter (कंपनीचे पत्र)"
    ],
    active: true
  }
];

// Initial Realistic Sample Applications
const INITIAL_APPLICATIONS = [
  {
    id: "app-1042",
    trackingId: "EOS-2026-1042",
    serviceId: "srv-income-cert",
    serviceName: "Income Certificate (1 & 3 Years)",
    serviceNameMr: "तहसीलदार उत्पन्न दाखला (१ व ३ वर्षे)",
    applicantName: "सचिन दत्तात्रय पाटील (Sachin Dattatray Patil)",
    mobile: "9834005538",
    email: "sachinpatil@gmail.com",
    aadhaarNo: "XXXX-XXXX-8492",
    address: "मु. पो. बोरगाव, ता. जुन्नर, जि. पुणे, महाराष्ट्र - ४१०५०२",
    amount: 100,
    govFee: 33,
    processingFee: 67,
    paymentStatus: "SUCCESS",
    paymentMethod: "UPI_QR",
    utrNumber: "431289410921",
    status: "APPROVED", // PENDING, VERIFYING, PROCESSING, APPROVED, REJECTED
    createdAt: "2026-11-01T09:30:00Z",
    updatedAt: "2026-11-03T14:15:00Z",
    officerRemarks: "दस्तावेज व तलाठी अहवाल योग्य. तहसीलदार डिजिटल स्वाक्षरीसह दाखला तयार करण्यात आला आहे. कृपया डाउनलोड करा.",
    documents: [
      { name: "Aadhaar Card", type: "pdf", fileName: "sachin_aadhaar.pdf", size: "420 KB" },
      { name: "Ration Card", type: "jpg", fileName: "sachin_ration.jpg", size: "650 KB" },
      { name: "Talathi Income Report", type: "pdf", fileName: "talathi_ahval.pdf", size: "380 KB" },
      { name: "Applicant Photo", type: "jpg", fileName: "sachin_photo.jpg", size: "120 KB" }
    ],
    certificateUrl: "demo-certificate-income.pdf",
    certificateNo: "MH/REV/2026/INC/94021"
  },
  {
    id: "app-1043",
    trackingId: "EOS-2026-1043",
    serviceId: "srv-ladki-bahin",
    serviceName: "Mukhyamantri Majhi Ladki Bahin Yojana",
    serviceNameMr: "मुख्यमंत्री माझी लाडकी बहीण योजना",
    applicantName: "सुनिता रमेश गायकवाड (Sunita Ramesh Gaikwad)",
    mobile: "9822114455",
    email: "sunita.g@rediffmail.com",
    aadhaarNo: "XXXX-XXXX-3319",
    address: "घर क्र. १२, छत्रपती शिवाजी महाराज चौक, सातारा - ४१५००१",
    amount: 60,
    govFee: 0,
    processingFee: 60,
    paymentStatus: "SUCCESS",
    paymentMethod: "UPI_QR",
    utrNumber: "431390192847",
    status: "PROCESSING",
    createdAt: "2026-11-03T11:20:00Z",
    updatedAt: "2026-11-04T10:00:00Z",
    officerRemarks: "कागदपत्रे पडताळणी पूर्ण झाली आहे. महिला व बालविकास तालुका समितीकडे अंतिम मंजुरीसाठी वर्ग करण्यात आला आहे.",
    documents: [
      { name: "Aadhaar Card", type: "pdf", fileName: "sunita_aadhaar.pdf", size: "510 KB" },
      { name: "Bank Passbook", type: "jpg", fileName: "sunita_passbook.jpg", size: "480 KB" },
      { name: "Hamipatra", type: "pdf", fileName: "hamipatra_signed.pdf", size: "290 KB" }
    ],
    certificateUrl: null,
    certificateNo: null
  },
  {
    id: "app-1044",
    trackingId: "EOS-2026-1044",
    serviceId: "srv-pan-card",
    serviceName: "New PAN Card / PAN Card Correction",
    serviceNameMr: "नवीन पॅन कार्ड / दुरुस्ती",
    applicantName: "राहुल किसन शिंदे (Rahul Kisan Shinde)",
    mobile: "9423001122",
    email: "rahul.shinde@gmail.com",
    aadhaarNo: "XXXX-XXXX-6510",
    address: "प्लॉट नं. १५, समर्थ कॉलनी, सोलापूर - ४१३००३",
    amount: 200,
    govFee: 107,
    processingFee: 93,
    paymentStatus: "SUCCESS",
    paymentMethod: "UPI_QR",
    utrNumber: "431401928371",
    status: "VERIFYING",
    createdAt: "2026-11-04T08:15:00Z",
    updatedAt: "2026-11-04T08:45:00Z",
    officerRemarks: "पेमेंट प्राप्त झाले. एनएसडीएल पोर्टलवर अर्ज सबमिट केला जात आहे.",
    documents: [
      { name: "Aadhaar Card", type: "pdf", fileName: "rahul_aadhaar.pdf", size: "390 KB" },
      { name: "Passport Photo", type: "jpg", fileName: "rahul_photo.jpg", size: "150 KB" },
      { name: "Signature", type: "jpg", fileName: "rahul_sign.jpg", size: "90 KB" }
    ],
    certificateUrl: null,
    certificateNo: null
  },
  {
    id: "app-1045",
    trackingId: "EOS-2026-1045",
    serviceId: "srv-caste-cert",
    serviceName: "Caste Certificate (OBC)",
    serviceNameMr: "जात प्रमाणपत्र (OBC)",
    applicantName: "प्रियांका विलास जाधव (Priyanka Vilas Jadhav)",
    mobile: "9765443322",
    email: "priyanka.j@yahoo.com",
    aadhaarNo: "XXXX-XXXX-4421",
    address: "मु. पो. तांदुळवाडी, ता. बारामती, जि. पुणे",
    amount: 150,
    govFee: 50,
    processingFee: 100,
    paymentStatus: "PENDING_VERIFICATION",
    paymentMethod: "UPI_QR",
    utrNumber: "431411223344",
    status: "PENDING",
    createdAt: "2026-11-04T10:30:00Z",
    updatedAt: "2026-11-04T10:30:00Z",
    officerRemarks: "अर्ज दाखल झाला आहे. केंद्र संचालक लवकरच युटीआर पडताळणी करतील.",
    documents: [
      { name: "Aadhaar Card", type: "pdf", fileName: "priyanka_aadhaar.pdf", size: "430 KB" },
      { name: "Father LC", type: "jpg", fileName: "father_school_lc.jpg", size: "780 KB" }
    ],
    certificateUrl: null,
    certificateNo: null
  }
];

// Initial Realistic Invoices
const INITIAL_INVOICES = [
  {
    invoiceNo: "INV-2026-001042",
    trackingId: "EOS-2026-1042",
    customerName: "सचिन दत्तात्रय पाटील (Sachin Dattatray Patil)",
    mobile: "9834005538",
    serviceName: "Income Certificate (1 & 3 Years) / तहसीलदार उत्पन्न दाखला",
    date: "2026-11-01",
    govFee: 33,
    processingFee: 67,
    totalAmount: 100,
    paymentMode: "UPI / QR Code",
    utrNumber: "431289410921",
    status: "PAID"
  },
  {
    invoiceNo: "INV-2026-001043",
    trackingId: "EOS-2026-1043",
    customerName: "सुनिता रमेश गायकवाड (Sunita Ramesh Gaikwad)",
    mobile: "9822114455",
    serviceName: "Mukhyamantri Majhi Ladki Bahin Yojana / लाडकी बहीण योजना",
    date: "2026-11-03",
    govFee: 0,
    processingFee: 60,
    totalAmount: 60,
    paymentMode: "UPI / QR Code",
    utrNumber: "431390192847",
    status: "PAID"
  },
  {
    invoiceNo: "INV-2026-001044",
    trackingId: "EOS-2026-1044",
    customerName: "राहुल किसन शिंदे (Rahul Kisan Shinde)",
    mobile: "9423001122",
    serviceName: "New PAN Card / नवीन पॅन कार्ड",
    date: "2026-11-04",
    govFee: 107,
    processingFee: 93,
    totalAmount: 200,
    paymentMode: "UPI / QR Code",
    utrNumber: "431401928371",
    status: "PAID"
  }
];

// Preloaded Users
const INITIAL_USERS = [
  {
    id: "usr-1",
    name: "सचिन पाटील (Sachin Patil)",
    mobile: "9834005538",
    password: "user123",
    createdAt: "2026-11-01T09:00:00Z"
  },
  {
    id: "usr-2",
    name: "सुनिता गायकवाड (Sunita Gaikwad)",
    mobile: "9822114455",
    password: "user123",
    createdAt: "2026-11-03T11:00:00Z"
  }
];

// Export to window/global scope
if (typeof window !== 'undefined') {
  window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
  window.DEFAULT_SERVICES = DEFAULT_SERVICES;
  window.INITIAL_APPLICATIONS = INITIAL_APPLICATIONS;
  window.INITIAL_INVOICES = INITIAL_INVOICES;
  window.INITIAL_USERS = INITIAL_USERS;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEFAULT_SETTINGS, DEFAULT_SERVICES, INITIAL_APPLICATIONS, INITIAL_INVOICES, INITIAL_USERS };
}


