// Allows me to view THREE functions directly from VS Code hints
import * as THREE from './three.module.js';

// Scene Preparations
let scene = new THREE.Scene();
let meshFloor;

// Store keyboard inputs to check during animate loop
let keyboard = {};
let player = { height:1.8, speed: 0.1 , turnSpeed: Math.PI*0.02}

var camera = new THREE.PerspectiveCamera(
    // FOV (field of view)
    75,
    // Aspect Ratio
    window.innerWidth/window.innerHeight,
    // Near Plane
    0.1,
    // Far Plane
    1000
);

meshFloor = new THREE.Mesh(
    // Add segments to geometry with extra parameters (2,2)
    new THREE.PlaneGeometry(10,10, 2,2), 
    new THREE.MeshPhongMaterial({color:0x1b1b1b, wireframe:false})
);
meshFloor.rotation.x -= Math.PI/2;
meshFloor.receiveShadow = true;
meshFloor.name = "baseplate";
scene.add(meshFloor);

// Defining a sphere
// let geometry = new THREE.SphereGeometry(
//     Radius
//     1,
//     Width & Height
//     15, 15
// );

let boxes = [];

// Define a box with a scale of 1
let geometry = new THREE.BoxGeometry(1, 1, 1);

// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// Load a texture. See the note in chapter 4 on working locally, or the page
// https://threejs.org/docs/#manual/introduction/How-to-run-things-locally
// if you run into problems here
const texture = textureLoader.load( './js/textures/tostadora.png' );

// Set the "color space" of the texture
texture.encoding = THREE.sRGBEncoding;

// Reduce blurring at glancing angles
texture.anisotropy = 16;

// Create a Standard material using the texture we just loaded as a color map
const material = new THREE.MeshPhongMaterial( {
  map: texture,
} );

// Add the geometry and material to make a shape
let mesh = new THREE.Mesh(geometry, material);

mesh.receiveShadow = true;
mesh.castShadow = true;

// X Y Z position example
// mesh.position.set(-2, 2, -2);
// rotation example
// mesh.rotation.set(45, 0, 0);

scene.add(mesh);
boxes.push(mesh);

let franktexture = textureLoader.load( './js/textures/carmona_head.png' );
franktexture.encoding = THREE.sRGBEncoding;
franktexture.anisotropy = 16;
let frankmaterial = new THREE.MeshPhongMaterial( {
  map: franktexture,
} );
let frankmesh = new THREE.Mesh(geometry, frankmaterial);
frankmesh.position.y = 2;
frankmesh.receiveShadow = true;
frankmesh.castShadow = true;
frankmesh.rotation.set(2, 2, 2);

scene.add(frankmesh);
boxes.push(frankmesh);

// Move up the camera based on height
camera.position.set(0, player.height, 5);

// Look straight forward based on height
camera.lookAt(new THREE.Vector3(0,player.height,0))

// Make the scene render with perspective
var renderer = new THREE.WebGLRenderer({antialias: true});

// Make colors more accurate
renderer.gammaFactor = 2.2;
renderer.gammaOutput = true;

// Add shadows to the scene
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

// Background color of scene
renderer.setClearColor("#7ce0f4");

// Render at the full size of the window
renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild(renderer.domElement);

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Create a directional light
const light = new THREE.DirectionalLight( 0xffffff, 5.0 );

light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 25;

// Move the light back and up a bit
light.position.set( 10, 10, 10 );

scene.add( light );

// Makes shadows not as dark as default
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)


function update() {

    // increase the mesh's rotation each frame
    for (let mesh of boxes){
    mesh.rotation.z += 0.01;
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    }

    // W key
    if(keyboard[87]){
        camera.position.x += -Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= Math.cos(camera.rotation.y) * player.speed;
    }

    // S key
    if(keyboard[83]){
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += Math.cos(camera.rotation.y) * player.speed;
    }

    // A key
    if(keyboard[65]){
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z += Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }

    // D key
    if(keyboard[68]){
        camera.position.x += -Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z -= Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }

    // Left arrow
    if(keyboard[37]){
        camera.rotation.y += player.turnSpeed;
    }
    // Right arrow
    if(keyboard[39]){
        camera.rotation.y -= player.turnSpeed;
    }
}

function render() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop( () => {
    update();
    render();
});

function onMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Set 2nd parameter to true to detect light helper
    let intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length > 0) {
        if(intersects[0].object.name !== "baseplate"){
            this.tl = new TimelineMax();
            this.tl.to(intersects[0].object.scale, 1, {x: 2, ease: Expo.easeOut});
            this.tl.to(intersects[0].object.scale, .5, {x: .5, ease: Expo.easeOut});
            this.tl.to(intersects[0].object.position, .5, {x: 2, ease: Expo.easeOut});
            this.tl.to(intersects[0].object.rotation, .5, {y: Math.PI*.5, ease: Expo.easeOut}, '=-1.5');
            this.tl.to(intersects[0].object.rotation, 1.5, {x: Math.PI*2, ease: Expo.easeOut}, '=-1.5');
        }
    }
}

// Update the size of the canvas when the window is resized
function onWindowResize() {

    // update the size of the renderer AND the canvas
    renderer.setSize(window.innerWidth,window.innerHeight);

    // update the camera's frustum
    camera.updateProjectionMatrix();
    
    // set the aspect ratio to match the new browser window aspect ratio
    camera.aspect = window.innerWidth/window.innerHeight;

}

function keyDown(event){
    keyboard[event.keyCode] = true;
}

function keyUp(event){
    keyboard[event.keyCode] = false;
}

render();

window.addEventListener('click', onMouseMove);
window.addEventListener('resize', onWindowResize)
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
