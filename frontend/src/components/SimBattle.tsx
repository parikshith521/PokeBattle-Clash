import { BATTLE_ASSET_KEYS, BATTLE_BACKGROUND_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS } from './assets/asset-keys.ts';
import { SCENE_KEYS } from './scenes/scene-keys';
import {Scene} from 'phaser';
import {useState, useEffect, useRef} from 'react';

import {Game as GameType} from 'phaser'

const SimBattle = (prop: any) => {


        let cnt = 0;

        const gameRef = useRef<GameType | null>(null);
        // useEffect(()=>{

        // },[hp])

        class BattleScene extends Scene {

            //'!' to guarantee that value will be assigned before accesss
            public playerHealth!: Phaser.GameObjects.Text;
            public playerHealthBarLeft!: Phaser.GameObjects.Image;
            public playerHealthBar!: Phaser.GameObjects.Image;
            public playerHealthBarRight!: Phaser.GameObjects.Image;
            public playerPokemon!: Phaser.GameObjects.Image;
            public playerInfoBox!: Phaser.GameObjects.Container;

            public playerPokemonSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

            public playerPokemonName: any;
            public oppPokemonName: any;

            public oppHealth!: Phaser.GameObjects.Text;
            public oppHealthBarLeft!: Phaser.GameObjects.Image;
            public oppHealthBar!: Phaser.GameObjects.Image;
            public oppHealthBarRight!: Phaser.GameObjects.Image;
            public oppPokemon!: Phaser.GameObjects.Image;
            public oppInfoBox!: Phaser.GameObjects.Container;

            public oppPokemonSprite!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

            public updateStatePlayer: any;
            public updateStateOpp: any;

            public updatePlayerAnim: any;
            public updateOppAnim: any;

            public playerPokemonHP: number;
            public oppPokemonHP: number;

            constructor()
            {
                super({
                    key: SCENE_KEYS.BATTLE_SCENE
                });
                this.playerPokemonName = prop.myPokeName;
                this.oppPokemonName = prop.oppPokeName;
                this.playerPokemonHP = -1;
                this.oppPokemonHP = -1;
                
            }


             preload() 
            {
                 //sprite anims related stuff
                 console.log("THIS PRELOAD CALLED");
                // this.load.atlas('arcanine', 'assets/ArcanineSS.png','assets/ArcanineSprites.json');
            }

            create() {
                // console.log('create')
                //create main background


                this.updatePlayerAnim = (myPokeName: string) => {
                    console.log("PLAYER ANIM UPDATE CALLED");
                    // console.log(this.playerPokemonSprite);
                    console.log(myPokeName);
                    if(myPokeName) {
                        console.log("PLAYER ANIM UPDATE IF RAN");
                        this.playerPokemonSprite = this.physics.add.sprite(256,416, myPokeName + 'Back')
                        this.playerPokemonSprite.setScale(2)
                        this.playerPokemonSprite.visible = true;
                        
                        this.playerPokemonSprite.anims.play(myPokeName + 'Back',true);

                        this.playerPokemonName.setText(myPokeName);
                        

                    }
                    else {
                        console.log("PLAYER ANIM UPDATE ELSE RAN");
                       
                    }
                    
                }

                this.updateOppAnim = (oppPokeName: string) => {
                   
                    console.log("OPP ANIM UPDATE CALLED");
                    if(oppPokeName) {
                        console.log("OPP ANIM UPDATE IF RAN");
                        this.oppPokemonSprite = this.physics.add.sprite(768,244, oppPokeName)
                        this.oppPokemonSprite.setScale(2)
                        this.oppPokemonSprite.visible = true;
                        
                        this.oppPokemonSprite.anims.play(oppPokeName,true);
                        this.oppPokemonName.setText(oppPokeName);
                    }
                    else {
                        console.log("OPP ANIM UPDATE ELSE RAN");
                    }
                  
                }
                

                this.updateStatePlayer = (newHp: number) => {
                   if(this.playerPokemonSprite) this.playerPokemonSprite.visible = true;
                    // this.playerPokemon.visible = true;
                    this.playerHealth.visible = true;
                    this.playerHealthBar.visible = true;
                    this.playerHealthBarLeft.visible = true;
                    this.playerHealthBarRight.visible = true;
                    this.playerInfoBox.visible = true;
                    console.log("PLAYER FUNCTION RAN");
                    this.playerHealth.setText(`${newHp}/HP`)
                    if(newHp>0){
                        if(this.playerPokemonHP == -1) {
                            this.playerHealthBar.displayWidth = 360;
                            this.playerPokemonHP = newHp;
                        }
                        else {
                            this.playerHealthBar.displayWidth = (360*newHp)/this.playerPokemonHP;
                        }
                        this.playerHealthBarRight.x = this.playerHealthBar.x+ this.playerHealthBar.displayWidth;
                        console.log(this.playerHealthBar.displayWidth);
                    }
                    else {
                        this.playerHealthBarLeft.visible = false;
                        this.playerHealthBarRight.visible = false;
                        this.playerHealthBar.visible = false;
                    }
                }

                this.updateStateOpp = (newHp: number) => {
                    if(this.oppPokemonSprite) this.oppPokemonSprite.visible = true;
                    // this.oppPokemon.visible = true;
                    this.oppHealth.visible = true;
                    this.oppHealthBar.visible = true;
                    this.oppHealthBarLeft.visible = true;
                    this.oppHealthBarRight.visible = true;
                    this.oppInfoBox.visible = true;
                    console.log("OPP FUNCTION RAN");
                    this.oppHealth.setText(`${newHp}/HP`)
                    if(newHp>0) {
                        if(this.oppPokemonHP == -1 ) {
                            this.oppHealthBar.displayWidth = 360;
                            this.oppPokemonHP = newHp;
                        }
                        else {
                            this.oppHealthBar.displayWidth = (360*newHp)/this.oppPokemonHP;
                        }
                        this.oppHealthBarRight.x = this.oppHealthBar.x+ this.oppHealthBar.displayWidth;
                        console.log(this.oppHealthBar.displayWidth);
                    }
                    else {
                        this.oppHealthBarLeft.visible = false;
                        this.oppHealthBarRight.visible = false;
                        this.oppHealthBar.visible = false;
                    }
                }

                    //background
                this.add.image(0,0,BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setOrigin(0);
        
                //render out pokemons
                // this.oppPokemon = this.add.image(768,144, MONSTER_ASSET_KEYS.CARNODUSK,0);
                // this.oppPokemon.visible = false;
                // this.playerPokemon = this.add.image(256,316,MONSTER_ASSET_KEYS.IGUANIGNITE,0).setFlipX(true);
                // this.playerPokemon.visible = false;

                //render out spirtes
                const myPokeName = prop.myPokeName;
                const oppPokeName = prop.oppPokeName;

                //arcanine => 51, arcanineback => 51
                //gengar => 39, gengarback => 43

                const ptrs = {
                    "Arcanine": 51,
                    "ArcanineBack": 51,
                    "Gengar": 39,
                    "GengarBack": 43
                }

                console.log("INFOS HERE!!!!!!!!!!!!!!!!!!!: ");
                console.log(myPokeName); console.log(oppPokeName);

                //arcanine

                this.anims.create({key: `Arcanine`, frames: this.anims.generateFrameNames(`Arcanine`,{prefix: 'sprite', end:51, zeroPad: 2}),repeat: -1});

                this.anims.create({key: `ArcanineBack`, frames: this.anims.generateFrameNames(`ArcanineBack`,{prefix: 'sprite', end:51, zeroPad: 2}),repeat: -1});

                //gengar

                this.anims.create({key: `Gengar`, frames: this.anims.generateFrameNames(`Gengar`,{prefix: 'sprite', end:39, zeroPad: 2}),repeat: -1});

                this.anims.create({key: `GengarBack`, frames: this.anims.generateFrameNames(`GengarBack`,{prefix: 'sprite', end:43, zeroPad: 2}),repeat: -1});

                

                // this.playerPokemonSprite = this.physics.add.sprite(256,416, 'ArcanineBack')
                // this.playerPokemonSprite.setScale(1.5)
                // this.playerPokemonSprite.visible = false;

               

                // this.oppPokemonSprite = this.physics.add.sprite(768,244,'Arcanine');
                // this.oppPokemonSprite.setScale(1.5)
                // this.oppPokemonSprite.visible = false;
            
                //render player health bar



                this.playerPokemonName = this.add.text(30,20,'Pokemon',{
                    color: '#7E3D3F',
                    fontSize: '32px'
                });

                this.playerHealth = this.add.text(443,80,`${prop.hp}/HP`,{
                    color: '#7E3D3F',
                    fontSize: '16px'
                }).setOrigin(1,0)

                this.playerInfoBox = this.add.container(526,368,[
                    this.add.image(0,0,BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0),
                    this.playerPokemonName,
                    this.#createHealthPlayer(34,34),
                    // this.add.text(this.playerPokemonName.width + 35,23,'L5',{
                    //     color: '#ED474B',
                    //     fontSize: '28px'
                    // }),
                    this.add.text(30,55,'HP',{
                        color: '#FF6505',
                        fontSize: '24px',
                         fontStyle: 'italic'
                    }),
                    this.playerHealth

                ]);
                this.playerInfoBox.visible = false;

                //render opp health bar
               this.oppPokemonName = this.add.text(30,20,'Pokemon',{
                    color: '#7E3D3F',
                    fontSize: '32px'
                });

                this.oppHealth = this.add.text(443,80,'25/25',{
                    color: '#7E3D3F',
                    fontSize: '16px'
                }).setOrigin(1,0)


               this.oppInfoBox =  this.add.container(30,50,[
                    this.add.image(0,0,BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0),
                this.oppPokemonName,
                    this.#createHealthOpp(34,34),
                    // this.add.text(this.oppPokemonName.width + 35,23,'L5',{
                    //     color: '#ED474B',
                    //     fontSize: '28px'
                    // }),
                    this.add.text(30,55,'HP',{
                        color: '#FF6505',
                        fontSize: '24px',
                        fontStyle: 'italic'
                    }),
                    this.oppHealth

                ]);
                this.oppInfoBox.visible = false;

                //srpite related stuff
                // this.anims.create({key: 'sprite', frames: this.anims.generateFrameNames('arcanine',{prefix: 'sprite', end:51, zeroPad: 2}),repeat: -1});

                // this.arcanine = this.physics.add.sprite(100,200, 'arcanine');



            }

            #createHealthPlayer(x: number, y: number) {
                const scaleY = 0.7;

                this.playerHealthBarLeft = this.add.image(x,y, HEALTH_BAR_ASSET_KEYS.LEFT_CAP).setOrigin(0,0.5).setScale(1,scaleY);
                this.playerHealthBar = this.add.image(this.playerHealthBarLeft.x + this.playerHealthBarLeft.width,y, HEALTH_BAR_ASSET_KEYS.MIDDLE).setOrigin(0,0.5).setScale(1,scaleY);
                this.playerHealthBar.displayWidth = 360;
                this.playerHealthBarRight = this.add.image(this.playerHealthBar.x+ this.playerHealthBar.displayWidth,y, HEALTH_BAR_ASSET_KEYS.RIGHT_CAP).setOrigin(0,0.5).setScale(1,scaleY);
                console.log("LEFT CAP WIDTH: ", this.playerHealthBar.width)
                return this.add.container(x,y,[this.playerHealthBarLeft,this.playerHealthBar,this.playerHealthBarRight])
            }

            #createHealthOpp(x: number, y: number) {
                const scaleY = 0.7;

                this.oppHealthBarLeft = this.add.image(x,y, HEALTH_BAR_ASSET_KEYS.LEFT_CAP).setOrigin(0,0.5).setScale(1,scaleY);
                this.oppHealthBar = this.add.image(this.oppHealthBarLeft.x + this.oppHealthBarLeft.width,y, HEALTH_BAR_ASSET_KEYS.MIDDLE).setOrigin(0,0.5).setScale(1,scaleY);
                this.oppHealthBar.displayWidth = 360;
                this.oppHealthBarRight = this.add.image(this.oppHealthBar.x+ this.oppHealthBar.displayWidth,y, HEALTH_BAR_ASSET_KEYS.RIGHT_CAP).setOrigin(0,0.5).setScale(1,scaleY);
                console.log("LEFT CAP WIDTH: ", this.oppHealthBarLeft.width)
                return this.add.container(x,y,[this.oppHealthBarLeft,this.oppHealthBar,this.oppHealthBarRight])


            }

            update() {
                console.log('battle scene udpate')
                
            
            }


        }


    // const [game,setGame] = useState<GameType>();

    useEffect(()=>{

        async function initPhaser() {

            const Phaser = await import('phaser');
            const {PreloadScene} = await import('./scenes/preload-scene.ts');
            // const {BattleScene} = await import('./scenes/battle-scene.ts');
            
            const phaserGame = new Phaser.Game({
                type: Phaser.CANVAS,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: {x: 0, y:0},
                        debug: false
                    }
                },  
                title: 'some-game-title',
                scale: {
                    parent: 'game-container',
                    width: 1024,
                    height: 576,
                    mode: Phaser.Scale.FIT, 
                    autoCenter: Phaser.Scale.CENTER_BOTH
                },
                backgroundColor: '#000000'
            });

            gameRef.current = phaserGame;
            //setGame(phaserGame);

            phaserGame.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
            phaserGame.scene.add(SCENE_KEYS.BATTLE_SCENE, BattleScene);
            phaserGame.scene.start(SCENE_KEYS.PRELOAD_SCENE)
        }

        initPhaser();

        return () => {
            if(gameRef.current) gameRef.current.destroy(true);
          };

    },[]);

    useEffect(()=>{
        if(gameRef.current) {
            const batScene = gameRef.current.scene.getScene(SCENE_KEYS.BATTLE_SCENE) as BattleScene;
            if(batScene){
                batScene.updateStatePlayer(prop.hp);
            }
        }
    },[prop.hp])

    useEffect(()=>{
        if(gameRef.current) {
            const batScene = gameRef.current.scene.getScene(SCENE_KEYS.BATTLE_SCENE) as BattleScene;
            if(batScene){
                batScene.updateStateOpp(prop.opphp);
            }
        }

    },[prop.opphp])

    useEffect(()=>{
        console.log("WOAH MY POKE NAME CHANGED");
        console.log(prop.myPokeName);
        if(gameRef.current) {
            const batScene = gameRef.current.scene.getScene(SCENE_KEYS.BATTLE_SCENE) as BattleScene;
            if(batScene){
                batScene.updatePlayerAnim(prop.myPokeName);
            }
        }

    },[prop.myPokeName]);

    useEffect(()=>{
        console.log("WOAH OPP POKE NAME CHANGED");
        console.log(prop.oppPokeName);
        if(gameRef.current) {
            const batScene = gameRef.current.scene.getScene(SCENE_KEYS.BATTLE_SCENE) as BattleScene;
            if(batScene){
                batScene.updateOppAnim(prop.oppPokeName);
            }
        }

    },[prop.oppPokeName])

    return ( 
        <>
        
        <div className="overflow-hidden h-[100%] w-[100%] m-0" id="game-container" key="game-container">
        {                   }
        </div>

        <div>

        </div>
        </>
     );
}
 
export default SimBattle;