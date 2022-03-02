/**
* MyKeyframe
* @constructor
*/

class MyKeyframe{
    constructor(instant){
        this.instant = instant;
        this.translationInfo = [];
        this.rotationInfo = {"x" : null, "y": null, "z": null};
        this.scaleInfo = [];
    }


    addTranslation(translationInfo){
        this.translationInfo = translationInfo;
    }

    addRotation(axis, angle){
        this.rotationInfo[axis] = angle;
    }

    addScale(scaleInfo){
        this.scaleInfo = scaleInfo;
    }
}