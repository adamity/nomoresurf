const blocklistContainer = document.getElementById('blocklistContainer');
let deleteBtn = document.getElementsByClassName('btn-delete');
let addWebsite = document.getElementById("addWebsite");
let whitelistMode = document.getElementById('whitelistMode');

addWebsite.addEventListener("click", async () => {
    let blocklist = await getBlocklist();
    let input = document.getElementById("websiteInput").value;
    if (input.includes("://")) input = input.split("://")[1];

    await fetch(`http://${input}`).then(response => {
        if (response.status === 200) {
            console.log(response);
            let url = new URL(response.url);
            console.log(url.hostname);

            if (!blocklist.includes(url.hostname)) {
                blocklist.push(url.hostname);
                chrome.storage.sync.set({ blocklist: blocklist });
                location.reload();
            }
        } else {
            alert("Invalid URL");
            console.log("error");
        }
    }).catch(error => {
        alert("Invalid URL");
        console.log(error);
    });
});

function getBlocklist() {
    return new Promise(resolve => {
        chrome.storage.sync.get(['blocklist'], function(result) {
            resolve(result.blocklist);
        });
    });
}

chrome.storage.sync.get('blocklist', function(data) {
    let blocklist = data.blocklist;
    let html = "";

    for (let i = 0; i < blocklist.length; i++) {
        html += `<div class="d-flex align-items-center user-select-none">`;
        html += `<img src="http://www.google.com/s2/favicons?domain=${blocklist[i]}" class="img-thumbnail" alt="..." style="height: 30px;">`;
        html += `<p class="m-0 ms-2">${blocklist[i]}</p>`;
        html += `<button type="button" class="btn btn-sm btn-light border btn-delete ms-auto" data-itme="${blocklist[i]}"><i class="bi bi-trash3"></i></button>`;
        html += `</div>`;
        html += `<hr>`;
    }

    blocklistContainer.innerHTML = html;

    for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener('click', function() {
            let item = this.getAttribute('data-itme');
            chrome.storage.sync.get('blocklist', function(data) {
                let blocklist = data.blocklist;
                let index = blocklist.indexOf(item);
                blocklist.splice(index, 1);
                chrome.storage.sync.set({ blocklist: blocklist });
                location.reload();
            });
        });
    }
});

chrome.storage.sync.get('isWhiteList', function(data) {
    if (data.isWhiteList) {
        whitelistMode.checked = true;
    }
});

whitelistMode.addEventListener('change', function() {
    chrome.storage.sync.set({ isWhiteList: this.checked });
});