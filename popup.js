// document.getElementById('music-speed').addEventListener('input', (e) => {
//     document.getElementById('music-speed-value').innerText = e.target.value;
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.tabs.sendMessage(tabs[0].id, {
//         action: 'updateSpeed',
//         data: {
//           musicSpeed: e.target.value,
//           nonMusicSpeed: document.getElementById('non-music-speed').value
//         }
//       });
//     });
//   });
  
// document.getElementById('non-music-speed').addEventListener('input', (e) => {
//     document.getElementById('non-music-speed-value').innerText = e.target.value;
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.tabs.sendMessage(tabs[0].id, {
//         action: 'updateSpeed',
//         data: {
//           musicSpeed: document.getElementById('music-speed').value,
//           nonMusicSpeed: e.target.value,
//         }
//       });
//     });
//   });

document.addEventListener('DOMContentLoaded', () => {
  const musicSpeedSlider = document.getElementById('music-speed');
  const musicSpeedValue = document.getElementById('music-speed-value');
  const nonMusicSpeedSlider = document.getElementById('non-music-speed');
  const nonMusicSpeedValue = document.getElementById('non-music-speed-value');

  // Load saved settings from Chrome Storage
  chrome.storage.sync.get(['musicSpeed', 'nonMusicSpeed'], (data) => {
    const musicSpeed = data.musicSpeed || '1';
    const nonMusicSpeed = data.nonMusicSpeed || '2';

    musicSpeedSlider.value = musicSpeed;
    musicSpeedValue.innerText = musicSpeed;
    nonMusicSpeedSlider.value = nonMusicSpeed;
    nonMusicSpeedValue.innerText = nonMusicSpeed;

    // Send initial settings to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateSpeed',
        data: {
          musicSpeed: musicSpeed,
          nonMusicSpeed: nonMusicSpeed,
        },
      });
    });
  });

  // Save and send new music speed on slider change
  musicSpeedSlider.addEventListener('input', (e) => {
    const musicSpeed = e.target.value;
    musicSpeedValue.innerText = musicSpeed;

    // Save to Chrome Storage
    chrome.storage.sync.set({ musicSpeed });

    // Notify content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateSpeed',
        data: {
          musicSpeed: musicSpeed,
          nonMusicSpeed: nonMusicSpeedSlider.value,
        },
      });
    });
  });

  // Save and send new non-music speed on slider change
  nonMusicSpeedSlider.addEventListener('input', (e) => {
    const nonMusicSpeed = e.target.value;
    nonMusicSpeedValue.innerText = nonMusicSpeed;

    // Save to Chrome Storage
    chrome.storage.sync.set({ nonMusicSpeed });

    // Notify content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateSpeed',
        data: {
          musicSpeed: musicSpeedSlider.value,
          nonMusicSpeed: nonMusicSpeed,
        },
      });
    });
  });
});
