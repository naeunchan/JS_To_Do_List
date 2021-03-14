const body = document.querySelector("body");
const locationContainer = document.querySelector(".js-location span");
const UNSPLASH_API_KEY = "lKxNhuuZRVe-Cv3MPJnGX_YdLZxXvCIxzJ5kb7X-Cqo";
const UNSPLASH_URL = `https://api.unsplash.com/photos/random/?client_id=${UNSPLASH_API_KEY}&query=landscape&orientation=landscape`;

function loadBackground() {
  const savedImage = localStorage.getItem("bg");

  if (savedImage === null) {
    getBackground();
  } else {
    const parsedImage = JSON.parse(savedImage);
    const today = new Date();

    parsedImage.name = parsedImage.name === null ? "" : parsedImage.name;
    parsedImage.city = parsedImage.city === null ? "" : parsedImage.city;
    parsedImage.country = parsedImage.country === null ? "" : parsedImage.country;

    if (today > parsedImage.date) {
      getBackground();
    } else {
      body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url(${parsedImage.url})`;
      locationContainer.innerHTML = `${parsedImage.name} ${parsedImage.city} ${parsedImage.country}`;
    }
  }
  return;
}

function saveBackground(fullUrl, city, country, name) {
  const image = localStorage.getItem("bg");

  if (image !== null) {
    localStorage.removeItem("bg");
  }

  const date = new Date();
  date.setDate(date.getDate() + 1);

  const imgObj = {
    url: fullUrl,
    date,
    city,
    country,
    name,
  };
  localStorage.setItem("bg", JSON.stringify(imgObj));
  loadBackground();
  return;
}

function getBackground() {
  fetch(UNSPLASH_URL)
    .then((res) => res.json())
    .then((json) => {
      const image = json;

      if (image.urls && image.urls.full && image.location) {
        const fullUrl = image.urls.full;
        const location = image.location;
        const city = location.city;
        const country = location.country;
        const name = location.name;

        saveBackground(fullUrl, city, country, name);
      } else {
        getBackground();
      }
    });
  return;
}

function init() {
  loadBackground();
  return;
}

init();
