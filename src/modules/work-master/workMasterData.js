/**
 * Modular Work Master Data Schema & Seed Catalog
 * 
 * Configurable departments, roles, levels, and practical accuracy targets.
 * Ready for future backend/API integration.
 */

export const WORK_LEVELS = [
  { id: 'L1', label: 'L1 – Beginner', badgeColor: '#3B82F6' },
  { id: 'L2', label: 'L2 – Intermediate', badgeColor: '#8B5CF6' },
  { id: 'L3', label: 'L3 – Advanced', badgeColor: '#D97706' }
];

export const DEPARTMENTS = [
  'Data Entry',
  'Accounts',
  'Purchase',
  'Global Human Resources',
  'Corporate Operations',
  'Production',
  'Stores & Logistics',
  'Maintenance & Facilities'
];

export const DOCUMENT_TYPES = [
  'SOP',
  'Checklist',
  'Work Instruction',
  'Reference Document'
];

export const INITIAL_WORKS = [
  {
    id: 'work-001',
    name: 'Bill Inward Entry',
    department: 'Data Entry',
    role: 'Data Entry Specialist',
    level: 'L1',
    shortDescription: 'Learn the complete bill inward entry process, vendor invoice verification, and ERP logging.',
    description: 'Comprehensive operational procedure covering physical and digital invoice receipt, vendor tax verification, line item logging in ERP, and exception escalation.',
    
    trainingVideo: {
      name: 'bill_inward_entry_masterclass.mp4',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '12:45',
      uploadedAt: '2026-08-20'
    },

    documents: [
      {
        id: 'doc-1',
        name: 'Bill Inward Entry Standard Operating Procedure (SOP).pdf',
        type: 'SOP',
        size: '2.4 MB',
        uploadDate: '2026-08-20'
      },
      {
        id: 'doc-2',
        name: 'ERP Inward Entry Checklist v3.2.pdf',
        type: 'Checklist',
        size: '1.1 MB',
        uploadDate: '2026-08-20'
      }
    ],

    learningPoints: [
      'Check bill number against physical/digital invoice copy',
      'Verify vendor name, GST/Tax Registration ID, and address',
      'Verify invoice date and payment terms entitlement',
      'Check net amount and tax calculations accuracy',
      'Enter correct ERP transaction details into system',
      'Attach scanned invoice document to ERP record'
    ],

    practical: {
      durationDays: 4,
      instructions: 'Complete 1 day of senior analyst shadowing, process 10 supervised entries, then execute 50 test bill inward entries independently in staging.',
      expectedOutcome: 'Employee should be able to complete Bill Inward Entry independently.',
      accuracyTarget: '99%'
    },

    status: 'ACTIVE',
    createdAt: '2026-08-20T08:00:00.000Z'
  },
  {
    id: 'work-002',
    name: 'Vendor Payment Reconciliation',
    department: 'Accounts',
    role: 'Accounts Receivable Analyst',
    level: 'L2',
    shortDescription: 'Reconcile vendor ledger statements against bank disbursements and purchase orders.',
    description: 'End-to-end reconciliation workflow for vendor ledger balances, Debit Note adjustments, withholding tax credits, and payment voucher dispatch.',
    
    trainingVideo: {
      name: 'vendor_reconciliation_guide.mp4',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: '18:20',
      uploadedAt: '2026-08-20'
    },

    documents: [
      {
        id: 'doc-3',
        name: 'Vendor Reconciliation Matrix & Guideline.pdf',
        type: 'SOP',
        size: '3.8 MB',
        uploadDate: '2026-08-20'
      }
    ],

    learningPoints: [
      'Match ledger entries against bank statement credits',
      'Identify unadjusted debit notes and advance payments',
      'Verify TDS / Tax Deduction certificates',
      'Prepare vendor reconciliation statement (VRS)',
      'Obtain manager sign-off for balance confirmation'
    ],

    practical: {
      durationDays: 5,
      instructions: 'Reconcile 5 active vendor accounts under supervisor review.',
      expectedOutcome: 'Ability to independently prepare monthly VRS for enterprise vendor accounts.',
      accuracyTarget: '98%'
    },

    status: 'ACTIVE',
    createdAt: '2026-08-20T08:15:00.000Z'
  },
  {
    id: 'work-003',
    name: 'Purchase Order Approval Workflow',
    department: 'Purchase',
    role: 'Procurement Specialist',
    level: 'L3',
    shortDescription: 'Review requisition parameters, commercial terms, and approval authorization for capital POs.',
    description: 'Advanced procurement governance module covering quote comparison, approval matrix enforcement, contract SLA verification, and final PO issuance.',
    
    trainingVideo: {
      name: 'po_approval_governance.mp4',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: '22:10',
      uploadedAt: '2026-08-20'
    },

    documents: [
      {
        id: 'doc-4',
        name: 'Procurement Approval Governance SOP 2026.pdf',
        type: 'SOP',
        size: '4.2 MB',
        uploadDate: '2026-08-20'
      }
    ],

    learningPoints: [
      'Validate PR quote comparison sheets',
      'Check delegation of authority (DOA) limit',
      'Ensure legal and compliance terms in SLA',
      'Approve PO in enterprise procurement system'
    ],

    practical: {
      durationDays: 7,
      instructions: 'Audit 3 high-value PO files and present findings to Procurement Lead.',
      expectedOutcome: 'Capable of auditing and releasing Level 3 capital purchase orders.',
      accuracyTarget: '100%'
    },

    status: 'ACTIVE',
    createdAt: '2026-08-20T08:30:00.000Z'
  }
];
