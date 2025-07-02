import React, { useState } from 'react'
import { InferenceClient } from "@huggingface/inference";
import './App.css'

const HF_TOKEN = "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"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Got a Fruit!</h1>
    </>
  )
}

export default App
