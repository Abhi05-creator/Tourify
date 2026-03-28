const mongoose=require("mongoose")
const validator=require('validator')
const bcrypt=require("bcryptjs")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        minlength:[3,"Name should have atleast 3 characters"]
    
    },
    email:{
        type:String,
        required:[true,"enter your email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"enter valid email"]
        
    },
    photo:{
        type:String

    },
    password: {
        type: String,
        required: [true, "enter your password"],
        minlength: [7, "atleast 7 characters"],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, "enter correct password"],
        validate: {
            validator: function(el) {
                // This only works on SAVE/CREATE!!!
                return el === this.password;
            },
            message: "Passwords are not the same"
        }
    },
    passwordChangedAt:Date,
    admin:{
        type:Boolean,
        default:false
    },
  
    active:{
        type:Boolean,
        default:true,
        select:false
    }
       
})

//after getting user and before entering in database
userSchema.pre('save',async function(){
    //run if password is modified
    if(!this.isModified("password")) return;
    
    this.password= await bcrypt.hash(this.password,12)
    this.confirmPassword=undefined


})









const User=mongoose.model("User",userSchema)

module.exports=User