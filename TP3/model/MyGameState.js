
class MyGameState{
    constructor(scene){
        this.board = [["b1","p1","b1","p1","b1","p1","b1","p1"],["p1","b1","p1","b1","p1","b1","p1","b1"],["b1","p1","b1","p1","b1","p1","b1","p1"],["p1","b1","p1","b1","p1","b1","p1","b1"],["b1","p1","b1","p1","b1","p1","b1","p1"],["p1","b1","p1","b1","p1","b1","p1","b1"],["b1","p1","b1","p1","b1","p1","b1","p1"],["p1","b1","p1","b1","p1","b1","p1","b1"]];

        this.stacks = [];
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if((i+j) % 2 === 0){
                    this.stacks.push(new MyStack(scene, "b1", i, j));
                } else{
                    this.stacks.push(new MyStack(scene, "p1", i, j));
                }
                
            }
        }
    }
}