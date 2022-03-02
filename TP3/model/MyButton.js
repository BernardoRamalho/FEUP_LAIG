class MyButton extends CGFobject{

    constructor(scene, id){
        super(scene);
        this.id = id;
        this.button = new MySphere(scene, 0.5, 15, 15);
    }

    display(){
        this.button.display();
    }
}