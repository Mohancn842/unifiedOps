const express = require('express');
const MarketingTeam = require('../models/MarketingTeam');
const MarketingEmployee = require('../models/MarketingEmployee');

const router = express.Router();

/**
 * @route   POST /api/marketing-teams
 * @desc    Create new marketing team and assign team to employees
 */
router.post('/', async (req, res) => {
  try {
    const { name, memberIds, teamLeadId } = req.body;

    if (!name || !Array.isArray(memberIds) || !teamLeadId) {
      return res.status(400).json({ message: 'Name, members, and team lead are required.' });
    }

    const existingTeam = await MarketingTeam.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team name already exists.' });
    }

    if (!memberIds.includes(teamLeadId)) {
      return res.status(400).json({ message: 'Team lead must be one of the team members.' });
    }

    const newTeam = new MarketingTeam({
      name,
      members: memberIds,
      teamLead: teamLeadId,
    });

    await newTeam.save();

    // 🔁 Update employees to reference the new team
    await MarketingEmployee.updateMany(
      { _id: { $in: memberIds } },
      { $set: { team: newTeam._id } }
    );

    res.status(201).json({
      message: 'Team created and members updated successfully.',
      team: newTeam,
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/marketing-teams
 * @desc    Get all marketing teams with members and team lead info
 */
router.get('/', async (req, res) => {
  try {
    const teams = await MarketingTeam.find()
      .populate('members', 'name email designation team')
      .populate('teamLead', 'name email designation team');

    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Add this to your marketingTeams router

router.put('/:id', async (req, res) => {
  try {
    const { name, memberIds, teamLeadId } = req.body;
    const teamId = req.params.id;

    if (!name || !Array.isArray(memberIds) || !teamLeadId) {
      return res.status(400).json({ message: 'Name, members, and team lead are required.' });
    }

    const existingTeam = await MarketingTeam.findOne({ name, _id: { $ne: teamId } });
    if (existingTeam) {
      return res.status(400).json({ message: 'Another team with the same name exists.' });
    }

    if (!memberIds.includes(teamLeadId)) {
      return res.status(400).json({ message: 'Team lead must be one of the team members.' });
    }

    // Check if any of the new members are already in a different team
    const allTeams = await MarketingTeam.find({ _id: { $ne: teamId } });
    for (const team of allTeams) {
      for (const member of memberIds) {
        if (team.members.includes(member)) {
          return res.status(400).json({ message: 'One or more selected members already belong to another team.' });
        }
      }
    }

    // Update the team
    const updatedTeam = await MarketingTeam.findByIdAndUpdate(
      teamId,
      { name, members: memberIds, teamLead: teamLeadId },
      { new: true }
    );

    // Clear previous team references from all employees
    await MarketingEmployee.updateMany({ team: teamId }, { $unset: { team: "" } });

    // Assign team to updated members
    await MarketingEmployee.updateMany(
      { _id: { $in: memberIds } },
      { $set: { team: teamId } }
    );

    res.status(200).json({
      message: 'Team updated successfully.',
      team: updatedTeam,
    });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
