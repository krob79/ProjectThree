const input_name = document.getElementById("name");
input_name.focus();

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
    console.log("---type: " + type);
    clearDropDown(menu);
    for(let i = 0; i < options.length; i++){
        if(options[i].type === type){
            let option = document.createElement("option");
            option.text = options[i].text;
            option.value = options[i].value;
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
let numberRegex = /\d+/g;
let ampmStartRegex = / \d([^\d]{2})/;
let ampmEndRegex = /\-\d+([^\d]{2})/;
var start, end;

function ampmToMilitary(hours, ampm){
    let h = hours;
    if(ampm === "pm" && hours<12){
        h+=12;
    }else if(ampm === "am" && hours==12){
        h = h-12;
    }
    return h;
}

for(let i=0; i < fieldset_activities_inputs.length; i++){
    console.log(fieldset_activities_inputs[i].dataset.dayAndTime);
    let day = fieldset_activities_inputs[i].dataset.dayAndTime;
    let cost = fieldset_activities_inputs[i].dataset.cost;
    let dayName, startAMPM, endAMPM, numbersMatch, startHour, endHour;
    //if not undefined
    if(day){
        //set up RegEx to find the start and end hours as well as their respective am/pm
        dayName = day.match(/\w+/);
        numbersMatch = day.match(numberRegex);
        startAMPM = day.match(ampmStartRegex)[1];
        endAMPM = day.match(ampmEndRegex)[1];
        //convert AM/PM times to military time 
        startHour = ampmToMilitary(parseInt(day.match(numberRegex)[0]), startAMPM);
        endHour = ampmToMilitary(parseInt(day.match(numberRegex)[1]), endAMPM);
        console.log(`REGEX: ${dayName} ${startHour} ${startAMPM} ${endHour} ${endAMPM}`);
    }else{
        dayName = "Everyday";
        startHour = -1;
        endHour = -1;
        cost = 200;
    }
    
    //console.log(day);
    let obj = { 
        day:dayName.toString(),
        start:parseInt(startHour),
        end:parseInt(endHour),
        cost:parseInt(cost)
    };
    eventList.push(obj);
    console.log(`${typeof obj.day} OBJ: ${obj.day} ${obj.start} ${obj.end} ${obj.cost}`);
}

for(let i=0; i < fieldset_activities_inputs.length; i++){
    fieldset_activities_inputs[i].addEventListener("change", (e) => {
        //console.log("----"+e.target.dataset.cost);
        returnTotalCost();
    })
}

function returnTotalCost(){
    let total = 0;
    totalCost.textContent = "";
    for(let i=0; i < fieldset_activities_inputs.length; i++){
        if(fieldset_activities_inputs[i].checked){
            total += eventList[i].cost;
            hideConflicts(i);
        }
    }
    totalCost.textContent = `Your total cost is: $${total}`;
}

function hideConflicts(selected){
    for(let i=0; i< eventList.length; i++){
        //ignore the checkbox if it's checked OR disabled OR if the start date is -1 
        if(!fieldset_activities_inputs[i].checked && eventList[i].start > -1){
            console.log("--" + i + " and " + selected + " are not the same");
            if(isEventAvailable(i, selected)){
               fieldset_activities_inputs[i].disabled = false;
               fieldset_activities_inputs[i].parentNode.className = '';
            }else{
               fieldset_activities_inputs[i].disabled = true;
               fieldset_activities_inputs[i].parentNode.className = 'disabled';
            }
        }
    }
}

function isEventAvailable(current, selected){
    console.log("IS AVAILABLE?");
    //if the current event day is the same as the selected event day
    if(eventList[current].day == eventList[selected].day){
        //check for several situations: 
        // 1. current event starts after selected event's start AND before the selected event's end
        // 2. current event ends after selected event's start AND before the selected event's end
        // 3. current event starts before selected event's start, AND current event ends after the selected event's end
        if((eventList[current].start >= eventList[selected].start)&&(eventList[current].start < eventList[selected].end)){
            console.log(`${eventList[current].start} is later than ${eventList[selected].start} AND sooner than ${eventList[selected].end}`);
            return false;
        }else if((eventList[current].end >= eventList[selected].start)&&(eventList[current].end < eventList[selected].end)){
            console.log(`${eventList[current].end} is later than ${eventList[selected].start} AND sooner than ${eventList[selected].end}`);
            return false;
        }else if((eventList[current].start <= eventList[selected].start)&&(eventList[current].end > eventList[selected].end)){
            console.log(`${eventList[current].start} is earlier than ${eventList[selected].start} AND ${eventList[current].end} is later than ${eventList[selected].end}`);
            return false;
        }else{
            console.log("WE'RE GOOD");
            return true;
        }
    }else{
        console.log(`${eventList[current].day} and ${eventList[selected].day} - not same`);
        return true;
    }
}














