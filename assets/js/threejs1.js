const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhongMaterial({ color: 0xff5100 })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

const intensity = 1;
const light = new THREE.DirectionalLight(0xffffff, intensity);
light.position.set(-2, 2, 4);
scene.add(light);

const sizes = {
    width: 500,
    height: 350
}
const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height)
scene.add(camera)

const canvas_dom = document.querySelector("canvas#webgl")
const renderer = new THREE.WebGLRenderer({
    canvas: canvas_dom,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)

camera.position.z = 3;
camera.position.y = 0.7;
camera.position.x = -1;

renderer.render(scene, camera)