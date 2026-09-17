import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    safePayToken:{
        type:String,
    },
    status:{
        type:String,
        enum:["pending","paid","failed"],
        default:"pending"
    },
    accountNumber:{
        type:String,
        required:true
    }

},{timestamps:true}
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);