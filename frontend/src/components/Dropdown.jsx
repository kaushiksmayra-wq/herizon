function Dropdown({ title, items, isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="dropdown-card">
      <h3>{title}</h3>

      {title === "About" ? (
        <p className="about-text">
          <strong>The Silent Co-Driver</strong> is an AI-powered Formula 1 race
          intelligence platform developed by <strong>Herizon AI</strong>. It
          transforms race radio into meaningful insights using speech
          recognition, emotion detection, and natural language processing.
          Designed for teams, analysts, and enthusiasts, it uncovers the
          strategy, emotions, and decisions behind every lap.
        </p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <div key={index}>
              <li>{item}</li>

              {title === "How it Works" &&
                index !== items.length - 1 && (
                  <div className="workflow-arrow">
                    │
                    <br />
                    ▼
                  </div>
                )}
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;