
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const container = document.getElementById("three-gallery");

if (container) {

    // Scene
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        38,
        1,
        0.1,
        100
    );

    camera.position.set(0, 0, 7);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    // Main sculpture group
    const sculpture = new THREE.Group();
    scene.add(sculpture);

    // Main glossy 3D object
    const coreGeometry = new THREE.IcosahedronGeometry(1.05, 3);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x75cbb2,
        metalness: 0.38,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.12
    });

    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    sculpture.add(core);

    // Fine geometric wireframe
    const wireGeometry = new THREE.IcosahedronGeometry(1.08, 2);

    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xe9fff6,
        wireframe: true,
        transparent: true,
        opacity: 0.35
    });

    const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    sculpture.add(wireframe);

    // Floating orbital rings
    const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0x536dfe,
        metalness: 0.7,
        roughness: 0.25
    });

    const ringOne = new THREE.Mesh(
        new THREE.TorusGeometry(1.48, 0.018, 12, 120),
        ringMaterial
    );

    ringOne.rotation.set(1.05, 0.35, 0.25);
    sculpture.add(ringOne);

    const ringTwo = new THREE.Mesh(
        new THREE.TorusGeometry(1.72, 0.012, 10, 120),
        new THREE.MeshStandardMaterial({
            color: 0xd49b6a,
            metalness: 0.65,
            roughness: 0.3
        })
    );

    ringTwo.rotation.set(0.35, 1.1, 0.7);
    sculpture.add(ringTwo);

    // Small orbiting sphere
    const satellite = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 24, 24),
        new THREE.MeshStandardMaterial({
            color: 0xffc78d,
            metalness: 0.55,
            roughness: 0.2
        })
    );

    satellite.position.set(1.65, 0.35, 0.2);
    sculpture.add(satellite);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));

    const keyLight = new THREE.PointLight(0xffffff, 35);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x536dfe, 22);
    blueLight.position.set(-4, -2, 3);
    scene.add(blueLight);

    const greenLight = new THREE.PointLight(0x8de2c5, 15);
    greenLight.position.set(0, 3, -3);
    scene.add(greenLight);

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    window.addEventListener("pointermove", (event) => {
        const rect = container.getBoundingClientRect();

        const inside =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;

        if (inside) {
            mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        }
    });

    // Responsive canvas
    function resizeScene() {
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    const resizeObserver = new ResizeObserver(resizeScene);
    resizeObserver.observe(container);

    // Animation
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        if (!reducedMotion) {
            sculpture.rotation.y += 0.003;
            sculpture.rotation.x += 0.0015;

            sculpture.rotation.y +=
                (mouseX * 0.25 - sculpture.rotation.y) * 0.008;

            sculpture.rotation.x +=
                (mouseY * 0.18 - sculpture.rotation.x) * 0.008;

            ringOne.rotation.z += 0.003;
            ringTwo.rotation.x += 0.002;

            satellite.position.x = Math.cos(elapsed * 0.8) * 1.65;
            satellite.position.y = Math.sin(elapsed * 0.8) * 0.65;

            sculpture.position.y = Math.sin(elapsed * 0.8) * 0.08;
        }

        renderer.render(scene, camera);
    }

    animate();

    // Release GPU resources if the page is unloaded
    window.addEventListener("pagehide", () => {
        resizeObserver.disconnect();
        renderer.dispose();
        coreGeometry.dispose();
        coreMaterial.dispose();
        wireGeometry.dispose();
        wireMaterial.dispose();
        ringMaterial.dispose();
    }, { once: true });
}
