const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const image = document.getElementById('image');
const selection = {
    dragging: false,
    x: 0,
    y: 0,
    top: 50,
    left: 50,
    width: 512,
    height: 512
};

canvas.onmousedown = (e) => {
    e.preventDefault();
    selection.dragging = true;
};
document.onmousemove = (e) => MouseMove(e);
document.onmouseup = () => { selection.dragging = false; };

image.onload = Init;
image.src = 'image.jpg';

function Init() {
    canvas.width = image.width;
    canvas.height = image.height;
    DrawSelection();
}

function MouseMove(e) {
    if (selection.dragging) {
        selection.x = e.clientX - canvas.offsetLeft;
        selection.y = e.clientY - canvas.offsetTop;
        selection.left = selection.x - selection.width / 2;
        selection.top = selection.y - selection.height / 2;
        CheckSelection();
        DrawSelection();
    }
}

function DrawSelection() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(selection.left, selection.top, selection.width, selection.height);
}

function CheckSelection() {
    if (selection.width > canvas.width)
        selection.width = canvas.width;

    if (selection.height > canvas.height)
        selection.height = canvas.height;

    if (selection.left < 0)
        selection.left = 0;

    if (selection.top < 0)
        selection.top = 0;

    if (selection.left > canvas.width - selection.width)
        selection.left = canvas.width - selection.width;

    if (selection.top > canvas.height - selection.height)
        selection.top = canvas.height - selection.height;
}