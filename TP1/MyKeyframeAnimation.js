/**
* MyAnimation
* @constructor
*/

class MyKeyframeAnimation{
    constructor(id){
        this.id = id;
        this.keyframes = [];
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
}