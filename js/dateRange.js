// NASA's APOD API only has images from June 16, 1995 onwards
const earliestDate = '1995-06-16';

// Get today's date in YYYY-MM-DD format (required by date inputs)
const today = new Intl.DateTimeFormat('en-CA', {  // EST bc the NASA API uses Eastern Time
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).format(new Date());

function setupDateInputs(startInput, endInput) {
  // Keep each date at least 9 days away from the available range edges.
  const earliestStart = new Date(`${earliestDate}T00:00:00Z`);
  earliestStart.setUTCDate(earliestStart.getUTCDate() + 8);
  const earliestStartDate = earliestStart.toISOString().split('T')[0];

  const latestEnd = new Date(`${today}T00:00:00Z`);
  latestEnd.setUTCDate(latestEnd.getUTCDate() - 8);
  const latestEndDate = latestEnd.toISOString().split('T')[0];

  // Setting up search limits
  startInput.min = earliestDate;
  startInput.max = latestEndDate;
  endInput.min = earliestStartDate;
  endInput.max = today;

  // Default: Show the latest available 9-day window.
  const lastWeek = new Date(today);
  lastWeek.setUTCDate(lastWeek.getUTCDate() - 8);
  startInput.value = lastWeek.toISOString().split('T')[0];
  endInput.value = today;

  // Automatically adjust start / end date to show exactly 9 days of images
  // This doesn't work for the earliest dates, as some days were skipped in the NASA archive
  startInput.addEventListener('change', () => {
    const startDate = new Date(startInput.value);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 8);
    endInput.value = endDate > new Date(today) ? today : endDate.toISOString().split('T')[0];
  });
  endInput.addEventListener('change', () => {
    const endDate = new Date(endInput.value);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 8);
    startInput.value = startDate < new Date(earliestDate) ? earliestDate : startDate.toISOString().split('T')[0];
  });
}
