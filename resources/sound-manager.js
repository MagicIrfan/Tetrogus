class SoundManager {

    static soundManager = new SoundManager();

    constructor() {
        this.sounds = new Map();
        this.context = this.context = new AudioContext();
        this.globalGain = this.context.createGain();
        this.globalGain.connect(this.context.destination);
    }

    static Load(src) {
        return new Promise((resolve) => {
            fetch(src, {mode: "cors"})
                .then( resp => {
                    return resp.arrayBuffer();
                })
                .then( buffer => {
                    return this.soundManager.context.decodeAudioData(buffer);
                })
                .then( buffer => {
                    this.soundManager.sounds.set(src, buffer);
                    resolve(buffer);
                });
        });
    }

    static CreateBufferSource(src) {
        let node = this.soundManager.context.createBufferSource();
        node.buffer = this.soundManager.sounds.get(src);
        return node;
    }

    static CreateGain() {
        return this.soundManager.context.createGain();
    }

    static GetDestination() {
        return this.soundManager.globalGain;
    }

    static SetGlobalVolume(volume) {
        this.soundManager.globalGain.gain.value = volume;
    }

}

export { SoundManager };
