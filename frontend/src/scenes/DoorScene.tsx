import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {type  SceneProps } from '../types/experience';

// Door 3D Model
const Door = ({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) => {
  return (
    <group onClick={onClick}>
      {/* Door Frame */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[2.2, 4, 0.2]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Door (opens) */}
      <group rotation={[0, isOpen ? -Math.PI / 2 : 0, 0]} position={isOpen ? [-1, 0, 0] : [0, 0, 0]}>
        <mesh position={[0, 2, 0.1]}>
          <boxGeometry args={[2, 3.8, 0.15]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Door Knob */}
        <mesh position={[0.8, 2, 0.2]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Bell on the right */}
      {!isOpen && (
        <mesh position={[1.2, 3, 0.2]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} />
        </mesh>
      )}
    </group>
  );
};

const DoorScene = ({ data, onNext }: SceneProps) => {
  const [step, setStep] = useState<'bell' | 'knock' | 'handle' | 'opened'>('bell');
  const [doorOpen, setDoorOpen] = useState(false);
  const [message, setMessage] = useState('Ring the bell on the right →');

  const handleBellClick = () => {
    setMessage('🔔 Ding Dong! ...No answer. Try knocking!');
    setStep('knock');
  };

  const handleKnockClick = () => {
    setMessage('🚪 Knock Knock! ...Still no answer. Try the handle!');
    setStep('handle');
  };

  const handleDoorClick = () => {
    setMessage('The door is opening...');
    setDoorOpen(true);
    setStep('opened');
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  return (
    <div className="w-full h-screen relative bg-gradient-to-b from-gray-800 to-gray-900">
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 3, 2]} intensity={0.8} />
        <spotLight position={[0, 5, 3]} intensity={0.5} angle={0.3} />
        
        <Door onClick={
          step === 'bell' ? handleBellClick :
          step === 'knock' ? handleKnockClick :
          step === 'handle' ? handleDoorClick :
          () => {}
        } isOpen={doorOpen} />
        
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
      </Canvas>

      {/* Instructions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
        >
          <p className="text-2xl md:text-3xl text-white font-semibold mb-4 drop-shadow-lg">
            {message}
          </p>
          <p className="text-lg text-gray-300">
            {step === 'bell' && 'Click the bell'}
            {step === 'knock' && 'Click the door to knock'}
            {step === 'handle' && 'Click the door to open'}
            {step === 'opened' && 'Entering...'}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DoorScene;
