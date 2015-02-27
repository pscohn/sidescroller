;(function() {
    var Game = function(canvasId) {
        var canvas = document.getElementById(canvasId);
        var screen = canvas.getContext('2d');
        var gameSize = { x: canvas.width, y: canvas.height };

        this.bodies = [new Player(this, gameSize)];
        
        var self = this;
//        loadSound("shoot.wav", function(shootSound) {
//            self.shootSound = shootSound;
            var tick = function() { self.update();
                self.draw(screen, gameSize);
                requestAnimationFrame(tick);
            };

            tick();
//        });
    };

    Game.prototype = {
        update: function() {
            var bodies = this.bodies;
            var notCollidingWithAnything = function(b1) {
                return bodies.filter(function(b2) { return colliding(b1, b2); }).length === 0;
            }
            this.bodies = this.bodies.filter(notCollidingWithAnything);
            for (var i = 0; i < this.bodies.length; i++) {
                this.bodies[i].update();
            }
        },

        draw: function(screen, gameSize) {
            screen.clearRect(0, 0, gameSize.x, gameSize.y);
            for (var i = 0; i < this.bodies.length; i++) {
                drawRect(screen, this.bodies[i]);
            }
        },

        addBody: function(body) {
            this.bodies.push(body);
        },        

    };

    var Player = function(game, gameSize) {
        this.game = game;
        this.size = { x: 15, y: 15 };
        this.neutral = gameSize.y - this.size.x;
        this.center = { x: gameSize.x / 2, y: this.neutral };
        this.keyboarder = new Keyboarder();
    };

    Player.prototype = {
        update: function() {
            if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
                this.center.y -= 20;
//                this.game.shootSound.load();
//                this.game.shootSound.play();
            } else {
                if (this.center.y <= this.neutral) {
                    this.center.y += 4;
                }
            }
        },

    };


    var drawRect = function(screen, body) {
        screen.fillRect(body.center.x - body.size.x / 2,
                        body.center.y - body.size.y / 2,
                        body.size.x, body.size.y);
    };

    var Keyboarder = function() {
        var keyState = {};

        window.onkeydown = function(e) {
            keyState[e.keyCode] = true;
        };

        window.onkeyup = function(e) {
            keyState[e.keyCode] = false;
        };

        this.isDown = function(keyCode) {
            return keyState[keyCode] === true;
        };

        this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32 };
    };

    var colliding = function(b1, b2) {
        return !(b1 === b2 || 
                 b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
                 b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
                 b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
                 b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
    };

//    var loadSound = function(url, callback) {
//        var loaded = function() {
//            callback(sound);
//            sound.removeEventListener('canplaythrough', loaded);
//        };
//        var sound = new Audio(url);
//        sound.addEventListener('canplaythrough', loaded);
//        sound.load(); 
//    };

    window.onload = function() {
        new Game("screen");
    };
})();
