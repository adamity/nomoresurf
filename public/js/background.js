import { getBlocklist, getIsWhitelist } from "./controller.min.js";
import { ExtPay } from "../assets/ExtPay/ExtPay.min.js";

const extpay = ExtPay('nomoresurf');
extpay.startBackground();

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['blocklist'], function(result) {
        if (result.blocklist === undefined) {
            chrome.storage.sync.set({ blocklist: [] });
        }
    });

    chrome.storage.sync.get(['isWhitelist'], function(result) {
        if (result.whitelist === undefined) {
            chrome.storage.sync.set({ isWhitelist: false });
        }
    });

    chrome.runtime.setUninstallURL("https://forms.gle/V2TYaqu1q8J4hhu89");
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
