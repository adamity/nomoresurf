let blockSiteBtn = document.getElementById('blockSiteBtn');
let editBlocklistBtn = document.getElementById('editBlocklistBtn');

blockSiteBtn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    targetURL = new URL(tab.url);

    if (targetURL.hostname.includes(".")) {
        chrome.storage.sync.get(['blocklist'], function(result) {
            let blocklist = result.blocklist;
            if (!blocklist.includes(targetURL.hostname)) {
                blocklist.push(targetURL.hostname);
                chrome.storage.sync.set({ blocklist: blocklist });
            }
            console.log(blocklist);
        });
    }
});

editBlocklistBtn.addEventListener("click", async () => {
    console.log("editBlocklistBtn clicked");
});