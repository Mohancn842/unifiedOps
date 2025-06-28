const Project = require('../models/Project');
const Employee = require('../models/Employee');

// POST /api/projects
const addProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ message: 'Project added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add project' });
  }
};

// GET /api/projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('assignedEmployees', 'name email');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

// POST /api/projects/:projectId/add-member
const addMemberToProject = async (req, res) => {
  const { projectId } = req.params;
  const { employeeId } = req.body;

  try {
    const project = await Project.findById(projectId);
    const employee = await Employee.findById(employeeId);

    if (!project || !employee) {
      return res.status(404).json({ message: 'Project or employee not found' });
    }

    if (!project.assignedEmployees.includes(employeeId)) {
      project.assignedEmployees.push(employeeId);
      await project.save();
    }

    if (!employee.projects.includes(projectId)) {
      employee.projects.push(projectId);
      await employee.save();
    }

    res.json({ message: 'Employee added to project successfully' });
  } catch (err) {
    console.error('Error adding member to project:', err);
    res.status(500).json({ message: 'Server error while adding member to project' });
  }
};

module.exports = {
  addProject,
  getAllProjects,
  addMemberToProject,
};
