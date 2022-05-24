import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const {Schema,model} = mongoose

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true,
    versionKey:false
})


userSchema.methods.encryptPassword = async (password)=>{
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password,salt)
}
userSchema.methods.validatePassword = function(password){
    return bcrypt.compare(password,this.password)
}


export default model("User",userSchema)