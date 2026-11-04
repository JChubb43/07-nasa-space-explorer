// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const searchButton = document.getElementById('searchButton');
const gallery = document.getElementById('gallery');
const imageModal = document.getElementById('imageModal');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');

let images = [];

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

searchButton.addEventListener('click', fetchImages);

gallery.addEventListener('click', (event) => {
  const galleryItem = event.target.closest('.gallery-item');

  if (galleryItem) {
    openModal(images[galleryItem.dataset.index]);
  }
});

modalClose.addEventListener('click', closeModal);
imageModal.addEventListener('click', (event) => {
  if (event.target === imageModal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !imageModal.hidden) {
    closeModal();
  }
});

async function fetchImages() {
  showLoading();

  // Fetch attempt
  try {
    const APIKey = "rBqPh876kLghdwttHN9FThwCc7njNb8MzTgTmQfz";
    
    const startDate = formatDate(startInput.value);
    const endDate = formatDate(endInput.value);
    const url = `https://science.nasa.gov/wp-json/wp/v2/apod-basic?date_from=${startDate}&date_to=${endDate}&api_key=${encodeURIComponent(APIKey)}`;

    console.log(url);

    const response = await fetch(url);
    const data = await response.json();

    gallery.innerHTML = '';
    images = data;

    data.forEach((image, index) => {
      gallery.innerHTML += `
        <article class="gallery-item" data-index="${index}" tabindex="0">
          <img src="${image.hdurl || image.url}" alt="${image.title}">
          <h2>${image.title}</h2>
          <p>${image.date}</p>
        </article>
      `;
    });

  } catch (error) {
    console.error(error);
  }
}

async function showLoading() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '<div class="placeholder"><p>🔄 Loading space photos…</p></div>';
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${year.slice(2)}${month}${day}`;
}

function openModal(image) {
  modalImage.src = image.hdurl || image.url;
  modalImage.alt = image.title;
  modalTitle.textContent = image.title;
  modalDate.textContent = image.date;
  modalExplanation.innerHTML = image.explanation;
  imageModal.hidden = false;
  modalClose.focus();
}

function closeModal() {
  imageModal.hidden = true;
}
