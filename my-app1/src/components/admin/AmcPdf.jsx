import jsPDF from "jspdf";
/* ===== Convert image URL to Base64 ===== */
const getBase64FromUrl = async (url) => {
   const response = await fetch(url, { mode: "cors" });
  const blob = await response.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result);
  });
};
export const generateAmcPdf = async(data) => {
  const doc = new jsPDF();
  const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};


  /* ===== PAGE SETUP ===== */
  let y = 20;
  doc.setFont("times", "normal");

  /* ===== HEADER ===== */
  // doc.setFontSize(10);
  // doc.text(
  //   "F1, 4th Floor Hyderabad Business Center, Hyderguda,\nBasheerbagh, TS-500029",
  //   105,
  //   y,
  //   { align: "center" }
  // );

  // if (data.profile) {
  //   const imgBase64 = await getBase64FromUrl(
  //     `http://localhost:5000/uploads/${data.profile}`
  //   );


  //   doc.addImage(imgBase64, "JPEG", 160, 10, 30, 30);
  // }
  /* ===== PROFILE IMAGE (TOP RIGHT) ===== */
  if (data.profile) {
    const imgBase64 = await getBase64FromUrl(
      `http://localhost:5000/uploads/${data.profile}`
    );

    doc.addImage(imgBase64, "PNG", 160, 10, 30, 30);
  }
  console.log(data.profile);
  y += 20;
  doc.setFontSize(14);
  doc.setFont("times", "bold");
  doc.text("Annual Maintenance Contract", 105, y, {
    align: "center",
  });

  y += 12;
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(
    new Date(data.created_date || Date.now()).toDateString(),
    170,
    y
  );

  /* ===== TO ADDRESS ===== */
  y += 15;
  doc.text("To,", 15, y);
  y += 6;
  doc.text(data.customer_name, 15, y);
  y += 6;
  doc.text(data.customer_address, 15, y);

  /* ===== SUBJECT ===== */
  y += 12;
  doc.setFont("times", "bold");
  doc.text("Sub: Due of Annual Maintenance Cost", 15, y);

  /* ===== BODY ===== */
  y += 10;
  doc.setFont("times", "normal");
  doc.text(
  `Respected Sir,

This is to bring to your notice that an amount of Rs. ${data.service_cost}/- (${data.amount_words}) is due to ${data.company_name} for the duration from ${formatDate(data.start_date)} to ${formatDate(data.end_date)}.
Hence, we request you to make the payment by ${formatDate(data.due_date)}, failing which the server will be expired.`,
  15,
  y,
  { maxWidth: 180
  }
);


  /* ===== ACCOUNT DETAILS ===== */
  y += 40;
  doc.setFont("times", "bold");
  doc.text("Below are the account details for your reference", 15, y);

  y += 10;
  doc.setFont("times", "normal");
  doc.text(`Name: ${data.company_name}`, 15, y);
  y += 6;
  doc.text(`A/C No.: ${data.account_no}`, 15, y);
  y += 6;
  doc.text(
    `Bank & Branch: ${data.bank} & ${data.branch}`,
    15,
    y
  );
  y += 6;
  doc.text(`IFSC Code: ${data.ifsc}`, 15, y);

  /* ===== FOOTER ===== */
  y += 15;
  doc.text(
    "Looking forward for your swift payment and favourable orders.",
    15,
    y
  );

  y += 15;
  doc.text("Thanks & Regards", 15, y);
  y += 8;
  doc.setFont("times", "bold");
  doc.text(data.company_name, 15, y);

  y+=58
  doc.setFontSize(10);
  doc.text(
    data.customer_address,
    110,
    y,
    { align: "center" }
  );

  /* ===== SAVE ===== */
  doc.save(`amc_${data.customer_id}.pdf`);
};
