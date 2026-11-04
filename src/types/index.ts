export type Language = 'en' | 'hi';

export type GovtCategory =
  | 'All'
  | 'Central'
  | 'Defense'
  | 'Banking'
  | 'Railways'
  | 'UPSC/PSC'
  | 'SSC'
  | 'Teaching'
  | 'Police'
  | 'State'
  | 'PSU';

export type JobType =
  | 'All'
  | 'Full-time'
  | 'Internship / Apprenticeship'
  | 'PM Internship'
  | 'Walk-in'
  | 'Work From Home';

export type NewsCategory =
  | 'All'
  | 'National'
  | 'Yojana & Policy'
  | 'Exams & Education'
  | 'Jobs & Economy'
  | 'State Affairs'
  | 'Agriculture & Rural';

export interface GovtPosting {
  id: string;
  titleEn: string;
  titleHi: string;
  organizationEn: string;
  organizationHi: string;
  postCategory: GovtCategory;
  state?: string;
  totalVacancies: number;
  qualifications: string[]; // e.g. ["10th Pass", "12th Pass", "Graduate", "Engineering"]
  ageMin: number;
  ageMax: number;
  ageRelaxationEn: string;
  ageRelaxationHi: string;
  salaryPayScale: string;
  payLevelEn: string;
  payLevelHi: string;
  location: string;
  startDate: string;
  lastDate: string;
  examDate?: string;
  admitCardStatus?: 'Available Now' | 'Expected Next Week' | 'Released' | 'Awaited';
  resultStatus?: 'Declared' | 'Awaited' | 'Answer Key Out';
  applicationFee: {
    generalOBC: string;
    scStWomen: string;
  };
  selectionStagesEn: string[];
  selectionStagesHi: string[];
  officialPortalUrl: string;
  notificationPdfUrl: string;
  status: 'Active' | 'Closing Soon' | 'Admit Card Out' | 'Result Declared';
  tags: string[];
  summaryEn: string;
  summaryHi: string;
}

export interface NewsArticle {
  id: string;
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  contentEn: string[];
  contentHi: string[];
  category: NewsCategory;
  categoryHi: string;
  source: string;
  isFactChecked: boolean;
  publishedAt: string;
  readTimeMinutes: number;
  tags: string[];
  impactPointsEn: string[];
  impactPointsHi: string[];
  officialLink?: string;
}

export interface JobPosting {
  id: string;
  titleEn: string;
  titleHi: string;
  company: string;
  category: 'Corporate' | 'Tech' | 'Government Apprenticeship' | 'Banking/Finance' | 'Logistics & Retail' | 'Operations';
  location: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  type: JobType;
  minQualification: string;
  experienceRequired: string;
  salaryRange: string;
  vacancies: number;
  skills: string[];
  descriptionEn: string;
  descriptionHi: string;
  applyUrl: string;
  deadline: string;
  isFeaturedGovtApprentice?: boolean; // PM Internship Scheme, NATS, etc.
  stipendNote?: string;
}

export interface GovtScheme {
  id: string;
  nameEn: string;
  nameHi: string;
  taglineEn: string;
  taglineHi: string;
  ministryEn: string;
  ministryHi: string;
  category: 'Farmers' | 'Youth & Students' | 'Women & Child' | 'Health' | 'Housing' | 'Financial & Pension' | 'Entrepreneurs & MSME';
  categoryHi: string;
  financialBenefit: string;
  eligibilityEn: string[];
  eligibilityHi: string[];
  keyBenefitsEn: string[];
  keyBenefitsHi: string[];
  documentsRequiredEn: string[];
  documentsRequiredHi: string[];
  applyPortalUrl: string;
  tollFreeNumber: string;
  targetAudience: string;
}

export interface CitizenPortal {
  id: string;
  nameEn: string;
  nameHi: string;
  descEn: string;
  descHi: string;
  category: 'ID & Verification' | 'Welfare & Benefits' | 'Finance & Tax' | 'Transport' | 'Document Storage' | 'Education & Career';
  categoryHi: string;
  officialUrl: string;
  iconName: string;
  topServices: string[];
  isEssential: boolean;
}

export interface SavedItem {
  id: string;
  type: 'govt' | 'news' | 'job' | 'scheme';
  savedAt: string;
  title: string;
}

export interface BioDataProfile {
  fullName: string;
  fatherName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  category: 'General / UR' | 'OBC' | 'SC' | 'ST' | 'EWS';
  mobileNumber: string;
  email: string;
  address: string;
  state: string;
  pinCode: string;
  highestQualification: string;
  qualifications: {
    course: string;
    boardOrUniversity: string;
    passingYear: string;
    percentage: string;
  }[];
  skills: string;
  experience: string;
  languagesKnown: string;
  declarationAgreed: boolean;
}
