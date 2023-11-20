///Configuración de la ventana.
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const pressedKeys = {
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false
}

var time = 0;
var dificultSetter = 0;

///Clases (Naves, malos y balas).
class ship {
    constructor(x, y, vel, size, color){
        this.x = x;
        this.y = y;
        this.vel = vel;

        this.cooldown = 0;
        this.beams = [];
        this.score = 0;
        this.life = 3;

        this.size = size;
        this.color = color;
    }

    update(){
        this.cooldown++;
        if(pressedKeys.up && this.y > 30){
            this.y -= this.vel;
        }
        if(pressedKeys.left && this.x > 30){
            this.x -= this.vel;
        }
        if(pressedKeys.down && this.y < innerHeight - 30){
            this.y += this.vel;
        }
        if(pressedKeys.right && this.x < innerWidth - 30){
            this.x += this.vel;
        }
        if(pressedKeys.shoot && this.cooldown >= 10){
            player1.beams.push(new beam(this.x, this.y, 15, 10, "yellow"));
            this.cooldown = 0;
        }

        this.draw();
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class beam{
    constructor(x, y, vel, size, color){
        this.x = x;
        this.y = y;
        this.vel = vel;

        this.size = size;
        this.color = color;
    }

    update(){
        this.x += this.vel;
        this.draw();
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class enemy{
    constructor(x, y, vel, size, color){
        this.x = x;
        this.y = y;
        this.vel = vel;

        this.size = size;
        this.color = color; 
    }

    update(){
        this.x -= this.vel;
        this.draw();
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

///Configuración de botones.

addEventListener("keydown", (evt) => {
    const key = evt.key.toLowerCase();
    switch(key){
        case "w":
            pressedKeys.up = true;
            break;
        case "a":
            pressedKeys.left = true;
            break;
        case "s":
            pressedKeys.down = true;
            break;
        case "d":
            pressedKeys.right = true;
            break;
        case " ":
            pressedKeys.shoot = true;
            break;
    }
})

addEventListener("keyup", (evt) => {
    const key = evt.key.toLowerCase();
    switch(key){
        case "w":
            pressedKeys.up = false;
            break;
        case "a":
            pressedKeys.left = false;
            break;
        case "s":
            pressedKeys.down = false;
            break;
        case "d":
            pressedKeys.right = false;
            break;
        case " ":
            pressedKeys.shoot = false;
            break;
    }
})

///Actores.
const enemies = [];
const player1 = new ship(innerWidth/4, innerHeight/2, 9, 30, "blue");

///Bucle principal.

function animate(){
    requestAnimationFrame(animate);

    if(player1.life <= 0) return;

    ctx.beginPath();
    ctx.rect(0,0, innerWidth, innerHeight);
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fill();

    ctx.font = "30px comicSans";
    ctx.fillStyle = "white";
    ctx.fillText(`SCORE: ${player1.score}`, 0, 30);
    ctx.fillText(`LIFE: `, innerWidth - 300, 30);

    ctx.beginPath();
    ctx.rect(innerWidth - 225, 5, 30 * player1.life, 27);
    ctx.fillStyle = "red";
    ctx.fill();

    player1.update();

    player1.beams.forEach((value, index) => {
        value.update();
        if(value.x > innerWidth) player1.beams.splice(index, 1);
    })

    if(time <= 75 - ((Math.floor(dificultSetter/5) + 1) * 5)){
        time++;
    }else{
        enemies.push(new enemy(innerWidth, (Math.random() * (innerHeight - 60)) + 30, 9, 30, "purple"));
        time = 0;
    }

    enemies.forEach((valueE, indexE) => {
        valueE.update();
        if(valueE.x < 0){
            enemies.splice(indexE, 1);
        }

        player1.beams.forEach((valueB, indexB) => {
            const d = Math.hypot(valueB.x - valueE.x, valueB.y - valueE.y);
            if(d < valueB.size + valueE.size){
                player1.beams.splice(indexB, 1);
                enemies.splice(indexE, 1);
                player1.score++;
                if(dificultSetter < 60) dificultSetter++;
            }
        })

        const d = Math.hypot(valueE.x - player1.x, valueE.y - player1.y);
        if(d < valueE.size + player1.size){
            enemies.splice(indexE, 1);
            player1.life--;
            player1.score++; 
        }
    })
}

animate();