'use client';

import { useMenuContext } from "@/context/menuContext";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";

export default function Menu() {
  const { step } = useMenuContext();

  const steps = [
    <Step1 key={0} />,
    <Step2 key={1} />,
    <Step3 key={2} />
  ]

  return (
    <div className="menu">
      <div className="step-circles h-1/6 flex">
        {steps.map((_, i) => (
          <div key={step} className={`circle ${i < step ? 'completed' : ''} ${i === step ? 'current' : ''}`}>
            <span>{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="h-5/6 py-6 px-10">
        {steps[step]}
      </div>
      <footer>
        <div>Copyright © 2024 rutIA by CC Lab</div>
        <div> Iconos diseñados por <a href="https://smashicons.com/" title="Smashicons"> Smashicons </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es</a></div>
      </footer>
    </div>
  )
}