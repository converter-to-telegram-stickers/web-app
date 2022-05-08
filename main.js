const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.addEventListener("mousedown", e => { MouseDown(e); });
canvas.addEventListener("mousemove", e => { MouseMove(e); });
document.addEventListener("mouseup", e => { MouseUp(e); });

const selection = {
    mDown: false,
    x: 0,
    y: 0,
    top: 50,
    left: 50,
    width: 512,
    height: 512
};

const image = document.getElementById("image");

image.addEventListener("load", Init);

image.src = "image.jpg";

window.addEventListener("resize", Init);

function Init()
{
    canvas.width = image.width;
    canvas.height = image.height;

    canvas.setAttribute("style", "top: " + (image.offsetTop + 5) + "px; left: " + (image.offsetLeft + 5) + "px;");

    DrawSelection();
}


function MouseDown() {
    selection.mDown = true;
}

function MouseMove(e) {
    if (selection.mDown) {
        selection.x = e.clientX - canvas.offsetLeft;
        selection.y = e.clientY - canvas.offsetTop;
        selection.left = selection.x - selection.width / 2;
        selection.top = selection.y - selection.height / 2;
        CheckSelection();
        Update();
    }
}

function MouseUp() {
    selection.mDown = false;
}

function Update() {
    DrawSelection();
}

function DrawSelection() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(selection.left, selection.top, selection.width, selection.height);
}

function CheckSelection() {
    if (selection.width < 100)
        selection.width = 100;

    if (selection.height < 100)
        selection.height = 100;

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