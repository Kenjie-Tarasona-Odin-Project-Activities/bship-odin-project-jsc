
import "./styles.css";


const box = document.querySelector(".box");
const boxContainer = document.querySelector(".box-container");

let temp = null;
let tempFilled = false;

box.addEventListener("mousedown", e => {
    temp = e.target;
    tempFilled = true;
})

box.addEventListener("mouseup", e => {
    temp = null;
    tempFilled = false;
})

boxContainer.addEventListener("mouseover", e => {
    if(tempFilled){
        boxContainer.appendChild(temp);
    }
})

boxContainer.addEventListener("mouseout", e => {
    if(tempFilled){
        boxContainer.appendChild(temp);
    }
})




