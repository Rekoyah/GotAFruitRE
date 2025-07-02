import React, { useState } from 'react'
import { InferenceClient } from "@huggingface/inference";
import './App.css'

const HF_TOKEN = "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";

const client = new InferenceClient(HF_TOKEN);


function App() {
  const [fruitName, setFruitName] = useState("");
  const [fruitData, setFruitData]= useState(null);
  const [summary, setSummary] = useState("")
  const [error, setError] = useState("")

  const handleSearch = async () => {
    setError("");
    setFruitData(null);
    setSummary("");

  try {
    const response = await fetch(`https://www.fruityvice.com/api/fruit/${fruitName.toLowerCase()}`);
    if (!response.ok) throw new Error("Fruit not found.");
    const data = await response.json();
    setFruitData(data);

    const inputText = `The ${fruitName} contains ${data.nutritions.sugar}g of sugar, ${data.nutritions.protein}g of protein, ${data.nutritions.fat}g of fat, and ${data.nutritions.calories} calories.`;

    const result = await client.texttoText({
      model: "facebook/bart-large-cnn",
      inputs: inputText,
      parameters: {
        max_new_tokens: 60,
      },
    });

    setSummary(result.generated_text || "No summary generated.");
  } catch (err) {
    console.error(err);
    setError("Could not fetch data or generate summary.");
  }
  }


  return (
    <>
      <h1>Got a Fruit!</h1>
      <input
        type="text"
        placeholder="Enter a fruit"
        value={fruitName}
        onChange={(e) => setFruitName(e.target.value)}
        style={{ padding: 8, marginRight: 10 }}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {fruitData && (
        <div style={{ marginTop: 20 }}>
          <h2>{fruitData.name}</h2>
          <p><strong>Family:</strong> {fruitData.family}</p>
          <p><strong>Order:</strong> {fruitData.order}</p>
          <ul>
            <li>Carbs: {fruitData.nutritions.carbohydrates}g</li>
            <li>Protein: {fruitData.nutritions.protein}g</li>
            <li>Fat: {fruitData.nutritions.fat}g</li>
            <li>Calories: {fruitData.nutritions.calories}</li>
            <li>Sugar: {fruitData.nutritions.sugar}g</li>
          </ul>
        </div>
      )}

      {summary && (
        <div style={{ marginTop: 20 }}>
          <h3>🧠 AI Summary</h3>
          <p>{summary}</p>
        </div>
      )}  
    </>
  )
}

export default App
