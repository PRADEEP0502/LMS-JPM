/**
 * Modular JPM Onboarding Process Schema
 * 
 * Focused strictly on actual employee onboarding stages:
 * 1. Personal Information & Contact Verification
 * 2. Official Identity & Document Check
 * 3. Manager & Operations Team Orientation
 * 4. IT System Access & Asset Entitlements
 * 5. Final Onboarding Declaration & Activation
 * 
 * Architecture supports dynamic adding, removing, reordering, or editing stages.
 */

export const INITIAL_ONBOARDING_STAGES = [
  {
    id: 'step-1-profile',
    stageNumber: 1,
    title: 'Personal Information & Contact Verification',
    shortName: 'PROFILE',
    description: 'Verify your official J.P. Morgan employee profile, contact details, emergency contacts, and primary office location.',
    iconName: 'UserCheck',
    fields: [
      { id: 'fullName', label: 'Full Legal Name', type: 'text', defaultValue: 'John Doe', readOnly: true },
      { id: 'empId', label: 'JPM Employee ID', type: 'text', defaultValue: 'EMP101', readOnly: true },
      { id: 'phone', label: 'Contact Phone Number', type: 'tel', defaultValue: '+1 (555) 234-5678', required: true },
      { id: 'emergencyContact', label: 'Emergency Contact Name & Phone', type: 'text', defaultValue: 'Jane Doe (+1 555-987-6543)', required: true },
      { id: 'officeLocation', label: 'Designated Office Location', type: 'select', options: ['New York - 383 Madison Ave', 'London - 25 Bank Street', 'Bengaluru - Embassy TechVillage', 'Singapore - Changi Business Park'], defaultValue: 'New York - 383 Madison Ave' }
    ]
  },
  {
    id: 'step-2-document',
    stageNumber: 2,
    title: 'Official Identity & Document Check',
    shortName: 'DOCUMENT VERIFICATION',
    description: 'Confirm identity verification documents, corporate badge issuance, and employment verification status.',
    iconName: 'FileCheck',
    checklist: [
      { id: 'd1', label: 'Government Photo ID / Passport verification confirmed' },
      { id: 'd2', label: 'JPM Corporate Smart Card Badge photo registered' },
      { id: 'd3', label: 'Form I-9 / Employment Eligibility records verified' }
    ]
  },
  {
    id: 'step-3-team',
    stageNumber: 3,
    title: 'Manager & Operations Team Orientation',
    shortName: 'TEAM ORIENTATION',
    description: 'Connect with your Operations direct manager, review team organization structure, and schedule initial 1-on-1 check-ins.',
    iconName: 'Users',
    checklist: [
      { id: 't1', label: 'Direct Line Manager: Sarah Jenkins (VP Operations)' },
      { id: 't2', label: 'Operations Department Org Chart & Buddy Assigned' },
      { id: 't3', label: 'Day-1 Welcome Call & Team Huddle Scheduled' }
    ]
  },
  {
    id: 'step-4-systems',
    stageNumber: 4,
    title: 'IT System Access & Asset Entitlements',
    shortName: 'SYSTEM ACCESS',
    description: 'Confirm workstation hardware dispatch, RSA SecurID token registration, and core software entitlement grants.',
    iconName: 'Laptop',
    checklist: [
      { id: 's1', label: 'JPM Laptop Hardware & Monitor Setup Received' },
      { id: 's2', label: 'RSA SecurID Hard/Soft Token Activated' },
      { id: 's3', label: 'Core Operations Software & Domain Credentials Provisioned' }
    ]
  },
  {
    id: 'step-5-declaration',
    stageNumber: 5,
    title: 'Final Onboarding Declaration & Activation',
    shortName: 'DECLARATION & COMPLETE',
    description: 'Electronically sign your official employee onboarding completion pledge to activate your full JPM LMS portal access.',
    iconName: 'CheckCircle',
    checklist: [
      { id: 'f1', label: 'Acknowledge electronic onboarding completion pledge' }
    ]
  }
];
