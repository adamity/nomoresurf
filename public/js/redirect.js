import { ExtPay } from "../assets/ExtPay/ExtPay.min.js";

const extpay = ExtPay('nomoresurf');
const pricingBtn = document.getElementById('pricingBtn');

const url = new URL(window.location.href).searchParams.get("url");
const blockedSite = document.getElementById("blockedSite");
const redirectBtn = document.getElementById('redirectBtn');

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

blockedSite.innerText = url;

extpay.getUser().then(user => {
    pricingBtn.classList.remove("d-none");
    if (user.paid) pricingBtn.remove();
});

redirectBtn.addEventListener("click", () => {
    window.history.go(-2);
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