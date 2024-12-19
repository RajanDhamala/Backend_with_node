import mongoose from "mongoose";
import { Schema } from "mongoose";


const oneToOneChatSchema = new Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users',  
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
                ref: 'Users', 
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
                        ref: 'Users',  
                        required: true
                    },
                    isSeen: {
                        type: Boolean,
                        default: false
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


const Chat = mongoose.model('Chat', oneToOneChatSchema);

export default Chat;
