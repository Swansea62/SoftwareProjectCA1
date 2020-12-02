let gameScene = new Phaser.Scene("Game");

var bullets;
var lastFired = 0;

gameScene.preload = function () {
  this.load.image("background", "../assets/backgroundMap.png");
  this.load.image("player", "../assets/Player32.gif");
  this.load.image("EndPrize", "../assets/EndPrize.gif");
  this.load.image("obstacle1", "../assets/Rock1.gif");
  this.load.image("obstacle2", "../assets/Rock2.gif");
  this.load.image("fireLeft", "../assets/FireballLeft.gif");
  this.load.image("fireRight", "../assets/FireballRight.gif");
  this.load.image("enemy", "../assets/Monster64.gif");
};

gameScene.init = function () {
  this.playerSpeed = 1.25;
  this.EndPrizeMaxY = 280;
  this.EndPrizeMinY = 80;
  this.enemyMaxX = 550;
  this.enemyMinX = 200;
};

gameScene.create = function () {
  
  //This sets the background
  this.bg = this.add.sprite(0, 0, "background");

  //This sets the
  this.bg.setOrigin(0, 0);

  //This adds the player sprite
  this.player = this.add.sprite(90, 70, "player");

  //Player scale
  this.player.setScale(0.7);

  var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'fireRight');

        this.speed = Phaser.Math.GetSpeed(400, 1);
    },

    fire: function (x, y)
    {
        this.setPosition(x, y);
        this.setScale(0.4);

        this.setActive(true);
        this.setVisible(true);
    },

    update: function (time, delta)
    {
        this.x += this.speed * delta;

        if (this.x < -50)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

  });

  bullets = this.add.group({
      classType: Bullet,
      runChildUpdate: true
  });

  speed = Phaser.Math.GetSpeed(300, 1);

  //Lines 32 -> 134 is the code for the boundary rocks.
  //Top Map Boundary
  this.obstacle1 = this.add.group({
    key: "obstacle1",
    repeat: 6,
    setXY: {
      x: 10,
      y: 20,
      stepX: 85,
    },
  });

  this.obstacle2 = this.add.group({
    key: "obstacle2",
    repeat: 6,
    setXY: {
      x: 45,
      y: 20,
      stepX: 85,
    },
  });

  //Left Map Boundary
  this.obstacle2 = this.add.group({
    key: "obstacle2",
    repeat: 4,
    setXY: {
      x: 20,
      y: 55,
      stepY: 55,
    },
  });

  this.obstacle1 = this.add.group({
    key: "obstacle1",
    repeat: 4,
    setXY: {
      x: 30,
      y: 75,
      stepY: 55,
    },
  });

  //Right Map Boundary
  this.obstacle1 = this.add.group({
    key: "obstacle1",
    repeat: 5,
    setXY: {
      x: 610,
      y: 10,
      stepY: 60,
    },
  });

  this.obstacle2 = this.add.group({
    key: "obstacle2",
    repeat: 4,
    setXY: {
      x: 610,
      y: 45,
      stepY: 60,
    },
  });

  //Bottom Map Boundary 1
  this.obstacle1 = this.add.group({
    key: "obstacle1",
    repeat: 4,
    setXY: {
      x: -5,
      y: 330,
      stepX: 85,
    },
  });

  this.obstacle2 = this.add.group({
    key: "obstacle2",
    repeat: 4,
    setXY: {
      x: 30,
      y: 330,
      stepX: 85,
    },
  });

  //Bottom Map Boundary 2
  this.obstacle1 = this.add.group({
    key: "obstacle1",
    repeat: 2,
    setXY: {
      x: 420,
      y: 340,
      stepX: 85,
    },
  });

  this.obstacle2 = this.add.group({
    key: "obstacle2",
    repeat: 3,
    setXY: {
      x: 455,
      y: 340,
      stepX: 85,
    },
  });

  //This is the End Prize sprite
  this.EndPrize = this.add.sprite(
    550,
    270,
    "EndPrize"
  );
  this.EndPrize.setScale(0.7);

  //This is the group of enemies
  this.enemies = this.add.group({
    key: "enemy",
    repeat: 1,
    setXY: {
      x: 600,
      y: 80,
      stepY: 110,
    },
  });

  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.3, -0.3);

  Phaser.Actions.Call(
    this.enemies.getChildren(),
    function (enemy) {
      enemy.speed = Math.random() * 2 + 1;
    },
    this
  );

  Phaser.Geom.Rectangle();

  //This creates the cursor keys
  this.cursors = this.input.keyboard.createCursorKeys();
};

gameScene.update = function (time) {
  //This allows the user to move the player via the arrow keys
  if (this.cursors.left.isDown) {
    this.player.x -= this.playerSpeed;
  } else if (this.cursors.right.isDown) {
    this.player.x += this.playerSpeed;
  } else if (this.cursors.down.isDown) {
    this.player.y += this.playerSpeed;
  } else if (this.cursors.up.isDown) {
    this.player.y -= this.playerSpeed;
  }

  //This is what happens when the player hits the End Prize
  if (
    Phaser.Geom.Intersects.RectangleToRectangle(
      this.player.getBounds(),
      this.EndPrize.getBounds(),
    )
  ) {
    console.log("collision occured");
    this.gameOver(); //This calls on the gameOver function
  }

  let enemies = this.enemies.getChildren();
  let enemies2 = this.enemies.getChildren();
  let numEnemies = enemies.length;

  for (let i = 0; i < numEnemies; i++) {
    // move enemies
    enemies[i].x += enemies[i].speed;

    // reverse movement if reached the edges
    if (enemies[i].x >= this.enemyMaxX && enemies[i].speed > 0) {
      enemies[i].speed *= -1;
    } else if (enemies[i].x <= this.enemyMinX && enemies[i].speed < 0) {
      enemies[i].speed *= -1;
    }

    // 07: enemy collision NEW
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        enemies[i].getBounds()
      )
    ) {
      console.log("collided with the following enemy:", enemies[i]);
      this.gameOver();
      break;
    }
  }

  if (this.cursors.space.isDown && time > lastFired)
    {
        var bullet = bullets.get();

        if (bullet)
        {
            bullet.fire(this.player.x, this.player.y);

            lastFired = time + 250;
        }
    }
};

gameScene.gameOver = function () {
  console.log("Game Over. Start again");
  //This resets the scene
  this.scene.restart();
};

//This is the configuration settings for this game
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
};

let game = new Phaser.Game(config);