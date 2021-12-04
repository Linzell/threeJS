import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
  width: 800,
  height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Indication de temps
/* let time = Date.now() */

// Clock

const clock = new THREE.Clock()

gsap.to(mesh.position, { duration: 1, delay: 1, x: 2}) // Animation de la position du cube vers la droite après 1 seconde
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0}) // Animation de la position du cube vers la gauche après 2 secondes

// Animation
// Va déclencher la fonction tick toutes les frames
const tick = () => {

  // Clock
  // Compare avec l'initialisation de l'animation
  const elapsedTime = clock.getElapsedTime()

  // Indication de temps
  /* const currentTime = Date.now()
  const deltaTime = currentTime - time
  time = currentTime */

  // Mise à jour de l'objet
  // mesh.rotation.y = 0.001 * deltaTime

  // mesh.rotation.y = elapsedTime * Math.PI * 0.4 // 0.4 = vitesse de rotation
  // mesh.position.y = Math.sin(elapsedTime * 0.7) * 2 // 0.7 = vitesse de déplacement
  // mesh.position.x = Math.cos(elapsedTime * 0.7) * 2 // 0.7 = vitesse de déplacement
  // camera.position.y = Math.sin(elapsedTime) // Déplacement de la camera sur la position Y
  // camera.position.x = Math.cos(elapsedTime) // Déplacement de la camera sur la position X
  // camera.lookAt(mesh.position) // La camera regarde le cube et va s'animer autour de lui

  // Mise à jour de la caméra
  renderer.render(scene, camera)

  // Appel de la fonction tick à nouveau
  window.requestAnimationFrame(tick) // Appel Tick pour la frame suivante
}
tick()