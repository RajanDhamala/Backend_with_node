import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, // Reference to the User model
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, // Reference to the User model (channel)
        ref: "User"
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt timestamps
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);