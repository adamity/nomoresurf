import { getBlocklist, getIsWhitelist } from "./controller.min.js";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blocklist: [] });
    chrome.storage.sync.set({ isWhitelist: false });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    const targetURL = new URL(tab.url);
    const blocklist = await getBlocklist();
    const isWhitelist = await getIsWhitelist();

    if (targetURL.protocol == "http:" || targetURL.protocol == "https:") {
        if (blocklist.includes(targetURL.hostname) && !isWhitelist) {
            chrome.tabs.update(tabId, {
                url: chrome.runtime.getURL(`redirect.html?url=${targetURL.hostname}`)
            });
        } else if (!blocklist.includes(targetURL.hostname) && isWhitelist) {
            chrome.tabs.update(tabId, {
                url: chrome.runtime.getURL(`redirect.html?url=${targetURL.hostname}`)
            });
        }
    }
});
