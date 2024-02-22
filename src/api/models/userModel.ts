import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['EMPLOYEE', 'MANAGER', 'ADMIN'],
      required: true,
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    job_title: { type: String, required: false },
    phone: { type: String, required: false },
    language: { type: String, enum: ['en', 'fi', 'sv'], required: true },
    profile_picture: { type: String, required: false },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
