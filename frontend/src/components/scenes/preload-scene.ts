import { BATTLE_ASSET_KEYS, BATTLE_BACKGROUND_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS } from '../assets/asset-keys.ts';
import Phaser from '../lib/phaser.ts'
import { SCENE_KEYS } from './scene-keys.ts';

export class PreloadScene extends Phaser.Scene {

    public arcanine: any;
    constructor()
    {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
        });
        console.log(SCENE_KEYS.PRELOAD_SCENE);
    }

    

    //preload assets
    preload() {
       
        //need to implement new paths

        //battle background
        this.load.image(
            BATTLE_BACKGROUND_ASSET_KEYS.FOREST,
            `path`
        );

        //battle assets
        this.load.image(
            BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,
            `path`
        );

        //health bar assets
        this.load.image(
            HEALTH_BAR_ASSET_KEYS.RIGHT_CAP,
            `path`
        );

        this.load.image(
            HEALTH_BAR_ASSET_KEYS.MIDDLE,
            `path`
        );

        this.load.image(
            HEALTH_BAR_ASSET_KEYS.LEFT_CAP,
            `path`
        );



        //sprite anims related stuff
        const pokemonArray = ['Arcanine', 'Gengar'];

        pokemonArray.forEach((pokemon)=>{
            this.load.atlas(`path`);

            this.load.atlas(`path`);
            
        })
       

        


        
    }
    
    
    create() {
        // console.log('create')
        
        this.scene.start(SCENE_KEYS.BATTLE_SCENE)
    }

}