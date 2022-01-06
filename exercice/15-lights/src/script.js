import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

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
 * Lights
 */

const myObject = {
  myBoolean: false,
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('Ambient Light Intensity')
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('Directional Light Intensity')
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
directionalLightHelper.visible = false
gui.add( myObject, 'myBoolean' ).name('Directional Light Guide').onChange(function(value) {
  directionalLightHelper.visible = value
})
scene.add(directionalLightHelper)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0)
gui.add(hemisphereLight, 'intensity').min(0).max(1).step(0.001).name('Hemisphere Light Intensity')
scene.add(hemisphereLight)

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
hemisphereLightHelper.visible = false
gui.add( myObject, 'myBoolean' ).name('Hemisphere Light Guide').onChange(function(value) {
  hemisphereLightHelper.visible = value
})
scene.add(hemisphereLightHelper)

const pointLight = new THREE.PointLight(0xff9000, 0.30)
pointLight.position.set(1, -0.5, 1)
gui.add(pointLight, 'intensity').min(0).max(1).step(0.001).name('Point Light Intensity')
gui.add(pointLight, 'distance').min(0).max(50).step(1).name('Point Light Distance')
gui.add(pointLight, 'decay').min(0).max(5).step(0.05).name('Point Light Decay')
scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
pointLightHelper.visible = false
gui.add( myObject, 'myBoolean' ).name('Point Light Guide').onChange(function(value) {
  pointLightHelper.visible = value
})
scene.add(pointLightHelper)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
gui.add(rectAreaLight, 'intensity').min(0).max(2).step(0.001).name('Rect Area Light Intensity')
gui.add(rectAreaLight, 'width').min(0).max(10).step(0.5).name('Rect Area Light Width')
gui.add(rectAreaLight, 'height').min(0).max(10).step(0.5).name('Rect Area Light Height')
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
rectAreaLightHelper.visible = false
gui.add( myObject, 'myBoolean' ).name('Rect Area Light Guide').onChange(function(value) {
  rectAreaLightHelper.visible = value
})
scene.add(rectAreaLightHelper)

const spotLight = new THREE.SpotLight(0x78ff00, 0.210, 10, Math.PI * 0.1, 0.60, 1)
gui.add(spotLight, 'intensity').min(0).max(1).step(0.001).name('Spot Light Intensity')
gui.add(spotLight, 'distance').min(0).max(50).step(1).name('Spot Light Distance')
gui.add(spotLight, 'decay').min(0).max(5).step(0.05).name('Spot Light Decay')
gui.add(spotLight, 'angle').min(0).max(Math.PI).step(0.001).name('Spot Light Angle')
gui.add(spotLight, 'penumbra').min(0).max(1).step(0.001).name('Spot Light Penumbra')
spotLight.position.set(0, 2, 3)
spotLight.target.position.set(-0.75, 0, 0)
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
spotLightHelper.visible = false
gui.add( myObject, 'myBoolean' ).name('Spot Light Guide').onChange(function(value) {
  spotLightHelper.visible = value
})
scene.add(spotLightHelper)
window.requestAnimationFrame(() => {
  spotLightHelper.update()
})

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75),
  material
)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()