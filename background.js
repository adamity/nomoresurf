let blocklist = [];

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blocklist: [] });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    targetURL = new URL(tab.url);

    chrome.storage.sync.get(['blocklist'], function(result) {
        let blocklist = result.blocklist;
        if (blocklist.includes(targetURL.hostname)) {
            chrome.tabs.update(tabId, { url: "https://google.com" });
        }
        console.log(blocklist, targetURL.hostname);
    });
});