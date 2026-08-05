// @desc    Convert steps to WalkX Coins
// @route   POST /api/wallet/convert
// @access  Public (Should be private in production)
const convertStepsToCoins = async (req, res) => {
  try {
    const { firebaseUid, stepsToConvert } = req.body;
    
    if (!firebaseUid || !stepsToConvert) {
      return res.status(400).json({ message: 'User ID and steps are required' });
    }

    // Business Rule: 100,000 steps = 100 Rs. (1000 steps = 1 Rs)
    const conversionRate = 1000;
    
    if (stepsToConvert < conversionRate) {
      return res.status(400).json({ message: `Minimum ${conversionRate} steps required to convert` });
    }

    const coinsEarned = Math.floor(stepsToConvert / conversionRate);

    // Mock Database update
    console.log(`User ${firebaseUid} converted ${stepsToConvert} steps into ₹${coinsEarned}`);

    res.json({ 
      message: 'Conversion successful', 
      coinsEarned,
      newBalance: coinsEarned // In real app, you would add to user.balance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Request Withdrawal to UPI
// @route   POST /api/wallet/withdraw
// @access  Public (Should be private in production)
const requestWithdrawal = async (req, res) => {
  try {
    const { firebaseUid, upiId, amount } = req.body;
    
    if (!firebaseUid || !upiId || !amount) {
      return res.status(400).json({ message: 'User ID, UPI ID, and amount are required' });
    }

    if (amount < 50) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is ₹50' });
    }

    // Mock Database update: Deduct from balance, add to withdrawal history
    console.log(`Withdrawal request received for ${upiId}. Amount: ₹${amount}`);

    res.json({ 
      message: 'Withdrawal requested successfully. It will be processed within 24 hours.', 
      status: 'PENDING',
      transactionId: `TXN${Math.floor(Math.random() * 1000000)}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  convertStepsToCoins,
  requestWithdrawal
};
