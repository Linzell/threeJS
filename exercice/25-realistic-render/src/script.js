import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/* 
* Update all materials
*/
const updateMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      /* child.material.envMap = environmentMap */
      child.material.envMapIntensity = debugObject.envMapIntensity
      child.material.needsUpdate = true
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

debugObject.envMapIntensity = 2

/* 
* Loaders 
*/
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/* 
* Envrionnement map 
*/
const load = {
  'Ville': ['/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',],
  'Campagne': ['/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg',],
  'Rue': ['/textures/environmentMaps/2/px.jpg',
    '/textures/environmentMaps/2/nx.jpg',
    '/textures/environmentMaps/2/py.jpg',
    '/textures/environmentMaps/2/ny.jpg',
    '/textures/environmentMaps/2/pz.jpg',
    '/textures/environmentMaps/2/nz.jpg',],
  'Batiment': ['/textures/environmentMaps/3/px.jpg',
    '/textures/environmentMaps/3/nx.jpg',
    '/textures/environmentMaps/3/py.jpg',
    '/textures/environmentMaps/3/ny.jpg',
    '/textures/environmentMaps/3/pz.jpg',
    '/textures/environmentMaps/3/nz.jpg',]
}

let environmentMap = cubeTextureLoader.load(load.Campagne)

gui.add(environmentMap, 'texture', load).onChange((value) => {
  environmentMap = cubeTextureLoader.load(value)
  updateMaterials()
  updateBackground()
}).name('Textures de fonds')

gui.add(debugObject, 'envMapIntensity').min(0).max(5).step(0.001).onChange(updateMaterials).name('Intensité du fond')

const updateBackground = () => {
  environmentMap.encoding = THREE.sRGBEncoding
  scene.background = environmentMap
  scene.environment = environmentMap
}
updateBackground()

/* 
* Models 
*/

const modele = {
  FlightHelmet: './models/FlightHelmet/glTF/FlightHelmet.gltf',
  fox: '/models/Fox/glTF/Fox.gltf',
}

let mixer = null

const chargeModel = (value) => {
  gltfLoader.load(
    value,
    (gltf) => {

      if (modele.fox === value) {
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])
        const walking = mixer.clipAction(gltf.animations[1])
        const running = mixer.clipAction(gltf.animations[2])

        walking["Renard - Animation"] = 'Marche'
        walking.play()
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
      } else {
        mixer = null
      }
      const helmet = gltf.scene
      if (modele.FlightHelmet === value) {
        helmet.scale.set(10, 10, 10)
        helmet.position.set(0, -4, 0)
      } else if (modele.hamburger === value) {
        helmet.scale.set(0.3, 0.3, 0.3)
        helmet.position.set(0, -1, 0)
      } else if (modele.fox === value) {
        helmet.scale.set(0.03, 0.03, 0.03)
        helmet.position.set(0, -1, 0)
      }
      helmet.rotation.y = Math.PI * 0.5
      gui.add(helmet.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('Rotation du modèle')
      scene.add(helmet)

      updateMaterials()
    }
  )
}
const deleteModel = () => {
  var selectedObjects = scene.children.filter(object => object.type === 'Group')
  for (let i = 0; i < selectedObjects.length; i++) {
    scene.remove(selectedObjects[i])
  }
}
chargeModel(modele.fox)
gui.add(gltfLoader, 'texture', modele).onChange((value) => {
  deleteModel()
  chargeModel(value)
}).name('Modèle')

/**
 * Test sphere
 */
/* const testSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial()
)
scene.add(testSphere) */

/* 
* Lights
 */
const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(0.25, 3, - 2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.shadow.mapSize.set(1024, 1024)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('Intensité des lights')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('Position light X')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('Position light Y')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('Position light Z')

/* const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper) */

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
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui
  .add(renderer, 'toneMapping', {
    'Sans rendu': THREE.NoToneMapping,
    'Linear': THREE.LinearToneMapping,
    'Reinhard': THREE.ReinhardToneMapping,
    'Cineon': THREE.CineonToneMapping,
    'ACESFilmic': THREE.ACESFilmicToneMapping
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping)
    updateMaterials()
  })
  .name('Rendu des couleurs')
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001).name('Intensité du rendu')

/**
 * Animate
 */
 const clock = new THREE.Clock()
 let previousTime = 0

/**
 * Animate
 */
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Update mixer
  if (mixer) {
    mixer.update(deltaTime)
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()