const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const rsvpSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    event: {
        type: Schema.Types.ObjectId, 
        ref: 'Event',
        required: true
    },
    status: {
        type: Schema.Types.ObjectId, 
        ref: ['YES', 'NO', 'MAYBE'],
        required: true
    }
},
{timestamps: true}
);

// only allow user to rsvp once
rsvpSchema.index({user: 1, event: 1}, {unieque: true});

module.exports = mongoose.model('Event', eventSchema);
