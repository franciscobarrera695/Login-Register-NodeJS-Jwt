import express from "express"
import morgan from "morgan"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"

const app = express()

app.use(morgan('dev'))
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(authRoutes)

export default app

