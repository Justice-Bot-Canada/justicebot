import { lazy } from 'react';

// Lazy load heavy components to reduce initial bundle size
export const Dashboard = lazy(() => import('@/pages/Dashboard'));
export const Admin = lazy(() => import('@/pages/Admin'));
export const DocumentAnalysis = lazy(() => import('@/pages/DocumentAnalysis'));
export const FormBuilder = lazy(() => import('@/pages/FormBuilder'));
export const CaseAssessment = lazy(() => import('@/pages/CaseAssessment'));
export const Profile = lazy(() => import('@/pages/Profile'));
export const Evidence = lazy(() => import('@/pages/Evidence'));
export const LegalChat = lazy(() => import('@/pages/LegalChat'));
export const TutorialLibrary = lazy(() => import('@/pages/TutorialLibrary'));
export const TemplateLibrary = lazy(() => import('@/pages/TemplateLibrary'));
export const Referrals = lazy(() => import('@/pages/Referrals'));
