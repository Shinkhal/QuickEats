import  mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URL,{
        dbName: 'QUICKEATS',
    })
    .then (()=>{
        console.log('MongoDB connected...')
    })
}
