/**
 * MyCubeMap
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCubeMap extends CGFobject {
	constructor(scene, frontTexture, backTexture, leftTexture, rightTexture, topTexture, bottomTexture, scale) {
        super(scene);
        
		this.scale = scale*2;
                
        //Initialize MyUnitCubeQuad objects
        this.quad = new MyQuad(this.scene, 0.5);
        
        //Initialize Textures
        this.frontTexture = frontTexture;
        this.backTexture = backTexture;
        this.leftTexture = leftTexture;
        this.rightTexture = rightTexture;
        this.topTexture = topTexture;
        this.bottomTexture = bottomTexture;

        this.initMaterials();
    
    }
    initMaterials() {
        //Front
        this.frontMaterial = new CGFappearance(this.scene);
        this.frontMaterial.setAmbient(1, 1, 1, 1);
        this.frontMaterial.setDiffuse(1, 1, 1, 1);
        this.frontMaterial.setSpecular(0, 0, 0, 1);
        this.frontMaterial.setShininess(10.0);
        this.frontMaterial.setTexture(this.frontTexture);
        
        //Back
        this.backMaterial = new CGFappearance(this.scene);
        this.backMaterial.setAmbient(1, 1, 1, 1);
        this.backMaterial.setDiffuse(1, 1, 1, 1);
        this.backMaterial.setSpecular(0, 0, 0, 1);
        this.backMaterial.setShininess(10.0);
        this.backMaterial.setTexture(this.backTexture);
        
        //Left
        this.leftMaterial = new CGFappearance(this.scene);
        this.leftMaterial.setAmbient(1, 1, 1, 1);
        this.leftMaterial.setDiffuse(0.8, 0.8, 0.8, 0.8);
        this.leftMaterial.setSpecular(0, 0, 0, 1);
        this.leftMaterial.setShininess(10.0);
        this.leftMaterial.setTexture(this.leftTexture);
        
        //Right
        this.rightMaterial = new CGFappearance(this.scene);
        this.rightMaterial.setAmbient(1, 1, 1, 1);
        this.rightMaterial.setDiffuse(1, 1, 1, 1);
        this.rightMaterial.setSpecular(0, 0, 0, 1);
        this.rightMaterial.setShininess(10.0);
        this.rightMaterial.setTexture(this.rightTexture);
        
        //Top
        this.topMaterial = new CGFappearance(this.scene);
        this.topMaterial.setAmbient(1, 1, 1, 1);
        this.topMaterial.setDiffuse(1, 1, 1, 1);
        this.topMaterial.setSpecular(0, 0, 0, 1);
        this.topMaterial.setShininess(10.0);
        this.topMaterial.setTexture(this.topTexture);
        
        //Back
        this.bottomMaterial = new CGFappearance(this.scene);
        this.bottomMaterial.setAmbient(1, 1, 1, 1);
        this.bottomMaterial.setDiffuse(1, 1, 1, 1);
        this.bottomMaterial.setSpecular(0, 0, 0, 1);
        this.bottomMaterial.setShininess(10.0);
        this.bottomMaterial.setTexture(this.bottomTexture);  
    }
    
    
    display() {
        
        this.scene.pushMatrix();
        
        this.scene.translate(0.0,30.0,0.0);
        this.scene.scale(this.scale,this.scale,this.scale);

        //Displaying Top Quad

        this.scene.pushMatrix();
       
        this.scene.translate(0.0, 0.5/2, 0.0);
       
        this.scene.rotate(Math.PI / 2, 1.0, 0.0, 0.0);
       
        this.topMaterial.apply();
       
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
       
        this.quad.display();
        
        this.scene.popMatrix();
        
        
        //Displaying Bottom Quad
        
		this.scene.pushMatrix();
        
        this.scene.translate(0.0, -0.5/2, 0.0);
        
        this.scene.rotate(-Math.PI / 2, 1.0, 0.0, 0.0);
        
        this.bottomMaterial.apply();
        
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        
        this.quad.display();
        
        this.scene.popMatrix();
        

        //Displaying Back Quad

        this.scene.pushMatrix();
        
        this.scene.translate(0, 0, -0.5/2);
        
        this.backMaterial.apply();
        
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        
        this.quad.display();
        
        this.scene.popMatrix();


        //Displaying Left Quad

        this.scene.pushMatrix();
        
        this.scene.translate(-0.5/2 , 0, 0);
        
        this.scene.rotate(Math.PI / 2, 0.0, 1.0, 0.0);
        
        this.leftMaterial.apply();
        
        this.quad.display();
        
        this.scene.popMatrix();


        //Displaying Right Quad

        this.scene.pushMatrix();
        
        this.scene.translate(0.5/2, 0, 0);
        
        this.scene.rotate(-Math.PI / 2, 0.0, 1.0, 0.0);
        
        this.rightMaterial.apply();
        
        this.quad.display();
        
        this.scene.popMatrix();


        //Displaying Front Quad

        this.scene.pushMatrix();
        
        this.scene.translate(0.0, 0.0, 0.5/2);
        
        this.scene.rotate(-Math.PI, 0, 1.0, 0.0);		
        
        this.frontMaterial.apply();
        
        this.quad.display();
        
        this.scene.popMatrix();
        
		this.scene.popMatrix();
    }
}

