const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
//add a virtual property called thumbnail
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const SpotSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, { toJSON: { virtuals: true } }); //by default, Mongoose does not include virtuals when converting a document to JSON

//add a virtual property for GeoJSON
SpotSchema.virtual('properties.popUpText').get(function () {
    return `<a href="/spots/${this._id}" class="font-semibold text-blue-600 hover:text-blue-800 hover:underline" target="_blank">${this.title}</a>`;
});

//the findOneAndDelete middleware is triggered by the findByIdAndDelete function
SpotSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
});

module.exports = mongoose.model('Spot', SpotSchema);