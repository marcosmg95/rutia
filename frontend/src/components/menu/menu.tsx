'use client';

import { useMenuContext } from "@/context/menuContext";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";

export default function Menu() {
  const { step, setStep, finishLoading } = useMenuContext();

  const steps = [
    { key: 0, view: <Step1 /> },
    { key: 1, view: <Step2 /> },
    { key: 2, view: <Step3 /> }
  ]

  return (
    <div className="menu">
      <div className="step-circles h-1/6 flex py-3">
        {steps.map(({ key }, i) => (
          <div
            key={key}
            className={`circle  ${i === step ? 'current' : ''} ${i < step ? 'completed hover:cursor-pointer' : ''} ${step == 2 && finishLoading ? 'completed' : ''}`}
            onClick={() => { if (i < step) setStep(i) }}
          >
            <span>{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="max-h-full px-10 w-full grow shrink overflow-y-auto flex flex-col">
        {steps.find((x) => x.key === step)?.view}
        <footer className="pt-6 pb-1 w-full">
          <div>Copyright © 2024 CC Lab</div>
          <div className="atribucio">Icones dissenyades per <a href="https://smashicons.com/" title="Smashicons"> Smashicons </a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es</a></div>
        </footer>
      </div>

    </div>
  )
}