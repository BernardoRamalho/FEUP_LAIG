/**
* MyKeyframe
* @constructor
*/

class MyKeyframe{
    constructor(instant){
        this.instant = instant;

        // Variables to save the transformation information
        this.translationInfo = [];
        this.rotationInfo = [0, 0, 0];
        this.scaleInfo = [];
    }

    /**
     * Saves the translation information
     * @param {Vec3 with Translation Information} translationInfo 
     */
    addTranslation(translationInfo){
        this.translationInfo = translationInfo;
    }

    /**
     * Saves the rotation information into a variable
     * @param {String with the name of the axis to rotate} axis 
     * @param {Number representing the angle to rotate} angle 
     */
    addRotation(axis, angle){
        angle *= DEGREE_TO_RAD;
        
        if(axis === "x"){
            this.rotationInfo[0] = angle;
        }
        else if (axis === "y"){
            this.rotationInfo[1] = angle;
        }
        else if (axis === "z"){
            this.rotationInfo[2] = angle;
        }
    }

    /**
     * Saves the scale information into a variable
     * @param {Vec3 with the scale values} scaleInfo 
     */
    addScale(scaleInfo){
        this.scaleInfo = scaleInfo;
    }
}