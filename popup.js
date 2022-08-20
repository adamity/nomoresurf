function equalizeWidth(selector) {
    document.addEventListener('DOMContentLoaded', function () {
        var elements = document.querySelectorAll(selector);
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.width = "auto";
        }
        var maxWidth = 0;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].offsetWidth > maxWidth) {
                maxWidth = elements[i].offsetWidth;
            }
        }
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.width = maxWidth + "px";
        }
    });
}
