import type { AppProps } from 'next/app'
import { useState, useEffect, ChangeEvent } from 'react'
import './App.css'
import { Configuration, OpenAIApi } from 'openai'
import getConfig from 'next/config'

export default function App({ Component, pageProps }: AppProps) {
  const [imgURL, setImgURL] = useState('/robot-painting_svg.svg')
  const [userTextInput, setUserTextInput] = useState('')
  const [imageTitel, setImageTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [typedText, setTypedText] = useState('')

  const text = 'Generating image...'

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
    setLoading(true)
    const response = await openai.createImage({
      prompt: userTextInput,
      n: 1,
      size: '1024x1024',
    })
    setLoading(false)
    setUserTextInput('')
    const image_url = response.data.data[0].url
    setImgURL(image_url || 'no image found')
  }

  const handleUserInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserTextInput(e.target.value)
  }

  useEffect(() => {
    if (loading) {
      setImageTitle(userTextInput)
      let i = 0
      const typing = setInterval(() => {
        setTypedText(text.slice(0, i))
        i++
        if (i > text.length + 1) {
          i = 0
          setTypedText('')
        }
      }, 100)
      return () => clearInterval(typing)
    }
  }, [loading])

  return (
    <div className="app-main">
      <h2>Create images with your mind</h2>
      <textarea
        className="app-input"
        placeholder="Create any type of image you can think of with as much added description as you would like"
        onChange={(e) => handleUserInput(e)}
        value={userTextInput}
      />
      <button onClick={generateImage}>Generate Image</button>
      <>
        {loading ? (
          <>
            <h4>{typedText}</h4>
            <div className="ripple-effect">
              <div></div>
              <div></div>
            </div>
          </>
        ) : (
          <>
            <h4>{imageTitel}</h4>
            <img src={imgURL} alt="Robot painting img" />
          </>
        )}
      </>
    </div>
  )
}
