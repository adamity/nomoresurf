const blocklistContainer = document.getElementById('blocklistContainer');
const blocklistEmpty = document.getElementById('blocklistEmpty');

let deleteBtn = document.getElementsByClassName('btn-delete');
let addWebsiteBtn = document.getElementById("addWebsiteBtn");
let whitelistMode = document.getElementById('whitelistMode');

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

addWebsiteBtn.addEventListener("click", async () => {
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
        html += `<button type="button" class="btn btn-sm btn-light border btn-delete ms-auto" data-item="${blocklist[i]}"><i class="bi bi-trash3"></i></button>`;
        html += `</div>`;
        html += `<hr>`;
    }

    if (html) {
        blocklistEmpty.classList.add("d-none");
        blocklistContainer.classList.remove("d-none");
        blocklistContainer.innerHTML = html;
    } else {
        blocklistEmpty.classList.remove("d-none");
        blocklistContainer.classList.add("d-none");
    }

    for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener('click', function() {
            let item = this.getAttribute('data-item');
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

// A function to generate random math problems, user can pass in the difficulty level
function generateMathProblem(difficulty = null) {
    let problem = "";
    let answer = 0;
    let num1 = 0;
    let num2 = 0;
    let operator = "";

    // If no difficulty is passed in, generate a random difficulty
    if (!difficulty) difficulty = Math.floor(Math.random() * 3) + 1;

    // Generate the first number
    num1 = Math.floor(Math.random() * Math.pow(10, difficulty));

    // Generate the second number
    num2 = Math.floor(Math.random() * Math.pow(10, difficulty));

    // Generate the operator
    if (Math.random() > 0.5) {
        operator = "+";
        answer = num1 + num2;
    } else {
        operator = "-";
        answer = num1 - num2;
    }

    problem = num1 + " " + operator + " " + num2 + " = ";
    return [problem, answer];
}

// Call generateMathProblem to generate a math problem
let problem = generateMathProblem();