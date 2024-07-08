
import Phaser from './lib/phaser.ts'



const game = new Phaser.Game({
    type: Phaser.CANVAS,
    pixelArt: false,
    scale: {
        width: 1024,
        height: 576,
        parent: 'game-container',
        //fit and center both make sure the canvas fits properly no matter device size
        mode: Phaser.Scale.FIT, 
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#000000',

    
});

console.log(game)

