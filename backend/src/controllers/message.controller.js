import User from "../models/user.model.js";


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.userId;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json({
            message: "Users fetched successfully",
            users: filteredUsers
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.userId;

const messages = await Message.find({
    $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
    ]
});

res.status(200).json({
    message: "Messages fetched successfully",
    messages
});

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch messages",
            error: error.message
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
       const {text, image} = req.body;
       const {id:userToChatId} = req.params;
       const myId = req.userId;

       let imageUrl;
       if (image) {
           const uploadResponse = await cloudinary.v2.uploader.upload(image, {
               folder: "message_images"
           });
           imageUrl = uploadResponse.secure_url;
       }

       const newMessage = new Message({
           senderId: myId,
           receiverId: userToChatId,
           text,
           image: imageUrl
       });

       await newMessage.save();

       res.status(200).json({
           message: "Message sent successfully",
           message: newMessage
       });

       // todo: realtime functionality goes here => socket.io

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch messages",
            error: error.message
        });
    }
};