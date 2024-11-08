export enum LeadStatusEnum {
  NEW_LEAD = 'Leads Baru',
  FOLLOW_UP = 'Follow Up', // Can occur multiple times without limit
  SURVEY_REQUEST = 'Survey Request', // Ensures building structure and needed materials for installation
  SURVEY_APPROVED = 'Survey Approved by Operational',
  SURVEY_REJECTED = 'Survey Rejected by Operational',
  SURVEY_COMPLETED = 'Survey Completed', // Requires image and notes
  FINAL_PROPOSAL_FOLLOW_UP = 'Follow Up (Final Proposal)', // Last offer after survey
  DEAL = 'Deal', // Auto-create a new Client Account
}
