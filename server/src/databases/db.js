import mongoose from 'mongoose'


export const connectDB = async (req,res)=>{
    try {

        await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });

        console.log("✅ MongoDB Connected...");
        
    } catch (error) {
        console.error("❌ MongoDB connection failed", err);
        process.exit(1);
    }
}