export function getBlocklist() {
    return new Promise(resolve => {
        chrome.storage.sync.get(['blocklist'], function(result) {
            resolve(result.blocklist);
        });
    });
}

export function getIsWhitelist() {
    return new Promise(resolve => {
        chrome.storage.sync.get(['isWhitelist'], function(result) {
            resolve(result.isWhitelist);
        });
    });
}

export function getActiveTab() {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            resolve(tabs[0]);
        });
    });
}

export function generateMathProblem(difficulty = null) {
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

    problem = `${num1} ${operator} ${num2}`;
    return [problem, answer];
}

export function validateURL(url) {
    return new Promise(resolve => {
        let link = document.createElement('a');
        link.href = url;
        resolve(link.hostname);
    });
}
