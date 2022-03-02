/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        let obj = this;

        this.gui.add(this.scene, 'displayAxis').name('Display Axis');

        let materialsFolder = this.gui.addFolder("Materials and Textures");
        materialsFolder.add(this.scene, 'displayMaterials').name('Display Materials');
        materialsFolder.add(this.scene, 'displayTextures').name('Display Textures');

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    initLights(){
        let lightsFolder = this.gui.addFolder("Lights");

        for(let i = 0 ; i < Object.keys(this.scene.graph.lights).length ; i++){
            lightsFolder.add(this.scene.lights[i], 'enabled').name(Object.keys(this.scene.graph.lights)[i]);
        }
    }

    initCameras(){
        this.gui.add(this.scene, 'selectedCamera', Object.keys(this.scene.views)).name('Selected View').onChange(this.scene.setActiveCamera.bind(this.scene));
    }

    addGameVariables(gameMaster){
        let gameSettings = this.gui.addFolder("Game Settings");

        gameSettings.add(gameMaster, 'player1AI').name('Enable Black AI');
        
        gameSettings.add(gameMaster, 'difficultyAI1', 1, 2, 1).name('Black AI Level');

        gameSettings.add(gameMaster, 'player2AI').name('Enable White AI');

        gameSettings.add(gameMaster, 'difficultyAI2', 1, 2, 1).name('White AI Level');

        //gameSettings.add(gameMaster, 'play').name('StartGame');
    }

}