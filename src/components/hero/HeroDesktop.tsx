"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HeroCommon.css";
import "./HeroDesktop.css";

gsap.registerPlugin(ScrollTrigger);

const TRUCK_MODEL_URL = "/models/truck.glb?v=mobile-frame-fix";

useGLTF.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

function Truck({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(TRUCK_MODEL_URL);
  const { viewport } = useThree();
  const halfWidthRef = useRef(0);

  useEffect(() => {
    let frameId = 0;

    frameId = requestAnimationFrame(() => {
      const bounds = new THREE.Box3().setFromObject(scene);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const largestDimension = Math.max(size.x, size.y, size.z);

      if (!group.current || !Number.isFinite(largestDimension) || largestDimension <= 0) {
        return;
      }

      const scale = 3.2 / largestDimension;
      group.current.scale.setScalar(scale);
      scene.position.sub(center);
      halfWidthRef.current = (size.x * scale) / 2;
    });

    return () => cancelAnimationFrame(frameId);
  }, [scene]);

  useFrame(() => {
    if (!group.current) return;
    const p = progressRef.current;
    const startX = viewport.width / 2 + halfWidthRef.current;
    const endX = -viewport.width * 0.25;

    group.current.position.x = THREE.MathUtils.lerp(startX, endX, p);
    group.current.position.y = THREE.MathUtils.lerp(-0.3, 0.3, p);
  });

  return <group ref={group}><primitive object={scene} /></group>;
}

export default function HeroDesktop() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx: gsap.Context | undefined;
    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            textRef.current?.style.setProperty("--scroll-progress", String(self.progress));
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
    <section id="hero-section" ref={sectionRef} className="hero hero--desktop">
      <div className="hero-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 2, 7], fov: 32 }}>
          <color attach="background" args={["#f8f4eb"]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <Truck progressRef={progressRef} />
          </Suspense>
        </Canvas>
      </div>

      <div
        ref={textRef}
        className="hero-text-content"
        style={{ "--scroll-progress": 0 } as CSSProperties}
      >
        <div className="hero-text-stack">
          <div className="hero-text-set hero-text-set--primary">
            <h1 className="hero-title">
              Crossborder
              <br />
              heavy haulage.
            </h1>
            <p className="hero-description">
              Fleet. Corridors. Clearance.
              <br />
              Africa, moved.
            </p>
            <p className="hero-stat">54 corridors / 12 countries</p>
          </div>

          <div className="hero-text-set hero-text-set--secondary">
            <h1 className="hero-title">
              Every truck,
              <br />
              cleared at the border.
            </h1>
            <p className="hero-description">
              Live tracking. Customs handled.
              <br />
              Cargo moves without stopping.
            </p>
            <p className="hero-stat">1,400+ trucks / 98% on-time crossings</p>
          </div>
        </div>
      </div>
    </section>
  );
}

useGLTF.preload(TRUCK_MODEL_URL);
