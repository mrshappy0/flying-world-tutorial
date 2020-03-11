import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r114/build/three.module.js";
// import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r114/examples/jsm/controls/OrbitControls.js";

// color pallete
var Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xf5986e,
  brownDark: 0x23190f,
  blue: 0x68c3c0
};

// threejs variables
let scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  HEIGHT,
  WIDTH,
  renderer,
  container;

function createScene() {
  // get width and height of screen for aspect ratio
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // createScene
  scene = new THREE.Scene();
  let sea;
  let mesh;
  let geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
  let mat = new THREE.MeshPhongMaterial({
    color: Colors.blue,
    // transparent: true,
    // opacity: 0.6,
    flatShading: true
  });
  mesh = new THREE.Mesh(geom, mat);
  mesh.position.y = -600;
  scene.add(mesh);

  // create camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 1000;
  camera = new THREE.PerspectiveCamera(
    aspectRatio,
    fieldOfView,
    nearPlane,
    farPlane
  );

  // add fog to background color; same color as background
  new THREE.Fog(0xf7d9aa, 100, 950);

  // set the position of the camera
  camera.position.x = 0;
  camera.position.y = 200;
  camera.position.z = 100;

  // create the renderer
  // allow transparency to show the gradient background
  // activate the anti-aliasing; this is less performant but low-poly based proj makes it ok.
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  // Define size of the renderer; in this case the size of the screen
  renderer.setSize(WIDTH, HEIGHT);

  // Enable shadow rendering
  renderer.shadowMap.enabled = true;

  // Add the DOM element of the renderer to the container we created in the HTML
  container = document.getElementById("world");
  container.appendChild(renderer.domElement);

  // Listen to the screen: if the user resizes it
  // we have to update the camera and the renderer size
  window.addEventListener("resize", handleWindowResize, false);
}

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / WIDTH;
  // predefined threejs function to update any camera parameters
  camera.updateProjectionMatrix();
}

var ambientLight, hemisphereLight, shadowLight;

function createLights() {
  // A hemisphere light is a gradient colored light;
  // the first param is the sky color, the second  is the ground color
  // the third is the intensity of the light
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  //directional lighting shines from specific direction
  // It can act like the sun
  shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
  shadowLight.position.set(150, 350, 350);

  // Allow shadow casting
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // define the resolution of the shadow; the higher the better
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // to activate the lights, add to scene
  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

// define a sea object
// let Sea;
class Sea {
  constructor() {
    // create the geo of the cylinder
    // w/ params: radius top, rad bottom, height, num of segments on the radius, num vertically
    let geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    // rotate the geo on the x-axis
    geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    // create the material
    let mat = new THREE.MeshPhongMaterial({
      color: Colors.blue,
      // transparent: true,
      // opacity: 0.6,
      flatShading: true
    });
    // create an object in three.js.
    // create with combo of geo and mesh
    this.mesh = new THREE.Mesh(geom, mat);
    // create sea shadows
    this.mesh.receiveShadow = true;
  }
}

// initialize the sea
let sea;

function createSea() {
  sea = new Sea();

  // push it a little bit at the bottom of the scene
  sea.mesh.position.y = -600;

  scene.add(sea.mesh);
}

function loop(sea) {
  updatePlane();
  sea.mesh.rotation.z += 0.005;
  sky.mesh.rotation.z += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function main() {
  // set up scene, the camera and the renderer.
  createScene();

  // add the lights
  createLights();

  // add objects
  createSea();
  //   createPlane();
  //   createSky();

  // start a loop that will update the objects' positions
  // and render the scene on each frame.
  loop();
}

window.addEventListener("load", main, false);
