
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';
import transporter from '../config/nodemailer.js';
import userModel from '../model/userModel.js';


export const register =async(req,res)=>{
    const {name,email,password}=req.body;
    
    if(!name || !email || !password)
    {
        return res.json({success:false,message:"Details Are Missing"});
    }

    try{

        //check if user exist or not
        const existingUser=await userModel.findOne({email})

        if(existingUser)
        {
            return res.json({success:false,message:"User already exists"})
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=new userModel({name,email,password:hashedPassword}); //name,email req.body mathi and password hashed passwordvalo joi mate e nakho che 
        await user.save();

        //token for jwt

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});


        //add token to cookie
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production' ? 'none':'strict',
            maxAge:7 * 24 * 60 * 60 * 1000
        });

        //send welcome email
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:'Welcome Email',
            text:`Welcome to our website.Your account has been created with email id: ${email}`
        }  
        await transporter.sendMail(mailOptions);
        
        // return res.json({success:true});
        return res.json({
  success: true,
  user: {
    name: user.name,
    email: user.email
  }
});

        

        
    }
    catch(error)
    {
        console.log(error);
        return res.json({success:false,message:error.message})
    }

}



export const login=async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password)
    {
        return res.json({success:false,message:'Email and password are required'})
    }

    try{
        const user=await userModel.findOne({email});

        if(!user)
        {
            return res.json({success:false,message:'Invalid email'})
        }

        // check if password is matching or not
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch)
        {
            return res.json({success:false,message:'Invalid password'})

        }

        //match thay to  token thi authenticate kro

        console.log("before")
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        console.log("hello")


        //add token to cookie
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production' ? 'none':'strict',
            // secure: true,             // 🔥 Always true for HTTPS (Vercel/Render)
            // sameSite: 'none',
            maxAge:7 * 24 * 60 * 60 * 1000,
            path: '/'
          
        });
        
        return res.json({success:true});

    }
    catch(error)
    {
        console.log("hello")
        return res.json({success:false,message:error.message})
    }
}



export const logout=async(req,res)=>{
    try{
           res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production' ? 'none':'strict',
            path: '/'
        });
        console.log("Cookies received in logout:", req.cookies);

        return res.json({success:true,message:"Logged Out"});
        
    }
     catch(error)
    {
        return res.json({success:false,message:error.message})
    }
}

//send verification otp to user's email
export const sendVerifyOtp=async(req,res)=>{
    try{

        const {userId}=req.body;
        // console.log(userId)

        const user=await userModel.findById(userId);

        if(user.isAccountVerified)
        {
            return res.json({success:false,message:"Account Already Verified"})
        }

        //generate otp of 6 digits
        const otp=String(Math.floor(100000 + Math.random()*900000));

        user.verifyOtp=otp; //database ma store
        user.verifyOtpExpireAt=Date.now()+24 * 60 * 1000 //1 divas halse otp

        await user.save();


        const mailOption={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Account Verification OTP',
            // text:`Your OTP for verfication is ${otp}.Please verify your account using this OTP`,
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        } 
        // send kro otp valo email
        await transporter.sendMail(mailOption)

        res.json({success:true,message:"OTP for verification sent on the Email"})

    }
    catch(error)
    {
        return res.json({success:false,message:error.message})
    }
}


export const verifyEmail=async(req,res)=>{
    const {userId,otp}=req.body; //userId token mathi malse middlware banavo

    if(!userId || !otp)
    {
        return res.json({success:false,message:'Missing Details'});
    }

    try{
        const user=await userModel.findById(userId);

        if(!user)
        {
        return res.json({success:false,message:'User not found'});
        }

// console.log("OTP in DB:", user.verifyOtp);
// console.log("OTP from frontend:", otp);
// console.log("OTP comparison result:", user.verifyOtp === otp);

        if(user.verifyOtp==='' || user.verifyOtp!==otp) //agal sendVerifyotp ma email moklo tare otp set kro tho eni hare compare krse db ma
        {
            return res.json({success:false,message:'Invalid OTP'});
        }

        if(user.verifyOtpExpireAt < Date.now()) //expire thy gyo hse 
        {
            return res.json({success:false,message:'OTP Expired'});
        }

        //have account verified ne db ma true kro kemke jo upar ni eky if nay hale to user valid j hasene
        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;

        await user.save();
        return res.json({success:true,message:'Email verification succesfull'})

    }
    catch(error)
    {
        return res.json({success:false,message:error.message})
    }
}

//check user is authenticated  or not
export const isAuthenticated =async(req,res)=>{
    try{
        return res.json({success:true});
    }
     catch(error)
    {
        return res.json({success:false,message:error.message})
    }
}

//send password reset otp

export const sendResetOtp=async(req,res)=>{
    const {email}=req.body;

    if(!email)
    {
        return res.json({success:false,message:'Email is required'});
    }

    try{
        const user=await userModel.findOne({email});
        if(!user)
        {
            return res.json({success:false,message:'User not found'})
        }

        const otp=String(Math.floor(100000 + Math.random()*900000));

        user.resetOtp=otp; //database ma store
        user.resetOtpExpireAt=Date.now()+15 * 60 * 1000 //15 min

        await user.save();


        const mailOption={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Password Reset OTP',
            // text:`Your OTP for reseting your password is is ${otp}.Use this OTP to proceed with resetting your password`
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        // send kro otp valo email
        await transporter.sendMail(mailOption)
        return res.json({success:true,message:'OTP sent to your email'})
    }
    catch(error)
    {
        return res.json({success:false,message:error.message})
    }
}

//Reset User Password 

export const resetPassword=async(req,res)=>{
    
    const {email,otp,newPassword}=req.body;

    if(!email || !otp || !newPassword)
    {
        return res.json({success:false,message:'Email,OTP,and new password are required'})
    }

    try{
        const user=await userModel.findOne({email});
        if(!user)
        {
            return res.json({success:false,message:'User not available'})
        }
        if(user.resetOtp==="" || user.resetOtp!==otp)
        {
            return res.json({success:false,message:'Invalid OTP'})    
        }

        if(user.resetOtpExpireAt<Date.now())
        {
            return res.json({success:false,message:'OTP Expired'})
        }

        const hashedPassword=await bcrypt.hash(newPassword,10)

        user.password=hashedPassword;
        user.resetOtp='';
        user.resetOtpExpireAt=0;

        await user.save();
        return res.json({success:true,message:'Password Reset Successfully'})
        
    }
     catch(error)
    {
        return res.json({success:false,message:error.message})
    }
}