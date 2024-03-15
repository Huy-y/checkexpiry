let expiryData;
fetch("../account.json")
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
    let idCounter = 1; // Count ID

    expiryData.forEach((data) => {
      const row = document.createElement("tr");

      // Take the components of Days Buy and Days expires from the Chain of using ReGEX
      const buyDateMatch = data.dateBuy.match(buyDateRegex);
      const expiryDateMatch = data.dateExpiry.match(expiryDateRegex);

      // Extracting the components of Days Buy and Days expired from the Match results
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
          duration = `${years} năm${
            remainingDays === 0 ? "" : ` ${remainingDays} ngày`
          }`;
        } else if (days > 0) {
          duration = `${days} ngày${hours > 0 ? ` ${hours} giờ` : ""}${
            minutes > 0 ? ` ${minutes} phút` : ""
          }${seconds > 0 ? ` ${seconds} giây` : ""}`;
        } else if (hours > 0) {
          duration = `${hours} giờ${minutes > 0 ? ` ${minutes} phút` : ""}${
            seconds > 0 ? ` ${seconds} giây` : ""
          }`;
        } else if (minutes > 0) {
          duration = `${minutes} phút${seconds > 0 ? ` ${seconds} giây` : ""}`;
        } else {
          duration = `${seconds} giây`;
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
      // Create content for horizontal rows
      row.innerHTML = `
            <td class="font-semibold py-2 text-center border-r border-t">${data.id}</td>
            <td class="font-semibold py-2 text-center border-r border-t">${data.player}</td>
            <td class="font-semibold py-2 text-center border-r border-t">${data.dateBuy}</td>
            <td class="font-semibold py-2 text-center border-r border-t">${data.dateExpiry}</td>
            <td class="font-semibold py-2 text-center border-r border-t">${duration}</td>
            <td class="font-semibold py-2 text-center border-t">${timeleft}</td>
          `;

      // Add horizontal rows to the board
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

    // Calculate the remaining time from the present to the time of expiration
    function calculateTimeLeft(expiryDateTime) {
      const now = new Date(); // Date now

      // Tính toán sự khác biệt giữa thời gian hiện tại và thời gian hết hạn
      let diffInMs = expiryDateTime - now.getTime();
      let timeleft = "";

      // If the remaining time is smaller or zero, ie Expired
      if (diffInMs <= 0) {
        timeleft = "Đã hết hạn";
      } else {
        // Convert the remaining time into Hours, Minutes and Seconds
        const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        diffInMs %= 1000 * 60 * 60 * 24;
        const hours = Math.floor(diffInMs / (1000 * 60 * 60));
        diffInMs %= 1000 * 60 * 60;
        const minutes = Math.floor(diffInMs / (1000 * 60));
        diffInMs %= 1000 * 60;
        const seconds = Math.floor(diffInMs / 1000);
        // Check if the expiration year is 9999, then return "infinite"
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

    // Get symbols and color guidelines
    const helpIcon = document.getElementById("helpIcon");
    const ColorTable = document.getElementById("ColorTable");
    let isColorTableVisible = false;

    // Hiển thị hoặc ẩn bảng màu
    function toggleColorTable() {
      if (!isColorTableVisible) {
        ColorTable.classList.remove("hidden");
      }
      isColorTableVisible = !isColorTableVisible;
    }

    // Attach the event to click on the icon
    helpIcon.addEventListener("click", toggleColorTable);

    // When the mouse crosses the icon, display a part of the color guideline
    helpIcon.addEventListener("mouseover", function () {
      ColorTable.classList.remove("hidden");
    });

    // When the mouse is out of the icon, hide the color guide if it's not fully visible
    helpIcon.addEventListener("mouseout", function (event) {
      if (!event.relatedTarget || !event.relatedTarget.closest("#ColorTable")) {
        ColorTable.classList.add("hidden");
        isColorTableVisible = false;
      }
    });
    // Save the state of rolls when the user rolls the page
    window.addEventListener("scroll", function () {
      const scrollPosition =
        window.scrollY || document.documentElement.scrollTop;
      localStorage.setItem("scrollPosition", scrollPosition);
    });

    // Restore roll state after renewing the page
    window.addEventListener("DOMContentLoaded", function () {
      const scrollPosition = localStorage.getItem("scrollPosition");
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
      }
    });

    // Get element Date and Time
    const currentDateElement = document.getElementById("currentDate");
    const currentTimeElement = document.getElementById("currentTime");

    // Update Current Date
    function updateCurrentDate() {
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      currentDateElement.textContent = formattedDate;
    }

    // Update Current Time
    function updateCurrentTime() {
      const currentTime = new Date();
      const hours = currentTime.getHours().toString().padStart(2, "0");
      const minutes = currentTime.getMinutes().toString().padStart(2, "0");
      const seconds = currentTime.getSeconds().toString().padStart(2, "0");
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      currentTimeElement.textContent = formattedTime;
    }

    // Update the current date and time every second
    setInterval(function () {
      updateCurrentDate();
      updateCurrentTime();
    }, 1000);

    // Call the update function immediately to display as soon as the page is downloaded
    updateCurrentDate();
    updateCurrentTime();
  });
