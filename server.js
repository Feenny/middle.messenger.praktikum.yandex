import express from 'express'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express()
const folderPath = path.join(__dirname, 'static')
app.use(express.static(folderPath));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
