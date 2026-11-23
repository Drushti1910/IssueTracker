import { issueService } from '../services/issueService.js';

export const issueController = {
  async getAll(req, res, next) {
    try {
      const issues = await issueService.getIssues({
        status: req.query.status,
        assignee: req.query.assignee,
      });
      res.json({ issues });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const issue = await issueService.getIssue(req.params.id);
      res.json({ issue });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const issue = await issueService.createIssue(req.body);
      res.status(201).json({ issue });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const issue = await issueService.updateIssue(req.params.id, req.body);
      res.json({ issue });
    } catch (error) {
      next(error);
    }
  },
};
