let blocklist = [];
let isWhiteList = false;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blocklist: [] });
    chrome.storage.sync.set({ isWhiteList: false });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    targetURL = new URL(tab.url);

    chrome.storage.sync.get(['blocklist', 'isWhiteList'], function(result) {
        let blocklist = result.blocklist;
        let isWhiteList = result.isWhiteList;

        if (blocklist.includes(targetURL.hostname) && !isWhiteList) {
            chrome.tabs.update(tabId, { url: chrome.runtime.getURL(`redirect.html?url=${targetURL.hostname}`) });
        } else if (!blocklist.includes(targetURL.hostname) && isWhiteList) {
            chrome.tabs.update(tabId, { url: chrome.runtime.getURL(`redirect.html?url=${targetURL.hostname}`) });
        }
    });
});