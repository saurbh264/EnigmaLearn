const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const otpTemplate = require("../mail/templates/emailVerificationTemplate")
const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now(),
        expires: 5*60
    },

})
 async function sendVerificationmail(email,otp){
    try{
        let mailResponse = await mailSender(email ,"Verification Mail from EnigmaLearn",otpTemplate(otp))
    }
    catch(err){
        console.log("Error while sending mail :",err.message)
    }
 }

 OTPSchema.pre("save",async function (next){
    sendVerificationmail(this.email,this.otp); // Basically we used this to indicate email and otp of the current user.
    next()
 })
module.exports = mongoose.model("OTP",OTPSchema)