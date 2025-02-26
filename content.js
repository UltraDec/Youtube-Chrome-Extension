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
                return; // Return early if it's an official artist channel
            }
        }

        // Keywords for identifying music-related videos
        let keywords = ["music", "lyric", "nightcore", "mashup", "feat", "official video", "audio", "lyrics", "song", "ost", "soundtrack", "mixtape", "mix", "theme"];
        
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
        // Retrieve saved settings and apply them
        chrome.storage.sync.get(['musicSpeed', 'nonMusicSpeed'], (data) => {
            const musicSpeed = data.musicSpeed || '1';
            const nonMusicSpeed = data.nonMusicSpeed || '2';
            setTimeout(() => setPlaybackSpeed(musicSpeed, nonMusicSpeed), 2000); // Add delay to ensure the video element is loaded
        });
    }
});

// Start observing changes in the body (dynamic updates)
observer.observe(document.body, { childList: true, subtree: true });

// Initial playback speed set for the first video
chrome.storage.sync.get(['musicSpeed', 'nonMusicSpeed'], (data) => {
    const musicSpeed = data.musicSpeed || '1';
    const nonMusicSpeed = data.nonMusicSpeed || '2';
    setTimeout(() => setPlaybackSpeed(musicSpeed, nonMusicSpeed), 1000);
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSpeed') {
        const { musicSpeed, nonMusicSpeed } = request.data;

        // Save the new settings to Chrome Storage
        chrome.storage.sync.set({ musicSpeed, nonMusicSpeed });

        // Update playback speed
        setPlaybackSpeed(musicSpeed, nonMusicSpeed);
    }
});
