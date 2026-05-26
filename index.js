


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particles = [];
let renderedStars = []; // Store star positions for collision detection

function createSandAnimation(x, y) {
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 2,
            clr: getRandomColor()
        });
    }
}

canvas.addEventListener("click", (e) => {
    let hitStar = false;
    
    // Check if click hits any star
    for (let star of renderedStars) {
        const dx = e.clientX - star.x;
        const dy = e.clientY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < star.radius + 5) { // +5 for easier clicking
            createSandAnimation(e.clientX, e.clientY);
            hitStar = true;
            break;
        }
    }
    
    // If no star hit, still create animation at click point
    if (!hitStar) {
        createSandAnimation(e.clientX, e.clientY);
    }
});
function animate() {
    renderedStars = []; // Clear previous frame's star positions
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(centerX, centerY);

    for (let i = 0; i < stars.length; i++) {
        let star = stars[i];
        star.drawStar();
    }

    ctx.translate(-centerX, -centerY);

    // Draw particles on top
    particles.forEach(p => {
        p.vy += 0.1;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.clr;
        ctx.fillRect(p.x, p.y, 3, 3);
    });

    requestAnimationFrame(animate);
}

let numberOfStars = 5000;

let stars = [];

let centerX = canvas.width * 0.5;
let centerY = canvas.height * 0.5;

class Star {
    constructor() {
        this.x = getRandomInt(-centerX, centerX);
        this.y = getRandomInt(-centerY, centerY);
        this.counter = getRandomInt(1, canvas.width);

        this.radiusMax = 1 + Math.random() * 3;
        this.speed = getRandomInt(1, 5);
        this.context = ctx;
        this.color = getRandomColor();
    }
    drawStar() {
        this.counter -= this.speed;

        if (this.counter < 1) {
            this.counter = canvas.width;
            this.x = getRandomInt(-centerX, centerX);
            this.y = getRandomInt(-centerY, centerY);

            this.radiusMax = getRandomInt(1, 5);
            this.speed = getRandomInt(1, 5);
        }
        let xRatio = this.x / this.counter;
        let yRatio = this.y / this.counter;

        let starX = remap(xRatio, 0, 1, 0, canvas.width);
        let starY = remap(yRatio, 0, 1, 0, canvas.height);
        this.radius = remap(this.counter, 0, canvas.width, this.radiusMax, 0);

        // Store rendered position for collision detection
        renderedStars.push({
            x: starX,
            y: starY,
            radius: this.radius
        });

        ctx.beginPath();

        ctx.arc(starX, starY, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function setup() {
    for (let i = 0; i < numberOfStars; i++) {
        let star = new Star();
        stars.push(star);
    }
}
setup();
animate();

let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        location.reload();
    }, 150);
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function remap(value, istart, istop, ostart, ostop) {
    // Ensure values are numerical to avoid potential errors
    value = Number(value);
    istart = Number(istart);
    istop = Number(istop);
    ostart = Number(ostart);
    ostop = Number(ostop);

    // Perform the mapping calculation
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}
