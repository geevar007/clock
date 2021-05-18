var onoff=0;
var temps=0;
var scra=0;

function gpress(val){
if(onoff==1){
   
    console.log("temp value is "+temps);
     
    if(val=="="){var result= eval(temps);  document.getElementById("screen").value=result}
   
    temps=document.getElementById("screen").value
    if(temps!=0){document.getElementById("screen").value=document.getElementById("screen").value+val
}
else{document.getElementById("screen").value=val}
}



}




function allclr(){
    onoff=1;
    document.getElementById("screen").value=0;

}