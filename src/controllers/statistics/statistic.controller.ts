// src/controllers/client/statistics.controller.ts
import { Request, Response } from 'express';
import statisticService from '../../services/statisticService';
import { 
  sendSuccessResponse,
  sendErrorResponse,
  formatErrorMessage
} from '../../utils/responseUtils';

class StatisticsController {
  // GET /api/statistics (MAIN ENDPOINT)
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const method = (req.query.method as string) || 'realtime';
      
      let statistics: any;
      
      switch (method) {
        case 'stored':
          statistics = await statisticService.getStoredStatistics();
          break;
          
        case 'save':
          statistics = await statisticService.saveStatisticsToDatabase();
          break;
          
        case 'realtime':
        default:
          statistics = await statisticService.getStatisticsRealTime();
          break;
      }
      
      sendSuccessResponse(res, statistics, `Statistics retrieved successfully (${method} method)`);

    } catch (error: unknown) {
      console.error('Controller error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const { message, statusCode } = formatErrorMessage(new Error(errorMessage));
      sendErrorResponse(res, message, statusCode);
    }
  }

  // GET /api/statistics/debug (untuk troubleshooting)
  async debugStatistics(req: Request, res: Response): Promise<void> {
    try {
      const debugData = await statisticService.debugDatabaseContent();
      
      sendSuccessResponse(res, debugData, 'Debug data retrieved successfully');

    } catch (error: unknown) {
      console.error('Debug controller error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const { message, statusCode } = formatErrorMessage(new Error(errorMessage));
      sendErrorResponse(res, message, statusCode);
    }
  }

  // POST /api/statistics/save (untuk save ke database)
  async saveStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await statisticService.saveStatisticsToDatabase();
      
      sendSuccessResponse(res, statistics, 'Statistics calculated and saved successfully');

    } catch (error: unknown) {
      console.error('Save controller error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const { message, statusCode } = formatErrorMessage(new Error(errorMessage));
      sendErrorResponse(res, message, statusCode);
    }
  }
}

export default new StatisticsController();