const url = new URL(window.location.href).searchParams.get("url");
const blockedSite = document.getElementById("blockedSite");
const redirectBtn = document.getElementById('redirectBtn');

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

blockedSite.innerText = url;

redirectBtn.addEventListener("click", () => {
    window.history.go(-2);
});