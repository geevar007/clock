/* ---------- URLs ---------- */
const sheetUrl  = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBDN4C80DC8ZWHKNKh8rU_xxx3mMO8koDbWNK89M5zXNH29iVyGtpqLDanpxjIO0DpwuHCKjYC1pbQ/pub?output=csv&gid=1619740580";
const sheetUrl1 = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTBDN4C80DC8ZWHKNKh8rU_xxx3mMO8koDbWNK89M5zXNH29iVyGtpqLDanpxjIO0DpwuHCKjYC1pbQ/pub?output=csv";

/* ---------- Globals ---------- */
let excelData = [];
let houseGroups = {};
let houseKeys = [];
let houseIndex = 0;

let angadiArrays = {};
let selectedAngadi = [];
let serialNo = 0;

let currentMode = "house";

const select = document.getElementById("areaSelect");
const inputHno = document.getElementById("houseSearch");

/* ---------- LOAD MAIN SHEET (Houses) ---------- */
async function loadSheet1() {
  const csv = await (await fetch(sheetUrl1)).text();
  const rows = csv.trim().split("\n").map(r => r.split(","));
  const headers = rows[0];

  excelData = rows.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i] || "");
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
}

/* ---------- Display Table ---------- */
function showTable(data) {
  if (!data || !data.length) return;

  const first = data[0];
  document.getElementById("heading").textContent =
    `${first.HNo} - ${first.House}  ${first.Mob || ""}`;

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
  showTable(houseGroups[houseKeys[houseIndex]]);
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
  goToHouse(selectedAngadi[0]);
}

/* ---------- Navigation ---------- */
function nextGeneric() {
  if (currentMode === "house") {
    if (houseIndex < houseKeys.length - 1) houseIndex++;
    showHouseGroup();
  } else {
    if (serialNo < selectedAngadi.length - 1) serialNo++;
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
  const csv = await (await fetch(sheetUrl)).text();
  const rows = csv.trim().split("\n").map(r => r.split(","));
  const headers = rows[0];

  angadiArrays = {};
  headers.forEach(h => angadiArrays[h] = []);

  rows.slice(1).forEach(r =>
    r.forEach((v, i) => angadiArrays[headers[i]].push(v))
  );

  select.innerHTML = headers.map((h, i) =>
    `<option value="${h}" ${i === 0 ? "selected" : ""}>${h}</option>`
  ).join("");

  selectedAngadi = angadiArrays[select.value];
}

function angadiChange() {
  selectedAngadi = angadiArrays[select.value];
  serialNo = 0;
  if (currentMode === "area") goToHouse(selectedAngadi[0]);
}

/* ---------- Initialize ---------- */
window.onload = loadSheet;
loadSheet1();
viewByHouse();
