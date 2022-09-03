let blockSiteBtn = document.getElementById('blockSiteBtn');
let editBlocklistBtn = document.getElementById('editBlocklistBtn');

async function blockSite() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    targetURL = new URL(tab.url);
    blockSiteBtn.innerText = `Block ${targetURL.hostname}`;

    if (targetURL.protocol != "http:" && targetURL.protocol != "https:") {
        blockSiteBtn.innerText = "This site cannot be blocked";
        blockSiteBtn.disabled = true;
    } else {
        let urlLogo = await fetch(`https://logo.clearbit.com/${targetURL.hostname}`);
        console.log(urlLogo);

        chrome.storage.sync.get('blocklist', function(data) {
            if (data.blocklist.includes(targetURL.hostname)) {
                blockSiteBtn.innerText = "This site is already blocked";
                blockSiteBtn.disabled = true;
            }
        });
    }
}

blockSite();

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
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});