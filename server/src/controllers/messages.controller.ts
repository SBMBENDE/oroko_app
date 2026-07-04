import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Message } from '../models/Message';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { NotificationType, MemberStatus } from '../types/enums';
import { AppError } from '../middleware/errorHandler';
import { getPagination, buildPaginationMeta } from '../utils/paginate';

// ── GET /api/messages/conversations ──────────────────────────────────────────
// Returns the last message per unique conversation partner + unread count
export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const myId = new mongoose.Types.ObjectId(String(req.user!._id));

    const conversations = await Message.aggregate([
      // Only messages involving me that I haven't deleted on my side
      {
        $match: {
          $or: [
            { sender: myId, deletedBySender: false },
            { recipient: myId, deletedByRecipient: false },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      // Identify the conversation partner (the other person)
      {
        $addFields: {
          partner: {
            $cond: { if: { $eq: ['$sender', myId] }, then: '$recipient', else: '$sender' },
          },
        },
      },
      // Group by partner — take the latest message and count unread
      {
        $group: {
          _id: '$partner',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$recipient', myId] }, { $eq: ['$read', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      // Populate partner info (safe public fields only)
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'partnerInfo',
        },
      },
      { $unwind: '$partnerInfo' },
      {
        $project: {
          _id: 0,
          partner: {
            _id: '$partnerInfo._id',
            firstName: '$partnerInfo.firstName',
            lastName: '$partnerInfo.lastName',
            profilePhoto: '$partnerInfo.profilePhoto',
            role: '$partnerInfo.role',
            executivePosition: '$partnerInfo.executivePosition',
          },
          lastMessage: {
            _id: '$lastMessage._id',
            content: '$lastMessage.content',
            sender: '$lastMessage.sender',
            createdAt: '$lastMessage.createdAt',
            read: '$lastMessage.read',
          },
          unreadCount: 1,
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    res.json({ success: true, data: conversations });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/messages/conversations/:userId ───────────────────────────────────
// Returns paginated messages in a thread between the current user and :userId
export const getThread = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const myId = String(req.user!._id);
    const { userId } = req.params;
    const { page, limit } = req.query as Record<string, string | undefined>;

    if (myId === userId) throw new AppError('Cannot view a thread with yourself', 400);

    const { skip, limit: lim, page: pg } = getPagination({ page, limit });

    const filter = {
      $or: [
        { sender: myId, recipient: userId, deletedBySender: false },
        { sender: userId, recipient: myId, deletedByRecipient: false },
      ],
    };

    const [messages, total] = await Promise.all([
      Message.find(filter)
        .populate('sender', 'firstName lastName profilePhoto')
        .populate('recipient', 'firstName lastName profilePhoto')
        .sort({ createdAt: 1 }) // chronological — oldest first
        .skip(skip)
        .limit(lim),
      Message.countDocuments(filter),
    ]);

    res.json({ success: true, data: messages, pagination: buildPaginationMeta(total, pg, lim) });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/messages/:userId ────────────────────────────────────────────────
export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { content } = req.body;
    const senderId = String(req.user!._id);

    if (senderId === userId) {
      throw new AppError('You cannot send a message to yourself', 400);
    }

    // Verify recipient exists, is active, and allows messages
    const recipient = await User.findOne({
      _id: userId,
      status: MemberStatus.ACTIVE,
    });

    if (!recipient) throw new AppError('Recipient not found', 404);

    if (!recipient.privacy.allowMessages) {
      throw new AppError('This member is not accepting messages', 403);
    }

    // Check sender also has messaging enabled
    if (!req.user!.privacy.allowMessages) {
      throw new AppError('Enable messaging in your privacy settings to send messages', 403);
    }

    const message = await Message.create({
      sender: senderId,
      recipient: userId,
      content,
    });

    // Create in-app notification for recipient
    await Notification.create({
      user: userId,
      type: NotificationType.MESSAGE,
      title: `New message from ${req.user!.firstName} ${req.user!.lastName}`,
      body: content.length > 80 ? content.substring(0, 80) + '…' : content,
      relatedId: message._id,
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'firstName lastName profilePhoto')
      .populate('recipient', 'firstName lastName profilePhoto');

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/messages/:userId/read ─────────────────────────────────────────
// Mark all messages in a thread as read (where current user is the recipient)
export const markThreadRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const myId = String(req.user!._id);
    const { userId } = req.params;

    await Message.updateMany(
      { sender: userId, recipient: myId, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true, message: 'Thread marked as read' });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/messages/:messageId ──────────────────────────────────────────
// Soft-delete a message on the requester's side only
export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const myId = String(req.user!._id);
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) throw new AppError('Message not found', 404);

    const isSender    = String(message.sender)    === myId;
    const isRecipient = String(message.recipient) === myId;

    if (!isSender && !isRecipient) {
      throw new AppError('You do not have permission to delete this message', 403);
    }

    if (isSender) {
      await Message.findByIdAndUpdate(messageId, { deletedBySender: true });
    } else {
      await Message.findByIdAndUpdate(messageId, { deletedByRecipient: true });
    }

    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
};
