"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createCourt } from "./createCourt";
import { sampleCourtMotion } from "./courtMotion";

export default function CourtScene() {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const container = host.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" }); }
    catch { setStatus("unavailable"); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene(); scene.background = new THREE.Color("#000000");
    scene.fog = new THREE.FogExp2("#000000", .025);
    const camera = new THREE.PerspectiveCamera(39, 1, .05, 100);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment(); const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture; scene.environmentIntensity = .32;
    room.dispose(); pmrem.dispose();
    const { world, ball, contact, farNet, resources } = createCourt(); scene.add(world);
    const ambient = new THREE.HemisphereLight("#f2f2f2", "#493321", 1.3); scene.add(ambient);
    const key = new THREE.DirectionalLight("#fff0da", 3.1); key.position.set(-3, 9, 4); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); key.shadow.normalBias = .003; key.shadow.bias = -.0001; scene.add(key);
    const rim = new THREE.DirectionalLight("#e8e8e8", 1.1); rim.position.set(5, 4, -8); scene.add(rim);
    const surroundings = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), new THREE.MeshBasicMaterial({ color: "#000000" })); surroundings.rotation.x = -Math.PI / 2; surroundings.position.y = -.18; scene.add(surroundings);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, targetScroll = 0, scroll = 0, raf = 0, active = true;
    let initialized = false;
    const story = document.querySelector<HTMLElement>(".court-story")!;
    const chapters = Array.from(story.querySelectorAll<HTMLElement>("[data-court-scene]"));
    let stops: number[] = [];
    const progressBar = document.querySelector<HTMLElement>("[data-court-progress]");
    const phaseLabel = document.querySelector<HTMLElement>("[data-court-label]");
    const pointer = new THREE.Vector2();
    const aim = new THREE.Vector3();
    function readScroll() {
      const y = window.scrollY;
      let chapter = 0;
      while (chapter < stops.length - 1 && y >= stops[chapter + 1]) chapter++;
      const fraction = chapter < stops.length - 1 ? THREE.MathUtils.clamp((y - stops[chapter]) / Math.max(1, stops[chapter + 1] - stops[chapter]), 0, 1) : 0;
      targetScroll = Math.min(6, chapter + fraction);
      if (!initialized) { scroll = targetScroll; initialized = true; }
      if (phaseLabel) phaseLabel.textContent = chapters[Math.min(chapters.length - 1, chapter + (fraction > .5 ? 1 : 0))]?.dataset.courtName ?? "Introduction";
      if (progressBar) progressBar.style.transform = `scaleX(${targetScroll / 6})`;
      active = !document.hidden;
      if (active && !raf) raf = requestAnimationFrame(render);
    }
    function measure() {
      stops = chapters.map(chapter => chapter.getBoundingClientRect().top + window.scrollY);
      readScroll();
    }
    function resize() {
      width = container.clientWidth; height = container.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height); measure();
    }
    function move(e: PointerEvent) {
      if (e.pointerType !== "mouse" || motion.matches) return;
      pointer.set(e.clientX / width - .5, e.clientY / height - .5);
      if (active && !raf) raf = requestAnimationFrame(render);
    }
    function render() {
      raf = 0; if (!active) return;
      scroll = motion.matches ? targetScroll : THREE.MathUtils.lerp(scroll, targetScroll, .085);
      const progress = motion.matches ? 6 : scroll;
      const state = sampleCourtMotion(progress, width < 700);
      camera.position.fromArray(state.camera); aim.fromArray(state.look);
      if (!motion.matches && progress < 1) { camera.position.x += pointer.x * .06; camera.position.y -= pointer.y * .025; }
      camera.lookAt(aim);
      ball.position.fromArray(state.ball); ball.rotation.x = .1 + state.rotation;
      const netResponse = Math.sin(THREE.MathUtils.clamp((progress - 5) / .35, 0, 1) * Math.PI);
      farNet.scale.set(1 + netResponse * .28, 1 + netResponse * .18, 1 + netResponse * .28);
      contact.position.set(ball.position.x, .008, ball.position.z);
      const heightAboveFloor = Math.max(0, ball.position.y - .302);
      contact.scale.setScalar(1 + heightAboveFloor * .15);
      (contact.material as THREE.MeshBasicMaterial).opacity = 1 / (1 + heightAboveFloor * .65);
      const shadowSize = THREE.MathUtils.lerp(2, 17, THREE.MathUtils.smoothstep(progress, 0, .8));
      key.shadow.camera.left = -shadowSize; key.shadow.camera.right = shadowSize;
      key.shadow.camera.top = shadowSize; key.shadow.camera.bottom = -shadowSize;
      key.shadow.camera.updateProjectionMatrix();
      renderer.render(scene, camera);
      // Settle scroll motion, then stop rendering until the next interaction.
      if (!motion.matches && Math.abs(scroll - targetScroll) > .0001) raf = requestAnimationFrame(render);
    }
    function visibility() { readScroll(); }
    function lost(e: Event) { e.preventDefault(); setStatus("unavailable"); active = false; }
    renderer.domElement.addEventListener("webglcontextlost", lost);
    const observer = new ResizeObserver(resize); observer.observe(container);
    const contentObserver = new ResizeObserver(measure); contentObserver.observe(story);
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", readScroll);
    resize(); setStatus("ready");
    return () => {
      active = false; cancelAnimationFrame(raf); observer.disconnect(); contentObserver.disconnect();
      window.removeEventListener("scroll", readScroll); window.removeEventListener("pointermove", move); document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", readScroll);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      world.traverse(o => { if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) { o.geometry.dispose(); const mats = Array.isArray(o.material) ? o.material : [o.material]; mats.forEach(m => m.dispose()); } });
      resources.forEach(t => t.dispose()); surroundings.geometry.dispose(); (surroundings.material as THREE.Material).dispose(); key.shadow.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div className="court-render" ref={host} role="img" aria-label="A three-dimensional basketball court remains behind the portfolio. Scrolling moves the camera and ball through rolls, dribbles, and a shot." data-status={status}>{status !== "ready" && <span className="court-loading">{status === "loading" ? "Opening the court…" : "The 3D preview is unavailable on this device. Explore the portfolio below."}</span>}</div>;
}
