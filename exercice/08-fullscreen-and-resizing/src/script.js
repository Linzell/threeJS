import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

/* 
* Handle resize
*/

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

/* 
* Handle fullscreen
 */

window.addEventListener('dblclick', () => {

  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement

  if (!fullscreenElement) { // if not fullscreen
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } /* else if (canvas.mozRequestFullScreen) {// Version pour Firefox
      canvas.mozRequestFullScreen()
    } */ else if (canvas.webkitRequestFullscreen) { // Version pour Safari
      canvas.webkitRequestFullscreen()
    } /* else if (canvas.msRequestFullscreen) { // Version pour IE
      canvas.msRequestFullscreen()
    } */
  } else { // if fullscreen
    if (document.exitFullscreen) { // Version pour les autres
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) { // Version pour Safari
      document.webkitExitFullscreen()
    } /* else if (document.mozCancelFullScreen) { // Version pour Firefox
      document.mozCancelFullScreen()
    } */ /* else if (document.msExitFullscreen) { // Version pour IE
      document.msExitFullscreen()
    } */
  }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
// renderer.setPixelRatio(window.devicePixelRatio) // Permet de définir le ratio de pixel pour eviter les bugs graphiques
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Va limiter le Ratio sur 2 (2x2)

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