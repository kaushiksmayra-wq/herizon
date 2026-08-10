import { useState } from "react";
import Dropdown from "./Dropdown";
function Navbar() {

  const [activeMenu, setActiveMenu] = useState(null);

  const featureItems = [
    "AI Emotion Detection",
    "Race Radio Transcription",
    "Driver Sentiment Analysis",
    "AI Generated Summary"
  ];
  const howItWorksItems = [
  "Upload Race Radio",
  "AI Transcribes Audio",
  "Detect Driver Emotions",
  "Generate Race Insights"
];
const aboutItems = [
  "The Silent Co-Driver",
  "Powered by Herizon AI",
  "AI-powered Formula 1 Analysis",
  "Built for Hackathons"
];
  return (
    <nav className="navbar">
      <div className="logo">
        HERIZON <span>AI</span>
      </div>

      <div className="nav-links">
       <div
  className="nav-item"
  onClick={() =>
    setActiveMenu(activeMenu === "features" ? null : "features")
  }
>
  Features

  <Dropdown
    title="Features"
    items={featureItems}
    isOpen={activeMenu === "features"}
  />
</div>
       <div
  className="nav-item"
  onClick={() =>
    setActiveMenu(activeMenu === "how" ? null : "how")
  }
>
  How it Works

  <Dropdown
    title="How it Works"
    items={howItWorksItems}
    isOpen={activeMenu === "how"}
  />
</div>
        <div
  className="nav-item"
  onClick={() =>
    setActiveMenu(activeMenu === "about" ? null : "about")
  }
>
  About

  <Dropdown
    title="About"
    items={aboutItems}
    isOpen={activeMenu === "about"}
  />
</div>
      </div>
    </nav>
  );
}

export default Navbar;