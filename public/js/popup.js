import { getBlocklist, getActiveTab } from "./controller.js";

const blockSiteBtn = document.getElementById('blockSiteBtn');
const editBlocklistBtn = document.getElementById('editBlocklistBtn');
const activeTab = await getActiveTab();
const targetURL = new URL(activeTab.url);

if (targetURL.protocol != "http:" && targetURL.protocol != "https:") {
    blockSiteBtn.innerText = "This site cannot be blocked";
    blockSiteBtn.disabled = true;
} else {
    const blocklist = await getBlocklist();

    if (blocklist.includes(targetURL.hostname)) {
        blockSiteBtn.innerText = "This site is already blocked";
        blockSiteBtn.disabled = true;
    } else {
        blockSiteBtn.innerHTML = `Block <span class="text-lowercase">${targetURL.hostname}</span>`;
        blockSiteBtn.addEventListener("click", () => {
            blocklist.push(targetURL.hostname);
            chrome.storage.sync.set({ blocklist: blocklist });
            window.close();
        });
    }
}

editBlocklistBtn.addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});
