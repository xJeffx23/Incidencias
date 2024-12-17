const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    category: { type: String, required: true },
    description: { type: String, required: true },
    province: { type: String, required: true },
    canton: { type: String, required: true },
    reportType: { type: String, required: true },
    images: [{ type: String }],
    status: { 
        type: String, 
        enum: ['Pendiente', 'En proceso', 'Resuelta'], 
        default: 'Pendiente' 
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
    createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
