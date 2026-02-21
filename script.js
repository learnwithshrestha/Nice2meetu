const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let flowers = [];

// 7 FLOWER TYPES
const TYPES = [
    "daisy",
    "sakura",
    "sunflower",
    "cosmos",
    "tulip",
    "rose",
    "lotus"
];

class Flower {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.height = 0;

        this.maxHeight = 80 + Math.random() * 140;

        this.speed = 1.5 + Math.random() * 1.5;

        this.curve = (Math.random() - 0.5) * 60;

        this.size = 6 + Math.random() * 10;

        this.type =
            TYPES[Math.floor(Math.random() * TYPES.length)];

        this.hue = Math.random() * 360;

        this.windSeed = Math.random() * 1000;

        this.bloom = 0;
    }

    update() {

        if (this.height < this.maxHeight)
            this.height += this.speed;

        if (this.height >= this.maxHeight && this.bloom < 1)
            this.bloom += 0.04;

        this.draw();
    }

    drawStem(tipX, tipY, wind) {

        ctx.beginPath();

        ctx.moveTo(this.x, this.y);

        ctx.quadraticCurveTo(
            this.x + this.curve + wind,
            this.y - this.height * 0.5,
            tipX,
            tipY
        );

        ctx.strokeStyle = "rgba(40,200,90,0.95)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // leaves
        for (let i = 0; i < 2; i++) {

            ctx.beginPath();

            ctx.ellipse(
                this.x + this.curve * 0.3,
                this.y - this.height * (0.4 + i * 0.2),
                6,
                18,
                -0.5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "rgba(40,180,80,0.9)";
            ctx.fill();
        }
    }

    drawPetalLayer(count, radius, width, length, color) {

        ctx.fillStyle = color;

        for (let i = 0; i < count; i++) {

            const angle = (Math.PI * 2 / count) * i;

            ctx.save();

            ctx.rotate(angle);

            ctx.beginPath();

            ctx.ellipse(
                0,
                -radius,
                width,
                length,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();
        }
    }

    drawDaisy(size) {

        this.drawPetalLayer(18, size * 2, size * 0.4, size * 2.4, "white");

        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd54f";
        ctx.fill();
    }

    drawSakura(size) {

        this.drawPetalLayer(5, size * 1.8, size * 0.9, size * 1.8, "#f8bbd0");

        ctx.beginPath();
        ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff59d";
        ctx.fill();
    }

    drawSunflower(size) {

        this.drawPetalLayer(20, size * 2, size * 0.5, size * 2.5, "#fdd835");

        ctx.beginPath();
        ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "#5d4037";
        ctx.fill();
    }

    drawCosmos(size) {

        this.drawPetalLayer(
            8,
            size * 2,
            size * 0.7,
            size * 2,
            `hsl(${this.hue},70%,65%)`
        );

        ctx.beginPath();
        ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "#ffd54f";
        ctx.fill();
    }

    drawTulip(size) {

        ctx.fillStyle = `hsl(${this.hue},70%,60%)`;

        for (let i = 0; i < 3; i++) {

            ctx.rotate(Math.PI * 2 / 3);

            ctx.beginPath();

            ctx.ellipse(
                0,
                -size * 2,
                size,
                size * 2,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    }

    drawRose(size) {

        for (let layer = 0; layer < 3; layer++) {

            this.drawPetalLayer(
                6 + layer * 4,
                size * (1 + layer * 0.5),
                size * 0.7,
                size * 1.8,
                `hsl(${this.hue},70%,60%)`
            );
        }
    }

    drawLotus(size) {

        this.drawPetalLayer(
            12,
            size * 2,
            size * 0.8,
            size * 2.5,
            "#ce93d8"
        );
    }

    draw() {

        const time = Date.now() * 0.002;

        const wind =
            Math.sin(time + this.windSeed) * 5;

        const tipX =
            this.x +
            this.curve * (this.height / this.maxHeight) +
            wind;

        const tipY =
            this.y -
            this.height;

        this.drawStem(tipX, tipY, wind);

        if (this.height >= this.maxHeight) {

            ctx.save();

            ctx.translate(tipX, tipY);

            ctx.rotate(wind * 0.03);

            ctx.scale(this.bloom, this.bloom);

            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(255,255,255,0.4)";

            if (this.type === "daisy") this.drawDaisy(this.size);
            if (this.type === "sakura") this.drawSakura(this.size);
            if (this.type === "sunflower") this.drawSunflower(this.size);
            if (this.type === "cosmos") this.drawCosmos(this.size);
            if (this.type === "tulip") this.drawTulip(this.size);
            if (this.type === "rose") this.drawRose(this.size);
            if (this.type === "lotus") this.drawLotus(this.size);

            ctx.restore();
        }
    }
}


// click create flower
canvas.addEventListener("click", e => {

    flowers.push(
        new Flower(e.clientX, e.clientY)
    );

});


// animation loop
function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    flowers.forEach(f => f.update());

    requestAnimationFrame(animate);
}

animate();

