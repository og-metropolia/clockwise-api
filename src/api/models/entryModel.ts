import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    start_timestamp: { type: Date, required: true },
    end_timestamp: { type: Date, required: true },
    type: {
      type: String,
      enum: [
        'working',
        'official duties',
        'sick child',
        'family member sick',
        'holiday leave',
        'special leave',
        'sick leave',
      ],
      required: true,
    },
    description: { type: String, required: false },
  },
  { timestamps: true },
);

export default mongoose.model('Entry', entrySchema);
