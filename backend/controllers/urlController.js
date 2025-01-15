// controllers/urlController.js
const shortid = require('shortid')
const URL = require('../models/URL');

const createShortUrl = async (req, res) => {
  try {
    console.log('URL shortening request:', req.body.url);
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    console.log('Received URL:', url);

    // Broad URL validation regex to accept a wider variety of URLs
    const urlPattern = /^(https?:\/\/)(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\/\S*)?$/;

    if (!url.match(urlPattern)) {
      console.log('URL does not match the pattern');
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format'
      });
    }

    // Generate a unique shortId
    const shortId = shortid.generate();
    console.log('Generated shortId:', shortId); // Log shortId for debugging


     const newUrl = await URL.create({
      shortId,
      originalUrl: url,
      createdBy: req.user.id, // Make sure req.user exists from your auth middleware
      visits: []
    });


    // Check if shortId already exists
    
    

   // Better shortUrl construction in createShortUrl:
const baseUrl = process.env.NODE_ENV === 'production' 
  ? process.env.BASE_URL 
  : `${req.protocol}://${req.get('host')}`;
const shortUrl = `${baseUrl}/s/${shortId}`;  // Make sure /s/ is included

    res.status(201).json({
      success: true,
      shortUrl,
      shortId,
      originalUrl: url
    });
  } catch (error) {
    console.error('URL creation error:', error.message, error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating short URL'
    });
  }
};

const redirectToUrl = async (req, res) => {
  
  try {
    const { shortId } = req.params;
    
    // Update to use findOneAndUpdate to track visits
    const url = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visits: {
            timestamp: Date.now(),
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip
          }
        }
      },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    return res.redirect(301, url.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({
      success: false,
      message: 'Error redirecting to URL'
    });
  }
};


const getUrlAnalytics = async (req, res) => {
  try {
    const { shortId } = req.params;
    console.log('Analytics request for:', shortId);
    console.log('User role:', req.user.role);

    // Fetch the URL document from the database
    const url = await URL.findOne({ shortId });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    // Check if the user is authorized to view the analytics
    if (url.createdBy.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these analytics'
      });
    }

    // Send the analytics data in the response
    res.json({
      success: true,
      totalClicks: url.visits.length,
      analytics: url.visits,
      originalUrl: url.originalUrl,
      shortId: url.shortId
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
};



const getUserUrls = async (req, res) => {
  try {
    console.log('Fetching URLs for user:', req.user.email);
    const urls = await URL.find({ createdBy: req.user.id });
    res.json({
      success: true,
      urls
    });
  } catch (error) {
    console.error('Error fetching user URLs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching URLs'
    });
  }
};

module.exports = {
  createShortUrl,
  getUrlAnalytics,
  redirectToUrl,
  getUserUrls
};