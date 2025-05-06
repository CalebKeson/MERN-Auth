import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    profilePicture: {
        type: String,
        default: "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: { 
        type: String,
        select: false,
    },
    verificationCodeValidation: { 
        type: Number,
        select: false,
    },
    forgotPasswordCode: {
        type: String,
        select: false,
    },
    forgotPasswordCodeValidation: { 
        type: Number,
        select: false,
    }    
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;