const canvas = document.getElementById('canvas');
const input = document.getElementById('input');
const inputLabel = document.getElementById('input-label');
const image = new Image();
const ctx = canvas.getContext('2d');

input.onchange = function() {
    inputLabel.style.display = 'none';
    canvas.style.display = 'flex';
    const imageFile = this.files[0];
    image.onload = draw;
    image.src = URL.createObjectURL(imageFile);
};

function draw() {
    ctx.drawImage(this, 0, 0);
}

function submit() {
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvas.toDataURL();
    link.click();
}

let moveXAmount = 0;
let moveYAmount = 0;
let dragging = false;
let prevX = 0;
let prevY = 0;

function make_pic() {
    ctx.clearRect(0, 0, 600, 600);
    ctx.save();

    ctx.translate(200, 275); // зачем
    ctx.drawImage(image, -500 / 2 + moveXAmount, -500 / 2 + moveYAmount, image.width, image.height);
    ctx.restore();
}

canvas.onmousedown = function() {
    dragging = true;
    prevX = 0;
    prevY = 0;
}

window.onmouseup = function() {
    dragging = false;
    prevX = 0;
    prevY = 0;
}

window.onmousemove = function(e) {
    if (dragging)
    {
        if (prevX > 0 || prevY > 0)
        {
            moveXAmount += e.pageX - prevX;
            moveYAmount += e.pageY - prevY;
            make_pic();
        }
        prevX = e.pageX;
        prevY = e.pageY;
    }
}

make_pic();