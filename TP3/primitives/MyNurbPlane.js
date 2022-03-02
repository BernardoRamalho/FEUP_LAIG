/**
 * MyNurbPlane
 */
class MyNurbPlane extends CGFobject {
	constructor(scene, nPartsU, nPartsV) {
        super(scene);
        
        // Create Nurb Surface
        this.surface = new CGFnurbsSurface(1, 1,  [ 
                                                    [ // U = 0 
                                                        [-0.5, 0, 0.5, 1], 
                                                        [-0.5, 0, -0.5, 1] ],
                                                    [ // U = 1
                                                        [0.5, 0, 0.5, 1],
                                                        [0.5, 0, -0.5, 1] ] 
                                                  ]);

        // Create Nurb Oject using the surface created
        this.object = new CGFnurbsObject(scene, nPartsU, nPartsV, this.surface);

	}
    
    display(){
        this.object.display();
    }
}