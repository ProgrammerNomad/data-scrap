// Import necessary libraries (e.g., fetch)
// ...

// Flag to track whether the scan is running
let scanRunning = false;

// Function to fetch data from the first API
async function fetchDataFromAPI1() {
  try {
    const response = await fetch('https://api.builtwith.com/lists11/data'); // Replace with your API endpoint
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Function to post data to the second API
async function postDataToAPI2(data) {
  try {
    const response = await fetch('https://api.builtwith.com/lists11/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      console.log('Data posted successfully!');
    } else {
      console.error('Error posting data:', response.status);
    }
  } catch (error) {
    console.error('Error posting data:', error);
  }
}

// Function to initiate the data scan
async function scanData() {
  scanRunning = true;
  const data = await fetchDataFromAPI1();
  if (data) {
    postDataToAPI2(data);
  }
  scanRunning = false;
}

// Function to stop the scan (if running)
function stopScan() {
  if (scanRunning) {
    // Implement logic to stop the scan (e.g., cancel fetch requests)
    scanRunning = false;
    // Update UI (optional)
    chrome.runtime.sendMessage({ action: 'updateUI', status: 'stopped' });
  }
}

// Handle messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan') {
    scanData();
  } else if (request.action === 'stop') {
    stopScan();
  } else if (request.action === 'updateUI') {
    // Update the UI based on the status
    if (request.status === 'started') {
      document.getElementById('startButton').disabled = true;
      document.getElementById('stopButton').disabled = false;
    } else if (request.status === 'stopped') {
      document.getElementById('startButton').disabled = false;
      document.getElementById('stopButton').disabled = true;
    }
  }
});
