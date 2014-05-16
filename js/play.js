var PLAYER_VELOCITY = 200,
    PLAYER_JUMP_VELOCITY = 700,
    PLAYER_BOUNCE = 0.2,
    PLAYER_GRAVITY = 1500,
    GROUND_VELOCITY = 30,
    ENEMY_VELOCITY = 200,
    grounds,
    player,
    enemy,
    cursors,
    healthText,
    invulnerable = 0,
    hitTimer = 0,
    groundTimer,
    nextGroundStyle = 0;

var play_state = {

    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create scene
        game.add.sprite(0, 0, 'sky');

        grounds = game.add.group();
        grounds.enableBody = true;
        //grounds.createMultiple(20, 'ground');
        groundTimer = this.game.time.events.loop(5000, this.addGrounds, this);


        // Add player
        this.createPlayer();

        // Add enemy
        this.createEnemy();
        //this.game.time.events.loop(8000, this.createEnemy, this);

        // Control
        cursors = game.input.keyboard.createCursorKeys();

        // Text
        healthText = game.add.text(8, 8, '', { fontSize: '16px', fill: '#000' });
        this.updateHealthText();

    },

    addGrounds: function() {
        console.log('new ground', nextGroundStyle);
        var ground;

        if (nextGroundStyle == 0) {
            console.log('yolo');
            ground = grounds.create(120, 0, 'ground');
            ground.scale.setTo(1.7, 1);
            nextGroundStyle = 1;
        } else if (nextGroundStyle == 1) {
            ground = grounds.create(0, 0, 'ground');

            ground.scale.setTo(1, 1);
            nextGroundStyle = 0;
        }

        ground.body.immovable = true;
        ground.body.velocity.y = GROUND_VELOCITY;

    },

    createPlayer: function() {
        player = game.add.sprite(32, game.world.height - 350, 'dude');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.bounce.y = PLAYER_BOUNCE;
        player.body.gravity.y = PLAYER_GRAVITY;
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        player.health = 100;
    },

    createEnemy: function() {
        console.log('create enemy');
        enemy = game.add.sprite(0, 0, 'baddie');
        game.physics.arcade.enable(enemy);
        enemy.body.collideWorldBounds = true;
        enemy.body.bounce.y = 0.1;
        enemy.body.gravity.y = 450;
        enemy.body.velocity.x = 240;
        enemy.animations.add('left', [0, 1], 10, true);
        enemy.animations.add('right', [2, 3], 10, true);
        enemy.animations.play('right');
    },

    // UPDATE
    update: function() {
        // Collides
        game.physics.arcade.collide(player, grounds);
        game.physics.arcade.collide(enemy, grounds);
        game.physics.arcade.overlap(enemy, player, this.enemyHit, null, this);

        // Player moves
        this.playerMoves();

        // enemy hit the wall
        this.enemyMoves();

        // blink after damage
        if (invulnerable > 0) {
            hitTimer += game.time.elapsed;
            if (hitTimer >= 50) {
                hitTimer -= 50;
                player.visible = ! player.visible;
                invulnerable--;
            }
        }
    },

    playerMoves: function() {
                ///console.log('go UP');
        player.body.velocity.x = 0;
        if (cursors.left.isDown) {
            player.body.velocity.x = -PLAYER_VELOCITY;
            player.animations.play(player.angle == 0 ? 'left' : 'right');
        } else if (cursors.right.isDown) {
            player.body.velocity.x = PLAYER_VELOCITY;
            player.animations.play(player.angle == 0 ? 'right' : 'left');
        } else {
            player.animations.stop();
            player.frame = 4;
        }

        // J.U.M.P.
        if (cursors.up.isDown) { //  && player.body.touching.down) {
            console.log('UP');
            //TODO: if space is down, lower jump
            if (cursors.down.isDown) { // vmi nem jo
                player.body.velocity.y = -PLAYER_JUMP_VELOCITY / 2;
            } else {
                player.body.velocity.y = -PLAYER_JUMP_VELOCITY;
            }
        }
    },

    enemyMoves: function() {
        if (enemy.body.velocity.x == 0) {
            if (enemy.animations.currentAnim.name == 'left') {
                enemy.animations.play('right');
                enemy.body.velocity.x = ENEMY_VELOCITY;
            } else {
                enemy.animations.play('left');
                enemy.body.velocity.x = -ENEMY_VELOCITY;
            }
        }
    },

    enemyHit: function() {
        if (invulnerable == 0) {
            player.damage(20);
            this.updateHealthText();
            invulnerable = 10
        }
    },

    updateHealthText: function() {
        healthText.text = 'health: ' + player.health + '%';
    }

}