import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import "./styles/TechStack.css";

const SKILL_BALLS = [
  { name: "Python", sub: "Core Language", bg: "#1e293b", text: "#38bdf8" },
  { name: "LLMs", sub: "AI & ML", bg: "#2e1065", text: "#c084fc" },
  { name: "RAG", sub: "Retrieval AI", bg: "#064e3b", text: "#34d399" },
  { name: "Deep Learning", sub: "Neural Nets", bg: "#4c0519", text: "#fb7185" },
  { name: "Machine Learning", sub: "Models", bg: "#172554", text: "#60a5fa" },
  { name: "AI Agents", sub: "Reasoning", bg: "#451a03", text: "#fbbf24" },
  { name: "NLP", sub: "Language", bg: "#3b0764", text: "#e879f9" },
  { name: "DSA", sub: "Algorithms", bg: "#0f172a", text: "#38bdf8" },
  { name: "LangChain", sub: "Orchestration", bg: "#134e4a", text: "#2dd4bf" },
  { name: "ChromaDB", sub: "Vector DB", bg: "#4a044e", text: "#f472b6" },
  { name: "FastAPI", sub: "APIs & MLOps", bg: "#064e3b", text: "#4ade80" },
  { name: "Ollama", sub: "Local Models", bg: "#1e293b", text: "#e2e8f0" },
];

function createSkillTexture(
  name: string,
  sub: string,
  bgColor: string,
  textColor: string
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 512, 512);

  // Outer border circle
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(256, 256, 236, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle gradient inner ring
  const gradient = ctx.createRadialGradient(256, 256, 100, 256, 256, 230);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.08)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.35)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(256, 256, 226, 0, Math.PI * 2);
  ctx.fill();

  // Skill Name
  ctx.fillStyle = textColor;
  ctx.font = name.length > 12 ? "bold 44px sans-serif" : "bold 56px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name, 256, sub ? 230 : 256);

  // Subtitle / domain
  if (sub) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "600 28px sans-serif";
    ctx.fillText(sub, 256, 295);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(24)].map(() => ({
  scale: [0.75, 0.9, 1, 0.85, 1.05][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const workEl = document.getElementById("work");
      const threshold = workEl ? workEl.getBoundingClientRect().top : 500;
      setIsActive(scrollY > threshold);
    };

    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const materials = useMemo(() => {
    return SKILL_BALLS.map((skill) => {
      const texture = createSkillTexture(
        skill.name,
        skill.sub,
        skill.bg,
        skill.text
      );
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        emissive: "#ffffff",
        emissiveMap: texture,
        emissiveIntensity: 0.35,
        metalness: 0.35,
        roughness: 0.6,
        clearcoat: 0.2,
      });
    });
  }, []);

  return (
    <div className="techstack" id="techstack">
      <h2 className="techstack-title">
        Technical <span>Skills</span>
      </h2>

      <div className="tech-canvas-wrapper">
        <Canvas
          shadows
          gl={{ alpha: true, stencil: false, depth: false, antialias: true }}
          camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
          onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
          className="tech-canvas"
        >
          <ambientLight intensity={1.2} />
          <spotLight
            position={[20, 20, 25]}
            penumbra={1}
            angle={0.25}
            color="white"
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <directionalLight position={[0, 5, -4]} intensity={2} />
          <Physics gravity={[0, 0, 0]}>
            <Pointer isActive={isActive} />
            {spheres.map((props, i) => (
              <SphereGeo
                key={i}
                {...props}
                material={
                  materials[i % materials.length]
                }
                isActive={isActive}
              />
            ))}
          </Physics>
          <Environment
            files="/models/char_enviorment.hdr"
            environmentIntensity={0.5}
            environmentRotation={[0, 4, 2]}
          />
          <EffectComposer enableNormalPass={false}>
            <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="skills-grid-container">
        <div className="skill-category-card">
          <h3>AI & Machine Learning</h3>
          <div className="skill-tags-wrapper">
            <span className="skill-tag">LLMs</span>
            <span className="skill-tag">NLP</span>
            <span className="skill-tag">RAG</span>
            <span className="skill-tag">Machine Learning</span>
            <span className="skill-tag">Deep Learning</span>
            <span className="skill-tag">AI Agents</span>
          </div>
        </div>

        <div className="skill-category-card">
          <h3>Programming Languages</h3>
          <div className="skill-tags-wrapper">
            <span className="skill-tag">Python</span>
            <span className="skill-tag">C++</span>
            <span className="skill-tag">TypeScript</span>
            <span className="skill-tag">JavaScript</span>
          </div>
        </div>

        <div className="skill-category-card">
          <h3>CS Fundamentals & Tools</h3>
          <div className="skill-tags-wrapper">
            <span className="skill-tag">Data Structures & Algorithms (DSA)</span>
            <span className="skill-tag">LangChain</span>
            <span className="skill-tag">ChromaDB</span>
            <span className="skill-tag">Ollama</span>
            <span className="skill-tag">FastAPI</span>
            <span className="skill-tag">Supabase</span>
          </div>
        </div>

        <div className="skill-category-card cert-card">
          <h3>Certifications</h3>
          <div className="skill-tags-wrapper">
            <span className="skill-tag cert-tag">IBM Certification</span>
            <span className="skill-tag cert-tag">Google AI Essentials</span>
            <span className="skill-tag cert-tag">Python</span>
            <span className="skill-tag cert-tag">C++</span>
            <span className="skill-tag cert-tag">Prompt Engineering</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;
