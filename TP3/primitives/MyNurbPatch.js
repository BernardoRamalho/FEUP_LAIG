/**
 * MyNurbPatch
 */
class MyNurbPatch extends CGFobject {
	constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {
        super(scene);

        // Create Nurb Surface
        this.surface = new CGFnurbsSurface(nPointsU - 1, nPointsV - 1, controlPoints);

        // Create Nurb Oject using the surface created
        this.object = new CGFnurbsObject(scene, nPartsU, nPartsV, this.surface);

	}
    
    display(){
        this.object.display();
    }
}