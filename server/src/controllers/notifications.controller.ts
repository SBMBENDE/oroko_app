import { Request, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification';
import { Message } from '../models/Message';
import { AppError } from '../middleware/errorHandler';
import { getPagination, buildPaginationMeta } from '../utils/paginate';

// ── GET /api/notifications ────────────────────────────────────────────────────
export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const myId = String(req.user!._id);
    const { page, limit } = req.query as Record<string, string | undefined>;
    const { skip, limit: lim, page: pg } = getPagination({ page, limit });

    const filter = { user: myId };

    const [notifications, total, totalUnread, unreadMessages] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lim),
      Notification.countDocuments(filter),
      Notification.countDocuments({ user: myId, read: false }),
      Message.countDocuments({ recipient: myId, read: false }),
    ]);

    res.json({
      success: true,
      data: notifications,
      pagination: buildPaginationMeta(total, pg, lim),
      meta: { totalUnread, unreadMessages },
    });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/notifications/read-all ────────────────────────────────────────
// IMPORTANT: this static route must be registered BEFORE /:id/read
export const markAllRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Notification.updateMany(
      { user: String(req.user!._id), read: false },
      { $set: { read: true } }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/notifications/:id/read ────────────────────────────────────────
export const markOneRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: String(req.user!._id) },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) throw new AppError('Notification not found', 404);

    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/notifications/:id ─────────────────────────────────────────────
export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: String(req.user!._id),
    });

    if (!notification) throw new AppError('Notification not found', 404);

    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
};
