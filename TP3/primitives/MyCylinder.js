/**
* MyCylinder
* @constructor
*/
class MyCylinder extends CGFobject {
    constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;
        this.upperCover = new MyCircle(scene, this.height, this.topRadius, this.slices);
        this.bottomCover = new MyCircle(scene, 0, this.bottomRadius, this.slices);

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
        this.vertices.push(this.bottomRadius, 0, 0);
        this.vertices.push(this.topRadius, 0, this.height);

        this.normals.push(this.bottomRadius, 0, 0);
        this.normals.push(this.topRadius,0 ,0);


        this.texCoords.push(0, 1);
        this.texCoords.push(0, 0);

        //Top and Bottom Vertices

        ang += alphaAng;

        var nrVertices = 2;

        for(var i = 0; i < this.slices; i++){
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa=Math.sin(ang);
            var ca=Math.cos(ang);

            this.vertices.push(this.bottomRadius*ca, this.bottomRadius*-sa, 0);//1
            this.vertices.push(this.topRadius*ca, this.topRadius*-sa, this.height);//2
 
            this.normals.push(ca, -sa, 0);//1
            this.normals.push(ca, -sa, 0);//2
  
            //Texture Coordinates
            this.texCoords.push(i * (1 / this.slices) + 1 / this.slices, 1);
            this.texCoords.push(i * (1 / this.slices) + 1 / this.slices, 0);

            this.indices.push(2*i+2, (2*i+0) , (2*i+1));
            this.indices.push(2*i+2, (2*i+1) , (2*i+3));
            
            nrVertices += 2;
            ang+=alphaAng;
        }

        //Top and Bottom Vertices
        this.vertices.push(0, 0, 0);
        this.vertices.push(0, 0, this.height);

        this.normals.push(0, 0, -1);
        this.normals.push(0,0 ,1);


        this.texCoords.push(0, 1);
        this.texCoords.push(0, 0);

        for(var i = 0; i < this.slices; i++){
            this.indices.push(nrVertices, (2*i) , (2*i+2));
            this.indices.push((2*i+3), (2*i+1),nrVertices + 1);

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

    display(){
        super.display();
        this.upperCover.display();
        this.scene.pushMatrix();
        this.scene.rotate(180*DEGREE_TO_RAD, 0, 1, 0);
        this.scene.scale(0, -1);
        this.bottomCover.display();
        this.scene.popMatrix();
    }

}