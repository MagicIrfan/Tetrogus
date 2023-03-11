import { App } from "./controller/app.js";
import { ImageManager } from "./resources/image-manager.js";
import { SoundManager } from "./resources/sound-manager.js";
import { Resources } from "./resources/resources.js";

async function loadResources() {
    ImageManager.Load(Resources.Images.CyanBlock);
    ImageManager.Load(Resources.Images.BlueBlock);
    ImageManager.Load(Resources.Images.OrangeBlock);
    ImageManager.Load(Resources.Images.YellowBlock);
    ImageManager.Load(Resources.Images.GreenBlock );
    ImageManager.Load(Resources.Images.PurpleBlock);
    ImageManager.Load(Resources.Images.RedBlock);
    ImageManager.Load(Resources.Images.GrayBlock);
    ImageManager.Load(Resources.Images.Tetrogus);

    await SoundManager.Load(Resources.Sounds.Move);
    await SoundManager.Load(Resources.Sounds.Rotate);
    await SoundManager.Load(Resources.Sounds.Hold);
    await SoundManager.Load(Resources.Sounds.Landing);
    await SoundManager.Load(Resources.Sounds.SoftDrop);
    await SoundManager.Load(Resources.Sounds.HardDrop);
    await SoundManager.Load(Resources.Sounds.Fix);
    await SoundManager.Load(Resources.Sounds.LineClear1);
    await SoundManager.Load(Resources.Sounds.LineClear2);
    await SoundManager.Load(Resources.Sounds.LineClear3);
    await SoundManager.Load(Resources.Sounds.LineClear4);
    await SoundManager.Load(Resources.Sounds.Music);
    await SoundManager.Load(Resources.Sounds.MusicAlt);
    await SoundManager.Load(Resources.Sounds.GameOver);
}

window.onload = async () => {

SoundManager.SetGlobalVolume(1);
await loadResources();

const app = new App();

const newFrame = () => {
    app.update();
    requestAnimationFrame(newFrame);
}

newFrame();

}