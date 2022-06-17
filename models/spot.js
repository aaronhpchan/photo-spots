const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const SpotSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
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