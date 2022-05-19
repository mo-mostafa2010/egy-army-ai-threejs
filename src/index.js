import './style.css';
import * as THREE from 'three';
import { Interaction } from 'three.interaction';

var sceneLight, portalLight, clock ,portalParticles = [],smokeParticles = [] ;


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 1,10000);
camera.position.z = 1000;

var renderer = new THREE.WebGLRenderer({antialias: true});


sceneLight = new THREE.DirectionalLight(0xffffff,0.5);
sceneLight.position.set(0,0,1);
scene.add(sceneLight);

portalLight = new THREE.PointLight(0x062d89, 30, 600, 1.7);
portalLight.position.set(0,0,250);
scene.add(portalLight);

const interaction = new Interaction(renderer, scene, camera);

renderer.setSize(window.innerWidth,window.innerHeight);
document.body.append(renderer.domElement);

var geometry = new THREE.BoxGeometry(2,2,2);
var material = new THREE.PointsMaterial({color: 0x0091AD});
var cube = new THREE.Mesh(geometry,material);
// scene.add(cube);
cube.cursor = 'pointer';
cube.on('click', function() {
  setInterval(() => {
    cube.position.z -= 1
  }, 50);

  setTimeout(() => {
    particleSetup()
  }, 1000);

  setTimeout(() => {
    portalParticles.forEach(p => scene.remove(p))
    smokeParticles.forEach(s => scene.remove(s))
    renderCubes()
  }, 2000);
 

});
scene.on('touchstart', ev => {
  console.log(ev);
})
scene.on('touchmove', ev => {
  console.log(ev);
})


const cubePositions = [

  {
    x: 2, 
    y: 2
  },
  {
    x: 2,
    y: -2
  },
  {
    x: -2,
    y: 2
  },
  {
    x: -2,
    y: -2
  },
]

var geometry2 = new THREE.BoxGeometry(0.5,0.5,0.5);
var material2 = new THREE.PointsMaterial({color: 0x6EFAFB});


function renderCubes () {
  cubePositions.forEach(cube => {
    let cube2 = new THREE.Mesh(geometry2,material2);
    cube2.position.set(cube.x,cube.y,-5);
    
  
    cube2.position.z = 995;
    cube2.rotation.x = 30;
    cube2.rotation.y = 50;
  
  scene.add(cube2);
  })
  
}

function particleSetup() {
  let loader = new THREE.TextureLoader();

  loader.load("../smoke.png", function (texture){
    scene.remove(cube)
      var portalGeo = new THREE.PlaneBufferGeometry(350,350);
      var portalMaterial = new THREE.MeshStandardMaterial({
          map:texture,
          transparent: true
      });
      var smokeGeo = new THREE.PlaneBufferGeometry(1000,1000);
      var smokeMaterial = new THREE.MeshStandardMaterial({
          map:texture,
          transparent: true
      });

      for(let p=880;p>250;p--) {
          let particle = new THREE.Mesh(portalGeo,portalMaterial);
          particle.position.set(
              0.5 * p * Math.cos((4 * p * Math.PI) / 180),
              0.5 * p * Math.sin((4 * p * Math.PI) / 180),
              0.1 * p
          );
          particle.rotation.z = Math.random() *360;
          portalParticles.push(particle);
          scene.add(particle);
      }

      for(let p=0;p<40;p++) {
          let particle = new THREE.Mesh(smokeGeo,smokeMaterial);
          particle.position.set(
              Math.random() * 1000-500,
              Math.random() * 400-200,
              25
          );
          particle.rotation.z = Math.random() *360;
          particle.material.opacity = 0.6;
          portalParticles.push(particle);
          scene.add(particle);
      }      
  });
}

scene.add(cube);



cube.position.z = 995;
cube.rotation.x = 10;
cube.rotation.y = 5;


renderer.render(scene,camera);




var animate = function(){
  cube.rotation.x += 0.01;
  // cube2.rotation.x += 0.01;
  var clock = new THREE.Clock();

  let delta = clock.getDelta();
  portalParticles.forEach(p => {
      p.rotation.z -= 0.05 *1.5;
  });
  smokeParticles.forEach(p => {
      p.rotation.z -= 0.05 *0.2;
  });
  if(Math.random() > 0.9) {
      portalLight.power =350 + Math.random()*500;
  }
  renderer.setClearColor(0xffffff, 1)
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
  
}
animate();