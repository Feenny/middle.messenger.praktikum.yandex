import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Указываем путь к папке, где находится статический контент (включая index.html)
app.use(express.static('src'));

app.get("/", (req, res) => {
  // Отправляем файл index.html из папки src
  res.sendFile(path.join(__dirname, "../src/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
