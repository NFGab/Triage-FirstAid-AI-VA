import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MathUtils, Vector3, Euler } from 'three';
import { Environment } from '@react-three/drei';

function MuscleCharacter({ audioLevel, status }) {
  const groupRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftBicepRef = useRef();
  const rightBicepRef = useRef();
  const leftHandRef = useRef();
  const rightHandRef = useRef();
  const torsoRef = useRef();
  const eyesRef = useRef();
  const leftPupilRef = useRef();
  const rightPupilRef = useRef();

  // State trackers for smooth transitions
  const targetValues = useRef({
    headRotation: new Euler(),
    torsoScale: new Vector3(1, 1, 1),
    torsoRotation: new Euler(),
    leftArmRotation: new Euler(),
    rightArmRotation: new Euler(),
    leftElbowRotation: new Euler(),
    rightElbowRotation: new Euler(),
    pupilScale: new Vector3(1, 1, 1),
    pupilPosition: new Vector3(0, 0, 0.11),
    eyeBlinkScale: new Vector3(1, 1, 1)
  });

  // Colors
  const colors = {
    skin: '#FFB088',
    shirt: '#4A90D9',
    shorts: '#2C3E6B',
    headband: '#FF6B35',
    eyeWhite: '#FFFFFF',
    pupil: '#111111',
    mouth: '#FF4444'
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const t = targetValues.current;
    
    // Base Idle animations
    let breathScale = 1 + Math.sin(time * 2) * 0.02;
    let sway = Math.sin(time * 1.5) * 0.05;
    
    // Blinking logic (every 3-5 seconds)
    const blinkCycle = time % 4;
    const isBlinking = blinkCycle > 3.8;
    const currentBlinkScale = isBlinking ? 0.1 : 1;

    // Reset targets to base
    t.headRotation.set(0, 0, 0);
    t.torsoScale.set(1, 1, 1);
    t.torsoRotation.set(0, 0, sway);
    t.leftArmRotation.set(0, 0, 0.2); // Rest by side
    t.rightArmRotation.set(0, 0, -0.2); // Rest by side
    t.leftElbowRotation.set(0, 0, 0);
    t.rightElbowRotation.set(0, 0, 0);
    t.pupilScale.set(1, 1, 1);
    t.pupilPosition.set(0, 0, 0.11);
    t.eyeBlinkScale.set(1, currentBlinkScale, 1);
    let groupYPos = 0;
    
    let bicepScaleMultiplier = 1;

    // Apply State specific targets
    if (status === 'listening') {
      t.torsoRotation.set(0.2, 0, 0); // Lean forward
      t.headRotation.set(-0.1, 0.3, 0);
      t.rightArmRotation.set(-2.5, 0, -0.5); // Hand to ear
      t.rightElbowRotation.set(-1.5, 0, 0);
      t.pupilScale.set(1.4, 1.4, 1.4); // Wide eyes
    } 
    else if (status === 'thinking') {
      t.headRotation.set(0.1, -0.2, 0.1);
      t.leftArmRotation.set(0, 0, 0.5); // Arm on hip
      t.leftElbowRotation.set(-1.5, 0, 0);
      t.rightArmRotation.set(-2, 0, -0.2); // Hand on chin
      t.rightElbowRotation.set(-2, 0, 0);
      t.pupilPosition.set(0, 0.05, 0.1); // Look up
    }
    else if (status === 'speaking') {
      // DOUBLE BICEP FLEX
      t.leftArmRotation.set(-1.5, 0, 1.5); // Arms raised
      t.rightArmRotation.set(-1.5, 0, -1.5);
      t.leftElbowRotation.set(-1.5, 0, 0); // Fists pointing up/in
      t.rightElbowRotation.set(-1.5, 0, 0);
      
      const audioPulse = audioLevel * 0.3; // Scale up based on audio
      t.torsoScale.set(1 + audioPulse, 1 + audioPulse, 1 + audioPulse);
      bicepScaleMultiplier = 1 + audioLevel * 0.5;
      
      groupYPos = Math.sin(time * 15) * audioLevel * 0.1; // Bounce
      
      // Head bobs slightly
      t.headRotation.set(Math.sin(time * 10) * audioLevel * 0.1, 0, 0);
    }
    else {
      // 'idle'
      t.leftArmRotation.set(0, 0, 0.2 + Math.sin(time) * 0.05);
      t.rightArmRotation.set(0, 0, -0.2 - Math.sin(time) * 0.05);
    }

    // Lerp values
    const lerpSpeed = status === 'speaking' ? 8 * delta : 4 * delta;
    
    if (groupRef.current) {
        groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, groupYPos, lerpSpeed);
    }

    if (headRef.current) {
      headRef.current.rotation.x = MathUtils.lerp(headRef.current.rotation.x, t.headRotation.x, lerpSpeed);
      headRef.current.rotation.y = MathUtils.lerp(headRef.current.rotation.y, t.headRotation.y, lerpSpeed);
      headRef.current.rotation.z = MathUtils.lerp(headRef.current.rotation.z, t.headRotation.z, lerpSpeed);
    }

    if (torsoRef.current) {
      torsoRef.current.rotation.x = MathUtils.lerp(torsoRef.current.rotation.x, t.torsoRotation.x, lerpSpeed);
      torsoRef.current.rotation.z = MathUtils.lerp(torsoRef.current.rotation.z, t.torsoRotation.z, lerpSpeed);
      
      const targetTorsoScaleX = t.torsoScale.x * breathScale;
      const targetTorsoScaleY = t.torsoScale.y * breathScale;
      const targetTorsoScaleZ = t.torsoScale.z * breathScale;
      
      torsoRef.current.scale.lerp(new Vector3(targetTorsoScaleX, targetTorsoScaleY, targetTorsoScaleZ), lerpSpeed);
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

    if (leftHandRef.current) {
        leftHandRef.current.rotation.x = MathUtils.lerp(leftHandRef.current.rotation.x, t.leftElbowRotation.x, lerpSpeed);
    }
    if (rightHandRef.current) {
        rightHandRef.current.rotation.x = MathUtils.lerp(rightHandRef.current.rotation.x, t.rightElbowRotation.x, lerpSpeed);
    }

    if (leftBicepRef.current && rightBicepRef.current) {
        leftBicepRef.current.scale.lerp(new Vector3(bicepScaleMultiplier, bicepScaleMultiplier, bicepScaleMultiplier), lerpSpeed);
        rightBicepRef.current.scale.lerp(new Vector3(bicepScaleMultiplier, bicepScaleMultiplier, bicepScaleMultiplier), lerpSpeed);
    }

    if (eyesRef.current) {
        eyesRef.current.scale.lerp(t.eyeBlinkScale, 15 * delta); // Fast blink lerp
    }
    
    if (leftPupilRef.current) {
        leftPupilRef.current.scale.lerp(t.pupilScale, lerpSpeed);
        leftPupilRef.current.position.lerp(t.pupilPosition, lerpSpeed);
    }
    if (rightPupilRef.current) {
        rightPupilRef.current.scale.lerp(t.pupilScale, lerpSpeed);
        rightPupilRef.current.position.lerp(t.pupilPosition, lerpSpeed);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Torso Group */}
      <group ref={torsoRef} position={[0, 1.5, 0]}>
        {/* Shirt/Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.5, 1.2, 32]} />
          <meshStandardMaterial color={colors.shirt} />
        </mesh>
        
        {/* Pecs / Chest */}
        <mesh position={[0.25, 0.3, 0.55]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.2]} />
          <meshStandardMaterial color={colors.shirt} />
        </mesh>
        <mesh position={[-0.25, 0.3, 0.55]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.2]} />
          <meshStandardMaterial color={colors.shirt} />
        </mesh>

        {/* Head */}
        <group ref={headRef} position={[0, 0.9, 0]}>
          {/* Neck */}
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 0.3, 16]} />
            <meshStandardMaterial color={colors.skin} />
          </mesh>
          {/* Head Sphere */}
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={colors.skin} />
          </mesh>
          {/* Headband */}
          <mesh position={[0, 0.15, 0]} rotation={[-0.1, 0, 0]}>
            <torusGeometry args={[0.48, 0.08, 16, 32]} />
            <meshStandardMaterial color={colors.headband} />
          </mesh>
          {/* Eyes Group */}
          <group ref={eyesRef} position={[0, 0.05, 0.38]}>
            {/* Left Eye */}
            <group position={[0.2, 0, 0]}>
              <mesh>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={colors.eyeWhite} />
              </mesh>
              <mesh ref={leftPupilRef} position={[0, 0, 0.11]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color={colors.pupil} />
              </mesh>
            </group>
            {/* Right Eye */}
            <group position={[-0.2, 0, 0]}>
              <mesh>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color={colors.eyeWhite} />
              </mesh>
              <mesh ref={rightPupilRef} position={[0, 0, 0.11]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial color={colors.pupil} />
              </mesh>
            </group>
          </group>
          {/* Smile */}
          <mesh position={[0, -0.15, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.15, 0.03, 16, 32, Math.PI]} />
            <meshStandardMaterial color={colors.mouth} />
          </mesh>
        </group>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[0.8, 0.4, 0]}>
          {/* Shoulder */}
          <mesh>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color={colors.shirt} />
          </mesh>
          {/* Upper Arm */}
          <mesh position={[0.1, -0.3, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.15, 0.12, 0.6, 16]} />
            <meshStandardMaterial color={colors.skin} />
          </mesh>
          {/* Bicep bump */}
          <mesh ref={leftBicepRef} position={[0.15, -0.3, 0.1]} rotation={[0, 0, -0.2]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color={colors.skin} />
          </mesh>
          {/* Forearm & Hand */}
          <group ref={leftHandRef} position={[0.2, -0.65, 0]}>
            {/* Elbow */}
            <mesh>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={colors.skin} />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.12, 0.08, 0.6, 16]} />
              <meshStandardMaterial color={colors.skin} />
            </mesh>
            {/* Hand (Fist) */}
            <mesh position={[0, -0.7, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={colors.skin} />
            </mesh>
          </group>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[-0.8, 0.4, 0]}>
          {/* Shoulder */}
          <mesh>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color={colors.shirt} />
          </mesh>
          {/* Upper Arm */}
          <mesh position={[-0.1, -0.3, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.15, 0.12, 0.6, 16]} />
            <meshStandardMaterial color={colors.skin} />
          </mesh>
          {/* Bicep bump */}
          <mesh ref={rightBicepRef} position={[-0.15, -0.3, 0.1]} rotation={[0, 0, 0.2]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color={colors.skin} />
          </mesh>
          {/* Forearm & Hand */}
          <group ref={rightHandRef} position={[-0.2, -0.65, 0]}>
            {/* Elbow */}
            <mesh>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={colors.skin} />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.12, 0.08, 0.6, 16]} />
              <meshStandardMaterial color={colors.skin} />
            </mesh>
            {/* Hand (Fist) */}
            <mesh position={[0, -0.7, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={colors.skin} />
            </mesh>
          </group>
        </group>
        
        {/* Shorts */}
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.7, 0.65, 0.4, 32]} />
          <meshStandardMaterial color={colors.shorts} />
        </mesh>
      </group>

      {/* Legs */}
      {/* Left Leg */}
      <group position={[0.3, 0.6, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.15, 1.2, 16]} />
          <meshStandardMaterial color={colors.skin} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.6, 0.1]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.5]} />
          <meshStandardMaterial color={colors.shorts} />
        </mesh>
      </group>
      {/* Right Leg */}
      <group position={[-0.3, 0.6, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.15, 1.2, 16]} />
          <meshStandardMaterial color={colors.skin} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.6, 0.1]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.5]} />
          <meshStandardMaterial color={colors.shorts} />
        </mesh>
      </group>
    </group>
  );
}

export default function MuscleAvatar({ audioLevel = 0, status = 'idle' }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '260px' }}>
      <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, 5, -5]} intensity={0.5} />
        
        <MuscleCharacter audioLevel={audioLevel} status={status} />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
