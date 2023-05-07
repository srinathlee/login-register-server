import express, { response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
const app =express()

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/loginDatabase',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{console.log("db connected")})
.catch((e)=>{console.log(e)})


const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const userModel= new mongoose.model("userModel",userSchema)


app.post("/register",async(req,res)=>{
     const{name,email,password}=req.body 
            const a=await userModel.findOne({email:email})
            if(a!==null){
                res.json({"message":"Email already used"})
            }
            else{
            // const encryptPass=await bcrypt.hash(password,10)
            // console.log(encryptPass)
            const newUser= new userModel({
                name,email,password
             })
             try{
             const dd= await newUser.save()
             res.json({"message":"successfully registered",})

            }
            catch(e){
                console.log(e)
            }
        }
            
       })

       app.post("/login",async(req,res)=>{
        const{email,password}=req.body 
        console.log(req.body)
               const user=await userModel.findOne({email:email})
              if(user===null){
                res.send({"message":"user not registered"})
              }
              else{
                // const enPass=await bcrypt.compare(password,user.password)
                const passCheck=password===user.password
                if(passCheck){
                    const paylod={email:email}
                    const jwtToken=jwt.sign(paylod,"my_secreate_code")
                    res.send({"message":"login successfull","jwtToken":jwtToken}) 
                }
                else{
                    res.send({"message":"incorrect password"})
                }
              }

       })

app.listen(3005,()=>{console.log("server is running in port 3005")})