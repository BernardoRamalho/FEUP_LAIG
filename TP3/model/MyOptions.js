class MyOptions {
    constructor(scene){
        this.scene = scene;

        this.buttons=[
            new MyButton(scene, 'undo'),
            new MyButton(scene, 'pass'),
            new MyButton(scene, 'play'),
            new MyButton(scene, 'scene')
        ];

        this.initMaterial();
    }

    initMaterial() {
        //Button Material
        this.buttonMaterial = new CGFappearance(this.scene);
        this.buttonMaterial.setAmbient(0.718 , 0.563, 0.511, 0.7 );
        this.buttonMaterial.setDiffuse(0.718 , 0.563, 0.511, 0.7 );
        this.buttonMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.buttonMaterial.setShininess(10.0);

    }

    display(){
        this.buttonMaterial.apply();

        this.scene.pushMatrix();
        this.scene.translate(0, 8, 0);

        this.scene.registerForPick(65, this.buttons[0]);
        this.scene.pushMatrix();
        this.scene.translate(-8.7, 0, 5);
        this.buttons[0].display();
        this.scene.popMatrix();

        this.scene.registerForPick(66, this.buttons[1]);
        this.scene.pushMatrix();
        this.scene.translate(8.7, 0, 5);
        this.buttons[1].display();
        this.scene.popMatrix();

        this.scene.registerForPick(67, this.buttons[2]);
        this.scene.pushMatrix();
        this.scene.translate(8.7, 0, -5);
        this.buttons[2].display();
        this.scene.popMatrix();

        this.scene.registerForPick(68, this.buttons[3]);
        this.scene.pushMatrix();
        this.scene.translate(-8.7, 0, -5);
        this.buttons[3].display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}