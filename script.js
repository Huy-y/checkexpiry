const expiryData = [
  // Acc Player
  {
    account: "Komaz",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  {
    account: "huytranz",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  {
    account: "DuyGiuy",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  {
    account: "HySatou",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  {
    account: "HutCo",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  {
    account: "hakdenis",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  // Acc AutoClick
  {
    account: "OmaReturn",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  {
    account: "JustPotato",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  {
    account: "LightTeki",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  {
    account: "khang6a4",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  {
    account: "Trieocayy",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  {
    account: "Cuei0h",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  // Câu cá
  {
    account: "AkazaSlayer",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  {
    account: "Auror",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  {
    account: "Sylvie",
    dateBuy: "01/01/2024 - 00:00:00",
    dateExpiry: "01/01/9999 - 00:00:00",
  },
  // Acc test
  {
    account: "vahia8315",
    dateBuy: "15/02/2024 - 00:00:00",
    dateExpiry: "15/02/2024 - 22:50:00",
  },
];

const tableBody = document.querySelector("#expiryTable tbody");
const buyDateRegex = /^(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2}):(\d{2})$/;
const expiryDateRegex = /^(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2}):(\d{2})$/;
let idCounter = 1; // Biến đếm ID

expiryData.forEach((data) => {
  const row = document.createElement("tr");

  // Lấy các thành phần của ngày mua và ngày hết hạn từ chuỗi sử dụng regex
  const buyDateMatch = data.dateBuy.match(buyDateRegex);
  const expiryDateMatch = data.dateExpiry.match(expiryDateRegex);

  // Trích xuất các thành phần của ngày mua và ngày hết hạn từ kết quả match
  const DayBuy = buyDateMatch[1];
  const MonthBuy = buyDateMatch[2];
  const YearBuy = buyDateMatch[3];
  const HourBuy = buyDateMatch[4];
  const MinuteBuy = buyDateMatch[5];
  const SecondBuy = buyDateMatch[6];

  const DayExpiry = expiryDateMatch[1];
  const MonthExpiry = expiryDateMatch[2];
  const YearExpiry = expiryDateMatch[3];
  const HourExpiry = expiryDateMatch[4];
  const MinuteExpiry = expiryDateMatch[5];
  const SecondExpiry = expiryDateMatch[6];

  let duration;
  let timeleft;

  if (YearExpiry.includes("9999")) {
    duration = "Vô Hạn";
    timeleft = "Vô Hạn";
    row.classList.add("md:bg-blue-100");
    row.style.display = "none";
  } else {
    const buyDateTime = new Date(
      YearBuy,
      MonthBuy - 1,
      DayBuy,
      HourBuy,
      MinuteBuy,
      SecondBuy
    );
    const expiryDateTime = new Date(
      YearExpiry,
      MonthExpiry - 1,
      DayExpiry,
      HourExpiry,
      MinuteExpiry,
      SecondExpiry
    );
    timeleft = calculateTimeLeft(expiryDateTime);
    const diffInMs = expiryDateTime - buyDateTime;
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

    if (days > 365) {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      if (remainingDays === 0) {
        duration = `${years} năm`;
      } else {
        duration = `${years} năm và ${remainingDays} ngày`;
      }
    } else {
      if (days > 0) {
        duration = `${days} ngày và ${hours} giờ`;
      } else if (hours > 0) {
        duration = `${hours} giờ và ${minutes} phút`;
      } else if (minutes > 1) {
        duration = `${minutes} phút và ${seconds} giây`;
      } else if (minutes === 1) {
        duration = `1 phút`;
      } else {
        duration = `${seconds} giây`;
      }
    }
  }

  if (timeleft == "Đã hết hạn") {
    row.classList.add("md:bg-red-300");
  } else {
    row.classList.add("md:bg-green-100");
  }

  data.id = idCounter++;
  // Tạo nội dung cho hàng
  row.innerHTML = `
        <td class="font-semibold py-2 text-center border-r border-t">${data.id}</td>
        <td class="font-semibold py-2 text-center border-r border-t">${data.account}</td>
        <td class="font-semibold py-2 text-center border-r border-t">${data.dateBuy}</td>
        <td class="font-semibold py-2 text-center border-r border-t">${data.dateExpiry}</td>
        <td class="font-semibold py-2 text-center border-r border-t">${duration}</td>
        <td class="font-semibold py-2 text-center border-t">${timeleft}</td>
      `;

  // Thêm hàng vào bảng
  tableBody.appendChild(row);
});

// Tính toán thời gian còn lại từ thời điểm hiện tại đến thời điểm hết hạn
function calculateTimeLeft(expiryDateTime) {
  const now = new Date(); // Thời gian hiện tại

  // Tính toán sự khác biệt giữa thời gian hiện tại và thời gian hết hạn
  let diffInMs = expiryDateTime - now.getTime();
  let timeleft = "";

  // Nếu thời gian còn lại nhỏ hơn hoặc bằng 0, nghĩa là đã hết hạn
  if (diffInMs <= 0) {
    timeleft = "Đã hết hạn";
  } else {
    // Chuyển đổi thời gian còn lại thành giờ, phút và giây
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    diffInMs %= 1000 * 60 * 60 * 24;
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    diffInMs %= 1000 * 60 * 60;
    const minutes = Math.floor(diffInMs / (1000 * 60));
    diffInMs %= 1000 * 60;
    const seconds = Math.floor(diffInMs / 1000);
    // Kiểm tra nếu năm hết hạn là 9999 thì trả về "Vô Hạn"
    if (days > 0) {
      timeleft += `${days} ngày `;
    } else if (hours > 0) {
      timeleft += `${hours} giờ `;
    } else if (minutes > 0) {
      timeleft += `${minutes} phút `;
    } else {
      timeleft += `${seconds} giây`;
    }
  }

  return timeleft;
}

// const toggleDarkModeButton = document.getElementById("toggleDarkMode");
// const body = document.body;

// toggleDarkModeButton.addEventListener("click", function () {
//   body.classList.toggle("dark-mode");
//   console.log("dark");
// });
