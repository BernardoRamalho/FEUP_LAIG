/**
 * MySpriteText
 * @constructor
 */

class MySpriteText extends CGFobject{
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.spriteRectangle = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5, 1, 1); // Rectangle to be used to write the letters on
        
        // Create the spritesheet that hold the letters
        this.spriteSheet = new MySpriteSheet(this.scene);   
        this.spriteSheet.addSizeM(16);
        this.spriteSheet.addSizeN(16);
        this.spriteSheet.addTexture(new CGFtexture(this.scene, './scenes/Font/Berlinfont.png'), this.scene);
    }

    addText(string){
        this.string = string;
    }

    display(){
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.depthMask(false);

        this.scene.setActiveShader(this.spriteSheet.shader);
        this.spriteSheet.appearance.apply();

        // Loop thourgh the letters
        for (let i = 0; i < this.string.length; i++){
            this.scene.pushMatrix();

            this.scene.translate(i,0,0); // Translate the letter in order to make them appear in a line

            this.spriteSheet.activateCellP(this.string[i].charCodeAt(0)); // Set the correct active cell

            this.spriteRectangle.display(); // Display the rectangle in which the letter will appear

            this.scene.popMatrix();
        }

        this.scene.defaultAppearance.apply();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.gl.depthMask(true);
        this.scene.gl.disable(this.scene.gl.BLEND);
    }
}