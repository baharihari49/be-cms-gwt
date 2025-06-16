// routes/aboutUsRoutes.ts
import { Router } from 'express';
import {
  companyValueController,
  timelineItemController,
  companyStatController,
  companyInfoController,
  aboutUsController
} from '../../controllers/aboutus/aboutus.controller';

const router = Router();

// Main About Us Routes
router.get('/complete', aboutUsController.getCompleteAboutUsData);

// Company Value Routes
router.get('/company-values', companyValueController.getAllCompanyValues);
router.get('/company-values/:id', companyValueController.getCompanyValueById);
router.post('/company-values', companyValueController.createCompanyValue);
router.put('/company-values/:id', companyValueController.updateCompanyValue);
router.delete('/company-values/:id', companyValueController.deleteCompanyValue);

// Timeline Item Routes
router.get('/timeline-items', timelineItemController.getAllTimelineItems);
router.get('/timeline-items/:id', timelineItemController.getTimelineItemById);
router.post('/timeline-items', timelineItemController.createTimelineItem);
router.put('/timeline-items/:id', timelineItemController.updateTimelineItem);
router.delete('/timeline-items/:id', timelineItemController.deleteTimelineItem);

// Company Stat Routes
router.get('/company-stats', companyStatController.getAllCompanyStats);
router.get('/company-stats/:id', companyStatController.getCompanyStatById);
router.post('/company-stats', companyStatController.createCompanyStat);
router.put('/company-stats/:id', companyStatController.updateCompanyStat);
router.delete('/company-stats/:id', companyStatController.deleteCompanyStat);

// Company Info Routes
router.get('/company-info', companyInfoController.getAllCompanyInfo);
router.get('/company-info/main', companyInfoController.getMainCompanyInfo);
router.get('/company-info/:id', companyInfoController.getCompanyInfoById);
router.post('/company-info', companyInfoController.createCompanyInfo);
router.put('/company-info/:id', companyInfoController.updateCompanyInfo);
router.delete('/company-info/:id', companyInfoController.deleteCompanyInfo);

export default router;