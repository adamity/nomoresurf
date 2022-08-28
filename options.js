const blocklistContainer = document.getElementById('blocklistContainer');
let deleteBtn = document.getElementsByClassName('btn-delete');
let addWebsite = document.getElementById("addWebsite");

addWebsite.addEventListener("click", async () => {
    let input = document.getElementById("websiteInput").value;
    let blocklist = await getBlocklist();
    if (!blocklist.includes(input)) {
        blocklist.push(input);
        chrome.storage.sync.set({ blocklist: blocklist });
        console.log(blocklist);
        location.reload();
    }
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
        html += `<div class="d-flex">`;
        html += `<img src="http://www.google.com/s2/favicons?domain=${blocklist[i]}" class="img-thumbnail" alt="..." style="height: 30px;">`;
        html += `<p class="m-0 ms-2">${blocklist[i]}</p>`;
        html += `<button type="button" class="btn btn-sm btn-dark btn-delete ms-auto" data-itme="${blocklist[i]}">Delete</button>`;
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

