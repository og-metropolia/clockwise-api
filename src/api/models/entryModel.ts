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
        'sick_child',
        'holiday_leave',
        'special_leave',
        'sick_leave',
        'unpaid_leave',
        'other',
      ],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Entry', entrySchema);
