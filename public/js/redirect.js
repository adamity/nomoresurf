const url = new URL(window.location.href).searchParams.get("url");
const blockedSite = document.getElementById("blockedSite");
const redirectBtn = document.getElementById('redirectBtn');
const redirectMemeImg = document.getElementById('redirectMemeImg');
const redirectMeme = [
    "https://i.imgflip.com/6riw13.jpg",
    "https://i.imgflip.com/6rivix.jpg",
    "https://i.imgflip.com/6riv9c.jpg",
    "https://i.imgflip.com/6ritiq.jpg",
    "https://i.imgflip.com/6riwi0.jpg",
    "https://i.imgflip.com/6riwor.jpg",
    "https://i.imgflip.com/6riwyc.jpg",
    "https://i.imgflip.com/6rixnf.jpg"
];

blockedSite.innerText = url;
redirectMemeImg.src = redirectMeme[Math.floor(Math.random() * redirectMeme.length)];

redirectBtn.addEventListener("click", () => {
    window.history.go(-2);
});