import jwt from 'jsonwebtoken';

const userAuth=async(req,res,next)=>{
    const {token}=req.cookies; //cookie mathi token lehe

    if(!token)
    {
        return res.json({success:false,message:'Not Authorized Login Again'});
    }

    try
    {
        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET)

        if(tokenDecode.id)
        {
            if(!req.body)
            {
                req.body={};
            }
            req.body.userId=tokenDecode.id
        }else
        {
            return res.json({success:false,message:'Not Authorized Login Again'});
        }

        next(); //controller ne call krse
    }
    catch(error)
    {
        return res.json({success:false,message:error.message});

    }
}

export default userAuth;