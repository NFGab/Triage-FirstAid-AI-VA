import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function SphereVisualizer({ audioLevel = 0, status = 'idle' }) {
  const containerRef = useRef(null);
  
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

    containerRef.current.innerHTML = '';

    const width = containerRef.current.clientWidth || 320;
    const height = containerRef.current.clientHeight || 320;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Geometry
    const geometry = new THREE.IcosahedronGeometry(1.35, 64);
    const pos = geometry.attributes.position;
    const initialPositions = pos.clone();

    // 3. Materials using Palette: #046241 Castleton Green, #FFB347 Saffron, #FFC370 Earth Yellow, #133020 Dark Serpent
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#046241'),
      roughness: 0.2,
      metalness: 0.7,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.15,
      ior: 1.45,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Outer wireframe shell
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FFB347'),
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    wireframeMesh.scale.set(1.04, 1.04, 1.04);
    scene.add(wireframeMesh);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x046241, 3, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFFB347, 2.5, 50);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Color helper mapping for status
    const getTargetColor = (currStatus) => {
      switch (currStatus) {
        case 'listening': return new THREE.Color('#FFC370'); // Earth Yellow glow
        case 'thinking': return new THREE.Color('#FFB347');  // Saffron pulse
        case 'speaking': return new THREE.Color('#046241');  // Castleton Green
        default: return new THREE.Color('#133020');          // Dark Serpent
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

      const targetColor = getTargetColor(currentStatus);
      material.color.lerp(targetColor, 0.05);
      wireframeMat.color.lerp(targetColor, 0.05);
      pointLight1.color.lerp(targetColor, 0.05);

      currentLevel += (targetAudioLevel - currentLevel) * 0.15;

      sphere.rotation.y = elapsedTime * 0.25;
      sphere.rotation.x = elapsedTime * 0.12;
      wireframeMesh.rotation.y = -elapsedTime * 0.18;

      const basePulse = currentStatus === 'thinking' 
        ? Math.sin(elapsedTime * 6) * 0.08 
        : Math.sin(elapsedTime * 2) * 0.03;

      const scale = 1 + basePulse + (currentLevel * 0.55);
      sphere.scale.set(scale, scale, scale);
      wireframeMesh.scale.set(scale * 1.04, scale * 1.04, scale * 1.04);

      const positions = geometry.attributes.position;
      const initialPos = initialPositions.array;
      const posArray = positions.array;

      const freq = currentStatus === 'speaking' ? 3.8 : 2.2;
      const amp = 0.04 + currentLevel * 0.32;

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
  }, []);

  return (
    <div className="relative w-full h-full min-h-[260px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full absolute inset-0 cursor-pointer" />
    </div>
  );
}
