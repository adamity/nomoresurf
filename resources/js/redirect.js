let url = new URL(window.location.href);
let hostname = url.searchParams.get("url");
let blockedSite = document.getElementById("blockedSite");

let redirectBtn = document.getElementById('redirectBtn');
let redirectMemeImg = document.getElementById('redirectMemeImg');
let redirectMeme = [
    "https://i.imgflip.com/6riw13.jpg",
    "https://i.imgflip.com/6rivix.jpg",
    "https://i.imgflip.com/6riv9c.jpg",
    "https://i.imgflip.com/6ritiq.jpg",
    "https://i.imgflip.com/6riwi0.jpg",
    "https://i.imgflip.com/6riwor.jpg",
    "https://i.imgflip.com/6riwyc.jpg",
    "https://i.imgflip.com/6rixnf.jpg"
];

blockedSite.innerText = hostname;
redirectMemeImg.src = redirectMeme[Math.floor(Math.random() * redirectMeme.length)];

redirectBtn.addEventListener("click", async () => {
    window.history.go(-2);
});