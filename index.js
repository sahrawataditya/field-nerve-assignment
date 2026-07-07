import express from 'express'

const app = express()

app.get("/health", (req, res) => {
    return res.status(200).json({ message: "Server is running !" })
})

app.listen(3030, () => {
    console.log("Server is listening on port 3030")
})
