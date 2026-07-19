import { IconBrain } from "./Icons";

const steps = [
  { title: "Upload",  desc: "Drop a PDF in the left sidebar" },
  { title: "Ask",     desc: "Type any question about the paper" },
  { title: "Explore", desc: "Read the answer with source citations" },
];

export default function WelcomeScreen() {
  return (
    <div className="welcome">
      <div className="welcome-icon"><IconBrain size={32} /></div>
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
