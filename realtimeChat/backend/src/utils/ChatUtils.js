import User from '../models/User.Model.js';

const CheckFriendship = async (owner, labour) => {
    try {
        const currentuser = await User.findOne({ username: owner })
            .select('friends')
            .populate('friends', 'username') 
            .lean(); // Convert to plain JavaScript object for performance

        if (!currentuser) return false;

        return currentuser.friends.some(friend => friend.username === labour);
    } catch (err) {
        console.error('Error checking friendship:', err);
        return false;
    }
};

export default CheckFriendship;
