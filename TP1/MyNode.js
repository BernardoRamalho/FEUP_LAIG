/**
* MyNode
* @constructor
*/

class MyNode{
    constructor(id){
        this.id = id;
        this.material = "";
        this.texture = "";
        this.mat = mat4.create();
        this.nodeDescendants = [];
        this.leafDescendants = [];
    }

    addNodeDescendant(node){
        this.nodeDescendants.push(node);
    }

    addLeafDescendant(leaf){
        this.leafDescendants.push(leaf);
    }

    setMaterial(material){
        this.material = material;
    }

    setTexture(texture){
        this.texture = texture;
    }

    translate(x,y,z){
        mat4.translate(this.mat, this.mat, vec3.fromValues(x,y,z));
    }

    rotate(angle, axis){
        angle *= DEGREE_TO_RAD;
        
        if(axis.startsWith("x")){
            mat4.rotate(this.mat, this.mat, angle, vec3.fromValues(1, 0, 0));
        }
        else if(axis.startsWith("y")){
            mat4.rotate(this.mat, this.mat, angle, vec3.fromValues(0, 1, 0));
        }
        else if(axis.startsWith("z")){
            mat4.rotate(this.mat, this.mat, angle, vec3.fromValues(0, 0, 1));
        }
    }

    scale(x,y,z){
        mat4.scale(this.mat, this.mat, vec3.fromValues(x,y,z));
    }

}