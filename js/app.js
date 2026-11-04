/**
 * Easy Online Services (आपले सरकार व सीएससी महा-ई-सेवा केंद्र)
 * Main Application Controller
 * Helpline: 9834005538
 */

const App = {
  state: {
    lang: 'mr', // 'mr' or 'en'
    activeTab: 'home', // 'home', 'services', 'track', 'apply', 'dashboard', 'admin', 'invoices', 'contact', 'terms'
    selectedCategory: 'all',
    searchQuery: '',
    selectedService: null,
    applyStep: 1, // 1: Info, 2: Docs, 3: Payment, 4: Success
    applyData: {
      applicantName: '',
      mobile: '',
      email: '',
      aadhaarNo: '',
      address: '',
      taluka: '',
      district: 'पुणे',
      pincode: '',
      serviceId: '',
      utrNumber: '',
      notes: ''
    },
    uploadedDocs: {}, // docName -> { name, type, size, dataUrl }
    paymentScreenshot: null,
    lastCreatedTrackingId: null,
    currentUser: null,
    isAdmin: false,
    adminSubTab: 'apps', // 'apps', 'services', 'bank', 'invoices', 'notices'
    statusFilter: 'all',
    adminSearchQuery: '',
    activeModal: null, // 'auth', 'docPreview', 'invoiceModal', 'certModal', 'serviceModal'
    authMode: 'login', // 'login', 'register'
    otpSent: false,
    generatedOtp: '123456',
    previewDoc: null,
    selectedInvoice: null,
    selectedCertApp: null,
    editingService: null
  },

  // Multi-language strings
  i18n: {
    mr: {
      kendraTitle: "इझी ऑनलाईन सर्व्हिसेस",
      kendraSub: "आपले सरकार व सीएससी महा-ई-सेवा केंद्र",
      helpline: "हेल्पलाईन",
      callUs: "कॉल करा",
      home: "मुख्यपृष्ठ",
      services: "सर्व सेवा",
      track: "अर्ज स्थिती ट्रॅक करा",
      dashboard: "नागरिक डॅशबोर्ड",
      adminPortal: "प्रशासकीय पोर्टल (Admin)",
      invoices: "पावती / इन्व्हॉईस",
      contact: "संपर्क केंद्र",
      login: "लॉगिन",
      register: "नवीन नोंदणी",
      logout: "बाहेर पडा",
      applyNow: "ऑनलाइन अर्ज करा",
      viewDetails: "तपशील पहा",
      govFee: "शासकीय शुल्क",
      procFee: "केंद्र सेवा शुल्क",
      totalFee: "एकूण शुल्क",
      deliveryTime: "अपेक्षित कालावधी",
      reqDocs: "लागणारी कागदपत्रे",
      trackPlaceholder: "१० अंकी ट्रॅकिंग नंबर किंवा मोबाईल टाका (उदा. EOS-2026-1042)",
      trackBtn: "स्थिती तपासा",
      statusPending: "अर्ज दाखल",
      statusVerifying: "पडताळणी सुरू",
      statusProcessing: "शासकीय प्रक्रियेत",
      statusApproved: "मंजूर (दाखला तयार)",
      statusRejected: "त्रुटी / नामंजूर",
      downloadCert: "दाखला डाउनलोड करा",
      downloadReceipt: "पावती डाऊनलोड",
      uploadPrompt: "PDF किंवा JPG फाइल निवडा (कमाल 5 MB)",
      payUpi: "UPI / QR कोडने पेमेंट करा",
      scanQr: "खालील QR कोड कोणत्याही UPI App ने स्कॅन करून रक्कम भरा",
      enterUtr: "१२ अंकी UPI UTR / संदर्भ क्रमांक टाका",
      copyright: "© २०२६ Easy Online Services. सर्व हक्क स्वाधीन. केंद्र संचालक: ९८३४००५५३८"
    },
    en: {
      kendraTitle: "Easy Online Services",
      kendraSub: "Aaple Sarkar & CSC Maha-E-Seva Kendra",
      helpline: "Helpline",
      callUs: "Call Us",
      home: "Home",
      services: "All Services",
      track: "Track Application",
      dashboard: "Citizen Dashboard",
      adminPortal: "Admin Portal",
      invoices: "Invoices & Receipts",
      contact: "Contact Kendra",
      login: "Login",
      register: "Register",
      logout: "Logout",
      applyNow: "Apply Online",
      viewDetails: "View Details",
      govFee: "Govt Fee",
      procFee: "Service Charge",
      totalFee: "Total Amount",
      deliveryTime: "Turnaround Time",
      reqDocs: "Required Documents",
      trackPlaceholder: "Enter 10-digit Tracking ID or Mobile (e.g. EOS-2026-1042)",
      trackBtn: "Track Status",
      statusPending: "Submitted",
      statusVerifying: "Verifying Docs",
      statusProcessing: "In Department Process",
      statusApproved: "Approved (Ready)",
      statusRejected: "Rejected / Defect",
      downloadCert: "Download Certificate",
      downloadReceipt: "Download Receipt",
      uploadPrompt: "Upload PDF or JPG file (Max 5 MB)",
      payUpi: "Pay via UPI / QR Code",
      scanQr: "Scan the QR code below using any UPI App to pay",
      enterUtr: "Enter 12-digit UPI UTR / Ref Number",
      copyright: "© 2026 Easy Online Services. All Rights Reserved. Owner Helpline: 9834005538"
    }
  },

  t(key) {
    const lang = this.state.lang;
    return (this.i18n[lang] && this.i18n[lang][key]) || (this.i18n['en'][key] || key);
  },

  init() {
    this.state.lang = StorageManager.getLanguage();
    this.state.currentUser = StorageManager.getCurrentUser();
    this.state.isAdmin = StorageManager.isAdmin();

    // Check URL query parameters (e.g., ?track=EOS-2026-1042)
    const urlParams = new URLSearchParams(window.location.search);
    const trackParam = urlParams.get('track');
    if (trackParam) {
      this.state.activeTab = 'track';
      this.state.searchQuery = trackParam;
    }

    this.render();
    this.setupEventListeners();
  },

  switchLanguage(lang) {
    this.state.lang = lang;
    StorageManager.setLanguage(lang);
    this.render();
  },

  navigate(tab, param = null) {
    this.state.activeTab = tab;
    if (tab === 'apply' && param) {
      const srv = StorageManager.getServiceById(param);
      if (srv) {
        this.startApplication(srv);
        return;
      }
    }
    if (tab === 'track' && param) {
      this.state.searchQuery = param;
    }
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  startApplication(service) {
    this.state.selectedService = service;
    this.state.applyStep = 1;
    this.state.uploadedDocs = {};
    this.state.paymentScreenshot = null;
    this.state.applyData.serviceId = service.id;

    // Prefill user details if logged in
    if (this.state.currentUser) {
      this.state.applyData.applicantName = this.state.currentUser.name || '';
      this.state.applyData.mobile = this.state.currentUser.mobile || '';
    }

    this.state.activeTab = 'apply';
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Document Upload Handlers (PDF & JPG/PNG)
  handleFileUpload(docName, fileInput) {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("फाइल आकार ५ MB पेक्षा कमी असावा. (File size must be under 5 MB)");
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png)$/i);

    if (!isPdf && !isImage) {
      alert("कृपया केवळ PDF किंवा JPG/PNG फॉरमॅटमधील फाइल अपलोड करा. (Please upload only PDF or JPG/PNG files)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.state.uploadedDocs[docName] = {
        name: docName,
        fileName: file.name,
        type: isPdf ? 'pdf' : 'jpg',
        size: (file.size / 1024).toFixed(1) + ' KB',
        dataUrl: e.target.result
      };
      this.render();
    };
    reader.readAsDataURL(file);
  },

  removeUploadedDoc(docName) {
    delete this.state.uploadedDocs[docName];
    this.render();
  },

  previewDocument(doc) {
    this.state.previewDoc = doc;
    this.state.activeModal = 'docPreview';
    this.render();
  },

  // Submit Application
  submitApplication() {
    const { applyData, selectedService, uploadedDocs } = this.state;

    if (!applyData.applicantName.trim()) {
      alert("कृपया अर्जदाराचे पूर्ण नाव प्रविष्ट करा. (Please enter full name)");
      return;
    }
    if (!applyData.mobile.trim() || applyData.mobile.length < 10) {
      alert("कृपया वैध १० अंकी मोबाईल नंबर प्रविष्ट करा. (Please enter valid 10-digit mobile number)");
      return;
    }
    if (!applyData.utrNumber.trim()) {
      alert("कृपया भरलेल्या रकमेचा १२ अंकी UPI UTR / Transaction नंबर टाका. (Please enter 12-digit UPI UTR number)");
      return;
    }

    // Generate unique Tracking Number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `EOS-2026-${randomSuffix}`;

    const newApp = {
      id: `app-${Date.now()}`,
      trackingId: trackingId,
      serviceId: selectedService.id,
      serviceName: selectedService.titleEn,
      serviceNameMr: selectedService.titleMr,
      applicantName: applyData.applicantName.trim(),
      mobile: applyData.mobile.trim(),
      email: applyData.email.trim(),
      aadhaarNo: applyData.aadhaarNo.trim() || 'NOT_PROVIDED',
      address: `${applyData.address || ''}, Tal: ${applyData.taluka || ''}, Dist: ${applyData.district || ''}, Pin: ${applyData.pincode || ''}`,
      amount: selectedService.totalFee,
      govFee: selectedService.govFee,
      processingFee: selectedService.processingFee,
      paymentStatus: 'PENDING_VERIFICATION',
      paymentMethod: 'UPI_QR',
      utrNumber: applyData.utrNumber.trim(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      officerRemarks: 'अर्ज व पेमेंट संदर्भ यशस्वीरित्या दाखल झाले आहे. केंद्र संचालक लवकरच तपासणी करतील.',
      documents: Object.values(uploadedDocs).map(d => ({
        name: d.name,
        type: d.type,
        fileName: d.fileName,
        size: d.size,
        dataUrl: d.dataUrl
      })),
      certificateUrl: null,
      certificateNo: null
    };

    StorageManager.addApplication(newApp);
    this.state.lastCreatedTrackingId = trackingId;
    this.state.applyStep = 4; // Success screen

    // Trigger celebratory confetti
    if (window.confetti) {
      window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Auth Management
  handleCustomerLogin(mobile, password) {
    const user = StorageManager.findUser(mobile);
    if (!user || user.password !== password) {
      alert("चुकीचा मोबाईल नंबर किंवा पासवर्ड! (Invalid mobile number or password)");
      return false;
    }
    this.state.currentUser = user;
    StorageManager.setCurrentUser(user);
    this.state.activeModal = null;
    alert(`स्वागत आहे, ${user.name}! (Welcome!)`);
    this.render();
    return true;
  },

  handleCustomerRegister(name, mobile, password, otp) {
    if (!name.trim() || mobile.length < 10 || !password) {
      alert("कृपया सर्व माहिती अचूक भरा. (Please fill all fields)");
      return false;
    }
    if (otp !== this.state.generatedOtp && otp !== '123456') {
      alert("चुकीचा OTP प्रविष्ट केला आहे! (Invalid OTP. Use Demo OTP: 123456)");
      return false;
    }
    if (StorageManager.findUser(mobile)) {
      alert("हा मोबाईल नंबर आधीच नोंदणीकृत आहे. कृपया लॉगिन करा. (Mobile already registered. Please login)");
      return false;
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      mobile: mobile.trim(),
      password: password,
      createdAt: new Date().toISOString()
    };
    StorageManager.addUser(newUser);
    this.state.currentUser = newUser;
    StorageManager.setCurrentUser(newUser);
    this.state.activeModal = null;
    alert("अभिनंदन! आपले खाते यशस्वीरित्या तयार झाले आहे. (Registration Successful!)");
    this.render();
    return true;
  },

  logoutUser() {
    this.state.currentUser = null;
    StorageManager.setCurrentUser(null);
    this.navigate('home');
  },

  // Admin Authentication
  loginAdmin(username, password) {
    if (username === 'admin' && password === 'admin123') {
      this.state.isAdmin = true;
      StorageManager.setAdmin(true);
      this.navigate('admin');
      return true;
    } else {
      alert("चुकीचे ॲडमिन क्रेडेंशियल्स! (Invalid Admin Credentials. Default: admin / admin123)");
      return false;
    }
  },

  logoutAdmin() {
    this.state.isAdmin = false;
    StorageManager.setAdmin(false);
    this.navigate('home');
  },

  // Admin Actions
  updateAppStatus(appId, newStatus, newRemarks) {
    const apps = StorageManager.getApplications();
    const app = apps.find(a => a.id === appId);
    if (!app) return;

    app.status = newStatus;
    if (newRemarks) app.officerRemarks = newRemarks;
    app.updatedAt = new Date().toISOString();

    if (newStatus === 'APPROVED' && !app.certificateNo) {
      app.certificateNo = `MH/EOS/${new Date().getFullYear()}/${app.trackingId.replace('EOS-2026-', '')}`;
      app.paymentStatus = 'SUCCESS';
    }

    StorageManager.updateApplication(app);
    alert(`अर्जाची स्थिती यशस्वीरित्या '${newStatus}' मध्ये बदलण्यात आली आहे.`);
    this.render();
  },

  // Admin Service Fee & Data Management
  saveServiceChanges(serviceObj) {
    StorageManager.updateService(serviceObj);
    this.state.editingService = null;
    this.state.activeModal = null;
    alert("सेवेची माहिती व दर यशस्वीरित्या अपडेट करण्यात आले! (Service updated successfully)");
    this.render();
  },

  deleteService(serviceId) {
    if (confirm("तुम्हाला खात्री आहे की ही सेवा काढून टाकायची आहे? (Are you sure you want to delete this service?)")) {
      StorageManager.deleteService(serviceId);
      this.render();
    }
  },

  // Print Utility
  printSection(elementId) {
    window.print();
  },

  // Setup DOM Event Listeners
  setupEventListeners() {
    document.addEventListener('click', (e) => {
      // Close modal when clicking outside modal-box
      if (e.target.classList.contains('modal-backdrop')) {
        this.state.activeModal = null;
        this.render();
      }
    });
  },

  // Main Render Function
  render() {
    const root = document.getElementById('app-root');
    if (!root) return;

    const settings = StorageManager.getSettings();
    const t = this.t.bind(this);

    root.innerHTML = `
      <!-- Top Tiranga Stripe -->
      <div class="tiranga-stripe"></div>

      <!-- Top Utility Bar -->
      ${this.renderTopBar(settings)}

      <!-- Main Navigation -->
      ${this.renderNavbar(settings)}

      <!-- Flash News Ticker -->
      ${this.renderNoticeTicker(settings)}

      <!-- Main Content Dynamic View -->
      <main class="min-h-screen pb-16">
        ${this.renderActiveTab(settings)}
      </main>

      <!-- Floating Quick Helpline & WhatsApp Widget -->
      ${this.renderFloatingHelpline(settings)}

      <!-- Footer Section -->
      ${this.renderFooter(settings)}

      <!-- Dynamic Modals Container -->
      ${this.renderModals(settings)}

      <!-- Hidden Print Area for Invoices & Certificates -->
      <div id="print-section" class="hidden"></div>
    `;

    // Render Canvas QR codes if present
    this.postRender();
  },

  postRender() {
    // If on payment step, render the dynamic UPI QR
    const qrCanvas = document.getElementById('upi-qr-canvas');
    if (qrCanvas && this.state.selectedService) {
      const settings = StorageManager.getSettings();
      const upiString = QRUtil.generateUpiString({
        upiId: settings.upiId,
        payeeName: settings.kendraName,
        amount: this.state.selectedService.totalFee,
        trackingId: this.state.lastCreatedTrackingId || 'NEW_APP',
        note: `EasyOnline-${this.state.selectedService.titleEn.substring(0, 15)}`
      });
      QRUtil.renderOnCanvas(qrCanvas, upiString, { width: 200 });
    }

    // If modal has verification QR
    const certQr = document.getElementById('cert-verify-qr');
    if (certQr && this.state.selectedCertApp) {
      const app = this.state.selectedCertApp;
      const verifyUrl = `${window.location.origin}${window.location.pathname}?track=${app.trackingId}`;
      QRUtil.renderOnCanvas(certQr, verifyUrl, { width: 110 });
    }

    // If invoice QR
    const invQr = document.getElementById('invoice-verify-qr');
    if (invQr && this.state.selectedInvoice) {
      const inv = this.state.selectedInvoice;
      const text = `INVOICE:${inv.invoiceNo}|TRACK:${inv.trackingId}|AMT:Rs.${inv.totalAmount}|DATE:${inv.date}|KENDRA:${StorageManager.getSettings().kendraId}`;
      QRUtil.renderOnCanvas(invQr, text, { width: 100 });
    }

    // Refresh Lucide SVG icons if available
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  // ---------------- UI SECTIONS ---------------- //

  renderTopBar(settings) {
    return `
      <div class="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1 font-semibold text-amber-400">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
              अधिकृत आपले सरकार व CSC महा-ई-सेवा केंद्र
            </span>
            <span class="hidden md:inline-block text-slate-400">|</span>
            <span class="hidden md:inline-flex items-center gap-1 text-slate-300">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i>
              ${settings.workingHours}
            </span>
          </div>

          <div class="flex items-center gap-4">
            <!-- Customer Care Helpline Click-to-Call -->
            <a href="tel:${settings.phone}" class="flex items-center gap-1.5 text-white font-bold bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded transition-colors shadow-sm">
              <i data-lucide="phone-call" class="w-3.5 h-3.5 animate-pulse"></i>
              <span>हेल्पलाईन: ${settings.phone}</span>
            </a>

            <!-- Language Switcher -->
            <div class="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700">
              <button onclick="App.switchLanguage('mr')" class="px-2 py-0.5 rounded text-xs font-medium transition ${this.state.lang === 'mr' ? 'bg-orange-600 text-white shadow' : 'text-slate-300 hover:text-white'}">
                मराठी
              </button>
              <button onclick="App.switchLanguage('en')" class="px-2 py-0.5 rounded text-xs font-medium transition ${this.state.lang === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'}">
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderNavbar(settings) {
    const isMr = this.state.lang === 'mr';
    const active = this.state.activeTab;

    return `
      <header class="bg-white sticky top-0 z-30 shadow-md border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <!-- Logo & Branding -->
          <div onclick="App.navigate('home')" class="flex items-center gap-3 cursor-pointer group">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-800 flex items-center justify-center text-white shadow-md border-2 border-orange-500 group-hover:scale-105 transition-transform">
              <span class="text-2xl font-black tracking-tighter text-amber-400">EOS</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-700 transition">
                  ${settings.kendraName}
                </h1>
                <span class="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-300">
                  CSC & SETU
                </span>
              </div>
              <p class="text-xs text-slate-600 font-medium mt-0.5">
                ${isMr ? settings.kendraTagline : 'Aaple Sarkar & CSC Citizen Service Portal'}
              </p>
            </div>
          </div>

          <!-- Desktop Navigation Links -->
          <nav class="hidden lg:flex items-center gap-1">
            <button onclick="App.navigate('home')" class="px-3 py-2 rounded-lg text-sm font-semibold transition ${active === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}">
              ${this.t('home')}
            </button>
            <button onclick="App.navigate('services')" class="px-3 py-2 rounded-lg text-sm font-semibold transition ${active === 'services' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}">
              ${this.t('services')}
            </button>
            <button onclick="App.navigate('track')" class="px-3 py-2 rounded-lg text-sm font-semibold transition ${active === 'track' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-700 hover:bg-slate-100'}">
              <span class="flex items-center gap-1.5">
                <i data-lucide="compass" class="w-4 h-4 text-orange-500"></i>
                ${this.t('track')}
              </span>
            </button>
            <button onclick="App.navigate('invoices')" class="px-3 py-2 rounded-lg text-sm font-semibold transition ${active === 'invoices' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}">
              ${this.t('invoices')}
            </button>
            <button onclick="App.navigate('contact')" class="px-3 py-2 rounded-lg text-sm font-semibold transition ${active === 'contact' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}">
              ${this.t('contact')}
            </button>
          </nav>

          <!-- User / Admin Actions -->
          <div class="flex items-center gap-2">
            ${this.state.currentUser ? `
              <button onclick="App.navigate('dashboard')" class="flex items-center gap-2 bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow hover:bg-blue-800 transition">
                <i data-lucide="user" class="w-4 h-4"></i>
                <span>${this.state.currentUser.name.split(' ')[0]}</span>
              </button>
              <button onclick="App.logoutUser()" title="Logout" class="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                <i data-lucide="log-out" class="w-4 h-4"></i>
              </button>
            ` : `
              <button onclick="App.state.activeModal = 'auth'; App.state.authMode = 'login'; App.render();" class="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-lg text-xs font-bold transition border border-slate-300">
                <i data-lucide="user-check" class="w-4 h-4 text-blue-600"></i>
                <span>${this.t('login')} / ${this.t('register')}</span>
              </button>
            `}

            <!-- Admin Portal Direct Button -->
            <button onclick="App.state.isAdmin ? App.navigate('admin') : (App.state.activeModal = 'adminLogin', App.render())" class="flex items-center gap-1.5 ${this.state.isAdmin ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-amber-400'} px-3 py-2 rounded-lg text-xs font-bold transition shadow-sm border border-slate-700">
              <i data-lucide="shield" class="w-4 h-4"></i>
              <span>${this.state.isAdmin ? 'ॲडमिन पॅनेल' : 'Admin'}</span>
            </button>

            <!-- Mobile Menu Toggle Button -->
            <button onclick="document.getElementById('mobile-drawer').classList.toggle('hidden')" class="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg">
              <i data-lucide="menu" class="w-6 h-6"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer Menu -->
        <div id="mobile-drawer" class="hidden lg:hidden bg-slate-50 border-t border-slate-200 px-4 py-3 space-y-2">
          <button onclick="App.navigate('home')" class="w-full text-left px-3 py-2 rounded-md font-semibold text-slate-800 hover:bg-white">${this.t('home')}</button>
          <button onclick="App.navigate('services')" class="w-full text-left px-3 py-2 rounded-md font-semibold text-slate-800 hover:bg-white">${this.t('services')}</button>
          <button onclick="App.navigate('track')" class="w-full text-left px-3 py-2 rounded-md font-semibold text-orange-600 hover:bg-white font-bold">${this.t('track')}</button>
          <button onclick="App.navigate('invoices')" class="w-full text-left px-3 py-2 rounded-md font-semibold text-slate-800 hover:bg-white">${this.t('invoices')}</button>
          <button onclick="App.navigate('contact')" class="w-full text-left px-3 py-2 rounded-md font-semibold text-slate-800 hover:bg-white">${this.t('contact')}</button>
          <div class="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span class="text-xs text-slate-500 font-medium">Customer Care:</span>
            <a href="tel:${settings.phone}" class="font-bold text-blue-700">${settings.phone}</a>
          </div>
        </div>
      </header>
    `;
  },

  renderNoticeTicker(settings) {
    return `
      <div class="bg-amber-500 text-slate-950 font-semibold text-xs py-2 px-4 shadow-sm flex items-center gap-2 border-b border-amber-600">
        <span class="bg-red-600 text-white text-[11px] font-black uppercase px-2 py-0.5 rounded shadow-sm tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
          <i data-lucide="bell-ring" class="w-3 h-3"></i>
          सूचना
        </span>
        <div class="marquee-container w-full overflow-hidden">
          <div class="marquee-content font-bold">
            ${settings.noticeText}
          </div>
        </div>
      </div>
    `;
  },

  renderFloatingHelpline(settings) {
    return `
      <div class="floating-helpline flex flex-col gap-2">
        <!-- Direct WhatsApp Chat -->
        <a href="https://wa.me/91${settings.phone}?text=${encodeURIComponent('नमस्कार! मला Easy Online Services वरून सेवेसाठी माहिती हवी आहे.')}" target="_blank" rel="noopener" class="bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110" title="WhatsApp वर बोला">
          <i data-lucide="message-circle" class="w-6 h-6"></i>
        </a>
        <!-- Direct Phone Call -->
        <a href="tel:${settings.phone}" class="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110" title="थेट कॉल करा: ${settings.phone}">
          <i data-lucide="phone" class="w-6 h-6"></i>
        </a>
      </div>
    `;
  },

  renderFooter(settings) {
    return `
      <footer class="bg-slate-950 text-slate-300 pt-12 pb-8 border-t-4 border-orange-500">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <!-- Col 1: About & Authoritative Badges -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-xl">
                EOS
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">${settings.kendraName}</h3>
                <p class="text-xs text-orange-400 font-semibold">${settings.kendraTagline}</p>
              </div>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed mb-4">
              सर्व प्रकारचे शासकीय दाखले, शेतकरी योजना, पॅन कार्ड, आधार सेवा व महाडीबीटी शिष्यवृत्ती घरबसल्या अचूक व जलद गतीने मिळवा.
            </p>
            <div class="text-xs space-y-1.5 text-slate-400">
              <p><strong class="text-white">CSC Kendra ID:</strong> ${settings.kendraId}</p>
              <p><strong class="text-white">Aaple Sarkar ID:</strong> ${settings.aapleSarkarId}</p>
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              महत्वाच्या सेवा (Popular Services)
            </h4>
            <ul class="text-xs space-y-2.5">
              <li><a href="javascript:void(0)" onclick="App.navigate('apply', 'srv-income-cert')" class="hover:text-amber-400 transition">तहसीलदार उत्पन्न दाखला (Income Certificate)</a></li>
              <li><a href="javascript:void(0)" onclick="App.navigate('apply', 'srv-caste-cert')" class="hover:text-amber-400 transition">जात प्रमाणपत्र (Caste Certificate)</a></li>
              <li><a href="javascript:void(0)" onclick="App.navigate('apply', 'srv-domicile-cert')" class="hover:text-amber-400 transition">अधिवास प्रमाणपत्र (Domicile)</a></li>
              <li><a href="javascript:void(0)" onclick="App.navigate('apply', 'srv-ladki-bahin')" class="hover:text-amber-400 transition">मुख्यमंत्री लाडकी बहीण योजना</a></li>
              <li><a href="javascript:void(0)" onclick="App.navigate('apply', 'srv-pan-card')" class="hover:text-amber-400 transition">नवीन पॅन कार्ड / पॅन दुरुस्ती</a></li>
              <li><a href="javascript:void(0)" onclick="App.navigate('apply', 'srv-712-extract')" class="hover:text-amber-400 transition">डिजिटल स्वाक्षरी ७/१२ उतारा</a></li>
            </ul>
          </div>

          <!-- Col 3: Customer Care & Bank Information -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              ग्राहक सहाय्यता (Help & Bank)
            </h4>
            <div class="space-y-3 text-xs text-slate-300">
              <div class="flex items-start gap-2.5">
                <i data-lucide="phone-call" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"></i>
                <div>
                  <div class="font-bold text-white">कस्टमर केअर नंबर:</div>
                  <a href="tel:${settings.phone}" class="text-amber-400 text-sm font-black hover:underline">${settings.phone}</a>
                </div>
              </div>
              <div class="flex items-start gap-2.5">
                <i data-lucide="map-pin" class="w-4 h-4 text-orange-400 shrink-0 mt-0.5"></i>
                <div class="text-slate-400">
                  ${settings.address}
                </div>
              </div>
              <div class="flex items-start gap-2.5">
                <i data-lucide="qr-code" class="w-4 h-4 text-blue-400 shrink-0 mt-0.5"></i>
                <div>
                  <div class="font-semibold text-white">अधिकृत UPI आयडी:</div>
                  <code class="text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded">${settings.upiId}</code>
                </div>
              </div>
            </div>
          </div>

          <!-- Col 4: Legal & Copyright Protection -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              कायदेशीर संरक्षण (Legal Rights)
            </h4>
            <p class="text-[11px] text-slate-400 leading-relaxed mb-3">
              या संकेतस्थळावरील सर्व सॉफ्टवेअर, डेटा, लोगो व सेवांचे कॉपीराइट्स <strong>Easy Online Services</strong> कडे राखीव आहेत. विनापरवानगी कॉपी किंवा गैरवापर केल्यास भारतीय कॉपीराइट कायदा १९५७ नुसार दंडात्मक कारवाई होऊ शकते.
            </p>
            <div class="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div class="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                <i data-lucide="lock" class="w-3.5 h-3.5"></i>
                <span>सुरक्षित व अधिकृत पोर्टल</span>
              </div>
              <p class="text-[10px] text-slate-500">256-Bit SSL Secured • Digital Signatures Verified</p>
            </div>
          </div>
        </div>

        <!-- Copyright Bottom Notice -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            ${settings.copyrightNotice}
          </div>
          <div class="flex items-center gap-4">
            <button onclick="App.navigate('terms')" class="hover:text-slate-300">नियम व अटी (Terms)</button>
            <span>•</span>
            <button onclick="App.navigate('contact')" class="hover:text-slate-300">तक्रार निवारण</button>
            <span>•</span>
            <button onclick="App.state.isAdmin ? App.navigate('admin') : (App.state.activeModal = 'adminLogin', App.render())" class="text-amber-500 font-bold hover:underline">प्रशासक लॉगिन (Admin)</button>
          </div>
        </div>
      </footer>
    `;
  },

  // ---------------- VIEW ROUTER ---------------- //

  renderActiveTab(settings) {
    switch (this.state.activeTab) {
      case 'home':
        return this.renderHomeView(settings);
      case 'services':
        return this.renderServicesView(settings);
      case 'track':
        return this.renderTrackView(settings);
      case 'apply':
        return this.renderApplyView(settings);
      case 'dashboard':
        return this.renderDashboardView(settings);
      case 'admin':
        return this.renderAdminView(settings);
      case 'invoices':
        return this.renderInvoicesView(settings);
      case 'contact':
        return this.renderContactView(settings);
      case 'terms':
        return this.renderTermsView(settings);
      default:
        return this.renderHomeView(settings);
    }
  },

  // ---------------- HOME VIEW ---------------- //

  renderHomeView(settings) {
    const isMr = this.state.lang === 'mr';
    const services = StorageManager.getServices().filter(s => s.active);

    return `
      <!-- Hero Section -->
      <section class="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div class="absolute inset-0 gov-watermark pointer-events-none"></div>

        <div class="max-w-6xl mx-auto text-center relative z-10">
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-emerald-500/20 border border-orange-500/40 rounded-full px-4 py-1.5 text-xs font-semibold text-amber-300 mb-6">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            महाराष्ट्र शासन अधिकृत आपले सरकार सेतू व सीएससी सेवा केंद्र
          </div>

          <h2 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
            सर्व सरकारी दाखले व योजना आता <br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
              घरबसल्या मोबाईलवर मिळवा!
            </span>
          </h2>

          <p class="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
            तहसीलदार उत्पन्न दाखला, जात प्रमाणपत्र, अधिवास (डोमिसाईल), लाडकी बहीण योजना, पीएम किसान, नवीन पॅन कार्ड व डिजिटल ७/१२ उतारा घरबसल्या प्राप्त करा.
          </p>

          <!-- Hero Search & Instant Track Bar -->
          <div class="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border-2 border-orange-400/50">
            <div class="flex items-center gap-2 px-3 py-2 w-full">
              <i data-lucide="search" class="w-5 h-5 text-slate-400 shrink-0"></i>
              <input 
                id="hero-track-input"
                type="text" 
                placeholder="${this.t('trackPlaceholder')}" 
                class="w-full text-slate-900 text-sm focus:outline-none font-medium placeholder-slate-400"
                onkeypress="if(event.key === 'Enter') { App.navigate('track', this.value); }"
              />
            </div>
            <button 
              onclick="App.navigate('track', document.getElementById('hero-track-input').value)" 
              class="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              <i data-lucide="compass" class="w-4 h-4"></i>
              <span>${this.t('trackBtn')}</span>
            </button>
          </div>

          <!-- Trust Badges Bar -->
          <div class="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div class="bg-white/5 border border-white/10 backdrop-blur rounded-xl p-3">
              <div class="text-2xl font-black text-amber-400">100%</div>
              <div class="text-xs text-slate-300 font-medium">अधिकृत डिजिटल दाखले</div>
            </div>
            <div class="bg-white/5 border border-white/10 backdrop-blur rounded-xl p-3">
              <div class="text-2xl font-black text-emerald-400">24-48 तास</div>
              <div class="text-xs text-slate-300 font-medium">वेगवान सेवा वितरण</div>
            </div>
            <div class="bg-white/5 border border-white/10 backdrop-blur rounded-xl p-3">
              <div class="text-2xl font-black text-blue-400">QR / UPI</div>
              <div class="text-xs text-slate-300 font-medium">सुरक्षित बँक पेमेंट</div>
            </div>
            <div class="bg-white/5 border border-white/10 backdrop-blur rounded-xl p-3">
              <div class="text-2xl font-black text-orange-400">${settings.phone}</div>
              <div class="text-xs text-slate-300 font-medium">हेल्पलाईन सपोर्ट</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Category Tabs & Popular Services Grid -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              सर्व शासकीय सेवा
            </div>
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              आपले सरकार व सीएससी केंद्र सुविधा
            </h3>
          </div>

          <!-- Category Filter Pills -->
          <div class="flex flex-wrap items-center gap-2">
            ${[
              { id: 'all', label: 'सर्व सेवा (All)' },
              { id: 'revenue', label: 'महसूल दाखले (Revenue)' },
              { id: 'identity', label: 'ओळखपत्र (Identity)' },
              { id: 'welfare', label: 'योजना व पेन्शन (Welfare)' },
              { id: 'farmer', label: 'शेतकरी (Farmer)' },
              { id: 'business', label: 'व्यवसाय (Business)' }
            ].map(cat => `
              <button 
                onclick="App.state.selectedCategory = '${cat.id}'; App.render();" 
                class="px-3.5 py-1.5 rounded-full text-xs font-bold transition ${this.state.selectedCategory === cat.id ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}"
              >
                ${cat.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Services Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${this.getFilteredServices().map(service => this.renderServiceCard(service)).join('')}
        </div>
      </section>

      <!-- How It Works (4 Easy Steps) -->
      <section class="bg-slate-100 py-16 px-4 sm:px-6 border-y border-slate-200">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <span class="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
              सोपी कार्यपद्धती
            </span>
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              फक्त ४ सोप्या टप्प्यांत दाखला मिळवा
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center relative">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xl mx-auto mb-4">
                १
              </div>
              <h4 class="font-bold text-slate-900 mb-2">सेवा निवडा</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                हव्या असलेल्या दाखल्याची किंवा योजनेची निवड करून माहिती भरा.
              </p>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center relative">
              <div class="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center font-black text-xl mx-auto mb-4">
                २
              </div>
              <h4 class="font-bold text-slate-900 mb-2">कागदपत्रे अपलोड करा</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                आधार, रेशन कार्ड इत्यादी आवश्यक कागदपत्रे PDF किंवा JPG मध्ये अपलोड करा.
              </p>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center relative">
              <div class="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-xl mx-auto mb-4">
                ३
              </div>
              <h4 class="font-bold text-slate-900 mb-2">QR कोडने पेमेंट करा</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                बँक QR कोड स्कॅन करून UPI द्वारे सुरक्षित शुल्क भरा व UTR नंबर टाका.
              </p>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center relative">
              <div class="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-xl mx-auto mb-4">
                ४
              </div>
              <h4 class="font-bold text-slate-900 mb-2">दाखला डाउनलोड करा</h4>
              <p class="text-xs text-slate-600 leading-relaxed">
                ट्रॅकिंग नंबर द्वारे स्थिती तपासा व डिजिटल स्वाक्षरी दाखला डाउनलोड करा.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Customer Care & Helpline Callout Banner -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 my-12">
        <div class="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-orange-500">
          <div class="space-y-2 text-center md:text-left">
            <span class="bg-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
              २४/७ सहाय्यता
            </span>
            <h3 class="text-2xl sm:text-3xl font-black">
              कागदपत्रांबद्दल शंका आहे का? आम्हाला कॉल करा!
            </h3>
            <p class="text-sm text-slate-300">
              आमचे अधिकृत सेतू केंद्र संचालक आपल्याला संपूर्ण अर्ज प्रक्रियेत मोफत मार्गदर्शन करतील.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a href="tel:${settings.phone}" class="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2 text-base transition">
              <i data-lucide="phone-call" class="w-5 h-5"></i>
              <span>${settings.phone}</span>
            </a>
            <a href="https://wa.me/91${settings.phone}" target="_blank" class="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 flex items-center gap-2 text-sm transition">
              <i data-lucide="message-square" class="w-4 h-4 text-emerald-400"></i>
              <span>WhatsApp करा</span>
            </a>
          </div>
        </div>
      </section>
    `;
  },

  getFilteredServices() {
    const list = StorageManager.getServices().filter(s => s.active);
    const cat = this.state.selectedCategory;
    const query = (this.state.searchQuery || '').toLowerCase().trim();

    return list.filter(srv => {
      const matchCat = cat === 'all' || srv.category === cat;
      const matchQuery = !query || 
        srv.titleEn.toLowerCase().includes(query) ||
        srv.titleMr.toLowerCase().includes(query) ||
        srv.descEn.toLowerCase().includes(query) ||
        srv.descMr.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  },

  renderServiceCard(service) {
    const isMr = this.state.lang === 'mr';

    return `
      <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col justify-between group hover:-translate-y-1">
        <div class="p-6">
          <div class="flex items-start justify-between gap-3 mb-3">
            <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
              <i data-lucide="tag" class="w-3 h-3"></i>
              ${service.category.toUpperCase()}
            </span>
            <span class="text-xs text-slate-500 flex items-center gap-1 font-semibold">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-orange-500"></i>
              ${service.days}
            </span>
          </div>

          <h4 class="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug mb-2">
            ${isMr ? service.titleMr : service.titleEn}
          </h4>
          <p class="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
            ${isMr ? service.descMr : service.descEn}
          </p>

          <!-- Required Docs Snippet -->
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 mb-4">
            <div class="font-bold text-slate-800 mb-1 flex items-center gap-1">
              <i data-lucide="file-check-2" class="w-3.5 h-3.5 text-emerald-600"></i>
              आवश्यक कागदपत्रे (${service.requiredDocs.length}):
            </div>
            <ul class="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
              ${service.requiredDocs.slice(0, 2).map(doc => `<li>${doc}</li>`).join('')}
              ${service.requiredDocs.length > 2 ? `<li class="text-blue-600 font-semibold">+ इतर ${service.requiredDocs.length - 2} कागदपत्रे</li>` : ''}
            </ul>
          </div>
        </div>

        <!-- Pricing & Action Footer -->
        <div class="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div class="text-[10px] text-slate-500 font-bold uppercase">एकूण शुल्क (Total Fee)</div>
            <div class="text-xl font-black text-slate-900">
              ₹${service.totalFee}
              <span class="text-[10px] text-slate-500 font-normal">
                (शासकीय ₹${service.govFee} + सेवा ₹${service.processingFee})
              </span>
            </div>
          </div>

          <button 
            onclick="App.startApplication(StorageManager.getServiceById('${service.id}'))" 
            class="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 group-hover:bg-orange-600"
          >
            <span>${this.t('applyNow')}</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  },

  // ---------------- SERVICES VIEW ---------------- //

  renderServicesView(settings) {
    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <!-- Title & Search Bar -->
        <div class="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-8 mb-8 shadow-md">
          <h2 class="text-2xl sm:text-3xl font-black mb-2">सर्व आपले सरकार व CSC सेवा दरपत्रक</h2>
          <p class="text-sm text-slate-300 max-w-2xl mb-6">
            शासकीय नियमांनुसार पारदर्शक दर, आवश्यक कागदपत्रे व अचूक ऑनलाइन अर्ज प्रणाली.
          </p>

          <div class="max-w-xl bg-white rounded-xl p-1.5 flex items-center gap-2 shadow-inner">
            <i data-lucide="search" class="w-5 h-5 text-slate-400 ml-2"></i>
            <input 
              type="text" 
              placeholder="दाखल्याचे किंवा योजनेचे नाव शोधा (उदा. उत्पन्न, पॅन, जात)..." 
              class="w-full text-slate-900 text-sm focus:outline-none py-1.5"
              value="${this.state.searchQuery}"
              oninput="App.state.searchQuery = this.value; App.render();"
            />
          </div>
        </div>

        <!-- Category Filters -->
        <div class="flex flex-wrap items-center gap-2 mb-8">
          ${[
            { id: 'all', label: 'सर्व सेवा (All)' },
            { id: 'revenue', label: 'महसूल विभाग (Revenue)' },
            { id: 'identity', label: 'ओळखपत्र व नागरी (Identity)' },
            { id: 'welfare', label: 'कल्याणकारी व पेन्शन (Welfare)' },
            { id: 'farmer', label: 'कृषी व शेतकरी योजना (Farmer)' },
            { id: 'business', label: 'व्यवसाय व परवाने (Business)' }
          ].map(cat => `
            <button 
              onclick="App.state.selectedCategory = '${cat.id}'; App.render();" 
              class="px-4 py-2 rounded-xl text-xs font-bold transition ${this.state.selectedCategory === cat.id ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}"
            >
              ${cat.label}
            </button>
          `).join('')}
        </div>

        <!-- Services Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${this.getFilteredServices().map(service => this.renderServiceCard(service)).join('')}
        </div>
      </div>
    `;
  },

  // ---------------- TRACK APPLICATION VIEW ---------------- //

  renderTrackView(settings) {
    const query = (this.state.searchQuery || '').trim();
    const app = query ? StorageManager.getApplicationByTracking(query) : null;

    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <!-- Tracker Card -->
        <div class="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8">
          <div class="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 sm:p-8">
            <div class="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <i data-lucide="compass" class="w-3.5 h-3.5"></i>
              लाईव्ह अर्ज ट्रॅकिंग प्रणाली
            </div>
            <h2 class="text-2xl sm:text-3xl font-black mb-2">आपल्या अर्जाची सद्यस्थिती तपासा</h2>
            <p class="text-xs sm:text-sm text-slate-300">
              अर्ज दाखल केल्यानंतर मिळालेला १० अंकी ट्रॅकिंग नंबर (उदा. EOS-2026-1042) किंवा आपला नोंदणीकृत मोबाईल नंबर टाका.
            </p>

            <!-- Search Form -->
            <div class="mt-6 flex flex-col sm:flex-row gap-2">
              <input 
                id="track-search-input"
                type="text" 
                value="${query}"
                placeholder="ट्रॅकिंग नंबर टाका (उदा. EOS-2026-1042 किंवा मोबाईल)" 
                class="w-full text-slate-900 text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                onkeypress="if(event.key === 'Enter') { App.navigate('track', this.value); }"
              />
              <button 
                onclick="App.navigate('track', document.getElementById('track-search-input').value)" 
                class="bg-orange-500 hover:bg-orange-600 text-white font-black text-sm px-8 py-3 rounded-xl transition shadow flex items-center justify-center gap-2 shrink-0"
              >
                <i data-lucide="search" class="w-4 h-4"></i>
                <span>शोध घ्या</span>
              </button>
            </div>
          </div>

          <!-- Quick Test Demo Tokens -->
          <div class="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
            <span class="text-slate-500 font-medium">डेमोसाठी थेट तपासा:</span>
            <button onclick="App.navigate('track', 'EOS-2026-1042')" class="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold hover:bg-emerald-200">
              EOS-2026-1042 (मंजूर दाखला)
            </button>
            <button onclick="App.navigate('track', 'EOS-2026-1043')" class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold hover:bg-blue-200">
              EOS-2026-1043 (प्रक्रियेत)
            </button>
            <button onclick="App.navigate('track', 'EOS-2026-1044')" class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold hover:bg-amber-200">
              EOS-2026-1044 (पडताळणी)
            </button>
          </div>

          <!-- Result Content -->
          <div class="p-6 sm:p-8">
            ${query ? (app ? this.renderTrackingResult(app, settings) : `
              <div class="text-center py-12 text-slate-500">
                <i data-lucide="alert-circle" class="w-12 h-12 text-orange-400 mx-auto mb-3"></i>
                <h4 class="text-lg font-bold text-slate-800 mb-1">'${query}' या क्रमांकाचा अर्ज आढळला नाही.</h4>
                <p class="text-xs text-slate-500 max-w-md mx-auto">
                  कृपया ट्रॅकिंग आयडी तपासा किंवा मदतीसाठी ग्राहक सेवा नंबर <strong>${settings.phone}</strong> वर संपर्क करा.
                </p>
              </div>
            `) : `
              <div class="text-center py-12 text-slate-400">
                <i data-lucide="search" class="w-12 h-12 text-slate-300 mx-auto mb-3"></i>
                <p class="text-sm font-medium">कृपया वरील बॉक्समध्ये ट्रॅकिंग नंबर प्रविष्ट करा.</p>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  },

  renderTrackingResult(app, settings) {
    const steps = [
      { key: 'PENDING', label: 'अर्ज दाखल व पेमेंट', desc: 'अर्ज व UTR क्रमांक प्राप्त झाला' },
      { key: 'VERIFYING', label: 'कागदपत्र पडताळणी', desc: 'अपलोड केलेल्या कागदपत्रांची तपासणी' },
      { key: 'PROCESSING', label: 'शासकीय प्रक्रियेत', desc: 'तहसीलदार / संबंधित विभागाकडे सादर' },
      { key: 'APPROVED', label: 'मंजूर व दाखला तयार', desc: 'डिजिटल स्वाक्षरीसह दाखला तयार' }
    ];

    const currentIdx = steps.findIndex(s => s.key === app.status);
    const isApproved = app.status === 'APPROVED';
    const isRejected = app.status === 'REJECTED';

    return `
      <div>
        <!-- Top Status Banner -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl ${isApproved ? 'bg-emerald-50 border border-emerald-200' : isRejected ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'} mb-6">
          <div>
            <div class="text-xs text-slate-500 font-semibold">अर्जाचा ट्रॅकिंग आयडी:</div>
            <div class="text-xl font-mono font-black text-slate-900">${app.trackingId}</div>
            <div class="text-xs font-bold text-blue-700 mt-0.5">${app.serviceNameMr || app.serviceName}</div>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold ${
              isApproved ? 'bg-emerald-600 text-white' :
              isRejected ? 'bg-red-600 text-white' :
              'bg-blue-700 text-white'
            }">
              ${
                app.status === 'PENDING' ? 'अर्ज दाखल' :
                app.status === 'VERIFYING' ? 'पडताळणी सुरू' :
                app.status === 'PROCESSING' ? 'शासकीय प्रक्रियेत' :
                app.status === 'APPROVED' ? 'मंजूर (Approved)' : 'त्रुटी / नामंजूर'
              }
            </span>
          </div>
        </div>

        <!-- 4-Stage Progress Stepper -->
        <div class="relative py-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            ${steps.map((st, idx) => {
              const done = currentIdx >= idx;
              const active = currentIdx === idx;
              return `
                <div class="flex md:flex-col items-center text-left md:text-center gap-3 md:gap-2">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    done ? 'bg-emerald-600 text-white shadow-md' :
                    'bg-slate-200 text-slate-600'
                  } shrink-0">
                    ${done ? '<i data-lucide="check" class="w-5 h-5"></i>' : idx + 1}
                  </div>
                  <div>
                    <h5 class="text-xs font-bold ${active ? 'text-blue-900' : 'text-slate-700'}">${st.label}</h5>
                    <p class="text-[10px] text-slate-500">${st.desc}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Officer Remarks / Updates -->
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <div class="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
            <i data-lucide="message-square" class="w-4 h-4 text-amber-600"></i>
            <span>केंद्र संचालक / अधिकाऱ्यांची शेरा नोंद (Officer Remarks):</span>
          </div>
          <p class="text-xs text-amber-800 leading-relaxed font-medium">
            ${app.officerRemarks || 'अर्जावर प्रक्रिया सुरू आहे.'}
          </p>
          <div class="text-[10px] text-amber-600 mt-2 font-mono">
            अंतिम अपडेट: ${new Date(app.updatedAt || app.createdAt).toLocaleString('mr-IN')}
          </div>
        </div>

        <!-- Applicant Details Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
          <div><span class="text-slate-500">अर्जदाराचे नाव:</span> <strong class="text-slate-800">${app.applicantName}</strong></div>
          <div><span class="text-slate-500">मोबाईल नंबर:</span> <strong class="text-slate-800">${app.mobile}</strong></div>
          <div><span class="text-slate-500">शुल्क भरणा:</span> <strong class="text-emerald-700 font-bold">₹${app.amount} (यशस्वी)</strong></div>
          <div><span class="text-slate-500">UPI UTR संदर्भ:</span> <code class="text-slate-800 font-mono font-bold">${app.utrNumber}</code></div>
          <div class="sm:col-span-2"><span class="text-slate-500">पत्ता:</span> <span class="text-slate-800">${app.address}</span></div>
        </div>

        <!-- Action Buttons (Receipt & Certificate) -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button 
            onclick="App.showInvoiceModalByTracking('${app.trackingId}')" 
            class="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
          >
            <i data-lucide="receipt" class="w-4 h-4 text-amber-400"></i>
            <span>पावती / इन्व्हॉईस डाउनलोड</span>
          </button>

          ${isApproved ? `
            <button 
              onclick="App.showCertificateModal('${app.id}')" 
              class="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-2.5 rounded-xl transition shadow flex items-center gap-2 animate-bounce"
            >
              <i data-lucide="award" class="w-4 h-4"></i>
              <span>डिजिटल स्वाक्षरी दाखला डाउनलोड करा</span>
            </button>
          ` : `
            <div class="text-xs text-slate-500 flex items-center gap-1">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-orange-500"></i>
              <span>दाखला मंजूर झाल्यानंतर येथे डाऊनलोड बटण उपलब्ध होईल.</span>
            </div>
          `}
        </div>
      </div>
    `;
  },

  // ---------------- APPLY APPLICATION FLOW (4 STEPS) ---------------- //

  renderApplyView(settings) {
    const srv = this.state.selectedService;
    if (!srv) {
      return `
        <div class="max-w-2xl mx-auto px-4 py-16 text-center">
          <p class="text-slate-600 mb-4">कोणतीही सेवा निवडलेली नाही.</p>
          <button onclick="App.navigate('services')" class="bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl">
            सेवांची यादी पहा
          </button>
        </div>
      `;
    }

    const step = this.state.applyStep;

    return `
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <!-- Service Header Banner -->
        <div class="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="inline-block bg-orange-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                ${srv.category.toUpperCase()} • ${srv.days}
              </span>
              <h2 class="text-2xl sm:text-3xl font-black mb-1">${srv.titleMr}</h2>
              <p class="text-xs sm:text-sm text-slate-300">${srv.titleEn}</p>
            </div>
            <div class="text-right shrink-0">
              <div class="text-xs text-slate-300 font-medium">एकूण देय शुल्क</div>
              <div class="text-2xl sm:text-3xl font-black text-amber-400">₹${srv.totalFee}</div>
            </div>
          </div>

          <!-- Stepper Progress Bar -->
          <div class="grid grid-cols-4 gap-2 mt-6 pt-6 border-t border-white/10 text-xs">
            <div class="text-center font-bold ${step >= 1 ? 'text-amber-400' : 'text-slate-500'}">
              १. माहिती
            </div>
            <div class="text-center font-bold ${step >= 2 ? 'text-amber-400' : 'text-slate-500'}">
              २. कागदपत्रे
            </div>
            <div class="text-center font-bold ${step >= 3 ? 'text-amber-400' : 'text-slate-500'}">
              ३. QR पेमेंट
            </div>
            <div class="text-center font-bold ${step >= 4 ? 'text-amber-400' : 'text-slate-500'}">
              ४. पोचपावती
            </div>
          </div>
        </div>

        <!-- Form Box -->
        <div class="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">
          ${step === 1 ? this.renderApplyStep1(srv) : ''}
          ${step === 2 ? this.renderApplyStep2(srv) : ''}
          ${step === 3 ? this.renderApplyStep3(srv, settings) : ''}
          ${step === 4 ? this.renderApplyStep4(settings) : ''}
        </div>
      </div>
    `;
  },

  renderApplyStep1(srv) {
    const data = this.state.applyData;

    return `
      <div>
        <h3 class="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <i data-lucide="user" class="w-5 h-5 text-blue-600"></i>
          <span>टप्पा १: अर्जदाराची वैयक्तिक माहिती प्रविष्ट करा</span>
        </h3>
        <p class="text-xs text-slate-500 mb-6">
          सर्व माहिती अधिकृत ओळखपत्रांप्रमाणे (Aadhaar Card) तंतोतंत भरा.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
          <div class="sm:col-span-2">
            <label class="block mb-1">अर्जदाराचे पूर्ण नाव (Full Name as per Aadhaar) *</label>
            <input 
              type="text" 
              placeholder="उदा. सचिन दत्तात्रय पाटील (Sachin Patil)"
              value="${data.applicantName}"
              oninput="App.state.applyData.applicantName = this.value"
              class="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label class="block mb-1">मोबाईल नंबर (Mobile Number for SMS updates) *</label>
            <input 
              type="tel" 
              maxlength="10"
              placeholder="१० अंकी मोबाईल नंबर (उदा. 9834005538)"
              value="${data.mobile}"
              oninput="App.state.applyData.mobile = this.value"
              class="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label class="block mb-1">ईमेल आयडी (Email Address)</label>
            <input 
              type="email" 
              placeholder="ईमेल आयडी (उदा. citizen@gmail.com)"
              value="${data.email}"
              oninput="App.state.applyData.email = this.value"
              class="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label class="block mb-1">आधार नंबर (Aadhaar Number)</label>
            <input 
              type="text" 
              maxlength="14"
              placeholder="XXXX-XXXX-XXXX"
              value="${data.aadhaarNo}"
              oninput="App.state.applyData.aadhaarNo = this.value"
              class="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label class="block mb-1">तालुका (Taluka) *</label>
            <input 
              type="text" 
              placeholder="आपला तालुका टाका"
              value="${data.taluka}"
              oninput="App.state.applyData.taluka = this.value"
              class="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block mb-1">पूर्ण पत्ता (Full Residential Address) *</label>
            <textarea 
              rows="2" 
              placeholder="घर क्र., गल्ली, गाव / शहर व पिनकोड..."
              oninput="App.state.applyData.address = this.value"
              class="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >${data.address}</textarea>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-between pt-4 border-t border-slate-200">
          <button onclick="App.navigate('services')" class="text-slate-600 hover:text-slate-900 text-xs font-bold">
            ← मागे जा
          </button>
          <button 
            onclick="
              if(!App.state.applyData.applicantName.trim() || !App.state.applyData.mobile.trim()) {
                alert('कृपया नाव व मोबाईल नंबर प्रविष्ट करा.');
                return;
              }
              App.state.applyStep = 2; 
              App.render();
            " 
            class="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow flex items-center gap-2"
          >
            <span>कागदपत्रे अपलोड करा (पुढील टप्पा)</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderApplyStep2(srv) {
    const docs = srv.requiredDocs || [];
    const uploaded = this.state.uploadedDocs;

    return `
      <div>
        <div class="flex items-start justify-between gap-2 mb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="upload-cloud" class="w-5 h-5 text-orange-600"></i>
              <span>टप्पा २: आवश्यक कागदपत्रे अपलोड करा</span>
            </h3>
            <p class="text-xs text-slate-500">
              प्रत्येक कागदपत्र **PDF किंवा JPG/PNG** स्वरूपात अपलोड करा (कमाल आकार ५ MB).
            </p>
          </div>
          <span class="bg-blue-100 text-blue-800 font-bold text-xs px-2.5 py-1 rounded-full">
            ${Object.keys(uploaded).length} / ${docs.length} अपलोड केले
          </span>
        </div>

        <!-- Document Upload Checklist -->
        <div class="space-y-4 mb-8">
          ${docs.map((docName, idx) => {
            const up = uploaded[docName];
            return `
              <div class="p-4 rounded-2xl border transition-all ${up ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200'}">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${up ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'} shrink-0 mt-0.5">
                      ${up ? '<i data-lucide="check" class="w-4 h-4"></i>' : idx + 1}
                    </div>
                    <div>
                      <div class="text-sm font-bold text-slate-900">${docName}</div>
                      ${up ? `
                        <div class="flex items-center gap-2 text-xs text-emerald-700 font-semibold mt-1">
                          <span class="inline-flex items-center gap-1 uppercase bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-mono text-[10px]">
                            ${up.type.toUpperCase()}
                          </span>
                          <span>${up.fileName}</span>
                          <span class="text-slate-400">(${up.size})</span>
                        </div>
                      ` : `
                        <div class="text-[11px] text-slate-500">फॉरमॅट: PDF, JPG किंवा JPEG</div>
                      `}
                    </div>
                  </div>

                  <!-- Upload or Remove Buttons -->
                  <div class="flex items-center gap-2 shrink-0">
                    ${up ? `
                      <button 
                        type="button" 
                        onclick='App.previewDocument(${JSON.stringify(up)})' 
                        class="px-3 py-1.5 bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 text-xs font-bold rounded-lg flex items-center gap-1"
                      >
                        <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                        <span>पहा</span>
                      </button>
                      <button 
                        type="button" 
                        onclick="App.removeUploadedDoc('${docName}')" 
                        class="px-3 py-1.5 bg-white text-red-600 hover:bg-red-50 border border-red-200 text-xs font-bold rounded-lg flex items-center gap-1"
                      >
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        <span>काढून टाका</span>
                      </button>
                    ` : `
                      <label class="cursor-pointer bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5">
                        <i data-lucide="paperclip" class="w-3.5 h-3.5"></i>
                        <span>फाइल निवडा</span>
                        <input 
                          type="file" 
                          accept=".pdf, .jpg, .jpeg, .png" 
                          class="hidden" 
                          onchange="App.handleFileUpload('${docName}', this)"
                        />
                      </label>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-slate-200">
          <button onclick="App.state.applyStep = 1; App.render();" class="text-slate-600 hover:text-slate-900 text-xs font-bold">
            ← माहिती बदला
          </button>
          <button 
            onclick="
              if(Object.keys(App.state.uploadedDocs).length === 0) {
                if(!confirm('आपण कोणतेही कागदपत्र अपलोड केलेले नाही. तरीही पुढे जायचे का? (नंतर व्हॉट्सॲपवर पाठवू शकता)')) return;
              }
              App.state.applyStep = 3; 
              App.render();
            " 
            class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow flex items-center gap-2"
          >
            <span>पेमेंट करा (पुढील टप्पा)</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderApplyStep3(srv, settings) {
    const data = this.state.applyData;
    const upiLink = QRUtil.generateUpiString({
      upiId: settings.upiId,
      payeeName: settings.kendraName,
      amount: srv.totalFee,
      trackingId: 'NEW_APP',
      note: `Payment-${srv.titleEn.substring(0, 15)}`
    });

    return `
      <div>
        <div class="text-center max-w-md mx-auto mb-6">
          <span class="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
            सुरक्षित UPI / बँक पेमेंट
          </span>
          <h3 class="text-xl font-black text-slate-900 mt-2">
            टप्पा ३: QR कोड स्कॅन करून ₹${srv.totalFee} भरा
          </h3>
          <p class="text-xs text-slate-500">
            रक्कम थेट अधिकृत केंद्र बँक खात्यात सुरक्षितपणे जमा होईल.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 p-6 rounded-3xl border border-slate-200 mb-6">
          <!-- QR Code Display Box -->
          <div class="bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-center flex flex-col items-center">
            <div class="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
              <i data-lucide="qr-code" class="w-4 h-4 text-blue-600"></i>
              <span>अधिकृत भारत UPI QR कोड</span>
            </div>

            <!-- Dynamic QR Canvas or Image -->
            <div class="p-2 bg-white rounded-xl border border-slate-100 shadow-inner my-2">
              ${settings.qrImageUrl ? `
                <img src="${settings.qrImageUrl}" alt="Bank QR" class="w-48 h-48 object-contain rounded-lg" />
              ` : `
                <canvas id="upi-qr-canvas" class="mx-auto rounded-lg"></canvas>
              `}
            </div>

            <div class="text-base font-black text-emerald-700 mt-1">
              एकूण रक्कम: ₹${srv.totalFee}
            </div>
            <div class="text-[11px] text-slate-500 font-mono">
              UPI ID: <strong class="text-slate-800">${settings.upiId}</strong>
            </div>

            <!-- Clickable UPI intent on mobile -->
            <a href="${upiLink}" class="mt-3 w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow sm:hidden">
              <i data-lucide="smartphone" class="w-4 h-4"></i>
              <span>मोबाईल ॲपने भरा (PhonePe / GPay)</span>
            </a>
          </div>

          <!-- Bank Account Details & Instructions -->
          <div class="space-y-4 text-xs">
            <div class="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div class="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center gap-1">
                <i data-lucide="landmark" class="w-4 h-4 text-blue-600"></i>
                <span>थेट बँक खाते तपशील (Bank Transfer):</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">खातेधारकाचे नाव:</span>
                <strong class="text-slate-800">${settings.accountHolder || settings.kendraName}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">बँकेचे नाव:</span>
                <strong class="text-slate-800">${settings.bankName}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">खाते क्रमांक:</span>
                <strong class="text-slate-900 font-mono font-bold">${settings.accountNo}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">IFSC कोड:</span>
                <strong class="text-slate-900 font-mono font-bold">${settings.ifscCode}</strong>
              </div>
            </div>

            <!-- UTR Input Box -->
            <div class="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <label class="block font-bold text-amber-950 mb-1">
                पेमेंट केल्याचा १२ अंकी UPI UTR / संदर्भ क्रमांक टाका *
              </label>
              <input 
                type="text" 
                maxlength="16"
                placeholder="उदा. 431289410921 (12 Digit UTR)" 
                value="${data.utrNumber}"
                oninput="App.state.applyData.utrNumber = this.value"
                class="w-full p-2.5 rounded-lg border border-amber-300 font-mono text-sm uppercase font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
              <p class="text-[10px] text-amber-700 mt-1">
                GPay, PhonePe किंवा Paytm मधील Transaction ID / UTR क्रमांक प्रविष्ट करा.
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-slate-200">
          <button onclick="App.state.applyStep = 2; App.render();" class="text-slate-600 hover:text-slate-900 text-xs font-bold">
            ← कागदपत्रे बदला
          </button>
          <button 
            onclick="App.submitApplication()" 
            class="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-sm px-8 py-3.5 rounded-xl transition shadow-lg flex items-center gap-2"
          >
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            <span>अर्ज अंतिम सबमिट करा (Submit)</span>
          </button>
        </div>
      </div>
    `;
  },

  renderApplyStep4(settings) {
    const trackingId = this.state.lastCreatedTrackingId || 'EOS-2026-1042';

    return `
      <div class="text-center py-6">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <i data-lucide="check-check" class="w-8 h-8"></i>
        </div>

        <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          अर्ज यशस्वीरित्या दाखल झाला!
        </span>

        <h3 class="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-2">
          आपला अर्ज सेतू केंद्राकडे प्राप्त झाला आहे
        </h3>

        <p class="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
          आपला युनिक ॲप्लिकेशन ट्रॅकिंग नंबर खालीलप्रमाणे आहे. याद्वारे आपण केव्हाही अर्जाची सद्यस्थिती तपासू शकता.
        </p>

        <!-- Big Tracking Number Card -->
        <div class="bg-slate-900 text-white max-w-md mx-auto p-6 rounded-3xl shadow-xl mb-6 border-2 border-orange-500">
          <div class="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">
            आपला ट्रॅकिंग क्रमांक (Tracking ID)
          </div>
          <div class="text-3xl sm:text-4xl font-mono font-black text-amber-300 tracking-wider">
            ${trackingId}
          </div>
          <div class="text-xs text-slate-400 mt-2">
            तसेच हा नंबर आपल्या नोंदणीकृत मोबाईलवर पाठवण्यात आला आहे.
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button 
            onclick="App.showInvoiceModalByTracking('${trackingId}')" 
            class="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow flex items-center gap-2"
          >
            <i data-lucide="printer" class="w-4 h-4"></i>
            <span>अधिकृत पोचपावती / इन्व्हॉईस डाऊनलोड</span>
          </button>

          <button 
            onclick="App.navigate('track', '${trackingId}')" 
            class="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow flex items-center gap-2"
          >
            <i data-lucide="compass" class="w-4 h-4"></i>
            <span>अर्जाची स्थिती ट्रॅक करा</span>
          </button>

          <button 
            onclick="App.navigate('home')" 
            class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-5 py-3 rounded-xl transition"
          >
            मुख्यपृष्ठावर जा
          </button>
        </div>
      </div>
    `;
  },

  // ---------------- CITIZEN DASHBOARD VIEW ---------------- //

  renderDashboardView(settings) {
    const user = this.state.currentUser;
    if (!user) {
      return `
        <div class="max-w-md mx-auto px-4 py-16 text-center">
          <p class="text-slate-600 mb-4">डॅशबोर्ड पाहण्यासाठी कृपया लॉगिन करा.</p>
          <button onclick="App.state.activeModal = 'auth'; App.state.authMode = 'login'; App.render();" class="bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl">
            लॉगिन करा
          </button>
        </div>
      `;
    }

    const apps = StorageManager.getApplications().filter(a => a.mobile === user.mobile);

    return `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <!-- User Welcome Banner -->
        <div class="bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-orange-600 text-white font-black text-2xl flex items-center justify-center shadow">
              ${user.name.charAt(0)}
            </div>
            <div>
              <span class="text-xs text-orange-400 font-bold uppercase tracking-wider">नागरिक डॅशबोर्ड</span>
              <h2 class="text-2xl font-black">${user.name}</h2>
              <div class="text-xs text-slate-300 font-mono">मोबाईल: ${user.mobile}</div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="App.navigate('services')" class="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5">
              <i data-lucide="plus-circle" class="w-4 h-4"></i>
              <span>नवीन अर्ज करा</span>
            </button>
            <button onclick="App.logoutUser()" class="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2.5 rounded-xl transition border border-white/20">
              बाहेर पडा
            </button>
          </div>
        </div>

        <!-- Metrics Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-xs text-slate-500 font-bold">एकूण दाखल अर्ज</div>
            <div class="text-2xl font-black text-slate-900 mt-1">${apps.length}</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-xs text-slate-500 font-bold">प्रक्रियेत असलेले</div>
            <div class="text-2xl font-black text-blue-600 mt-1">
              ${apps.filter(a => a.status === 'PROCESSING' || a.status === 'VERIFYING').length}
            </div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-xs text-slate-500 font-bold">मंजूर दाखले</div>
            <div class="text-2xl font-black text-emerald-600 mt-1">
              ${apps.filter(a => a.status === 'APPROVED').length}
            </div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-xs text-slate-500 font-bold">मदत क्रमांक</div>
            <div class="text-sm font-black text-orange-600 mt-2">${settings.phone}</div>
          </div>
        </div>

        <!-- Applications Table -->
        <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900">आपल्या अर्जांची यादी (My Applications)</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th class="p-4">ट्रॅकिंग आयडी</th>
                  <th class="p-4">सेवेचे नाव</th>
                  <th class="p-4">तारीख</th>
                  <th class="p-4">शुल्क</th>
                  <th class="p-4">स्थिती</th>
                  <th class="p-4 text-right">कृती (Actions)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                ${apps.length > 0 ? apps.map(app => `
                  <tr class="hover:bg-slate-50/80 transition">
                    <td class="p-4 font-mono font-bold text-slate-900">${app.trackingId}</td>
                    <td class="p-4 font-bold text-blue-900">${app.serviceNameMr || app.serviceName}</td>
                    <td class="p-4 text-slate-500">${new Date(app.createdAt).toLocaleDateString()}</td>
                    <td class="p-4 font-bold text-slate-900">₹${app.amount}</td>
                    <td class="p-4">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }">
                        ${app.status}
                      </span>
                    </td>
                    <td class="p-4 text-right space-x-2">
                      <button onclick="App.navigate('track', '${app.trackingId}')" class="text-blue-700 hover:underline font-bold">
                        ट्रॅक करा
                      </button>
                      <button onclick="App.showInvoiceModalByTracking('${app.trackingId}')" class="text-slate-600 hover:text-slate-900">
                        पावती
                      </button>
                      ${app.status === 'APPROVED' ? `
                        <button onclick="App.showCertificateModal('${app.id}')" class="text-emerald-700 font-bold hover:underline">
                          दाखला
                        </button>
                      ` : ''}
                    </td>
                  </tr>
                `).join('') : `
                  <tr>
                    <td colspan="6" class="p-8 text-center text-slate-400">
                      अद्याप कोणताही अर्ज दाखल केलेला नाही. नवीन सेवेसाठी 'नवीन अर्ज करा' बटणावर क्लिक करा.
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // ---------------- ADMIN PORTAL VIEW ---------------- //

  renderAdminView(settings) {
    if (!this.state.isAdmin) {
      return `
        <div class="max-w-md mx-auto px-4 py-16 text-center">
          <p class="text-slate-600 mb-4">प्रशासकीय पोर्टलमध्ये प्रवेश करण्यासाठी लॉगिन आवश्यक आहे.</p>
          <button onclick="App.state.activeModal = 'adminLogin'; App.render();" class="bg-slate-900 text-amber-400 font-bold px-6 py-2.5 rounded-xl">
            Admin Login
          </button>
        </div>
      `;
    }

    const subTab = this.state.adminSubTab;
    const apps = StorageManager.getApplications();
    const services = StorageManager.getServices();
    const invoices = StorageManager.getInvoices();

    // Stats
    const totalRev = apps.filter(a => a.paymentStatus === 'SUCCESS').reduce((acc, a) => acc + (a.amount || 0), 0);
    const pendingCount = apps.filter(a => a.status === 'PENDING' || a.status === 'VERIFYING').length;
    const approvedCount = apps.filter(a => a.status === 'APPROVED').length;

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <!-- Admin Header -->
        <div class="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 border-t-4 border-orange-500">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <i data-lucide="shield-alert" class="w-4 h-4"></i>
                Authorized Kendra Administrator Portal
              </div>
              <h2 class="text-2xl sm:text-3xl font-black">
                ${settings.kendraName} - नियंत्रण कक्ष
              </h2>
              <p class="text-xs text-slate-400 mt-1">
                Kendra ID: <strong class="text-white">${settings.kendraId}</strong> • Operator Helpline: <strong class="text-amber-400">${settings.phone}</strong>
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="App.state.activeModal = 'serviceModal'; App.state.editingService = null; App.render();" class="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>नवीन सेवा जोडा</span>
              </button>
              <button onclick="App.logoutAdmin()" class="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow">
                बाहेर पडा (Logout)
              </button>
            </div>
          </div>

          <!-- Quick Metrics Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
            <div class="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div class="text-[11px] text-slate-400 font-bold uppercase">एकूण अर्ज (Total)</div>
              <div class="text-2xl font-black text-white mt-1">${apps.length}</div>
            </div>
            <div class="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div class="text-[11px] text-amber-400 font-bold uppercase">प्रलंबित (Pending)</div>
              <div class="text-2xl font-black text-amber-400 mt-1">${pendingCount}</div>
            </div>
            <div class="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div class="text-[11px] text-emerald-400 font-bold uppercase">मंजूर दाखले (Approved)</div>
              <div class="text-2xl font-black text-emerald-400 mt-1">${approvedCount}</div>
            </div>
            <div class="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div class="text-[11px] text-blue-400 font-bold uppercase">जमा झालेले शुल्क (Revenue)</div>
              <div class="text-2xl font-black text-emerald-400 mt-1">₹${totalRev}</div>
            </div>
          </div>
        </div>

        <!-- Admin Sub-navigation Tabs -->
        <div class="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200 pb-2">
          <button 
            onclick="App.state.adminSubTab = 'apps'; App.render();" 
            class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${subTab === 'apps' ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}"
          >
            <i data-lucide="inbox" class="w-4 h-4"></i>
            <span>दाखल झालेले अर्ज (${apps.length})</span>
          </button>

          <button 
            onclick="App.state.adminSubTab = 'services'; App.render();" 
            class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${subTab === 'services' ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}"
          >
            <i data-lucide="layers" class="w-4 h-4"></i>
            <span>सेवा व दर व्यवस्थापन (Services & Fees)</span>
          </button>

          <button 
            onclick="App.state.adminSubTab = 'bank'; App.render();" 
            class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${subTab === 'bank' ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}"
          >
            <i data-lucide="qr-code" class="w-4 h-4"></i>
            <span>बँक व QR कोड सेटिंग्स (Bank & QR)</span>
          </button>

          <button 
            onclick="App.state.adminSubTab = 'invoices'; App.render();" 
            class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${subTab === 'invoices' ? 'bg-blue-900 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'}"
          >
            <i data-lucide="receipt" class="w-4 h-4"></i>
            <span>इन्व्हॉईस व पावत्या (${invoices.length})</span>
          </button>
        </div>

        <!-- Tab Body -->
        ${subTab === 'apps' ? this.renderAdminAppsTab(apps) : ''}
        ${subTab === 'services' ? this.renderAdminServicesTab(services) : ''}
        ${subTab === 'bank' ? this.renderAdminBankTab(settings) : ''}
        ${subTab === 'invoices' ? this.renderAdminInvoicesTab(invoices) : ''}
      </div>
    `;
  },

  renderAdminAppsTab(apps) {
    const filter = this.state.statusFilter;
    const query = (this.state.adminSearchQuery || '').toLowerCase().trim();

    const filtered = apps.filter(a => {
      const matchFilter = filter === 'all' || a.status === filter;
      const matchQuery = !query ||
        a.trackingId.toLowerCase().includes(query) ||
        a.applicantName.toLowerCase().includes(query) ||
        a.mobile.includes(query) ||
        (a.utrNumber && a.utrNumber.toLowerCase().includes(query));
      return matchFilter && matchQuery;
    });

    return `
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <!-- Controls Bar -->
        <div class="p-6 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 w-full md:w-auto">
            <span class="text-xs font-bold text-slate-600">फिल्टर:</span>
            ${['all', 'PENDING', 'VERIFYING', 'PROCESSING', 'APPROVED', 'REJECTED'].map(st => `
              <button 
                onclick="App.state.statusFilter = '${st}'; App.render();" 
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${filter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
              >
                ${st}
              </button>
            `).join('')}
          </div>

          <div class="w-full md:w-72">
            <input 
              type="text" 
              placeholder="ट्रॅकिंग आयडी किंवा नाव शोधा..." 
              value="${this.state.adminSearchQuery}"
              oninput="App.state.adminSearchQuery = this.value; App.render();"
              class="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th class="p-4">ट्रॅकिंग आयडी</th>
                <th class="p-4">अर्जदार व मोबाईल</th>
                <th class="p-4">सेवा</th>
                <th class="p-4">शुल्क व UTR</th>
                <th class="p-4">कागदपत्रे</th>
                <th class="p-4">सद्यस्थिती</th>
                <th class="p-4 text-right">कृती (Manage)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              ${filtered.length > 0 ? filtered.map(app => `
                <tr class="hover:bg-slate-50 transition">
                  <td class="p-4 font-mono font-bold text-slate-900">${app.trackingId}</td>
                  <td class="p-4">
                    <div class="font-bold text-slate-900">${app.applicantName}</div>
                    <div class="text-[11px] text-slate-500 font-mono">${app.mobile}</div>
                  </td>
                  <td class="p-4 font-semibold text-blue-900">${app.serviceNameMr || app.serviceName}</td>
                  <td class="p-4">
                    <div class="font-bold text-emerald-700">₹${app.amount}</div>
                    <div class="text-[10px] text-slate-500 font-mono">UTR: ${app.utrNumber || 'N/A'}</div>
                  </td>
                  <td class="p-4">
                    <span class="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700">
                      <i data-lucide="paperclip" class="w-3 h-3"></i>
                      ${(app.documents && app.documents.length) || 0} फाइल्स
                    </span>
                  </td>
                  <td class="p-4">
                    <select 
                      onchange="App.updateAppStatus('${app.id}', this.value, prompt('अर्जदारासाठी शेरा नोंद टाका (Remarks):', '${app.officerRemarks || ''}'))"
                      class="text-xs font-bold rounded-lg p-1.5 border border-slate-300 focus:outline-none ${
                        app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        app.status === 'REJECTED' ? 'bg-red-50 text-red-800 border-red-300' :
                        'bg-blue-50 text-blue-800'
                      }"
                    >
                      <option value="PENDING" ${app.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                      <option value="VERIFYING" ${app.status === 'VERIFYING' ? 'selected' : ''}>VERIFYING</option>
                      <option value="PROCESSING" ${app.status === 'PROCESSING' ? 'selected' : ''}>PROCESSING</option>
                      <option value="APPROVED" ${app.status === 'APPROVED' ? 'selected' : ''}>APPROVED</option>
                      <option value="REJECTED" ${app.status === 'REJECTED' ? 'selected' : ''}>REJECTED</option>
                    </select>
                  </td>
                  <td class="p-4 text-right space-x-1">
                    <button 
                      onclick="App.showAppDetailModal('${app.id}')" 
                      class="bg-blue-700 hover:bg-blue-800 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition"
                    >
                      तपासा
                    </button>
                    ${app.status === 'APPROVED' ? `
                      <button 
                        onclick="App.showCertificateModal('${app.id}')" 
                        class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition"
                      >
                        दाखला
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" class="p-8 text-center text-slate-400">कोणताही अर्ज सापडला नाही.</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderAdminServicesTab(services) {
    return `
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900">सेवा व दर व्यवस्थापन (Services & Price Editor)</h3>
            <p class="text-xs text-slate-500">येथून आपण कोणत्याही सेवेचे शासकीय व केंद्र शुल्क बदलू शकता किंवा नवीन सेवा जोडू शकता.</p>
          </div>
          <button 
            onclick="App.state.activeModal = 'serviceModal'; App.state.editingService = null; App.render();" 
            class="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>नवीन सेवा जोडा</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th class="p-4">सेवेचे नाव</th>
                <th class="p-4">विभाग</th>
                <th class="p-4">शासकीय शुल्क</th>
                <th class="p-4">केंद्र सेवा शुल्क</th>
                <th class="p-4">एकूण शुल्क (Total)</th>
                <th class="p-4">कालावधी</th>
                <th class="p-4">स्थिती</th>
                <th class="p-4 text-right">कृती</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              ${services.map(srv => `
                <tr class="hover:bg-slate-50 transition">
                  <td class="p-4">
                    <div class="font-bold text-slate-900">${srv.titleMr}</div>
                    <div class="text-[11px] text-slate-500">${srv.titleEn}</div>
                  </td>
                  <td class="p-4 uppercase font-bold text-[10px] text-blue-800">${srv.category}</td>
                  <td class="p-4 font-mono">₹${srv.govFee}</td>
                  <td class="p-4 font-mono">₹${srv.processingFee}</td>
                  <td class="p-4 font-bold text-emerald-700 font-mono text-sm">₹${srv.totalFee}</td>
                  <td class="p-4">${srv.days}</td>
                  <td class="p-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${srv.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}">
                      ${srv.active ? 'सुरू (Active)' : 'बंद'}
                    </span>
                  </td>
                  <td class="p-4 text-right space-x-1">
                    <button 
                      onclick='App.state.editingService = ${JSON.stringify(srv)}; App.state.activeModal = "serviceModal"; App.render();' 
                      class="text-blue-700 hover:text-blue-900 font-bold px-2 py-1 bg-blue-50 rounded"
                    >
                      बदला (Edit)
                    </button>
                    <button 
                      onclick="App.deleteService('${srv.id}')" 
                      class="text-red-600 hover:text-red-800 font-bold px-2 py-1 bg-red-50 rounded"
                    >
                      हटवा
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderAdminBankTab(settings) {
    return `
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 max-w-3xl">
        <h3 class="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <i data-lucide="qr-code" class="w-5 h-5 text-blue-600"></i>
          <span>बँक खाते व UPI QR कोड सेटिंग्स</span>
        </h3>
        <p class="text-xs text-slate-500 mb-6">
          येथे भरलेला UPI आयडी व बँक माहिती थेट ग्राहकांच्या पेमेंट स्क्रीनवर दिसेल आणि सर्व रक्कम आपल्या खात्यात जमा होईल.
        </p>

        <form onsubmit="
          event.preventDefault();
          const newSettings = StorageManager.getSettings();
          newSettings.upiId = this.upiId.value.trim();
          newSettings.phone = this.phone.value.trim();
          newSettings.bankName = this.bankName.value.trim();
          newSettings.accountHolder = this.accountHolder.value.trim();
          newSettings.accountNo = this.accountNo.value.trim();
          newSettings.ifscCode = this.ifscCode.value.trim();
          newSettings.noticeText = this.noticeText.value.trim();
          StorageManager.saveSettings(newSettings);
          alert('बँक व हेल्पलाईन सेटिंग्स यशस्वीरित्या जतन करण्यात आल्या!');
          App.render();
        " class="space-y-4 text-xs font-semibold text-slate-700">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1">अधिकृत UPI आयडी (Primary UPI ID for QR) *</label>
              <input type="text" name="upiId" value="${settings.upiId}" class="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-sm" required />
            </div>

            <div>
              <label class="block mb-1">ग्राहक सेवा मोबाईल नंबर (Customer Care Number) *</label>
              <input type="text" name="phone" value="${settings.phone}" class="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm" required />
            </div>

            <div>
              <label class="block mb-1">बँकेचे नाव (Bank Name)</label>
              <input type="text" name="bankName" value="${settings.bankName}" class="w-full p-2.5 rounded-xl border border-slate-300 text-sm" />
            </div>

            <div>
              <label class="block mb-1">खातेधारकाचे नाव (Account Holder Name)</label>
              <input type="text" name="accountHolder" value="${settings.accountHolder || settings.kendraName}" class="w-full p-2.5 rounded-xl border border-slate-300 text-sm" />
            </div>

            <div>
              <label class="block mb-1">खाते क्रमांक (Account Number)</label>
              <input type="text" name="accountNo" value="${settings.accountNo}" class="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm" />
            </div>

            <div>
              <label class="block mb-1">IFSC कोड (IFSC Code)</label>
              <input type="text" name="ifscCode" value="${settings.ifscCode}" class="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm uppercase" />
            </div>
          </div>

          <div>
            <label class="block mb-1">होमपेज सूचना पट्टी (Flash Notice Marquee Text)</label>
            <textarea name="noticeText" rows="2" class="w-full p-2.5 rounded-xl border border-slate-300 text-xs">${settings.noticeText}</textarea>
          </div>

          <div class="pt-4 border-t border-slate-200 flex justify-end">
            <button type="submit" class="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow">
              बदल सेव्ह करा (Save Changes)
            </button>
          </div>
        </form>
      </div>
    `;
  },

  renderAdminInvoicesTab(invoices) {
    return `
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900">इन्व्हॉईस व पावती केंद्र (Billing & Invoice Center)</h3>
            <p class="text-xs text-slate-500">प्रत्येक ऑनलाइन व ऑफलाइन सेवेची अधिकृत कर पावती.</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th class="p-4">पावती क्र. (Invoice No)</th>
                <th class="p-4">ट्रॅकिंग आयडी</th>
                <th class="p-4">ग्राहक नाव</th>
                <th class="p-4">तारीख</th>
                <th class="p-4">शासकीय फी</th>
                <th class="p-4">सेवा शुल्क</th>
                <th class="p-4">एकूण रक्कम</th>
                <th class="p-4 text-right">कृती</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              ${invoices.map(inv => `
                <tr class="hover:bg-slate-50 transition">
                  <td class="p-4 font-mono font-bold text-blue-900">${inv.invoiceNo}</td>
                  <td class="p-4 font-mono">${inv.trackingId}</td>
                  <td class="p-4 font-bold text-slate-900">${inv.customerName}</td>
                  <td class="p-4 text-slate-500">${inv.date}</td>
                  <td class="p-4">₹${inv.govFee}</td>
                  <td class="p-4">₹${inv.processingFee}</td>
                  <td class="p-4 font-black text-emerald-700">₹${inv.totalAmount}</td>
                  <td class="p-4 text-right">
                    <button 
                      onclick='App.state.selectedInvoice = ${JSON.stringify(inv)}; App.state.activeModal = "invoiceModal"; App.render();' 
                      class="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition"
                    >
                      पावती पहा व प्रिंट करा
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // ---------------- INVOICES PUBLIC VIEW ---------------- //

  renderInvoicesView(settings) {
    const invoices = StorageManager.getInvoices();

    return `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div class="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 mb-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span class="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
              अधिकृत सेतू पावती पोर्टल
            </span>
            <h2 class="text-2xl sm:text-3xl font-black mt-2">ऑनलाइन पावती व बिलिंग</h2>
            <p class="text-xs sm:text-sm text-slate-300">
              आपल्या सेवेची अधिकृत GST व सेतू केंद्र पावती येथून प्रिंट करा.
            </p>
          </div>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="p-6 border-b border-slate-200">
            <h3 class="text-lg font-bold text-slate-900">अलिकडील पावत्या (Recent Invoices)</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th class="p-4">पावती क्रमांक</th>
                  <th class="p-4">ट्रॅकिंग आयडी</th>
                  <th class="p-4">ग्राहक नाव</th>
                  <th class="p-4">सेवेचे नाव</th>
                  <th class="p-4">तारीख</th>
                  <th class="p-4">रक्कम</th>
                  <th class="p-4 text-right">कृती</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                ${invoices.map(inv => `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="p-4 font-mono font-bold text-blue-900">${inv.invoiceNo}</td>
                    <td class="p-4 font-mono">${inv.trackingId}</td>
                    <td class="p-4 font-bold text-slate-900">${inv.customerName}</td>
                    <td class="p-4">${inv.serviceName}</td>
                    <td class="p-4 text-slate-500">${inv.date}</td>
                    <td class="p-4 font-black text-emerald-700">₹${inv.totalAmount}</td>
                    <td class="p-4 text-right">
                      <button 
                        onclick='App.state.selectedInvoice = ${JSON.stringify(inv)}; App.state.activeModal = "invoiceModal"; App.render();' 
                        class="bg-blue-700 hover:bg-blue-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition"
                      >
                        पावती डाउनलोड
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // ---------------- CONTACT VIEW ---------------- //

  renderContactView(settings) {
    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div class="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <div class="text-center max-w-lg mx-auto mb-8">
            <span class="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              केंद्राशी थेट संपर्क
            </span>
            <h2 class="text-3xl font-black text-slate-900 mt-2">ग्राहक सेवा व संपर्क केंद्र</h2>
            <p class="text-xs sm:text-sm text-slate-500">
              कोणतीही अडचण किंवा चौकशी असल्यास आमच्या अधिकृत हेल्पलाइनवर संपर्क साधा.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
                <i data-lucide="phone-call" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">कस्टमर केअर नंबर</h4>
                <a href="tel:${settings.phone}" class="text-xl font-black text-blue-700 hover:underline mt-1 block">
                  ${settings.phone}
                </a>
                <p class="text-[11px] text-slate-500 mt-1">थेट संचालक संपर्क • सोमवार ते शनिवार</p>
              </div>
            </div>

            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow">
                <i data-lucide="message-circle" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">WhatsApp सहाय्यता</h4>
                <a href="https://wa.me/91${settings.phone}" target="_blank" class="text-base font-bold text-emerald-600 hover:underline mt-1 block">
                  +91 ${settings.phone}
                </a>
                <p class="text-[11px] text-slate-500 mt-1">कागदपत्रे पाठवण्यासाठी व स्थिती विचारण्यासाठी</p>
              </div>
            </div>

            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-start gap-4 sm:col-span-2">
              <div class="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow">
                <i data-lucide="map-pin" class="w-6 h-6"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">केंद्राचा प्रत्यक्ष पत्ता (Office Address)</h4>
                <p class="text-xs text-slate-700 mt-1 leading-relaxed">
                  ${settings.address}
                </p>
                <div class="text-[11px] text-slate-500 mt-1">
                  वेळ: ${settings.workingHours}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ---------------- TERMS & COPYRIGHT VIEW ---------------- //

  renderTermsView(settings) {
    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div class="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <h2 class="text-2xl font-black text-slate-900 mb-4 border-b pb-3">
            नियम, अटी व कॉपीराइट संरक्षण धोरण (Terms & Copyright Policy)
          </h2>

          <div class="prose prose-sm text-xs text-slate-600 space-y-4 leading-relaxed">
            <h3 class="text-sm font-bold text-slate-900">१. कॉपीराइट संरक्षण (Copyright Ownership)</h3>
            <p>
              या वेबसाइटचे नाव <strong>Easy Online Services</strong>, लोगो, डिझाईन, सॉफ्टवेअर कोड, डेटाबेस व सर्व मजकूर केंद्र संचालक (Director / Owner) यांच्या कायदेशीर मालकीचे आहेत. भारतीय कॉपीराइट कायदा, १९५७ (Indian Copyright Act, 1957) नुसार सर्व हक्क सुरक्षित आहेत.
            </p>

            <h3 class="text-sm font-bold text-slate-900">२. सेवा व शासकीय शुल्क (Government Fees & Service Charges)</h3>
            <p>
              दाखवलेले एकूण शुल्क हे शासकीय नियमांनुसार आकारण्यात येणारे सरकारी शुल्क आणि सेतू केंद्र हाताळणी / इंटरनेट / प्रिंटिंग सेवा शुल्काचे एकत्रित स्वरूप आहे.
            </p>

            <h3 class="text-sm font-bold text-slate-900">३. कागदपत्रांची पडताळणी व गुप्तता</h3>
            <p>
              नागरिकांनी अपलोड केलेली सर्व कागदपत्रे (Aadhaar, Ration Card, etc.) केवळ शासकीय दाखल्याच्या ऑनलाइन अर्जासाठी वापरली जातात व ती अत्यंत सुरक्षित ठेवली जातात.
            </p>

            <h3 class="text-sm font-bold text-slate-900">४. तक्रार निवारण व संपर्क</h3>
            <p>
              कोणत्याही प्रकारच्या चौकशीसाठी अथवा तक्रारीसाठी संचालक संपर्क क्रमांक: <strong>${settings.phone}</strong> किंवा ईमेलवर संपर्क साधावा.
            </p>
          </div>
        </div>
      </div>
    `;
  },

  // ---------------- MODALS (AUTH, DOC PREVIEW, INVOICE, CERTIFICATE, SERVICE) ---------------- //

  renderModals(settings) {
    const modal = this.state.activeModal;
    if (!modal) return '';

    return `
      <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 modal-backdrop">
        ${modal === 'auth' ? this.renderAuthModal() : ''}
        ${modal === 'adminLogin' ? this.renderAdminLoginModal() : ''}
        ${modal === 'docPreview' ? this.renderDocPreviewModal() : ''}
        ${modal === 'invoiceModal' ? this.renderInvoiceModal(settings) : ''}
        ${modal === 'certModal' ? this.renderCertificateModal(settings) : ''}
        ${modal === 'serviceModal' ? this.renderServiceEditModal() : ''}
        ${modal === 'appDetailModal' ? this.renderAppDetailModal() : ''}
      </div>
    `;
  },

  renderAuthModal() {
    const mode = this.state.authMode;

    return `
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-200 relative">
        <button onclick="App.state.activeModal = null; App.render();" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="text-center mb-6">
          <div class="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-2 font-black text-xl">
            EOS
          </div>
          <h3 class="text-xl font-black text-slate-900">
            ${mode === 'login' ? 'नागरिक लॉगिन (Customer Login)' : 'नवीन नागरिक नोंदणी (Register)'}
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            आपल्या अर्जांची स्थिती तपासण्यासाठी व दाखले डाऊनलोड करण्यासाठी
          </p>
        </div>

        ${mode === 'login' ? `
          <form onsubmit="
            event.preventDefault();
            App.handleCustomerLogin(this.mobile.value.trim(), this.password.value.trim());
          " class="space-y-4 text-xs font-semibold text-slate-700">
            <div>
              <label class="block mb-1">१० अंकी मोबाईल नंबर (Mobile Number) *</label>
              <input type="tel" name="mobile" maxlength="10" placeholder="उदा. 9834005538" class="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div>
              <label class="block mb-1">पासवर्ड (Password) *</label>
              <input type="password" name="password" placeholder="••••••••" class="w-full p-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>

            <button type="submit" class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition shadow text-sm">
              लॉगिन करा
            </button>

            <!-- Quick Demo Login Hint -->
            <div class="p-2.5 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-blue-800 flex items-center justify-between">
              <span>डेमो लॉगिन: 9834005538 / user123</span>
              <button type="button" onclick="App.handleCustomerLogin('9834005538', 'user123')" class="font-bold underline text-blue-900">
                1-Click भरा
              </button>
            </div>

            <div class="text-center pt-2 border-t border-slate-100">
              <span class="text-slate-500">खाते नाही का?</span>
              <button type="button" onclick="App.state.authMode = 'register'; App.render();" class="text-blue-700 font-bold ml-1 hover:underline">
                येथे नवीन नोंदणी करा
              </button>
            </div>
          </form>
        ` : `
          <form onsubmit="
            event.preventDefault();
            App.handleCustomerRegister(this.name.value, this.mobile.value, this.password.value, this.otp.value);
          " class="space-y-3 text-xs font-semibold text-slate-700">
            <div>
              <label class="block mb-1">पूर्ण नाव (Full Name) *</label>
              <input type="text" name="name" placeholder="उदा. सचिन पाटील" class="w-full p-2.5 rounded-xl border border-slate-300 text-sm" required />
            </div>

            <div>
              <label class="block mb-1">१० अंकी मोबाईल नंबर (Mobile Number) *</label>
              <input type="tel" name="mobile" maxlength="10" placeholder="उदा. 9834005538" class="w-full p-2.5 rounded-xl border border-slate-300 text-sm" required />
            </div>

            <div>
              <label class="block mb-1">पासवर्ड तयार करा (Password) *</label>
              <input type="password" name="password" placeholder="किमान ६ अक्षरे" class="w-full p-2.5 rounded-xl border border-slate-300 text-sm" required />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label>मोबाईल OTP पडताळणी *</label>
                <span class="text-[10px] text-emerald-600 font-bold">Demo OTP: 123456</span>
              </div>
              <input type="text" name="otp" maxlength="6" value="123456" placeholder="123456" class="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold" required />
            </div>

            <button type="submit" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition shadow text-sm mt-2">
              नोंदणी पूर्ण करा (Register)
            </button>

            <div class="text-center pt-2 border-t border-slate-100">
              <span class="text-slate-500">आधीच खाते आहे का?</span>
              <button type="button" onclick="App.state.authMode = 'login'; App.render();" class="text-blue-700 font-bold ml-1 hover:underline">
                येथे लॉगिन करा
              </button>
            </div>
          </form>
        `}
      </div>
    `;
  },

  renderAdminLoginModal() {
    return `
      <div class="bg-slate-950 text-white rounded-3xl shadow-2xl max-w-sm w-full p-6 sm:p-8 border border-slate-800 relative">
        <button onclick="App.state.activeModal = null; App.render();" class="absolute top-4 right-4 text-slate-400 hover:text-white">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="text-center mb-6">
          <div class="w-12 h-12 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-2 font-black text-xl">
            <i data-lucide="shield" class="w-6 h-6"></i>
          </div>
          <h3 class="text-xl font-black">प्रशासक लॉगिन (Admin)</h3>
          <p class="text-xs text-slate-400 mt-1">केंद्र संचालक व ऑपरेटर प्रवेश</p>
        </div>

        <form onsubmit="
          event.preventDefault();
          App.loginAdmin(this.username.value.trim(), this.password.value.trim());
        " class="space-y-4 text-xs font-semibold">
          <div>
            <label class="block mb-1 text-slate-300">Username *</label>
            <input type="text" name="username" value="admin" class="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm" required />
          </div>

          <div>
            <label class="block mb-1 text-slate-300">Password *</label>
            <input type="password" name="password" value="admin123" class="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm" required />
          </div>

          <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl transition shadow text-sm">
            Admin Portal मध्ये प्रवेश करा
          </button>
        </form>
      </div>
    `;
  },

  renderDocPreviewModal() {
    const doc = this.state.previewDoc;
    if (!doc) return '';

    return `
      <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 relative">
        <button onclick="App.state.activeModal = null; App.render();" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <h3 class="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          <i data-lucide="file" class="w-5 h-5 text-blue-600"></i>
          <span>${doc.name} (${doc.type.toUpperCase()})</span>
        </h3>
        <p class="text-xs text-slate-500 mb-4">${doc.fileName} • ${doc.size}</p>

        <div class="bg-slate-100 rounded-2xl p-4 flex items-center justify-center min-h-[300px] max-h-[500px] overflow-auto">
          ${doc.type === 'pdf' ? `
            <div class="text-center p-8">
              <i data-lucide="file-text" class="w-16 h-16 text-red-500 mx-auto mb-2"></i>
              <div class="font-bold text-slate-800 text-sm">${doc.fileName}</div>
              <div class="text-xs text-slate-500 mt-1">वैध PDF दस्तऐवज (Valid PDF Document Verified)</div>
            </div>
          ` : `
            <img src="${doc.dataUrl}" alt="Preview" class="max-w-full max-h-[450px] object-contain rounded-xl shadow" />
          `}
        </div>
      </div>
    `;
  },

  // ---------------- OFFICIAL TAX INVOICE MODAL ---------------- //

  showInvoiceModalByTracking(trackingId) {
    const invoices = StorageManager.getInvoices();
    const inv = invoices.find(i => i.trackingId === trackingId);
    if (inv) {
      this.state.selectedInvoice = inv;
      this.state.activeModal = 'invoiceModal';
      this.render();
    } else {
      alert("या अर्जाची पावती सापडली नाही.");
    }
  },

  renderInvoiceModal(settings) {
    const inv = this.state.selectedInvoice;
    if (!inv) return '';

    return `
      <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <div class="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <span class="text-xs font-bold text-slate-500">अधिकृत सेतू पावती (Official Kendra Receipt)</span>
          <div class="flex items-center gap-2">
            <button onclick="window.print()" class="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5">
              <i data-lucide="printer" class="w-4 h-4"></i>
              <span>प्रिंट / PDF सेव्ह करा</span>
            </button>
            <button onclick="App.state.activeModal = null; App.render();" class="text-slate-400 hover:text-slate-600 p-1">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <!-- Printable Receipt Layout -->
        <div class="p-6 border-2 border-slate-800 rounded-2xl relative bg-white" id="invoice-printable-content">
          <!-- Letterhead -->
          <div class="text-center border-b-2 border-slate-800 pb-4 mb-4">
            <div class="inline-block bg-orange-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider mb-1">
              आपले सरकार व सीएससी सेवा केंद्र
            </div>
            <h2 class="text-2xl font-black text-slate-900">${settings.kendraName}</h2>
            <p class="text-xs text-slate-600 font-semibold">${settings.address}</p>
            <p class="text-xs text-slate-700 mt-1">
              <strong>कस्टमर केअर: ${settings.phone}</strong> • CSC ID: ${settings.kendraId}
            </p>
          </div>

          <!-- Invoice Meta Info -->
          <div class="grid grid-cols-2 gap-4 text-xs mb-4">
            <div>
              <p><strong class="text-slate-600">पावती क्र. (Invoice No):</strong> <span class="font-mono font-bold">${inv.invoiceNo}</span></p>
              <p><strong class="text-slate-600">ट्रॅकिंग आयडी:</strong> <span class="font-mono font-bold">${inv.trackingId}</span></p>
              <p><strong class="text-slate-600">तारीख:</strong> ${inv.date}</p>
            </div>
            <div class="text-right">
              <p><strong class="text-slate-600">ग्राहक नाव:</strong> <span class="font-bold">${inv.customerName}</span></p>
              <p><strong class="text-slate-600">मोबाईल:</strong> ${inv.mobile}</p>
              <p><strong class="text-slate-600">पेमेंट मोड:</strong> ${inv.paymentMode}</p>
            </div>
          </div>

          <!-- Fee Table -->
          <table class="w-full text-xs text-left border border-slate-300 mb-4">
            <thead class="bg-slate-100 font-bold text-slate-800">
              <tr>
                <th class="p-2 border">तपशील (Service Particulars)</th>
                <th class="p-2 border text-right">रक्कम (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="p-2 border font-medium">${inv.serviceName}</td>
                <td class="p-2 border text-right">₹${inv.totalAmount}</td>
              </tr>
              <tr>
                <td class="p-2 border text-slate-500 pl-4">अ) अधिकृत शासकीय शुल्क (Government Fee)</td>
                <td class="p-2 border text-right text-slate-600">₹${inv.govFee}</td>
              </tr>
              <tr>
                <td class="p-2 border text-slate-500 pl-4">ब) सेतू केंद्र इंटरनेट व प्रोसेसिंग शुल्क</td>
                <td class="p-2 border text-right text-slate-600">₹${inv.processingFee}</td>
              </tr>
              <tr class="font-black bg-slate-50 text-sm">
                <td class="p-2 border text-slate-900">एकूण भरलेली रक्कम (Total Amount Paid)</td>
                <td class="p-2 border text-right text-emerald-800">₹${inv.totalAmount}</td>
              </tr>
            </tbody>
          </table>

          <!-- Signatures & Verification QR -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
            <div class="flex items-center gap-3">
              <canvas id="invoice-verify-qr" class="rounded border p-1 bg-white"></canvas>
              <div>
                <div class="font-bold text-emerald-700">✓ पेमेंट यशस्वी (PAID)</div>
                <div class="text-[10px] text-slate-500 font-mono">UTR: ${inv.utrNumber}</div>
                <div class="text-[9px] text-slate-400">QR स्कॅन करून सत्यता पडताळा</div>
              </div>
            </div>

            <div class="text-center">
              <div class="kendra-stamp kendra-stamp-approved mx-auto mb-1">
                <span>EASY ONLINE</span>
                <span>★ SETU KENDRA ★</span>
                <span>SEAL & SIGN</span>
              </div>
              <div class="text-[10px] font-bold text-slate-700">अधिकृत स्वाक्षरी व शिक्का</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ---------------- OFFICIAL CERTIFICATE VIEW ---------------- //

  showCertificateModal(appId) {
    const apps = StorageManager.getApplications();
    const app = apps.find(a => a.id === appId);
    if (app) {
      this.state.selectedCertApp = app;
      this.state.activeModal = 'certModal';
      this.render();
    }
  },

  renderCertificateModal(settings) {
    const app = this.state.selectedCertApp;
    if (!app) return '';

    return `
      <div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 relative max-h-[92vh] overflow-y-auto">
        <div class="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <span class="text-xs font-bold text-emerald-700 flex items-center gap-1">
            <i data-lucide="shield-check" class="w-4 h-4"></i>
            अधिकृत डिजिटल स्वाक्षरी प्रमाणपत्र (Official Digitally Signed Certificate)
          </span>
          <div class="flex items-center gap-2">
            <button onclick="window.print()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5">
              <i data-lucide="printer" class="w-4 h-4"></i>
              <span>दाखला प्रिंट / सेव्ह करा</span>
            </button>
            <button onclick="App.state.activeModal = null; App.render();" class="text-slate-400 hover:text-slate-600 p-1">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <!-- Official Certificate Body -->
        <div class="p-8 border-4 border-double border-blue-950 rounded-2xl relative bg-white text-slate-900" id="certificate-printable-content">
          <!-- Header Emblem & Seals -->
          <div class="text-center border-b-2 border-slate-300 pb-4 mb-6">
            <div class="text-3xl font-serif text-blue-950 mb-1">॥ सत्यमेव जयते ॥</div>
            <h2 class="text-xl font-bold text-slate-800">महाराष्ट्र शासन / Government of Maharashtra</h2>
            <h3 class="text-lg font-black text-blue-900 mt-1">${app.serviceNameMr || app.serviceName}</h3>
            <div class="text-xs text-slate-600 mt-0.5">प्रमाणपत्र क्रमांक: <strong>${app.certificateNo || 'MH/REV/2026/CERT/1042'}</strong></div>
          </div>

          <!-- Certificate Content Text -->
          <div class="text-xs sm:text-sm leading-relaxed space-y-4 mb-8">
            <p>
              प्रमाणित करण्यात येते की, श्री/श्रीमती <strong>${app.applicantName}</strong>, 
              रा. <strong>${app.address}</strong> यांनी <strong>${settings.kendraName} (CSC ID: ${settings.kendraId})</strong> 
              मार्फत सादर केलेल्या अर्जाची व सोबत जोडलेल्या कागदपत्रांची महसूल विभागामार्फत योग्य ती पडताळणी करण्यात आली आहे.
            </p>
            <p>
              सदर दाखला महाराष्ट्र लोकसेवा हक्क अधिनियम २०१५ अंतर्गत विहित मुदतीत डिजिटल स्वाक्षरीसह निर्गमित करण्यात येत आहे. हा दाखला सर्व शासकीय, शैक्षणिक व कायदेशीर बाबींसाठी १००% वैध आहे.
            </p>
          </div>

          <!-- Bottom Footer with QR and Digital Sign Seal -->
          <div class="flex items-end justify-between pt-6 border-t-2 border-slate-300">
            <div class="text-center">
              <canvas id="cert-verify-qr" class="rounded border p-1 bg-white mx-auto mb-1"></canvas>
              <div class="text-[9px] text-slate-500 font-mono">स्कॅन करून ऑनलाईन पडताळा</div>
            </div>

            <div class="text-center">
              <div class="w-16 h-16 border-2 border-emerald-600 text-emerald-700 rounded-full flex flex-col items-center justify-center font-bold text-[8px] mx-auto mb-2 bg-emerald-50">
                <span>DIGITALLY</span>
                <span>SIGNED</span>
                <span>VALID</span>
              </div>
              <div class="text-xs font-bold text-slate-900">सक्षम प्राधिकारी / सेतू अधिकारी</div>
              <div class="text-[10px] text-slate-500">Digitally Signed on ${new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ---------------- SERVICE EDIT / ADD MODAL ---------------- //

  renderServiceEditModal() {
    const srv = this.state.editingService || {
      id: `srv-${Date.now()}`,
      category: 'revenue',
      titleEn: '',
      titleMr: '',
      descEn: '',
      descMr: '',
      govFee: 33,
      processingFee: 67,
      totalFee: 100,
      days: '2-3 Days',
      requiredDocs: ['Aadhaar Card', 'Ration Card', 'Photo'],
      active: true
    };

    return `
      <div class="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button onclick="App.state.activeModal = null; App.render();" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <h3 class="text-xl font-black text-slate-900 mb-1">
          ${this.state.editingService ? 'सेवा व दर अपडेट करा' : 'नवीन सेवा जोडा'}
        </h3>
        <p class="text-xs text-slate-500 mb-6">
          शासकीय व केंद्र सेवा शुल्क बदलल्यास ते थेट ग्राहकांच्या स्क्रीनवर दिसेल.
        </p>

        <form onsubmit="
          event.preventDefault();
          const s = {
            id: this.srvId.value,
            category: this.category.value,
            titleMr: this.titleMr.value.trim(),
            titleEn: this.titleEn.value.trim(),
            descMr: this.descMr.value.trim(),
            descEn: this.descEn.value.trim(),
            govFee: parseFloat(this.govFee.value || 0),
            processingFee: parseFloat(this.processingFee.value || 0),
            totalFee: parseFloat(this.govFee.value || 0) + parseFloat(this.processingFee.value || 0),
            days: this.days.value.trim(),
            requiredDocs: this.requiredDocs.value.split(',').map(d => d.trim()).filter(Boolean),
            active: this.active.checked
          };
          App.saveServiceChanges(s);
        " class="space-y-4 text-xs font-semibold text-slate-700">
          <input type="hidden" name="srvId" value="${srv.id}" />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1">सेवेचे नाव (मराठी) *</label>
              <input type="text" name="titleMr" value="${srv.titleMr}" placeholder="उदा. नवीन पॅन कार्ड" class="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold" required />
            </div>

            <div>
              <label class="block mb-1">Service Title (English) *</label>
              <input type="text" name="titleEn" value="${srv.titleEn}" placeholder="e.g. New PAN Card" class="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold" required />
            </div>

            <div>
              <label class="block mb-1">विभाग (Category) *</label>
              <select name="category" class="w-full p-2.5 rounded-xl border border-slate-300 text-xs">
                <option value="revenue" ${srv.category === 'revenue' ? 'selected' : ''}>महसूल विभाग (Revenue)</option>
                <option value="identity" ${srv.category === 'identity' ? 'selected' : ''}>ओळखपत्र (Identity)</option>
                <option value="welfare" ${srv.category === 'welfare' ? 'selected' : ''}>योजना व पेन्शन (Welfare)</option>
                <option value="farmer" ${srv.category === 'farmer' ? 'selected' : ''}>कृषी व शेतकरी (Farmer)</option>
                <option value="business" ${srv.category === 'business' ? 'selected' : ''}>व्यवसाय व परवाने (Business)</option>
              </select>
            </div>

            <div>
              <label class="block mb-1">कालावधी (Turnaround Days) *</label>
              <input type="text" name="days" value="${srv.days}" placeholder="उदा. 2-3 Days" class="w-full p-2.5 rounded-xl border border-slate-300 text-sm" required />
            </div>

            <div>
              <label class="block mb-1">शासकीय शुल्क (Govt Fee ₹) *</label>
              <input type="number" name="govFee" value="${srv.govFee}" class="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold" required />
            </div>

            <div>
              <label class="block mb-1">केंद्र सेवा शुल्क (Kendra Service Fee ₹) *</label>
              <input type="number" name="processingFee" value="${srv.processingFee}" class="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold" required />
            </div>
          </div>

          <div>
            <label class="block mb-1">माहिती / वर्णन (Description Marathi)</label>
            <textarea name="descMr" rows="2" class="w-full p-2.5 rounded-xl border border-slate-300 text-xs">${srv.descMr || ''}</textarea>
          </div>

          <div>
            <label class="block mb-1">आवश्यक कागदपत्रे (स्वल्पविरामाने वेगळे करा / Comma Separated)</label>
            <input type="text" name="requiredDocs" value="${(srv.requiredDocs || []).join(', ')}" class="w-full p-2.5 rounded-xl border border-slate-300 text-xs" />
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" name="active" id="srv-active" ${srv.active ? 'checked' : ''} class="w-4 h-4 rounded text-blue-600" />
            <label for="srv-active" class="text-xs font-bold text-slate-800">सेवा चालू ठेवा (Active & Visible on Portal)</label>
          </div>

          <div class="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button type="button" onclick="App.state.activeModal = null; App.render();" class="px-4 py-2 text-slate-600 font-bold">
              रद्द करा
            </button>
            <button type="submit" class="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow">
              सेव्ह करा (Save Service)
            </button>
          </div>
        </form>
      </div>
    `;
  },

  // ---------------- ADMIN APPLICATION DETAIL MODAL ---------------- //

  showAppDetailModal(appId) {
    const apps = StorageManager.getApplications();
    const app = apps.find(a => a.id === appId);
    if (app) {
      this.state.viewingApplication = app;
      this.state.activeModal = 'appDetailModal';
      this.render();
    }
  },

  renderAppDetailModal() {
    const app = this.state.viewingApplication;
    if (!app) return '';

    return `
      <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button onclick="App.state.activeModal = null; App.render();" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <span class="text-xs font-bold text-blue-700 uppercase tracking-wider">अर्ज तपासणी कक्ष</span>
        <h3 class="text-xl font-black text-slate-900 mt-1 mb-4">
          ${app.trackingId} - ${app.applicantName}
        </h3>

        <!-- Personal & Payment Info -->
        <div class="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
          <div><span class="text-slate-500">सेवा:</span> <strong class="text-slate-800">${app.serviceNameMr || app.serviceName}</strong></div>
          <div><span class="text-slate-500">मोबाईल:</span> <strong class="text-slate-800">${app.mobile}</strong></div>
          <div><span class="text-slate-500">शुल्क:</span> <strong class="text-emerald-700 font-bold">₹${app.amount}</strong></div>
          <div><span class="text-slate-500">UPI UTR:</span> <code class="text-slate-800 font-mono font-bold">${app.utrNumber || 'N/A'}</code></div>
          <div class="col-span-2"><span class="text-slate-500">पत्ता:</span> <span class="text-slate-800">${app.address}</span></div>
        </div>

        <!-- Documents List -->
        <div class="mb-6">
          <h4 class="text-xs font-bold text-slate-800 uppercase mb-3 flex items-center gap-1.5">
            <i data-lucide="paperclip" class="w-4 h-4 text-orange-600"></i>
            <span>अपलोड केलेली कागदपत्रे (${(app.documents && app.documents.length) || 0}):</span>
          </h4>

          <div class="space-y-2">
            ${(app.documents && app.documents.length > 0) ? app.documents.map(d => `
              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div class="flex items-center gap-2">
                  <span class="uppercase font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${d.type === 'pdf' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}">
                    ${d.type}
                  </span>
                  <span class="font-bold text-slate-800">${d.name || d.fileName}</span>
                  <span class="text-slate-400">(${d.size || '350 KB'})</span>
                </div>
                ${d.dataUrl ? `
                  <button 
                    onclick='App.previewDocument(${JSON.stringify(d)})' 
                    class="text-blue-700 hover:underline font-bold"
                  >
                    पहा (View)
                  </button>
                ` : `
                  <span class="text-emerald-600 font-bold">✓ कागदपत्र संलग्न</span>
                `}
              </div>
            `).join('') : `
              <p class="text-xs text-slate-400">कोणतेही कागदपत्र अपलोड केलेले नाही.</p>
            `}
          </div>
        </div>

        <!-- Status & Remarks Form -->
        <form onsubmit="
          event.preventDefault();
          App.updateAppStatus('${app.id}', this.status.value, this.remarks.value);
          App.state.activeModal = null;
          App.render();
        " class="space-y-4 pt-4 border-t border-slate-200 text-xs font-semibold">
          <div>
            <label class="block mb-1 text-slate-700">अर्जाची सद्यस्थिती (Update Application Status) *</label>
            <select name="status" class="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-sm">
              <option value="PENDING" ${app.status === 'PENDING' ? 'selected' : ''}>PENDING (अर्ज दाखल)</option>
              <option value="VERIFYING" ${app.status === 'VERIFYING' ? 'selected' : ''}>VERIFYING (कागदपत्र पडताळणी)</option>
              <option value="PROCESSING" ${app.status === 'PROCESSING' ? 'selected' : ''}>PROCESSING (शासकीय प्रक्रियेत)</option>
              <option value="APPROVED" ${app.status === 'APPROVED' ? 'selected' : ''}>APPROVED (मंजूर व दाखला तयार)</option>
              <option value="REJECTED" ${app.status === 'REJECTED' ? 'selected' : ''}>REJECTED (त्रुटी / नामंजूर)</option>
            </select>
          </div>

          <div>
            <label class="block mb-1 text-slate-700">अधिकाऱ्यांची शेरा नोंद (Officer Remarks for Citizen) *</label>
            <textarea name="remarks" rows="2" class="w-full p-2.5 rounded-xl border border-slate-300 text-xs">${app.officerRemarks || ''}</textarea>
          </div>

          <div class="flex justify-end gap-2">
            <button type="button" onclick="App.state.activeModal = null; App.render();" class="px-4 py-2 text-slate-600 font-bold">
              बंद करा
            </button>
            <button type="submit" class="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow">
              स्थिती अपडेट करा (Save Status)
            </button>
          </div>
        </form>
      </div>
    `;
  }
};

// Initialize App on DOMContentLoaded
if (typeof window !== 'undefined') {
  window.App = App;
  window.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App };
}

