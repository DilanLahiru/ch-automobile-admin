import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import InvoiceLogo from "../assets/InvoiceLogo.png";

// Dynamically load QRCode if it exists
let QRCode = "";
const qrModules = import.meta.glob("../assets/QRCode.png", { eager: true, import: "default" });
if (Object.keys(qrModules).length) {
  QRCode = Object.values(qrModules)[0];
}

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

// Calculate 3% fee
const calculateCardProcessingFee = (serviceOrder) => {
  if (!serviceOrder) return 0;
  const subtotal = serviceOrder.totalAmount || 0;
  return subtotal * 0.03;
};

/**
 * Generate professional HTML template for service history record with logo and blue theme
 */
// const generateServiceHistoryHTML = (serviceOrder) => {
//   const partsHTML = serviceOrder.parts?.length
//     ? serviceOrder.parts
//         .map(
//           (part) => `
//         <tr>
//           <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-transform: lowercase;">${
//             part.name || "N/A"
//           }</td>
//           <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${
//             part.quantity || 0
//           }</td>
//           <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatCurrency(
//             part.price || 0,
//           )}</td>
//         </tr>`,
//         )
//         .join("")
//     : `
//         <tr>
//           <td colspan="3" style="padding: 8px; text-align: center; color: #718096;">No parts used</td>
//          </tr>`;

//   const statusText = serviceOrder.status
//     ? serviceOrder.status.charAt(0).toUpperCase() + serviceOrder.status.slice(1)
//     : "Completed";

//   return `
// <!DOCTYPE html>
// <html>
//    <head>
//       <meta charset="UTF-8">
//       <style>
//          *{
//          margin:0;
//          padding:0;
//          box-sizing:border-box;
//          }
//          body{
//          /* Industry‑appropriate font stack: Inter (modern), Roboto, Segoe UI, fallback */
//          font-family: 'Inter', 'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
//          background:#efefef;
//          font-weight: 400;
//          line-height: 1.5;
//          }
//          .invoice{
//          width:210mm;
//          margin:auto;
//          background:white;
//          color:#222;
//          }
//          .section{
//          padding:24px 36px;
//          }
//          hr{
//          border:none;
//          border-top:1px solid #ddd;
//          }
//          .header{
//          display:flex;
//          justify-content:space-between;
//          align-items:flex-start;
//          }
//          .logo{
//          width:300px;
//          margin-left:-50px;
//          }
//          .company{
//          text-align:right;
//          line-height:1.8;
//          font-size:12px;
//          }
//          .company-info{
//          font-size:12px;
//          margin-bottom:8px;
//          font-weight:500;
//          }
//          .top-info{
//          display:flex;
//          justify-content:space-between;
//          margin-top:10px;
//          }
//          .block{
//          width:48%;
//          }
//          .label{
//          font-weight:600;
//          margin-bottom:5px;
//          font-size:13px;
//          }
//          .small{
//          color:#666;
//          line-height:1.7;
//          font-size:10px;
//          font-weight:500;
//          }
//          .invoice-meta{
//          text-align:right;
//          }
//          .invoice-meta div{
//          margin-bottom:1px;
//          }
//         .status{
//           text-align:right;
//           display:flex;
//           justify-content:space-between;
//           align-items:center;
//           gap:30px;
//         }
//           .status b{
//             font-weight:600;
//             text-align:right;
//           }
//          table{
//          width:100%;
//          border-collapse:collapse;
//          margin-top:20px;
//          }
//          th{
//          text-align:left;
//          padding:14px;
//          border-bottom:2px solid #ddd;
//          font-size:13px;
//          font-weight:600;
//          }
//          td{
//          padding:18px 14px;
//          border-bottom:1px solid #eee;
//          font-size:11px;
//          font-weight:500;
//          color:#666;
//          }
//          td:last-child,
//          th:last-child{
//          text-align:right;
//          }
//          .summary{
//          width:320px;
//          margin-left:auto;
//          margin-top:30px;
//          }
//          .summary-label{
//          font-size:12px;
//          font-weight:500;
//          color:#666;
//         }
//          .summary-row{
//          display:flex;
//          justify-content:space-between;
//          padding:5px 0;
//          }
//          .total{
//          font-size:13px;
//          font-weight:700;
//          }
//          .note{
//          margin-top:40px;
//          line-height:1.8;
//          font-size:12px;
//          }
//          .footer{
//          margin-top:50px;
//          padding-top:20px;
//          border-top:1px solid #ddd;
//          display:flex;
//          justify-content:space-between;
//          align-items:center;
//          }
//          .bank{
//          font-size:12px;
//          color:#555;
//          }
//          .qr{
//          width:90px;
//          }
//       </style>
//    </head>
//    <body>
//       <div class="invoice">
//          <div class="section">
//             <div class="header">
//                <div>
//                   <img src="${InvoiceLogo}" class="logo"/>
//                </div>
//                <div class="company">
//                   <div class="company-info">
//                      304A Abhaya Street<br>
//                      Nagoda, Kalutara<br>
//                      +94 71 427 4163<br>
//                      chautomob@gmail.com
//                   </div>
//                </div>
//             </div>
//          </div>
//          <hr>
//          <div class="section">
//             <div class="top-info">
//                <div class="block">
//                   <div class="label">
//                      Bill To:
//                   </div>
//                   <div class="small">
//                      ${serviceOrder.customerId?.name}<br>
//                      ${serviceOrder.customerId?.contactNumber}<br>
//                      ${serviceOrder.customerId?.email}<br>
//                      ${serviceOrder.vehicleNumber}
//                   </div>
//                </div>
//                <div class="invoice-meta">
//                   <div class="status">
//                      <b style="font-size:10px;">Invoice Date</b>
//                      <div style="font-size:10px; margin-top:5px; font-weight:500; color:#666;">${formatDate(serviceOrder.createdAt)}</div>
//                   </div>
//                   <div class="status">
//                      <b style="font-size:10px;">Status</b>
//                      <div style="font-size:10px; margin-top:5px; font-weight:500; color:#666;">${statusText}</div>
//                   </div>
//                   <div class="status">
//                      <b style="font-size:10px;">Service Type</b>
//                      <div style="font-size:10px; margin-top:5px; font-weight:500; color:#666;">${serviceOrder.serviceType || "General Service"}</div>
//                   </div>
//                     <div class="status">
//                      <b style="font-size:10px;">Payment Method</b>
//                      <div style="font-size:10px; margin-top:5px; font-weight:500; color:#666;">${serviceOrder.paymentType ? serviceOrder.paymentType === "bank-transfer" ? "Bank Transfer" : serviceOrder.paymentType.charAt(0).toUpperCase() + serviceOrder.paymentType.slice(1) : "N/A"}</div>
//                   </div>
//                </div>
//             </div>
//              <!-- Other Charges Table (if applicable) -->
//              ${serviceOrder.otherCharges && serviceOrder.otherCharges.length > 0 ? `
//              <div class="section-title">OTHER CHARGES</div>
//              <table>
//                 <thead>
//                    <tr>
//                       <th style="width: 70%;">Charge Type</th>
//                       <th style="width: 30%;" class="text-right">Amount</th>
//                    </tr>
//                 </thead>
//                 <tbody>
//                    ${serviceOrder.otherCharges.map((charge) => `
//                    <tr>
//                        <td>${charge.chargeType || "Other Charge"}</td>
//                        <td class="text-right">${formatCurrency(charge.amount || 0)}</td>
//                    </tr>
//                    `).join("")}
//                 </tbody>
//              </table>
//              ` : ""}
//             <table>
//                <thead>
//                   <tr>
//                      <th>Description</th>
//                      <th>Qty</th>
//                      <th>Price</th>
//                      <th>Amount</th>
//                   </tr>
//                </thead>
//                <tbody>
//                   ${serviceOrder.parts?.map(p=>`
//                   <tr>
//                       <td>
//                         ${p.name}
//                       </td>
//                       <td>
//                         ${p.quantity}
//                       </td>
//                       <td>
//                         ${formatCurrency(p.price)}
//                       </td>
//                       <td>
//                         ${formatCurrency(
//                         (p.quantity||0)*(p.price||0)
//                         )}
//                       </td>
//                    </tr>
//                   `).join("")}
//                </tbody>
//             </table>
//             <div class="summary">
//                <div class="summary-row">
//                   <span class="summary-label">Service Charge</span>
//                   <span class="summary-label">${formatCurrency(serviceOrder.laborCost||0)}</span>
//                </div>
//                <div class="summary-row">
//                   <span class="summary-label">Materials Charge</span>
//                   <span class="summary-label">${formatCurrency(
//                   (serviceOrder.parts||[])
//                   .reduce(
//                   (a,p)=>
//                   a+(p.price*p.quantity),
//                   0
//                   )
//                   )}</span>
//                </div>
//                ${serviceOrder.paymentType === "card" ? `
//                <div class="summary-row">
//                   <span class="summary-label">Card Processing Fee (3%)</span>
//                   <span class="summary-label">${formatCurrency(calculateCardProcessingFee(serviceOrder))}</span>
//                </div>
//                ` : ""}
//                ${serviceOrder.otherChargeAmount && serviceOrder.otherChargeAmount > 0 ? `
//                <div class="summary-row">
//                   <span class="summary-label">Other Charges</span>
//                   <span class="summary-label">${formatCurrency(serviceOrder.otherChargeAmount || 0)}</span>
//                </div>
//                ` : ""}
//                <div class="summary-row total">
//                   <span>Total Amount</span>
//                   <span>
//                   ${formatCurrency(
//                   serviceOrder.totalAmount
//                   )}
//                   </span>
//                </div>
//             </div>
//             <div class="note">
//                <b style="font-size:12px; font-weight: 600;">Service Report</b>
//                <br>
//                <b style="font-size:11px; color:#666; font-weight: 500;">${serviceOrder.serviceDescription || "Vehicle condition good"}</b>
//             </div>
//             <div class="footer">
//                <div class="bank">
//                   CH Automobile Service Center
//                   <br>
//                   Bank Transfer Available
//                </div>
//             </div>
//          </div>
//       </div>
//    </body>
// </html>
// `;
// };
const generateServiceHistoryHTML = (serviceOrder) => {
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
    0
  );

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
      width: 300px;
      margin-left: -50px;
    }

    .company {
      text-align: right;
      line-height: 1.8;
      font-size: 12px;
    }

    .company-info {
      font-size: 12px;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .top-info {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }

    .block {
      width: 48%;
    }

    .label {
      font-weight: 600;
      margin-bottom: 5px;
      font-size: 13px;
    }

    .small {
      color: #666;
      line-height: 1.7;
      font-size: 10px;
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
      padding: 14px;
      border-bottom: 2px solid #ddd;
      font-size: 13px;
      font-weight: 600;
    }

    td {
      padding: 18px 14px;
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
      font-size: 11px;
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
    }

    /* New bottom section: terms, bank, QR */
    .invoice-bottom {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
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
      margin-top: 40px;
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
          304A Abhaya Street<br>
          Nagoda, Kalutara<br>
          +94 71 427 4163<br>
          chautomob@gmail.com
        </div>
      </div>
    </div>
  </div>
  <hr>
  <div class="section">
    <div class="top-info">
      <div class="block">
        <div class="label">Bill To:</div>
        <div class="small">
          ${serviceOrder.customerId?.name || 'N/A'}<br>
          ${serviceOrder.customerId?.contactNumber || ''}<br>
          ${serviceOrder.customerId?.email || ''}<br>
          ${serviceOrder.vehicleNumber || ''}
        </div>
      </div>
      <div class="invoice-meta">
        <div class="status">
          <b style="font-size:10px;">Invoice Date</b>
          <div style="font-size:10px; margin-top:5px; font-weight:500; color:#666;">${formatDate(serviceOrder.createdAt)}</div>
        </div>
        <div class="status">
          <b style="font-size:10px;">Status</b>
          <div style="font-size:10px; margin-top:5px; font-weight:500; color:#666;">${(serviceOrder.status ? serviceOrder.status.charAt(0).toUpperCase() + serviceOrder.status.slice(1) : "Completed")}</div>
        </div>
        <div class="status">
          <b style="font-size:10px;">Service Type</b>
          <div style="font-size:10px; margin-top:5px; font-weight:500; color:#666;">${serviceOrder.serviceType || "General Service"}</div>
        </div>
        <div class="status">
          <b style="font-size:10px;">Payment Method</b>
          <div style="font-size:10px; margin-top:5px; font-weight:500; color:#666;">${serviceOrder.paymentType ? (serviceOrder.paymentType === "bank-transfer" ? "Bank Transfer" : serviceOrder.paymentType.charAt(0).toUpperCase() + serviceOrder.paymentType.slice(1)) : "N/A"}</div>
        </div>
      </div>
    </div>

    <!-- PARTS TABLE (unchanged) -->
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${(serviceOrder.parts || []).map(p => `
          <tr>
            <td>${p.name || 'Part'}</td>
            <td>${p.quantity || 0}</td>
            <td>${formatCurrency(p.price || 0)}</td>
            <td>${formatCurrency((p.quantity || 0) * (p.price || 0))}</td>
          </tr>
        `).join("")}
        ${(!serviceOrder.parts || serviceOrder.parts.length === 0) ? `
          <tr>
            <td colspan="4" style="text-align:center; padding:16px;">No parts recorded</td>
          </tr>
        ` : ""}
      </tbody>
    </table>

    <!-- SUMMARY SECTION (service charge, materials, other charges, card fee, total) -->
    <div class="summary">
      <div class="summary-row">
        <span class="summary-label">Service Charge (Labor)</span>
        <span class="summary-label">${formatCurrency(serviceOrder.laborCost || 0)}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Materials (Parts)</span>
        <span class="summary-label">${formatCurrency((serviceOrder.parts || []).reduce((a, p) => a + (p.price * p.quantity), 0))}</span>
      </div>

      <!-- Other charges displayed line by line (e.g., Dent repair, Tyre replacement, etc) -->
      ${(serviceOrder.otherCharges || []).map(charge => `
        <div class="summary-row">
          <span class="summary-label">${charge.chargeType || "Other charge"}</span>
          <span class="summary-label">${formatCurrency(charge.amount || 0)}</span>
        </div>
      `).join("")}

      ${serviceOrder.paymentType === "card" ? `
        <div class="summary-row">
          <span class="summary-label">Card Processing Fee (3%)</span>
          <span class="summary-label">${formatCurrency(calculateCardProcessingFee(serviceOrder))}</span>
        </div>
      ` : ""}

      <div class="summary-row total">
        <span>Total Amount</span>
        <span>${formatCurrency(serviceOrder.totalAmount)}</span>
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
          <img src="${QRCode}" alt="Payment QR Code" style="width:100px; height:100px;">
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
