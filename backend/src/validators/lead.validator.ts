import { body, ValidationChain } from 'express-validator';

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];
const LEAD_SOURCES = ['Website', 'Instagram', 'Referral'];

export const createLeadValidator: ValidationChain[] = [
  body('name').trim().notEmpty().withMessage('Lead name is required'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('source')
    .notEmpty()
    .withMessage('Lead source is required')
    .isIn(LEAD_SOURCES)
    .withMessage(`Source must be one of: ${LEAD_SOURCES.join(', ')}`),

  body('status')
    .optional()
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),

  body('notes').optional().trim(),
];

export const updateLeadValidator: ValidationChain[] = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('source')
    .optional()
    .isIn(LEAD_SOURCES)
    .withMessage(`Source must be one of: ${LEAD_SOURCES.join(', ')}`),

  body('status')
    .optional()
    .isIn(LEAD_STATUSES)
    .withMessage(`Status must be one of: ${LEAD_STATUSES.join(', ')}`),

  body('notes').optional().trim(),
];
