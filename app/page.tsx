"use client"

import ProgrammeBuilder from "@/components/pages/builder/builder"
import IntroductionHeader from "@/components/pages/intro/header"
import { TrackSelector } from "@/components/pages/track/selector"
import { BuiltProgramme, Step } from "@/types/types"
import { useState } from "react"


export default function MSCValidationPage() {
  // Selected page state
  const [currentStep, setCurrentStep] = useState<Step>("intro")
  const [builtProgramme, setBuiltProgramme] = useState<BuiltProgramme | null>(null)

  const header =
    currentStep === "intro" ? <IntroductionHeader setCurrentStep={setCurrentStep} setProgramme={setBuiltProgramme} /> :
      currentStep === "track-selection" ? <TrackSelector currentProgramme={builtProgramme!} setProgramme={setBuiltProgramme} setCurrentStep={setCurrentStep} /> :
        <div className="min-h-screen bg-slate-50 p-4">
          <ProgrammeBuilder currentProgramme={builtProgramme!} setBuiltProgramme={setBuiltProgramme} setCurrentStep={setCurrentStep} />
        </div>



  return (
    <>
      <div className="fixed inset-x-0 bottom-0 text-gray-400 m-0 p-4 text-sm text-center bg-white">
        Not affiliated with or endorsed by the University of Groningen.
      </div>

     {header}
    </>
  )
}

