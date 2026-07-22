"use client";

import React, { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "./SmoothScrollProvider";

gsap.registerPlugin(ScrollTrigger);

const imagesList = [
  "/images/1bef8902-e0b0-409a-9571-d90359822153.png",
  "/images/IMG20250529191734.jpg",
  "/images/IMG20250608163444.jpg",
  "/images/IMG20250830225703.jpg",
  "/images/IMG20250922185808.jpg",
  "/images/IMG20251029190139.jpg",
  "/images/IMG_0615.jpg",
  "/images/IMG_0713.PNG",
  "/images/IMG_0721.JPG",
  "/images/IMG_0727.JPG",
  "/images/IMG_0732.JPG",
  "/images/IMG_0738.JPG",
];

const extendedImages = [...imagesList, ...imagesList]; // 12 images

// A proxy object to hold the scroll velocity from GSAP ScrollTrigger
const scrollProxy = { velocity: 0.1 };

function CylinderGallery() {
  const groupRef = useRef<THREE.Group>(null);
  const textures = useTexture(extendedImages);
  
  // Set texture encoding to sRGB for proper colors
  textures.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  });

  const columnsCount = extendedImages.length;
  // Huge radius to make the curve gentle
  const radius = 8.5;
  
  // Total angle for one segment including the gap
  const segmentAngle = (Math.PI * 2) / columnsCount;
  
  // Reduce the drawn angle to create spaces between images (85% image, 15% gap)
  const thetaLength = segmentAngle * 0.92;
  
  // Make the images square: arc length = radius * thetaLength
  const height = radius * thetaLength;

  // Base rotation for the slight "top view"
  const baseRotateX = 0.10; // roughly 8.5 degrees

  // Keep track of total Y rotation so we can add to it continuously
  const totalRotY = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Continuous rotation + Scroll velocity boost
    const speed = 0.15 + Math.abs(scrollProxy.velocity) * 1.5;
    totalRotY.current -= delta * speed; // Rotate right to left (negative Y)

    // 2. Mouse Parallax target rotations
    const targetMouseRotX = baseRotateX + state.pointer.y * 0.15;
    const targetMouseRotY = totalRotY.current + state.pointer.x * 0.15;

    // 3. Smoothly interpolate to the targets
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetMouseRotX, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetMouseRotY, 0.1);
  });

  return (
    // Shift the cylinder to the right and slightly back so it bleeds off the right edge of the screen
    <group ref={groupRef} position={[4, 0, -4]}>
      {textures.map((texture, index) => {
        // Start position incorporates the full segment angle to space them evenly
        const thetaStart = index * segmentAngle;
        return (
          <mesh key={index}>
            <cylinderGeometry 
              args={[
                radius, // radiusTop
                radius, // radiusBottom
                height, // height
                16,     // radialSegments (16 per slice gives a very smooth curve)
                1,      // heightSegments
                true,   // openEnded
                thetaStart, 
                thetaLength
              ]} 
            />
            {/* Using meshBasicMaterial since we don't have lights and want raw image colors */}
            <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function ClouCloneSection() {
  const { isReady } = useSmoothScroll();
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isReady || !sectionRef.current) return;

    const scrollContainer = document.querySelector(
      "#smooth-scroll-container"
    ) as HTMLElement;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        scroller: scrollContainer,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          scrollProxy.velocity = self.getVelocity() / 500;
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#f5f2ec] text-black min-h-screen py-16 overflow-hidden flex items-center"
      id="vision-section"
    >
      <div className="w-full mx-auto pl-6 md:pl-10 lg:pl-16 xl:pl-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT COLUMN: Text Content */}
        <div className="flex flex-col gap-20 lg:pr-10 z-20 pointer-events-auto">
          <div>
            <h2 className="text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-medium leading-[1.05] tracking-tight text-black mb-8">
              mission: to design the best social spaces in the world.
            </h2>
          </div>
          
          <div>
            <p className="text-xl md:text-2xl lg:text-3xl font-normal leading-[1.3] text-black max-w-[500px]">
              Combining smart creativity with commercial savvy, we take our clients' challenges and transform them into exceptionally innovative design.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Rotating Cylinder (Three.js Canvas) */}
        <div className="relative h-[600px] lg:h-[800px] w-full hidden md:flex items-center justify-center">
          <Canvas
            camera={{ position: [0, 0, 10], fov: 45 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={null}>
              <CylinderGallery />
            </Suspense>
          </Canvas>
        </div>
        
      </div>
    </section>
  );
}
