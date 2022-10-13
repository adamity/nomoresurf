import { getBlocklist, getIsWhitelist, getActiveTab } from "./controller.min.js";

const blockSiteBtn = document.getElementById('blockSiteBtn');
const editBlocklistBtn = document.getElementById('editBlocklistBtn');

let activeTab = null;
let targetURL = null;

let blocklist = [];
let isWhitelist = false;

init();

editBlocklistBtn.addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});

async function init() {
    activeTab = await getActiveTab();
    targetURL = new URL(activeTab.url);

    if (targetURL.protocol != "http:" && targetURL.protocol != "https:") {
        blockSiteBtn.innerText = "This site cannot be blocked";
        blockSiteBtn.disabled = true;
    } else {
        blocklist = await getBlocklist();
        isWhitelist = await getIsWhitelist();

        if (blocklist.includes(targetURL.hostname) && !isWhitelist) {
            blockSiteBtn.innerText = "This site is already blocked";
            blockSiteBtn.disabled = true;
        } else {
            blockSiteBtn.innerHTML = `Block <span class="text-lowercase">${targetURL.hostname}</span>`;
            blockSiteBtn.addEventListener("click", () => {
                if (!isWhitelist) {
                    blocklist.push(targetURL.hostname);
                } else {
                    let index = blocklist.indexOf(targetURL.hostname);
                    blocklist.splice(index, 1);
                }
                chrome.storage.sync.set({ blocklist: blocklist });
                window.close();
            });
        }
    }
}