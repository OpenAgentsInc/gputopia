"use client"

import "./App.css"
import Image from "next/image"
import { useState } from "react"
import example1 from "./imageassets/example1.png"
import example2 from "./imageassets/example2.png"
import example4 from "./imageassets/example4.png"
import example5 from "./imageassets/example5.png"
import example6 from "./imageassets/example6.png"

const generateImageFromPrompt = (prompt: string) => {
  if (prompt.includes("cat")) {
    return example1;
  } else if (prompt.includes("dog")) {
    return example5;
  } else if (prompt.includes("bird")) {
    return example4;
  } else {
    return example5;
  }
}

export default function Imagine() {
  const [prompt, setPrompt] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  const resetToDefault = () => {
    setIsGenerated(false);
    // Reset any other state variables here if needed in the future
  };

  const handleGenerateClick = () => {
    const imageUrl = generateImageFromPrompt(prompt);
    setGeneratedImageUrl(imageUrl);
    setIsGenerated(true);
  };


  return (
    <div>
      <header>
        <h1>GPUTOPIA</h1>
        <button onClick={resetToDefault}>Image Generation</button>
      </header>

      <main>
        {!isGenerated && (
          <div className="info-box">
            This is an image generator using Stable Diffusion v1.4, powered by a decentralized network of GPU nodes. Image generation requests are paid in bitcoin sats, currently at 7 sats per Stable Diffusion v1.4 generation. GPUtopia takes a 1-sat platform fee, and the remainder goes to the provider of the GPU compute that processes the image generation. Generated images are not saved. Your requests are not shared, but also not private. Don't share sensitive prompts.
          </div>
        )}
        <div className="input-container" style={{ marginTop: isGenerated ? '50px' : '20px' }}>
          <input type="text" id="promptInput" placeholder="Enter your prompt here..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button id="generateImage" onClick={handleGenerateClick}>Generate</button>
        </div>


        {isGenerated && (
          <div id="output">
            <div className="image-container">
              <Image src={generatedImageUrl} alt="Generated Image" className="generatedImage" />
            </div>
          </div>
        )}
        {!isGenerated && (
          <div id="result">
            <div className="left-images">
              <div className="image-container">
                <Image src={example2} alt="Generated Image 1" className="generatedImage image1" />
                <div className="overlay-text">Cyberpunk super-car with TRON style lighting and colors in a futuristic city</div>
              </div>
              <div className="image-container">
                <Image src={example5} alt="Generated Image 1" className="generatedImage image1" />
                <div className="overlay-text">A hyperrealistic photo of an astronaut looking directly at the camera taking a photo in front of the opening of a black hole in space</div>
              </div>
            </div>

            <div className="center-left-images">
              <div className="image-container">
                <Image src={example4} alt="Generated Image 4" className="generatedImage image4" />
                <div className="overlay-text">Painting of a man standing on a mountain with the ladscape of Starry Night by Van Gogh </div>
              </div>
              <div className="image-container">
                <Image src={example6} alt="Generated Image 4" className="generatedImage image4" />
                <div className="overlay-text"> A techno accelerationist utopian city skyline</div>
              </div>
            </div>

            <div className="right-images">
              <div className="image-container">
                <Image src={example1} alt="Generated Image 2" className="generatedImage image2" />
                <div className="overlay-text">A beautiful wooden house built on an island floating in the sky </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
