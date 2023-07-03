const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    createdBy: String,
});

const Item = mongoose.model('items', itemSchema);

module.exports = Item;