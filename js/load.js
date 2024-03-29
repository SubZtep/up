var load_state = {

    preload: function() {
        this.game.load.image('sky', 'assets/sky.png');
        this.game.load.image('ground', 'assets/platform.png');
        this.game.load.image('star', 'assets/star.png');
        this.game.load.image('firstaid', 'assets/firstaid.png');
        this.game.load.image('diamond', 'assets/diamond.png');
        this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
    },

    create: function() {
        this.game.state.start('play');
    }
};
