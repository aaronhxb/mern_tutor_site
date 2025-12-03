const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        img_url: {
            type: String,
            required: true
        },
        video_url: {
            type: String,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        tags: {
            type: [String],
            default: []
        }
    }, 
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Video', videoSchema)