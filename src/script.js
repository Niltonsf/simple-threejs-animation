import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Axis Helper
 */
// const axisHelper = new THREE.AxesHelper(3);
// scene.add(axisHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcapTexture = textureLoader.load('/textures/matcaps/8.png');

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load(
	'/fonts/helvetiker_regular.typeface.json',
	(font) => {
		const textGeometry = new TextGeometry(
			'Nilton Schumacher F',
			{
				font,
				size: 0.5,
				height: 0.2,
				curveSegments: 5,
				bevelEnabled: true,
				bevelThickness: 0.03,
				bevelSize: 0.02,
				bevelOffset: 0,
				bevelSegments: 4
			}
		);
		// Centering (hard way)
		// textGeometry.computeBoundingBox();
		// textGeometry.translate(
		// 	- (textGeometry.boundingBox.max.x - 0.02) * 0.5,
		// 	- (textGeometry.boundingBox.max.y - 0.02) * 0.5,
		// 	- (textGeometry.boundingBox.max.z - 0.03) * 0.5
		// );
		
		// Centering (easy way)
		textGeometry.center();

		const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture});
		
		const text = new THREE.Mesh(textGeometry, material);
		scene.add(text);

		const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

		for (let i = 0; i < 200; i++) {		
			const donut = new THREE.Mesh(donutGeometry, material);
			
			donut.position.x = (Math.random() - 0.5) * 15;
			donut.position.y = (Math.random() - 0.5) * 15;
			donut.position.z = (Math.random() - 0.5) * 15;

			donut.rotation.x = Math.random() * Math.PI;
			donut.rotation.y = Math.random() * Math.PI;

			const randomDonutSize = Math.random();
			donut.scale.set(randomDonutSize, randomDonutSize, randomDonutSize);
			
			scene.add(donut);
		}
	}
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 0.5
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Events
 */
 let startAnimation = true;
 document.addEventListener("click", () => {
	 startAnimation = false;
	 var timeleft = 6;	 
	 var downloadTimer = setInterval(function(){
		 if(timeleft <= 0){
			 clearInterval(downloadTimer);			 			
			 startAnimation = true;
		 }
		 timeleft -= 1;		
	 }, 1000);		 
 });

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
		const elapsedTime = clock.getElapsedTime();

		// Animating camera		
		// if (startAnimation) {
		// 	camera.position.x = Math.sin(elapsedTime * 0.2) * 10;			
		// 	camera.position.z = Math.cos(elapsedTime * 0.2) * 10;
		// }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()