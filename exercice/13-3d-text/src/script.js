import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes Helper

/* const axesHelper = new THREE.AxisHelper()
scene.add(axesHelper) */

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcapTexture = textureLoader.load(
  '/textures/matcaps/1.png'
)

/* 
* Fonts
 */

const fontLoader = new FontLoader()


const material = new THREE.MeshMatcapMaterial({
  matcap: matcapTexture,
})

fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {

  const textGeometry = new TextGeometry('Hello Three.js', {
    font: font, // font
    size: 0.5,  // font size
    height: 0.2,  // how much extrusion (how thick / deep are the letters)
    curveSegments: 5,  // number of points on the curves
    bevelEnabled: true,  // whether bevels are enabled
    bevelThickness: 0.03, // how deep are the bevels
    bevelSize: 0.02,  // how far are the bevels
    bevelOffset: 0, // how far are the bevels from the extrusion
    bevelSegments: 4  // number of bevel segments
  })
  textGeometry.center()
  const text = new THREE.Mesh(textGeometry, material)
  scene.add(text)
})
const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

for (let i = 0; i < 500; i++) {
  const donut = new THREE.Mesh(donutGeometry, material)
  donut.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
  donut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
  const scale = Math.random()
  donut.scale.set(scale, scale, scale)
  scene.add(donut)
}


/**
 * Object
 */
/* const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
) */

/* scene.add(cube) */

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()