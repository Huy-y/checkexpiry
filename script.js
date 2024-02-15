// JavaScript code
const expiryData = [
  {
    account: "Komaz",
    dateBuy: "01/01/2024",
    dateExpiry: "01/01/2025 - 12:30:45",
  },
  {
    account: "huytranz",
    dateBuy: "01/01/2024",
    dateExpiry: "15/02/9999 - 18:30:00",
  },
  // Thêm dữ liệu cho các tài khoản khác tùy theo nhu cầu của bạn
];

const tableBody = document.querySelector("#expiryTable tbody");

expiryData.forEach((data) => {
  const row = document.createElement("tr");
  row.innerHTML = `
        <td class="font-semibold text-center border-r">${data.account}</td>
        <td class="font-semibold text-center border-r">${data.dateBuy}</td>
        <td class="font-semibold text-center">${data.dateExpiry}</td>
    `;
  tableBody.appendChild(row);
});
