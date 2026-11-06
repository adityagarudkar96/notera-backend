const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


async function registerUser(req,res){
    const {username, email, password} = req.body;

    const userAlreadyExists = await userModel.findOne({
            $or: [
                {email: email},
               { username: username}
            ]
    })
    
    if(userAlreadyExists){
        return res.status(409).json({
            message: "User already exists"
        })
    }

    const hash = await bcrypt.hash(password, 5);
    
    try{
        const user = await userModel.create({
            username, 
            email, 
            password: hash
        })
        
        const token = await jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET)
        
        res.cookie("token", token);

        res.status(201).json({
            message: "User created successfully",
            user: {
                username: user.username,
                email: user.email
            }
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "User not created"
        })
    }
}


async function loginUser(req, res){
        const {username, email, password} = req.body;
    
        const user = await userModel.findOne({
            $or: [
                {email: email},
                {username: username}
            ]
        })
    
        if(!user){
            return res.status(404).json({
                message: "User not exists!"
            })
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Password is incorrect!"
            })
        }
        
        const token = await jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET)
        
        res.cookie("token", token);
    
        res.status(200).json({
            message: "Login successful"
        });
}
    
async function logoutUser(req, res) {
    try {
        res.clearCookie("token");

        return res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Logout failed"
        });
    }
}

async function getCurrentUser(req, res) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userModel
            .findById(decoded.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User authenticated",
            user
        });

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = {registerUser, loginUser, logoutUser, getCurrentUser}
