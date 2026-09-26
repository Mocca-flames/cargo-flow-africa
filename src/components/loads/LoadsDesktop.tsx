"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./LoadsCommon.css";
import "./LoadsDesktop.css";

gsap.registerPlugin(ScrollTrigger);

const TRUCK_MODEL_URL = "/models/truck.glb";

useGLTF.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

function CargoModel({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(TRUCK_MODEL_URL);

  useEffect(() => {
    let frameId = 0;
    frameId = requestAnimationFrame(() => {
      const bounds = new THREE.Box3().setFromObject(scene);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const largestDimension = Math.max(size.x, size.y, size.z);
      if (!group.current || !Number.isFinite(largestDimension) || largestDimension <= 0) return;
      group.current.scale.setScalar(2.5 / largestDimension);
      scene.position.sub(center);
    });
    return () => cancelAnimationFrame(frameId);
  }, [scene]);

  useFrame(() => {
    if (!group.current) return;
    const p = progressRef.current;
    group.current.position.z = THREE.MathUtils.lerp(3, -3, p);
  });

  return (
    <group ref={group} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function LoadsDesktop() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx: gsap.Context | undefined;
    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=130%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        });
      }, sectionRef);
    });

    return () => {
      cancelAnimationFrame(frame);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      ctx?.revert();
    };
  }, []);

  return (
    <section id="loads-section" ref={sectionRef} className="loads loads--desktop">
      <div className="loads__canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 2, 7], fov: 32 }}>
          <color attach="background" args={["#f8f4eb"]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <CargoModel progressRef={progressRef} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}

useGLTF.preload(TRUCK_MODEL_URL);
