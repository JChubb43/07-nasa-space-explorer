// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const searchButton = document.getElementById('searchButton');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

searchButton.addEventListener('click', fetchImages);

async function fetchImages() {
  showLoading();

  // Fetch attempt
  try {
    const APIKey = "rBqPh876kLghdwttHN9FThwCc7njNb8MzTgTmQfz";
    const url = `https://science.nasa.gov/wp-json/wp/v2/apod-basic/?start_date=${startInput.value}&end_date=${endInput.value}&api_key=${APIKey}`;

    console.log(url);

    const response = await fetch(url);
    const data = await response.json();

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    data.forEach((image) => {
      gallery.innerHTML += `
        <article class="gallery-item">
          <img src="${image.url}" alt="${image.title}">
          <h2>${image.title}</h2>
          <p>${image.date}</p>
        </article>
      `;
    });

    // step 5
  } catch (error) {
    console.error(error);
  }
}

async function showLoading() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '<div class="placeholder"><p>🔄 Loading space photos…</p></div>';
}
