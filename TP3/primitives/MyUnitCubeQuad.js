/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyUnitCubeQuad extends CGFobject {
	constructor(scene, length) {
        super(scene);
        this.length = length;
                
        //Initialize MyUnitCubeQuad objects
        this.frontQuad = new MyQuad(this.scene, length); //The Front Face of the cube is the one with positive Z value
        this.leftQuad = new MyQuad(this.scene, length); //In relation to us, this is, the one with negative X value
        this.rightQuad = new MyQuad(this.scene, length);
        this.backQuad = new MyQuad(this.scene, length);
        this.topQuad = new MyQuad(this.scene, length);
        this.bottomQuad = new MyQuad(this.scene, length);
    
    }

    
    
    display() {

        //Displaying Top Quad
        this.scene.pushMatrix();
        
        this.scene.translate(0.0, this.length/2, 0.0);
        
        this.scene.rotate(-Math.PI/2, 1.0, 0.0, 0.0);
        
        this.topQuad.display();
        
        this.scene.popMatrix();

        //Displaying Back Quad
        this.scene.pushMatrix();
        
        this.scene.translate(0, 0, -this.length/2);
        
        
        this.scene.rotate(Math.PI, 1.0, 0.0, 0.0);
        
        this.backQuad.display();
        
        this.scene.popMatrix();

        //Displaying Left Quad
        this.scene.pushMatrix();
        
        this.scene.translate(-this.length/2,0,0);
        
        this.scene.rotate(-Math.PI/2, 0.0, 1.0, 0.0);
        
        this.leftQuad.display();
        
        this.scene.popMatrix();

        //Displaying Right Quad
        this.scene.pushMatrix();
        
        this.scene.translate(this.length/2,0,0);
        
        this.scene.rotate(Math.PI/2, 0.0, 1.0, 0.0);
        
        this.rightQuad.display();
        
        this.scene.popMatrix();

        //Displaying Front Quad
        this.scene.pushMatrix();
        
        this.scene.translate(0.0, 0.0, this.length/2);
    
        this.frontQuad.display();
        
        this.scene.popMatrix();

        //Displaying Bottom Quad
        this.scene.pushMatrix();
        
        this.scene.translate(0.0, -this.length/2, 0.0);
        
        this.scene.rotate(Math.PI/2, 1.0, 0.0, 0.0);
        
        this.bottomQuad.display();
        
        this.scene.popMatrix();
    }
}
