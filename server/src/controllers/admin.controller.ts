import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Chapter } from '../models/Chapter';
import { AuditLog } from '../models/AuditLog';
import { Notification } from '../models/Notification';
import { Role, MemberStatus, AuditAction, NotificationType } from '../types/enums';
import { AppError } from '../middleware/errorHandler';
import { hashPassword } from '../services/auth.service';
import { generateMemberNumber } from '../utils/generateMemberNumber';
import { buildMemberFilter } from '../services/search.service';
import { getPagination, buildPaginationMeta } from '../utils/paginate';
import { logAudit, userSnapshot } from '../services/admin.service';
import {
  sendApprovalEmail,
  sendRejectionEmail,
  sendSuspensionEmail,
} from '../services/email.service';

const getIp = (req: Request) =>
  (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.ip ?? 'unknown';

// ── GET /admin/stats ──────────────────────────────────────────────────────────
export const getStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [byStatus, byRole, newThisMonth] = await Promise.all([
      User.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      User.countDocuments({
        createdAt: { $gte: new Date(new Date().setDate(1)) },
      }),
    ]);

    res.json({
      success: true,
      data: {
        byStatus:    Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
        byRole:      Object.fromEntries(byRole.map((r) => [r._id, r.count])),
        newThisMonth,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /admin/audit-log ──────────────────────────────────────────────────────
export const getAuditLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { action, targetUser, page, limit } = req.query as Record<string, string | undefined>;
    const filter: Record<string, unknown> = {};
    if (action) filter.action = action;
    if (targetUser) filter.targetUser = targetUser;

    const { skip, limit: lim, page: pg } = getPagination({ page, limit });
    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('admin', 'firstName lastName email role')
        .populate('targetUser', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lim),
      AuditLog.countDocuments(filter),
    ]);

    res.json({ success: true, data: logs, pagination: buildPaginationMeta(total, pg, lim) });
  } catch (err) {
    next(err);
  }
};

// ── GET /admin/members ────────────────────────────────────────────────────────
export const getAdminMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, status, role, chapter, country, page, limit } =
      req.query as Record<string, string | undefined>;

    // For CHAPTER_ADMIN, scope to their chapter only
    const isChapterAdmin = req.user!.role === Role.CHAPTER_ADMIN;
    const effectiveChapter = isChapterAdmin
      ? String(req.user!.chapter ?? '')
      : chapter;

    const filter = await buildMemberFilter(
      { search, status: status as MemberStatus, role: role as Role,
        chapter: effectiveChapter, country },
      false // Show all statuses
    );

    const { skip, limit: lim, page: pg } = getPagination({ page, limit });
    const [members, total] = await Promise.all([
      User.find(filter)
        .populate('chapter', 'name slug country')
        .populate('approvedBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lim),
      User.countDocuments(filter),
    ]);

    res.json({ success: true, data: members, pagination: buildPaginationMeta(total, pg, lim) });
  } catch (err) {
    next(err);
  }
};

// ── GET /admin/members/:id ────────────────────────────────────────────────────
export const getAdminMemberById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
      .populate('chapter', 'name slug country')
      .populate('approvedBy', 'firstName lastName email')
      .populate('suspendedBy', 'firstName lastName email');

    if (!user) throw new AppError('Member not found', 404);

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ── POST /admin/members — Manual creation ─────────────────────────────────────
export const createMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName, email, password, country, chapter, role, profession } =
      req.body;

    const existing = await User.findOne({ email });
    if (existing) throw new AppError('Email already in use', 409);

    const passwordHash = await hashPassword(password);
    const memberNumber = await generateMemberNumber();

    const user = await User.create({
      firstName, lastName, email, passwordHash, country,
      chapter: chapter || undefined,
      role: role ?? Role.MEMBER,
      status: MemberStatus.ACTIVE,
      profession: profession || undefined,
      emailVerified: true,
      memberNumber,
      joinedAt: new Date(),
      approvedAt: new Date(),
      approvedBy: req.user!._id,
    });

    await logAudit(
      String(req.user!._id), AuditAction.CREATE_MEMBER, String(user._id),
      getIp(req), undefined, userSnapshot(user.toObject())
    );

    res.status(201).json({ success: true, message: 'Member created', data: user });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /admin/members/:id/profile ─────────────────────────────────────────
export const updateAdminMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const before = await User.findById(req.params.id);
    if (!before) throw new AppError('Member not found', 404);

    const ALLOWED = ['firstName','lastName','country','bio','profession','company',
                     'occupation','languages','skills','interests'];
    const updates: Record<string, unknown> = {};
    for (const f of ALLOWED) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }

    const after = await User.findByIdAndUpdate(
      req.params.id, { $set: updates }, { new: true, runValidators: true }
    );

    await logAudit(
      String(req.user!._id), AuditAction.UPDATE_MEMBER, req.params.id,
      getIp(req), userSnapshot(before.toObject()), userSnapshot(after!.toObject())
    );

    res.json({ success: true, message: 'Member updated', data: after });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /admin/members/:id/approve ─────────────────────────────────────────
export const approveMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('Member not found', 404);

    if (user.status === MemberStatus.ACTIVE) {
      throw new AppError('Member is already active', 400);
    }

    const memberNumber = user.memberNumber ?? (await generateMemberNumber());

    await User.findByIdAndUpdate(user._id, {
      status: MemberStatus.ACTIVE,
      role: user.role === Role.PENDING_MEMBER ? Role.MEMBER : user.role,
      memberNumber,
      approvedAt: new Date(),
      approvedBy: req.user!._id,
    });

    // Create in-app notification
    await Notification.create({
      user: user._id,
      type: NotificationType.APPROVAL,
      title: 'Membership Approved',
      body: 'Your OCA-EU membership has been approved. Welcome to the community!',
    });

    sendApprovalEmail(user.email, user.firstName).catch(console.error);

    await logAudit(
      String(req.user!._id), AuditAction.APPROVE, String(user._id),
      getIp(req), { status: user.status }, { status: MemberStatus.ACTIVE, memberNumber }
    );

    res.json({ success: true, message: `${user.firstName} ${user.lastName} approved` });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /admin/members/:id/reject ──────────────────────────────────────────
export const rejectMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('Member not found', 404);

    await User.findByIdAndUpdate(user._id, { status: MemberStatus.REJECTED });

    await Notification.create({
      user: user._id,
      type: NotificationType.REJECTION,
      title: 'Membership Application Update',
      body: reason ?? 'Your membership application was not approved at this time.',
    });

    sendRejectionEmail(user.email, user.firstName, reason).catch(console.error);

    await logAudit(
      String(req.user!._id), AuditAction.REJECT, String(user._id),
      getIp(req), { status: user.status }, { status: MemberStatus.REJECTED, reason }
    );

    res.json({ success: true, message: `${user.firstName} ${user.lastName} rejected` });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /admin/members/:id/suspend ─────────────────────────────────────────
export const suspendMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('Member not found', 404);

    if (user.role === Role.SUPER_ADMIN) {
      throw new AppError('Cannot suspend a SUPER_ADMIN', 403);
    }

    await User.findByIdAndUpdate(user._id, {
      status: MemberStatus.SUSPENDED,
      suspendedAt: new Date(),
      suspendedBy: req.user!._id,
      suspendReason: reason,
      $unset: { refreshTokenHash: 1 }, // Force logout
    });

    await Notification.create({
      user: user._id,
      type: NotificationType.SUSPENSION,
      title: 'Account Suspended',
      body: reason ?? 'Your account has been suspended. Please contact support.',
    });

    sendSuspensionEmail(user.email, user.firstName, reason).catch(console.error);

    await logAudit(
      String(req.user!._id), AuditAction.SUSPEND, String(user._id),
      getIp(req), { status: user.status }, { status: MemberStatus.SUSPENDED, reason }
    );

    res.json({ success: true, message: `${user.firstName} ${user.lastName} suspended` });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /admin/members/:id/reinstate ───────────────────────────────────────
export const reinstateMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('Member not found', 404);

    await User.findByIdAndUpdate(user._id, {
      status: MemberStatus.ACTIVE,
      $unset: { suspendedAt: 1, suspendedBy: 1, suspendReason: 1 },
    });

    await Notification.create({
      user: user._id,
      type: NotificationType.SYSTEM,
      title: 'Account Reinstated',
      body: 'Your account has been reinstated. You can now log in.',
    });

    await logAudit(
      String(req.user!._id), AuditAction.REINSTATE, String(user._id),
      getIp(req), { status: user.status }, { status: MemberStatus.ACTIVE }
    );

    res.json({ success: true, message: `${user.firstName} ${user.lastName} reinstated` });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /admin/members/:id/deactivate ──────────────────────────────────────
export const deactivateMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('Member not found', 404);

    await User.findByIdAndUpdate(user._id, {
      status: MemberStatus.INACTIVE,
      $unset: { refreshTokenHash: 1 },
    });

    await logAudit(
      String(req.user!._id), AuditAction.UPDATE_MEMBER, String(user._id),
      getIp(req), { status: user.status }, { status: MemberStatus.INACTIVE }
    );

    res.json({ success: true, message: `${user.firstName} ${user.lastName} deactivated` });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /admin/members/:id/role ─────────────────────────────────────────────
export const assignRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role } = req.body as { role: Role };
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('Member not found', 404);

    // Only SUPER_ADMIN can assign ADMIN or SUPER_ADMIN roles
    const elevatedRoles: Role[] = [Role.ADMIN, Role.SUPER_ADMIN];
    if (elevatedRoles.includes(role) && req.user!.role !== Role.SUPER_ADMIN) {
      throw new AppError('Only SUPER_ADMIN can assign this role', 403);
    }

    // Cannot downgrade yourself
    if (String(user._id) === String(req.user!._id)) {
      throw new AppError('Cannot change your own role', 403);
    }

    await User.findByIdAndUpdate(user._id, { role });

    await Notification.create({
      user: user._id,
      type: NotificationType.ROLE_CHANGE,
      title: 'Role Updated',
      body: `Your role has been updated to ${role}.`,
    });

    await logAudit(
      String(req.user!._id), AuditAction.ASSIGN_ROLE, String(user._id),
      getIp(req), { role: user.role }, { role }
    );

    res.json({ success: true, message: `Role updated to ${role}` });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /admin/members/:id/chapter ─────────────────────────────────────────
export const assignChapter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { chapter } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('Member not found', 404);

    const ch = await Chapter.findById(chapter);
    if (!ch) throw new AppError('Chapter not found', 404);

    await User.findByIdAndUpdate(user._id, { chapter: ch._id });

    await logAudit(
      String(req.user!._id), AuditAction.ASSIGN_CHAPTER, String(user._id),
      getIp(req), { chapter: user.chapter }, { chapter: ch._id }
    );

    res.json({ success: true, message: `Assigned to chapter: ${ch.name}` });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /admin/members/:id/executive ───────────────────────────────────────
export const assignExecutive = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { executivePosition, executiveOrder } = req.body as {
      executivePosition: string | null;
      executiveOrder?: number;
    };

    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('Member not found', 404);

    if (executivePosition === null) {
      // Remove executive role — revert to MEMBER
      await User.findByIdAndUpdate(user._id, {
        role: Role.MEMBER,
        $unset: { executivePosition: 1, executiveOrder: 1 },
      });
    } else {
      // Assign executive position
      await User.findByIdAndUpdate(user._id, {
        role: Role.EXECUTIVE,
        executivePosition,
        executiveOrder: executiveOrder ?? 99,
      });
    }

    await Notification.create({
      user: user._id,
      type: NotificationType.ROLE_CHANGE,
      title: executivePosition ? 'Executive Position Assigned' : 'Executive Position Removed',
      body: executivePosition
        ? `You have been assigned the position of ${executivePosition}.`
        : 'Your executive position has been removed.',
    });

    await logAudit(
      String(req.user!._id), AuditAction.ASSIGN_EXECUTIVE, String(user._id),
      getIp(req),
      { role: user.role, executivePosition: user.executivePosition },
      { role: executivePosition ? Role.EXECUTIVE : Role.MEMBER, executivePosition }
    );

    res.json({
      success: true,
      message: executivePosition
        ? `Assigned ${executivePosition} to ${user.firstName} ${user.lastName}`
        : `Executive position removed from ${user.firstName} ${user.lastName}`,
    });
  } catch (err) {
    next(err);
  }
};
