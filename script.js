let expiryData;
fetch("account.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    expiryData = data;
    const tableBody = document.querySelector("#expiryTable tbody");
    const buyDateRegex =
      /^(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2}):(\d{2})$/;
    const expiryDateRegex =
      /^(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2}):(\d{2})$/;
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
        row.style.display = "";
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
            duration = `${years} năm ${remainingDays} ngày`;
          }
        } else {
          if (days > 0 && hours === 0) {
            duration = `${days} ngày`;
          } else if (days > 0) {
            duration = `${days} ngày ${hours} giờ`;
          } else if (hours > 0) {
            duration = `${hours} giờ ${minutes} phút`;
          } else if (minutes > 1) {
            duration = `${minutes} phút ${seconds} giây`;
          } else if (minutes === 1) {
            duration = `1 phút`;
          } else {
            duration = `${seconds} giây`;
          }
        }
      }

      if (timeleft === "Đã hết hạn" && data.type === "Renter") {
        row.classList.remove("md:bg-pink-100");
        row.classList.add("md:bg-red-300");
      } else if (timeleft === "Vô Hạn") {
        if (data.type === "Player") {
          row.classList.add("md:bg-green-300");
        } else if (data.type === "Cloner") {
          row.classList.add("md:bg-amber-300");
        } else if (data.type === "Clicker") {
          row.classList.add("md:bg-stone-300");
        } else if (data.type === "Fisher") {
          row.classList.add("md:bg-sky-300");
        }
      } else if (data.type === "Tester") {
        row.classList.add("md:bg-orange-300");
      } else if (data.type === "Renter") {
        row.classList.add("md:bg-fuchsia-300");
      } else {
        row.classList.add(
          "md:bg-red-900",
          "md:text-white",
          "md:border",
          "md:border-4",
          "md:border-black"
        );
      }

      data.id = idCounter++;
      // Tạo nội dung cho hàng
      row.innerHTML = `
            <td class="font-semibold py-2 text-center border-r border-t">${data.id}</td>
            <td class="font-semibold py-2 text-center border-r border-t">${data.player}</td>
            <td class="font-semibold py-2 text-center border-r border-t">${data.dateBuy}</td>
            <td class="font-semibold py-2 text-center border-r border-t">${data.dateExpiry}</td>
            <td class="font-semibold py-2 text-center border-r border-t">${duration}</td>
            <td class="font-semibold py-2 text-center border-t">${timeleft}</td>
          `;

      // Thêm hàng vào bảng
      tableBody.appendChild(row);
    });

    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("input", function () {
      const searchText = searchInput.value.toLowerCase();
      const rows = document.querySelectorAll(`table#expiryTable tbody tr`);

      rows.forEach((row) => {
        const idMatch = row.children[0].textContent
          .toLowerCase()
          .includes(searchText);
        const playerMatch = row.children[1].textContent
          .toLowerCase()
          .includes(searchText);
        const buyDateMatch = row.children[2].textContent
          .toLowerCase()
          .includes(searchText);
        const expiryDateMatch = row.children[3].textContent
          .toLowerCase()
          .includes(searchText);
        const buyLeftMatch = row.children[4].textContent
          .toLowerCase()
          .includes(searchText);
        const expiryLeftMatch = row.children[5].textContent
          .toLowerCase()
          .includes(searchText);

        if (
          idMatch ||
          playerMatch ||
          buyDateMatch ||
          expiryDateMatch ||
          buyLeftMatch ||
          expiryLeftMatch
        ) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
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
        if (days > 0 && hours === 0) {
          timeleft += `${days} ngày `;
        } else if (days > 0) {
          timeleft += `${days} ngày ${hours} giờ`;
        } else if (hours > 0) {
          timeleft += `${hours} giờ ${minutes} phút`;
        } else if (minutes > 0) {
          timeleft += `${minutes} phút ${seconds} giây`;
        } else {
          timeleft += `${seconds} giây`;
        }
      }

      return timeleft;
    }

    // Lấy biểu tượng và bảng chỉ dẫn màu
    const helpIcon = document.getElementById("helpIcon");
    const colorLegend = document.getElementById("colorLegend");

    // Khi di chuột qua biểu tượng, hiển thị bảng chỉ dẫn màu
    helpIcon.addEventListener("mouseover", function () {
      colorLegend.classList.remove("hidden");
    });

    // Khi di chuột ra khỏi biểu tượng, ẩn bảng chỉ dẫn màu
    helpIcon.addEventListener("mouseout", function () {
      colorLegend.classList.add("hidden");
    });

    // const toggleDarkModeButton = document.getElementById("toggleDarkMode");
    // const body = document.body;

    // toggleDarkModeButton.addEventListener("click", function () {
    //   body.classList.toggle("dark-mode");
    //   console.log("dark");
    // });
  });
