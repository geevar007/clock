const fileInput = document.getElementById("excel-file");
    var resultArr=[];
    const pName=[];
    const hName=[];
    const hNo=[];
    const mNo=[];
    const rName=[];
    const  datas=[1,pName,rName,hNo,hName,mNo]
    var tHeader=[ "No","Name","Relative","HNo","House","Mob:" ]
 
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
      closeAllLists();
      var arr= getSelectedArray();
      if(keyName=="s"){
      var val = inputBox.value;
       
        
       // const file = fileInput.files[0]; 
        if(!val) {return false }
        
       
        
        var a = makeTableForOutPut()
       
       var totalFound=0;
       resultArr=[];
        /*for each item in the array...*/
        for (var i = 0; i < arr.length; i++) {
                      
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
           
                           resultArr.push(i);

                         //if(inputHome.value){}
                          
                         //else{
                           totalFound++; createOutput (a,i,totalFound); }        //  }
                }
                          }
                        
      else{

        inputBox.value=null;

        inputHome.value=null;


      }                  
                        
                        
                        
                        }//Keypressd End*/}})
   
   
      

function subSearch(){
  if(!inputBox.value) { return false }
  closeAllLists(); 

     var totalFound = 0;
     var val2=inputHome.value;
     var a =  makeTableForOutPut();
    

     resultArr.forEach(function (element) {
     
     var arr2=hName;
     var sOption=document.querySelector('input[name="option"]:checked').value
    if( sOption=='hName'){ var arr2=pName;}

 
        if(val2 && arr2[element].substr(0,val2.length).toUpperCase()==val2.toUpperCase()){
          totalFound++;
          createOutput (a,element,totalFound); }// if same text find end

if(!val2){keyPressed("s")}
     })// forEach result arr End 
                    }// sub search end heare

function makeTableForOutPut(){

  var table = document.createElement("table");
  
  table.setAttribute("class", "autocomplete-items");
  //var theader = document.createElement('thead');
    //var headerRow = document.createElement('tr');
  var tbody=document.createElement('tbody');
  
  mainDiv.appendChild(table);

 

 // tHeader.forEach(element=> {
  //  var th = document.createElement('th');

  //  th.textContent = element;
  //  headerRow.appendChild(th);})


//theader.appendChild(headerRow);
//table.appendChild(theader);
table.appendChild(tbody);
  return tbody;

}



function createOutput(a,i,totalFound){


 var tr = document.createElement("tr");

datas.forEach(element=>{
  var td= document.createElement('td');

if(element==1){ td.textContent = 1+i;  }
 else{ td.textContent = element[i];}

tr.appendChild(td);



})

 // b.innerHTML = (1+i)+' '+pName[i]+" - ( "+ rName[i] +" ) "+"_ "+
//hNo[i]+" _ "+hName[i]+' _'+ "Mob:"+mNo[i];

a.style.display="block";

a.appendChild(tr);
    
    counter.innerHTML= "Total Found: "+totalFound
}

    function closeAllLists() {

      counter.innerHTML= ""
     var x = document.getElementsByClassName("autocomplete-items");
      
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