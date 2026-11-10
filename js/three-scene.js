
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const container = document.getElementById('three-hero');

if (!container) {
    console.error('Three.js container not found.');
} else {
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.z = 10;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 2));

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(4, 5, 8);
    scene.add(light);

    // Materials
    const materials = [
        new THREE.MeshPhysicalMaterial({
            color: 0x536dfe,
            metalness: 0.25,
            roughness: 0.2,
            clearcoat: 1
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0xff806b,
            metalness: 0.15,
            roughness: 0.25,
            clearcoat: 1
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0xa8d9c8,
            metalness: 0.2,
            roughness: 0.18,
            clearcoat: 1
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0xf5d76e,
            metalness: 0.3,
            roughness: 0.2
        })
    ];

    // Create floating 3D objects
    const objects = [];

    function addObject(geometry, material, x, y, z, scale) {
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(x, y, z);
        mesh.scale.setScalar(scale);

        scene.add(mesh);

        objects.push({
            mesh,
            originalY: y,
            speed: 0.5 + Math.random() * 0.6,
            rotationSpeed: 0.002 + Math.random() * 0.004
        });
    }

    addObject(
        new THREE.IcosahedronGeometry(0.8, 1),
        materials[0], -4.1, 1.8, 0, 0.8
    );

    addObject(
        new THREE.TorusGeometry(0.75, 0.22, 24, 80),
        materials[1], 4.2, 1.4, -0.5, 0.9
    );

    addObject(
        new THREE.SphereGeometry(0.75, 48, 48),
        materials[2], -4.3, -2, 0, 0.8
    );

    addObject(
        new THREE.TorusKnotGeometry(0.55, 0.16, 100, 16),
        materials[3], 4, -2, 0, 0.8
    );

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('pointermove', (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5);
        mouseY = (event.clientY / window.innerHeight - 0.5);
    });

    // Animation
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        objects.forEach((item, index) => {
            const mesh = item.mesh;

            mesh.position.y =
                item.originalY +
                Math.sin(time * item.speed + index) * 0.18;

            mesh.rotation.x += item.rotationSpeed;
            mesh.rotation.y += item.rotationSpeed * 1.4;
        });

        camera.position.x +=
            (mouseX * 0.45 - camera.position.x) * 0.025;

        camera.position.y +=
            (-mouseY * 0.35 - camera.position.y) * 0.025;

        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();

    // Responsive resizing
    const resizeObserver = new ResizeObserver(() => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    });

    resizeObserver.observe(container);
}
