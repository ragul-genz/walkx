// @desc    Get Admin Stats (Total Users, Total Steps, Pending Withdrawals)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = 150; // Mock total users
    
    // In a real app, you would aggregate total steps across all users.
    // For now, returning mock data.
    const totalSteps = 2450000; 
    const pendingWithdrawalsCount = 12;

    res.json({
      totalUsers,
      totalSteps,
      pendingWithdrawalsCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve or Reject Withdrawal
// @route   PUT /api/admin/withdrawals/:id
// @access  Private/Admin
const processWithdrawal = async (req, res) => {
  try {
    const { status } = req.body; // 'APPROVED' or 'REJECTED'
    const withdrawalId = req.params.id;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Mock processing logic
    console.log(`Withdrawal ${withdrawalId} has been ${status}.`);
    
    // If APPROVED, trigger referral bonus for referrer if this is the first withdrawal.

    res.json({ message: `Withdrawal successfully ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAdminStats,
  processWithdrawal
};
