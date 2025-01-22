const apiKey = "fe662d54aa9e0abfc96fa999a9073418";

document.getElementById("getSuggestions").addEventListener("click", async () => {
  const location = document.getElementById("location").value;
  const activities = document.getElementById("activities").value;

  if (!location) {
    alert("Please enter a location.");
    return;
  }

  const weather = await fetchWeather(location);
  if (weather) {
    const packingList = suggestPacking(weather, activities.split(","));
    displayPackingList(weather, packingList);
  }
});

document.getElementById("translate").addEventListener("click", async () => {
  const language = document.getElementById("language").value;
  const output = document.getElementById("output").innerText;
  const translation = await translateText(output, language);
  document.getElementById("output").innerText = translation;
});

document.getElementById("speak").addEventListener("click", () => {
  const output = document.getElementById("output").innerText;
  const language = document.getElementById("language").value;
  speakText(output, language);
});

async function fetchWeather(location) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    if (data.cod !== 200) {
      alert(data.message);
      return null;
    }
    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windspeed: data.wind.speed,
    };
  } catch (error) {
    console.error(error);
  }
}

function suggestPacking(weather, activities) {
  const packingList = [];
  if (weather.temperature < 15) packingList.push("Warm jacket", "Sweaters", "Gloves");
  if (weather.temperature > 30) packingList.push("Sunglasses", "Light clothing", "Hat");
  if (weather.humidity > 80) packingList.push("Anti-frizz hair products");
  if (weather.windspeed > 10) packingList.push("Windbreaker jacket");

  activities.forEach((activity) => {
    if (activity.toLowerCase().includes("hiking"))
      packingList.push("Sturdy shoes", "Backpack", "Water bottle");
    if (activity.toLowerCase().includes("beach"))
      packingList.push("Swimsuit", "Beach towel", "Sunscreen");
  });

  return packingList;
}

function displayPackingList(weather, packingList) {
  const output = document.getElementById("output");
  output.innerHTML = `
    <h3>Weather in ${weather.location}:</h3>
    <p>Temperature: ${weather.temperature}°C</p>
    <p>Condition: ${weather.description}</p>
    <p>Humidity: ${weather.humidity}%</p>
    <p>Wind Speed: ${weather.windspeed} m/s</p>
    <h3>Packing Suggestions:</h3>
    <ul>${packingList.map((item) => `<li>${item}</li>`).join("")}</ul>
  `;
}

async function translateText(text, targetLang) {
  const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|${targetLang}`
  );
  const data = await response.json();
  return data.responseData.translatedText;
}

function speakText(text, lang) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang; // Set language for TTS
  // Map language codes to voices
  const voiceMap = {
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    ja: "ja-JP",
    de: "de-DE",
    zh: "zh-CN",
    hi: "hi-IN",
    ar: "ar-SA",
    it: "it-IT",
    ru: "ru-RU",
    ko: "ko-KR",
  };
  utterance.lang = voiceMap[lang] || "en-US"; // Default to English if unsupported
  window.speechSynthesis.speak(utterance);
}