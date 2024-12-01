const SendFriendRequest = asyncHandler(async (req, res) => {
    const userEmail = req.user.email;
    const { reqTo } = req.body;

    if (!reqTo) {
        return res.status(400).json({
            status: "error",
            message: "Please provide the email of the user you want to send a friend request to",
        });
    }

    const sender = await User.findOne({ email: userEmail });
    const recipient = await User.findOne({ email: reqTo });

    if (!sender || !recipient) {
        return res.status(404).json({
            status: "error",
            message: "User not found",
        });
    }

    const existingRequest = recipient.friendRequests.find(
        (request) => request.from.toString() === sender._id.toString()
    );

    if (existingRequest) {
        return res.status(400).json({
            status: "error",
            message: "Friend request already sent",
        });
    }

    // Add friend request to recipient's friendRequests array
    recipient.friendRequests.push({
        from: sender._id,
        status: 'pending'
    });

    await recipient.save();

    res.status(200).json({
        status: "success",
        message: "Friend request sent successfully",
    });
});

export { 
    SendFriendRequest,


 };
