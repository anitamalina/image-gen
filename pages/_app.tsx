import type { AppProps } from 'next/app'
import { useState, useEffect, ChangeEvent, useRef } from 'react'
import './App.css'
import { Configuration, OpenAIApi } from 'openai'
import getConfig from 'next/config'

export default function App({ Component, pageProps }: AppProps) {
  const [imgURL, setImgURL] = useState('')
  const [userTextInput, setUserTextInput] = useState('')
  const [count, setCount] = useState(0)
  const [imageTitel, setImageTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  /*   const [typedText, setTypedText] = useState('') */

  const text = 'Generating image...'

  let verbs: string[],
    nouns: string[],
    adjectives: string[],
    preposition: string[],
    place: string[],
    preposition2: string[],
    item: string[]
  nouns = [
    'bird',
    'boy',
    'duck',
    'rhinoceros',
    'hamster',
    'dog',
    'bunny',
    'cat',
    'mouse',
    'girl',
  ]
  verbs = [
    'kicked',
    'ran',
    'flew',
    'drank',
    'sliced',
    'rolled',
    'breathed',
    'jumped',
    'ate',
    'shopped',
  ]
  adjectives = [
    'A beautiful',
    'A fancy',
    'A dancing',
    'A lovely',
    'A cute',
    'An elegant',
    'A mysterious',
    'A hot',
    'A dirty',
    'A slimy',
  ]
  preposition = [
    'down',
    'into',
    'up',
    'on',
    'upon',
    'below',
    'above',
    'through',
    'across',
    'towards',
  ]
  place = [
    'the moonlight',
    'the universe',
    'the beach',
    'the mountains',
    'the water',
    'the ocean',
    'Mars',
    'Earth',
    'Sahara',
    'clouds',
  ]
  preposition2 = [
    'with',
    'on',
    'close to',
    'behind',
    'upon',
    'below',
    'above',
    'across',
    'towards',
    'next to',
  ]
  item = [
    'a coffee cup',
    'a shoe',
    'a star',
    'a suitcase',
    'a drone',
    'a robot',
    'an elefant',
    'a diamond',
    'a magic wond',
    'a lollipop',
  ]

  const { publicRuntimeConfig } = getConfig()

  const apiKey =
    typeof publicRuntimeConfig !== 'undefined' && publicRuntimeConfig.apiKey
      ? publicRuntimeConfig.apiKey
      : process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('apiKey is not defined in config file')
  }

  const configuration = new Configuration({ apiKey })
  const openai = new OpenAIApi(configuration)

  const generateImage = async () => {
    setLoading(true)
    setImageTitle(userTextInput)
    let response: any
    try {
      response = await openai.createImage({
        prompt: userTextInput,
        n: 1,
        size: '1024x1024',
      })
      const image_url = response.data.data[0].url
      setImgURL(image_url || 'no image found')
    } catch (e: any) {
      setRequestErrorMessage(e.response.data.error.message)
    } finally {
      setLoading(false)
      setUserTextInput('')
    }
  }

  const generateRandomImage = async () => {
    const sentence = generateRandomSentence()
    setImageTitle(sentence)
    setLoading(true)
    const response = await openai.createImage({
      prompt: sentence,
      n: 1,
      size: '1024x1024',
    })
    setLoading(false)
    const image_url = response.data.data[0].url
    setImgURL(image_url || 'no image found')
  }

  const generateRandomSentence = () => {
    var rand1 = Math.floor(Math.random() * 10)
    var rand2 = Math.floor(Math.random() * 10)
    var rand3 = Math.floor(Math.random() * 10)
    var rand4 = Math.floor(Math.random() * 10)
    var rand5 = Math.floor(Math.random() * 10)
    var rand6 = Math.floor(Math.random() * 10)
    var rand7 = Math.floor(Math.random() * 10)

    var sentence =
      adjectives[rand1] +
      ' ' +
      nouns[rand2] +
      ' ' +
      verbs[rand3] +
      ' ' +
      preposition[rand4] +
      ' ' +
      place[rand5] +
      ' ' +
      preposition2[rand6] +
      ' ' +
      item[rand7] +
      '.'

    return sentence
  }

  const handleUserInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserTextInput(e.target.value)
    setCount(e.target.value.length)
  }

  /*   useEffect(() => {
    if (loading) {
      let i = 0
      const typing = setInterval(() => {
        setTypedText(text.slice(0, i))
        i++
        if (i >= text.length + 1) {
          i = 0
          setTypedText('')
        }
      }, 100)
      return () => clearInterval(typing)
    }
  }, [loading]) */

  const sendEmail = (url = '') => {
    url = imgURL
    const message = `Here is your image download link: ${url}`
    window.location.href = `mailto: someone@example.com?subject=Image Download Link&body=${message}`
  }

  const emptyInputError = () => {
    setErrorMessage('You need to write a text to generate an image.')
  }

  return (
    <div className="app-main">
      <h2>Create images with your mind</h2>
      <div className="textarea-box">
        <textarea
          className="textarea-input"
          placeholder="Create any type of image you can think of with as much added description as you would like"
          onChange={(e) => handleUserInput(e)}
          value={userTextInput}
          maxLength={1000}
        />
        <p className="small-text">{count} / 1000</p>
      </div>
      {userTextInput === '' ? (
        <>
          <button className="inactive-btn" onClick={() => emptyInputError()}>
            Generate Image
          </button>
          {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        </>
      ) : (
        <button className="active-btn" onClick={() => generateImage()}>
          Generate Image
        </button>
      )}

      <button className="surprise-btn" onClick={() => generateRandomImage()}>
        Surprise me
      </button>
      <>
        {loading ? (
          <>
            {/* <h4>{typedText}</h4> */}
            <div className="ripple-effect">
              <div></div>
              <div></div>
            </div>
          </>
        ) : imgURL ? (
          <>
            <h4>{imageTitel}</h4>
            <img
              src={imgURL}
              onClick={() => window.open(imgURL)}
              style={{ cursor: 'pointer' }}
              alt="Generated Image"
            />
          </>
        ) : (
          <></>
        )}
      </>
      <p className='errorMessageRequest'>{requestErrorMessage}</p>
    </div>
  )
}
