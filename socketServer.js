import { Server } from "socket.io";

const players = [];
const enemies = [];

var time = 0;
var dificultSetter = 0;

const widthScreen = 1280;
const heightScreen = 720;

///Clases (Naves, malos y balas).
class ship {
  constructor(id, x, y, vel, size, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vel = vel;

    this.cooldown = 0;
    this.beams = [];
    this.score = 0;
    this.life = 3;

    this.size = size;
    this.color = color;
    this.pressedKeys = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false,
    };
  }

  update() {
    this.cooldown++;
    if (this.pressedKeys.up && this.y > 30) {
      this.y -= this.vel;
    }
    if (this.pressedKeys.left && this.x > 30) {
      this.x -= this.vel;
    }
    if (this.pressedKeys.down && this.y < heightScreen - 30) {
      this.y += this.vel;
    }
    if (this.pressedKeys.right && this.x < widthScreen - 30) {
      this.x += this.vel;
    }
    if (this.pressedKeys.shoot && this.cooldown >= 30) {
      this.beams.push(new beam(this.x, this.y, 6, 10, "yellow"));
      this.cooldown = 0;
    }
  }
}

class beam {
  constructor(x, y, vel, size, color) {
    this.x = x;
    this.y = y;
    this.vel = vel;

    this.size = size;
    this.color = color;
  }

  update() {
    this.x += this.vel;
  }
}

class enemy {
  constructor(x, y, vel, size, color) {
    this.x = x;
    this.y = y;
    this.vel = vel;

    this.size = size;
    this.color = color;
  }

  update() {
    this.x -= this.vel;
  }
}

export const socketEmitter = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("Sombody has connected");

    players.push(new ship(socket.id, 30, 90, 1, 30, "purple"));

    setInterval(() => {
      if (time <= 75 - (Math.floor(dificultSetter / 5) + 1) * 5) {
        time++;
      } else {
        enemies.push(
          new enemy(
            1750,
            Math.random() * (heightScreen - 60) + 30,
            9,
            30,
            "purple"
          )
        );
        time = 0;
      }

      enemies.forEach((valueE, indexE) => {
        if (valueE.x < 0) {
          enemies.splice(indexE, 1);
        }

        players.forEach((player) => {
          player.update();

          player.beams.forEach((value, index) => {
            value.update();
            if (value.x > 1280) player.beams.splice(index, 1);
          });

          player.beams.forEach((valueB, indexB) => {
            const d = Math.hypot(valueB.x - valueE.x, valueB.y - valueE.y);
            if (d < valueB.size + valueE.size) {
              player.beams.splice(indexB, 1);
              enemies.splice(indexE, 1);
              player.score++;
              if (dificultSetter < 60) dificultSetter++;
            }
          });

          const d = Math.hypot(valueE.x - player.x, valueE.y - player.y);
          if (d < valueE.size + player.size) {
            enemies.splice(indexE, 1);
            player.life--;
            player.score++;
          }
        });
      });

      io.emit("update", { players, enemies });

      if (players.length <= 0) return;
    }, 15);

    socket.on("disconnect", () => {
      console.log("User Disconnected");
      players.forEach((player, index) => {
        if (player.id == socket.id) players.splice(index, 1);
        console.log(players);
      });
    });

    socket.on("updateKeyboard", (object) => {
      players.forEach((element) => {
        if (element.id == socket.id) {
          element.pressedKeys = object.pressedKeys;
        }
      });
    });
  });
};
