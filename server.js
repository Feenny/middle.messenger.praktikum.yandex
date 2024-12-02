/* eslint-disable prefer-arrow-callback */
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();
const PORT = 3000;

app.use(express.static(`${dirname}/dist`));

app.get('*', (req, res) => {
    res.sendFile(path.join(dirname, '/dist/index.html'));
});

app.listen(PORT, function () {
    console.log(`Server is running on http://localhost:${PORT}`);
});
