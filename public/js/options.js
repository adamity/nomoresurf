import { getBlocklist, getIsWhitelist, generateMathProblem, validateURL } from "./controller.min.js";

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

const addWebsiteBtn = document.getElementById('addWebsiteBtn');
const websiteInput = document.getElementById("websiteInput");
const whitelistMode = document.getElementById('whitelistMode');

const unblockQuestionObject = document.getElementsByClassName('unblockQuestionObject');
const confirmUnblockObject = document.getElementsByClassName('confirmUnblockObject');

const unblockQuestion = document.getElementById('unblockQuestion');
const answerInput = document.getElementById('answerInput');

const blocklist = await getBlocklist();
const isWhitelist = await getIsWhitelist();

let correctAnswer = null;
let progress = 0;

if (isWhitelist) whitelistMode.checked = true;
renderBlocklist(blocklist);
toggleObject(confirmUnblockObject, unblockQuestionObject, "class");

addWebsiteBtn.addEventListener("click", async () => {
    addWebsiteBtn.disabled = true;

    let url = websiteInput.value;
    if (url.includes("://")) url = url.split("://")[1];
    url = await validateURL(url);

    if (blocklist.includes(url)) {
        alert("This site is already blocked!");
    } else if (!url) {
        alert("Invalid URL");
    } else {
        blocklist.push(url);
        chrome.storage.sync.set({ blocklist: blocklist });
        renderBlocklist(blocklist);
        websiteInput.value = "";
    }

    addWebsiteBtn.disabled = false;
});

websiteInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        addWebsiteBtn.click();
    }
});

whitelistMode.addEventListener('change', () => {
    chrome.storage.sync.set({ isWhitelist: whitelistMode.checked });
});

document.getElementById('submitAnswerBtn').addEventListener('click', () => {
    if (answerInput.value == correctAnswer) {
        answerInput.value = "";
        updateProgress(++progress);

        if (progress > 2) {
            toggleObject(unblockQuestionObject, confirmUnblockObject, "class");
        } else {
            correctAnswer = setUnblockQuestion();
        }
    } else {
        unblockQuestion.style.animation = "shake 0.3s 1";
        setTimeout(() => {
            unblockQuestion.style.animation = "";
        }, 300);
    }
});

document.getElementById('confirmUnblockBtn').addEventListener('click', () => {
    let index = blocklist.indexOf(document.getElementById('selectedURL').value);
    blocklist.splice(index, 1);
    chrome.storage.sync.set({ blocklist: blocklist });

    resetProgress();
    renderBlocklist(blocklist);
});

function renderBlocklist(blocklist) {
    let blocklistContainer = document.getElementById('blocklistContainer');
    let blocklistEmpty = document.getElementById('blocklistEmpty');
    let deleteBtn = document.getElementsByClassName('btn-delete');
    let html = "";

    for (let i = 0; i < blocklist.length; i++) {
        html += `<div class="d-flex align-items-center user-select-none">`;
        html += `<img src="http://www.google.com/s2/favicons?domain=${blocklist[i]}" class="img-thumbnail" alt="..." style="height: 30px;">`;
        html += `<p class="m-0 ms-2">${blocklist[i]}</p>`;
        html += `<button type="button" class="btn btn-sm btn-light border btn-delete ms-auto" data-item="${blocklist[i]}" data-bs-toggle="modal" data-bs-target="#unblockModal"><i class="bi bi-trash3"></i></button>`;
        html += `</div>`;
        html += `<hr>`;
    }

    blocklistContainer.innerHTML = html;
    html ? toggleObject(blocklistEmpty, blocklistContainer, "id") : toggleObject(blocklistContainer, blocklistEmpty, "id");

    for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener('click', function() {
            let item = this.getAttribute('data-item');

            document.getElementById('selectedURL').value = item;
            document.getElementById('selectedURLText').innerText = item;

            toggleObject(confirmUnblockObject, unblockQuestionObject, "class");
            resetProgress();
            correctAnswer = setUnblockQuestion();
        });
    }
}

function updateProgress(progress) {
    let percent = progress * 33.3333333333;
    document.querySelector(".progress-bar").style.width = percent + "%";
}

function resetProgress() {
    answerInput.value = "";
    correctAnswer = null;
    progress = 0;
    updateProgress(progress);
}

function setUnblockQuestion() {
    let problem = generateMathProblem(2);
    unblockQuestion.innerText = problem[0];
    console.log("Answer: " + problem[1]);
    return problem[1];
}

function toggleObject(toHide, toShow, type) {
    if (type == "id") {
        toHide.style.display = "none";
        toShow.style.display = "block";
    } else if (type == "class") {
        for (let i = 0; i < toHide.length; i++) {
            toHide[i].classList.add("d-none");
        }
        for (let i = 0; i < toShow.length; i++) {
            toShow[i].classList.remove("d-none");
        }
    }
}