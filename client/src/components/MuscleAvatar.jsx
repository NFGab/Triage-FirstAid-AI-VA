import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils, Vector3, Euler } from 'three';
import { Environment } from '@react-three/drei';

function ChibiRobotCharacter({ audioLevel, status }) {
  const groupRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftForearmRef = useRef();
  const rightForearmRef = useRef();
  const leftBicepHydraulicRef = useRef();
  const rightBicepHydraulicRef = useRef();
  const torsoRef = useRef();
  const antennaRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();

  // Target animation state ref
  const targetValues = useRef({
    headRotation: new Euler(),
    torsoScale: new Vector3(1, 1, 1),
    torsoRotation: new Euler(),
    leftArmRotation: new Euler(),
    rightArmRotation: new Euler(),
    leftForearmRotation: new Euler(),
    rightForearmRotation: new Euler(),
    bicepScale: new Vector3(1, 1, 1),
    eyeScale: new Vector3(1, 1, 1),
    eyeYScale: 1
  });

  // Metallic Robot Palette
  const robotColors = {
    metalBody: '#D0D7DE',
    metalDark: '#24292F',
    accentBlue: '#4A90D9',
    accentOrange: '#FF6B35',
    eyeLed: '#00F0FF',
    glowActive: '#2ECC71'
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const t = targetValues.current;

    // Base Idle Motions
    const floatY = Math.sin(time * 2.5) * 0.08;
    const hoverTilt = Math.sin(time * 1.8) * 0.04;
    const blinkCycle = time % 3.5;
    const isBlinking = blinkCycle > 3.3;

    // Default target baselines
    t.headRotation.set(0, 0, 0);
    t.torsoScale.set(1, 1, 1);
    t.torsoRotation.set(0, 0, hoverTilt);
    t.leftArmRotation.set(0, 0, 0.3);
    t.rightArmRotation.set(0, 0, -0.3);
    t.leftForearmRotation.set(0.3, 0, 0);
    t.rightForearmRotation.set(0.3, 0, 0);
    t.bicepScale.set(1, 1, 1);
    t.eyeYScale = isBlinking ? 0.1 : 1;

    let groupYOffset = floatY;

    // --- POSING STATES ---
    if (status === 'listening') {
      // Listening Pose: Tilt head curious/attentive, lean forward
      t.headRotation.set(0.05, 0.25, 0.15);
      t.torsoRotation.set(0.15, 0, 0);
      t.rightArmRotation.set(-1.2, -0.4, -0.3);
      t.rightForearmRotation.set(-1.0, 0, 0); // Hand towards head/ear
      t.leftArmRotation.set(0.2, 0, 0.4);
    } 
    else if (status === 'thinking') {
      // Thinking Pose: Hand under chin, looking up/side, body tilted
      t.headRotation.set(-0.2, -0.3, -0.1);
      t.torsoRotation.set(0.05, -0.1, -0.05);
      
      // Right hand to chin
      t.rightArmRotation.set(-1.8, 0.4, -0.2);
      t.rightForearmRotation.set(-1.5, 0, 0);
      
      // Left arm resting under elbow / supporting pose
      t.leftArmRotation.set(-0.8, -0.3, 0.6);
      t.leftForearmRotation.set(-0.6, 0, 0);
    } 
    else if (status === 'speaking') {
      // Flexing & Answering Pose: Expressive Double Bicep Flex + Dynamic Audio Pulsing
      const flexPulse = 1 + audioLevel * 0.8;
      
      t.headRotation.set(Math.sin(time * 12) * audioLevel * 0.15, 0, 0);
      t.torsoRotation.set(0, 0, Math.sin(time * 8) * 0.05);
      
      // Raised Arm Flex Position
      t.leftArmRotation.set(-1.2, 0.2, 1.4);
      t.rightArmRotation.set(-1.2, -0.2, -1.4);
      t.leftForearmRotation.set(-1.6, 0, 0);
      t.rightForearmRotation.set(-1.6, 0, 0);

      t.bicepScale.set(flexPulse, flexPulse, flexPulse);
      t.torsoScale.set(1 + audioLevel * 0.15, 1 + audioLevel * 0.15, 1 + audioLevel * 0.15);
      groupYOffset += Math.sin(time * 15) * audioLevel * 0.12; // Bouncing audio energy
    } 
    else {
      // Idle Pose: Breathing/hovering softly
      t.leftArmRotation.set(0, 0, 0.3 + Math.sin(time * 2) * 0.05);
      t.rightArmRotation.set(0, 0, -0.3 - Math.sin(time * 2) * 0.05);
    }

    const lerpSpeed = status === 'speaking' ? 10 * delta : 5 * delta;

    // Apply Lerps to R3F Ref Objects
    if (groupRef.current) {
      groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, -0.2 + groupYOffset, lerpSpeed);
    }

    if (headRef.current) {
      headRef.current.rotation.x = MathUtils.lerp(headRef.current.rotation.x, t.headRotation.x, lerpSpeed);
      headRef.current.rotation.y = MathUtils.lerp(headRef.current.rotation.y, t.headRotation.y, lerpSpeed);
      headRef.current.rotation.z = MathUtils.lerp(headRef.current.rotation.z, t.headRotation.z, lerpSpeed);
    }

    if (torsoRef.current) {
      torsoRef.current.rotation.x = MathUtils.lerp(torsoRef.current.rotation.x, t.torsoRotation.x, lerpSpeed);
      torsoRef.current.rotation.z = MathUtils.lerp(torsoRef.current.rotation.z, t.torsoRotation.z, lerpSpeed);
      torsoRef.current.scale.lerp(t.torsoScale, lerpSpeed);
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = MathUtils.lerp(leftArmRef.current.rotation.x, t.leftArmRotation.x, lerpSpeed);
      leftArmRef.current.rotation.y = MathUtils.lerp(leftArmRef.current.rotation.y, t.leftArmRotation.y, lerpSpeed);
      leftArmRef.current.rotation.z = MathUtils.lerp(leftArmRef.current.rotation.z, t.leftArmRotation.z, lerpSpeed);
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = MathUtils.lerp(rightArmRef.current.rotation.x, t.rightArmRotation.x, lerpSpeed);
      rightArmRef.current.rotation.y = MathUtils.lerp(rightArmRef.current.rotation.y, t.rightArmRotation.y, lerpSpeed);
      rightArmRef.current.rotation.z = MathUtils.lerp(rightArmRef.current.rotation.z, t.rightArmRotation.z, lerpSpeed);
    }

    if (leftForearmRef.current) {
      leftForearmRef.current.rotation.x = MathUtils.lerp(leftForearmRef.current.rotation.x, t.leftForearmRotation.x, lerpSpeed);
    }
    if (rightForearmRef.current) {
      rightForearmRef.current.rotation.x = MathUtils.lerp(rightForearmRef.current.rotation.x, t.rightForearmRotation.x, lerpSpeed);
    }

    if (leftBicepHydraulicRef.current && rightBicepHydraulicRef.current) {
      leftBicepHydraulicRef.current.scale.lerp(t.bicepScale, lerpSpeed);
      rightBicepHydraulicRef.current.scale.lerp(t.bicepScale, lerpSpeed);
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = MathUtils.lerp(leftEyeRef.current.scale.y, t.eyeYScale, 20 * delta);
      rightEyeRef.current.scale.y = MathUtils.lerp(rightEyeRef.current.scale.y, t.eyeYScale, 20 * delta);
    }

    if (antennaRef.current) {
      antennaRef.current.rotation.z = Math.sin(time * 6) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Torso / Body Core */}
      <group ref={torsoRef} position={[0, 0.2, 0]}>
        {/* Chest Metallic Block */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.9, 0.8, 0.7]} />
          <meshStandardMaterial color={robotColors.metalBody} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Chest Plate Plate Accent */}
        <mesh position={[0, 0.05, 0.36]}>
          <boxGeometry args={[0.6, 0.45, 0.05]} />
          <meshStandardMaterial color={robotColors.accentBlue} metalness={0.5} roughness={0.4} />
        </mesh>

        {/* FitBuddy Core Emblem */}
        <mesh position={[0, 0.05, 0.39]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color={status === 'speaking' ? robotColors.glowActive : robotColors.accentOrange} emissive={status === 'speaking' ? robotColors.glowActive : '#000000'} emissiveIntensity={0.6} />
        </mesh>

        {/* OVERSIZED CHIBI HEAD */}
        <group ref={headRef} position={[0, 0.95, 0]}>
          {/* Main Head Structure */}
          <mesh>
            <boxGeometry args={[1.2, 1.0, 0.9]} />
            <meshStandardMaterial color={robotColors.metalBody} metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Curved Face Visor Glass */}
          <mesh position={[0, -0.02, 0.46]}>
            <boxGeometry args={[1.0, 0.65, 0.04]} />
            <meshStandardMaterial color={robotColors.metalDark} roughness={0.1} metalness={0.9} />
          </mesh>

          {/* LED Eyes */}
          <group position={[0, 0, 0.49]}>
            <mesh ref={leftEyeRef} position={[0.26, 0.02, 0]}>
              <capsuleGeometry args={[0.08, 0.12, 16, 16]} rotation={[0, 0, Math.PI / 2]} />
              <meshBasicMaterial color={robotColors.eyeLed} />
            </mesh>

            <mesh ref={rightEyeRef} position={[-0.26, 0.02, 0]}>
              <capsuleGeometry args={[0.08, 0.12, 16, 16]} rotation={[0, 0, Math.PI / 2]} />
              <meshBasicMaterial color={robotColors.eyeLed} />
            </mesh>
          </group>

          {/* Chibi Antenna */}
          <group ref={antennaRef} position={[0, 0.55, 0]}>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.2, 12]} />
              <meshStandardMaterial color={robotColors.metalDark} />
            </mesh>
            <mesh position={[0, 0.23, 0]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color={robotColors.accentOrange} emissive={robotColors.accentOrange} emissiveIntensity={status === 'thinking' ? 0.9 : 0.3} />
            </mesh>
          </group>

          {/* Side Head Bolts / Ears */}
          <mesh position={[0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
            <meshStandardMaterial color={robotColors.accentBlue} />
          </mesh>
          <mesh position={[-0.62, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
            <meshStandardMaterial color={robotColors.accentBlue} />
          </mesh>
        </group>

        {/* LEFT ARM */}
        <group ref={leftArmRef} position={[0.55, 0.2, 0]}>
          {/* Shoulder Joint Ball */}
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={robotColors.metalDark} />
          </mesh>
          {/* Bicep / Upper Arm */}
          <mesh position={[0.15, -0.2, 0]}>
            <cylinderGeometry args={[0.12, 0.1, 0.35, 16]} />
            <meshStandardMaterial color={robotColors.metalBody} />
          </mesh>
          {/* Hydraulic Bicep Booster */}
          <mesh ref={leftBicepHydraulicRef} position={[0.18, -0.2, 0.08]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color={robotColors.accentOrange} metalness={0.8} />
          </mesh>
          {/* Left Forearm & Hand */}
          <group ref={leftForearmRef} position={[0.15, -0.4, 0]}>
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[0.2, 0.3, 0.2]} />
              <meshStandardMaterial color={robotColors.accentBlue} />
            </mesh>
            {/* Robot Fist */}
            <mesh position={[0, -0.4, 0]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color={robotColors.metalDark} />
            </mesh>
          </group>
        </group>

        {/* RIGHT ARM */}
        <group ref={rightArmRef} position={[-0.55, 0.2, 0]}>
          {/* Shoulder Joint Ball */}
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={robotColors.metalDark} />
          </mesh>
          {/* Bicep / Upper Arm */}
          <mesh position={[-0.15, -0.2, 0]}>
            <cylinderGeometry args={[0.12, 0.1, 0.35, 16]} />
            <meshStandardMaterial color={robotColors.metalBody} />
          </mesh>
          {/* Hydraulic Bicep Booster */}
          <mesh ref={rightBicepHydraulicRef} position={[-0.18, -0.2, 0.08]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color={robotColors.accentOrange} metalness={0.8} />
          </mesh>
          {/* Right Forearm & Hand */}
          <group ref={rightForearmRef} position={[-0.15, -0.4, 0]}>
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[0.2, 0.3, 0.2]} />
              <meshStandardMaterial color={robotColors.accentBlue} />
            </mesh>
            {/* Robot Fist */}
            <mesh position={[0, -0.4, 0]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshStandardMaterial color={robotColors.metalDark} />
            </mesh>
          </group>
        </group>

        {/* Hover Thruster Base (Replace legs for compact Chibi proportions) */}
        <group position={[0, -0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.15, 0.25, 16]} />
            <meshStandardMaterial color={robotColors.metalDark} />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <coneGeometry args={[0.14, 0.2, 16]} rotation={[Math.PI, 0, 0]} />
            <meshBasicMaterial color={robotColors.eyeLed} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function MuscleAvatar({ audioLevel = 0, status = 'idle' }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '260px' }}>
      <Canvas camera={{ position: [0, 0.8, 4.2], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        <pointLight position={[-10, 5, -5]} intensity={0.6} color="#00F0FF" />

        <ChibiRobotCharacter audioLevel={audioLevel} status={status} />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}