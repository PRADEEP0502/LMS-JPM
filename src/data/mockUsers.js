/**
 * Initial Mock Users Seed Data for JPM LMS
 * 
 * Strict User Roles:
 * - EMPLOYEE
 * - HR
 * - MD
 * 
 * Demo Credentials:
 * - emp101 / password123 (Employee)
 * - hr201 / password123  (HR)
 * - md301 / password123  (MD)
 */

export const MOCK_USERS = [
  {
    userId: 'emp101',
    password: 'password123',
    name: 'John Doe',
    role: 'EMPLOYEE',
    title: 'Senior Operations Analyst',
    department: 'Corporate Operations',
    email: 'john.doe@jpmorgan.com',
    avatarInitials: 'JD'
  },
  {
    userId: 'hr201',
    password: 'password123',
    name: 'Sarah Jenkins',
    role: 'HR',
    title: 'HR Business Partner',
    department: 'Global Human Resources',
    email: 'sarah.jenkins@jpmorgan.com',
    avatarInitials: 'SJ'
  },
  {
    userId: 'md301',
    password: 'password123',
    name: 'Robert Sterling',
    role: 'MD',
    title: 'Managing Director',
    department: 'Executive Leadership',
    email: 'robert.sterling@jpmorgan.com',
    avatarInitials: 'RS'
  }
];

export const MODULE_CATALOG = [
  { id: 'onboarding', title: 'Employee Onboarding', description: 'Interactive onboarding journeys & structured employee setup.', roleAccess: ['HR', 'EMPLOYEE'] },
  { id: 'work-master', title: 'Work Master', description: 'Central repository of tasks, duties, and core work items.', roleAccess: ['HR', 'MD'] },
  { id: 'training', title: 'Training & Video LMS', description: 'Curated courses, video tutorials, and compliance training.', roleAccess: ['EMPLOYEE', 'HR', 'MD'] },
  { id: 'documents', title: 'Documents & SOPs', description: 'Standard operating procedures and policy documentation.', roleAccess: ['EMPLOYEE', 'HR', 'MD'] },
  { id: 'work-assignment', title: 'Work Assignment', description: 'Task delegation and workload tracking engine.', roleAccess: ['HR', 'MD'] },
  { id: 'abcd-tracking', title: 'ABCD Tracking', description: 'Accountability, Behavioral, Competency & Delivery tracking.', roleAccess: ['HR', 'MD'] },
  { id: 'reports', title: 'Executive Reports & Analytics', description: 'Comprehensive reporting dashboards and compliance analytics.', roleAccess: ['HR', 'MD'] }
];
