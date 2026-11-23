import mongoose from 'mongoose';
import { Issue } from '../models/Issue.js';

export const issueRepository = {
  findAll({ status, assignee } = {}) {
    const filter = {};
    if (status) filter.status = status;
    if (assignee) {
      filter.assignee = { $regex: assignee, $options: 'i' };
    }

    return Issue.find(filter).sort({ createdAt: -1 });
  },

  findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Issue.findById(id);
  },

  create(data) {
    return Issue.create(data);
  },

  async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Issue.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },
};
