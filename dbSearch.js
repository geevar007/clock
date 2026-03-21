/* ---------------------------------------
   Global DOM Elements
---------------------------------------- */

const newInputDiv = document.getElementById("newInputDiv");
const homeDiv = document.getElementById("home");

const inputBox = document.getElementById("name");
const inputHome = document.getElementById("house");
const counter = document.getElementById("counter");
const mainDiv = document.getElementById("container");
const modal = document.getElementById("myModal");
const modalContent = document.getElementById("modal-content");
const modalHeading = document.getElementById("houseNumber");
const closeBtn = document.getElementsByClassName("close")[0];

const angadiNames  = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBDN4C80DC8ZWHKNKh8rU_xxx3mMO8koDbWNK89M5zXNH29iVyGtpqLDanpxjIO0DpwuHCKjYC1pbQ/pub?output=csv&gid=1619740580"; 
const voterNames = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBDN4C80DC8ZWHKNKh8rU_xxx3mMO8koDbWNK89M5zXNH29iVyGtpqLDanpxjIO0DpwuHCKjYC1pbQ/pub?output=csv";



/* ---------------------------------------
   Data Arrays
---------------------------------------- */
let resultArr = [];
const slNO=[];
const pName = [];
const rName = [];
const hNo = [];
const hName = [];
const mNo = [];
let angadiArrays = {};

const datas = [1, pName, rName, hNo, hName, mNo];
const hDatas = [1, pName, hName];

/* ---------------------------------------
   Initial Setup
---------------------------------------- */
inputBox.disabled = true;
inputHome.disabled = true;

inputBox.addEventListener("input", () => keyPressed("s"));
inputHome.addEventListener("input", () => subSearch());

/* ---------------------------------------
   Main Search (By First Input)
---------------------------------------- */
function keyPressed(key) {
    inputHome.value = "";
    closeAllLists("result-table");
    counter.textContent = "";

    const arr = getSelectedArray();

    if (key === "s") {
        const val = inputBox.value;
        if (!val) return;

        const tableBody = makeTableForOutPut(mainDiv, "result-table");
        let totalFound = 0;
        resultArr = [];

        arr.forEach((item, i) => {
            if (item.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                resultArr.push(i);
                totalFound++;
                createOutput(tableBody, i, totalFound, datas,"Yes");
            }
        });

    } else {
        inputBox.value = "";
        inputHome.value = "";
    }
}

/* ---------------------------------------
   Sub Search (Second Filter)
---------------------------------------- */
function subSearch() {
    if (!inputBox.value) return;

    closeAllLists("result-table");
    counter.textContent = "";

    const value = inputHome.value;
    const tableBody = makeTableForOutPut(mainDiv, "result-table");
    let totalFound = 0;

    resultArr.forEach(i => {
        const selectedOption = document.querySelector('input[name="option"]:checked').value;
        const arr = (selectedOption === 'hName') ? pName : hName;

        if (value && arr[i].substr(0, value.length).toUpperCase() === value.toUpperCase()) {
            totalFound++;
            createOutput(tableBody, i, totalFound, datas);
        }

        if (!value) keyPressed("s");
    });
}

/* ---------------------------------------
   Build Table for Results
---------------------------------------- */
function makeTableForOutPut(place, className) {
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    table.className = className;
    place.appendChild(table);
    table.appendChild(tbody);

    return tbody;
}

/* ---------------------------------------
   Create Table Row Output
---------------------------------------- */
function createOutput(table, index, totalFound, dataArray,type) {
    const tr = document.createElement("tr");

    dataArray.forEach(arr => {
        const td = document.createElement("td");

        if (arr === hNo) {
            td.classList.add("houseNumber");
            td.title="View Family";
            td.addEventListener("click", () => viewFamilyMembers(arr[index]));
        }

if(arr===pName){


//td.classList.add("houseNumber");
            td.addEventListener("click", () => fetchFoto(index));
td.title="Click For Photo";
td.style.cursor = "pointer";



}
        td.textContent = arr === 1 ? index + 1 : arr[index];
        tr.appendChild(td);
    });

    table.style.display = "block";
    table.appendChild(tr);
    counter.textContent = "Total Found: " + totalFound;
}

/* ---------------------------------------
   Remove Existing Tables
---------------------------------------- */
function closeAllLists(className) {
    document.querySelectorAll("." + className).forEach(el => el.remove());
}

/* ---------------------------------------
   Handle File Load
---------------------------------------- */

async function checkFile() {
    
 
    try {
         
        // Fetch Url
        const csv = await (await fetch(voterNames)).text();
  const rows = csv.trim().split("\n").map(r =>r.replace(/\r/g, "").split(","));

  rows.slice(1).forEach(row =>
    row.forEach((data, i) =>{ if(i!=0) {datas[i].push(data)}})
  );


 document.getElementById("fileName").textContent = "Connected";
  // UI updates (unchanged)
    newInputDiv.style.display = "flex";
    homeDiv.style.display = "flex";
   
    inputBox.disabled = false;
    inputHome.disabled = false;
    
    } catch (err) {
        console.error(err);
        alert("Failed to read Google Sheets data.");
    }
}


async function loadangadi() {
  const csv = await (await fetch(angadiNames)).text();
 const rows = csv.trim().split("\n").map(r =>r.replace(/\r/g, "").split(","));
const headers = rows[0];
 
headers.forEach(heading => angadiArrays[heading] = []);
rows.slice(1).forEach(row =>
    row.forEach((element, slNo) => {if(element!=''){angadiArrays[headers[slNo]].push(element)}})
  ) 
}









/* ---------------------------------------
   Radio Button Array Selection
---------------------------------------- */
function getSelectedArray() {
    const selected = document.querySelector('input[name="option"]:checked').value;

    if (selected === "pName") {
        inputHome.placeholder = "Filter By House";
        return pName;
    }
    if (selected === "hName") {
        inputHome.placeholder = "Filter By Name";
        return hName;
    }
    if (selected === "hNo") {
        inputHome.placeholder = "Filter By House";
        return hNo;
    }
}

/* ---------------------------------------
   Modal Behavior
---------------------------------------- */
closeBtn.onclick = () => {
    closeAllLists("home-table");

closeAllLists("tempShow");




    
    modal.style.display = "none";
};

window.onclick = event => {
    if (event.target === modal) {
        closeAllLists("home-table");
       closeAllLists("tempShow");
     
        modal.style.display = "none";
    }
};

/* ---------------------------------------
   View Family Members (Modal)
---------------------------------------- */
function viewFamilyMembers(houseNumber) {
    
    const tableBody = makeTableForOutPut(modalContent, "home-table");

    hNo.forEach((num, i) => {
        if (num.toUpperCase() === houseNumber.toUpperCase()) {
            createOutput(tableBody, i, "X", hDatas);
        }
    });

    modalHeading.textContent = getAngadi(houseNumber);
    modal.style.display = "block";
}
  

function getAngadi(houseNo) {
  const searchValue = houseNo.toLowerCase();

  for (const arrayName in angadiArrays) {
    const found = angadiArrays[arrayName].some(
      item => item.toLowerCase() === searchValue
    );

    if (found) {
      return arrayName;
    }
  }
  return "അറിയില്ല";
}

function fetchFoto(index){
   let thumpFoto = (pName[index].replace(/\s+/g, "").slice(0, 6)).toLowerCase() + hNo[index].split("/")[0];
let fotoDb = "https://aqywxfzhafjtudiggioa.supabase.co/storage/v1/object/public/VotFoto/" +thumpFoto + ".png";

//modalHeading.textContent =pName[index];

    fetch(fotoDb)
    .then(response => {
        if (!response.ok) { // check if HTTP response is OK
            throw new Error(thumpFoto);
        }
        return response.blob();
    })
    .then(data => {

let img = document.createElement("img");
img.classList.add("tempShow");
let imgName=document.createElement("h4");
imgName.textContent = pName[index];
imgName.classList.add("tempShow");
imgName.classList.add("noMargin");



        let imgURL = URL.createObjectURL(data);
        img.src = imgURL;
 
modalContent.appendChild(img);
modalContent.appendChild(imgName);
    modal.style.display = "block";


    })
    .catch(error => {
        alert("Failed to fetch photo: " + error.message);
       
    })}



document.addEventListener("DOMContentLoaded", () => {
        checkFile();
        loadangadi();
   



    });
