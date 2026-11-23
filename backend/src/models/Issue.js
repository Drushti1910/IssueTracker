import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 160,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
    required: true,
  },
  assignee: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (document, returned) => {
      returned.id = returned._id.toString();
      delete returned._id;
      delete returned.__v;
      return returned;
    },
  },
});

issueSchema.index({ status: 1 });
issueSchema.index({ assignee: 1 });

export const Issue = mongoose.model('Issue', issueSchema);
