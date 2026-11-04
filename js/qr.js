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

    const defaultOptions = {
      width: options.width || 220,
      margin: 2,
      color: {
        dark: options.color || '#0F2744',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    };

    if (window.QRCode && typeof window.QRCode.toCanvas === 'function') {
      window.QRCode.toCanvas(canvasElement, text, defaultOptions, function (error) {
        if (error) {
          console.error("QR generation error:", error);
          QRUtil.renderFallback(canvasElement, text);
        }
      });
    } else {
      // Fallback if library is still loading
      QRUtil.renderFallback(canvasElement, text);
    }
  },

  /**
   * High quality fallback generator using SVG/image
   */
  renderFallback(canvasElement, text) {
    const encoded = encodeURIComponent(text);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encoded}&color=0F2744&bgcolor=FFFFFF&margin=10`;
    img.onload = () => {
      const ctx = canvasElement.getContext('2d');
      canvasElement.width = 220;
      canvasElement.height = 220;
      ctx.drawImage(img, 0, 0, 220, 220);
    };
  }
};
