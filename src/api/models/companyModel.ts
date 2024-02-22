import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    allowed_emails: { type: [String], required: true },
    business_identity_code: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export default mongoose.model('Company', companySchema);
