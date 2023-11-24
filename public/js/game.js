///Configuración de la ventana.
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 720;

var MyPlayer = {};
const pressedKeys = {
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false
}

var myPlayers = [];
var myEnemies = [];

const socket = io();
socket.emit("updateKeyboard", {pressedKeys})

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

    socket.emit("updateKeyboard", {pressedKeys});
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

    socket.emit("updateKeyboard", {pressedKeys});
})

///Dibujar en pantalla.
function draw(object){
    ctx.beginPath();
    ctx.arc(object.x, object.y, object.size, 0, Math.PI * 2, false);
    ctx.fillStyle = object.color;
    ctx.fill();
}

function animate(){
    requestAnimationFrame(animate);
    ctx.beginPath();
    ctx.rect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fill();

    ctx.font = "30px comicSans";
    ctx.fillStyle = "white";
    ctx.fillText(`SCORE: ${MyPlayer.score}`, 0, 30);
    ctx.fillText(`LIFE: `, canvas.width - 300, 30);

    ctx.beginPath();
    ctx.rect(canvas.width - 225, 5, 30 * MyPlayer.life, 27);
    ctx.fillStyle = "red";
    ctx.fill();

    myPlayers.forEach(element => {
        draw(element);
        element.beams.forEach(beam => {
            draw(beam);
        });
    });

    myEnemies.forEach(element => {
        draw(element);
    });

}

animate();

socket.on("update", ({players, enemies}) =>{
    players.forEach(player => {
        if(player.id == socket.id) MyPlayer = player;
    })

    myPlayers = players;
    myEnemies = enemies;
})