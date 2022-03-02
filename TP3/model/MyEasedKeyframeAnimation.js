/**
* MyEasedKeyframeAnimation
* @constructor
*/

class MyEasedKeyframeAnimation extends MyAnimation {
    constructor(scene, id){
        super(scene);
        this.id = id;
        this.currentKeyframeIndex = 0;
        this.keyframes = [];
        this.currentMatrix = mat4.create();

        this.initialTime = new Date();
        this.finishedAnimation = false;

        // Variables to save last keyframe information
        this.lastKeyframeInstant = 0;
        this.lastKeyframeTranslation = vec3.fromValues(0, 0, 0);
        this.lastKeyframeRotation = vec3.fromValues(0, 0, 0);
        this.lastKeyframeScale = vec3.fromValues(1, 1, 1);
    }

    addKeyframe(keyframe){
        this.keyframes.push(keyframe);
    }

    addKeyframeInOrder(keyframe){
        for(let i = 0; i < this.keyframes.length; i++){
            if(this.keyframes[i].instant > keyframe.instant){
                this.keyframes.splice(i, 0, keyframe);
                return;
            }
        }
    }

    updateCurrentKeyframe(){
        // Save last keyframe information
        this.lastKeyframeInstant = this.keyframes[this.currentKeyframeIndex].instant;
        this.lastKeyframeTranslation = this.keyframes[this.currentKeyframeIndex].translationInfo;
        this.lastKeyframeRotation = this.keyframes[this.currentKeyframeIndex].rotationInfo;
        this.lastKeyframeScale = this.keyframes[this.currentKeyframeIndex].scaleInfo;

        this.currentKeyframeIndex++;

        if(this.currentKeyframeIndex == this.keyframes.length){
            this.finishedAnimation = true;
            return null;
        }

        return this.keyframes[this.currentKeyframeIndex];
    }

    apply(){
        this.scene.multMatrix(this.currentMatrix);
    }

    update(t){
        if(this.finishedAnimation){
            return;
        }

        // Get current keyframe
        let currentKeyframe = this.keyframes[this.currentKeyframeIndex];

        // Calculate time passed
        let timePassed = t - this.initialTime.getTime();
        let deltaT = (timePassed - this.lastKeyframeInstant) / (currentKeyframe.instant - this.lastKeyframeInstant);

        // Create Matrix
        this.currentMatrix = mat4.create();

        // Vector to save the interpolation values
        let auxiliaryVector = [];

            // Translation
        // Interpolate Translation Vector
        vec3.lerp(auxiliaryVector, this.lastKeyframeTranslation, currentKeyframe.translationInfo, Math.sin(Math.PI / 2 * deltaT));

        mat4.translate(this.currentMatrix, this.currentMatrix, auxiliaryVector);

            // Rotation
        // Interpolate Rotation
        vec3.lerp(auxiliaryVector, this.lastKeyframeRotation, currentKeyframe.rotationInfo, deltaT);

            // Rotate Matrix
        if(auxiliaryVector[0] !== 0){
            mat4.rotate(this.currentMatrix, this.currentMatrix, auxiliaryVector[0], vec3.fromValues(1, 0, 0)); // X Axis
        }
        if(auxiliaryVector[1] !== 0){
            mat4.rotate(this.currentMatrix, this.currentMatrix, auxiliaryVector[1], vec3.fromValues(0, 1, 0)); // Y Axis 
        }
        if(auxiliaryVector[2] !== 0){
            mat4.rotate(this.currentMatrix, this.currentMatrix, auxiliaryVector[2], vec3.fromValues(0, 0, 1)); // Z Axis 
        }

            // Scale
        // Interpolate Scale
        vec3.lerp(auxiliaryVector, this.lastKeyframeScale, currentKeyframe.scaleInfo, deltaT);
        mat4.scale(this.currentMatrix, this.currentMatrix, auxiliaryVector);
        
        // Check if keyframe as ended
        if(timePassed > currentKeyframe.instant){
            currentKeyframe = (this.updateCurrentKeyframe());
        }
    }
}