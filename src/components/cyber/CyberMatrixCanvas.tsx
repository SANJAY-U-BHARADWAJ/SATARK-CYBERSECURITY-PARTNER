"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export type CyberCanvasStatus = "idle" | "scanning" | "danger" | "safe";

interface CyberMatrixCanvasProps {
  status?: CyberCanvasStatus;
  riskScore?: number;
}

export function CyberMatrixCanvas({ status = "idle", riskScore = 0 }: CyberMatrixCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef(status);
  const riskScoreRef = useRef(riskScore);

  useEffect(() => {
    statusRef.current = status;
    riskScoreRef.current = riskScore;
  }, [status, riskScore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040508);
    scene.fog = new THREE.FogExp2(0x040508, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 40, 160);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Particle Matrix Parameters
    const PARTICLE_COUNT = 4500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const targetColors = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);

    // Color Palettes
    const cyanColor = new THREE.Color(0x00f0ff);
    const violetColor = new THREE.Color(0x7000ff);
    const crimsonColor = new THREE.Color(0xff0055);
    const emeraldColor = new THREE.Color(0x00ff88);
    const amberColor = new THREE.Color(0xffb800);

    // Generate Vortex + Neural Neural Lattice Geometry
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Spiral vortex with 4 arms + outer protective shell
      const isShell = i > 3600;

      if (!isShell) {
        const armIndex = i % 4;
        const armOffset = (armIndex * Math.PI * 2) / 4;
        const radius = Math.pow(Math.random(), 0.75) * 140 + 8;
        const angle = radius * 0.055 + armOffset + (Math.random() - 0.5) * 0.45;
        const y = (Math.random() - 0.5) * 45 * Math.sin(radius * 0.04);

        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = y;
        positions[i3 + 2] = Math.sin(angle) * radius;

        // Base color blend between cyan and violet
        const ratio = radius / 140;
        const baseColor = cyanColor.clone().lerp(violetColor, ratio);
        colors[i3] = baseColor.r;
        colors[i3 + 1] = baseColor.g;
        colors[i3 + 2] = baseColor.b;
        targetColors[i3] = baseColor.r;
        targetColors[i3 + 1] = baseColor.g;
        targetColors[i3 + 2] = baseColor.b;

        scales[i] = Math.random() * 2.2 + 0.8;
      } else {
        // Outer spherical satellite nodes / threat vectors
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 160 + Math.random() * 40;

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);

        colors[i3] = cyanColor.r * 0.7;
        colors[i3 + 1] = cyanColor.g * 0.7;
        colors[i3 + 2] = cyanColor.b * 0.7;
        targetColors[i3] = colors[i3];
        targetColors[i3 + 1] = colors[i3 + 1];
        targetColors[i3 + 2] = colors[i3 + 2];

        scales[i] = Math.random() * 1.5 + 0.5;
      }

      originalPositions[i3] = positions[i3];
      originalPositions[i3 + 1] = positions[i3 + 1];
      originalPositions[i3 + 2] = positions[i3 + 2];
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // Particle Shader / Material with Circular Soft Particle Map
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.85)");
        gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.2)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 3.4,
      vertexColors: true,
      map: createCircleTexture(),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // Glowing Central Neural Core Ring
    const coreGeometry = new THREE.TorusGeometry(18, 0.6, 16, 100);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const coreTorus = new THREE.Mesh(coreGeometry, coreMaterial);
    coreTorus.rotation.x = Math.PI / 2;
    scene.add(coreTorus);

    const outerCoreGeometry = new THREE.TorusGeometry(32, 0.4, 16, 100);
    const outerCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0x7000ff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const outerCoreTorus = new THREE.Mesh(outerCoreGeometry, outerCoreMaterial);
    outerCoreTorus.rotation.x = Math.PI / 2.3;
    scene.add(outerCoreTorus);

    // Interaction & Mouse Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let scrollY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      scrollY = window.scrollY || window.pageYOffset || 0;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // Handle Window Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", onResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Current State checks
      const curStatus = statusRef.current;
      const curRisk = riskScoreRef.current;

      // Determine Target Theme Color for Active Particles
      let activeTargetColor = cyanColor;
      let rotSpeedMultiplier = 1.0;

      if (curStatus === "scanning") {
        activeTargetColor = crimsonColor.clone().lerp(amberColor, 0.5);
        rotSpeedMultiplier = 2.4;
      } else if (curStatus === "danger" || curRisk >= 60) {
        activeTargetColor = crimsonColor;
        rotSpeedMultiplier = 1.8;
      } else if (curStatus === "safe" || (curStatus !== "idle" && curRisk < 30)) {
        activeTargetColor = emeraldColor;
        rotSpeedMultiplier = 0.8;
      }

      // Update Particle Colors & Positions dynamically
      const colorAttr = geometry.attributes.color as THREE.BufferAttribute;
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;

      if (colorAttr && posAttr) {
        const colorArray = colorAttr.array as Float32Array;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          let targetR = cyanColor.r;
          let targetG = cyanColor.g;
          let targetB = cyanColor.b;

          if (curStatus === "idle") {
            const blend = 0.5 + 0.5 * Math.sin(elapsedTime * 0.8 + i * 0.01);
            const clr = cyanColor.clone().lerp(violetColor, blend);
            targetR = clr.r;
            targetG = clr.g;
            targetB = clr.b;
          } else {
            targetR = activeTargetColor.r;
            targetG = activeTargetColor.g;
            targetB = activeTargetColor.b;
          }

          // Smooth lerp color values
          colorArray[i3] += (targetR - colorArray[i3]) * 0.05;
          colorArray[i3 + 1] += (targetG - colorArray[i3 + 1]) * 0.05;
          colorArray[i3 + 2] += (targetB - colorArray[i3 + 2]) * 0.05;

          // Subtle wave turbulence on vortex
          const origY = originalPositions[i3 + 1];
          const dist = Math.sqrt(
            originalPositions[i3] * originalPositions[i3] +
              originalPositions[i3 + 2] * originalPositions[i3 + 2]
          );
          posArray[i3 + 1] =
            origY + Math.sin(elapsedTime * 1.5 * rotSpeedMultiplier + dist * 0.06) * 4.5;
        }

        colorAttr.needsUpdate = true;
        posAttr.needsUpdate = true;
      }

      // Vortex Rotation
      const baseRotSpeed = 0.0018 * rotSpeedMultiplier;
      particles.rotation.y += baseRotSpeed;
      coreTorus.rotation.z -= baseRotSpeed * 1.5;
      outerCoreTorus.rotation.z += baseRotSpeed * 1.2;

      // Camera Z-depth & Parallax directly coupled with Scroll & Mouse
      const scrollProgress = scrollY * 0.05;
      camera.position.x = currentMouseX * 18;
      camera.position.y = 40 - currentMouseY * 14 + Math.sin(scrollProgress * 0.05) * 8;
      camera.position.z = 160 - Math.min(scrollProgress * 0.45, 80);

      camera.lookAt(0, 5, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      outerCoreGeometry.dispose();
      outerCoreMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#040508]"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
