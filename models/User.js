const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: 'You need to provide a username!',
        trim: true
    },
    email: {    
        type: String,
        required: 'You need to provide an email address!',
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [this]
},
{
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
});

UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

