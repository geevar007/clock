const fileInput = document.getElementById("excel-file");
  
var resultArr=[];
    const pName=[];
    const hName=[];
    const hNo=[];
    const mNo=[];
    const rName=[];
    const  datas=[1,pName,rName,hNo,hName,mNo];
    const hDatas=[1,pName,hName];
    var tHeader=[ "No","Name","Relative","HNo","House","Mob:" ]

    var modal = document.getElementById("myModal");
    var modalContent= document.getElementById("modal-content");
    var modalHeading=document.getElementById("houseNumber")
    var openBtn = document.getElementById("openBtn");
    var closeBtn = document.getElementsByClassName("close")[0];
    var userInput = document.getElementById("userInput");
    var displayText = document.getElementById("displayText");

    const newInputDiv=document.getElementById("newInputDiv");
    const homeDiv=document.getElementById("home");
    const welcomeDiv=document.getElementById("welcome");
    const inputBox=document.getElementById("name");
    const inputHome=document.getElementById("house");
    const counter=document.getElementById("counter");
 
  const textToChange = document.getElementById('nameautocomplete-list');
  var myButton = document.getElementById("myButton");
  const fileLabel = document.getElementById('file-label');
  const mainDiv=document.getElementById('container');
  inputBox.disabled = true;
  inputHome.disabled=true;
  inputBox.addEventListener("input", function(e) { keyPressed("s");})
  inputHome.addEventListener("input", function(e) {subSearch();  }) 
    
    function keyPressed(keyName){ 
      inputHome.value=null;
      closeAllLists("result-table");
      counter.innerHTML= ""
      var arr= getSelectedArray();
      if(keyName=="s"){
      var val = inputBox.value;
       if(!val) {return false }
        if (val.length>1){console.log("no need off search all")






        }
       // const file = fileInput.files[0]; 
        
        
       
        
        var outPutTable = makeTableForOutPut(mainDiv,"result-table")
       
       var totalFound=0;
       resultArr=[];
        /*for each item in the array...*/
        for (var i = 0; i < arr.length; i++) {
                      
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
           
                           resultArr.push(i);

                        
                           totalFound++; createOutput (outPutTable,i,totalFound,datas); }        //  }
                }
                          }
                        
      else{

        inputBox.value=null;

        inputHome.value=null;


      }                  
                        
                        
                        
                        }//Keypressd End*/}})
   
   
      

function subSearch(){
  if(!inputBox.value) { return false }
  closeAllLists("result-table"); 
  counter.innerHTML= ""

     var totalFound = 0;
     var val2=inputHome.value;
     var a =  makeTableForOutPut(mainDiv,"result-table");
    

     resultArr.forEach(function (element) {
     
     var arr2=hName;
     var sOption=document.querySelector('input[name="option"]:checked').value
    if( sOption=='hName'){ var arr2=pName;}

 
        if(val2 && arr2[element].substr(0,val2.length).toUpperCase()==val2.toUpperCase()){
          totalFound++;
          createOutput (a,element,totalFound,datas); }// if same text find end

if(!val2){keyPressed("s")}
     })// forEach result arr End 
                    }// sub search end heare

function makeTableForOutPut(place,className){

  var table = document.createElement("table");
   var tbody=document.createElement('tbody');
  
  table.setAttribute("class", className);
  place.appendChild(table);
  table.appendChild(tbody);
  return tbody;

}



function createOutput(table,i,totalFound,dataArray){


 var tr = document.createElement("tr");

dataArray.forEach(element=>{
  var td= document.createElement('td');
  if(element==hNo){ td.addEventListener("click",() =>{ 
    viewFamilyMembers(element[i])  });td.classList.add('houseNumber')}

if(element==1){ td.textContent = 1+i;  }
 else{ td.textContent = element[i];}

tr.appendChild(td);



})



table.style.display="block";

table.appendChild(tr);
    
    counter.innerHTML= "Total Found: "+totalFound
}

    function closeAllLists(className) {

      
     var x = document.getElementsByClassName(className);
     console.log(className);
      
      for (var i = 0; i < x.length; i++) {x[i].parentNode.removeChild(x[i])}
    }
 

  function checkFile(){

    hName.length = 0;
    hNo.length = 0;
    mNo.length = 0;
    pName.length = 0;
    rName.length=0;
    const file = fileInput.files[0]; 
  if (file) {
    newInputDiv.style.display = "flex";
    homeDiv.style.display = "flex";
   welcomeDiv.style.display="none";
    inputBox.disabled = false;
    inputHome.disabled=false;
   // fileLabel.textContent = fileInput.files[0].name.replace(/\.[^/.]+$/, '');
    //fileLabel.style.backgroundColor="rgb(82 95 98)";
    //fileLabel.style.color="white";
    document.getElementById("fileName").innerHTML = fileInput.files[0].name.replace(/\.[^/.]+$/, '');
    welcomeDiv.style.display="none";
      const reader = new FileReader();
      reader.onload = function(e) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const range = XLSX.utils.decode_range(worksheet["!ref"]);
          const  totalColm= range.e.c ;
           var  totalRo=range.e.r;
    const sNo=[];
    
              
          for (let i=1; i <=5;  i++) {
         
              
             
            for (let rNo=1; rNo<=totalRo; rNo++ ) {
              const cell = worksheet[XLSX.utils.encode_cell({ r: rNo, c: i })];
              var cellValue = cell ? cell.v : "x"; // Use .v to get the raw value
              
              if (typeof cellValue === 'number') {cellValue=cellValue.toString()}
             switch(i){

            case 1:
              pName.push(cellValue);  
            break;

            case 2:
              rName.push(cellValue);   
           
            break;

            case 3:
                hNo.push(cellValue);
            break;

            case 4:
              hName.push(cellValue);
            break;

            case 5:
              mNo.push(cellValue);
            break;

                    }//switch end
               
                             } //xxxxxxxxxxxx loop for totalrow  End here
                
                                 } // End   4 times loop  ---- End
     
                                              } // On load function end here
    reader.readAsArrayBuffer(file);  }// if file end
                                                      


}// check file end

 
      

   function getSelectedArray(){
    var selectedRadioButton = document.querySelector('input[name="option"]:checked');

      switch (selectedRadioButton.value) {
        case 'pName':
          inputHome.placeholder = "Filter By House";
          return pName;
        case 'hName':
          inputHome.placeholder = "Filter By Name";
          return hName;
        case 'hNo':
          inputHome.placeholder = "Filter By House";
          return hNo;
        }

      
    } 

    function createTableHeaderCell(className, textContent) {
      const th = document.createElement("th");
      th.className = className;
      th.textContent = textContent;
      return th;}


// Close modal on (x) click
closeBtn.onclick = function() {
   closeAllLists("home-table");
  modal.style.display = "none";
}

// Close modal if user clicks outside
window.onclick = function(event) {
  if (event.target == modal) {
    closeAllLists("home-table");
    modal.style.display = "none";
  }
}
function viewFamilyMembers(houseNumber){

var modalTable=makeTableForOutPut(modalContent,"home-table");


 for (var i = 0; i < hNo.length; i++) {
                      
                if (hNo[i] == houseNumber) {
           
                          

                        
                            createOutput (modalTable,i,"X",hDatas); }        //  }
                }




  modalHeading.textContent=houseNumber;// put input text inside modal
  
  modal.style.display = "block";





}
