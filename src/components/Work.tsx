import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  {
    title: "Civic-I",
    category: "AI & Civic Tech",
    tools: "React, Vite, Tailwind CSS, Firebase Auth, Ollama (Gemma 3 & Llama 3), Leaflet, OpenStreetMap",
    description:
      "AI-assisted civic hazard reporting web app for citizens and municipal authorities of Palghar City, Maharashtra. Citizens photograph and geolocate issues like potholes, broken street lights, and garbage; two local Ollama models (Gemma 3 for photo inspection, Llama 3 for priority & department routing) assist with human confirmation. Features interactive OpenStreetMap with Leaflet and gamification (points, badges, leaderboard).",
    image: "/images/projects/civic-i.webp",
    link: "https://github.com/mrigank-2705",
  },
  {
    title: "Sainik Sahayak",
    category: "Offline RAG AI Assistant",
    tools: "Python, LangChain, ChromaDB, Ollama (Llama 3.2), FastAPI, Streamlit",
    description:
      "Fully offline AI assistant for Indian Army personnel that answers military topics using Retrieval-Augmented Generation. Retrieves from a 236-entry knowledge base (medical, weapons, field craft, tactics, administration) stored in ChromaDB, generating accurate responses with Llama 3.2 and source references via Web UI, CLI, and Streamlit with zero internet requirement.",
    image: "/images/projects/sainik-sahayak.webp",
    link: "https://github.com/mrigank-2705",
  },
  {
    title: "Gate Entry-Exit",
    category: "Campus Access Automation",
    tools: "React, TypeScript, Vite, Tailwind CSS, Supabase, html5-qrcode",
    description:
      "Campus access management system that logs student entry and exit through QR code scanning. Features a live real-time dashboard of campus entries and exits, searchable activity logs, and comprehensive student record management with instant cloud sync.",
    image: "/images/projects/gate-entry.webp",
    link: "https://github.com/mrigank-2705",
  },
  {
    title: "CanteenShare",
    category: "Web Application & Database",
    tools: "React, TypeScript, Supabase, Tailwind CSS, SQL",
    description:
      "Canteen-focused web application designed with a robust Supabase database and comprehensive product requirements document (PRD). Engineered for sharing, tracking, and managing campus canteen orders efficiently.",
    image: "/images/projects/canteenshare.webp",
    link: "https://github.com/mrigank-2705",
  },
];

const Work = () => {
  useGSAP(() => {
    const section = document.querySelector(".work-section") as HTMLElement | null;
    const flex = section?.querySelector(".work-flex") as HTMLElement | null;
    if (!section || !flex || window.innerWidth <= 1025) return;

    function getScrollWidth() {
      const currentX = Number(gsap.getProperty(flex, "x")) || 0;
      const untransformedLeft = flex.getBoundingClientRect().left - currentX;
      return Math.max(
        0,
        untransformedLeft + flex.scrollWidth - section.clientWidth
      );
    }

    if (getScrollWidth() === 0) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollWidth()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        id: "work",
      },
    });

    timeline.to(flex, {
      x: () => -getScrollWidth(),
      ease: "none",
    });

    const refreshAfterLayout = () => ScrollTrigger.refresh();
    window.addEventListener("load", refreshAfterLayout);

    return () => {
      window.removeEventListener("load", refreshAfterLayout);
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Featured <span>Projects</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools & Technologies</h4>
                <p>{project.tools}</p>
                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    color: "#adacac",
                  }}
                >
                  {project.description}
                </p>
              </div>
              <WorkImage
                image={project.image}
                alt={project.title}
                link={project.link}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
