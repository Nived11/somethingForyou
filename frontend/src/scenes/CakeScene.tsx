import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { type SceneProps } from '../types/experience';
import * as THREE from 'three';

// Simple Confetti Component
const SimpleConfetti = () => {
  const confettiPieces = Array.from({ length: 100 });
  
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {confettiPieces.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: ['#FF1493', '#00CED1', '#FFD700', '#FF4500', '#9370DB'][i % 5],
            left: `${Math.random() * 100}%`,
            top: '-10px'
          }}
          animate={{
            y: window.innerHeight + 50,
            x: [0, Math.random() * 200 - 100],
            rotate: [0, 360],
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity
          }}
        />
      ))}
    </div>
  );
};

// Animated Candle Flame
const CandleFlame = () => {
  const flameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (flameRef.current) {
      const time = state.clock.getElapsedTime();
      flameRef.current.scale.y = 1 + Math.sin(time * 8) * 0.15;
      flameRef.current.scale.x = 1 + Math.sin(time * 6) * 0.1;
      flameRef.current.position.y = 1.3 + Math.sin(time * 10) * 0.05;
    }
    if (glowRef.current) {
      const time = state.clock.getElapsedTime();
      glowRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.2);
    }
  });

  return (
    <group>
      <mesh position={[0, 1.25, 0]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
      <mesh ref={flameRef} position={[0, 1.3, 0]}>
        <coneGeometry args={[0.12, 0.35, 8]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.9} />
      </mesh>
      <mesh ref={glowRef} position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.4} />
      </mesh>
      <pointLight position={[0, 1.3, 0]} intensity={5} distance={10} color="#ff8800" castShadow />
      <pointLight position={[0, 1.3, 0]} intensity={2} distance={6} color="#ffff00" />
    </group>
  );
};

// Knife Component
const Knife = ({ visible, position, rotation }: { visible: boolean; position: [number, number, number]; rotation: [number, number, number] }) => {
  if (!visible) return null;
  
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.05, 0.4, 0.02]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 16]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  );
};

// Cake Component
const Cake = ({ sliceCut, lightsOn }: { sliceCut: boolean; lightsOn: boolean }) => {
  return (
    <group position={[0, 0.5, 0]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} />
        <meshStandardMaterial color={lightsOn ? "#8B4513" : "#0a0a0a"} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.06, 32]} />
        <meshStandardMaterial color={lightsOn ? "#FFFAF0" : "#0a0a0a"} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.35, 32]} />
        <meshStandardMaterial color={lightsOn ? "#FFE4B5" : "#0a0a0a"} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.06, 32]} />
        <meshStandardMaterial color={lightsOn ? "#FFB6C1" : "#0a0a0a"} roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 0.68, 0]}>
        <torusGeometry args={[0.65, 0.08, 16, 32]} />
        <meshStandardMaterial color={lightsOn ? "#FFFFFF" : "#0a0a0a"} roughness={0.2} />
      </mesh>
      
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 10) * Math.PI * 2) * 0.75,
            0.35,
            Math.sin((i / 10) * Math.PI * 2) * 0.75
          ]}
        >
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color={lightsOn ? "#FFFAF0" : "#0a0a0a"} roughness={0.3} />
        </mesh>
      ))}
      
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#DC143C" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.06, 0.05, 0.03, 16]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {sliceCut && (
        <group position={[0.8, 0.35, 0]} rotation={[0, 0.3, 0.1]}>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[0.35, 0.4, 0.12]} />
            <meshStandardMaterial color="#8B4513" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[0.32, 0.35, 0.1]} />
            <meshStandardMaterial color="#FFE4B5" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.34, 0.06, 0.11]} />
            <meshStandardMaterial color="#FFFAF0" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.37, 0]}>
            <boxGeometry args={[0.3, 0.06, 0.09]} />
            <meshStandardMaterial color="#FFB6C1" roughness={0.3} />
          </mesh>
        </group>
      )}
      
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <cylinderGeometry args={[1, 1, 0.05, 32]} />
        <meshStandardMaterial color={lightsOn ? "#C0C0C0" : "#0a0a0a"} roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
};

// Table
const Table = ({ lightsOn }: { lightsOn: boolean }) => {
  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2, 2, 0.12, 32]} />
        <meshStandardMaterial color={lightsOn ? "#5C4033" : "#0a0a0a"} roughness={0.7} />
      </mesh>
      <mesh position={[0, -1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2, 16]} />
        <meshStandardMaterial color={lightsOn ? "#4A3728" : "#0a0a0a"} roughness={0.8} />
      </mesh>
      <mesh position={[0, -2, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.8, 0.15, 16]} />
        <meshStandardMaterial color={lightsOn ? "#4A3728" : "#0a0a0a"} roughness={0.8} />
      </mesh>
    </group>
  );
};

// Door Component
const Door = ({ lightsOn }: { lightsOn: boolean }) => {
  return (
    <group position={[0, 0, 5.9]}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.3, 3.2, 0.1]} />
        <meshStandardMaterial color={lightsOn ? "#3d2817" : "#0a0a0a"} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2, 0.05]}>
        <boxGeometry args={[1.2, 1.4, 0.08]} />
        <meshStandardMaterial color={lightsOn ? "#5C4033" : "#0a0a0a"} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, 0.05]}>
        <boxGeometry args={[1.2, 1.4, 0.08]} />
        <meshStandardMaterial color={lightsOn ? "#5C4033" : "#0a0a0a"} roughness={0.7} />
      </mesh>
      <mesh position={[-0.5, 1.2, 0.1]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={lightsOn ? "#FFD700" : "#0a0a0a"} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Room
const Room = ({ lightsOn }: { lightsOn: boolean }) => {
  return (
    <group>
      <mesh position={[0, 2.5, -6]} receiveShadow>
        <planeGeometry args={[14, 9]} />
        <meshStandardMaterial color={lightsOn ? "#E8E8E8" : "#050505"} roughness={0.9} />
      </mesh>
      
      <mesh position={[-7, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 9]} />
        <meshStandardMaterial color={lightsOn ? "#E0E0E0" : "#050505"} roughness={0.9} />
      </mesh>
      
      <mesh position={[7, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 9]} />
        <meshStandardMaterial color={lightsOn ? "#E0E0E0" : "#050505"} roughness={0.9} />
      </mesh>
      
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color={lightsOn ? "#8B7355" : "#0a0a0a"} roughness={0.85} />
      </mesh>
      
      <mesh position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color={lightsOn ? "#FAFAFA" : "#050505"} roughness={0.8} />
      </mesh>
      
      <mesh position={[-4, 2.5, 6]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[6, 9]} />
        <meshStandardMaterial color={lightsOn ? "#E0E0E0" : "#050505"} roughness={0.9} />
      </mesh>
      
      <mesh position={[4, 2.5, 6]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[6, 9]} />
        <meshStandardMaterial color={lightsOn ? "#E0E0E0" : "#050505"} roughness={0.9} />
      </mesh>
      
      <mesh position={[0, 5.5, 6]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[2, 4]} />
        <meshStandardMaterial color={lightsOn ? "#E0E0E0" : "#050505"} roughness={0.9} />
      </mesh>
    </group>
  );
};

// Photo Frame Components - FIXED Z-FIGHTING
const PhotoFrame = ({ 
  position, 
  rotation, 
  imageUrl,
  style = 'classic'
}: { 
  position: [number, number, number]; 
  rotation: [number, number, number]; 
  imageUrl: string;
  style?: 'classic' | 'polaroid' | 'hanging';
}) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    loader.load(
      imageUrl,
      (loadedTexture) => {
        setTexture(loadedTexture);
      },
      undefined,
      (err) => {
        console.error('Error loading texture:', err);
      }
    );
  }, [imageUrl]);
  
  if (style === 'classic') {
    return (
      <group position={position} rotation={rotation}>
        {/* Frame background - furthest back */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[1.0, 1.0, 0.04]} />
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </mesh>
        
        {/* White mat */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.88, 0.88]} />
          <meshStandardMaterial color="#F5F5F5" />
        </mesh>
        
        {/* Photo on top */}
        {texture && (
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[0.8, 0.8]} />
            <meshStandardMaterial map={texture} />
          </mesh>
        )}
      </group>
    );
  }
  
  if (style === 'polaroid') {
    return (
      <group position={position} rotation={rotation}>
        {/* Polaroid background */}
        <mesh position={[0, 0, -0.015]}>
          <boxGeometry args={[0.9, 1.1, 0.03]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        
        {/* Photo */}
        {texture && (
          <mesh position={[0, 0.1, 0.016]}>
            <planeGeometry args={[0.75, 0.75]} />
            <meshStandardMaterial map={texture} />
          </mesh>
        )}
        
        {/* Bottom white space */}
        <mesh position={[0, -0.35, 0.016]}>
          <planeGeometry args={[0.75, 0.3]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
    );
  }
  
  if (style === 'hanging') {
    return (
      <group position={position} rotation={rotation}>
        {/* Hanging string */}
        <mesh position={[0, 0.6, -0.01]}>
          <cylinderGeometry args={[0.003, 0.003, 0.5, 8]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
        
        {/* Clip at top */}
        <mesh position={[0, 0.85, -0.01]}>
          <cylinderGeometry args={[0.025, 0.025, 0.015, 16]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.8} />
        </mesh>
        
        {/* Card background */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[0.85, 1.0, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        
        {/* Photo on card */}
        {texture && (
          <mesh position={[0, 0.05, 0.011]}>
            <planeGeometry args={[0.75, 0.85]} />
            <meshStandardMaterial map={texture} />
          </mesh>
        )}
      </group>
    );
  }
  
  return null;
};

// Photo Frames - BETTER POSITIONING
const PhotoFrames = ({ visible, images }: { visible: boolean; images?: string[] }) => {
  if (!visible || !images || images.length === 0) return null;
  
  const frameStyles: Array<'classic' | 'polaroid' | 'hanging'> = [
    'classic', 'polaroid', 'hanging', 'classic', 'polaroid',
    'hanging', 'classic', 'polaroid', 'hanging', 'classic',
    'polaroid', 'hanging', 'classic', 'polaroid', 'hanging'
  ];
  
  const photoPositions = [
    // Front wall (above banner) - 4 photos
    { pos: [-4, 3.2, -5.9] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
    { pos: [-1.2, 3.2, -5.9] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
    { pos: [1.2, 3.2, -5.9] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
    { pos: [3.5, 3.2, -5.9] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
    
    // Front wall (below banner) - 3 photos
    { pos: [-3, 1.8, -5.9] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
    { pos: [0, 1.8, -5.9] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
    { pos: [3, 1.8, -5.9] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
    
    // Left wall - 3 photos
    { pos: [-6.9, 3.5, -2] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] },
    { pos: [-6.9, 3.5, 1] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] },
    { pos: [-6.9, 1.8, 3.5] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] },
    
    // Right wall - 3 photos
    { pos: [6.9, 3.5, -2] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] },
    { pos: [6.9, 3.5, 1] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] },
    { pos: [6.9, 1.8, 3.5] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] },
    
    // Back wall (beside door) - 2 photos
    { pos: [-3.5, 3.5, 5.9] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] },
    { pos: [3.5, 3.5, 5.9] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] },
  ];
  
  return (
    <group>
      {images.map((imageUrl, i) => (
        <PhotoFrame
          key={i}
          position={photoPositions[i].pos}
          rotation={photoPositions[i].rot}
          imageUrl={imageUrl}
          style={frameStyles[i]}
        />
      ))}
    </group>
  );
};

// Decorations
const Decorations = ({ visible, recipientName }: { visible: boolean; recipientName: string }) => {
  if (!visible) return null;
  
  return (
    <group>
      {[...Array(5)].map((_, i) => (
        <group key={`left-${i}`} position={[-6.5, 4.5 + Math.sin(i) * 0.3, -5 + i * 0.8]}>
          <mesh castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={['#FF1493', '#00CED1', '#FFD700', '#FF4500', '#9370DB'][i]} roughness={0.3} />
          </mesh>
          <mesh position={[0, -1.5, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 2, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}
      
      {[...Array(5)].map((_, i) => (
        <group key={`right-${i}`} position={[6.5, 4.5 + Math.sin(i + 3) * 0.3, -5 + i * 0.8]}>
          <mesh castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={['#32CD32', '#FF69B4', '#1E90FF', '#FFA500', '#DA70D6'][i]} roughness={0.3} />
          </mesh>
          <mesh position={[0, -1.5, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 2, 8]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}
      
      <mesh position={[0, 5.3, -5.8]} castShadow>
        <planeGeometry args={[9, 1.3]} />
        <meshStandardMaterial color="#FF1493" />
      </mesh>
      
      <Text position={[0, 5.6, -5.7]} fontSize={0.45} color="#FFFFFF" anchorX="center" anchorY="middle">
        HAPPY BIRTHDAY!
      </Text>
      
      <Text position={[0, 5.0, -5.7]} fontSize={0.35} color="#FFFF00" anchorX="center" anchorY="middle">
        {recipientName}
      </Text>
    </group>
  );
};

// Character
const Character = ({ position, rotation }: { position: [number, number, number]; rotation: number }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[-0.15, 0.08, 0]} castShadow>
        <boxGeometry args={[0.18, 0.16, 0.28]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.15, 0.08, 0]} castShadow>
        <boxGeometry args={[0.18, 0.16, 0.28]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.15, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[0.15, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.5, 16]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[-0.15, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[0.15, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.5, 0.25, 0.35]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <boxGeometry args={[0.55, 0.65, 0.38]} />
        <meshStandardMaterial color="#E91E63" />
      </mesh>
      <mesh position={[-0.37, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.065, 0.8, 16]} />
        <meshStandardMaterial color="#FFD1A1" />
      </mesh>
      <mesh position={[0.37, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.065, 0.8, 16]} />
        <meshStandardMaterial color="#FFD1A1" />
      </mesh>
      <mesh position={[0, 2.92, 0]} castShadow>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#FFD1A1" />
      </mesh>
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
    </group>
  );
};

const CakeScene = ({ data, onNext }: SceneProps) => {
  const [phase, setPhase] = useState<'dark' | 'walking' | 'popup' | 'lights' | 'cutting' | 'cut'>('dark');
  const [charPosition, setCharPosition] = useState<[number, number, number]>([0, -2, 5]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [candleLit, setCandleLit] = useState(true);
  const [sliceCut, setSliceCut] = useState(false);
  const [showKnife, setShowKnife] = useState(false);
  const [knifePos, setKnifePos] = useState<[number, number, number]>([0.5, 1.5, 0]);
  const [knifeRot, setKnifeRot] = useState<[number, number, number]>([0, 0, 0]);
  const [orbitEnabled, setOrbitEnabled] = useState(false);

  const moveForward = () => {
    if (phase === 'dark') {
      setPhase('walking');
      setCharPosition([0, -2, 1.5]);
      
      setTimeout(() => {
        setPhase('popup');
        playPopSound();
        
        setTimeout(() => {
          setShowConfetti(true);
          playBirthdaySong();
          
          setTimeout(() => {
            setPhase('lights');
            setOrbitEnabled(true);
          }, 1500);
        }, 800);
      }, 1500);
    }
  };

  const playBirthdaySong = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [
        { freq: 262, duration: 0.4 },
        { freq: 262, duration: 0.4 },
        { freq: 294, duration: 0.8 },
        { freq: 262, duration: 0.8 },
        { freq: 349, duration: 0.8 },
        { freq: 330, duration: 1.6 },
      ];
      
      let time = 0;
      notes.forEach(note => {
        setTimeout(() => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(audioContext.destination);
          
          osc.frequency.value = note.freq;
          osc.type = 'sine';
          
          gain.gain.setValueAtTime(0.3, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration);
          
          osc.start(audioContext.currentTime);
          osc.stop(audioContext.currentTime + note.duration);
        }, time * 1000);
        
        time += note.duration;
      });
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const playPopSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(800, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
      osc.type = 'square';
      
      gain.gain.setValueAtTime(0.5, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const cutCake = () => {
    setPhase('cutting');
    setCandleLit(false);
    setShowKnife(true);
    
    const cutAnimation = setInterval(() => {
      setKnifePos(prev => [prev[0], prev[1] - 0.1, prev[2]]);
      setKnifeRot(prev => [prev[0] + 0.1, prev[1], prev[2]]);
    }, 50);
    
    setTimeout(() => {
      clearInterval(cutAnimation);
      setSliceCut(true);
      setShowKnife(false);
      setPhase('cut');
      
      setTimeout(() => {
        onNext();
      }, 3000);
    }, 1000);
  };

  return (
    <div className="w-full h-screen relative bg-black">
      {showConfetti && <SimpleConfetti />}
      
      <Canvas 
        camera={{ position: [0, 2, 6], fov: 65 }} 
        shadows
      >
        <ambientLight intensity={phase === 'dark' || phase === 'walking' ? 0.05 : 0.5} />
        <directionalLight position={[5, 5, 5]} intensity={phase === 'dark' || phase === 'walking' ? 0 : 1} castShadow />
        
        {orbitEnabled && (
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 1.8}
            minDistance={4}
            maxDistance={10}
            target={[0, 1, 0]}
          />
        )}
        
        <Room lightsOn={phase === 'lights' || phase === 'cutting' || phase === 'cut'} />
        <Door lightsOn={phase === 'lights' || phase === 'cutting' || phase === 'cut'} />
        <Table lightsOn={phase === 'lights' || phase === 'cutting' || phase === 'cut'} />
        <Cake sliceCut={sliceCut} lightsOn={phase === 'lights' || phase === 'cutting' || phase === 'cut'} />
        {candleLit && <CandleFlame />}
        <Knife visible={showKnife} position={knifePos} rotation={knifeRot} />
        <Character position={charPosition} rotation={0} />
        <Decorations visible={phase === 'lights' || phase === 'cutting' || phase === 'cut'} recipientName={data.recipientName} />
        <PhotoFrames visible={phase === 'lights' || phase === 'cutting' || phase === 'cut'} images={data.photos} />
      </Canvas>

      {phase === 'dark' && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={moveForward}
            className="bg-white/20 backdrop-blur-md border-2 border-white/30 text-white w-16 h-16 md:w-20 md:h-20 rounded-full text-3xl md:text-4xl font-bold shadow-2xl hover:scale-110 active:scale-95 transition-transform flex items-center justify-center"
          >
            ↑
          </button>
          <p className="text-white text-center mt-2 text-sm">Move forward</p>
        </div>
      )}

      <AnimatePresence>
        {phase === 'popup' && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="text-9xl">🎉</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'lights' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10"
          >
            <button
              onClick={cutCake}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-full text-2xl font-bold shadow-2xl hover:scale-110 transition-transform animate-pulse"
            >
              🎂 Cut the Cake!
            </button>
            <p className="text-white text-center mt-3 text-sm">Drag to rotate • Scroll to zoom</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'cut' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center z-10"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              🎊 Happy Birthday! 🎊
            </h1>
            <p className="text-2xl md:text-3xl text-pink-300">
              {data.recipientName}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CakeScene;
