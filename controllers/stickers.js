const stickers = [
    {"id": 1, "data": "1"},
    {"id": 2, "data": "2"},
    {"id": 3, "data": "3"},
    {"id": 4, "data": "4"},
    {"id": 5, "data": "5"}
];

export const getAll = (req, res) => {
    res.status(200).json(stickers);
};

export const create = (req, res) => {
    const newSticker = req.body;
    stickers.push(newSticker);
    res.status(201).json(newSticker);
};