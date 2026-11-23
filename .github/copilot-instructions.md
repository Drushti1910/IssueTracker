# Workspace Instructions

- Backend follows controller -> service -> repository -> model boundaries.
- Keep issue validation in `backend/src/services/issueService.js`.
- Keep database access in `backend/src/repositories/issueRepository.js`.
- Use MongoDB through Mongoose; do not place database queries in controllers or React components.
- Frontend API calls belong in `frontend/src/App.jsx` unless the app grows and requires a separate API module.
- Preserve the existing Tailwind and Lucide UI patterns.
