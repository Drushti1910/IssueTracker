import { issueRepository } from '../repositories/issueRepository.js';

const statuses = ['Open', 'In Progress', 'Closed'];

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const issueService = {
  getIssues(filters) {
    return issueRepository.findAll(filters);
  },

  async getIssue(id) {
    const issue = await issueRepository.findById(id);
    if (!issue) throw Object.assign(new Error('Issue not found'), { status: 404 });
    return issue;
  },

  async createIssue(payload) {
    const title = payload.title?.trim();
    const description = payload.description?.trim();
    const assignee = payload.assignee?.trim();

    if (!title) throw Object.assign(new Error('Title is required'), { status: 400 });
    if (!description) throw Object.assign(new Error('Description is required'), { status: 400 });
    if (!assignee || !validateEmail(assignee)) {
      throw Object.assign(new Error('A valid assignee email is required'), { status: 400 });
    }

    const status = payload.status || 'Open';
    if (!statuses.includes(status)) throw Object.assign(new Error('Invalid status'), { status: 400 });

    return issueRepository.create({ title, description, assignee, status });
  },

  async updateIssue(id, payload) {
    const issue = await issueRepository.findById(id);
    if (!issue) throw Object.assign(new Error('Issue not found'), { status: 404 });

    const updates = {};
    if (payload.description !== undefined) {
      const description = payload.description.trim();
      if (!description) throw Object.assign(new Error('Description cannot be empty'), { status: 400 });
      updates.description = description;
    }
    if (payload.status !== undefined) {
      if (!statuses.includes(payload.status)) throw Object.assign(new Error('Invalid status'), { status: 400 });
      updates.status = payload.status;
    }
    if (payload.assignee !== undefined) {
      const assignee = payload.assignee.trim();
      if (!validateEmail(assignee)) throw Object.assign(new Error('A valid assignee email is required'), { status: 400 });
      updates.assignee = assignee;
    }

    return issueRepository.update(id, updates);
  },
};
