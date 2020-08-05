//get the focus for the first line on the form 
const input_name = document.getElementById("name");
input_name.focus();
//input_name.addEventListener("blur", (e) => {
//  validateName(e.target.value);  
//})

const input_email = document.getElementById("mail");
//input_email.addEventListener("blur", (e) => {
//  validateEmail(e.target.value);
//})

const name_msg = document.createElement("label");
name_msg.textContent = "Please enter your name.";


const submitBtn = document.getElementsByTagName('button')[0];



//hide elements for 'other' option until we need them
const input_other = document.getElementById("other-title");
input_other.style.display = "none";
const label_other = document.querySelector("label[for='other-title']");
label_other.style.display = "none";

const select_title = document.getElementById("title");

//listen for change event in job title drop down menu
select_title.addEventListener('change', (e) => {
    //if the choice is "other", show the input for other, otherwise hide it again
    if(e.target.value === 'other'){
        label_other.style.display = "block";
        input_other.style.display = "block";
    }else{
        label_other.style.display = "none";
        input_other.style.display = "none";
    }
});

//grab all options in colors drop down menu
let colorMenuOptions = [
    {
        text: "Please select a T-shirt theme",
        value: "none",
        type: "Select Theme"
    },
    {
        text: "Cornflower Blue (JS Puns shirt only)",
        value: "cornflowerblue",
        type: "js puns"
    },
    {
        text: "Dark Slate Grey (JS Puns shirt only)",
        value: "darkslategrey",
        type: "js puns"
    },
    {
        text: "Gold (JS Puns shirt only)",
        value: "gold",
        type: "js puns"
    },
    {
        text: "Tomato (I ♥ JS shirt only)",
        value: "tomato",
        type: "heart js"
    },
    {
        text: "Steel Blue (I ♥ JS shirt only)",
        value: "steelblue",
        type: "heart js"
    },
    {
        text: "Dim Grey (I ♥ JS shirt only)",
        value: "dimgrey",
        type: "heart js"
    }
    
];

let paymentOptions = [
    {
        text: "Select Payment Method",
        value: "select method",
        type: "payment",
        attr: "disabled"
    },
    {
        text:"Credit Card", 
        value:"credit card",
        type: "payment"
    },
    {
        text:"PayPal", 
        value:"paypal",
        type: "payment"
    },
    {
        text:"Bitcoin", 
        value:"bitcoin",
        type: "payment"
    },
]

//clears all options from the menu, with optional default text
function clearDropDown(menu, defaultText = ""){
    for(let i = menu.length-1; i > -1; i--){
        menu.remove(i);
    }
    if(defaultText){
        let defaultOption = document.createElement("option");
        defaultOption.text = defaultText;
        menu.add(defaultOption);
    }
}

function populateDropDown(menu, options, type="none"){
    clearDropDown(menu);
    for(let i = 0; i < options.length; i++){
        if(options[i].type === type){
            let option = document.createElement("option");
            option.text = options[i].text;
            option.value = options[i].value;
            if(options[i].attr === "disabled"){option.disabled = true;}
            menu.add(option);
        }
    }
}

const select_color = document.getElementById("color");
clearDropDown(select_color, "Please select a T-shirt theme");
const select_design = document.getElementById("design");

//listen for change event in job title drop down menu
select_design.addEventListener('change', (e) => {
    //populate drop down based on the value from the theme drop down
    populateDropDown(select_color, colorMenuOptions, e.target.value);
    
});

const fieldset_activities = document.querySelector(".activities");
const fieldset_activities_inputs = document.querySelectorAll(".activities input[type='checkbox']");
let totalCost = document.createElement('label');
totalCost.textContent = "";
fieldset_activities.appendChild(totalCost);

const eventList = [];
let selectedEvents = [];
//find a group of at least 1 number, and find all of those groups - we'll use the first 2 groups
let numberRegex = /\d+/g; 
//find a space, followed by at least 1 number, then capture the 2 characters after that are NOT numbers
let ampmStartRegex = / \d+([^\d]{2})/;
//find a hyphen, followed by at least 1 number, then capture the 2 characters after that are NOT numbers
let ampmEndRegex = /\-\d+([^\d]{2})/;
var start, end;

//for removing events from the selectedEvents Array
function removeFromArray(arr, prop, value) {
    for(let i = 0; i < arr.length; i++){
        //console.log(`---checking element ${i} - prop: ${arr[i][prop]}`);
        if(arr[i][prop] === value){
            arr.splice(i,1);
            //console.log("We got a match! " + arr);
        }
    }
}

//converts standard time hours to military time hours
function ampmToMilitary(hours, ampm){
    let h = hours;
    if(ampm === "pm" && hours<12){
        h+=12;
    }else if(ampm === "am" && hours==12){
        h = h-12;
    }
    return h;
}

//this rounds up all of the important event properties and stores them into objects for easier reference
//it also converts the hours into military time for easier comparison on what starts earlier vs. later
for(let i=0; i < fieldset_activities_inputs.length; i++){
    //console.log(fieldset_activities_inputs[i].dataset.dayAndTime);
    //get the day, start time and end time from the dataset attribute
    let day = fieldset_activities_inputs[i].dataset.dayAndTime;
    //get the cost from the dataset attribute
    let cost = fieldset_activities_inputs[i].dataset.cost;
    //set up some variables to hold information
    let dayName, startAMPM, endAMPM, numbersMatch, startHour, endHour;
    //if there was a dayAndTime dataset, read through it, otherwise set default values
    if(day){
        //set up RegEx to find the start and end hours as well as their respective am/pm
        dayName = day.match(/\w+/);
        numbersMatch = day.match(numberRegex);
        startAMPM = day.match(ampmStartRegex)[1];
        endAMPM = day.match(ampmEndRegex)[1];
        //convert AM/PM times to military time 
        startHour = ampmToMilitary(parseInt(day.match(numberRegex)[0]), startAMPM);
        endHour = ampmToMilitary(parseInt(day.match(numberRegex)[1]), endAMPM);
    }else{
        dayName = "Everyday";
        startHour = -1;
        endHour = -1;
        cost = 200;
    }
    
    //console.log(day);
    //create an object with all of the processed values and push into eventList array
    let obj = {
        id: i,
        day:dayName.toString(),
        start:parseInt(startHour),
        end:parseInt(endHour),
        cost:parseInt(cost)
    };
    eventList.push(obj);
    //console.log(`${typeof obj.day} OBJ: ${obj.day} ${obj.start} ${obj.end} ${obj.cost}`);
}

//add eventListeners for all Event checkboxes
for(let i=0; i < fieldset_activities_inputs.length; i++){
    fieldset_activities_inputs[i].addEventListener("change", (e) => {
        if(e.target.checked){
            selectedEvents.push(eventList[i]);
        }else{
            removeFromArray(selectedEvents, "id", i)
        }
        updateEventList();
    })
}

/*
Each time, starts with a clean slate, compiles costs so far and disables unselected events that have 
scheduling conflicts with selected events
*/
function updateEventList(){
    let total = 0;
    totalCost.textContent = "";
    clearConflicts();
    for(let i=0; i < selectedEvents.length; i++){
        total += selectedEvents[i].cost;
        hideConflicts(selectedEvents[i].id);
    }
    totalCost.textContent = `Your total cost is: $${total}`;
}

function clearConflicts(){
    for(let i=0; i< eventList.length; i++){
        fieldset_activities_inputs[i].disabled = false;
        fieldset_activities_inputs[i].parentNode.className = '';
    }
}

//looks at each event and disables any unselected events that conflict with the event ID from the 'selected' parameter
function hideConflicts(selected){
    //go through entire eventList and compare against the one selected event
    for(let i=0; i< eventList.length; i++){
        //ignore checkboxes that are already checked OR disabled OR if the start date is -1 
        if(!fieldset_activities_inputs[i].checked && eventList[i].start > -1){
            if(!isEventAvailable(i, selected)){
               fieldset_activities_inputs[i].disabled = true;
               fieldset_activities_inputs[i].parentNode.className = 'disabled';
            }
        }
    }
}


/*
Compares 2 events from the eventList and returns true if both events are at separate times, 
false if there is a conflict between the two events
*/
function isEventAvailable(current, selected){
    //if the current event day is the same as the selected event day
    if(eventList[current].day == eventList[selected].day){
        //check for several situations: 
        // 1. current event starts same time or after selected event's start AND before the selected event's end
        if((eventList[current].start >= eventList[selected].start)&&(eventList[current].start < eventList[selected].end)){
            return false;
        // 2. current event ends ONLY after selected event's start AND before the selected event's end
        }else if((eventList[current].end > eventList[selected].start)&&(eventList[current].end < eventList[selected].end)){
            return false;
        // 3. current event starts before selected event's start, AND current event ends after the selected event's end
        }else if((eventList[current].start <= eventList[selected].start)&&(eventList[current].end > eventList[selected].end)){
            return false;
        }else{
            return true;
        }
    }else{
        return true;
    }
}

const card_display = document.getElementById("credit-card");
const input_creditCard = document.getElementById("cc-num");
const input_zipcode = document.getElementById("zip");
const input_cvv = document.getElementById("cvv");
const paypal_display = document.getElementById("paypal");
const bitcoin_display = document.getElementById("bitcoin");
const select_payment = document.getElementById("payment");
select_payment.value = "credit card";
let error_msg = document.createElement("label");
error_msg.className = "inputerrortext";
submitBtn.parentNode.insertBefore(error_msg, submitBtn);



populateDropDown(select_payment, paymentOptions, "payment");

displayPaymentMethod("credit card");

//listen for change event in job title drop down menu
select_payment.addEventListener('change', (e) => {
        displayPaymentMethod(e.target.value);
});

function displayPaymentMethod(method){
    card_display.style.display = "none";
    paypal_display.style.display = "none";
    bitcoin_display.style.display = "none";
    switch(method){
        case "credit card":
           card_display.style.display = "block";
           break;
        case "paypal":
           paypal_display.style.display = "block";
           break;
        case "bitcoin":
           bitcoin_display.style.display = "block";
           break;
    }
}

function validateName(name){
    let nameRegEx = /^[A-Za-z]+$/;
    console.log("NAME MATCH: " + (name.match(nameRegEx) != null));   
    return (name.match(nameRegEx) != null);
}

function validateEmail(email){
    let emailRegEx = /^[a-zA-Z0-9.!#$%&’*+\=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    console.log("EMAIL MATCH: " + (email.match(emailRegEx) != null));   
    return (email.match(emailRegEx) != null);
}
    
function validateActivity(){
    return (selectedEvents.length < 2);
}

function validateCreditCard(creditCard){
    let ccRegEx = /\d{13,16}/;
    console.log("Validate Credit Card: " + (creditCard.match(ccRegEx) != null));
    return (creditCard.match(ccRegEx) != null);
}

function validateCVV(cvv){
    let cvvRegEx = /\d{3}/;
    return (cvv.match(cvvRegEx) != null);
}
function validateZipcode(zipcode){
    let zipRegEx = /\d{5}/;
    return (zipcode.match(zipRegEx) != null);
}

function validate(){
    let flag = 0;
    let problems = "";
    if(!validateName(input_name.value)){
        flag++;
        problems += "Name field can not be blank or contain numbers. ";
        input_name.className = "inputerror";
    }else{
        input_name.className = "";
    }
    if(!validateEmail(input_email.value)){
        flag++;
        problems += "Email address is invalid. ";
        input_email.className = "inputerror";
    }
    if(!validateActivity()){
        flag++;
        problems += "One or more events have not been selected. ";
    }
    if(select_payment.value == "credit card"){
        if(!validateCreditCard(input_creditCard.value)){
            flag++;
            problems += "Credit card number is invalid. ";
            input_creditCard.className = "inputerror";
        }else{
            input_creditCard.className = "";
        }
        if(!validateCVV(input_cvv.value)){
            flag++;
            problems += "CVV number is invalid. ";
            input_cvv.className = "inputerror";
        }else{
            input_cvv.className = "";
        }
        if(!validateZipcode(input_zipcode.value)){
            flag++;   
            problems += "Zipcode is invalid. ";
            input_zipcode.className = "inputerror";
        }else{
            input_zipcode.className = "";
        }
    }
    
    if(flag > 0){
        
        let problemPhrase = "There was a problem with your submission. " + problems;
        if(flag > 1){
           problemPhrase = "Please check the following items with your submission: " + problems;
        }
        console.log("***"+problemPhrase);
        error_msg.textContent = problemPhrase;
        return false;
    }else{
        return true;
    }
}

submitBtn.addEventListener('click', (e) => {
    if(!validate()){
        e.preventDefault();
    }else{
        console.log("VALIDATED ON SUBMIT");
    }
    
})

