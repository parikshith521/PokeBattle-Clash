import {
  BATTLE_ASSET_KEYS,
  BATTLE_BACKGROUND_ASSET_KEYS,
  HEALTH_BAR_ASSET_KEYS,
} from "../assets/asset-keys.ts";

import { SCENE_KEYS } from "./scene-keys.ts";
import { Scene } from "phaser";

export class PreloadScene extends Scene {
  public arcanine: any;
  constructor() {
    super({
      key: SCENE_KEYS.PRELOAD_SCENE,
    });
    console.log(SCENE_KEYS.PRELOAD_SCENE);
  }

  //preload assets
  preload() {
    const backgroundAssetPath = "assets/images/backgrounds";
    const infoAssetPath = "assets/images/infoBox";

    //battle background
    this.load.image(
      BATTLE_BACKGROUND_ASSET_KEYS.FOREST,
      `${backgroundAssetPath}/battle-backgrounds/battle-background1.jpg`
    );

    //battle assets
    this.load.image(
      BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,
      `${infoAssetPath}/ui-space-expansion/custom-ui.png`
    );

    //health bar assets
    this.load.image(
      HEALTH_BAR_ASSET_KEYS.RIGHT_CAP,
      `${infoAssetPath}/ui-space-expansion/barHorizontal_green_right.png`
    );

    this.load.image(
      HEALTH_BAR_ASSET_KEYS.MIDDLE,
      `${infoAssetPath}/ui-space-expansion/barHorizontal_green_mid.png`
    );

    this.load.image(
      HEALTH_BAR_ASSET_KEYS.LEFT_CAP,
      `${infoAssetPath}/ui-space-expansion/barHorizontal_green_left.png`
    );

    //sprite anims related stuff
    const pokemonArray = ["Arcanine", "Gengar", "Pikachu", "Lucario"];

    pokemonArray.forEach((pokemon) => {
      this.load.atlas(
        `${pokemon}`,
        `assets/images/mysprites/${pokemon}SS.png`,
        `assets/images/mysprites/${pokemon}Sprites.json`
      );

      this.load.atlas(
        `${pokemon}Back`,
        `assets/images/mysprites/${pokemon}BackSS.png`,
        `assets/images/mysprites/${pokemon}BackSprites.json`
      );
    });
  }

  create() {
    this.scene.start(SCENE_KEYS.BATTLE_SCENE);
  }
}
