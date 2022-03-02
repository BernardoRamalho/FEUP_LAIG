/**
* MyCylinder
* @constructor
*/
class MyCircle extends CGFobject {
    constructor(scene, height, radius, slices) {
        super(scene);
        this.slices = slices;
        this.height = height;
        this.radius = radius;
        this.initBuffers();

    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;

        //Side Vertices
        this.vertices.push(0, 0, this.height);
        this.vertices.push(this.radius, 0, this.height);

        this.normals.push(0, 0, 1);
        this.normals.push(0, 0, 1)

        this.texCoords.push(0.5, 0.5);
        this.texCoords.push( 0.5 + (this.radius) / 2*this.radius , 0.5);

        ang += alphaAng;

        for(var i = 0; i < this.slices; i++){
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa=Math.sin(ang);
            var ca=Math.cos(ang);

            this.vertices.push(this.radius*ca, this.radius*-sa, this.height);//1
 
            this.normals.push(0, 0, 1);//1
  
            this.indices.push(i + 2, i + 1, 0);

            //Texture Coordinates
            this.texCoords.push(i * (1 / this.slices) + 1 / this.slices, 1);
            
            ang+=alphaAng;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}