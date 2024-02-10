const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]")
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator =document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]")
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password="";
let passwordLength=10;
handleSlider();
let checkCount=1;
uppercaseCheck.checked=true;
// set strength circle color to gray
setIndicator("#ccc");
// set passordLength
function handleSlider(){
    inputSlider.value=passwordLength;
lengthDisplay.innerText=passwordLength;
const min=inputSlider.min;
const max=inputSlider.max;
inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    // shadow
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
    console.log("cgc")
}
function getRndInteger(min,max){
  return Math.floor( Math.random() *(max-min))+min;
}
function generateRandomNumber(){
    return getRndInteger(0,10);
}
function generateLowerCase(){
    return  String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return  String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    const randNum=getRndInteger(0,symbol.length);
    return symbol.charAt(randNum);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercase.checked) hasUpper = true;
    if (lowercase.checked) hasLower = true;
    if (numbers.checked) hasNumber = true;
    if (symbol.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}
async function copyContent(){
    try{
   await navigator.clipboard.writeText(passwordDisplay.value);
   copyMsg.innerText="Copied";
}
catch(e){
    copyMsg.innerText="Failed"
}
// make copyMsg visible
copyMsg.classList.add("active");
setTimeout(()=>{
    copyMsg.classList.remove("active");
},2000)

}
function shufflePassword(array){
    // fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        checkCount++;
    });
  // special condition 
    if(passwordLength<checkCount){
       passwordLength=checkCount;
       handleSlider();
    }
}
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
});
console.log("error")

    inputSlider.addEventListener('input',(e)=>{
        passwordLength=e.target.value;
        handleSlider();
    })
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
})
generateBtn.addEventListener('click',()=>{
    // none of checkbox are selected 
    if(checkCount<=0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    // find new password
    // remove old password

    console.log("start jurney");
    password="";
    // // lets put the stuuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }
    let funcArr=[];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);
    
    // compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    // remaining addition
for(let i=0;i<passwordLength-funcArr.length;i++){
    let randIndex=getRndInteger(0,funcArr.length);
    password+=funcArr[randIndex]();
}
// shuffle the password
password=shufflePassword(Array.from(password));
// show in ui
passwordDisplay.value=password;
// calculate strength
console.log("ui");
calcStrength();
})
