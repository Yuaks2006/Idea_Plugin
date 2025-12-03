import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { CakeProps } from '../types';

// --- Clay Material Configurations ---

const MATERIALS = {
  sponge: {
    color: '#fff1c1', // Milky yellow (奶黄色系)
    roughness: 0.85,  // Matte (粗糙度0.85)
    metalness: 0.0,
    emissive: '#ffeedd',
    emissiveIntensity: 0.05, // Slight ambient warmth
    transparent: false,
    opacity: 1,
  },
  cream: {
    color: '#ffffff', // Pure white (纯白色)
    roughness: 0.25,  // Smooth (粗糙度0.25)
    metalness: 0.1,   // Glossy reflection
    emissive: '#ffffff',
    emissiveIntensity: 0.15, // Light glow (轻微发光, 强度0.15)
    transparent: false,
    opacity: 1,
  },
  jam: {
    color: '#9e0000', // Deep red (深红色)
    roughness: 0.15,  // Wet look
    metalness: 0.0,
    emissive: '#590000', 
    emissiveIntensity: 0.1,
    transparent: true,
    opacity: 0.75,    // Semi-transparent (透明度0.75)
  }
};

const CAKE_RADIUS = 1.6;
const SLICE_ANGLE = Math.PI / 4; // 45 degrees
const LAYER_BEVEL = 0.08;

// --- Helper Components ---

interface ClayLayerProps {
  type: 'sponge' | 'cream' | 'jam';
  radius: number;
  height: number;
  y: number;
  angle?: number;
  scale?: number;
}

const ClayLayer: React.FC<ClayLayerProps> = ({ type, radius, height, y, angle = Math.PI * 2, scale = 1 }) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    if (angle >= Math.PI * 2 - 0.01) {
      s.absarc(0, 0, radius, 0, Math.PI * 2, false);
    } else {
      s.moveTo(0, 0);
      s.lineTo(radius, 0); // Straight edge 1
      s.absarc(0, 0, radius, 0, angle, false); // Curved edge
      s.lineTo(0, 0); // Straight edge 2
    }
    return s;
  }, [radius, angle]);

  const settings = useMemo(() => ({
    depth: height,
    bevelEnabled: true,
    bevelThickness: LAYER_BEVEL,
    bevelSize: LAYER_BEVEL,
    bevelSegments: 16, // Smooth round bevels
    curveSegments: 32,
  }), [height]);

  const materialProps = MATERIALS[type];

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} scale={scale} castShadow receiveShadow>
      <extrudeGeometry args={[shape, settings]} />
      <meshStandardMaterial {...materialProps} side={THREE.DoubleSide} />
    </mesh>
  );
};

const ClayStrawberry = ({ position, scale = 1, rotation = [0,0,0] }: { position: [number, number, number], scale?: number, rotation?: [number, number, number] }) => {
  return (
    <group position={position} scale={scale} rotation={rotation as any}>
      {/* Berry Body */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#d32f2f" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Leaves */}
      {[0, 120, 240].map((rot, i) => (
        <mesh key={i} position={[0, 0.35, 0]} rotation={[0.5, (rot * Math.PI) / 180, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#66bb6a" roughness={0.6} />
        </mesh>
      ))}
      {/* Seeds */}
      <mesh position={[0.15, 0.15, 0.1]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshStandardMaterial color="#ffcdd2" />
      </mesh>
       <mesh position={[-0.1, 0.2, 0.15]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshStandardMaterial color="#ffcdd2" />
      </mesh>
    </group>
  );
};

const ClayCandle = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.08, 0.8, 4, 16]} />
        <meshStandardMaterial color="#fff" roughness={0.5} />
      </mesh>
      {/* Stripe */}
      <mesh position={[0, 0.5, 0]}>
         <torusGeometry args={[0.085, 0.02, 8, 16]} />
         <meshStandardMaterial color="#90caf9" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
         <torusGeometry args={[0.085, 0.02, 8, 16]} />
         <meshStandardMaterial color="#90caf9" roughness={0.5} />
      </mesh>
      {/* Flame */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
    </group>
  );
};

// --- Main Components ---

const WholeCake = ({ visible }: { visible: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!visible) return;
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef} visible={visible} scale={visible ? 1 : 0.001}>
      {/* Bottom Sponge */}
      <ClayLayer type="sponge" radius={CAKE_RADIUS} height={0.5} y={0} />
      
      {/* Filling (Jam) */}
      <ClayLayer type="jam" radius={CAKE_RADIUS - 0.05} height={0.15} y={0.5} />
      
      {/* Top Sponge */}
      <ClayLayer type="sponge" radius={CAKE_RADIUS} height={0.5} y={0.65} />
      
      {/* Top Icing (Cream) */}
      <ClayLayer type="cream" radius={CAKE_RADIUS + 0.05} height={0.25} y={1.15} />

      {/* Decorations */}
      <group position={[0, 1.4, 0]}>
        <ClayStrawberry position={[0.8, 0, 0]} rotation={[0.2, 0, 0]} />
        <ClayStrawberry position={[-0.8, 0, 0]} rotation={[0.2, Math.PI, 0]} />
        <ClayStrawberry position={[0, 0, 0.8]} rotation={[0.2, Math.PI/2, 0]} />
        <ClayStrawberry position={[0, 0, -0.8]} rotation={[0.2, -Math.PI/2, 0]} />
        <ClayCandle position={[0, 0, 0]} />
      </group>
    </group>
  );
};

const SliceCake = ({ visible }: { visible: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!visible) return;
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1 - 0.5;
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1 + 0.5;
    }
  });

  const offset = CAKE_RADIUS / 2;
  const angle = SLICE_ANGLE;

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} visible={visible} scale={visible ? 1.3 : 0.001} rotation={[0, -angle/2, 0]}>
        
        <group position={[-CAKE_RADIUS * 0.3, 0, -CAKE_RADIUS * 0.3]}> 
            {/* Bottom Sponge - Milky Yellow, Matte */}
            <ClayLayer type="sponge" radius={CAKE_RADIUS} height={0.5} y={0} angle={angle} />
            
            {/* Filling - Deep Red, Translucent Jam */}
            <ClayLayer type="jam" radius={CAKE_RADIUS - 0.02} height={0.15} y={0.5} angle={angle} />
            
            {/* Top Sponge - Milky Yellow, Matte */}
            <ClayLayer type="sponge" radius={CAKE_RADIUS} height={0.5} y={0.65} angle={angle} />
            
            {/* Top Icing - Pure White, Glossy, Glowing */}
            <ClayLayer type="cream" radius={CAKE_RADIUS + 0.05} height={0.25} y={1.15} angle={angle} />

            {/* Decoration for slice - Fixed position to be on top of the slice wedge */}
            <group position={[CAKE_RADIUS * 0.6 * Math.cos(angle/2), 1.45, -CAKE_RADIUS * 0.6 * Math.sin(angle/2)]}>
                <ClayStrawberry position={[0, 0, 0]} scale={1.2} />
            </group>
        </group>
      </group>
    </Float>
  );
};

const SceneContent: React.FC<CakeProps> = ({ viewState, setCanvasRef }) => {
    const { gl } = useThree();
    
    useEffect(() => {
        if (gl.domElement) {
            setCanvasRef(gl.domElement);
        }
    }, [gl, setCanvasRef]);

    return (
        <>
            {/* Lighting optimized for displaying texture differences */}
            <ambientLight intensity={0.7} color="#fff5f7" />
            
            {/* Key Light - Soft Warmth */}
            <spotLight 
                position={[5, 8, 5]} 
                angle={0.6} 
                penumbra={1} 
                intensity={1.2} 
                castShadow 
                shadow-bias={-0.0001}
                shadow-mapSize={[1024, 1024]} 
                color="#fff0e6"
            />
            
            {/* Back Light - Cool rim to separate from background */}
            <pointLight position={[-5, 4, -5]} intensity={0.8} color="#e3f2fd" />

            {/* Fill Light - Pinkish for clay aesthetic */}
            <pointLight position={[3, 1, 3]} intensity={0.5} color="#fce4ec" />
            
            <group position={[0, -0.8, 0]}>
                <WholeCake visible={viewState === 'intro'} />
                <SliceCake visible={viewState === 'result' || viewState === 'cutting'} />
            </group>
            
            <ContactShadows 
                position={[0, -0.8, 0]} 
                opacity={0.4} 
                scale={10} 
                blur={2.5} 
                far={2} 
                color="#e57373" 
            />
            
            <Environment preset="city" environmentIntensity={0.4} />
            
            <OrbitControls 
                enablePan={false} 
                enableZoom={false} 
                minPolarAngle={Math.PI / 4} 
                maxPolarAngle={Math.PI / 2}
                autoRotate={viewState === 'intro'}
                autoRotateSpeed={2}
            />
        </>
    );
};

const ThreeDCake: React.FC<CakeProps> = (props) => {
  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing">
      <Canvas 
        shadows 
        camera={{ position: [0, 2, 6], fov: 40 }} 
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
         <SceneContent {...props} />
      </Canvas>
    </div>
  );
};

export default ThreeDCake;
