let redirectBtn = document.getElementById('redirectBtn');

redirectBtn.addEventListener("click", async () => {
    window.history.go(-2);
});