import mongoose from "mongoose";
import userModel from "../../DB/models/user.model.js";
import jwt from 'jsonwebtoken'
import * as dbService from "../../DB/db.service.js";
import { Decrypt, Encrypt } from "../../common/middleware/security/encrypted.js";
import bcrypt, { compareSync, hashSync } from "bcrypt"
import { Compare, Hash } from "../../common/middleware/security/hash.js";


export const signup=async(req,res,next)=>{
        const {fName,lName,email,password,age,gender,phone,profileImage}=req.body
    if(await userModel.findOne({email:email})){
        // next(new Error("email already exist"))
        throw new Error("Email already exist",{cause:400})
    }
    const user=await dbService.create({
        model:userModel,
        data:{fName,lName,email,password:await Hash(password),age,gender,phone:Encrypt(phone)}
    })

    return res.status(201).json({
        message:"user created Successfully",user
    })

}
export const signin=async(req,res,next)=>{
        const {email,password}=req.body;
        const user=await dbService.findOne({
            model:userModel,
            filter:{email:email,provider:"system"}
        });
        if(!user){
        throw new Error("Email already exist",{cause:400})

            // return res.status(404).json({message:"email not exsist"})
        }
        if(!await Compare(password,user.password)){
        throw new Error("inValid password",{cause:400})

            return res.status(400).json({message:"inValid password"})

        }
        return res.status(200).json({message:"Done",user:{...user._doc,phone:Decrypt(user.phone)}})
        
}