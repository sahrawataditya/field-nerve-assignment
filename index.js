import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import router from './src/routes'
import { swaggerSpec } from './src/swagger'
import morgan from 'morgan'
import prisma from './src/lib/prisma'

const app = express()
//Using express express json to use json from request body
app.use(express.json())
//Enabling cors for Cross origins 
app.use(cors({
    origin: "*",
}))
//Logging
app.use(morgan(process.env?.NODE_ENV.trim().toLowerCase() !== "development" ? "tiny" : "dev"))
//Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Field Nerve API Docs',
}))
//Enabling router in the app middleware
app.use("/api", router)

app.get("/health", (req, res) => {
    return res.status(200).json({
        message: "Server is running !",
        success: true
    })
})

//Application listening
app.listen(3030, async () => {
    console.log("Server is listening on port 3030")
    await prisma.$connect().then(() => {
        console.log(`Db is connected 🚀`)
    }).catch((err) => {
        console.error(err)
    })
})
