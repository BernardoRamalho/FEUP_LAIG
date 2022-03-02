/**
 * MyPiece
 * @constructor
 * @param scene - Reference to MyScene object
 */

class MyPiece extends CGFobject{
    constructor(scene, x, y, z, color){ //scene, 'b2', 4, 3
        super(scene);
        this.scene = scene;
        this.piece = new MyCylinder(scene, 1, 3, 3, 6, 60);

        // Start Coords
        this.xCoord = x;
        this.yCoord = y;
        this.zCoord = z;

        // Coords with Animation
        this.xAnimatedCoord = x;
        this.yAnimatedCoord = y;
        this.zAnimatedCoord = z;

        this.highlighted = false;
        this.color = color;
        this.material = this.initMaterial();
        this.highlightMaterial = this.initHighlight();
        this.animation = null;
    }

    initMaterial() {
        let material = new CGFappearance(this.scene);
        if(this.color === 'b'){
            //White Material
            
            material.setAmbient(0.7 , 0.7 , 0.7 , 0.7 );
            material.setDiffuse(0.7 , 0.7 , 0.7 , 0.7 );
            material.setSpecular(0.1, 0.1, 0.1, 1);
            material.setShininess(10.0);
            return material;
        }else if(this.color === 'p'){
            //Black Material
            material.setAmbient(0, 0, 0, 1);
            material.setDiffuse(0.1, 0.1, 0.1, 1);
            material.setSpecular(0, 0, 0, 1);
            material.setShininess(10.0);
            return material;
        }
    
    }

    initHighlight(){
        let material = new CGFappearance(this.scene);
        //Greenish Material
        material.setAmbient(0, 0.4, 0, 1);
        material.setDiffuse(0.1, 0.1, 0.1, 1);
        material.setSpecular(0, 0, 0, 1);
        material.setShininess(10.0);
        return material;
    }

    highlight(){
        this.highlighted = true;
    }

    noHighlight(){
        this.highlighted = false;
    }

    display(){
        if(!this.highlighted){
            this.material.apply();
        }else{
            this.highlightMaterial.apply();
        }
        
        this.scene.pushMatrix();
       
        this.scene.translate(this.xCoord, this.yCoord, this.zCoord);
        if(this.animation != null){
            this.animation.apply();
        }
        this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
        this.scene.scale(0.25, 0.25, 0.35);
    
        this.piece.display();
        this.scene.popMatrix();
    }

    createMoveAnimation(endPosition){
        // Calculate distance to travel
        let deltaX = endPosition[0] - this.xCoord;
        let deltaY = endPosition[1] - this.yCoord + 0.001;
        let deltaZ = endPosition[2] - this.zCoord;

        // Create Keyframes
        let firstKeyframe = new MyKeyframe(2000);
        let secondKeyframe = new MyKeyframe(4000);

        firstKeyframe.addTranslation([deltaX / 2, deltaY + 1, deltaZ / 2]);
        secondKeyframe.addTranslation([deltaX, deltaY, deltaZ]);

        // Create Animation
        this.animation = new MyEasedKeyframeAnimation(this.scene, deltaX + 3);
        this.animation.addKeyframe(firstKeyframe);
        this.animation.addKeyframe(secondKeyframe);

        // Update Coords with animation
        this.xAnimatedCoord = this.xCoord + deltaX;
        this.yAnimatedCoord = this.yCoord + deltaY;
        this.zAnimatedCoord = this.zCoord + deltaZ;
    }

    createGetPieceAnimation(endPosition){
        // Calculate amount to move
        let deltaX = endPosition[0] - this.xCoord;
        let deltaY = endPosition[1] - this.yCoord + 0.001;
        let deltaZ = endPosition[2] - this.zCoord;

        // Create Keyframes
        let firstKeyframe = new MyKeyframe(1000);
        let secondKeyframe = new MyKeyframe(3000);
        let thirdKeyframe = new MyKeyframe(4000);


        firstKeyframe.addTranslation([0, deltaY + 7, 0]);
        secondKeyframe.addTranslation([0.85 * deltaX , deltaY + 7,0.5 * deltaZ]);
        thirdKeyframe.addTranslation([deltaX, deltaY, deltaZ]);

        // Create Animation
        this.animation = new MyEasedKeyframeAnimation(this.scene, deltaX + 3);
        this.animation.addKeyframe(firstKeyframe);
        this.animation.addKeyframe(secondKeyframe);
        this.animation.addKeyframe(thirdKeyframe);

        // Update Coords with animation
        this.xAnimatedCoord = this.xCoord + deltaX;
        this.yAnimatedCoord = this.yCoord + deltaY;
        this.zAnimatedCoord = this.zCoord + deltaZ;
    }

}
