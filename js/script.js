let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let draw = false;
let lineWidth = 5; // Default line width
let selected_color = '#000';
let tool = document.querySelectorAll('.tool');
let selected_tool = "brush";
let slider = document.querySelector('#slider');
let colorOptions = document.querySelectorAll('.option');
let pageX, pageY, snap;

let colorChecker = document.getElementById('colorCheck');
let color_picker = document.getElementById('color_picker');

let clear = document.getElementById('clear');
let save = document.getElementById('save');

const setFunction = () =>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    canvas.fillStyle = selected_color;

} 

// Set canvas size
window.onload = () => {
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = selected_color;
    ctx.fillStyle = selected_color; 
    setFunction();
};

// Start drawing on mousedown
canvas.addEventListener('mousedown', (e) => {
    ctx.beginPath();
    draw = true;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = selected_color;
    ctx.fillStyle = selected_color; // Set the fill style when starting

    pageX = e.offsetX;
    pageY = e.offsetY;
    snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

// Stop drawing on mouseup or mouseleave
canvas.addEventListener('mouseup', () => {
    draw = false;
    ctx.beginPath();
});

canvas.addEventListener('mouseleave', () => {
    draw = false;
    ctx.beginPath();
});

// Draw on mousemove
canvas.addEventListener('mousemove', (e) => {
    if (!draw) return;
    ctx.putImageData(snap, 0, 0);

    let width = e.offsetX - pageX;
    let height = e.offsetY - pageY;

    if (selected_tool === "brush") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selected_tool === "eraser") {
        ctx.strokeStyle = '#fff'; // Assuming white as the background color for erasing
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.strokeStyle = selected_color; // Reset to selected brush color
    } else if (selected_tool === "rectangle") {
        if (colorChecker.checked) {
            ctx.fillRect(pageX, pageY, width, height);
        } else {
            ctx.strokeRect(pageX, pageY, width, height);
        }
    } else if (selected_tool === "circle") {
        let radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        ctx.beginPath();
        ctx.arc(pageX, pageY, radius, 0, 2 * Math.PI);
        colorChecker.checked ? ctx.fill() : ctx.stroke();
    } else if (selected_tool === "triangle") {
        ctx.beginPath();
        ctx.moveTo(pageX, pageY);
        ctx.lineTo(pageX + width / 2, pageY + height);
        ctx.lineTo(pageX - width / 2, pageY + height);
        ctx.closePath();
        colorChecker.checked ? ctx.fill() : ctx.stroke();
    } else if (selected_tool === "oval") {
        ctx.beginPath();
        ctx.ellipse(pageX, pageY, Math.abs(width), Math.abs(height) / 2, 0, 0, 2 * Math.PI);
        colorChecker.checked ? ctx.fill() : ctx.stroke();
    } else if (selected_tool === "pentagon") {
        drawPolygon(ctx, pageX, pageY, Math.max(Math.abs(width), Math.abs(height)) / 2, 5);
    } else if (selected_tool === "hexagon") {
        drawPolygon(ctx, pageX, pageY, Math.max(Math.abs(width), Math.abs(height)) / 2, 6);
    }
});

// Tool selection
tool.forEach(element => {
    element.addEventListener('click', () => {
        document.querySelector('.tool.active_tool').classList.remove('active_tool');
        element.classList.add('active_tool');
        selected_tool = element.id;
    });
});

// Update line width from slider
slider.addEventListener('input', () => {
    lineWidth = slider.value;
    ctx.lineWidth = lineWidth;
});

// Color selection
colorOptions.forEach(color => {
    color.addEventListener('click', () => {
        document.querySelector('.selected_color').classList.remove('selected_color');
        selected_color = window.getComputedStyle(color).getPropertyValue('background-color');
        color.classList.add('selected_color');
    });
});

color_picker.addEventListener('change', () => {
    selected_color = color_picker.value;
    color_picker.parentElement.style.background = color_picker.value;
    color_picker.parentElement.click();
});

// Draw polygon
function drawPolygon(ctx, x, y, radius, sides) {
    if (sides < 3) return;
    let angle = (Math.PI * 2) / sides;

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        let px = x + radius * Math.cos(i * angle);
        let py = y + radius * Math.sin(i * angle);
        ctx.lineTo(px, py);
    }
    ctx.closePath();
    colorChecker.checked ? ctx.fill() : ctx.stroke();
}

// Clear painting
clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFunction();
});

// Save painting
save.addEventListener('click', () => {
    let a = document.createElement('a');
    a.download = (Math.floor(Math.random()*2)+".jpg");
    a.href =canvas.toDataURL();
    a.click();
});
