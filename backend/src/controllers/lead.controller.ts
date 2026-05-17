import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Lead from '../models/Lead.model';
import { AppError, LeadStatus, LeadSource } from '../types';
import { generateCSV } from '../utils/csv.utils';

// ─── GET /api/leads ───────────────────────────────────────────────────────────
export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = '1',
      limit = '10',
    } = req.query as {
      status?: LeadStatus;
      source?: LeadSource;
      search?: string;
      sort?: 'latest' | 'oldest';
      page?: string;
      limit?: string;
    };

    const currentPage = Math.max(1, parseInt(page, 10));
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (currentPage - 1) * pageLimit;

    const filter: any = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Sales users only see their own leads
    if (req.user?.role === 'sales') {
      filter.createdBy = req.user.userId;
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, totalCount] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(pageLimit)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageLimit);

    res.status(200).json({
      success: true,
      data: leads,
      meta: {
        currentPage,
        totalPages,
        totalCount,
        limit: pageLimit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/leads ──────────────────────────────────────────────────────────
export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    if (!req.user) return next(new AppError('Not authenticated', 401));

    const { name, email, status, source, notes } = req.body as {
      name: string;
      email: string;
      status?: LeadStatus;
      source: LeadSource;
      notes?: string;
    };

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      notes,
      createdBy: req.user.userId,
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/leads/export ────────────────────────────────────────────────────
export const exportLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search } = req.query as {
      status?: LeadStatus;
      source?: LeadSource;
      search?: string;
    };

    const filter: any = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    const csv = generateCSV(leads);

    const date = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="leads-export-${date}.csv"`
    );
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/leads/:id ───────────────────────────────────────────────────────
export const getLeadById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!lead) return next(new AppError('Lead not found', 404));

    // Sales can only view own leads
    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.userId
    ) {
      return next(new AppError('Access denied', 403));
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/leads/:id ───────────────────────────────────────────────────────
export const updateLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(new AppError('Lead not found', 404));

    // Sales can only update their own leads
    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.userId
    ) {
      return next(new AppError('Access denied', 403));
    }

    const { name, email, status, source, notes } = req.body as {
      name?: string;
      email?: string;
      status?: LeadStatus;
      source?: LeadSource;
      notes?: string;
    };

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, status, source, notes },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/leads/:id (Admin only) ───────────────────────────────────────
export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(new AppError('Lead not found', 404));

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/leads/stats (Admin only) ────────────────────────────────────────
export const getLeadStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [statusCounts, sourceCounts, recentLeads, total] = await Promise.all([
      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(),
    ]);

    const statusMap: Record<string, number> = {};
    statusCounts.forEach((s: { _id: string; count: number }) => {
      statusMap[s._id] = s.count;
    });

    const sourceMap: Record<string, number> = {};
    sourceCounts.forEach((s: { _id: string; count: number }) => {
      sourceMap[s._id] = s.count;
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: statusMap,
        bySource: sourceMap,
        recentLeads,
      },
    });
  } catch (error) {
    next(error);
  }
};
