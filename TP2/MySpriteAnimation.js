/**
 * MySpriteSheetAnimation
 * @constructor
 */

class MySpriteAnimation extends MyAnimation {
    constructor(scene, id) {
        super(scene);
        this.spriteRectangle = new MyRectangle(scene, 0, 0, 1, 1, 1, 1);
        this.delta = 0;
        this.oldTime = new Date().getTime();

    }

    addStartCell(startCell){
        this.startCell = startCell;
        this.activeCell = startCell;
        this.spriteSheet.activateCellP(startCell);
    }

    addEndCell(endCell){
        this.endCell = endCell;
    }

    addDuration(duration){
        this.duration = duration;
    }

    addSpriteSheet(spriteSheet){
        this.spriteSheet = spriteSheet;
    }

    display(){
        this.scene.setActiveShader(this.spriteSheet.shader);

        this.spriteSheet.appearance.apply();
        this.spriteRectangle.display();
        this.scene.defaultAppearance.apply();
        
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    update(t) {
        if(this.delta > this.duration/(this.endCell-this.startCell)){ // Change frame
            // Reset variable
            this.delta = 0;
            this.oldTime = new Date().getTime();

            // Change the active cell to the next one
            this.activeCell++;
            this.spriteSheet.activateCellP(this.activeCell % this.endCell);
        }else { // Calculate the time passed
            let newTime = new Date().getTime();
            this.delta = newTime - this.oldTime
        }
    }
}