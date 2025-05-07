const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    executionDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.date;
            },
            message: 'Execution date must be after contract date'
        }
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Добавляем предварительную валидацию перед сохранением
contractSchema.pre('save', function (next) {
    if (this.executionDate <= this.date) {
        next(new Error('Execution date must be after contract date'));
    } else {
        next();
    }
});

module.exports = mongoose.model('Contract', contractSchema); 