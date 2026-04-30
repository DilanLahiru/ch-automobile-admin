import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import InvoiceLogo from "../assets/InvoiceLogo.png";

/**
 * Utility function to format currency (PKR)
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Utility function to format date (short, e.g., "3 Feb 2026")
 */
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Utility function to format time (e.g., "12:35 pm")
 */
const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Generate professional HTML template for service history record with logo and blue theme
 */
const generateServiceHistoryHTML = (serviceOrder) => {
  const partsHTML = serviceOrder.parts?.length
    ? serviceOrder.parts.map(
        (part) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-transform: lowercase;">${
            part.name || "N/A"
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${
            part.quantity || 0
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatCurrency(
            part.price || 0
          )}</td>
         </tr>`
      ).join("")
    : `
         <tr>
          <td colspan="3" style="padding: 8px; text-align: center; color: #718096;">No parts used</td>
         </tr>`;

  const statusText = serviceOrder.status
    ? serviceOrder.status.charAt(0).toUpperCase() + serviceOrder.status.slice(1)
    : "Completed";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Service History - ${serviceOrder.vehicleNumber}</title>
      <style>
        /* Reset & Base */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: #f1f5f9;
          padding: 20px;
        }
        /* Container simulates A4 paper */
        .document {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
          border-radius: 12px;
          overflow: hidden;
        }
        /* Inner content with padding */
        .content {
          padding: 10mm 12mm;
        }

        /* Header with Logo */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 16px;
          flex-wrap: wrap;
        }
        .logo-area {
          flex-shrink: 0;
        }
        .logo {
          max-height: 100px;
          width: auto;
          margin-left: -40px;
        }
        .company-info {
          text-align: right;
        }
        .company-name {
          font-size: 20px;
          font-weight: 700;
          color: #1e3a8a;
          letter-spacing: -0.5px;
        }
        .company-tagline {
          font-size: 12px;
          color: #3b82f6;
          margin-top: 4px;
        }
        .company-contact {
          font-size: 10px;
          color: #475569;
          margin-top: 8px;
          line-height: 1.4;
        }
        .contact-item {
          margin-bottom: 2px;
        }
        .document-title {
          font-size: 18px;
          font-weight: 600;
          background: #eff6ff;
          display: inline-block;
          padding: 4px 16px;
          border-radius: 40px;
          margin-top: 12px;
          color: #1e40af;
        }

        /* Info Cards */
        .info-grid {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .info-card {
          flex: 1;
          background: #f8fafc;
          border-radius: 12px;
          padding: 12px 16px;
          border: 1px solid #bfdbfe;
        }
        .info-card-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #2563eb;
          margin-bottom: 12px;
        }
        .info-row {
          display: flex;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .info-label {
          font-weight: 500;
          width: 110px;
          color: #334155;
          font-size: 12px;
        }
        .info-value {
          color: #0f172a;
          font-weight: 500;
          font-size: 11px;
        }

        /* Table Styles */
        .section-title {
          font-size: 14px;
          font-weight: 600;
          margin: 20px 0 12px 0;
          padding-bottom: 6px;
          border-bottom: 2px solid #3b82f6;
          color: #1e3a8a;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        th {
          background: #eff6ff;
          padding: 10px 8px;
          text-align: left;
          font-weight: 600;
          border-bottom: 1px solid #bfdbfe;
          color: #1e40af;
        }
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }

        /* Totals */
        .totals {
          margin-top: 20px;
          border-top: 2px solid #3b82f6;
          padding-top: 16px;
          text-align: right;
        }
        .total-line {
          display: flex;
          justify-content: flex-end;
          gap: 30px;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .total-label {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #2563eb;
          margin-bottom: 4px;
        }
        .total-amount {
          font-weight: 700;
          font-size: 13px;
          width: 120px;
          text-align: right;
        }
        .grand-total {
          font-size: 16px;
          font-weight: 700;
          color: #1e3a8a;
          margin-top: 8px;
          border-top: 2px solid #bfdbfe;
          padding-top: 12px;
          gap: 50px;
        }
        .grand-total .total-label {
          font-size: 14px;
        }

        /* Footer */
        .footer {
          margin-top: 28px;
          text-align: center;
          font-size: 10px;
          color: #64748b;
          border-top: 1px solid #bfdbfe;
          padding-top: 16px;
        }

        /* Print adjustments */
        @media print {
          body {
            background: white;
            padding: 0;
            margin: 0;
          }
          .document {
            box-shadow: none;
            border-radius: 0;
            margin: 0;
            max-width: 100%;
          }
          .content {
            padding: 8mm;
          }
          .info-card {
            break-inside: avoid;
          }
          table, tr, td, th {
            break-inside: avoid;
          }
          .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            background: white;
          }
        }
      </style>
    </head>
    <body>
      <div class="document">
        <div class="content">
          <!-- Header with Logo -->
          <div class="header">
            <div class="logo-area">
              <img src="${InvoiceLogo}" alt="Company Logo" class="logo" />
            </div>
            <div class="company-info">
              <div class="company-contact">
                <div class="contact-item">Tel: +94 (71) 427 4163 / +94 (34) 222 1176</div>
                <div class="contact-item">Email: chautomob@gmail.com</div>
                <div class="contact-item">Address: 304 A Abhaya Street, Nagoda, Kalutara</div>
              </div>
            </div>
          </div>

          <!-- Two-column info cards -->
          <div class="info-grid">
            <div class="info-card">
              <div class="info-card-title">VEHICLE & CUSTOMER INFO</div>
              <div class="info-row">
                <div class="info-label">Customer:</div>
                <div class="info-value">${serviceOrder.customerId?.name || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Vehicle No:</div>
                <div class="info-value">${serviceOrder.vehicleNumber || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Contact:</div>
                <div class="info-value">${serviceOrder.customerId?.contactNumber || "N/A"}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">${serviceOrder.customerId?.email || "N/A"}</div>
              </div>
            </div>
            <div class="info-card">
              <div class="info-card-title">CREATED ON</div>
              <div class="info-row">
                <div class="info-label">Date:</div>
                <div class="info-value">${formatDate(serviceOrder.createdAt)}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Created By:</div>
                <div class="info-value">Admin</div>
              </div>
              <div class="info-row">
                <div class="info-label">Contact:</div>
                <div class="info-value">+94 (71) 427 4163</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">chautomob@gmail.com</div>
              </div>
            </div>
          </div>

          <!-- Customer & Service Info (combined in one card) -->
          <div class="info-card" style="margin-bottom: 20px;">
            <div class="info-card-title">SERVICE INFO</div>
            <div class="info-row">
              <div class="info-label">Status:</div>
              <div class="info-value" style="color: #2563eb;">${statusText}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Technician:</div>
              <div class="info-value">${serviceOrder.employeeId?.name || "Unassigned"}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Description:</div>
              <div class="info-value">${serviceOrder.serviceDescription || "General Service"}</div>
            </div>
          </div>

          <!-- Parts Table -->
          <div class="section-title">PARTS USED</div>
          <table>
            <thead>
              <tr>
                <th style="width: 55%;">Part Name</th>
                <th style="width: 20%;" class="text-center">Qty</th>
                <th style="width: 25%;" class="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              ${partsHTML}
            </tbody>
          </table>

          <!-- Totals -->
          <div class="totals">
            <div class="total-line">
              <span class="total-label">Labor Cost:</span>
              <span class="total-amount">${formatCurrency(serviceOrder.laborCost || 0)}</span>
            </div>
            <div class="total-line">
              <span class="total-label">Parts Cost:</span>
              <span class="total-amount">${formatCurrency((serviceOrder.totalAmount || 0) - (serviceOrder.laborCost || 0))}</span>
            </div>
            <div class="total-line">
              <span class="total-label">Total Amount:</span>
              <span class="total-amount">${formatCurrency(serviceOrder.totalAmount || 0)}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>This is a computer-generated document and does not require a signature.</p>
            <p>Generated on ${new Date().toLocaleString("en-PK")}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Download service history record as PDF (high-quality image capture)
 */
export const downloadServiceHistoryAsPDF = async (serviceOrder, filename = null) => {
  if (!serviceOrder) return;

  const defaultFilename = `Service_History_${serviceOrder.vehicleNumber}_${Date.now()}.pdf`;
  const finalFilename = filename || defaultFilename;

  try {
    // Create temporary container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.innerHTML = generateServiceHistoryHTML(serviceOrder);
    document.body.appendChild(container);

    // Capture with high scale for crisp text and images
    const canvas = await html2canvas(container, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      allowTaint: false,
      imageTimeout: 15000,
      logging: false,
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL("image/png", 0.95);
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    // Multi‑page handling
    let yOffset = 0;
    while (yOffset < imgHeight) {
      if (yOffset > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -yOffset, imgWidth, imgHeight);
      yOffset += pdfHeight;
    }

    pdf.setProperties({
      title: `Service History - ${serviceOrder.vehicleNumber}`,
      subject: "Service Order Record",
      author: "CH Automobile Service",
      creator: "Service Management System",
    });

    pdf.save(finalFilename);
  } catch (error) {
    console.error("PDF generation error:", error);
    alert("Unable to generate PDF. Please try again.");
  }
};

/**
 * Print service history record directly (best for multi‑page, native print)
 */
export const printServiceHistory = async (serviceOrder) => {
  if (!serviceOrder) return;

  try {
    const printWindow = window.open("", "_blank");
    const printDoc = printWindow.document;

    printDoc.write(generateServiceHistoryHTML(serviceOrder));
    printDoc.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 300);
  } catch (error) {
    console.error("Print error:", error);
    alert("Unable to open print dialog. Please try again.");
  }
};

/**
 * Optional: apply dot‑matrix optimizations if needed (kept for compatibility)
 */
export const optimizeForDotMatrix = (invoiceElement) => {
  if (!invoiceElement) return;

  const dotMatrixStyles = `
    * {
      font-family: 'Courier New', monospace !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .bg-gradient-to-r, .bg-gradient-to-b, .shadow, .shadow-lg, .shadow-md {
      background: white !important;
      box-shadow: none !important;
    }
    .text-gray-500, .text-gray-600, .text-gray-700 {
      color: black !important;
    }
    .border-gray-200, .border-gray-300 {
      border-color: black !important;
    }
    .bg-gray-50, .bg-slate-50 {
      background-color: white !important;
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = dotMatrixStyles;
  document.head.appendChild(styleSheet);

  return () => document.head.removeChild(styleSheet);
};