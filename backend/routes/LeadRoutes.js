// leadRoutes.js or in your main routes file
import express from 'express';
import { getAllLeads, updateAllUserLeadScores, generateSingleLead } from '../controllers/LeadController.js';
import adminMiddleware from '../middleware/adminAuth.js';

const router = express.Router();

// GET /api/lead/leads - Fetch all leads
router.get('/leads',adminMiddleware, async (req, res) => {
  try {
    const result = await getAllLeads();
    res.json(result);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch leads',
      leads: []
    });
  }
});

// POST /api/lead/generate-lead - Generate lead for specific user
router.post('/generate-lead', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const result = await generateSingleLead(userId);
    res.json(result);
  } catch (error) {
    console.error('Error generating lead:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate lead data'
    });
  }
});

// POST /api/lead/update-all-leads - Batch update all leads
router.post('/update-all-leads', adminMiddleware, async (req, res) => {
  try {
    const result = await updateAllUserLeadScores();
    res.json(result);
  } catch (error) {
    console.error('Error updating all leads:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update lead scores'
    });
  }
});

export default router;