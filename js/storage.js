/**
 * Easy Online Services - Storage Management System
 * Handles reactive state and persistent local storage
 */

const StorageManager = {
  KEYS: {
    SETTINGS: 'eos_settings',
    SERVICES: 'eos_services',
    APPLICATIONS: 'eos_applications',
    INVOICES: 'eos_invoices',
    USERS: 'eos_users',
    CURRENT_USER: 'eos_current_user',
    ADMIN_AUTH: 'eos_admin_auth',
    LANGUAGE: 'eos_lang'
  },

  init() {
    if (!localStorage.getItem(this.KEYS.SETTINGS)) {
      localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(this.KEYS.SERVICES)) {
      localStorage.setItem(this.KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
    }
    if (!localStorage.getItem(this.KEYS.APPLICATIONS)) {
      localStorage.setItem(this.KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    }
    if (!localStorage.getItem(this.KEYS.INVOICES)) {
      localStorage.setItem(this.KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
    }
    if (!localStorage.getItem(this.KEYS.USERS)) {
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(this.KEYS.LANGUAGE)) {
      localStorage.setItem(this.KEYS.LANGUAGE, 'mr'); // Default Marathi for Aaple Sarkar Kendra
    }
  },

  // Settings
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SETTINGS)) || DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(newSettings) {
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(newSettings));
  },

  // Services
  getServices() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.SERVICES)) || DEFAULT_SERVICES;
    } catch (e) {
      return DEFAULT_SERVICES;
    }
  },

  saveServices(services) {
    localStorage.setItem(this.KEYS.SERVICES, JSON.stringify(services));
  },

  getServiceById(id) {
    const list = this.getServices();
    return list.find(s => s.id === id);
  },

  updateService(updated) {
    const list = this.getServices();
    const idx = list.findIndex(s => s.id === updated.id);
    if (idx !== -1) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    this.saveServices(list);
    return list;
  },

  deleteService(id) {
    let list = this.getServices();
    list = list.filter(s => s.id !== id);
    this.saveServices(list);
    return list;
  },

  // Applications
  getApplications() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.APPLICATIONS)) || INITIAL_APPLICATIONS;
    } catch (e) {
      return INITIAL_APPLICATIONS;
    }
  },

  saveApplications(apps) {
    localStorage.setItem(this.KEYS.APPLICATIONS, JSON.stringify(apps));
  },

  getApplicationByTracking(trackingId) {
    const apps = this.getApplications();
    const cleanId = (trackingId || '').trim().toUpperCase();
    return apps.find(a => a.trackingId.toUpperCase() === cleanId || a.mobile === cleanId);
  },

  addApplication(app) {
    const apps = this.getApplications();
    apps.unshift(app);
    this.saveApplications(apps);

    // Also auto-generate invoice
    const inv = {
      invoiceNo: "INV-2026-" + app.trackingId.replace('EOS-2026-', ''),
      trackingId: app.trackingId,
      customerName: app.applicantName,
      mobile: app.mobile,
      serviceName: app.serviceName + ' / ' + (app.serviceNameMr || ''),
      date: new Date().toISOString().split('T')[0],
      govFee: app.govFee || 0,
      processingFee: app.processingFee || 0,
      totalAmount: app.amount || 0,
      paymentMode: "UPI / QR Code",
      utrNumber: app.utrNumber || "PENDING",
      status: app.paymentStatus === 'SUCCESS' ? 'PAID' : 'PENDING'
    };
    this.addInvoice(inv);
    return app;
  },

  updateApplication(updated) {
    const apps = this.getApplications();
    const idx = apps.findIndex(a => a.id === updated.id);
    if (idx !== -1) {
      apps[idx] = updated;
      this.saveApplications(apps);
    }
    return updated;
  },

  // Invoices
  getInvoices() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.INVOICES)) || INITIAL_INVOICES;
    } catch (e) {
      return INITIAL_INVOICES;
    }
  },

  saveInvoices(invoices) {
    localStorage.setItem(this.KEYS.INVOICES, JSON.stringify(invoices));
  },

  addInvoice(inv) {
    const invoices = this.getInvoices();
    invoices.unshift(inv);
    this.saveInvoices(invoices);
    return inv;
  },

  // Users
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.USERS)) || INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  },

  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    return user;
  },

  findUser(mobile) {
    const users = this.getUsers();
    return users.find(u => u.mobile === mobile);
  },

  // Authentication State
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.CURRENT_USER));
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.KEYS.CURRENT_USER);
    }
  },

  isAdmin() {
    return localStorage.getItem(this.KEYS.ADMIN_AUTH) === 'true';
  },

  setAdmin(val) {
    if (val) {
      localStorage.setItem(this.KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(this.KEYS.ADMIN_AUTH);
    }
  },

  // Language
  getLanguage() {
    return localStorage.getItem(this.KEYS.LANGUAGE) || 'mr';
  },

  setLanguage(lang) {
    localStorage.setItem(this.KEYS.LANGUAGE, lang);
  }
};

// Initialize immediately on load
StorageManager.init();

if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageManager };
}

