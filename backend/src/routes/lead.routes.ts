import { Router } from 'express';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
  getLeadStats,
} from '../controllers/lead.controller';
import { verifyToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { createLeadValidator, updateLeadValidator } from '../validators/lead.validator';

const router = Router();

// All lead routes are protected
router.use(verifyToken);

// GET /api/leads/stats (Admin only)
router.get('/stats', requireRole('admin'), getLeadStats);

// GET /api/leads/export (Admin only)
router.get('/export', requireRole('admin'), exportLeads);

// GET /api/leads & POST /api/leads
router.route('/')
  .get(getLeads)
  .post(createLeadValidator, createLead);

// GET /api/leads/:id, PUT /api/leads/:id, DELETE /api/leads/:id
router.route('/:id')
  .get(getLeadById)
  .put(updateLeadValidator, updateLead)
  .delete(requireRole('admin'), deleteLead);

export default router;
