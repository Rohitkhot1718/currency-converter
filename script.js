const baseurl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1';

let countrySelects = document.querySelectorAll(".countries select");
let btn = document.querySelector("button");
let fromcur = document.querySelector(".from select");
let tocur = document.querySelector(".to select");
let msg = document.querySelector(".msg");
let swap = document.querySelector(".swap");

let countryList = {}; 

const loadCurrencies = async () => {
    try {
        let response = await fetch("./currencies.json"); 
        countryList = await response.json();
        
        for (const select of countrySelects) {
            for (const code in countryList) {
                let curcode = document.createElement("option");
                curcode.innerText = code;
                curcode.value = code;

                if (select.name === "from" && code === "USD") {
                    curcode.selected = "selected";
                } else if (select.name === "to" && code === "INR") {
                    curcode.selected = "selected";
                }
                select.append(curcode);
            }

            select.addEventListener("change", (evt) => {
                updateFlag(evt.target);
            });
        }
    } catch (error) {
        console.error("Error loading currency data:", error);
    }
};

const updateFlag = (element) => {
    let curcode = element.value;
    let countryCode = countryList[curcode];
    let img = element.parentElement.querySelector("img");

    if (countryCode) {
        img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    } else {
        img.src = `https://flagsapi.com/unknown/flat/64.png`; 
    }
};

const updateCur = async () => {
    let amount = document.querySelector(".datas input");
    let amtval = amount.value;
    if (amtval === "" || amtval < 1) {
        amtval = 1;
        amount.value = "1";
    }

    const url = `${baseurl}/currencies/${fromcur.value.toLowerCase()}.json`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        let rate = data[fromcur.value.toLowerCase()][tocur.value.toLowerCase()];
        let finalAmt = (amtval * rate).toFixed(2);
        msg.innerText = `${amtval} ${fromcur.value} = ${finalAmt} ${tocur.value}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerText = "Failed to fetch exchange rate!";
    }
};

swap.addEventListener("click", () => {
    let tempValue = fromcur.value;
    fromcur.value = tocur.value;
    tocur.value = tempValue;

    let fromImg = document.querySelector(".from .select-container img");
    let toImg = document.querySelector(".to .select-container img");

    let tempSrc = fromImg.src;
    fromImg.src = toImg.src;
    toImg.src = tempSrc;

    updateCur();
});

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    updateCur();
});

window.addEventListener("load", async () => {
    await loadCurrencies();
    updateCur();
});
