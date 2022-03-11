import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/* 
* Models
 */

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let duck = null

gltfLoader.load(

  './models/Duck/glTF-Draco/Duck.gltf',
  // './models/Duck/glTF-Binary/Duck.glb'
  // './models/Duck/glTF-Embedded/Duck.gltf'

  (gltf) => {

    /* console.log(gltf)
    while (gltf.scene.children.length) {
      scene.add(gltf.scene.children[0])
    } */

    duck = gltf.scene
    duck.scale.set(1, 1, 1)
    duck.position.set(0, 0, -2)
    scene.add(duck)
  }
)

gltfLoader.load(

  './models/FlightHelmet/glTF/FlightHelmet.gltf',

  (gltf) => {

    const helmet = gltf.scene
    helmet.scale.set(2, 2, 2)
    helmet.position.set(0, 0, 2)
    helmet.rotateY(Math.PI / 2)
    scene.add(helmet)
  }
)

let mixer = null

gltfLoader.load(

  './models/Fox/glTF/Fox.gltf',

  (gltf) => {

    mixer = new THREE.AnimationMixer(gltf.scene)

    const action = mixer.clipAction(gltf.animations[0])
    const walking = mixer.clipAction(gltf.animations[1])
    const running = mixer.clipAction(gltf.animations[2])

    action["Renard - Animation"] = 'Regarder'
    action.play()

    gui.add(action, 'Renard - Animation', ['Regarder', 'Marche', 'Course', 'Stop']).onChange((value) => {
      if (value === 'Marche') {
        walking.play()
        running.stop()
        action.stop()
      } else if (value === 'Regarder') {
        action.play()
        walking.stop()
        running.stop()
      } else if (value === 'Course') {
        running.play()
        walking.stop()
        action.stop()
      } else {
        action.stop()
        walking.stop()
        running.stop()
      }
    })

    /* gui.add(action, 'play').name('Renard - Déplacer la tête')
    gui.add(walking, 'play').name('Renard - Marcher')
    gui.add(running, 'play').name('Renard - Courir') */

    const fox = gltf.scene
    fox.scale.set(0.025, 0.025, 0.025)
    fox.position.set(0, 0, 0)
    fox.rotateY(Math.PI / 2)
    scene.add(fox)
  }
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5
  })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Update mixer
  if (mixer) {
    mixer.update(deltaTime)
  }

  // Duck vibrator animation
  if (duck) {
    duck.position.y = Math.sin(elapsedTime * 20) * 0.02
    duck.position.x = Math.cos(elapsedTime * 20) * 0.02
    duck.rotation.y = Math.sin(elapsedTime * 20) * 0.01
    duck.rotation.x = Math.cos(elapsedTime * 20) * 0.01
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()