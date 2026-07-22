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

const formatMileage = (mileage) => {
  const parsedMileage = Number(mileage);
  if (!Number.isFinite(parsedMileage) || parsedMileage < 0) {
    return "N/A";
  }

  return `${new Intl.NumberFormat("en-PK").format(parsedMileage)} km`;
};

// Calculate 3% fee with parts and labor cost included in subtotal
const getRepairSubtotal = (repair) => {
    if (!repair) return 0;

    const parts = repair.parts || [];
    const partsTotal = parts.reduce((sum, part) => {
      const price = part.price || 0;
      const quantity = part.quantity || 0;
      return sum + price * quantity;
    }, 0);

    const laborCost = parseFloat(repair.laborCost) || 0;
    return partsTotal + laborCost;
  };

  const calculateCardProcessingFee = (repair) => {
    if (!repair || repair.paymentType !== "card") return 0;
    const subtotal = getRepairSubtotal(repair);
    return subtotal * 0.03;
  };

  const getServiceTypeEntries = (serviceOrder) => {
    if (Array.isArray(serviceOrder?.serviceTypeEntries) && serviceOrder.serviceTypeEntries.length > 0) {
      return serviceOrder.serviceTypeEntries.map((entry) => ({
        serviceType: entry.serviceType || "Service",
        description: entry.description || "",
        servicePrice: parseFloat(entry.serviceRate || entry.servicePrice || 0) || 0,
        laborCost: parseFloat(entry.laborCost || entry.servicePrice || 0) || 0,
      }));
    }

    if (serviceOrder?.serviceType || serviceOrder?.serviceDescription) {
      return [
        {
          serviceType: serviceOrder.serviceType || "General Service",
          description: serviceOrder.serviceDescription || "",
          servicePrice: parseFloat(serviceOrder.laborCost || 0) || 0,
          laborCost: parseFloat(serviceOrder.laborCost || 0) || 0,
        },
      ];
    }

    return [];
  };

const generateServiceHistoryHTML = (serviceOrder) => {
  const serviceEntries = getServiceTypeEntries(serviceOrder);
  const serviceEntriesHTML = serviceEntries.length
    ? serviceEntries
        .map(
          (entry) => `
        <tr>
          <td>
            <div style="font-weight:600; color:#111827; font-size:10px;">${entry.serviceType || "Service"}</div>
            ${entry.description ? `<div style="font-size:10px; color:#666; margin-top:4px;">${entry.description}</div>` : ""}
          </td>
          <td style="font-size:10px; color:#111827">${formatCurrency(entry.servicePrice || 0)}</td>
          <td style="font-size:10px; color:#111827">${formatCurrency(entry.laborCost || 0)}</td>
        </tr>`,
        )
        .join("")
    : `
        <tr>
          <td colspan="3" style="padding: 16px; text-align: center; color: #718096;">No service items recorded</td>
        </tr>`;

  const partsHTML = serviceOrder.parts?.length
    ? serviceOrder.parts
        .map(
          (part) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-transform: lowercase;">${
            part.name || "N/A"
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${
            part.quantity || 0
          }</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatCurrency(
            part.discountPercent || 0,
          )}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatCurrency(
            part.price || 0,
          )}</td>
        </tr>`,
        )
        .join("")
    : `
        <tr>
          <td colspan="4" style="padding: 8px; text-align: center; color: #718096;">No parts used</td>
        </tr>`;

  const statusText = serviceOrder.status
    ? serviceOrder.status.charAt(0).toUpperCase() + serviceOrder.status.slice(1)
    : "Completed";

  // Calculate total other charges (for summary, if needed)
  const otherChargesTotal = (serviceOrder.otherCharges || []).reduce(
    (sum, charge) => sum + (charge.amount || 0),
    0,
  );

  // Calculate service charge at full rate
  const serviceChargeAtRate = serviceEntries.reduce(
    (sum, entry) => sum + (entry.servicePrice || 0),
    0,
  );

  // Calculate service charge at actual amount
  const serviceChargeAtAmount = serviceEntries.reduce(
    (sum, entry) => sum + (entry.laborCost || 0),
    0,
  );

  // Calculate service discount (rate - amount)
  const serviceDiscount = Math.max(0, serviceChargeAtRate - serviceChargeAtAmount);

  // Calculate material prices at full price
  const materialsFullPrice = (serviceOrder.parts || []).reduce(
    (sum, part) => sum + (part.price || 0) * (part.quantity || 0),
    0,
  );

  // Calculate material discount from percent discounts
  const materialsDiscount = (serviceOrder.parts || []).reduce(
    (sum, part) => {
      const basePrice = (part.price || 0) * (part.quantity || 0);
      const discountPercent = parseFloat(part.discountPercent) || 0;
      return sum + (basePrice * (discountPercent / 100));
    },
    0,
  );

  // Calculate material prices after discount
  const materialsSubtotal = materialsFullPrice - materialsDiscount;

  // Calculate external material prices at full price
  const externalMaterialsFullPrice = (serviceOrder.externalParts || []).reduce(
    (sum, part) => sum + (part.price || 0) * (part.quantity || 0),
    0,
  );

  // Calculate external material discount from percent discounts
  const externalMaterialsDiscount = (serviceOrder.externalParts || []).reduce(
    (sum, part) => {
      const basePrice = (part.price || 0) * (part.quantity || 0);
      const discountPercent = parseFloat(part.discountPercent) || 0;
      return sum + (basePrice * (discountPercent / 100));
    },
    0,
  );

  // Calculate external material prices after discount
  const externalMaterialsSubtotal = externalMaterialsFullPrice - externalMaterialsDiscount;

  // Total discount from all sources
  const totalDiscount = serviceDiscount + materialsDiscount + externalMaterialsDiscount;

  // Subtotal before any discount and if payment type is card, include card processing fee in subtotal
  const cardProcessingFee = serviceOrder.paymentType === "card" ? (serviceChargeAtRate + materialsFullPrice + externalMaterialsFullPrice) * 0.03 : 0;
  const subtotalBeforeDiscount = serviceChargeAtRate + materialsFullPrice + externalMaterialsFullPrice + cardProcessingFee + otherChargesTotal;

  // Subtotal after all discounts
  const subtotalAfterDiscount = subtotalBeforeDiscount - totalDiscount;

  return `
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Service Invoice</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', 'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      background: #efefef;
      font-weight: 400;
      line-height: 1.5;
    }

    .invoice {
      width: 210mm;
      margin: auto;
      background: white;
      color: #222;
    }

    .section {
      padding: 24px 36px;
    }

    hr {
      border: none;
      border-top: 1px solid #ddd;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .logo {
      width: 400px;
      margin-left: -50px;
    }

    .company {
      text-align: right;
      line-height: 1.8;
      font-size: 10px;
      margin-top: 30px;
    }

    .company-info {
      font-size: 10px;
      margin-bottom: 2px;
      font-weight: 500;
      color:#666
    }

    .top-info {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }

    .block {
      width: 48%;
    }

    .label {
      font-weight: 600;
      margin-bottom: 5px;
      font-size: 11px;
      margin-left: 10px;
    }

    .small {
      color: #666;
      line-height: 1.7;
      font-size: 11px;
      font-weight: 500;
    }

    .invoice-meta {
      text-align: right;
    }

    .invoice-meta div {
      margin-bottom: 1px;
    }

    .status {
      text-align: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 30px;
    }

    .status b {
      font-weight: 600;
      text-align: right;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th {
      text-align: left;
      padding: 8px 10px;
      border-bottom: 2px solid #ddd;
      font-size: 13px;
      font-weight: 600;
    }

    td {
      padding: 12px 10px;
      border-bottom: 1px solid #eee;
      font-size: 11px;
      font-weight: 500;
      color: #666;
    }

    td:last-child,
    th:last-child {
      text-align: right;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      margin: 20px 0 8px 0;
      letter-spacing: 0.5px;
      color: #1a202c;
    }

    .summary {
      width: 320px;
      margin-left: auto;
      margin-top: 30px;
    }

    .summary-label {
      font-size: 10px;
      font-weight: 500;
      color: #666;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
    }

    .total {
      font-size: 13px;
      font-weight: 700;
      margin-top: 10px;
    }

    /* New bottom section: terms, bank, QR */
    .invoice-bottom {
      margin-top: 10px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
    }

    .terms-conditions {
      font-size: 11px;
      color: #2d3748;
      margin-bottom: 18px;
      line-height: 1.5;
    }

    .terms-conditions strong {
      font-weight: 700;
      font-size: 12px;
    }

    .bank-details {
      background: #f8fafc;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 11px;
      font-family: monospace;
      margin-bottom: 18px;
      border: 1px solid #e2edf2;
      color: #0f172a;
      line-height: 1.6;
    }

    .payment-qr-wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 16px;
    }

    .payment-link-text {
      font-size: 11px;
      color: #1a202c;
      flex: 2;
    }

    .payment-link-text a {
      color: #2c7da0;
      text-decoration: none;
      word-break: break-all;
      font-weight: 500;
    }

    .qr-container {
      flex-shrink: 0;
      text-align: center;
      background: white;
      padding: 6px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .qr-container img {
      width: 100px;
      height: 100px;
      display: block;
    }

    .page-footer {
      margin-top: 20px;
      font-size: 9px;
      color: #94a3b8;
      text-align: center;
      border-top: 1px dashed #e2e8f0;
      padding-top: 16px;
      font-weight: 400;
    }

    .terms-qr-row {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      align-items: flex-start;
      margin-bottom: 24px;
    }
    .qr-left {
      flex-shrink: 0;
      text-align: center;
      background: white;
      padding: 8px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .qr-left img {
      width: 110px;
      height: 110px;
      display: block;
    }
    .qr-left .qr-label {
      font-size: 9px;
      color: #4a5568;
      margin-top: 6px;
    }
    .terms-right {
      flex: 1;
      font-size: 11px;
      color: #2d3748;
      line-height: 1.5;
    }
    .terms-right strong {
      font-weight: 700;
      font-size: 12px;
      display: block;
      margin-bottom: 6px;
    }
    .terms-right p {
      margin-bottom: 6px;
    }
    .payment-link-text {
      margin-top: 8px;
      font-size: 10px;
    }
    .payment-link-text a {
      color: #2c7da0;
      word-break: break-all;
    }
    .bank-details {
      background: #f8fafc;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 11px;
      font-family: monospace;
      margin-bottom: 18px;
      border: 1px solid #e2edf2;
      color: #0f172a;
      line-height: 1.6;
    }
    .page-footer {
      margin-top: 20px;
      font-size: 9px;
      color: #94a3b8;
      text-align: center;
      border-top: 1px dashed #e2e8f0;
      padding-top: 16px;
      font-weight: 400;
    }
    .note {
      margin-top: 20px;
      line-height: 1.6;
      font-size: 11px;
      padding: 12px 14px;
    }
    .note strong {
      font-size: 12px;
    }
  </style>
</head>
<body>
<div class="invoice">
  <div class="section">
    <div class="header">
      <div>
        <img src="${InvoiceLogo}" class="logo" alt="Company Logo"/>
      </div>
      <div class="company">
        <div class="company-info">
          <strong style="color:#111827;">CH Automobile.</strong>
          304A Abhaya Street
          Nagoda, Kalutara<br>
          <strong style="color:#111827;">Email: </strong>chautomob@gmail.com <strong style="color:#111827;">Phone: </strong> +94 71 427 4163<br>
          <strong style="color:#111827;">Website: </strong>www.chautomobile.lk <strong style="color:#111827;">Co. Reg. No. </strong> B.B 4229
        </div>
      </div>
    </div>
  </div>
  <hr>
  <div class="section">
    <div class="top-info">
      <div class="block" style="display:flex; gap:12px; align-items:flex-start;">
        <div class="label" style="min-width:40px;">Bill to:</div>
        <div class="small" style="flex:1;">
          <div style="color:#111827;">${serviceOrder.customerId?.name || ""}</div>
          <div style="margin-top:2px; color:#374151;">${serviceOrder.customerId?.contactNumber || ""}<br>
          ${serviceOrder.customerId?.email || ""}<br>
          ${serviceOrder.vehicleNumber || ""}</div>
        </div>
      </div>
      <div class="invoice-meta">
      <div class="status">
          <b style="font-size:11px;">Invoice</b>
          <div style="font-size:11px; margin-top:3px; font-weight:500; color:#666;">${serviceOrder.invoiceNumber || "N/A"}</div>
        </div>
        <div class="status">
          <b style="font-size:11px;">Invoice Date</b>
          <div style="font-size:11px; margin-top:3px; font-weight:500; color:#666;">${formatDate(serviceOrder.createdAt)}</div>
        </div>
        <div class="status">
          <b style="font-size:11px;">Status</b>
          <div style="font-size:11px; margin-top:3px; font-weight:500; color:#666;">${serviceOrder.status ? serviceOrder.status.charAt(0).toUpperCase() + serviceOrder.status.slice(1) : "Completed"}</div>
        </div>
        <div class="status">
          <b style="font-size:11px;">Technician</b>
          <div style="font-size:11px; margin-top:3px; font-weight:500; color:#666;">${serviceOrder.employeeId?.name || "N/A"}</div>
        </div>
        <div class="status">
          <b style="font-size:11px;">Payment Method</b>
          <div style="font-size:11px; margin-top:3px; font-weight:500; color:#666;">${serviceOrder.paymentType ? (serviceOrder.paymentType === "bank-transfer" ? "Bank Transfer" : serviceOrder.paymentType.charAt(0).toUpperCase() + serviceOrder.paymentType.slice(1)) : "N/A"}</div>
        </div>
        <div class="status">
          <b style="font-size:11px;">Current Mileage</b>
          <div style="font-size:11px; margin-top:3px; font-weight:500; color:#666;">${formatMileage(serviceOrder.currentMileage)}</div>
        </div>
      </div>
    </div>

    <!-- SERVICE ENTRIES TABLE -->
    <table style="margin-top: 30px;">
      <thead>
        <tr>
          <th style="font-weight:500; font-size:11px;">Service</th>
          <th style="font-weight:500; font-size:11px;">Rate</th>
          <th style="font-weight:500; font-size:11px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${serviceEntriesHTML}
      </tbody>
    </table>

    <!-- PARTS TABLE (unchanged) -->
    <table style="margin-top: 30px;">
      <thead>
        <tr>
          <th style="font-weight:500; font-size:11px;">Material & Parts</th>
          <th style="font-weight:500; font-size:11px;">Quantity</th>
          <th style="font-weight:500; font-size:11px;">Unit Price</th>
          <th style="font-weight:500; font-size:11px;">Discount %</th>
          <th style="font-weight:500; font-size:11px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${(serviceOrder.parts || [])
          .map(
            (p) => `
          <tr>
            <td style="font-weight:600; color:#111827; font-size:10px;">${p.name || "Part"}</td>
            <td style="font-weight:500; color:#111827; font-size:10px;">${p.quantity || 0}</td>
            <td style="font-weight:500; color:#111827; font-size:10px;">${formatCurrency(p.price || 0)}</td>
            <td style="font-weight:500; color:#111827; font-size:10px; text-align: center;">${p.discountPercent || 0}%</td>
            <td style="font-weight:500; color:#111827; font-size:10px;">${formatCurrency((p.quantity || 0) * (p.price || 0) * (1 - (p.discountPercent || 0) / 100))}</td>
          </tr>
        `,
          )
          .join("")}
        ${
          !serviceOrder.parts || serviceOrder.parts.length === 0
            ? `
          <tr>
            <td colspan="4" style="text-align:center; padding:16px;">No parts recorded</td>
          </tr>
        `
            : ""
        }
      </tbody>
    </table>

    <!-- EXTERNAL MATERIALS TABLE (NEW) -->
    ${(serviceOrder.externalParts || []).length > 0 ? `
    <table style="margin-top: 30px;">
      <thead>
        <tr">
          <th style="font-weight:500; font-size:11px;"">External Materials & Parts</th>
          <th style="font-weight:500; font-size:11px;">Quantity</th>
          <th style="font-weight:500; font-size:11px;">Unit Price</th>
          <th style="font-weight:500; font-size:11px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${(serviceOrder.externalParts || [])
          .map(
            (p) => `
          <tr>
            <td style="font-weight:600; color:#111827; font-size:10px;">${p.name || "Material"}</td>
            <td style="font-weight:500; color:#111827; font-size:10px; text-align: left;">${p.quantity || 0}</td>
            <td style="font-weight:500; color:#111827; font-size:10px; text-align: left;">${formatCurrency(p.price || 0)}</td>
            <td style="font-weight:500; color:#111827; font-size:10px; text-align: right;">${formatCurrency((p.quantity || 0) * (p.price || 0) * (1 - (p.discountPercent || 0) / 100))}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
    ` : ''}

    <!-- SUMMARY SECTION (service charge, materials, other charges, card fee, total) -->
    <div class="summary">
      <div class="summary-row">
        <span class="summary-label" style="font-weight: 500;">Service Charge</span>
        <span class="summary-label" style="font-weight: 500;">${formatCurrency(serviceChargeAtAmount)}</span>
      </div>

      <div class="summary-row">
        <span class="summary-label" style="font-weight: 500;">Materials Charge</span>
        <span class="summary-label" style="font-weight: 500;">${formatCurrency(materialsSubtotal)}</span>
      </div>

      <!-- External materials charge -->
      ${(serviceOrder.externalParts || []).length > 0 ? `
      <div class="summary-row">
        <span class="summary-label" style="font-weight: 500;">External Materials Charge</span>
        <span class="summary-label" style="font-weight: 500;">${formatCurrency(externalMaterialsSubtotal)}</span>
      </div>
      ` : ''}

        <!-- Other charges displayed line by line (e.g., Dent repair, Tyre replacement, etc) -->
      ${(serviceOrder.otherCharges || [])
        .map(
          (charge) => `
        <div class="summary-row">
          <span class="summary-label">${charge.chargeType || "Other charge"}</span>
          <span class="summary-label">${formatCurrency(charge.amount || 0)}</span>
        </div>
      `,
        )
        .join("")}

        ${
        serviceOrder.paymentType === "card"
          ? `
        <div class="summary-row">
          <span class="summary-label">Card Processing Fee (3%)</span>
          <span class="summary-label">${formatCurrency(serviceOrder.cardProcessingFee)}</span>
        </div>
      `
          : ""
      }
      
      ${serviceOrder.totalDiscount > 0 ? `
        <div class="summary-row">
        <span class="summary-label" style="font-weight: 600; color: #000;">Total Discount</span>
        <span class="summary-label" style="font-weight: 600; color: #000;">- ${formatCurrency(serviceOrder.totalDiscount)}</span>
      </div>
      ` : ''}

      <div style="border-bottom: 2px solid #eee;
      font-weight: 600;
      color: #666; margin-top: 10px; "></div>
      <div class="summary-row">
        <span class="summary-label total" style="font-weight: 600; color: #000;">Total Amount</span>
        <span class="summary-label total" style="font-weight: 600; color: #000;">${formatCurrency(serviceOrder.totalAmount)}</span>
      </div>
    </div>
  </div>
      

      

      

    <!-- Service report / description note (kept as original style) -->
    <div class="note">
      <strong>Service Report</strong><br>
      <b style="font-size:11px; color:#444; font-weight: 500; marigin-top:6px;">${serviceOrder.serviceDescription || "Vehicle condition checked – all systems operational."}</b>
    </div>

    <!-- ========== NEW SECTION: QR CODE + BANK DETAILS (exactly like reference image) ========== -->
    <div class="invoice-bottom">
      <!-- QR + Terms row -->
      <div class="terms-qr-row">
        <!-- QR code on the left side -->
        <div class="qr-left">
          <img src="https://res.cloudinary.com/dhcx6uyxp/image/upload/v1780938341/Untitled_ahxlq5.png" alt="Payment QR Code" style="width:100px; height:100px;">
        </div>
        <!-- Terms & Conditions text on the right -->
        <div class="terms-right">
          <strong>Terms & Conditions</strong>
          <p style="margin-top:10px;">Please include your vehicle number ${serviceOrder.vehicleNumber || "N/A"} in the payment reference.</p> 
          <p>For any queries, contact us at +94 71 427 4163 or chautomob@gmail.com.</p>
          <p>This is a computer-generated invoice and does not require a physical signature.</p>
        </div>
      </div>
    <!-- ========== END OF QR & BANK SECTION ========== -->

  </div> <!-- end .section -->
</div> <!-- end .invoice -->
</body>
</html>
`;
};

/**
 * Download service history record as PDF (high-quality image capture)
 */
export const downloadServiceHistoryAsPDF = async (
  serviceOrder,
  filename = null,
) => {
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
