/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, x3, y3, afs, aft) {
		super(scene);
		this.xCoordinates = [x1, x2, x3];
        this.yCoordinates = [y1, y2, y3];
		this.afs = afs;
		this.aft = aft;

		this.initBuffers();
	}
	initBuffers() {
		this.vertices = [
			this.xCoordinates[0], this.yCoordinates[0], 0,	//0
			this.xCoordinates[1], this.yCoordinates[1], 0,	//1
			this.xCoordinates[2], this.yCoordinates[2], 0	//2
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		]

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			2, 1, 0
		];

		this.calculateTextCoords();

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	calculateTextCoords(){
		// Calculate the length of the sides
		let a = Math.sqrt(
			Math.pow(this.xCoordinates[1] - this.xCoordinates[0], 2)
			+ Math.pow(this.yCoordinates[1] - this.yCoordinates[0], 2));

		let b = Math.sqrt(
			Math.pow(this.xCoordinates[2] - this.xCoordinates[1], 2)
			+ Math.pow(this.yCoordinates[2]- this.yCoordinates[1], 2));

		let c = Math.sqrt(
			Math.pow(this.xCoordinates[0] - this.xCoordinates[2], 2)
			+ Math.pow(this.yCoordinates[0] - this.yCoordinates[2], 2));
		
		// Calculate the cossine and sine of alpha
		let cosAlph = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c);
		let sinAlph = Math.sqrt(1 - Math.pow(cosAlph, 2));


		// Calculate the Texture Coordinates
		this.texCoords=[
			0, 1,
			a / this.afs, 1, 
			c * cosAlph / this.afs,1 - c * sinAlph / this.aft
		];

	}
}