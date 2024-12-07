import mongoose from "mongoose";
import { Schema } from "mongoose";

const oneToOneChatSchema = new Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    messages: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                default: () => new mongoose.Types.ObjectId()
            },
            sender: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            message: {
                type: String,
                default: ""
            },
            media: {
                type: String,
                required: false
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            status: [
                {
                    participant: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                        required: true
                    },
                    state: {
                        type: String,
                        enum: ['sent', 'delivered', 'seen'],
                        default: 'sent'
                    },
                    timestamp: {
                        type: Date,
                        default: Date.now
                    }
                }
            ]
        }
    ]
});

const Chat = mongoose.model('ChatMessages', oneToOneChatSchema);

export default Chat;
