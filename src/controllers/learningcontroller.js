const express = require('express');

const router = express.Router();

// Mock data
const learningResources = [
    { id: 1, title: 'JavaScript Basics', description: 'Learn the basics of JavaScript.' },
    { id: 2, title: 'Node.js Introduction', description: 'Introduction to Node.js and server-side JavaScript.' },
    { id: 3, title: 'Express.js Guide', description: 'Comprehensive guide to Express.js framework.' }
];

// Get all learning resources
router.get('/resources', (req, res) => {
    res.json(learningResources);
});

// Get a specific learning resource by ID
router.get('/resources/:id', (req, res) => {
    const resourceId = parseInt(req.params.id, 10);
    const resource = learningResources.find(r => r.id === resourceId);
    if (resource) {
        res.json(resource);
    } else {
        res.status(404).send('Resource not found');
    }
});

// Create a new learning resource
router.post('/resources', (req, res) => {
    const newResource = {
        id: learningResources.length + 1,
        title: req.body.title,
        description: req.body.description
    };
    learningResources.push(newResource);
    res.status(201).json(newResource);
});

// Update an existing learning resource
router.put('/resources/:id', (req, res) => {
    const resourceId = parseInt(req.params.id, 10);
    const resourceIndex = learningResources.findIndex(r => r.id === resourceId);
    if (resourceIndex !== -1) {
        learningResources[resourceIndex] = {
            id: resourceId,
            title: req.body.title,
            description: req.body.description
        };
        res.json(learningResources[resourceIndex]);
    } else {
        res.status(404).send('Resource not found');
    }
});

// Delete a learning resource
router.delete('/resources/:id', (req, res) => {
    const resourceId = parseInt(req.params.id, 10);
    const resourceIndex = learningResources.findIndex(r => r.id === resourceId);
    if (resourceIndex !== -1) {
        learningResources.splice(resourceIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Resource not found');
    }
});

module.exports = router;