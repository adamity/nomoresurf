import { getBlocklist, getIsWhitelist, generateMathProblem, validateURL } from "./controller.js";

const whitelistMode = document.getElementById('whitelistMode');
const unblockQuestionObject = document.getElementsByClassName('unblockQuestionObject');
const confirmUnblockObject = document.getElementsByClassName('confirmUnblockObject');
const unblockQuestion = document.getElementById('unblockQuestion');
const answerInput = document.getElementById('answerInput');

for (let i = 0; i < unblockQuestionObject.length; i++) {
    unblockQuestionObject[i].classList.add("d-none");
}
for (let i = 0; i < confirmUnblockObject.length; i++) {
    confirmUnblockObject[i].classList.add("d-none");
}

const deleteBtn = document.getElementsByClassName('btn-delete');
const blocklist = await getBlocklist();
const isWhitelist = await getIsWhitelist();

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

if (isWhitelist) whitelistMode.checked = true;
renderBlocklist(blocklist);

document.getElementById("addWebsiteBtn").addEventListener("click", async () => {
    let websiteInput = document.getElementById("websiteInput");
    let url = websiteInput.value;
    if (url.includes("://")) url = url.split("://")[1];
    url = await validateURL(url);

    if (url) {
        if (blocklist.includes(url)) {
            alert("This website is already blocked!");
        } else {
            blocklist.push(url);
            chrome.storage.sync.set({ blocklist: blocklist });
            renderBlocklist(blocklist);
            websiteInput.value = "";
        }
    } else {
        alert("Invalid URL");
    }
});

let toUnblock = "";
let correctAnswer = null;
let progress = 0;
let percent = 0;
let bar = document.querySelector(".progress-bar");

document.getElementById('submitAnswerBtn').addEventListener('click', () => {
    let answer = answerInput.value;

    if (answer == correctAnswer) {
        correctAnswer = setUnblockQuestion();
        answerInput.value = "";
        progress++;

        if (progress > 2) {
            for (let i = 0; i < unblockQuestionObject.length; i++) {
                unblockQuestionObject[i].classList.add("d-none");
            }
            for (let i = 0; i < confirmUnblockObject.length; i++) {
                confirmUnblockObject[i].classList.remove("d-none");
            }
        }

        makeProgress(progress);
    } else {
        unblockQuestion.style.animation = "shake 0.3s 1";
        setTimeout(() => {
            unblockQuestion.style.animation = "";
        }, 300);
    }
});

document.getElementById('confirmUnblockBtn').addEventListener('click', () => {
    let index = blocklist.indexOf(toUnblock);
    answerInput.value = "";
    progress = 0;
    blocklist.splice(index, 1);
    chrome.storage.sync.set({ blocklist: blocklist });
    renderBlocklist(blocklist);
});

whitelistMode.addEventListener('change', () => {
    chrome.storage.sync.set({ isWhitelist: this.checked });
});

function renderBlocklist(blocklist) {
    let blocklistContainer = document.getElementById('blocklistContainer');
    let blocklistEmpty = document.getElementById('blocklistEmpty');
    let html = "";

    for (let i = 0; i < blocklist.length; i++) {
        html += `<div class="d-flex align-items-center user-select-none">`;
        html += `<img src="http://www.google.com/s2/favicons?domain=${blocklist[i]}" class="img-thumbnail" alt="..." style="height: 30px;">`;
        html += `<p class="m-0 ms-2">${blocklist[i]}</p>`;
        html += `<button type="button" class="btn btn-sm btn-light border btn-delete ms-auto" data-item="${blocklist[i]}" data-bs-toggle="modal" data-bs-target="#unblockModal"><i class="bi bi-trash3"></i></button>`;
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
            for (let i = 0; i < unblockQuestionObject.length; i++) {
                unblockQuestionObject[i].classList.remove("d-none");
            }
            for (let i = 0; i < confirmUnblockObject.length; i++) {
                confirmUnblockObject[i].classList.add("d-none");
            }

            let item = this.getAttribute('data-item');
            toUnblock = item;
            document.getElementById('toUnblockURL').innerText = item;
            answerInput.value = "";
            progress = 0;
            makeProgress(progress);
            correctAnswer = setUnblockQuestion();
        });
    }
}

function makeProgress(progress) {
    percent = progress * 33.3333333333;
    bar.style.width = percent + "%";
}

function setUnblockQuestion() {
    let problem = generateMathProblem(2);
    unblockQuestion.innerText = problem[0];
    console.log(problem[1]);
    return problem[1];
}