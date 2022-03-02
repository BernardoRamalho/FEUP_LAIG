const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITESHEETS_INDEX = 5;
var MATERIALS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var NODES_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
        this.textures = {};
        this.MyNodes = [];


        /*
         * Interface variables
         */
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");
            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <animations> 
        if(((index = nodeNames.indexOf("animations")) == -1)){
            return "tag <animations> missing";
        }
        else{
            if(index != ANIMATIONS_INDEX){
                this.onXMLMinorError("tag <animations> out of order");
            }

            if((error = this.parseAnimations(nodes[index]) != null)){
                return error;
            }

        }

        // <spritesheets>

        if(((index = nodeNames.indexOf("spritesheets")) == -1)){
            return "tag <spritesheets> missing";
        }
        else{
            if(index != SPRITESHEETS_INDEX){
                this.onXMLMinorError("tag <spritesheets> out of order");
            }

            if((error = this.parseSpriteSheetsAnimation(nodes[index]) != null)){
                return error;
            }

        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {

        var children = viewsNode.children;
        this.views = {};

        for(var i = 0; i < children.length; i++){

            // Get id of the current material.
            var viewID = this.reader.getString(children[i], 'id');
            if (viewID == null)
                return "no ID defined for view";

            // Checks for repeated IDs.
            if (this.views[viewID] != null)
                return "ID must be unique for each light (conflict: ID = " + viewID + ")";
            
            this.views[viewID] = this.createView(children[i], viewID);
        }

        this.scene.selectedCamera = this.reader.getString(viewsNode, 'default');

        if(!this.views[this.scene.selectedCamera]){
            return this.onXMLError('Não existe default View');
        }


       this.log("Parsed Views");

        return null;
    }

    /**
     * Creates a View Element
     * @param {view elemnt with informaiton} viewInformation 
     * @param {name of the view} viewID 
     */
    createView(viewInformation, viewID){
        var nodeNames = [];
        var grandChildren = viewInformation.children;

        for (var j = 0; j < grandChildren.length; j++) {
            nodeNames.push(grandChildren[j].nodeName);
        }

        // Get all the indexes of the information we need
        var fromIndex = nodeNames.indexOf("from");
        if(fromIndex !== -1){
            var position = this.parseCoordinates3D(grandChildren[fromIndex], "'to' camera position");
            if(!Array.isArray(position)){
                return "Position couldn't be parsed."
            }
        }
        else{
            this.onXMLMinorError("No Position declared for view " + viewID + " ; Returnin null");
            return null;
        }

        var toIndex = nodeNames.indexOf("to");
        if(toIndex !== -1){
            var target = this.parseCoordinates3D(grandChildren[toIndex], "'to' camera position");
            if(!Array.isArray(target)){
                return "Direction couldn't be parsed."
            }
        }
        else{
            this.onXMLMinorError("No Direction declared for view " + viewID + " ; Returnin null");
            return null;
        }

        var near = this.reader.getFloat(viewInformation, 'near');
        if(near == null){
            this.onXMLMinorError("No Near declared for view " + viewID + " ; Returnin null");
            return null;
        }


        var far = this.reader.getFloat(viewInformation, 'far');
        if(far == null){
            this.onXMLMinorError("No Far declared for view " + viewID + " ; Returnin null");
            return null;
        }

        var cameraType = viewInformation.nodeName;
        switch (cameraType) {
            case "perspective":
                var angle = this.reader.getFloat(viewInformation, 'angle');

                if(angle == null){
                    this.onXMLMinorError("No Far declared for view " + viewID + " ; Returning null");
                    return null;
                }

                var fov = angle * DEGREE_TO_RAD;

                var view = new CGFcamera(fov, near, far, position, target);
                break;
        
            case "ortho":
                // Get left attribute of the view
                var left = this.reader.getFloat(viewInformation, 'left');
                if(left === null){
                    this.onXMLMinorError("no Left attribute defined for view with ID " + viewID + "; Returning null");
                    return null;
                }

                // Get right attribute of the view
                var right = this.reader.getFloat(viewInformation, 'right');
                if(right === null){
                    this.onXMLMinorError("no right attribute defined for view with ID " + viewID + "; Returning null");
                    return null;
                }

                // Get bottom attribute of the view
                var bottom = this.reader.getFloat(viewInformation, 'bottom');
                if(bottom === null){
                    this.onXMLMinorError("no bottom attribute defined for view with ID " + viewID + "; Returning null");
                    return null;
                }

                // Get top attribute of the view
                var top = this.reader.getFloat(viewInformation, 'top');
                if(top === null){
                    this.onXMLMinorError("no top attribute defined for view with ID " + viewID + "; Returning null");
                    return null;
                }

                var upIndex = nodeNames.indexOf("up");
                if(upIndex !== -1){
                    var up = this.parseCoordinates3D(grandChildren[upIndex], "'to' camera up");
                    if(!Array.isArray(up)){
                        return "up couldn't be parsed."
                    }
                }
                else{
                    this.onXMLMinorError("No Up declared for view " + viewID + " ; Returnin null");
                    return null;
                }

                var view = new CGFcameraOrtho(left, right, bottom, top, near, far, position, target, up);
            default:
                break;
        }

        return view;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        //For each texture in textures block, check ID and file URL
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureID] != null)
                return "ID must be unique for each light (conflict: ID = " + textureID + ")";

            var texturePath = this.reader.getString(children[i], 'path');
            if (texturePath == null)
                return "no ID defined for texture";
    
            let newTexture = new CGFtexture(this.scene, texturePath);

            this.textures[textureID] = newTexture;

        }

        this.log("Parsed Textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;
        this.materials = {};

        var grandChildren = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            grandChildren = children[i].children;

            this.materials[materialID] = this.createMaterial(grandChildren);
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Creates a Material with the information given
     * @param {Material Information from XML} materialInformation 
     */
    createMaterial(materialInformation){
        var nodeNames = [];
        var colour, shininess;

        for (var j = 0; j < materialInformation.length; j++) {
            nodeNames.push(materialInformation[j].nodeName);
        }

        var shininessIndex = nodeNames.indexOf("shininess");
        if(shininessIndex == -1){
            this.onXMLMinorError("No Shininess declared for material " + materialID + " ; Returning null");
            return null;
        }

        var ambientIndex = nodeNames.indexOf("ambient");
        if(ambientIndex == -1){
            this.onXMLMinorError("No ambient declared for material " + materialID + " ; Returning null");
            return null;
        }

        var diffuseIndex = nodeNames.indexOf("diffuse");
        if(diffuseIndex == -1){
            this.onXMLMinorError("No diffuse declared for material " + materialID + " ; Returning null");
            return null;
        }

        var emissiveIndex = nodeNames.indexOf("emissive");
        if(emissiveIndex == -1){
            this.onXMLMinorError("No emissive declared for material " + materialID + " ; Returning null");
            return null;
        }

        var specularIndex = nodeNames.indexOf("specular");
        if(specularIndex == -1){
            this.onXMLMinorError("No specular declared for material " + materialID + " ; Returning null");
            return null;
        }

        var material = new CGFappearance(this.scene);
        
        // Set Shininess Componente of Matrial
        shininess = this.reader.getFloat(materialInformation[shininessIndex], 'value');
        if(shininess === null){
            this.onXMLMinorError("Couldn't parse shininess component of " + materialID + " ; Returning null");
            return null;
        }

        material.setShininess(shininess);

        // Set Ambient Component of Material
        colour = this.parseColor(materialInformation[ambientIndex], "ambient component");
        if (!Array.isArray(colour)){
            this.onXMLMinorError("Couldn't parse ambient component of " + materialID + " ; Returning null");
            return null;
        }

        material.setAmbient(colour[0], colour[1], colour[2], colour[3]);

        // Set Diffuse Component of Material
        colour = this.parseColor(materialInformation[diffuseIndex], "diffuse component");
        if (!Array.isArray(colour)){
            this.onXMLMinorError("Couldn't parse diffuse component of " + materialID + " ; Returning null");
            return null;
        }
        
        material.setDiffuse(colour[0], colour[1], colour[2], colour[3]);


        // Set Emissive Component of Material
        colour = this.parseColor(materialInformation[emissiveIndex], "emissive component");
        if (!Array.isArray(colour)){
            this.onXMLMinorError("Couldn't parse emissive component of " + materialID + " ; Returning null");
            return null;
        }

        material.setEmission(colour[0], colour[1], colour[2], colour[3]);


        // Set Specular Component of Material
        colour = this.parseColor(materialInformation[specularIndex], "specular component");
        if (!Array.isArray(colour)){
            this.onXMLMinorError("Couldn't parse specular component of " + materialID + " ; Returning null");
            return null;
        }
        
        material.setSpecular(colour[0], colour[1], colour[2], colour[3]);

        material.setTextureWrap("REPEAT", "REPEAT");
        
        return material;
    }

    /**
     * Parses the <animations> block. 
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode){
        var children = animationsNode.children;
        this.animations = {};

        var grandChildren = [];

        // Any number of animations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            var animationID = this.reader.getString(children[i], 'id');
            if (animationID == null)
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animationID] != null)
                return "ID must be unique for each light (conflict: ID = " + animationID + ")";

            grandChildren = children[i].children;
            
            // Create the animation with the information given
            var animation = this.createAnimation(grandChildren, animationID);
            if(animation == null){ 
                this.onXMLMinorError("Couldn't create keyframe animation with ID " + animationID + ".");
                continue;
            }

            // Save the aniamtion into a array
            this.animations[animationID] = animation;
        }

        this.log("Parsed animations");
        return null;
    }

    /**
     * Creates a Animation with the information given
     * @param {Animation Information from XML} animationInformation 
     */
    createAnimation(animationInformation, animationID){
        var animation = new MyKeyframeAnimation(this.scene, animationID); 
        var lastKeyframeInstant = 0;
        var keyframesInstants =[];

        // Read all of the keyframes
        for (var j = 0; j < animationInformation.length; j++) {

            // Check if it's a keyframe
            if(animationInformation[j].nodeName != "keyframe"){
                this.onXMLMinorError("Animation node children not a keyframe. Going to be ignored.");
                continue;
            }

            // Create a keyframe with the information given
            var keyframe = this.createKeyframe(animationInformation[j]);
            if(keyframe == null){
                this.onXMLMinorError("One of the keyframes of animation " + animationID + " couldn't be created.")
                continue;
            }

            // Se if there exists a keyframe with the same instant
            if(keyframesInstants.includes(keyframe.instant)){
                this.onXMLMinorError("Two keyframes have the same instant. Animation cannot be created.");
                return null;
            }

            // Check if the keyframe is ordered and if it is not insert it in order
            if(keyframe.instant < lastKeyframeInstant){
                this.onXMLMinorError("Keyframes are out of order in animation " + animationID + ".");
                animation.addKeyframeInOrder(keyframe);
            }
            else{
                animation.addKeyframe(keyframe);
                lastKeyframeInstant = keyframe.instant;
            }

            // Save the keyframe instant to check if the next ones are in order
            keyframesInstants.push(keyframe.instant);
        }

        return animation; // Return the animation created
    }

    /**
     * Creates a Keyframe with the information given
     * @param {Keyframe Information from XML} keyframeInformation 
     */
    createKeyframe(keyframeInformation){
        var nodeNames = [];
        var axis, value;
        var transformationsInfo = keyframeInformation.children;

        // Get the instant of the keyframe
        var instant = this.reader.getFloat(keyframeInformation, 'instant');
        if(instant == null){
            this.onXMLMinorError("Instant not defined for keyframe. Returnig Null.");
            return null;
        }

        var keyframe = new MyKeyframe(instant * 1000); // Create a keyframe converting the instant to miliseconds
        
        
        for(var i = 0; i < transformationsInfo.length; i++){
            nodeNames.push(transformationsInfo[i].nodeName);
        }

        // Get the transformations values of the keyframe
            // TRANSLATION

        //Get index of translation
        var translationIndex = nodeNames.indexOf("translation");
        if(translationIndex == -1){
            this.onXMLMinorError("No translation declared for keyframe with instant " + instant + " ; Returning null");
            return null;
        }

        // Get translation values
        value = this.parseCoordinates3D(transformationsInfo[translationIndex], "translation values of keyframe");
        if(!Array.isArray(value)){
            return "up couldn't be parsed."
        }
        
        keyframe.addTranslation(value);

            // ROTATION

        // Get rotation index
        var rotationIndex = nodeNames.indexOf("rotation");
        if(rotationIndex == -1){
            this.onXMLMinorError("No rotation declared for keyframe with instant " + instant + " ; Returning null");
            return null;
        }

        // Get rotation values
        for(var i = 0; i < 3; i++){
            if(nodeNames[rotationIndex + i] != "rotation"){
                this.onXMLMinorError("One of the rotaion was not declared for keyframe with instant " + instant + " ; Returning null");
                return null;
            }
            
            // Get the axis
            axis = this.reader.getString(transformationsInfo[rotationIndex + i], 'axis');
            if(axis == null){
                this.onXMLMinorError("Axis not defined for a rotation of keyframe. Returnig Null.");
                return null;
            }

            // Get the value of the angle
            value = this.reader.getFloat(transformationsInfo[rotationIndex + i], 'angle');
            if(value == null){
                this.onXMLMinorError("Angle not defined for rotation of keyframe. Returnig Null.");
                return null;
            }

            keyframe.addRotation(axis, value)
        }

            // SCALE
        
        // Get scale index
        var scaleIndex = nodeNames.indexOf("scale");
        if(scaleIndex == -1){
            this.onXMLMinorError("No scale declared for keyframe with instant " + instant + " ; Returning null");
            return null;
        }
        
        // Get scale values
        let sx = this.reader.getFloat(transformationsInfo[scaleIndex], "sx");
        let sy = this.reader.getFloat(transformationsInfo[scaleIndex], "sy");
        let sz = this.reader.getFloat(transformationsInfo[scaleIndex], "sz");

        if(sx === null || sy === null || sz === null){
            this.onXMLMinorError("Couldn't parse scale of node " + node.id);
            return;
        }
        
        keyframe.addScale(vec3.fromValues(sx, sy, sz));

        return keyframe;
         
    }

    /**
     * Parses the <spritesheets> block. 
     * @param {spritesheets block element} spritesheetsNode
     */
    parseSpriteSheetsAnimation(spritesheetsNode){
        var children = spritesheetsNode.children;
        this.spriteAnimations = {};
        this.spriteSheets = {};

        // Any number of spritesheets.
        for (var i = 0; i < children.length; i++) {

            // Check if the node is a spritesheet
            if (children[i].nodeName != "spritesheet") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current spritesheet.
            var spriteSheetID = this.reader.getString(children[i], 'id');
            if (spriteSheetID == null)
                return "no ID defined for spritesheet";

            // Checks for repeated IDs.
            if (this.spriteSheets[spriteSheetID] != null)
                return "ID must be unique for each light (conflict: ID = " + spriteSheetID + ")";

            // Create the a spritesheet with the information given
            var spritesheet = this.createSpriteSheet(children[i], spriteSheetID);
            if(spritesheet == null){ 
                this.onXMLMinorError("Couldn't create spritesheet spritesheet with ID " + spriteSheetID + ".");
                continue;
            }

            // Save the spritesheet into a aray
            this.spriteSheets[spriteSheetID] = spritesheet;
        }

        this.log("Parsed spriteSheets");
        return null;
    }

    /**
     * Creates a SpriteSheet with the information given
     * @param {SpriteSheet Information from XML} spriteSheetInformation 
     */
    createSpriteSheet(spriteSheetInformation, spriteSheetID){
        let spriteSheet = new MySpriteSheet(this.scene, spriteSheetID);

        // Get Path from the XML
        var path = this.reader.getString(spriteSheetInformation, "path");
        if(path === null){
            this.onXMLMinorError("Couldn't get the path value of cylinder. Returning null");
            return null;
        }
        spriteSheet.addTexture(new CGFtexture(this.scene, path), this.scene);

        // Get sizeM from the XML
        var sizeM = this.reader.getFloat(spriteSheetInformation, "sizeM");
        if(sizeM === null){
            this.onXMLMinorError("Couldn't get the sizeM value of cylinder. Returning null");
            return null;
        }

        spriteSheet.addSizeM(sizeM);   // Save sizeM into the animation

        // Get sizeN from the XML
        var sizeN = this.reader.getFloat(spriteSheetInformation, "sizeN");
        if(sizeN === null){
            this.onXMLMinorError("Couldn't get the sizeN value of cylinder. Returning null");
            return null;
        }

        spriteSheet.addSizeN(sizeN);   // Save sizeN into the animation

        return spriteSheet
    }


    /**
     * Parses and applies all the transformations to the node
     * @param {Transformation Information from node} transformationsInfo 
     * @param {Node to apply the Transformation} node 
     */
    parseTransformations(transformationsInfo, node){
        for( let k = 0 ; k < transformationsInfo.length; k++ ){

            switch(transformationsInfo[k].nodeName){
                case 'translation':
                    let x = this.reader.getFloat(transformationsInfo[k], "x");
                    let y = this.reader.getFloat(transformationsInfo[k], "y");
                    let z = this.reader.getFloat(transformationsInfo[k], "z");

                    if(x === null || y === null || z === null){
                        this.onXMLMinorError("Couldn't parse translation of node " + node.id);
                        return;
                    }

                    node.translate(x,y,z);
                    break;
                case 'rotation':
                    let axis = this.reader.getString(transformationsInfo[k], "axis");
                    let angle = this.reader.getFloat(transformationsInfo[k], "angle");

                    if(axis === null || angle === null){
                        this.onXMLMinorError("Couldn't parse rotation of node " + node.id);
                    }

                    node.rotate(angle,axis);
                    break;
                case 'scale':
                    let sx = this.reader.getFloat(transformationsInfo[k], "sx");
                    let sy = this.reader.getFloat(transformationsInfo[k], "sy");
                    let sz = this.reader.getFloat(transformationsInfo[k], "sz");

                    if(sx === null || sy === null || sz === null){
                        this.onXMLMinorError("Couldn't parse scale of node " + node.id);
                        return;
                    }

                    node.scale(sx,sy,sz);
                    break;
            }
        }
    }

    /**
     * Parses and saves the descendant information in the parent node
     * @param {Descendant Information of node} descendantsInfo 
     * @param {Parent node of the Descendants} node 
     */
    parseDescendants(descendantsInfo, node, amplification){
        for(let x = 0 ; x < descendantsInfo.length; x++ ){

            if(descendantsInfo[x].nodeName === 'leaf'){
                node.addLeafDescendant(this.parseLeaf(descendantsInfo[x], amplification));
            } 
            
            else if(descendantsInfo[x].nodeName === 'noderef'){
                node.addNodeDescendant(descendantsInfo[x].id)
            }
        }
    }

    /**
     * Auxiliary function to help the parseDescendants.
     * Creates and returns objects representing the leaf descendants
     * @param {Information of the leaf descendant} leaf 
     */
    parseLeaf(leaf, amplification){
        let leafType = this.reader.getString(leaf, "type");
    
        switch (leafType){
            case 'cylinder':
                return this.createCylinder(leaf);
            case 'sphere':
                return this.createSphere(leaf);
            case 'torus':
                return this.createTorus(leaf);
            case 'rectangle':
                return this.createRectangle(leaf, amplification);
            case 'triangle':
                return this.createTriangle(leaf, amplification);
            case 'spriteanim':
                return this.createSpriteAnimation(leaf);
            case 'plane':
                return this.createNurbPlane(leaf);
            case 'patch':
                return this.createNurbPatch(leaf);
            case 'defbarrel':
                return this.createNurbBarrel(leaf);
            case 'spritetext':
                return this.createSpriteText(leaf);
        }
  
    }

    /**
     * Auxiliary function to parseLeaf.
     * Creates and Returns a cylinder.
     * @param {Information of the Cylinder to be created} cylinderInfo 
     */
    createCylinder(cylinderInfo){
        // Get Cylinder Attributes
        let height = this.reader.getFloat(cylinderInfo, "height");
        if(height === null){
            this.onXMLError("Couldn't get the height value of cylinder. Returning null");
            return null;
        }

        let topRadius = this.reader.getFloat(cylinderInfo, "topRadius");
        if(topRadius === null){
            this.onXMLError("Couldn't get the topRadius value of cylinder. Returning null");
            return null;
        }

        let bottomRadius = this.reader.getFloat(cylinderInfo, "bottomRadius");
        if(bottomRadius === null){
            this.onXMLError("Couldn't get the bottomRadius value of cylinder. Returning null");
            return null;
        }

        let stacks = this.reader.getFloat(cylinderInfo, "stacks");
        if(stacks === null){
            this.onXMLError("Couldn't get the stacks value of cylinder. Returning null");
            return null;
        }

        let slices = this.reader.getFloat(cylinderInfo, "slices");
        if(slices === null){
            this.onXMLError("Couldn't get the slices value of cylinder. Returning null");
            return null;
        }

        return new MyCylinder(this.scene, height, topRadius, bottomRadius, stacks, slices);
    }
    /**
     * Auxiliary function to parseLeaf.
     * Creates and Returns a sphere.
     * @param {Information of the Sphere to be created} sphereInfo 
     */
    createSphere(sphereInfo){
        // Get Sphere Attributes
        let radius = this.reader.getFloat(sphereInfo, "radius");
        if(radius === null){
            this.onXMLError("Couldn't get the radius value of sphere. Returning null");
            return null;
        }

        let stacks = this.reader.getFloat(sphereInfo, "stacks");
        if(stacks === null){
            this.onXMLError("Couldn't get the stacks value of sphere. Returning null");
            return null;
        }

        let slices = this.reader.getFloat(sphereInfo, "slices");
        if(stacks === null){
            this.onXMLError("Couldn't get the stacks value of sphere. Returning null");
            return null;
        }

        return new MySphere(this.scene, radius, slices, stacks);
    }

    /**
     * Auxiliary function to parseLeaf.
     * Creates and Returns a torus.
     * @param {Information of the Torus to be created} torusInfo 
     */
    createTorus(torusInfo){
        // Get Torus Attributes
        let inner = this.reader.getFloat(torusInfo, "inner");
        if(inner === null){
            this.onXMLError("Couldn't get the inner value of torus. Returning null");
            return null;
        }

        let outer = this.reader.getFloat(torusInfo, "outer");
        if(outer === null){
            this.onXMLError("Couldn't get the outer value of torus. Returning null");
            return null;
        }

        let loops = this.reader.getFloat(torusInfo, "loops");
        if(loops === null){
            this.onXMLError("Couldn't get the loops value of torus. Returning null");
            return null;
        }

        let slices = this.reader.getFloat(torusInfo, "slices");
        if(slices === null){
            this.onXMLError("Couldn't get the slices value of torus. Returning null");
            return null;
        }

        return new MyTorus(this.scene, inner, outer, slices, loops);
    }

    /**
     * Auxiliary function to parseLeaf.
     * Creates and Returns a rectangle.
     * @param {Information of the Rectangle to be created} rectangleInfo 
     */
    createRectangle(rectangleInfo, amplification){
        // Get Rectangle Attributes
        let x1 = this.reader.getFloat(rectangleInfo, "x1");
        if(x1 === null){
            this.onXMLError("Couldn't get the x1 value of rectangle. Returning null");
            return null;
        }

        let y1 = this.reader.getFloat(rectangleInfo, "y1");
        if(y1 === null){
            this.onXMLError("Couldn't get the y1 value of rectangle. Returning null");
            return null;
        }

        let x2 = this.reader.getFloat(rectangleInfo, "x2");
        if(x2 === null){
            this.onXMLError("Couldn't get the x2 value of rectangle. Returning null");
            return null;
        }

        let y2 = this.reader.getFloat(rectangleInfo, "y2");
        if(y2 === null){
            this.onXMLError("Couldn't get the y2 value of rectangle. Returning null");
            return null;
        }

        return new MyRectangle(this.scene, x1, y1, x2, y2, amplification[0], amplification[1]);
    }

    /**
     * Auxiliary function to parseLeaf.
     * Creates and Returns a triangle.
     * @param {Information of the Triangle to be created} triangleInfo 
     */
    createTriangle(triangleInfo, amplification){
        // Get Triangle Attributes
        let x1 = this.reader.getFloat(triangleInfo, "x1");
        if(x1 === null){
            this.onXMLError("Couldn't get the x1 value of triangle. Returning null");
            return null;
        }

        let y1 = this.reader.getFloat(triangleInfo, "y1");
        if(y1 === null){
            this.onXMLError("Couldn't get the y1 value of triangle. Returning null");
            return null;
        }

        let x2 = this.reader.getFloat(triangleInfo, "x2");
        if(x2 === null){
            this.onXMLError("Couldn't get the x2 value of triangle. Returning null");
            return null;
        }

        let y2 = this.reader.getFloat(triangleInfo, "y2");
        if(y2 === null){
            this.onXMLError("Couldn't get the y2 value of triangle. Returning null");
            return null;
        }

        let x3 = this.reader.getFloat(triangleInfo, "x3");
        if(x3 === null){
            this.onXMLError("Couldn't get the x3 value of triangle. Returning null");
            return null;
        }

        let y3 = this.reader.getFloat(triangleInfo, "y3");
        if(y3 === null){
            this.onXMLError("Couldn't get the y3 value of triangle. Returning null");
            return null;
        }

        return new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3, amplification[0], amplification[1]);
    }

    /**
     * Auxiliary function to parseLeaf.
     * Creates and Returns a spriteAnimation.
     * @param {Information of the Sprite Animation to be created} spriteAnimationInfo 
     */
    createSpriteAnimation(spriteAnimationInfo){
        let spriteAnimation = new MySpriteAnimation(this.scene);
        
        // Get Sprite Sheet
        let spriteSheetID = this.reader.getString(spriteAnimationInfo, 'ssid');
        if(spriteSheetID === null){
            this.onXMLError("Couldn't get the spriteSheetID value. Returning null");
            return null;
        }

        // Check if spritesheet exists
        if(this.spriteSheets[spriteSheetID] === undefined){
            this.onXMLError("There is no spritesheet with ID " + spriteSheetID + ". Returning null");
            return null;
        }

        spriteAnimation.addSpriteSheet(this.spriteSheets[spriteSheetID]); // Add spritesheet to spriteAnimation

        // Get Start Cell
        let startCell = this.reader.getFloat(spriteAnimationInfo, 'startCell');
        if(startCell == null){
            this.onXMLError("Couldn't get the startCell value. Returning null");
            return null;
        }

        spriteAnimation.addStartCell(startCell);    // Add starting cell to spriteAnimation

        // Get End Cell
        let endCell = this.reader.getFloat(spriteAnimationInfo, 'endCell');
        if(endCell == null){
            this.onXMLError("Couldn't get the endCell value. Returning null");
            return null;
        }

        spriteAnimation.addEndCell(endCell);    // Add ending cell to spriteAnimation

        // Get Duration
        let duration = this.reader.getFloat(spriteAnimationInfo, 'duration');
        if(duration == null){
            this.onXMLError("Couldn't get the duration value. Returning null");
            return null;
        }

        spriteAnimation.addDuration(duration);  // Add duration to spriteAnimation

        this.spriteAnimations[spriteSheetID] = spriteAnimation;

        return spriteAnimation;
    }

    /**
     * Auxiliary function to parseLeaf.
     * Creates and Returns a nurbPlane.
     * @param {Information of the Nurb Plane to be created} nurbPlaneInfo 
     */
    createNurbPlane(nurbPlaneInfo){

        // Get nPartsU from the XML
        let nPartsU = this.reader.getFloat(nurbPlaneInfo, 'npartsU');
        if(nPartsU == null){
            this.onXMLError("Couldn't get the npartsU value. Returning null");
            return null;
        }

        // Get nPartsV from the XML
        let nPartsV = this.reader.getFloat(nurbPlaneInfo,'npartsV');
        if(nPartsV == null){
            this.onXMLError("Couldn't get the npartsV value. Returning null");
            return null;
        }

        return new MyNurbPlane(this.scene, nPartsU, nPartsV) // Create the NurbPlane and Return it
    }

    /**
     * Auxiliary function to parseLeaf.
     * Creates and Returns a nurbPatch.
     * @param {Information of the Nurb Patch to be created} nurbPatchInfo 
     */
    createNurbPatch(nurbPatchInfo){
        // Get nPointsU from the XML
        let nPointsU = this.reader.getFloat(nurbPatchInfo, 'npointsU');
        if(nPointsU == null){
            this.onXMLError("Couldn't get the npointsU value. Returning null");
            return null;
        }

        // Get nPointsV from the XML
        let nPointsV = this.reader.getFloat(nurbPatchInfo, 'npointsV');
        if(nPointsV == null){
            this.onXMLError("Couldn't get the npointsV value. Returning null");
            return null;
        }

        // Get nPartsU from the XML
        let nPartsU = this.reader.getFloat(nurbPatchInfo, 'npartsU');
        if(nPartsU == null){
            this.onXMLError("Couldn't get the npartsU value. Returning null");
            return null;
        }

        // Get nPartsV from the XML
        let nPartsV = this.reader.getFloat(nurbPatchInfo, 'npartsV');
        if(nPartsV == null){
            this.onXMLError("Couldn't get the npartsV value. Returning null");
            return null;
        }

        // Check if there are the correct number of control points declared
        let controlPointsInformation = nurbPatchInfo.children;
        if(nPointsU * nPointsV !== controlPointsInformation.length){
            this.onXMLError("Number of points declared doesn't match the number of points required.");
        }

        // Auxiliary Variables to help read and organize the control points
        let controlPoints = [];
        let uPoints = [];
        let coordinates;

        for(let i = 0; i < controlPointsInformation.length; i++){

            if(controlPointsInformation[i].nodeName !== "controlpoint"){
                this.onXMLError("Node should be controlpoint but it isn't.")
                return null;
            }
            
            // Parse the given coordinates
            coordinates = this.parseCoordinates3D(controlPointsInformation[i], "Error reading control points coordinates.");
            if(!Array.isArray(coordinates)){
                this.onXMLError("Control Point couldn't be parsed.");
                return null;
            }

            // Add the W value at the end
            coordinates[3] = 1;

            // Save the values
            uPoints.push(coordinates);

            /* uPoints must have nPointsV points.
            *  controlPoints must be an array of arrays with size nPointsU.
            *  each array within the controlPoints array must be size nPointsV.
            */
            if(uPoints.length % nPointsV === 0){
                controlPoints.push(uPoints);
                uPoints = [];
            }
        }

        return new MyNurbPatch(this.scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints); // Create and Return a NurbPatch
    }

    /**
     * Auxiliary function to parseLeaf.
     * Creates and Returns a nurbBarrel.
     * @param {Information of the Nurb Barrel to be created} nurbBarrelInfo 
     */
    createNurbBarrel(nurbBarrelInfo){
        // Get base from the XML
        let base = this.reader.getFloat(nurbBarrelInfo, 'base');
        if(base == null){
            this.onXMLError("Couldn't get the base value. Returning null");
            return null;
        }

        // Get middle from the XML
        let middle = this.reader.getFloat(nurbBarrelInfo, 'middle');
        if(middle == null){
            this.onXMLError("Couldn't get the middle value. Returning null");
            return null;
        }

        // Get height from the XML
        let height = this.reader.getFloat(nurbBarrelInfo, 'height');
        if(height == null){
            this.onXMLError("Couldn't get the height value. Returning null");
            return null;
        }

        // Get slices from the XML
        let slices = this.reader.getFloat(nurbBarrelInfo, 'slices');
        if(slices == null){
            this.onXMLError("Couldn't get the slices value. Returning null");
            return null;
        }

        // Get stacks from the XML
        let stacks = this.reader.getFloat(nurbBarrelInfo, 'stacks');
        if(stacks == null){
            this.onXMLError("Couldn't get the stacks value. Returning null");
            return null;
        }

        return new MyNurbBarrel(this.scene, base, middle, height, slices, stacks); // Create and Return a NurbBarrel
    }

    /*
     * Creates and Returns a spriteText.
     * @param {Information of the Sprite Text to be created} spriteTextInfo 
     */
    createSpriteText(spriteTextInfo){
        let spriteText = new MySpriteText(this.scene);
        
        // Get Sprite Sheet
        let spriteTextWords = this.reader.getString(spriteTextInfo, 'text');
        if(spriteTextWords === null){
            this.onXMLError("Couldn't get the spriteSheetID value. Returning null");
            return null;
        }

        spriteText.addText(spriteTextWords);
        
        return spriteText;
    }

    /**
     * Searches the texture from all the textures and saves it in node.
     * @param {Information about the texture of node} textureInformation 
     * @param {Node to save the texture} node 
     */
    parseNodeTexture(textureInformation, node){
        let textureID = this.reader.getString(textureInformation, 'id');
        if(textureID === null){
            this.onXMLMinorError("Couldn't get the id value of texture in node " + node.id + "; Setting texture to clear");
            node.texture = "clear";
            return;
        }

        if(textureID == "clear"){
            node.texture = textureID;
        }
        else if(textureID == "null" ){
            node.texture = null;
        }
        else{
            node.texture = this.textures[textureID];
        }

        if(textureInformation.children.length == 0){
            this.onXMLMinorError("Amplification not defined. Default values of 1 will be used.")
            return [1, 1]
        }
        else{
            let afs = this.reader.getFloat(textureInformation.children[0], 'afs');
            if(afs === null){
                this.onXMLMinorError("Error reading afs value. Will use default value 1.")
                afs = 1;
            }

            let aft = this.reader.getFloat(textureInformation.children[0], 'aft');
            if(aft === null){
                this.onXMLMinorError("Error reading aft value. Will use default value 1.")
                aft = 1;
            }

            return [afs, aft];
        }

    }

    /**
     * Searches the material from all the materials and saves it in node.
     * @param {Information about the material of node} materialInformation 
     * @param {Node to save the material} node 
     */
    parseNodeMaterial(materialInformation, node){
        let materialID = this.reader.getString(materialInformation, 'id');
        if(materialID === null){
            this.onXMLMinorError("Couldn't get the id value of material in node " + node.id + "; Setting material to null");
            node.material = null;
            return;
        }

        if(materialID == "null" ){
            node.material = null;
        }
        else{
            node.material = this.materials[materialID];
        }
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
  parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];
        var grandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            
            let node = new MyNode(nodeID);
            
            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            
            // Parse Node Transformations
            var transformationsIndex = nodeNames.indexOf("transformations");
            if(transformationsIndex === null){
                this.onXMLMinorError("Couldn't get transformation information for node " + nodeID);
            }
            else{
                this.parseTransformations(grandChildren[transformationsIndex].children, node);
            }

            // Parse Node Animations
            if(nodeNames.includes("animationref")){
                var animationIndex = nodeNames.indexOf("animationref");

                if(animationIndex === null){
                    this.onXMLMinorError("Couldn't get animation information for node " + nodeID);
                }
                else{
                    let animationID = this.reader.getString(grandChildren[animationIndex], 'id');
                    
                    node.addAnimation(this.animations[animationID]);
                }
            }
            else{
                node.animation = null;
            }

            // Parse Node Material
            var materialIndex = nodeNames.indexOf("material");
            if(materialIndex === null){
                this.onXMLMinorError("Couldn't get material information for node " + nodeID);
            }
            else{
                this.parseNodeMaterial(grandChildren[materialIndex], node);
            }

            let amplification = [1, 1];
            // Parse Node Texture
            var textureIndex = nodeNames.indexOf("texture");
            if(textureIndex === null){
                this.onXMLMinorError("Couldn't get texture information for node " + nodeID);
            }
            else{
                amplification = this.parseNodeTexture(grandChildren[textureIndex], node);
            }

            // Parse Node Descendants
            var descendantsIndex = nodeNames.indexOf("descendants");
            if(descendantsIndex === null){
                this.onXMLMinorError("Couldn't get descendants information for node " + nodeID);
            }
            else{
                this.parseDescendants(grandChildren[descendantsIndex].children, node, amplification);
            }

            this.MyNodes.push(node);
        }

        this.log("Parsed Nodes")
    }

    parseBoolean(node, name, messageError) {
        let boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))) {
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = true'");
            boolVal = true;
        }
        return boolVal;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.drawNode(this.MyNodes[0], "clear", null);
    }

    /**
     * Recursive function that draws each node and then calls itself to draw the descedants.
     * @param {Node to be drawn} node 
     * @param {Object containing the parent's texture} parentTexture 
     * @param {Object containing the parent's material} parentMaterial 
     */
    drawNode(node, parentTexture, parentMaterial){
        var material, texture;
        
        // Apply Materials
        if(this.scene.displayMaterials){
            if(node.material === null){
                material = parentMaterial;
            }
            else{
                material = node.material
            }
            // Apply Textures
            if(material != null){
                if(this.scene.displayTextures){
                    if(node.texture === null){
                        if(parentTexture === "clear"){
                            material.setTexture(null);
                            texture = null;
                        }
                        else{
                            material.setTexture(parentTexture);
                            texture = parentTexture;
                        }
                    }
                    else if(node.texture === "clear"){
                        material.setTexture(null);
                        texture = null;
                    }
                    else{
                        material.setTexture(node.texture);
                        texture = node.texture;
                    }
                }else{
                    material.setTexture(null);
                }

            material.apply();

            }
        }

        
        // Apply Transformations
        this.scene.pushMatrix();

        this.scene.multMatrix(node.mat);

        if(node.animation != null){
            node.animation.apply();
        }

            // Draw Descendants
        // Draw Leafs
        for( let y = 0 ; y < node.leafDescendants.length ; y++){
            node.leafDescendants[y].display();
        }

        // Draw children nodes
        for( let x = 0 ; x < node.nodeDescendants.length ; x++ ){
            let descendantNode = this.MyNodes.find(element => element.id === node.nodeDescendants[x]);

            if(typeof(descendantNode) === 'undefined' || descendantNode === null){
                continue;
            }

            this.drawNode(descendantNode, texture, material);
        }

        this.scene.popMatrix();

    }
}