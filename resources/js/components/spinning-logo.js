import * as THREE from 'three';
import { FontLoader } from "three/addons/loaders/FontLoader";
import { oklchToHex } from '../support/oklch-to-hex-number';

/**
 * @param {HTMLElement} root 
 */
const mount = async (root) => {
    const backgroundColor = oklchToHex(window.getComputedStyle(root).backgroundColor);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45,
        root.clientWidth / root.clientHeight,
        0.1,
        1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(root.clientWidth, root.clientHeight);
    root.appendChild(renderer.domElement);

    camera.position.set(0, 0, 50);

    const font = await new Promise((resolve, reject) =>
        new FontLoader().load(
            new URL("../../fonts/toybox.json", import.meta.url).href,
            resolve,
            undefined,
            reject
        )
    );

    const options = { depth: 2, bevelEnabled: false, steps: 1 };
    const shapesA = font.generateShapes("nayr", 10);
    const shapesB = font.generateShapes("ryan", 10);

    const geometryA = new THREE.ExtrudeGeometry(shapesA, options);
    const geometryB = new THREE.ExtrudeGeometry(shapesB, options);

    geometryA.center();
    geometryB.center();

    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
    });
    
    const meshB = new THREE.Mesh(geometryB, material);
    const group = new THREE.Group();

    // Rotate "ryan" to its back face.
    meshB.rotation.y = Math.PI;

    // Create a solid material to essentially do backface culling.
    const fillA = new THREE.MeshBasicMaterial({
        color: backgroundColor,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
    });
    const meshAFill = new THREE.Mesh(geometryA, fillA);
    meshAFill.renderOrder = 0;
    group.add(meshAFill);

    // Create the wireframe material for "nayr".
    const wireframeA = new THREE.EdgesGeometry(geometryA);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: backgroundColor, depthTest: false });
    const wireframeMeshA = new THREE.LineSegments(wireframeA, wireframeMaterial);

    group.add(wireframeMeshA);
    group.add(meshB);

    scene.add(group);

    // drag-to-spin + click-to-flip
    let isDragging = false;
    let startPos = { x: 0, y: 0 };
    let flipped = false;

    renderer.domElement.addEventListener("pointerdown", (e) => {
        isDragging = false;
        startPos = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener("pointermove", (e) => {
        const deltaX = e.clientX - startPos.x;
        if (Math.abs(deltaX) > 2) {
            isDragging = true;
            group.rotation.y += deltaX * 0.005; // adjust sensitivity here
            startPos = { x: e.clientX, y: e.clientY };
        }
    });

    renderer.domElement.addEventListener("pointerup", () => {
        if (!isDragging) {
            // treat as click → flip
            new TWEEN.Tween(group.rotation)
                .to({ y: flipped ? 0 : Math.PI }, 600)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start();
            flipped = !flipped;
        }
    });

    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();
}

export const SpinningLogo = () => {
    document.addEventListener("DOMContentLoaded", () => {
        const root = document.querySelector('[data-component=SpinningLogo]');

        if (! root) {
            return
        }

        mount(root);
    });
}
