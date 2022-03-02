/**
 * MyStack
 * @constructor
 * @param scene - Reference to MyScene object
 */

class MyStack extends CGFobject{
    constructor(scene, pieceType, x, z){
        super(scene);

        this.xCoord = x;
        this.yCoord = 0;
        this.zCoord = z;
        this.id = x + z * 10;
        this.pieceType = pieceType[0];

        if(this.pieceType  === 'b'){
            this.pieces = [new MyPiece(scene, -7 + 2 * this.xCoord, 8.2, -7 + 2 * this.zCoord, 'b')];
        }
        else{
            this.pieces = [new MyPiece(scene, -7 + 2 * this.xCoord, 8.2, -7 + 2 * this.zCoord, 'p')];
        }
    }


    display(){

        for(let i = 0; i < this.pieces.length; i++){
            this.pieces[i].display();
        }
    }

    topColor(){
        return this.pieces[this.pieces.length - 1].color;
    }


    addPiece(c, startingPos){
        let color = '';
        if(c === 'b'){
            color = 'p';
        }else if (c === 'p'){
            color = 'b';
        }else{
            let temp = this.pieces[this.pieces.length - 1].color;
            if(temp === 'b'){
                color = 'p';
            }else{
                color = 'b';
            }
        }

        // Create the New Piece
        this.yCoord += 0.35;
        let piece = new MyPiece(this.scene, -7 + 2 * startingPos[0], 8.2 + startingPos[1], -7 + 2 * startingPos[2], color);

        // Create animation to move the piece
        let endPosition = [-7 + 2 * this.xCoord, 8.2 + this.yCoord, -7 + 2 * this.zCoord];
        piece.createMoveAnimation(endPosition);
    
        this.pieces.push(piece);
        return piece.animation;
    }

    replaceTop(){
        // Remove the old Piece
        let oldPiece = this.pieces.pop();

        // Create New Piece
        let piece;
        if(oldPiece.color === 'b'){
            piece = new MyPiece(this.scene, -11, 8, 0, 'p');
        }else{
            piece = new MyPiece(this.scene, 11, 8, 0, 'b');
        }

        // Add animation to piece
        let endPosition =  [oldPiece.xAnimatedCoord, oldPiece.yAnimatedCoord, oldPiece.zAnimatedCoord];
        piece.createGetPieceAnimation(endPosition);

        this.pieces.push(piece);

        return piece.animation;
    }

}