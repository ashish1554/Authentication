import userModel from "../model/userModel.js";

export const getUserData=async (req,res)=>{
    try{
        const {userId}=req.body;
        // console.log(userId)
        const user=await userModel.findById(userId);

        if(!user)
        {
            return res.json({success:false,message:"User not found"})
        }

        res.json({success:true,userData:{
            name:user.name,
            isAccountVerified:user.isAccountVerified
        }})
    }
    catch(error)
    {
        console.log("first")
        res.json({success:false,message:error.message})
    }
}