import mongoose from "mongoose";

const userVideoPhotoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true
  },
  media: [
    {
      url: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ["video", "photo"], 
        required: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true  
});

export default mongoose.model("UserVideoPhoto", userVideoPhotoSchema);
