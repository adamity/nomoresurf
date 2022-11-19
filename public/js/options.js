import { getBlocklist, getIsWhitelist, generateMathProblem, validateURL } from "./controller.min.js";
import { ExtPay } from "../assets/ExtPay/ExtPay.min.js";

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

let pricingModal = new bootstrap.Modal(document.getElementById('pricingModal'))

const extpay = ExtPay('nomoresurf');
const pricingBtn = document.getElementById('pricingBtn');

const addWebsiteBtn = document.getElementById('addWebsiteBtn');
const websiteInput = document.getElementById("websiteInput");
const whitelistMode = document.getElementById('whitelistMode');
const unblockQuestionObject = document.getElementsByClassName('unblockQuestionObject');
const confirmUnblockObject = document.getElementsByClassName('confirmUnblockObject');

const confirmUnblockBtn = document.getElementById('confirmUnblockBtn');
const unblockQuestion = document.getElementById('unblockQuestion');
const answerInput = document.getElementById('answerInput');
const isToggleWhitelist = document.getElementById('isToggleWhitelist');
const whitelistState = document.getElementById('whitelistState');

const unblockModal = new bootstrap.Modal(document.getElementById('unblockModal'));
const alertMessage = document.getElementById('alertMessage');
const unblockModalText = document.getElementById('unblockModalText');
const confirmText = document.getElementById('confirmText');

const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const listText = document.getElementById('listText');
const addedSiteHead = document.getElementById('addedSiteHead');
const addedSiteLead = document.getElementById('addedSiteLead');
const selectedURL = document.getElementById('selectedURL');

let blocklist = [];
let isWhitelist = false;

let correctAnswer = null;
let progress = 0;

init();

addWebsiteBtn.addEventListener("click", async () => {
    addWebsiteBtn.disabled = true;

    extpay.getUser().then(async user => {
        if (user.paid || blocklist.length < 3) {
            if (isWhitelist) {
                isToggleWhitelist.checked = false;
                selectedURL.value = websiteInput.value;

                unblockModalText.innerText = "Add to Whitelist";
                confirmText.innerText = `Do you really want to add ${selectedURL.value} to the whitelist?`;

                toggleVisibility(confirmUnblockObject, unblockQuestionObject, "class");
                resetProgress();
                setUnblockQuestion();

                unblockModal.show();
            } else {
                let response = updateWebsiteList(websiteInput.value);
                (await response).success ? showAlertMessage((await response).message) : showAlertMessage((await response).message, false);
            }
        } else {
            pricingModal.show();
        }
    });

    addWebsiteBtn.disabled = false;
});

websiteInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        addWebsiteBtn.click();
    }
});

whitelistMode.addEventListener('click', (event) => {
    event.preventDefault();
    extpay.getUser().then(user => {
        if (user.paid) {
            isToggleWhitelist.checked = true;
            whitelistState.checked = !whitelistMode.checked;
        
            unblockModalText.innerText = "Whitelist Mode";
            confirmText.innerText = `Do you really want to ${whitelistState.checked ? 'enable' : 'disable'} whitelist mode?`;
        
            toggleVisibility(confirmUnblockObject, unblockQuestionObject, "class");
            resetProgress();
            setUnblockQuestion();
        
            unblockModal.show();
        } else {
            pricingModal.show();
        }
    });
});

submitAnswerBtn.addEventListener('click', () => {
    if (answerInput.value == correctAnswer) {
        answerInput.value = "";
        updateProgress(++progress);

        if (progress > 2) {
            toggleVisibility(unblockQuestionObject, confirmUnblockObject, "class");
            confirmUnblockBtn.disabled = true;
            confirmUnblockBtn.innerText = "Confirm (5)";

            let countdown = 5;
            let countdownInterval = setInterval(() => {
                confirmUnblockBtn.innerText = `Confirm (${--countdown})`;
            }, 1000);

            setTimeout(() => {
                clearInterval(countdownInterval);
                confirmUnblockBtn.disabled = false;
                confirmUnblockBtn.innerText = "Confirm";
            }, 5000);
        } else {
            setUnblockQuestion();
        }
    } else {
        unblockQuestion.style.animation = "shake 0.3s 1";
        setTimeout(() => {
            unblockQuestion.style.animation = "";
        }, 300);
    }
});

confirmUnblockBtn.addEventListener('click', async () => {
    let response = {};

    if (isToggleWhitelist.checked) {
        response = toggleWhitelist(whitelistState.checked);
    } else {
        isWhitelist ? response = updateWebsiteList(selectedURL.value) : response = updateWebsiteList(selectedURL.value, false);
    }

    confirmUnblockBtn.disabled = true;

    showAlertMessage((await response).message);
    resetProgress();
});

document.getElementById('upgradeBtn').addEventListener('click', () => {
    extpay.openPaymentPage();
});

document.getElementById('loginBtn').addEventListener('click', (e) => {
    e.preventDefault();
    extpay.openLoginPage()
});

function renderView(blocklist, isWhitelist) {
    let blocklistContainer = document.getElementById('blocklistContainer');
    let blocklistEmpty = document.getElementById('blocklistEmpty');
    let deleteBtn = document.getElementsByClassName('btn-delete');
    let html = "";

    for (let i = 0; i < blocklist.length; i++) {
        html += `<div class="d-flex align-items-center user-select-none">`;
        html += `<img src="http://www.google.com/s2/favicons?domain=${blocklist[i]}" class="img-thumbnail" alt="..." style="height: 30px;">`;
        html += `<p class="m-0 ms-2">${blocklist[i]}</p>`;
        html += `<button type="button" class="btn btn-sm btn-light border btn-delete ms-auto" data-item="${blocklist[i]}"><i class="bi bi-trash3"></i></button>`;
        html += `</div>`;
        html += `<hr>`;
    }

    blocklistContainer.innerHTML = html;
    html ? toggleVisibility(blocklistEmpty, blocklistContainer, "id") : toggleVisibility(blocklistContainer, blocklistEmpty, "id");

    for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener('click', async function() {
            let item = this.getAttribute('data-item');

            if (isWhitelist) {
                let response = updateWebsiteList(item, false);
                confirmUnblockBtn.disabled = true;
                showAlertMessage((await response).message);
            } else {
                isToggleWhitelist.checked = false;
                selectedURL.value = item;

                unblockModalText.innerText = "Unblock Website";
                confirmText.innerText = `Do you really want to unblock ${item}`;

                toggleVisibility(confirmUnblockObject, unblockQuestionObject, "class");
                resetProgress();
                setUnblockQuestion();

                unblockModal.show();
            }
        });
    }

    if (isWhitelist) {
        whitelistMode.checked = true;
        listText.innerText = "Whitelist";
        addedSiteHead.innerText = "No whitelisted websites";
        addedSiteLead.innerText = "Add websites to the whitelist to allow access.";
    } else {
        listText.innerText = "Block List";
        addedSiteHead.innerText = "No blocked websites";
        addedSiteLead.innerText = "Add websites to the blocklist to prevent access.";
    }
}

async function toggleWhitelist(state) {
    let response = {
        success: true,
        message: ""
    };

    chrome.storage.sync.set({ isWhitelist: state });
    whitelistMode.checked = state;
    isWhitelist = state;

    response.message = `Whitelist mode ${state ? 'enabled' : 'disabled'}!`;
    renderView(blocklist, isWhitelist);

    return response;
}

async function updateWebsiteList(url, isAdd = true) {
    let response = {
        success: false,
        message: ""
    }

    if (isAdd) {
        if (url.includes("://")) url = url.split("://")[1];
        url = await validateURL(url);

        if (blocklist.includes(url)) {
            response.message = `This site is already ${isWhitelist ? 'whitelisted' : 'blocked'}!`;
        } else if (!url) {
            response.message = "Invalid URL";
        } else {
            blocklist.push(url);

            chrome.storage.sync.set({ blocklist: blocklist });
            websiteInput.value = "";

            response.success = true;
            response.message = `Site added to ${isWhitelist ? 'whitelist' : 'blocklist'}!`;
        }
    } else {
        let index = blocklist.indexOf(url);
        blocklist.splice(index, 1);

        response.success = true;
        response.message = `Site removed from ${isWhitelist ? 'whitelist' : 'blocklist'}!`;
    }

    chrome.storage.sync.set({ blocklist: blocklist });
    renderView(blocklist, isWhitelist);

    return response;
}

function showAlertMessage(message, success = true) {
    alertMessage.classList.remove("alert-success", "alert-warning");
    alertMessage.classList.add(success ? "alert-success" : "alert-warning");

    alertMessage.innerText = message;
    alertMessage.classList.add("show");

    setTimeout(() => {
        alertMessage.classList.remove("show");
    }, 3000);
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
    correctAnswer = problem[1];
}

function toggleVisibility(toHide, toShow, type) {
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

async function init() {
    if (window.location.hash == "#pricing") {
        history.pushState("", document.title, window.location.pathname + window.location.search);
        pricingModal.show();
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action == "openPricingTab") {
            pricingModal.show();
        } else if (request.action == "openBlocklistTab") {
            pricingModal.hide();
        }
    });

    extpay.getUser().then(user => {
        pricingBtn.classList.remove("d-none");
        if (user.paid) pricingBtn.remove();
    });

    blocklist = await getBlocklist();
    isWhitelist = await getIsWhitelist();
    confirmUnblockBtn.disabled = true;

    renderView(blocklist, isWhitelist);
    toggleVisibility(confirmUnblockObject, unblockQuestionObject, "class");
    document.getElementById("main").style.paddingTop = document.getElementsByTagName("nav")[0].offsetHeight + "px";
}