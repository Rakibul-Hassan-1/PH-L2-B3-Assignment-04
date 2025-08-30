const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

// Production API base URL
const PRODUCTION_API = 'https://ph-l2-b3-assignment-03.vercel.app';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend proxy is running',
    timestamp: new Date().toISOString()
  });
});

// Proxy middleware
const proxyToProduction = async (req, res) => {
  try {
    const targetUrl = `${PRODUCTION_API}${req.url}`;
    console.log(`Proxying ${req.method} request to: ${targetUrl}`);
    
    const config = {
      method: req.method,
      url: targetUrl,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Library-Management-Backend/1.0.0'
      },
      timeout: 10000
    };

    // Add body for POST/PUT requests
    if (req.body && Object.keys(req.body).length > 0) {
      config.data = req.body;
    }

    // Add query parameters
    if (req.query && Object.keys(req.query).length > 0) {
      config.params = req.query;
    }

    const response = await axios(config);
    
    // Forward the response
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    console.error('Error details:', error.response?.data || error.code);
    
    res.status(500).json({
      success: false,
      message: 'Error connecting to production API',
      error: error.message,
      details: error.response?.data || error.code
    });
  }
};

// Book endpoints
app.get('/api/books', proxyToProduction);
app.post('/api/books', proxyToProduction);
app.get('/api/books/:id', proxyToProduction);
app.put('/api/books/:id', proxyToProduction);
app.delete('/api/books/:id', proxyToProduction);

// Borrow endpoints
app.get('/api/borrow', proxyToProduction);
app.post('/api/borrow', proxyToProduction);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend proxy running on port ${PORT}`);
  console.log(`📚 Proxying to: ${PRODUCTION_API}`);
  console.log(`🌍 CORS enabled for frontend`);
});
