const IconBrain = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.16Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.16Z"/>
  </svg>
);

const steps = [
  { title: "Upload",  desc: "Drop a PDF in the left sidebar" },
  { title: "Ask",     desc: "Type any question about the paper" },
  { title: "Explore", desc: "Read the answer with source citations" },
];

export default function WelcomeScreen() {
  return (
    <div className="welcome">
      <div className="welcome-icon"><IconBrain /></div>
      <h2>Ask your research paper</h2>
      <p>
        Upload a PDF and ask any question. PaperMind AI retrieves the most
        relevant sections and gives you a grounded answer with page citations.
      </p>
      <div className="welcome-steps">
        {steps.map((step, i) => (
          <div className="step" key={i}>
            <div className="step-num">{i + 1}</div>
            <div className="step-text">
              <strong>{step.title}</strong>
              {step.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
