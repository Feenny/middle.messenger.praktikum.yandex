import express from 'express'
import http from 'http'
import path from 'path'

const app = express()
const PORT = 3000
const server = http.createServer(app);
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

app.use(express.static('dist'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../assets/index.html'))
})

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
