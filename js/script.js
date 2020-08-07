//get the focus for the first line on the form, per the project requirements
const input_name = document.getElementById("name");
input_name.focus();

const input_email = document.getElementById("mail");

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

const colorOptions = document.getElementById("colors-js-puns");
const select_color = document.getElementById("color");
clearDropDown(select_color, "Please select a T-shirt theme");
colorOptions.style.display = 'none';
const select_design = document.getElementById("design");

//listen for change event in job title drop down menu
select_design.addEventListener('change', (e) => {
    if(e.target.value != "Select Theme"){
       colorOptions.style.display = 'block';
    }else{
        colorOptions.style.display = 'none';
    }
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
        validateActivity();
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

//inserting error message labels into the DOM
let error_msg = document.createElement("label");
error_msg.className = "inputerrortext";
submitBtn.parentNode.insertBefore(error_msg, submitBtn);

//inserting error message labels into the DOM
let error_msg_name = document.createElement("label");
error_msg_name.textContent = "";
error_msg_name.className = "inputerrortext";
input_name.parentNode.insertBefore(error_msg_name, input_name);

//inserting error message labels into the DOM
let error_msg_email = document.createElement("label");
error_msg_email.textContent = "";
error_msg_email.className = "inputerrortext";
input_email.parentNode.insertBefore(error_msg_email, input_email);

//inserting error message labels into the DOM
let error_msg_activities = document.createElement("label");
error_msg_activities.textContent = "";
error_msg_activities.className = "inputerrortext";
fieldset_activities_inputs[0].parentNode.parentNode.insertBefore(error_msg_activities, fieldset_activities_inputs[0].parentNode);

//inserting error message labels into the DOM
let error_msg_payment = document.createElement("label");
error_msg_payment.textContent = "";
error_msg_payment.className = "inputerrortext";
const label_payment = document.querySelector("label[for='payment']");
label_payment.parentNode.insertBefore(error_msg_payment,label_payment);

populateDropDown(select_payment, paymentOptions, "payment");

displayPaymentMethod("credit card");

//listen for change event in job title drop down menu
select_payment.addEventListener('change', (e) => {
        displayPaymentMethod(e.target.value);
});

//hides any payment method that is not selected
function displayPaymentMethod(method){
    card_display.style.display = "none";
    error_msg_payment.style.display = "none";
    paypal_display.style.display = "none";
    bitcoin_display.style.display = "none";
    switch(method){
        case "credit card":
           card_display.style.display = "block";
           error_msg_payment.style.display = "block";
           break;
        case "paypal":
           paypal_display.style.display = "block";
           break;
        case "bitcoin":
           bitcoin_display.style.display = "block";
           break;
    }
}

//code for continuous validation after each keystroke
input_name.onkeyup = validateName;
input_email.onkeyup = validateEmail;
input_creditCard.onkeyup = validateCreditCard;
input_cvv.onkeyup = validateCVV;
input_zipcode.onkeyup = validateZipcode;

let flag = 0;

//validates name field
function validateName(){
    let name = input_name.value;
    let nameRegEx = /^[A-Za-z]+$/;
    console.log("NAME MATCH: " + (name.match(nameRegEx) != null));   
    if(!name.match(nameRegEx)){
        flag++;
        error_msg_name.textContent = "Name field can not be blank and must only contain letters.";
        input_name.className = "inputerror";
    }else{
        error_msg_name.textContent = "";
        input_name.className = "";
    }
}

//validates email field
function validateEmail(){
    let email = input_email.value;
    let emailRegEx = /^[a-zA-Z0-9.!#$%&’*+\=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    console.log("EMAIL MATCH: " + (email.match(emailRegEx) != null));   
    if(!email.match(emailRegEx)){
        flag++;
        if(input_email.value == ""){
           error_msg_email.textContent = "Please provide an email address.";
        }else{
           error_msg_email.textContent = "Please enter a valid Email address.";
        }
        input_email.className = "inputerror";
    }else{
        input_email.className = "";
        error_msg_email.textContent = "";
    }
}

//validates activity checkboxes
function validateActivity(){
    if(selectedEvents.length < 1){
        flag++;
        error_msg_activities.textContent = "Please select at least one event.";
    }else{
        error_msg_activities.textContent = "";
    }
}

//validates credit card field
function validateCreditCard(){
    let ccRegEx = /^\d{13,16}$/;
    let creditCard = input_creditCard.value;
    let msg = "Please enter a valid credit card number. ";
    console.log("Validate Credit Card: " + (creditCard.match(ccRegEx) != null));
    if(!creditCard.match(ccRegEx)){
        flag++;
        if(!error_msg_payment.textContent.includes(msg)){
           error_msg_payment.textContent += msg;
        }
        input_creditCard.className = "inputerror";
    }else{
        error_msg_payment.textContent = "";
        input_creditCard.className = "";
    }
}

//validates CVV field
function validateCVV(){
    let cvvRegEx = /^\d{3}$/;
    let cvv = input_cvv.value;
    let msg = "Please enter a valid 3-digit CVV number. "
    if(!cvv.match(cvvRegEx)){
        flag++;
        if(!error_msg_payment.textContent.includes(msg)){
            error_msg_payment.textContent += msg;
        }
        input_cvv.className = "inputerror";
    }else{
        error_msg_payment.textContent = "";
        input_cvv.className = "";
    }
}

//validates zipcode field
function validateZipcode(){
    let zipRegEx = /^\d{5}$/;
    let zipcode = input_zipcode.value;
    let msg = "Please enter a valid 5-digit zipcode. ";
    if(!zipcode.match(zipRegEx)){
        flag++;
        if(!error_msg_payment.textContent.includes(msg)){
           error_msg_payment.textContent += msg;
        }
        input_zipcode.className = "inputerror";
    }else{
        error_msg_payment.textContent = "";
        input_zipcode.className = "";
    }
}

//runs all validation functions and checks for a flag
function validate(){
    flag = 0;
    error_msg_name.textContent = "";
    error_msg_email.textContent = "";
    error_msg_activities.textContent = "";
    error_msg_payment.textContent = "";
    
    validateName();
    validateEmail();
    validateActivity();
    if(select_payment.value == "credit card"){
        validateCreditCard();
        validateCVV();
        validateZipcode();
    }
    
    if(flag > 0){
        let w1 = "is";
        let w2 = "item";
        if(flag > 1){
            w1 = "are";
            w2 = "items";
        }
        error_msg.textContent = `There ${w1} ${flag} ${w2} above that should be reviewed in your submission.`;
        return false;
    }else{
        return true;
    }
}

submitBtn.addEventListener('click', (e) => {
    if(!validate()){
        e.preventDefault();
    }
})

