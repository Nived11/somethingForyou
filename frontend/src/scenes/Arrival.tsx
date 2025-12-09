import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// VISIBLE STARS - Lower in sky
const TwinklingStars = () => {
  const starsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (starsRef.current) {
      const time = state.clock.getElapsedTime();
      const material = starsRef.current.material as THREE.PointsMaterial;
      material.opacity = Math.sin(time * 0.5) * 0.2 + 0.8;
    }
  });

  const starCount = 3000;
  const positions = new Float32Array(starCount * 3);
  
  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 150;
    positions[i * 3+ 1] = Math.random() * 40 + 8; // Lower in sky
    positions[i * 3 + 2] = (Math.random() - 0.5) * 150;
  }

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={starCount}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color="#FFFFFF"
        transparent
        opacity={1}
        sizeAttenuation={false}
        depthWrite={false}
        fog={false}
      />
    </points>
  );
};

// BRIGHT VISIBLE MOON - Lower position
const Moon = () => {
  return (
    <group position={[20, 34, -80]}>
      
      <mesh>
        <sphereGeometry args={[5, 30, 35]} />
        <meshBasicMaterial
          color="#ececec95"
          transparent
          opacity={0.9}
          fog={false}
          depthWrite={false}
        />
      </mesh>
     
    </group>
  );
};

// Trees for forest background
const Tree = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[1.5, 3, 8]} />
        <meshStandardMaterial color="#1a4d1a" />
      </mesh>
      <mesh position={[0, 4.5, 0]}>
        <coneGeometry args={[1.2, 2.5, 8]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>
    </group>
  );
};

// Forest Background
const Forest = () => {
  const trees = [];
  
  // Trees behind house
  for (let i = 0; i < 15; i++) {
    const x = (Math.random() - 0.5) * 30;
    const z = -20 - Math.random() * 10;
    trees.push(<Tree key={`back-${i}`} position={[x, 0, z]} />);
  }
  
  // Trees on sides
  for (let i = 0; i < 10; i++) {
    trees.push(<Tree key={`left-${i}`} position={[-15 - Math.random() * 10, 0, (Math.random() - 0.5) * 40]} />);
    trees.push(<Tree key={`right-${i}`} position={[15 + Math.random() * 10, 0, (Math.random() - 0.5) * 40]} />);
  }
  
  return <>{trees}</>;
};

// Green Grass Ground
const Ground = () => {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#2d5016" roughness={0.9} />
      </mesh>
      
      {/* Grass blades */}
      {Array.from({ length: 300 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 50,
            0.1,
            (Math.random() - 0.5) * 50
          ]}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
        >
          <coneGeometry args={[0.08, 0.4, 3]} />
          <meshStandardMaterial color="#3d6b2c" />
        </mesh>
      ))}
    </>
  );
};

// Path Lamps
const Lamp = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
        <meshStandardMaterial color="#333333" metalness={0.8} />
      </mesh>
      {/* Lamp head */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 0.4, 8]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* Light bulb */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700" 
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight position={[0, 3, 0]} intensity={4} distance={10} color="#FFD700" />
    </group>
  );
};

// Lamps along the path
const PathLamps = () => {
  const lamps = [];
  for (let i = 0; i < 8; i++) {
    const z = 10 - i * 3;
    lamps.push(<Lamp key={`left-${i}`} position={[-2, 0, z]} />);
    lamps.push(<Lamp key={`right-${i}`} position={[2, 0, z]} />);
  }
  return <>{lamps}</>;
};

// Path
const Path = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <planeGeometry args={[2.5, 35]} />
      <meshStandardMaterial color="#8B7355" roughness={0.9} />
    </mesh>
  );
};

// Realistic House with more details
const House = () => {
  return (
    <group position={[0, 0, -14]}>
      {/* Main House Body - Textured walls */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[6, 4.5, 5]} />
        <meshStandardMaterial color="#F5E6D3" roughness={0.8} />
      </mesh>
      
      {/* Brick texture simulation - horizontal lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`brick-${i}`} position={[0, 0.5 + i * 0.5, 2.51]}>
          <boxGeometry args={[6, 0.05, 0.01]} />
          <meshStandardMaterial color="#D4B896" />
        </mesh>
      ))}
      
      {/* Roof - More realistic with tiles */}
      <mesh position={[0, 5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <coneGeometry args={[4, 2.5, 4]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>
      
      {/* Roof tiles effect */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`tile-${i}`} position={[(i % 3 - 1) * 1.5, 4.8 + Math.floor(i / 3) * 0.15, (Math.floor(i / 3) - 2) * 0.8]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[1.3, 0.05, 0.6]} />
          <meshStandardMaterial color="#A0522D" />
        </mesh>
      ))}
      
      {/* Chimney with bricks */}
      <mesh position={[2, 5.5, 1.2]} castShadow>
        <boxGeometry args={[0.6, 2, 0.6]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      
      {/* Chimney top */}
      <mesh position={[2, 6.6, 1.2]}>
        <boxGeometry args={[0.7, 0.2, 0.7]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Door with panels */}
      <mesh position={[0, 1.8, 2.80]}>
        <boxGeometry args={[1.2, 2.4, 0.15]} />
        <meshStandardMaterial color="#654321" roughness={0.6} />
      </mesh>
      
      {/* Door panels */}
      <mesh position={[0, 1.8, 2.58]}>
        <boxGeometry args={[0.9, 0.7, 0.02]} />
        <meshStandardMaterial color="#5C3A21" />
      </mesh>
      <mesh position={[0, 0.8, 2.58]}>
        <boxGeometry args={[0.9, 0.7, 0.02]} />
        <meshStandardMaterial color="#5C3A21" />
      </mesh>
      
      {/* Door Knob - brass */}
      <mesh position={[0.4, 1.2, 2.6]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2} />
      </mesh>
      
      {/* Door frame */}
      <mesh position={[0, 1.2, 2.52]}>
        <boxGeometry args={[1.35, 2.55, 0.1]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Windows with frames */}
      <group position={[-2, 2.5, 2.51]}>
        <mesh>
          <boxGeometry args={[1.2, 1.4, 0.08]} />
          <meshStandardMaterial color="#87CEEB" emissive="#FFD700" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.25, 0.05, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[1.45, 0.05, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
      
      <group position={[2, 2.5, 2.51]}>
        <mesh>
          <boxGeometry args={[1.2, 1.4, 0.08]} />
          <meshStandardMaterial color="#87CEEB" emissive="#FFD700" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.25, 0.05, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[1.45, 0.05, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
      
      {/* Porch floor with wood planks */}
      <mesh position={[0, 0.2, 3.5]} receiveShadow>
        <boxGeometry args={[6.5, 0.4, 2.5]} />
        <meshStandardMaterial color="#A0826D" roughness={0.85} />
      </mesh>
      
      {/* Wood plank lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`plank-${i}`} position={[-3 + i * 0.7, 0.41, 3.5]}>
          <boxGeometry args={[0.05, 0.01, 2.5]} />
          <meshStandardMaterial color="#8B6F47" />
        </mesh>
      ))}
      
      {/* Porch roof */}
      <mesh position={[0, 3.8, 4.2]} rotation={[0.45, 0, 0]}>
        <boxGeometry args={[6.8, 0.1, 1.7]} />
        <meshStandardMaterial color="#490b0dff" />
      </mesh>
      
      {/* Porch Pillars - detailed */}
      <mesh position={[-2.8, 1.7, 4.5]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 3.4, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      <mesh position={[-2.8, 0.2, 4.5]}>
        <cylinderGeometry args={[0.25, 0.25, 0.3, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-2.8, 3.4, 4.5]}>
        <cylinderGeometry args={[0.25, 0.18, 0.3, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      <mesh position={[2.8, 1.7, 4.5]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 3.4, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      <mesh position={[2.8, 0.2, 4.5]}>
        <cylinderGeometry args={[0.25, 0.25, 0.3, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[2.8, 3.4, 4.5]}>
        <cylinderGeometry args={[0.25, 0.18, 0.3, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Mailbox next to door */}
      <group position={[-1.5, 1.3, 3.2]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.3, 0.4, 0.2]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.25, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} />
        </mesh>
      </group>
      
      {/* Welcome mat */}
      <mesh position={[0, 0.41, 2.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[1.5, 0.8, 0.02]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>
      
      {/* Porch Lights - lantern style */}
      <group position={[-1.8, 2.8, 3.8]}>
        <mesh>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshStandardMaterial color="#2C2C2C" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.15, 0.35, 0.15]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={1.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={3} distance={10} color="#FFD700" />
      </group>
      
      <group position={[1.8, 2.8, 3.8]}>
        <mesh>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshStandardMaterial color="#2C2C2C" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.15, 0.35, 0.15]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={1.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={3} distance={10} color="#FFD700" />
      </group>
      
      {/* House number */}
      <mesh position={[0.8, 2.8, 2.52]}>
        <boxGeometry args={[0.3, 0.4, 0.02]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} />
      </mesh>
    </group>
  );
};

// Ultra Realistic Character
// FIXED Character with Natural Hands
const Character = ({ position, rotation }: { position: [number, number, number]; rotation: number }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Feet */}
      <mesh position={[-0.15, 0.08, 0]} castShadow>
        <boxGeometry args={[0.18, 0.16, 0.28]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.15, 0.08, 0]} castShadow>
        <boxGeometry args={[0.18, 0.16, 0.28]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Ankles */}
      <mesh position={[-0.15, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.08, 16]} />
        <meshStandardMaterial color="#FFD1A1" />
      </mesh>
      <mesh position={[0.15, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.08, 16]} />
        <meshStandardMaterial color="#FFD1A1" />
      </mesh>
      
      {/* Lower legs */}
      <mesh position={[-0.15, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[0.15, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      
      {/* Knees */}
      <mesh position={[-0.15, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[0.15, 0.78, 0]} castShadow>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      
      {/* Upper legs */}
      <mesh position={[-0.15, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[0.15, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      
      {/* Hips */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.5, 0.25, 0.35]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      
      {/* Waist */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#E91E63" />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <boxGeometry args={[0.55, 0.65, 0.38]} />
        <meshStandardMaterial color="#E91E63" />
      </mesh>
      
      {/* Shoulders */}
      <mesh position={[-0.32, 2.25, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#E91E63" />
      </mesh>
      <mesh position={[0.32, 2.25, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#E91E63" />
      </mesh>
      
      {/* LEFT ARM - FIXED */}
      {/* Upper arm */}
      <mesh position={[-0.37, 2.0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.075, 0.5, 16]} />
        <meshStandardMaterial color="#E91E63" />
      </mesh>
      
      {/* Elbow */}
      <mesh position={[-0.38, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#FFD1A1" />
      </mesh>
      
      {/* Forearm */}
      <mesh position={[-0.38, 1.5, 0]}  castShadow>
        <cylinderGeometry args={[0.07, 0.065, 0.5, 16]} />
        <meshStandardMaterial color="#FFD1A1" />
      </mesh>
      
      
      {/* RIGHT ARM - FIXED */}
      {/* Upper arm */}
      <mesh position={[0.37, 2.0, 0]}  castShadow>
        <cylinderGeometry args={[0.08, 0.075, 0.5, 16]} />
        <meshStandardMaterial color="#E91E63" />
      </mesh>
      
      {/* Elbow */}
      <mesh position={[0.37, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#FFD1A1" />
      </mesh>
      
      {/* Forearm */}
      <mesh position={[0.37, 1.5, 0]}  castShadow>
        <cylinderGeometry args={[0.07, 0.065, 0.5, 16]} />
        <meshStandardMaterial color="#FFD1A1" />
      </mesh>
      
      
      {/* Head */}
      <mesh position={[0, 2.92, 0]} castShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#FFD1A1" />
      </mesh>
      
      {/* Long Hair */}
      <mesh position={[0, 2.92, 0]} castShadow>
        <sphereGeometry args={[0.36, 32, 32]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      
      <mesh position={[0, 2.65, -0.25]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      
      <mesh position={[-0.25, 2.4, 0]} castShadow>
        <boxGeometry args={[0.15, 1.2, 0.25]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      
      <mesh position={[0.25, 2.4, 0]} castShadow>
        <boxGeometry args={[0.15, 1.2, 0.25]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      
      <mesh position={[0, 2.8, 0.28]} castShadow>
        <boxGeometry args={[0.45, 0.15, 0.1]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      
      <mesh position={[-0.3, 2.7, 0.15]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.12]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      <mesh position={[0.3, 2.7, 0.15]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.12]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      
  
    </group>
  );
};


// Camera Controller
const CameraController = ({ targetPosition }: { targetPosition: [number, number, number] }) => {
  useFrame(({ camera }) => {
    const targetCameraPos = new THREE.Vector3(
      targetPosition[0],
      targetPosition[1] + 4,
      targetPosition[2] + 7
    );
    
    camera.position.lerp(targetCameraPos, 0.08);
    
    const lookAtTarget = new THREE.Vector3(
      targetPosition[0],
      targetPosition[1] + 1.5,
      targetPosition[2] - 3
    );
    camera.lookAt(lookAtTarget);
  });
  
  return null;
};

const Arrival = ({ data = { recipientName: 'You', senderName: 'Me' }, onNext = () => {} }) => {
  const [characterPosition, setCharacterPosition] = useState<[number, number, number]>([0, 0, 12]);
  const [isStarted, setIsStarted] = useState(false);
  const [reachedDoor, setReachedDoor] = useState(false);
  const [showKnockPrompt, setShowKnockPrompt] = useState(false);
  const [playKnockSound, setPlayKnockSound] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  // Progressive messages that appear as you walk
  const messages = [
    "Every journey begins with a single step...",
    "Life is a series of moments, each one precious...",
    "Sometimes the smallest steps lead to the biggest adventures...",
    "Keep moving forward, even when the path is unclear...",
    "The distance doesn't matter, what matters is that you're walking...",
    "Each step brings you closer to something beautiful...",
    "Remember, the journey is just as important as the destination...",
    "You're doing great, keep going...",
    "Almost there, don't give up now...",
    "Your destination awaits, just a little further...",
    "The door is near, your journey is about to complete...",
    "One more step, you're almost home...",
  ];

  const moveForward = () => {
    setCharacterPosition(prev => {
      const newZ = prev[2] - 1;
      setStepCount(s => s + 1);
      
      if (newZ <= -11) {
        setReachedDoor(true);
        setTimeout(() => setShowKnockPrompt(true), 500);
        return [prev[0], prev[1], -11];
      }
      
      return [prev[0], prev[1], newZ];
    });
  };

  const knockDoor = () => {
    setPlayKnockSound(true);
    setShowKnockPrompt(false);
    
    // Simulate knock sound with audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playKnock = (delay: number) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 200;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }, delay);
    };
    
    playKnock(0);
    playKnock(300);
    playKnock(600);
    
    setTimeout(() => onNext(), 2000);
  };

  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-[#000814] via-[#0a1929] to-[#001233] overflow-hidden">
      <Canvas
        camera={{ position: [0, 4, 15], fov: 60 }}
        shadows
      >
        <ambientLight intensity={0.15} />
        <directionalLight
          position={[20, 25, -30]}
          intensity={0.4}
          color="#b8d4f1"
        />
        
        <TwinklingStars />
        <Moon />
        <Ground />
        <Forest />
        <Path />
        <PathLamps />
        <House />
        <Character position={characterPosition} rotation={Math.PI} />
        
        <CameraController targetPosition={characterPosition} />
        
        <fog attach="fog" args={['#000814', 25, 80]} />
      </Canvas>

      {/* Title */}
      {!isStarted && (
        <div className="absolute top-12 left-1/2 sm:left-1/3 transform -translate-x-1/2 text-center z-10 px-4">
          <h1 className="text-3xl md:text-6xl font-semi-bold text-white/50 drop-shadow-lg drop-shadow-2xl mb-3">
            Hii {data.recipientName}
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 drop-shadow-lg">
            {/* From {data.senderName}  */}
          </p>
          <p className="text-base md:text-xl text-blue-300/80 drop-shadow-lg mt-4 italic">
            {/* "The most beautiful journeys are the ones we take together" */}
          </p>
        </div>
      )}

      {/* Progressive Walking Messages */}
      {isStarted && !reachedDoor && stepCount > 0 && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10 w-full px-4">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl py-4 px-6 max-w-2xl mx-auto border border-white/20">
            <p className="text-white text-lg md:text-2xl font-semibold mb-2">
              Dear {data.recipientName},
            </p>
            <p className="text-blue-200 text-base md:text-xl italic">
              {messages[Math.min(stepCount - 1, messages.length - 1)]}
            </p>
            <p className="text-white/60 text-sm mt-2">
              Step {stepCount} of {messages.length}
            </p>
          </div>
        </div>
      )}

      {/* Start Button - Glass effect */}
      {!isStarted && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={() => setIsStarted(true)}
            className="bg-white/20 backdrop-blur-md border-2 border-white/30 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:bg-white/30 hover:scale-105 transition-all"
          >
            🚶 Let's Start the Journey
          </button>
        </div>
      )}

      {/* Forward Arrow Button */}
      {isStarted && !reachedDoor && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={moveForward}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-20 h-20 rounded-full text-4xl font-bold shadow-2xl hover:scale-110 active:scale-95 transition-transform flex items-center justify-center"
          >
            ↑
          </button>
          <p className="text-white text-center mt-3 text-sm">Click to move forward</p>
        </div>
      )}

      {/* Knock Door Prompt */}
      {showKnockPrompt && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={knockDoor}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-2xl hover:scale-110 transition-transform animate-bounce"
          >
            🚪 Knock the Door
          </button>
        </div>
      )}

      {/* Knock Sound Indicator */}
      {playKnockSound && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl animate-ping z-10">
          🔊
        </div>
      )}
    </div>
  );
};

export default Arrival;