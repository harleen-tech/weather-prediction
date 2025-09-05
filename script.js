const apiKey = "6fd3173e13da36747a1f6b6d9dd2cef8";
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");
  if (!city) {
    resultDiv.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }
  resultDiv.innerHTML = "Loading...";
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found.");
    }
    const data = await response.json();
    const temp = data.main.temp;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    resultDiv.innerHTML = `
      <h2>${city}</h2>
      <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
      <p><strong>Temperature:</strong> ${temp}°C</p>
      <p><strong>Condition:</strong> ${description}</p>
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}
function addToWishlist() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Enter a city first.");

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlist.includes(city)) {
    alert("City already in wishlist.");
    return;
  }
  wishlist.push(city);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistUI();
}
async function updateWishlistUI() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const listElement = document.getElementById("wishlist");
  listElement.innerHTML = "";
  for (const city of wishlist) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) continue;

      const data = await response.json();
      const temp = data.main.temp;
      const description = data.weather[0].description;
      const icon = data.weather[0].icon;

      const li = document.createElement("li");
      li.className = "wishlist-item";
      li.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}" style="vertical-align: middle; width: 30px; height: 30px; margin-right: 8px;">
        <span><strong>${city}</strong> - ${temp}°C - ${description}</span>
      `;
      li.onclick = () => {
        document.getElementById("cityInput").value = city;
        getWeather();
      };

      listElement.appendChild(li);
    } catch (err) {
      console.error("Failed to fetch weather for wishlist city:", city);
    }
  }
}
window.onload = updateWishlistUI;
