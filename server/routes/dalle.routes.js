import express from 'express'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const router = express.Router()
const config = new Configuration({
  apiKey: process.env.OPEN_AI_KEY
})

const openai = new OpenAIApi(config)

router.route('/').get((req,res)=>{
  res.status(200).json({ message: 'Hello from DALL.E Routes' })
})

router.route('/').post((async (req,res) => {
  try{
    const { promt } = req.body

    const response = await openai.createImage({
      promt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json'
    })

    const image = response.data.data[0].b64_json;

    res.status(200).json({ photo: image})

  } catch (error) {
    console.log(error)
  }
}))

export default router;