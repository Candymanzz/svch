const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
        required: true
    },
    furnitureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Furniture',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    image: {
        type: String,
        default: '' // URL или путь к изображению
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sale', saleSchema); 