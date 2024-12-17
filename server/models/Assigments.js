const mongoose = require('mongoose');  
const assignmentSchema = new mongoose.Schema({
    reportId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Report', 
        required: true 
    },
    userEmail: { 
        type: String, 
        required: true 
    },
    reportDescription: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pendiente', 'En proceso', 'Resuelta'], 
        default: 'Pendiente' 
    },
    adminEmail: { 
        type: String, 
        required: true 
    },
    adminName: {
        type: String,
        required: true,  
    },
    province: { 
        type: String, 
        required: true 
    },
    assignedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
