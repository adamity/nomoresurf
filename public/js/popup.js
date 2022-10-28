import { getBlocklist, getIsWhitelist, getActiveTab } from "./controller.min.js";
import { ExtPay } from "../assets/ExtPay/ExtPay.min.js";

const extpay = ExtPay('nomoresurf');
const pricingBtn = document.getElementById('pricingBtn');

const blockSiteBtn = document.getElementById('blockSiteBtn');
const editBlocklistBtn = document.getElementById('editBlocklistBtn');

let activeTab = null;
let targetURL = null;

let blocklist = [];
let isWhitelist = false;

init();

editBlocklistBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage(() => {
        chrome.runtime.sendMessage({ action: "openBlocklistTab" });
    });
});

pricingBtn.addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.query({
            url: chrome.runtime.getURL("options.html")
        },
        tabs => {
            if (tabs.length > 0) {
                chrome.runtime.openOptionsPage(() => {
                    chrome.runtime.sendMessage({ action: "openPricingTab" });
                });
            } else {
                window.open(chrome.runtime.getURL('options.html#pricing'));
            }
        }
    );
});

async function init() {
    extpay.getUser().then(user => {
        if (!user.paid) pricingBtn.classList.remove('invisible');
    });

    activeTab = await getActiveTab();
    targetURL = new URL(activeTab.url);

    if (targetURL.protocol != "http:" && targetURL.protocol != "https:") {
        blockSiteBtn.innerText = "This site cannot be blocked";
        blockSiteBtn.disabled = true;
    } else {
        blocklist = await getBlocklist();
        isWhitelist = await getIsWhitelist();

        if (blocklist.includes(targetURL.hostname) && !isWhitelist || !blocklist.includes(targetURL.hostname) && isWhitelist) {
            blockSiteBtn.innerText = "This site is already blocked";
            blockSiteBtn.disabled = true;
        } else {
            blockSiteBtn.innerHTML = `Block <span class="text-lowercase">${targetURL.hostname}</span>`;
            blockSiteBtn.addEventListener("click", () => {
                extpay.getUser().then(user => {
                    if (user.paid || blocklist.length < 3) {
                        if (!isWhitelist) {
                            blocklist.push(targetURL.hostname);
                        } else {
                            let index = blocklist.indexOf(targetURL.hostname);
                            blocklist.splice(index, 1);
                        }
                        chrome.storage.sync.set({ blocklist: blocklist });
                        window.close();
                    } else {
                        pricingBtn.click();
                    }
                });
            });
        }
    }
}