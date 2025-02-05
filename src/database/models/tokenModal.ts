import mongoose, { Schema } from "mongoose";

const TokenSchema = new Schema({
  email: { type: String ,require:true},  
  password: { type: String },  
  fullname: { type: String  },  
  workSpaces: { 
    type: [{
      workspaceId: String,
      workspaceName: String
    }], 
    default: [] 
  },
  paymentDetail: {
    paymentType: { type: String, default: 'Non' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  token: { type: String  },
  expiresAt: { type: Date  },
});
export const TokenModal = mongoose.model("Token", TokenSchema);
