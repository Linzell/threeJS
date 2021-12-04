import './style.css'
import * as THREE from 'three'
import { Camera } from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
/* const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material) */

// A placer avant le RENDER et après création de Mesh
/* mesh.position.x = 0.7
mesh.position.y = - 0.6
mesh.position.z = 1 */

// Permet de noter les 3 ordonnées de la position en une ligne de code
/* mesh.position.set(0.7, -0.6, 1)

scene.add(mesh) */

// Permet d'arrondir les vecteurs sur un seul (XYZ)
/* mesh.position.normalize() */
/* console.log(mesh.position.normalize()) */

// Permet de connaitre la position de l'objet depuis le centre de la scene
/* console.log(mesh.position.length()) */

// Scale
// Permet de définir la taille de l'objet
/* mesh.scale.x = 2
mesh.scale.y = 0.25
mesh.scale.z = 0.5 */

// Rotation
// Permet de définir la rotation de l'objet
// L'ordre permet de définir l'ordre de traitement des axes de rotation
// Math.PI est une rotation complète
/* mesh.rotation.reorder('YXZ') */ // Permet de bloquer l'ordre de rotation // A placer avant les rotations de l'objet
/* mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25 */
/* mesh.rotation.z = Math.PI * 0.25 */

// Group

const group = new THREE.Group()
group.position.y = 1
group.scale.y = 2
group.rotation.y = 1
scene.add(group)

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
)

cube2.position.x = -2
cube3.position.x = 2
group.add(cube1, cube2, cube3)

// Axes Helper
// Rajoute un axe à la scene qui permet visuellement de visualiser les vecteurs
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Quaternion
// Permet de définir la rotation de l'objet pour la camera depuis Vector 3
/* camera.lookAt(new THREE.Vector3(0, 0, 0)) */

/* camera.lookAt(mesh.position) */

// Permet de connaitre la position de l'objet depuis la camera
/* console.log(mesh.position.distanceTo(camera.position)) */

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)