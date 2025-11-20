import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ 
                success: true, 
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    joinDate: user._id.getTimestamp()
                }
            })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ 
            success: true, 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                joinDate: user._id.getTimestamp()
            }
        })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route for get user profile
const getUserProfile = async (req, res) => {
    try {
        console.log('getUserProfile called with userId:', req.body.userId);
        const { userId } = req.body;
        
        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }
        
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            joinDate: user._id.getTimestamp()
        };
        
        console.log('Returning user data:', userResponse);
        
        res.json({ 
            success: true, 
            user: userResponse
        });
        
    } catch (error) {
        console.log('getUserProfile error:', error);
        res.json({ success: false, message: error.message });
    }
}

// Route for update user profile
const updateUserProfile = async (req, res) => {
    try {
        console.log('updateUserProfile called with data:', req.body);
        const { userId, name, currentPassword, newPassword } = req.body;
        
        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }
        
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        // Update name if provided
        if (name && name.trim() !== '') {
            user.name = name.trim();
            console.log('Updating user name to:', name.trim());
        }
        
        // Update password if provided
        if (newPassword) {
            if (!currentPassword) {
                return res.json({ success: false, message: "Current password is required" });
            }
            
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.json({ success: false, message: "Current password is incorrect" });
            }
            
            if (newPassword.length < 8) {
                return res.json({ success: false, message: "New password must be at least 8 characters" });
            }
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
            console.log('Password updated successfully');
        }
        
        await user.save();
        console.log('User updated successfully');
        
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            joinDate: user._id.getTimestamp()
        };
        
        res.json({ 
            success: true, 
            message: "Profile updated successfully",
            user: userResponse
        });
        
    } catch (error) {
        console.log('updateUserProfile error:', error);
        res.json({ success: false, message: error.message });
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile }