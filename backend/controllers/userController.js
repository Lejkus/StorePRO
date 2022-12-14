import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from '../models/usersModel.js'


// @desc  Auth user & get token
// @route Post /api/users/login
// @acces Public
const authUser = asyncHandler(async(req,res)=>{
    const {email, password}= req.body
    
    const user = await User.findOne({email: email})

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error('Wrong Password :)')
    }
})


// @desc  redister a new user
// @route Post /api/users/login
// @acces Public
const registerUser = asyncHandler(async(req,res)=>{
    const {name, email, password}= req.body
    
    const userExists = await User.findOne({email: email})

    if(userExists){
        res.status(400)
        throw new Error('user already exist')
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})



// @desc  user profile
// @route GET /api/users/profile
// @acces Private
const getUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id)

    if(user){
        res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    })
    }else{
        res.status(404)
        throw new Error('user not found') 
    }
    
})

export {authUser,registerUser,getUserProfile}