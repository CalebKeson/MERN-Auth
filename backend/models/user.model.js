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
        default: "",
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