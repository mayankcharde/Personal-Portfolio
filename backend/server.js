const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const Contact = require('./models/Contact');

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newContact = new Contact({
            name,
            email,
            phone,
            message
        });

        const savedContact = await newContact.save();
        console.log('Contact saved:', savedContact);
        
        res.status(201).json({ 
            success: true, 
            message: 'Message sent successfully!',
            contact: savedContact 
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error sending message',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
