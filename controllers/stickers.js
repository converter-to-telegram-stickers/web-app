import * as fs from 'fs';

let stickers = [];

export const getAll = (req, res) => {
    const data = fs.readFileSync('./stickers.json');
    stickers = JSON.parse(data.toString());
    res.status(200).json(stickers);
};

export const create = (req, res) => {
    const newSticker = req.body;
    stickers.push(newSticker);
    fs.readFile('./stickers.json', function (err, data) {
        const json = JSON.parse(data.toString());
        json.push(newSticker);
        fs.writeFile('./stickers.json', JSON.stringify(json), err => {
            if (err) throw err;
        });
    })
    res.status(201).json(newSticker);
};