/**
 * Easy Online Services - QR Code Generator & UPI Utility
 * Generates official UPI QR Codes compliant with NPCI standards
 */

const QRUtil = {
  /**
   * Builds NPCI compliant UPI payment string
   * e.g. upi://pay?pa=9834005538@upi&pn=Easy%20Online%20Services&am=100.00&cu=INR&tn=EOS-2026-1042
   */
  generateUpiString({ upiId, payeeName, amount, trackingId, note }) {
    const cleanUpi = (upiId || "9834005538@upi").trim();
    const cleanName = encodeURIComponent((payeeName || "Easy Online Services").trim());
    const cleanAmt = parseFloat(amount || 0).toFixed(2);
    const cleanNote = encodeURIComponent((note || `Payment for ${trackingId || 'Application'}`).trim());

    return `upi://pay?pa=${cleanUpi}&pn=${cleanName}&am=${cleanAmt}&cu=INR&tn=${cleanNote}`;
  },

  /**
   * Renders QR Code on a canvas element
   */
  renderOnCanvas(canvasElement, text, options = {}) {
    if (!canvasElement) return;

    const width = options.width || 220;
    const darkColor = options.color || '#0F2744';
    const lightColor = '#FFFFFF';

    // 1. If qrcode-generator is loaded
    if (typeof window.qrcode === 'function') {
      try {
        const qr = window.qrcode(0, 'M');
        qr.addData(text);
        qr.make();

        const count = qr.getModuleCount();
        const margin = 4;
        const totalModules = count + margin * 2;
        const cellSize = Math.floor(width / totalModules) || 3;
        const actualSize = cellSize * totalModules;

        canvasElement.width = actualSize;
        canvasElement.height = actualSize;
        const ctx = canvasElement.getContext('2d');

        // Background
        ctx.fillStyle = lightColor;
        ctx.fillRect(0, 0, actualSize, actualSize);

        // Modules
        ctx.fillStyle = darkColor;
        for (let row = 0; row < count; row++) {
          for (let col = 0; col < count; col++) {
            if (qr.isDark(row, col)) {
              ctx.fillRect((col + margin) * cellSize, (row + margin) * cellSize, cellSize, cellSize);
            }
          }
        }
        return;
      } catch (e) {
        console.warn("qrcode-generator error, trying fallback:", e);
      }
    }

    // 2. If node-qrcode QRCode.toCanvas is loaded
    if (window.QRCode && typeof window.QRCode.toCanvas === 'function') {
      window.QRCode.toCanvas(canvasElement, text, {
        width: width,
        margin: 2,
        color: { dark: darkColor, light: lightColor }
      }, (err) => {
        if (err) QRUtil.renderFallback(canvasElement, text, width);
      });
      return;
    }

    // 3. Fallback to high-res image service
    QRUtil.renderFallback(canvasElement, text, width);
  },

  /**
   * Fallback generator using QR image
   */
  renderFallback(canvasElement, text, width = 220) {
    if (typeof Image === 'undefined' || !canvasElement) return;
    const encoded = encodeURIComponent(text);
    const img = new Image();

    img.crossOrigin = 'Anonymous';
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${width}x${width}&data=${encoded}&color=0F2744&bgcolor=FFFFFF&margin=10`;
    img.onload = () => {
      canvasElement.width = width;
      canvasElement.height = width;
      const ctx = canvasElement.getContext('2d');
      ctx.drawImage(img, 0, 0, width, width);
    };
  }
};

if (typeof window !== 'undefined') {
  window.QRUtil = QRUtil;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QRUtil };
}

