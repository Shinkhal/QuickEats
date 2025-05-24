import Query from "../models/QueryModel.js";

export const submitQuery = async (req, res) => {
  try {
    const { name, email, contactNo, query, expertise } = req.body;

    if (!name || !email || !contactNo || !query || !expertise) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    await Query.create({ name, email, contactNo, query, expertise });

    res.status(201).json({ message: 'Query submitted successfully!' });
  } catch (error) {
    console.error('Error submitting query:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    
    // Calculate statistics
    const totalQueries = queries.length;
    const resolvedQueries = queries.filter(q => q.status === 'resolved');
    const pendingQueries = queries.filter(q => q.status === 'pending');
    
    // Generate line chart data (last 7 days)
    const lineData = generateLineData(queries);
    
    // Generate bar chart data (by expertise)
    const barData = generateBarData(queries);
    
    const responseData = {
      totalQueries,
      queryResolved: resolvedQueries.length,
      pendingQueries: pendingQueries.length,
      completedQueries: resolvedQueries,
      lineData,
      barData,
      queries // Include all queries for other uses
    };
    
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Helper function to generate line chart data
const generateLineData = (queries) => {
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayQueries = queries.filter(q => {
      const queryDate = new Date(q.createdAt).toISOString().split('T')[0];
      return queryDate === dateStr;
    });
    
    last7Days.push({
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: dayQueries.length
    });
  }
  
  return last7Days;
};

// Helper function to generate bar chart data
const generateBarData = (queries) => {
  const expertiseCount = {};
  
  queries.forEach(query => {
    expertiseCount[query.expertise] = (expertiseCount[query.expertise] || 0) + 1;
  });
  
  return Object.entries(expertiseCount).map(([name, queries]) => ({
    name: name.replace(' ', '\n'), // Line break for better display
    queries
  }));
};