import main from '../scss/main.scss';

import 'babel-polyfill';
import {OBJLoader} from './vendor/OBJLoader';
import {OBJLoader2} from './vendor/OBJLoader2';
import {FlyControls} from './vendor/FlyControls';
import {EditorControls} from './vendor/EditorControls';
import * as THREE from 'three';
import controlkit from 'controlkit';
import meshbasic_frag from 'webpack-glsl-loader!../assets/shaders/meshbasic_frag.glsl';
import 'expose-loader?paper!paper';
import paperBlank from '../assets/paperjs/blank.paperjs';

import 'gsap/TweenMax';

'use strict';

var camera, scene, renderer, 
    clock,
    solidMaterial, transparentMaterial, cncMaterial,
    ui;
var toLoad = [
    "assets/obj/cnc_downstairs.obj",
    "assets/obj/cnc_main.obj",
    "assets/obj/floor_1_floor.obj",
    "assets/obj/floor_1_ramp.obj",
    "assets/obj/floor_2_floor.obj",
    "assets/obj/stairwell_2.obj",
    "assets/obj/cnc_downstairs.obj",
    "assets/obj/floor_1_frontWall.obj",
    "assets/obj/floor_1_roof.obj",
    "assets/obj/floor_2_frontWall.obj",
    "assets/obj/floor_1_backWall.obj",
    "assets/obj/floor_1_innerWalls.obj",
    "assets/obj/floor_2_backWalls.obj",
    "assets/obj/floor_2_roof.obj",
    "assets/obj/floor_2_officeWalls.obj",
    "assets/obj/rafters.obj"
];

function Main () {
    var app = this;
    window.app = app;
    // console.log(OBJLoader);
    // console.log(controlkit);

    ui = new controlkit();

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.z = 1;
 
    scene = new THREE.Scene();
 
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );    

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.2 );
    scene.add( ambientLight );
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set(-20,20,-10);
    directionalLight.castShadow = true;
    scene.add( directionalLight );

    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 1024;  // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5;    // default
    directionalLight.shadow.camera.far = 100;     // default
    directionalLight.shadow.camera.left = -20;    // default
    directionalLight.shadow.camera.bottom = -10;     // default
    directionalLight.shadow.camera.top = 0;    // default
    directionalLight.shadow.camera.right = 10;     // default

    var lighthelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
    scene.add( lighthelper );

    var shadowHelper = new THREE.CameraHelper( directionalLight.shadow.camera );
    scene.add( shadowHelper );

    app.models = {};
    scene.add( directionalLight.target );
    var pointLight = new THREE.PointLight( 0xffffff, 0.6 );
    camera.add( pointLight );


    scene.add( camera );
    window.scene = scene;

    clock = new THREE.Clock();

    app.cameraController = new EditorControls( camera, document.body );
    app.cameraController.movementSpeed = 5;
    app.cameraController.speedRange = [1,10];

    app.controls = ui.addPanel({label:"controls", width: 300, fixed:true});
    app.controls.addSlider(app.cameraController,'movementSpeed', "speedRange", {label:"MOVE SPEED"});
            // .addGroup()
            //     .addSubGroup()
                    // .addSlider(app.cameraController,'movementSpeed', "speedRange", {label:"MOVE SPEED"});

    var presets = {
        "upstairs": {
            pos:{x: -7.690997547123423, y: 5.290438517605944, z: -13.620662626317483},
            center: {x: -6.245315193140939, y: 5.070590311023063, z: -16.164355500632855}
        },
        "lobby": {
            pos:{x: -3.143166296663331, y: 1.825414693984566, z: -19.005826436670137},
            center:{x: -3.15, y: 1.825414693984566, z: -19.005826436670137}
        }
    }
    var presetGroup = app.controls.addGroup();
    var createCallback = function(pos, center){
        return function(){
            app.cameraController.place(pos, center)
        }
    }
    var placed = false;
    for(var loc in presets){
        var preset = presets[loc];
        if(!placed){
            placed = true;
            app.cameraController.place(preset.pos, preset.center)
        }
        presetGroup.addButton(loc, createCallback(preset.pos, preset.center));
    }

    solidMaterial = new THREE.MeshPhongMaterial({color:0xffffff});
    transparentMaterial = new THREE.MeshPhongMaterial({color:0xffffff, transparent:true, opacity:0.5});


    app.canvas = document.createElement('canvas');
    app.canvas.width = 4096;
    app.canvas.height = 4096;
    app.canvas.id = "cncDesign";
    paper.setup(app.canvas);
    paper.execute(paperBlank);

    cncMaterial = new THREE.MeshPhongMaterial({
        color:0xffffff,
        map:new THREE.CanvasTexture(app.canvas),
        // map:new THREE.TextureLoader().load( "assets/textures/cnc.png" ),
        alphaTest: 0.5,
        side:THREE.DoubleSide
    });

    loadModel();
    
}

function ready(){
    app.models.cnc_main.material = cncMaterial;

    // start update loop
    update();
}

function loadModel(){
    if(!toLoad.length){
        ready();
        return;
    }

    var loader = new OBJLoader(),
        objURL = toLoad.shift(),
        objId = objURL.replace('assets/obj/', '').replace('.obj', '');
    loader.load(
        // resource URL
        objURL,
        // called when resource is loaded
        function ( object ) {
            // console.log(object);
            for(var i=object.children.length-1; i>=0; i--){
                var obj = object.children[i];
                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.material = solidMaterial;
                scene.add( obj );

                app.models[(app.models[objId])?objId+"_"+i:objId] = obj;
                
            }
            loadModel();
        },
        // called when loading is in progresses
        function ( xhr ) {

            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            // console.log( 'An error happened' );

        }
    );
}

// X, Z, -Y
var vectors = {
    frontWall: {
        ids: ["floor_1_frontWall", "floor_2_frontWall"],
        pos: new THREE.Vector3(-7.859615, 3.583791, -15.598855),
        vec: new THREE.Vector3(-7.7361, 3.583791, -15.50934).sub(new THREE.Vector3(-7.859615, 3.583791, -15.598855)).normalize()
    },
    roof: {
        ids: ["floor_2_roof"],
        pos: new THREE.Vector3(-15.45643, 6.78844, 0),
        vec: new THREE.Vector3(-0.1311,-0.9864,-0.0992)
    },
    roof: {
        ids: ["floor_2_backWalls"],
        pos: new THREE.Vector3(-14.16839, 6.63594, -1.70209),
        vec: new THREE.Vector3(-0.7974,0.0000,-0.6034)
    }
}               

console.log("vectors", vectors);

function toggleMaterial(ids, state){
    for(var i = 0; i<ids.length; i++)
        app.models[ids[i]].material = (state)?solidMaterial:transparentMaterial;
}

function update() {
 
    var delta = clock.getDelta();

    //controls.movementSpeed = 0.33 * d;
    app.cameraController.update( delta );

    for(var id in vectors){
        toggleMaterial( vectors[id].ids, camera.position.clone().sub(vectors[id].pos).normalize().dot(vectors[id].vec) >  0 );
    }

    requestAnimationFrame( update );
 
    renderer.render( scene, camera );
 
}

new Main();



// init();