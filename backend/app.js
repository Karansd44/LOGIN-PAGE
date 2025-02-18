const express =require("express");
const app =express();
const mongoose =require("mongoose");
app.use(express.json());
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const mongoUrl = "mongodb+srv://karansd442004:admin@cluster0.pzimx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET="suhfuihidugduhguihdfghuhfdudhgh4376573467&&*^&^%#%^*()(_fjkgnjkgnjkbdjg";
mongoose
.connect(mongoUrl)
.then(()=>{
    console.log("Database Connected");
})
.catch((e) =>{
console.log(e);
});

require("./UserDetails")
const User =mongoose.model("UserInfo");
app.get("/",(req,res)=>{
    res.send({status:"Started"})
});
app.post("/register",async(req,res) =>{
    const{name,email,mobile,password} =req.body;


    const oldUser=await User.findOne({email:email});
    if(oldUser){
        return res.send({data:"User already exists!! "});
    }
    const encryptedPassword =await bcrypt.hash(password,10);


    try{
        await User.create({
            name:name,
            email:email,
            mobile,
            password :encryptedPassword,
        });
        res.send({status:"ok",data:"User Created"});
    } catch(error){
        res.send({status:"error",data:error});
    }
});

app.post("/login-user",async(req,res) =>{
    const {email,password} =req.body;
    const oldUser=await User.findOne({email:email });

    if(!oldUser){
        return res.send({data:"User doesnt exists"});
    }

    if(await bcrypt.compare(password,oldUser.password)){
        const token=jwt.sign({email:oldUser.email},JWT_SECRET);

        if(res.status(201))
        {
            return res.send({status:"ok",data:token})

        }else {
            return res.send({error:"error"});
        }
    }
})


app.post("/userdata",async(req,res)=>{
    const {token}=req.body;
    try{
        const user = jwt.verify(token,JWT_SECRET)
        const useremail=user.email;

        User.fingOne({email:useremail}).then(data=>{
            return res.send({status:"ok", data:data});
        });
    }catch (error){
        return res.send({error:error});
    }
})

app.listen(5001,()=>{
    console.log("Node js server started")
});

