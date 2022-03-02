class MySphere extends CGFobject {
  /**
   * @method constructor
   * @param  scene - MyScene object
   * @param  slices - number of slices around Y axis
   * @param  stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   * @param  radius - the radius of the sphere
   */
  constructor(scene, radius, slices, stacks) {
    super(scene);
    this.latDivs = stacks;
    this.longDivs = slices;
    this.radius = radius;

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

    var phi = 0;
    var theta = 0;
    var phiInc = Math.PI / this.latDivs;
    var thetaInc = (2 * Math.PI) / this.longDivs;
    var latVertices = this.longDivs + 1;

    // build an all-around stack at a time, starting on "north pole" and proceeding "south"
    for (let latitude = 0; latitude <= this.latDivs; latitude++) {
      var sinPhi = Math.sin(phi) * this.radius;
      var cosPhi = Math.cos(phi) * this.radius;

      // in each stack, build all the slices around, starting on longitude 0
      theta = 0;
      for (let longitude = 0; longitude <= this.longDivs; longitude++) {
        //--- Vertices coordinates
        var x = Math.cos(theta) * sinPhi;
        var y = cosPhi;
        var z = Math.sin(-theta) * sinPhi;
        this.vertices.push(x, y, z);

        //--- Indices
        if (latitude < this.latDivs && longitude < this.longDivs) {
          var current = latitude * latVertices + longitude;
          var next = current + latVertices;
          // pushing two triangles using indices from this round (current, current+1)
          // and the ones directly south (next, next+1)
          // (i.e. one full round of slices ahead)
          
          this.indices.push( current + 1, current, next);
          this.indices.push( current + 1, next, next +1);
        }

        //--- Normals
        // at each vertex, the direction of the normal is equal to 
        // the vector from the center of the sphere to the vertex.
        // in a sphere of radius equal to one, the vector length is one.
        // therefore, the value of the normal is equal to the position vector
        this.normals.push(x, y, z);
        theta += thetaInc;

        //--- Texture Coordinates
        this.texCoords.push(longitude/(this.longDivs),latitude/(this.longDivs*2));
      }
      phi += phiInc;
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

}
