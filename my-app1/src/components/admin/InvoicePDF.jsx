import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function InvoicePDF({ customer }) {

  const todayDate = () => new Date().toISOString().slice(0, 10);

  const generateInvoiceNo = () => {
    const d = new Date();
    return `INV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
      d.getDate()
    ).padStart(2, "0")}-${Math.floor(100 + Math.random() * 900)}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "px", "a4");

    const invoiceNo = generateInvoiceNo();
    const date = todayDate();

    const unitPrice = Number(customer.advance_payment || 0);
    const amount = Number(customer.service_cost || 0);
    const totalAmount = unitPrice + amount;

    /* ================= HEADER ================= */
    doc.setFontSize(22);
    doc.setTextColor(13, 148, 136);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", 40, 40);

    /* ================= COMPANY INFO ================= */
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    doc.text(`Company Name: ${customer.company_name || ""}`, 40, 80);
    doc.text(`Address/City/ZIP Code: ${customer.address || ""}`, 40, 100);
    doc.text(`Contact: ${customer.phonenumber || ""}`, 40, 120);

    /* ================= INVOICE INFO ================= */
    doc.text(`Date: ${date}`, 350, 80);
    doc.text(`Invoice No: ${invoiceNo}`, 350, 100);

    doc.setFont("helvetica", "bold");
    doc.text(`Invoice Total: ₹ ${totalAmount}`, 350, 120);

    /* ================= RECEIVED TO ================= */
    doc.setFont("helvetica", "bold");
    doc.setTextColor(13, 148, 136);
    doc.text("Amount Received To:", 40, 160);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${customer.name || ""}`, 40, 180);
    doc.text(`Address: ${customer.address || ""}`, 40, 200);
    doc.text(`Contact: ${customer.phonenumber || ""}`, 40, 220);

    /* ================= TABLE ================= */
    doc.autoTable({
      startY: 260,
      head: [["Unit Price", "Amount"]],
      body: [[`₹ ${unitPrice}`, `₹ ${amount}`]],
      styles: { fontSize: 11 },
      headStyles: {
        fillColor: [13, 148, 136],
        textColor: 255,
        halign: "center",
      },
      bodyStyles: {
        halign: "center",
      },
      foot: [["Total Amount", `₹ ${totalAmount}`]],
      footStyles: {
        fillColor: [204, 251, 241], // light teal box
        textColor: 0,
        fontStyle: "bold",
        halign: "center",
      },
    });

    /* ================= FOOTER ================= */
    const y = doc.lastAutoTable.finalY + 50;

    doc.setFontSize(10);
    doc.text("Authorized Person", 40, y);
    doc.text("Title", 140, y);
    doc.text("Date", 240, y);
    doc.text("Contact", 340, y);
    doc.text("Authorized Signature", 440, y);

    doc.save(`Invoice_${invoiceNo}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-teal-700 text-white px-4 py-2 rounded"
    >
      Generate Invoice PDF
    </button>
  );
}
