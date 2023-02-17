import type { AppProps } from 'next/app'
import { useState } from 'react'
import './App.css'
import { Configuration, OpenAIApi } from 'openai'
import getConfig from 'next/config'

export default function App({ Component, pageProps }: AppProps) {
  const [imgURL, setImgURL] = useState(
    'https://www.seekpng.com/ima/u2y3q8t4t4i1q8u2/',
  )
  //console.log(imgURL)

  const { publicRuntimeConfig } = getConfig()

  const apiKey =
    typeof publicRuntimeConfig !== 'undefined' && publicRuntimeConfig.apiKey
      ? publicRuntimeConfig.apiKey
      : process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('apiKey is not defined in config file')
  }
  console.log(publicRuntimeConfig.apiKey)

  const configuration = new Configuration({ apiKey })
  const openai = new OpenAIApi(configuration)

  const generateImage = async () => {
    const response = await openai.createImage({
      prompt: 'a white siamese cat',
      n: 1,
      size: '1024x1024',
    })
    const image_url = response.data.data[0].url
    console.log('image: ', image_url)
  }

  return (
    <div className="app-main">
      <h2>Create images with your mind</h2>
      <textarea
        className="app-input"
        placeholder="Create any type of image you can think of with as much added description as you would like"
      />
      <button onClick={generateImage}>Generate Image</button>
      <>
        <img src={imgURL} alt="Person placeholder" />;
      </>
    </div>
  )
}
