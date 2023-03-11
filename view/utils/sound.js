import { SoundManager } from "../../resources/sound-manager.js";

class Sound {

    constructor(src, volume, loop) {
        this.srcNode = SoundManager.CreateBufferSource(src);
        this.gainNode = SoundManager.CreateGain();
        this.setLoop(loop??false);
        this.setVolume(volume??1);
        this.srcNode.connect(this.gainNode);
        this.gainNode.connect(SoundManager.GetDestination());
    }

    setVolume(volume) {
        this.gainNode.gain.value = volume;
    }

    setLoop(loop) {
        this.srcNode.loop = loop;
    }

    play() {
        this.srcNode.start();
    }

    stop() {
        this.srcNode.stop();
    }

}

export { Sound };
