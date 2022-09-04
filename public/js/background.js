chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blocklist: [] });
    chrome.storage.sync.set({ isWhitelist: false });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    targetURL = new URL(tab.url);

    chrome.storage.sync.get(['blocklist', 'isWhitelist'], function(result) {
        let blocklist = result.blocklist;
        let isWhitelist = result.isWhitelist;

        if (blocklist.includes(targetURL.hostname) && !isWhitelist) {
            chrome.tabs.update(tabId, { url: chrome.runtime.getURL(`redirect.html?url=${targetURL.hostname}`) });
        } else if (!blocklist.includes(targetURL.hostname) && isWhitelist) {
            chrome.tabs.update(tabId, { url: chrome.runtime.getURL(`redirect.html?url=${targetURL.hostname}`) });
        }
    });
});