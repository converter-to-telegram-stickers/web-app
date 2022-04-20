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

function draw(scale, translatePos) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(translatePos.x, translatePos.y);
    ctx.scale(scale, scale);
    ctx.drawImage(image, -250 + translatePos.x, -250 + translatePos.y, image.width, image.height);
    ctx.fill();
    ctx.restore();
}

const translatePos = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

let scale = 1.0;
const scaleMultiplier = 0.9;
const startDragOffset = {};
let mouseDown = false;

canvas.onwheel = function(e) {
    if (e.deltaY < 0) {
        scale /= scaleMultiplier;
        draw(scale, translatePos);
    }
    else if (e.deltaY > 0) {
        scale *= scaleMultiplier;
        draw(scale, translatePos);
    }
}

canvas.onmousedown = function(e) {
    mouseDown = true;
    startDragOffset.x = e.clientX - translatePos.x;
    startDragOffset.y = e.clientY - translatePos.y;
}

canvas.onmouseup = function() {
    mouseDown = false;
}

canvas.onmousemove = function(e) {
    if (mouseDown) {
        translatePos.x = e.clientX - startDragOffset.x;
        translatePos.y = e.clientY - startDragOffset.y;
        draw(scale, translatePos);
    }
}

draw(scale, translatePos);