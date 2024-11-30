function setPlaybackSpeed(musicSpeed = 1, nonMusicSpeed = 2) {
    let video = document.querySelector('video');
    // Check if video element exists
    if (video) {
        // Get the title of the video
        let titleElement = document.querySelector("#title > h1");
        let lowerTitle = titleElement ? titleElement.innerText.toLowerCase() : '';
        
        // Check if YouTube channel is an official artist (assume music video if yes)
        let officialBadge = document.querySelector("#channel-name > ytd-badge-supported-renderer > div");
        if (officialBadge) {
            const badgeText = officialBadge.innerText || officialBadge.textContent;
            if (badgeText.includes("Official Artist Channel")) {
                video.playbackRate = parseFloat(musicSpeed);
                console.log(`Playback speed set to ${video.playbackRate} (music video from official artist)`);
                return;  // Return early if it's an official artist channel
            }
        }

        // Keywords for identifying music-related videos
        let keywords = ["music", "lyric", "nightcore", "mashup", "feat", "official video", "audio", "lyrics", "song", "ost", "soundtrack", "mixtape", "mix"];
        
        // Check if title contains any keyword
        let isMusicVideo = keywords.some(keyword => lowerTitle.includes(keyword));

        // Set playback speed based on video type
        video.playbackRate = isMusicVideo ? parseFloat(musicSpeed) : parseFloat(nonMusicSpeed);
        console.log(`Playback speed set to ${video.playbackRate} (${isMusicVideo ? "music video" : "non-music video"})`);
        console.log(lowerTitle);
    }
}

// Monitor for URL changes (new video)
let lastUrl = location.href;

const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log("New video detected, setting playback speed...");
        setTimeout(setPlaybackSpeed, 2000); // Add delay to ensure the video element is loaded
    }
});

// Start observing changes in the body (dynamic updates)
observer.observe(document.body, { childList: true, subtree: true });

// Initial playback speed set for the first video
setTimeout(setPlaybackSpeed, 1000);

// Start observing changes in the body (dynamic updates)
observer.observe(document.body, { childList: true, subtree: true });

// Listen for messages from the popup (assuming you have a mechanism to send messages)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateSpeed') {
    const { musicSpeed, nonMusicSpeed } = request.data;
    setPlaybackSpeed(musicSpeed, nonMusicSpeed);
  }
});