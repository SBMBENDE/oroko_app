import { Router } from 'express';
import {
  getStats,
  getAuditLog,
  getAdminMembers,
  getAdminMemberById,
  createMember,
  updateAdminMember,
  approveMember,
  rejectMember,
  suspendMember,
  reinstateMember,
  deactivateMember,
  assignRole,
  assignChapter,
  assignExecutive,
} from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth';
import { requireAdmin, requireChapterAdmin } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import {
  adminMemberQuerySchema,
  createMemberSchema,
  updateAdminMemberSchema,
  rejectSchema,
  suspendSchema,
  assignRoleSchema,
  assignChapterSchema,
  assignExecutiveSchema,
  auditLogQuerySchema,
} from '../schemas/admin.schema';

const router = Router();

// All admin routes require authentication
router.use(authenticate);

// ── Dashboard stats & audit log (ADMIN+) ──────────────────────────────────────
router.get('/stats',     requireAdmin, getStats);
router.get('/audit-log', requireAdmin, validate(auditLogQuerySchema), getAuditLog);

// ── Member management ─────────────────────────────────────────────────────────
// CHAPTER_ADMIN can list/view members (scoped in controller)
router.get('/',    requireChapterAdmin, validate(adminMemberQuerySchema), getAdminMembers);
router.get('/:id', requireChapterAdmin, getAdminMemberById);

// ADMIN+ only actions
router.post('/',             requireAdmin, validate(createMemberSchema),        createMember);
router.patch('/:id/profile', requireAdmin, validate(updateAdminMemberSchema),  updateAdminMember);
router.patch('/:id/approve', requireAdmin, approveMember);
router.patch('/:id/reject',  requireAdmin, validate(rejectSchema),              rejectMember);
router.patch('/:id/suspend', requireAdmin, validate(suspendSchema),             suspendMember);
router.patch('/:id/reinstate',  requireAdmin, reinstateMember);
router.patch('/:id/deactivate', requireAdmin, deactivateMember);
router.patch('/:id/role',       requireAdmin, validate(assignRoleSchema),       assignRole);
router.patch('/:id/chapter',    requireAdmin, validate(assignChapterSchema),    assignChapter);
router.patch('/:id/executive',  requireAdmin, validate(assignExecutiveSchema),  assignExecutive);

export default router;
