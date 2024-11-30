document.getElementById('music-speed').addEventListener('input', (e) => {
    document.getElementById('music-speed-value').innerText = e.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateSpeed',
        data: {
          musicSpeed: e.target.value,
          nonMusicSpeed: document.getElementById('non-music-speed').value
        }
      });
    });
  });
  
document.getElementById('non-music-speed').addEventListener('input', (e) => {
    document.getElementById('non-music-speed-value').innerText = e.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateSpeed',
        data: {
          musicSpeed: document.getElementById('music-speed').value,
          nonMusicSpeed: e.target.value,
        }
      });
    });
  });