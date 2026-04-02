/* ---------- URLs ---------- */
const angadiNames  = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBDN4C80DC8ZWHKNKh8rU_xxx3mMO8koDbWNK89M5zXNH29iVyGtpqLDanpxjIO0DpwuHCKjYC1pbQ/pub?output=csv&gid=1619740580";
const voterNames = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBDN4C80DC8ZWHKNKh8rU_xxx3mMO8koDbWNK89M5zXNH29iVyGtpqLDanpxjIO0DpwuHCKjYC1pbQ/pub?output=csv";

/* ---------- Globals ---------- */
let excelData = [];
let houseGroups = {};
let houseKeys = [];
let houseIndex = 0;
let totalHouses;
let totalInAnga;
let angadiArrays = {};
let selectedAngadi = [];
let serialNo = 0;

let currentMode = "house";



let isDragging = false;

const container = document.getElementById("barContainer");
const bar = document.getElementById("bar");
const label = document.getElementById("label");


const select = document.getElementById("areaSelect");
const inputHno = document.getElementById("houseSearch");

/* ---------- LOAD MAIN SHEET (Houses) ---------- */
async function loadSheet1() {
  const csv = await (await fetch(voterNames)).text();
//  const rows = csv.trim().split("\n").map(r => r.split(","));
  const rows = csv.trim().split("\n").map(r =>r.replace(/\r/g, "").split(","));
const headers = rows[0];

  excelData = rows.slice(1).map(row => {
    let obj = {};
    headers.forEach((head, i) => obj[head] = row[i] || "");
    return obj;
  });
 
  groupByHouse();

}

/* ---------- Group by House Number ---------- */
function groupByHouse() {
  houseGroups = {};
  excelData.forEach(r => {
    const key = String(r.HNo).toLowerCase();
    (houseGroups[key] ??= []).push(r);
  });
  houseKeys = Object.keys(houseGroups);
  totalHouses = houseKeys.length-1;
 
}

/* ---------- Display Table ---------- */
function showTable(data) {
  if (!data || !data.length) return;

  const first = data[0];
  document.getElementById("heading").textContent =
    ` ${getAngadi(first.HNo) || ""} ${first.HNo} - ${first.House}  `;

  const tbody = document.querySelector("#memberTable tbody");
  tbody.innerHTML = data.map(p =>
    `<tr>
       <td style="border:1px solid #ddd;padding:6px">${p.NO}</td>
       <td style="border:1px solid #ddd;padding:6px">${p.Name}</td>
     </tr>`
  ).join("");
}

/* ---------- Modes ---------- */
function viewByHouse() {
  currentMode = "house";
  houseIndex = 0;
 
  showHouseGroup();

}

function showHouseGroup() {
  let percent;
  showTable(houseGroups[houseKeys[houseIndex]]);
if (currentMode === "house") {percent = (houseIndex+1)/totalHouses;
  label.innerHTML = (houseIndex+1) + " / " + totalHouses;
}
else{ percent = (serialNo+1) / (totalInAnga);

  label.innerHTML = (serialNo+1)  + " / " + totalInAnga
}

bar.style.width = (percent * 100) + "%";



}

function goToHouse(hn) {
  const val = (hn || inputHno.value).trim().toLowerCase();
  const pos = houseKeys.indexOf(val);

  if (pos === -1) return alert(hn + " Not found");

  houseIndex = pos;
  showHouseGroup();
}

function viewByArea() {
  currentMode = "area";
  serialNo = 0;
  totalInAnga = selectedAngadi.length;
 goToHouse(selectedAngadi[0]);
}

/* ---------- Navigation ---------- */
function nextGeneric() {
  if (currentMode === "house") {
    if (houseIndex < totalHouses-1) houseIndex++;
    showHouseGroup();
  } else { 
    if (serialNo < (totalInAnga-1 )) serialNo++;
    console.log((serialNo+1)+"/"+(totalInAnga))
    goToHouse(selectedAngadi[serialNo]);
  }
}

function prevGeneric() {
  if (currentMode === "house") {
    if (houseIndex > 0) houseIndex--;
    showHouseGroup();
  } else {
    if (serialNo > 0) serialNo--;
    goToHouse(selectedAngadi[serialNo]);
  }
}

function toggleFunctions() {
  document.getElementById("cb3-8").checked ? viewByArea() : viewByHouse();
}

/* ---------- LOAD ANGADI SHEET ---------- */
async function loadSheet() {
  const csv = await (await fetch(angadiNames)).text();
 const rows = csv.trim().split("\n").map(r =>r.replace(/\r/g, "").split(","));
const headers = rows[0];
 
headers.forEach(heading => angadiArrays[heading] = []);
rows.slice(1).forEach(row =>
    row.forEach((element, slNo) => {if(element!=''){angadiArrays[headers[slNo]].push(element)}})
  );


  select.innerHTML = headers.map((h, i) =>
    `<option value="${h}" ${i === 0 ? "selected" : ""}>${h}</option>`
  ).join("");

  selectedAngadi = angadiArrays[select.value];
}

function angadiChange() {
  selectedAngadi = angadiArrays[select.value];
totalInAnga = selectedAngadi.length;
 
  serialNo = 0;
  if (currentMode === "area") goToHouse(selectedAngadi[0]);
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



 document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
     prevGeneric();   // Simulate click
    }
    if (event.key === "ArrowRight") {
     nextGeneric();  // Simulate click
    }
  });



function updatePosition(clientX) {

 
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;

    // Clamp inside bar
    if (offsetX < 0) offsetX = 1;
    if (offsetX > rect.width) offsetX = rect.width;

    let percent = offsetX / rect.width;
    bar.style.width = (percent * 100) + "%";
  if (currentMode === "house") { 
    houseIndex = Math.round(percent * totalHouses);
     label.innerHTML = houseIndex + " / " + totalHouses;}
else{

  serialNo = Math.round(percent * totalInAnga);

  label.innerHTML = serialNo + " / " + totalInAnga;
}

    
   
    // Access array value
 
}

// Mouse events
container.addEventListener("mousedown", (e) => {
    isDragging = true;
    updatePosition(e.clientX);
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        updatePosition(e.clientX);
    }
});

document.addEventListener("mouseup", () => {
    if (isDragging) {
  
  isDragging = false;
  if (currentMode === "area"){    }
   else{showHouseGroup();}}
});

// Touch support (mobile)
container.addEventListener("touchstart", (e) => {
    updatePosition(e.touches[0].clientX);
});

container.addEventListener("touchmove", (e) => {
    updatePosition(e.touches[0].clientX);
});


/* ---------- Initialize ---------- */
window.onload = loadSheet;
loadSheet1();

