import * as fs from 'fs';

const stickersJSON = fs.readFileSync('./stickers.json', 'utf-8');
const stickers = JSON.parse(stickersJSON);

export const getAll = (req, res) => {
    res.status(200).json(stickers);
};

export const create = (req, res) => {
    const newSticker = {
        id: Date.now(),
        ...req.body
    };
    stickers.push(newSticker);
    res.status(201).json(newSticker);
};