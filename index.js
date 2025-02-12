require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MenuItem = require('./schema');

const app = express();

app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

app.post('/menu', async (req, res) => {
  try {
    const { name, description = '', price } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid name is required' });
    }
    if (!price || typeof price !== 'number' || price < 0) {
      return res.status(400).json({ success: false, message: 'Valid price is required' });
    }

    const newMenuItem = await MenuItem.create({ name, description, price });

    res.status(201).json({
      success: true,
      message: 'New menu item created successfully',
      data: newMenuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating item',
      error: error.message,
    });
  }
});

app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json({ success: true, data: menuItems });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
