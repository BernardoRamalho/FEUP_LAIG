/**
 * MyGameMaster
 * @constructor
 */
class MyGameMaster {
    constructor(scene){
        this.scene = scene;
        this.play = false;
        this.started = false;
        this.gameState = new MyGameState(scene);
        this.player1AI = false;
        this.difficultyAI1 = 1;
        this.player2AI = false;
        this.difficultyAI2 = 1;

        this.moveStates = Object.freeze({"UN_SELECTED":1, "BLACK_SELECTED":2, "WHITE_SELECTED":3});

        this.gameEnded = false;
        this.moveState = this.moveStates.UN_SELECTED;
        this.moves = [];
        this.buttons = new MyOptions(this.scene);

        this.selectedStack = null;
        this.previousStack = null;
        this.animations = [];

        // Variaveis que contem a resposta do prolog
        this.response = "";
        this.responseReady = false;

        this.turn = 1;
        this.timePassed = 3000;
        this.passedTurns = 0;
        this.sceneNumber = 0;

    };

    arrayToString(board){
        let regex = '"';
        return JSON.stringify(board).replaceAll(regex, '');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
      
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      }

    includesMove(arr1, arr2){
        for(let i = 0; i < arr1.length; i++){
            if(this.arraysEqual(arr1[i], arr2)) return true;
        }
        return false;
    }

    onObjectSelected(obj, customId){

        if(obj instanceof MyStack){
            switch(this.moveState){
                case this.moveStates.UN_SELECTED:

                    if(this.turn === 1 && obj.topColor() === 'p'){

                        this.selectedStack = obj;
                        this.moveState = this.moveStates.BLACK_SELECTED;
                        this.addValidMovesToStacks(0);
                    }else if (this.turn === 2 && obj.topColor() === 'b'){

                        this.selectedStack = obj;
                        this.moveState = this.moveStates.WHITE_SELECTED;
                        this.addValidMovesToStacks(1);
                    }
                    break;

                case this.moveStates.BLACK_SELECTED:
                    if(obj.topColor() === 'b'){
                        // Calculate Valid Moves
                        this.valid_moves(this.gameState.board,0);
                        
                        // Check if the given move is in it
                        let move = [this.selectedStack.zCoord, this.selectedStack.xCoord, obj.zCoord, obj.xCoord];
                        if(this.includesMove(this.response, move)){
                            // Replace the replace the piece moved with one from the other color
                            this.animations.push(this.selectedStack.replaceTop());

                            // Add the moved piece to the stack
                            this.animations.push(obj.addPiece(null, [this.selectedStack.xCoord, this.selectedStack.yCoord, this.selectedStack.zCoord]));

                            // Comunicate with prolog to get the new Board
                            let stringMove = this.arrayToString(move);
                            this.movePiece(this.arrayToString(this.gameState.board),stringMove);
                            this.gameState.board = this.response;

                            this.turn = 2;

                            this.moves.push([this.selectedStack, obj]);

                            // Variables used to update animation
                            this.previousStack = this.selectedStack;
                            this.selectedStack = obj;

                        }
                        
                    }
                    this.passedTurns = 0;
                    this.moveState = this.moveStates.UN_SELECTED;
                    break;
                case this.moveStates.WHITE_SELECTED:
                    if(obj.topColor() === 'p'){
                        // Calculate Valid Moves
                        this.valid_moves(this.gameState.board,1);

                        // Check if the given move is in it
                        let move = [this.selectedStack.zCoord, this.selectedStack.xCoord, obj.zCoord, obj.xCoord];
                        if(this.includesMove(this.response, move)){
                            // Replace the replace the piece moved with one from the other color
                            this.animations.push(this.selectedStack.replaceTop());

                            // Add the moved piece to the stack
                            this.animations.push(obj.addPiece(null, [this.selectedStack.xCoord, this.selectedStack.yCoord, this.selectedStack.zCoord]));

                            // Comunicate with prolog to get the new Board
                            let stringMove = this.arrayToString(move);
                            this.movePiece(this.arrayToString(this.gameState.board),stringMove);
                            this.gameState.board = this.response;
                            this.turn = 1;  

                            this.moves.push([this.selectedStack, obj]);

                            // Variables used to update animation
                            this.previousStack = this.selectedStack;
                            this.selectedStack = obj;
                        }
                        
                    }
                    this.passedTurns = 0;
                    this.moveState = this.moveStates.UN_SELECTED;
                    break;
            }
        }else if(obj instanceof MyButton){
            switch(obj.id){
                case 'undo':
                    this.undo();
                    break;
                case 'pass':
                    this.passedTurns++;
                    if(this.turn === 1){
                        this.turn = 2;
                    }else {
                        this.turn = 1;
                    }
                    break;
                case 'play':
                    this.play = true;
                    this.started = true;
                    break;
                case 'scene':
                    if(this.sceneNumber === 0){
                        this.sceneNumber = 1;
                    }else{
                        this.sceneNumber = 0;
                    }
                    break;
            }
        }
        else{
            this.moveState = this.moveStates.UN_SELECTED;
        }

    }

    removeValidMovesFromStacks(){
        for(let i = 0; i < 64 ; i ++){
            if(this.gameState.stacks[i].topColor() === 'g'){
                this.gameState.stacks[i].pop();
            }
        }
    }

    addValidMovesToStacks(turn){
        let vMoves =  this.valid_moves(this.gameState.board,turn);
        for(let i = 0; i < 64 ; i ++){
        }
    }

    async playMovie(){
        let oldGamestate = this.gameState;
        this.animations = [];

        this.gameState = new MyGameState(scene);
        let move = 0;
        let fromStack, toStack;

        while(playMovie){
            if(move === this.moves.length){
                break;
            }
            

            if(this.timePassed > 90){
                fromStack = this.moves[move][0];
                toStack = this.moves[move][1];

                this.animations.push(fromStack.replaceTop());
                this.animations.push(toStack.addPiece(null, [fromStack.xCoord, fromStack.yCoord, fromStack.zCoord]));

                move++;
                this.timePassed = 0;

            }else{
                this.timePassed++;
            }
            

            move++;
        }

        this.gameState = oldGamestate;
    }

    changeBoard(){
        let fromStack, toStack;
        for(let i = 0; i < 8 ; i ++){
            
            for(let j = 0; j < 8 ; j ++){
                if (parseInt(this.gameState.board[i][j][1], 10) < parseInt(this.response[i][j][1], 10)){
                    toStack = this.gameState.stacks.find(elem=>elem.id === (j + i*10));
                    continue;
                }
                if(this.gameState.board[i][j][0] !== this.response[i][j][0]){
                    fromStack = this.gameState.stacks.find(elem=>elem.id === (j + i*10));
                }
            }
        }

        if(typeof fromStack === 'undefined'){
            this.passedTurns++;
            return;
        }

        let move = [fromStack, toStack];

        this.moves.push(move);
        
        this.passedTurns = 0;
        this.animations.push(fromStack.replaceTop());
        this.animations.push(toStack.addPiece(null, [fromStack.xCoord, fromStack.yCoord, fromStack.zCoord]));
        this.gameState.board = this.response;
    }

    undo(){
        if(this.moves.length < 2){
            return;
        }
        let moveToUndo;
        for(let i = 0; i < 2; i++){
            moveToUndo = this.moves.pop();

            this.animations.push(moveToUndo[0].replaceTop());
            moveToUndo[1].pieces.pop();
        }

    }

    executeBotMoves(){
        if(this.player1AI && this.turn === 1){
            if(this.difficultyAI1 === 1){
                this.smartBot(this.arrayToString(this.gameState.board), 0);
            }else{
                this.randomBot(this.arrayToString(this.gameState.board), 0);
            }
            
            this.changeBoard();
            this.turn = 2;
        }else if (this.player2AI && this.turn === 2){
            if(this.difficultyAI2 === 1){
                this.smartBot(this.arrayToString(this.gameState.board), 1);
            }else{
                this.randomBot(this.arrayToString(this.gameState.board), 1);
            }
            this.changeBoard();
            this.turn = 1;
        }
    }

    getPrologRequest(requestString, isAsync, onError, port) {     
        var requestPort = port || 8081
        var request = new XMLHttpRequest();


        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, isAsync);

        request.onload = () => {
            this.response = JSON.parse(request.responseText); 
            this.responseReady = true; 
        };    

        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
        
    }


    logPicking() {
		if (this.scene.pickMode == false) {


			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {

				for (var i = 0; i < this.scene.pickResults.length; i++) {
                    var obj = this.scene.pickResults[i][0];
					if (obj) {
                        var customId = this.scene.pickResults[i][1];
                        this.onObjectSelected(obj, customId);
				
					}
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
    }

    draw_cell(row, collumn, k){
        this.scene.registerForPick(k + 1, this.gameState.stacks[k]);

        this.gameState.stacks[k].display();
    }


    draw_board(){
        let k = 0;
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j ++){
                this.draw_cell(i, j, k++);
            }
        }
    }


    movePiece(board, move){
        let request = `move(${board},${move})`;
        this.getPrologRequest(request, false);
    }

    randomBot(board, turn){
        let stringBoard = this.arrayToString(board);
        let request = `randomBot(${stringBoard},${turn})`;
        this.getPrologRequest(request, false);
    }

    smartBot(board, turn){
        let stringBoard = this.arrayToString(board);
        let request = `smartBot(${stringBoard},${turn})`;
        this.getPrologRequest(request, false);
    }


    valid_moves(board, turn) {
        let stringBoard = this.arrayToString(board);
        let request = `valid_moves(${stringBoard},${turn})`;
        this.getPrologRequest(request, false);
    }

    value(board, turn) {
        let stringBoard = this.arrayToString(board);
        let request = `value(${stringBoard},${turn})`;
        this.getPrologRequest(request, false);
    }

    
    update(){
        this.buttons.display()
        if(this.passedTurns < 2 && this.play){
            this.scene.setPickEnabled(true);

            this.draw_board();

            if(this.timePassed > 90){
                this.executeBotMoves();
                this.timePassed = 0;
            }else{
                this.timePassed++;
            }
        }else if(!this.gameEnded && this.started){
            this.value(this.gameState.board, 0);
            let score0 = this.response;
            this.value(this.gameState.board, 1);
            let score1 = this.response;
            alert("Black Score: " + score0 + "\nWhite Score: " + score1);
        }
    
    }


}