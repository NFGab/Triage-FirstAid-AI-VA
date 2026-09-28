import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function SphereVisualizer({ audioLevel = 0, status = 'idle' }) {
  const containerRef = useRef(null);
  
  // Use refs to store latest audioLevel & status without triggering useEffect re-mounts
  const audioLevelRef = useRef(audioLevel);
  const statusRef = useRef(status);

  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Ensure container is clean (prevents duplicate canvases)
    containerRef.current.innerHTML = '';

    const width = containerRef.current.clientWidth || 340;
    const height = containerRef.current.clientHeight || 340;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Geometry
    const geometry = new THREE.IcosahedronGeometry(1.4, 64);
    const pos = geometry.attributes.position;
    const initialPositions = pos.clone();

    // 3. Materials
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#3b82f6'),
      roughness: 0.15,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
      transmission: 0.2,
      ior: 1.5,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Outer wireframe shell
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#60a5fa'),
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    wireframeMesh.scale.set(1.05, 1.05, 1.05);
    scene.add(wireframeMesh);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f3ff, 2.5, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 2, 50);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Color helper
    const getTargetColor = (currStatus) => {
      switch (currStatus) {
        case 'listening': return new THREE.Color('#00f3ff'); // Neon cyan
        case 'thinking': return new THREE.Color('#a855f7');  // Purple pulse
        case 'speaking': return new THREE.Color('#10b981');  // Energetic green
        default: return new THREE.Color('#3b82f6');          // Cobalt blue
      }
    };

    let animationFrameId;
    const clock = new THREE.Clock();
    let currentLevel = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      const currentStatus = statusRef.current;
      const targetAudioLevel = audioLevelRef.current;

      // Color interpolation
      const targetColor = getTargetColor(currentStatus);
      material.color.lerp(targetColor, 0.05);
      wireframeMat.color.lerp(targetColor, 0.05);
      pointLight1.color.lerp(targetColor, 0.05);

      // Audio level smoothing
      currentLevel += (targetAudioLevel - currentLevel) * 0.15;

      // Rotation
      sphere.rotation.y = elapsedTime * 0.3;
      sphere.rotation.x = elapsedTime * 0.15;
      wireframeMesh.rotation.y = -elapsedTime * 0.2;

      // Pulse
      const basePulse = currentStatus === 'thinking' 
        ? Math.sin(elapsedTime * 6) * 0.1 
        : Math.sin(elapsedTime * 2) * 0.03;

      const scale = 1 + basePulse + (currentLevel * 0.6);
      sphere.scale.set(scale, scale, scale);
      wireframeMesh.scale.set(scale * 1.05, scale * 1.05, scale * 1.05);

      // Vertex deformation
      const positions = geometry.attributes.position;
      const initialPos = initialPositions.array;
      const posArray = positions.array;

      const freq = currentStatus === 'speaking' ? 4.0 : 2.5;
      const amp = 0.05 + currentLevel * 0.35;

      for (let i = 0; i < posArray.length; i += 3) {
        const vx = initialPos[i];
        const vy = initialPos[i + 1];
        const vz = initialPos[i + 2];

        const wave = Math.sin(vx * freq + elapsedTime * 3) *
                     Math.cos(vy * freq + elapsedTime * 2) *
                     Math.sin(vz * freq + elapsedTime * 4);

        const displacement = 1 + wave * amp;
        posArray[i] = vx * displacement;
        posArray[i + 1] = vy * displacement;
        posArray[i + 2] = vz * displacement;
      }

      positions.needsUpdate = true;
      geometry.computeVertexNormals();

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      geometry.dispose();
      material.dispose();
      wireframeMat.dispose();
      renderer.dispose();
    };
  }, []); // Run ONCE on mount

  return (
    <div className="relative w-full h-full min-h-[320px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-pointer" />
    </div>
  );
}
