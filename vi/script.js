document.addEventListener("DOMContentLoaded", function () {
  fetch("../account.json")
    .then((response) => response.json())
    .then((data) => {
      const cardContainer = document.getElementById("cardContainer");
      const originalcard = [];
      let duration;
      let timeleft;
      const buyDateRegex =
        /^(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2}):(\d{2})$/;
      const expiryDateRegex =
        /^(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2}):(\d{2})$/;
      let idCounter = 1;

      data.forEach((item) => {
        // Take the components of Days Buy and Days expires from the Chain of using ReGEX
        const buyDateMatch = item.dateBuy.match(buyDateRegex);
        const expiryDateMatch = item.dateExpiry.match(expiryDateRegex);

        // Extracting the components of Days Buy and Days Expired from the Match results
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

        if (YearExpiry.includes("9999")) {
          duration = "Không giới hạn";
          timeleft = "Không giới hạn";
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
          const minutes = Math.floor(
            (diffInMs % (1000 * 60 * 60)) / (1000 * 60)
          );
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
            duration = `${minutes} phút${
              seconds > 0 ? ` ${seconds} giây` : ""
            }`;
          } else {
            duration = `${seconds} giây`;
          }
        }

        // Create div card
        const card = document.createElement("div");
        card.classList.add(
          "w-full",
          "my-2",
          "shadow-md",
          "rounded-xl",
          "overflow-hidden",
          "lg:mx-auto"
        );

        const card2 = document.createElement("div");
        card2.classList.add("py-2", "border", "flex", "justify-between");

        if (timeleft === "Hết Hạn" && item.type === "Renter") {
          card2.classList.add("bg-red-200");
          card2.classList.add("lg:bg-red-300");
        } else if (timeleft === "Không giới hạn") {
          if (item.type === "Player") {
            card2.classList.add("bg-green-200");
            card2.classList.add("lg:bg-green-300");
          } else if (item.type === "Cloner") {
            card2.classList.add("bg-amber-200");
            card2.classList.add("lg:bg-amber-300");
          } else if (item.type === "Clicker") {
            card2.classList.add("bg-stone-200");
            card2.classList.add("lg:bg-stone-300");
          } else if (item.type === "Fisher") {
            card2.classList.add("bg-sky-200");
            card2.classList.add("lg:bg-sky-300");
          }
        } else if (item.type === "Tester") {
          card2.classList.add("bg-orange-200");
          card2.classList.add("lg:bg-orange-300");
        } else if (item.type === "Renter") {
          card2.classList.add("bg-fuchsia-200");
          card2.classList.add("lg:bg-fuchsia-300");
        } else {
          card2.classList.add("lg:bg-red-900");
          card2.classList.add(
            "bg-red-700",
            "text-white",
            "border",
            "border-4",
            "border-black"
          );
        }

        const card3 = document.createElement("div");
        card3.classList.add(
          "w-full",
          "flex",
          "flex-col",
          "justify-center",
          "font-semibold",
          "text-lg",
          "lg:flex-row"
        );

        // Create ID
        const accountid = document.createElement("div");
        accountid.classList.add(
          "account-id",
          "border-black",
          "mx-auto",
          "w-full",
          "lg:text-lg",
          "lg:w-1/6",
          "lg:border-r"
        );
        accountid.textContent = idCounter++;

        // Create account
        const account = document.createElement("div");
        account.classList.add(
          "account",
          "border-black",
          "px-4",
          "rounded-xl",
          "w-auto",
          "mx-auto",
          "border-2",
          "lg:text-lg",
          "lg:px-0",
          "lg:rounded-none",
          "lg:w-2/3",
          "lg:border-r",
          "lg:border-b-0",
          "lg:border-y-0",
          "lg:border-l-0"
        );
        account.textContent = item.player;

        // Create Date Buy
        const dateBuyPack = document.createElement("div");
        const dateBuyLabel = document.createElement("div");
        const dateBuy = document.createElement("div");
        dateBuyLabel.classList.add("lg:hidden");
        dateBuy.classList.add("date-buy");
        dateBuyPack.classList.add(
          "flex",
          "flex-row-reverse",
          "gap-2",
          "border-black",
          "text-base",
          "w-auto",
          "mx-auto",
          "mt-4",
          "pb-2",
          "border-b-2",
          "lg:text-lg",
          "lg:flex-col",
          "lg:mt-0",
          "lg:w-2/3",
          "lg:border-r",
          "lg:border-b-0"
        );
        dateBuyLabel.textContent = "Ngày thuê: ";
        dateBuy.textContent = item.dateBuy;

        // Create Date Expiry
        const dateExpiryPack = document.createElement("div");
        const dateExpiryLabel = document.createElement("div");
        const dateExpiry = document.createElement("div");
        dateExpiryLabel.classList.add("lg:hidden");
        dateExpiry.classList.add("date-expiry");
        dateExpiryPack.classList.add(
          "flex",
          "flex-row-reverse",
          "gap-2",
          "border-black",
          "text-base",
          "w-auto",
          "mx-auto",
          "mt-4",
          "pb-4",
          "lg:text-lg",
          "lg:flex-col",
          "lg:mt-0",
          "lg:pb-0",
          "lg:w-2/3",
          "lg:border-r",
          "lg:border-b-0"
        );
        dateExpiryLabel.textContent = "Ngày hết hạn: ";
        dateExpiry.textContent = item.dateExpiry;

        // Create Rental period
        const durationtimePack = document.createElement("div");
        const durationtimeLabel = document.createElement("div");
        const durationtime = document.createElement("div");
        durationtimeLabel.classList.add("lg:hidden");
        durationtime.classList.add("date-rent");
        durationtimePack.classList.add(
          "flex",
          "flex-row-reverse",
          "gap-2",
          "border-black",
          "text-base",
          "border-2",
          "px-2",
          "rounded-xl",
          "mx-auto",
          "w-auto",
          "lg:text-lg",
          "lg:border-l-0",
          "lg:rounded-none",
          "lg:flex-col",
          "lg:w-2/3",
          "lg:border-r",
          "lg:border-y-0"
        );
        durationtimeLabel.textContent = "Thời gian thuê: ";
        durationtime.textContent = duration;

        // Create Expired time
        const expirytimePack = document.createElement("div");
        const expirytimeLabel = document.createElement("div");
        const expirytime = document.createElement("div");
        expirytimeLabel.classList.add("lg:hidden");
        expirytime.classList.add("expiry-time");
        expirytimePack.classList.add(
          "flex",
          "flex-row-reverse",
          "gap-2",
          "text-base",
          "border-black",
          "border-2",
          "px-2",
          "rounded-xl",
          "mx-auto",
          "mt-2",
          "w-auto",
          "lg:text-lg",
          "lg:rounded-none",
          "lg:flex-col",
          "lg:w-2/3",
          "lg:border-0"
        );
        expirytimeLabel.textContent = "Thời gian hết hạn: ";
        expirytime.textContent = timeleft;

        // Add element to card
        card3.appendChild(accountid);
        card3.appendChild(account);

        dateBuyPack.appendChild(dateBuy);
        dateBuyPack.appendChild(dateBuyLabel);
        card3.appendChild(dateBuyPack);

        dateExpiryPack.appendChild(dateExpiry);
        dateExpiryPack.appendChild(dateExpiryLabel);
        card3.appendChild(dateExpiryPack);

        durationtimePack.appendChild(durationtime);
        durationtimePack.appendChild(durationtimeLabel);
        card3.appendChild(durationtimePack);

        expirytimePack.appendChild(expirytime);
        expirytimePack.appendChild(expirytimeLabel);
        card3.appendChild(expirytimePack);

        card2.appendChild(card3);
        card.appendChild(card2);

        // Push card to array
        originalcard.push(card);

        // Add card to cardContainer
        cardContainer.appendChild(card);
      });

      // Calculate the remaining time from the present to the time of expiration
      function calculateTimeLeft(expiryDateTime) {
        const now = new Date(); // Date now

        let diffInMs = expiryDateTime - now.getTime();
        let timeleft = "";

        // If the remaining time is smaller or zero, is Expired
        if (diffInMs <= 0) {
          timeleft = "Hết Hạn";
        } else {
          // Convert the remaining time into Hours, Minutes and Seconds
          const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
          diffInMs %= 1000 * 60 * 60 * 24;
          const hours = Math.floor(diffInMs / (1000 * 60 * 60));
          diffInMs %= 1000 * 60 * 60;
          const minutes = Math.floor(diffInMs / (1000 * 60));
          diffInMs %= 1000 * 60;
          const seconds = Math.floor(diffInMs / 1000);
          // Check if the expiration year is 9999, then return "Infinite"
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

      // Search functionality
      const searchInput = document.getElementById("searchInput");
      const searchResults = document.getElementById("searchResults");
      const clearButton = document.getElementById("clearButton");

      searchInput.addEventListener("input", function () {
        const searchTerm = normalizeText(searchInput.value.trim());

        let hasResults = false;
        // Remove all container
        cardContainer.innerHTML = "";

        // Clear Button
        if (searchInput.value.trim() !== "") {
          clearButton.classList.remove("hidden");
        } else {
          clearButton.classList.add("hidden");
        }

        // Show card
        originalcard.forEach((card) => {
          const accountid = normalizeText(
            card.querySelector(".account-id").textContent.trim().toLowerCase()
          );
          const account = normalizeText(
            card.querySelector(".account").textContent.trim().toLowerCase()
          );
          const datebuy = normalizeText(
            card.querySelector(".date-buy").textContent.trim().toLowerCase()
          );
          const dateexpiry = normalizeText(
            card.querySelector(".date-expiry").textContent.trim().toLowerCase()
          );
          const daterent = normalizeText(
            card.querySelector(".date-rent").textContent.trim().toLowerCase()
          );
          const expirytime = normalizeText(
            card.querySelector(".expiry-time").textContent.trim().toLowerCase()
          );

          // Check search input
          if (
            accountid.includes(searchTerm) ||
            account.includes(searchTerm) ||
            datebuy.includes(searchTerm) ||
            dateexpiry.includes(searchTerm) ||
            daterent.includes(searchTerm) ||
            expirytime.includes(searchTerm)
          ) {
            cardContainer.appendChild(card.cloneNode(true)); // Clone and add to container
            hasResults = true;
          }

          // Search results
          if (hasResults) {
            searchResults.classList.add("hidden");
          } else {
            searchResults.classList.remove("hidden");
          }

          // Clear button
          clearButton.addEventListener("click", function () {
            searchInput.value = "";
            searchResults.classList.add("hidden");
            clearButton.classList.add("hidden");
            window.location.reload();
          });
        });
      });
    })
    .catch((error) => console.error("Error fetching questions:", error));

  // Normalize Text
  function normalizeText(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
});

// Get symbols and color guidelines
const helpIcon = document.getElementById("helpIcon");
const ColorTable = document.getElementById("ColorTable");
let isColorTableVisible = false;

// Toggle Color Table
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
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
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

const toggleThemeButton = document.getElementById("toggleThemeButton");
let isDarkMode = localStorage.getItem("darkMode") === "true";

// Function to toggle theme
function toggleTheme() {
  const body = document.body;
  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    body.classList.add("dark");
    toggleThemeButton.classList.remove("fa-sun");
    toggleThemeButton.classList.add("fa-moon");
  } else {
    body.classList.remove("dark");
    toggleThemeButton.classList.remove("fa-moon");
    toggleThemeButton.classList.add("fa-sun");
  }

  // Save the current theme mode to local storage
  localStorage.setItem("darkMode", isDarkMode);
}

// Apply theme based on saved preference
if (isDarkMode) {
  document.body.classList.add("dark");
  toggleThemeButton.classList.remove("fa-sun");
  toggleThemeButton.classList.add("fa-moon");
} else {
  document.body.classList.remove("dark");
  toggleThemeButton.classList.remove("fa-moon");
  toggleThemeButton.classList.add("fa-sun");
}

// Add click event to toggle theme icon
toggleThemeButton.addEventListener("click", toggleTheme);
