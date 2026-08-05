const User = require('../models/User');

// @desc    Register or Login User
// @route   POST /api/users/auth
// @access  Public
const authUser = async (req, res) => {
  try {
    const { firebaseUid, name, email, phone, photoUrl } = req.body;

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        firebaseUid,
        name,
        email,
        phone,
        photoUrl,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private (Needs auth middleware later)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update User Steps
// @route   PUT /api/users/steps
// @access  Public (Should be private in production)
const updateSteps = async (req, res) => {
  try {
    const { firebaseUid, steps } = req.body;
    
    if (!firebaseUid) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // In a real app, you would maintain a history of steps per day.
    // For now, we'll just update a 'totalSteps' field or send a success response.
    const user = await User.findOne({ firebaseUid });
    if (user) {
      // Mock updating steps logic
      console.log(`Steps updated for ${user.name}: ${steps}`);
      res.json({ message: 'Steps updated successfully', currentSteps: steps });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  authUser,
  getUserProfile,
  updateUserProfile,
  updateSteps
};
