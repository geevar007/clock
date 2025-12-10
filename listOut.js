const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBDN4C80DC8ZWHKNKh8rU_xxx3mMO8koDbWNK89M5zXNH29iVyGtpqLDanpxjIO0DpwuHCKjYC1pbQ/pub?output=csv&gid=1619740580"; // ← paste your CSV link

const url='https://docs.google.com/spreadsheets/d/1GrULC7lKvBCunsC-3oXguoxl0ClGEhW_jlo3BFXiG_w/gviz/tq?tqx=out:json';



let excelData = [];
let houseGroups = {};
let areaGroups = {};

let houseKeys = [];
let areaKeys = [];

let houseIndex = 0;
let areaIndex = 0;

let currentMode = "";
let selectedAngadi=[];
const select = document.getElementById("areaSelect");
 let angadiArrays = {};
let serialNo=0;
let inputHno=document.getElementById("houseSearch");


/* Load Sheet Automatically */
fetch(url)
  .then(gRes => gRes.text())// convert the responce to plain text
  .then(gText => { 
      const gJson = JSON.parse(gText.substr(47).slice(0, -2)); 
      
   
     
      const gCols = gJson.table.cols.map(c => c.label);



      excelData = gJson.table.rows.map(row => {
          const obj = {};
          row.c.forEach((cell, i) => {
            if(i!=2){obj[gCols[i]] = cell ? cell.v : "nd"}
              
          });
 
          return obj;
      });

      groupByHouse();
    

     // document.getElementById("controls").classList.remove("d-none");
    
  });

/* --------------------------------------
   Group Data by House Number
-------------------------------------- */
function groupByHouse() {
    houseGroups = {};
    excelData.forEach(row => {
        const key = String(row.HNo).toLowerCase();
        (houseGroups[key] ??= []).push(row);
    });
    houseKeys = Object.keys(houseGroups);
    
}



/* --------------------------------------
   Display Table
-------------------------------------- */
function showTable(data) {
    if (!data?.length) return;

   

// Common fields
const common = {
  HNo: data[0].HNo,
  House: data[0].House,
  Mob: data[0].Mob ?? ""
};

// Single-line common heading
document.getElementById("heading").textContent =
  `${common.HNo} - ${common.House}  ${common.Mob}`;

// Fill table (no labels, only values)
const tbody = document.querySelector("#memberTable tbody");
tbody.innerHTML = "";
data.forEach(person => {
  const tr = document.createElement("tr");
  
  tr.innerHTML = `
      <td style="border:1px solid #ddd; padding:6px;">${person.NO}</td>
      <td style="border:1px solid #ddd; padding:6px;">${person.Name}</td>
  `;
  
  tbody.appendChild(tr);
})



  
}

/* --------------------------------------
   House Mode
-------------------------------------- */
function viewByHouse() {
    
    currentMode = "house";
    houseIndex = 0;
   // document.getElementById("houseControls").classList.remove("d-none");
    //document.getElementById("areaControls").classList.add("d-none");
    showHouseGroup();
}

function showHouseGroup() {
    const key = houseKeys[houseIndex];
    showTable(houseGroups[key]);
}

function goToHouse(houseNumber) {

  
    let val;
    if(houseNumber) {val=houseNumber} else{  val = inputHno.value; }

    
    const pos = houseKeys.indexOf(val.trim().toLowerCase());
    
    if (pos === -1) return alert(houseNumber+"Not found");
    houseIndex = pos;
    showHouseGroup();
}

/* --------------------------------------
   Area Mode
-------------------------------------- */
function viewByArea() {
   
    currentMode = "area";
  goToHouse(selectedAngadi[serialNo]);
    
  
}



/* --------------------------------------
   Navigation
-------------------------------------- */
function nextGeneric() {
    if (currentMode === "house") {
        if (houseIndex < houseKeys.length - 1) houseIndex++;
        showHouseGroup();
    } else if (currentMode === "area") {
        
        if (serialNo < selectedAngadi.length-1) serialNo++;
      
        goToHouse(selectedAngadi[serialNo]);;
        
    }
}

function prevGeneric() {
    if (currentMode === "house") {
        if (houseIndex > 0) houseIndex--;
        showHouseGroup();
        
    } else if (currentMode === "area") {
       
        if (serialNo > 0) serialNo--;
      
        goToHouse(selectedAngadi[serialNo]);
    }
}

function toggleFunctions() {
    let isOn = document.getElementById("cb3-8").checked;

    if (isOn) {
        viewByArea()
    } else {

viewByHouse()
       
    }
}
viewByHouse()

window.onload = loadSheet;

async function loadSheet() {

    const response = await fetch(sheetUrl);
    const csvText = await response.text();

    // Convert CSV text into rows & columns
    const rows = csvText.trim().split("\n").map(r => r.split(","));

    const headers = rows[0];

    // Create empty arrays for each header
   
    headers.forEach(h => angadiArrays[h] = []);

    // Fill each column
    for (let i = 1; i < rows.length; i++) {
        rows[i].forEach((value, colIndex) => {
            const header = headers[colIndex];
            angadiArrays[header].push(value);
        });
    }

    // Populate dropdown with column headers
    
    select.innerHTML = "";

    headers.forEach((header, index) => {
        const option = document.createElement("option");
        option.value = header;
        option.textContent = header;
        if (index === 0) option.selected = true; // default first column
        select.appendChild(option);
    });
selectedAngadi= angadiArrays[select.value];
    // Display default column on load
    //displayColumn();
    // document.getElementById("fileName").textContent ="lodedd sucessfully" ;
}
function angadiChange(){

selectedAngadi= angadiArrays[select.value];
serialNo=0;
if (currentMode === "area"){
goToHouse(selectedAngadi[serialNo]);}

}
