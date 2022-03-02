class MySpriteSheet{
    constructor(scene) {
        this.scene = scene;
        this.shader = new CGFshader(scene.gl, 'shaders/sprite.vert', 'shaders/sprite.frag')
    }

    addSizeM(sizeM){
        this.sizeM = sizeM;
    }

    addSizeN(sizeN){
        this.sizeN = sizeN;
    }

    addTexture(texture, scene){
        this.texture = texture;

        // Create sprite sheet appearence
        this.appearance = new CGFappearance(scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);

        // Save the texture in the appearance
        this.appearance.setTexture(this.texture);
    }

    activateCellMN(m, n){
        this.shader.setUniformsValues({x : m, y : n, maxX : this.sizeM, maxY : this.sizeN});
    }

    activateCellP(p){
        let m = p % this.sizeM;
        let n = Math.floor(p / this.sizeM);

        this.shader.setUniformsValues({x : m, y : n, maxX : this.sizeM, maxY : this.sizeN});
    }
}