// Récupération de l'élement Canvas
const canvas = document.querySelector('.webgl');

// Scène
const scene = new THREE.Scene()

// Cube rouge
// Les paramètres étant la taille X Y Z
const geometry = new THREE.BoxGeometry(1, 1, 1) 

// Le matériel avec ici la couleur en rouge
// Possibile d'écrire la couleur sous le format 'red', '#ff0000', 'rgb(25, 10 , 50)', ... ou 0xff0000
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }) 

// Composé de la geométrie et du matériel
const mesh = new THREE.Mesh(geometry, material)

// Ajout de la Mesh sur la scène
scene.add(mesh)

// Taille
// Définition des éléments pour la camera
// Va être appelé dans les paramètres de la caméra
const sizes = {
  width: 800, 
  height: 600
}

// Camera
// TODO Définition des paramètres de la camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

// Placement de la caméra
camera.position.z = 3
camera.position.x = 1
camera.position.y = 1

// Rajout de la camera sur la scène
scene.add(camera)

// Le rendu
// TODO Définition des paramètres pour le rendu
// Methode d'écriture possible en 'canvas: canvas' ou avec la nouvelle méthode comme noté en dessous
const renderer = new THREE.WebGLRenderer({
  canvas
})

// Définir la taille du rendu (canvas) qui est non défini à ce niveau
// Permet de faire correspondre la taille de l'objet et le canvas
renderer.setSize(sizes.width, sizes.height)

// Premier rendu de l'élément
// Les paramètres appelent la scène et la camera dans le canvas
renderer.render(scene, camera)
