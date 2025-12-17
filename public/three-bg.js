// Three.js Background with floating geometric shapes
(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Colors
    const colors = [
        0x6366f1, // Purple
        0x8b5cf6, // Violet
        0x3b82f6, // Blue
        0xa855f7, // Pink-purple
    ];

    // Create floating shapes
    const shapes = [];
    const shapeCount = 15;

    // Create different geometries
    const geometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(1, 0),
        new THREE.TetrahedronGeometry(1, 0),
        new THREE.TorusGeometry(0.7, 0.3, 8, 16),
        new THREE.BoxGeometry(1, 1, 1),
    ];

    for (let i = 0; i < shapeCount; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            wireframe: true,
            transparent: true,
            opacity: 0.15 + Math.random() * 0.15,
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position
        mesh.position.x = (Math.random() - 0.5) * 30;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 20 - 10;
        
        // Random scale
        const scale = 0.5 + Math.random() * 1.5;
        mesh.scale.set(scale, scale, scale);
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        // Store animation properties
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01,
            },
            floatSpeed: 0.0005 + Math.random() * 0.001,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: mesh.position.y,
        };
        
        shapes.push(mesh);
        scene.add(mesh);
    }

    // Add some solid shapes for more depth
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.1,
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 25;
        mesh.position.y = (Math.random() - 0.5) * 15;
        mesh.position.z = -15 - Math.random() * 10;
        
        const scale = 1 + Math.random() * 3;
        mesh.scale.set(scale, scale, scale);
        
        mesh.userData = {
            floatSpeed: 0.0003 + Math.random() * 0.0005,
            floatOffset: Math.random() * Math.PI * 2,
            originalY: mesh.position.y,
            pulse: true,
            pulseSpeed: 0.001 + Math.random() * 0.001,
        };
        
        shapes.push(mesh);
        scene.add(mesh);
    }

    camera.position.z = 15;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Smooth camera movement based on mouse
        targetX += (mouseX * 2 - targetX) * 0.02;
        targetY += (mouseY * 2 - targetY) * 0.02;
        
        camera.position.x = targetX;
        camera.position.y = targetY;
        camera.lookAt(0, 0, 0);

        // Animate shapes
        shapes.forEach((shape, index) => {
            const { rotationSpeed, floatSpeed, floatOffset, originalY, pulse, pulseSpeed } = shape.userData;
            
            // Rotation
            if (rotationSpeed) {
                shape.rotation.x += rotationSpeed.x;
                shape.rotation.y += rotationSpeed.y;
                shape.rotation.z += rotationSpeed.z;
            }
            
            // Floating motion
            shape.position.y = originalY + Math.sin(time + floatOffset) * 2;
            
            // Pulse effect for spheres
            if (pulse) {
                const scale = 1 + Math.sin(time * 2 + floatOffset) * 0.1;
                shape.scale.setScalar(shape.scale.x * 0.99 + scale * 0.01);
            }
        });

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

