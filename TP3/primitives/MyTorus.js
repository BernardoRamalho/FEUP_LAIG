class MyTorus extends CGFobject {
    /**
     * @method constructor
     * @param  scene - MyScene object
     * @param  slices - number of slices around Y axis
     * @param  loops - number of loops along Y axis, from the center to the poles (half of sphere)
     * @param  outerRadius - the outer radius of the sphere
     * @param  innerRadius - how thick the torus is
     * @param  arc - how much of the arc is complete
     */
    constructor(scene, innerRadius, outerRadius, slices, loops) {
        super(scene);
        this.slices = slices; //radialSegments
        this.loops = loops; //tubularSegments
        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius;

        this.initBuffers();
    }

    /**
     * @method initBuffers
     * Initializes the sphere buffers
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        this.uvs = [];

        for ( let j = 0; j <= this.slices; j ++ ) {

            for ( let i = 0; i <= this.loops; i ++ ) {

                const u = i / this.loops* Math.PI * 2;
                const v = j / this.slices * Math.PI * 2;

                this.vertices.push(( this.outerRadius + this.innerRadius * Math.cos(v)) * Math.cos(u));
                this.vertices.push(( this.outerRadius + this.innerRadius * Math.cos(v)) * Math.sin(u));
                this.vertices.push( this.innerRadius * Math.sin(v));

                this.normals.push(Math.cos(v) * Math.cos(u));
                this.normals.push(Math.cos(v) * Math.sin(u));
                this.normals.push(Math.sin(v));

                this.texCoords.push( j / this.slices, i / this.loops );

            }

        }

        for ( let i = 0; i < this.slices; i ++ ) {
            for( let j = 0; j < this.loops; j ++ ) {
                this.indices.push(
                    i*( this.loops+1 ) + j,
                    i*( this.loops+1 ) + j + 1,
                    ( i+1 )*( this.loops+1 ) + j,
                    ( i+1 )*( this.loops+1 ) + j + 1,
                    ( i+1 )*( this.loops+1 ) + j,
                    i*( this.loops+1 ) + j+1,
                );
            }
        }


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}
