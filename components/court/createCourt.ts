import * as THREE from "three";

// Original procedural models, in world space. No remote model or texture dependencies.
export function createCourt() {
  const world = new THREE.Group();
  const resources: THREE.Texture[] = [];
  let seed = 39;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const canvas = (w: number, h: number) => {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    return { canvas: c, ctx: c.getContext("2d")! };
  };
  const texture = (c: HTMLCanvasElement, color = true) => {
    const t = new THREE.CanvasTexture(c);
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8; resources.push(t); return t;
  };
  const wood = canvas(1024, 2048);
  wood.ctx.fillStyle = "#b48959"; wood.ctx.fillRect(0, 0, 1024, 2048);
  for (let x = 0; x < 1024; x += 32) {
    for (let y = -Math.floor(random() * 240); y < 2048; y += 256) {
      const light = 52 + random() * 15;
      wood.ctx.fillStyle = `hsl(33 40% ${light}%)`;
      wood.ctx.fillRect(x + 1, y + 1, 31, 255);
      for (let grain = 0; grain < 30; grain++) {
        const gx = x + random() * 32;
        wood.ctx.strokeStyle = `rgba(63,39,18,${.025 + random() * .08})`;
        wood.ctx.lineWidth = .4 + random() * .7;
        wood.ctx.beginPath(); wood.ctx.moveTo(gx, y);
        wood.ctx.bezierCurveTo(gx + 5, y + 80, gx - 5, y + 170, gx + random() * 4, y + 256);
        wood.ctx.stroke();
      }
    }
  }
  // Court dimensions are mapped directly to the floor texture.
  const c = wood.ctx; c.save(); c.scale(1024 / 17, 2048 / 30); c.translate(8.5, 15);
  c.fillStyle = "#151515";
  c.fillRect(-8.5, -15, 17, 1); c.fillRect(-8.5, 14, 17, 1);
  c.fillRect(-8.5, -14, 1, 28); c.fillRect(7.5, -14, 1, 28);
  c.strokeStyle = "#f0e5ce"; c.lineWidth = .055;
  c.strokeRect(-7.5, -14, 15, 28);
  c.beginPath(); c.moveTo(-7.5, 0); c.lineTo(7.5, 0); c.stroke();
  c.beginPath(); c.arc(0, 0, 1.8, 0, Math.PI * 2); c.stroke();
  for (const direction of [-1, 1]) {
    c.save(); c.scale(1, direction);
    c.fillStyle = "rgba(12,12,12,.83)"; c.fillRect(-2.45, -14, 4.9, 5.8);
    c.strokeRect(-2.45, -14, 4.9, 5.8);
    c.beginPath(); c.arc(0, -8.2, 1.8, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.arc(0, -12.4, 6.75, .22, Math.PI - .22); c.stroke();
    c.beginPath(); c.moveTo(-6.59, -14); c.lineTo(-6.59, -10.93); c.moveTo(6.59, -14); c.lineTo(6.59, -10.93); c.stroke();
    c.restore();
  }
  c.restore();
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(17, 30), new THREE.MeshPhysicalMaterial({ map: texture(wood.canvas), roughness: .4, clearcoat: .35, clearcoatRoughness: .35 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; world.add(floor);
  const base = new THREE.Mesh(new THREE.BoxGeometry(17.1, .16, 30.1), new THREE.MeshStandardMaterial({ color: "#101010", roughness: .6 }));
  base.position.y = -.085; world.add(base);

  const steel = new THREE.MeshStandardMaterial({ color: "#343434", metalness: .6, roughness: .35 });
  const ivory = new THREE.MeshStandardMaterial({ color: "#e9e3d2", roughness: .65 });
  const orange = new THREE.MeshStandardMaterial({ color: "#c45324", roughness: .45, metalness: .3 });
  function rod(a: THREE.Vector3, b: THREE.Vector3, radius: number, mat: THREE.Material, parent: THREE.Group) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 8), mat);
    mesh.position.copy(a).add(b).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    parent.add(mesh); return mesh;
  }
  function hoop(z: number, reverse: boolean) {
    const h = new THREE.Group(); h.position.z = z; if (reverse) h.rotation.y = Math.PI;
    const post = new THREE.Mesh(new THREE.BoxGeometry(.23, 3.7, .3), steel); post.position.set(0, 1.85, -1.35); post.castShadow = true; h.add(post);
    rod(new THREE.Vector3(0, 3.5, -1.35), new THREE.Vector3(0, 3.45, 0), .07, steel, h);
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.83, 1.07, .065), new THREE.MeshPhysicalMaterial({ color: "#e3e3e3", transparent: true, opacity: .38, roughness: .15, metalness: .1 }));
    board.position.set(0, 3.6, 0); h.add(board);
    const frame = new THREE.LineSegments(new THREE.EdgesGeometry(board.geometry), new THREE.LineBasicMaterial({ color: "#e9e3d2" })); frame.position.copy(board.position); h.add(frame);
    for (const [a, b] of [[[-.3, 3.2, .04], [-.3, 3.65, .04]], [[.3, 3.2, .04], [.3, 3.65, .04]], [[-.3, 3.65, .04], [.3, 3.65, .04]], [[-.3, 3.2, .04], [.3, 3.2, .04]]]) rod(new THREE.Vector3(...a), new THREE.Vector3(...b), .012, ivory, h);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(.45, .022, 12, 64), orange); rim.rotation.x = Math.PI / 2; rim.position.set(0, 3.12, .51); rim.castShadow = true; h.add(rim);
    rod(new THREE.Vector3(0, 3.12, 0), new THREE.Vector3(0, 3.12, .08), .035, orange, h);
    const net = new THREE.Group(); net.position.set(0, 3.12, .51); h.add(net);
    for (let i = 0; i < 12; i++) {
      for (let level = 0; level < 4; level++) {
        const angle = i / 12 * Math.PI * 2 + (level % 2) * Math.PI / 12;
        const r1 = .45 - level * .045, r2 = .45 - (level + 1) * .045;
        for (const d of [-1, 1]) {
          const next = angle + d * Math.PI / 12;
          rod(new THREE.Vector3(Math.cos(angle) * r1, -.02 - level * .12, Math.sin(angle) * r1), new THREE.Vector3(Math.cos(next) * r2, -.14 - level * .12, Math.sin(next) * r2), .006, ivory, net);
        }
      }
    }
    world.add(h); return net;
  }
  const farNet = hoop(-12.6, false); hoop(12.6, true);

  // Four seam planes share the panel axis: eight curved leather panels.
  const seamDistance = (x: number, y: number, z: number) =>
    Math.min(Math.abs(y), Math.abs(z), Math.abs(y - z) / Math.SQRT2, Math.abs(y + z) / Math.SQRT2);
  const leather = canvas(2048, 1024), bump = canvas(2048, 1024);
  leather.ctx.fillStyle = "#ac4e1f"; leather.ctx.fillRect(0, 0, 2048, 1024);
  bump.ctx.fillStyle = "#484848"; bump.ctx.fillRect(0, 0, 2048, 1024);
  for (let y = 0; y < 1024; y += 5.5) for (let x = 0; x < 2048; x += 5.5) {
    const px = x + (Math.round(y / 5.5) % 2 ? 2.75 : 0) + random() * .7;
    const py = y + random() * .7;
    leather.ctx.fillStyle = `hsl(23 66% ${36 + random() * 3}%)`;
    leather.ctx.beginPath(); leather.ctx.ellipse(px, py, 2.15, 2.05, random(), 0, Math.PI * 2); leather.ctx.fill();
    const gray = Math.floor(165 + random() * 30);
    bump.ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
    bump.ctx.beginPath(); bump.ctx.ellipse(px, py, 2.1, 2, 0, 0, Math.PI * 2); bump.ctx.fill();
    bump.ctx.fillStyle = "#dadada";
    bump.ctx.beginPath(); bump.ctx.ellipse(px - .25, py - .25, 1.2, 1.1, 0, 0, Math.PI * 2); bump.ctx.fill();
  }
  // Paint channels at texture resolution, so their width remains crisp close up.
  const pixels = leather.ctx.getImageData(0, 0, 2048, 1024);
  const relief = bump.ctx.getImageData(0, 0, 2048, 1024);
  for (let y = 0; y < 1024; y++) {
    const theta = y / 1024 * Math.PI, ny = Math.cos(theta), ring = Math.sin(theta);
    for (let x = 0; x < 2048; x++) {
      const phi = x / 2048 * Math.PI * 2;
      const distance = seamDistance(-Math.cos(phi) * ring, ny, Math.sin(phi) * ring);
      const channel = 1 - THREE.MathUtils.smoothstep(distance, .014, .024);
      if (!channel) continue;
      const index = (y * 2048 + x) * 4;
      for (let component = 0; component < 3; component++) {
        pixels.data[index + component] = THREE.MathUtils.lerp(pixels.data[index + component], 16, channel);
        relief.data[index + component] = THREE.MathUtils.lerp(relief.data[index + component], 30, channel);
      }
    }
  }
  leather.ctx.putImageData(pixels, 0, 0); bump.ctx.putImageData(relief, 0, 0);
  const radius = .3;
  const geometry = new THREE.SphereGeometry(radius, 256, 192);
  const pos = geometry.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const channel = 1 - THREE.MathUtils.smoothstep(seamDistance(v.x, v.y, v.z), .012, .026);
    v.multiplyScalar(radius - channel * .0025); pos.setXYZ(i, v.x, v.y, v.z);
  }
  geometry.computeVertexNormals();
  const ball = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({ map: texture(leather.canvas), bumpMap: texture(bump.canvas, false), bumpScale: .0012, roughness: .92, clearcoat: 0 }));
  ball.position.set(0, radius + .002, 0); ball.rotation.set(.1, .1, -.24); ball.castShadow = true; world.add(ball);

  // A soft contact shadow supplements the directional shadow at close range.
  const shadow = canvas(128, 128); const gradient = shadow.ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  gradient.addColorStop(0, "rgba(0,0,0,.65)"); gradient.addColorStop(1, "rgba(0,0,0,0)"); shadow.ctx.fillStyle = gradient; shadow.ctx.fillRect(0, 0, 128, 128);
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), new THREE.MeshBasicMaterial({ map: texture(shadow.canvas), transparent: true, depthWrite: false }));
  contact.rotation.x = -Math.PI / 2; contact.position.y = .008; world.add(contact);
  return { world, ball, contact, farNet, resources };
}
