import express from 'express'
import path from 'path'

const DIRNAME = path.resolve();
const PORT = process.env.PORT ?? 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(DIRNAME));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/gallery', (req, res) => {
    res.render('gallery');
});

app.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}/ ...`)
});