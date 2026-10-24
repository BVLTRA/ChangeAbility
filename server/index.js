const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken, requireAdmin } = require('./middleware/auth');

const User = require('./models/User');
const Beneficiary = require('./models/Beneficiary');
const Team = require('./models/Team');
const Project = require('./models/Project');
const Event = require('./models/Event');
const Report = require('./models/Report');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/changeability')
.then(() => console.log('Database locked and loaded'))
.catch((err) => console.error('DB Connection Error:', err));



// --- ROUTES ---

// AUTHENTICATION & RBAC ROUTES
  // 1. ADMIN INVITES A VOLUNTEER
  // Protected route: Only Admins can hit this endpoint
app.post('/api/auth/invite', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { email, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in system.' });

    // Create a stub account. No password yet.
    const newUser = new User({
      email,
      role: role || 'Volunteer',
      status: 'Pending'
    });

    await newUser.save();
    res.status(201).json({ message: `Invitation stub created for ${email}` });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating invite.' });
  }
});

  // 2. VOLUNTEER CLAIMS THEIR ACCOUNT
  // Open route: The volunteer is unauthenticated at this point
app.post('/api/auth/claim', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No invitation found for this email.' });
    if (user.status === 'Active') return res.status(400).json({ error: 'Account already claimed. Please log in.' });

    // Hash the password mechanically (10 salt rounds is the industry standard balance of speed/security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.status = 'Active';
    await user.save();

    res.status(200).json({ message: 'Account successfully claimed and activated.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error claiming account.' });
  }
});

  // 3. LOGIN CIRCUIT
  // Open route: Returns the JWT if credentials match
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user || user.status === 'Pending') {
      return res.status(401).json({ error: 'Invalid credentials or account not claimed.' });
    }

    // Compare the plain text password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

    // Construct the JWT payload
    const payload = {
      id: user._id,
      role: user.role
    };

    // Sign the token (expires in 24 hours)
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login.' });
  }
});

  // 4. FETCH ALL USERS 
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    
    const tableData = users.map(u => ({
      id: u._id,
      name: u.personal?.firstName ? `${u.personal.firstName} ${u.personal.lastName}` : 'Pending Name',
      email: u.email,
      role: u.role,
      subRole: u.teamRole,
      status: u.status,
      date: new Date(u.createdAt).toLocaleDateString('en-GB'),
      avatar: `https://ui-avatars.com/api/?name=${u.email}&background=1f1f1f&color=fff`
    }));

    res.status(200).json(tableData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});



// ADMIN ONLY ROUTES
  // FETCH SINGLE USER PROFILE 
app.get('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Send back the raw data without the password hash
    const { password, ...safeUserData } = user;
    res.status(200).json(safeUserData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
});

  // DELETE A BENEFICIARY (Admin Only)
app.delete('/api/beneficiaries/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const deletedRecord = await Beneficiary.findByIdAndDelete(req.params.id);
    if (!deletedRecord) return res.status(404).json({ error: 'Record not found' });
    
    res.status(200).json({ message: 'Beneficiary deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});



// DASHBOARD METRICS
app.get('/api/metrics', verifyToken, async (req, res) => {
  try {
    // Run all database counts simultaneously for super duper crazy fast ultra mega baby cappybara speed
    const [
      beneficiaryCount,
      volunteerCount,
      projectCount,
      teamCount,
      pendingTasks
    ] = await Promise.all([
      Beneficiary.countDocuments(),
      User.countDocuments({ role: 'Volunteer' }),
      Project.countDocuments({ status: 'Active' }),
      Team.countDocuments(),
      Event.countDocuments({ owner: req.user.id, type: 'Task', completed: false })
    ]);

    res.status(200).json({
      beneficiaries: beneficiaryCount,
      volunteers: volunteerCount,
      activeProjects: projectCount,
      teams: teamCount,
      pendingTasks: pendingTasks
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics.' });
  }
});



// BENEFICIARY ROUTES
  // 1. Create new Beneficiary (Triggered by AddBeneficiary.jsx)
app.post('/api/beneficiaries', verifyToken, requireAdmin, async (req, res) => {
  try {
    const data = req.body;

    // Translate the flat frontend state into our nested database schema
    const newBeneficiary = new Beneficiary({
      personal: {
        firstName: data.name,
        lastName: data.surname,
        dob: data.dob
      },
      status: 'Referral', // All new intakes start here by default
      vulnerability: data.disabilityCategory ? 'Moderate' : 'Routine', // Basic baseline logic
      disability: {
        category: data.disabilityCategory,
        name: data.disabilityName,
        notes: data.disabilityNotes
      },
      mobility: {
        equipment: data.mobilityEquipment,
        environment: data.mobilityEnvironment,
        notes: data.mobilityNotes
      },
      medication: {
        drugName: data.medDrugName,
        dose: data.medDose,
        notes: data.medNotes
      },
      dietary: {
        texture: data.dietTexture,
        viscosity: data.dietViscosity,
        supplements: data.dietSupplements,
        notes: data.dietNotes
      },
      allergies: {
        allergens: data.allergens,
        notes: data.allergyNotes
      },
      emergencyContact: {
        name: data.emergencyName,
        phone: data.emergencyPhone,
        email: data.emergencyEmail
      }
    });

    const savedRecord = await newBeneficiary.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Failed to create beneficiary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  // 2. Fetch all Beneficiaries (Used by Dashboard, Analytics, and Data Tables)
app.get('/api/beneficiaries', async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find().sort({ createdAt: -1 }).lean();

    // Map the raw DB data into exactly what the Beneficiaries table expects
    const tableData = beneficiaries.map(b => ({
      id: b._id,
      name: `${b.personal?.firstName || 'Unknown'} ${b.personal?.lastName || ''}`,
      email: b.emergencyContact?.email || 'No email provided',
      need: b.disability?.category || 'General Support',
      subNeed: b.disability?.name || 'Pending assessment',
      status: b.status || 'Referral',
      // Format date (DD/MM/YY)
      date: new Date(b.createdAt).toLocaleDateString('en-GB'),
      // Auto-generate an avatar with their initials
      avatar: `https://ui-avatars.com/api/?name=${b.personal?.firstName}+${b.personal?.lastName}&background=1f1f1f&color=fff`
    }));

    res.status(200).json(tableData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  // 3. Fetch Single Beneficiary by ID
app.get('/api/beneficiaries/:id', async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id).lean();
    if (!beneficiary) {
      return res.status(404).json({ error: 'Beneficiary not found' });
    }
    res.status(200).json(beneficiary);
  } catch (error) {
    console.error('Error fetching beneficiary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// TEAMS & PROJECTS ROUTES
  //TEAMS
  // 1. CREATE A TEAM (Admin Only)
app.post('/api/teams', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, lead, members } = req.body;

    const newTeam = new Team({
      name,
      description,
      lead,
      members
    });

    await newTeam.save();
    res.status(201).json({ message: 'Team created successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team.' });
  }
});

  // 2. FETCH ALL TEAMS (Open to authenticated users)
app.get('/api/teams', verifyToken, async (req, res) => {
  try {
    // .populate() pulls in the specific fields from the linked User documents
    const teams = await Team.find()
      .populate('lead', 'personal.firstName personal.lastName email')
      .populate('members', 'personal.firstName personal.lastName email')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams.' });
  }
});

  // 3. FETCH A SINGLE TEAM BY ID
app.get('/api/teams/:id', verifyToken, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('lead', 'personal.firstName personal.lastName email role')
      .populate('members', 'personal.firstName personal.lastName email role status')
      .lean();

    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team details.' });
  }
});


  // PROJECTS
  // 1. CREATE A PROJECT (Admin Only)
app.post('/api/projects', verifyToken, requireAdmin, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json({ message: 'Project established successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

  // 2. FETCH ALL PROJECTS (Open to authenticated users)
app.get('/api/projects', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('assignedTeams', 'name')
      .populate('targetBeneficiaries', 'personal.firstName personal.lastName status')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});



// CALENDAR & TASKS ROUTES
  // 1. CREATE AN EVENT OR TASK
app.post('/api/events', verifyToken, async (req, res) => {
  try {
    const { title, type, visibility, date } = req.body;

    // Security Check: Only Admins can create Global events
    if (visibility === 'Global' && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only administrators can create global events.' });
    }

    const newEvent = new Event({
      title,
      type,
      visibility,
      date,
      owner: req.user.id
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event.' });
  }
});

  // 2. FETCH EVENTS (With RBAC Filtering)
app.get('/api/events', verifyToken, async (req, res) => {
  try {
    const { targetUserId } = req.query;
    let query = {};

    if (targetUserId) {
      // If an Admin is looking at a specific Volunteer's profile calendar
      if (req.user.role !== 'Admin' && targetUserId !== req.user.id) {
        return res.status(403).json({ error: 'Clearance denied. Admins only.' });
      }
      query.owner = targetUserId;
    } else {
      // Default Dashboard/Calendar query: All Global events + Your Personal events
      query = {
        $or: [
          { visibility: 'Global' },
          { owner: req.user.id }
        ]
      };
    }

    const events = await Event.find(query).sort({ date: 1 }).lean();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

  // 3. TOGGLE TASK COMPLETION
app.put('/api/events/:id/toggle', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Task not found.' });

    // Security Check: Only the owner or an Admin can mark a task complete
    if (event.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Permission denied.' });
    }

    event.completed = !event.completed;
    await event.save();
    
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task.' });
  }
});


// REPORTS & TICKETING ROUTES
  // 1. SUBMIT A NEW REPORT (Open to all authenticated users)
app.post('/api/reports', verifyToken, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    const newReport = new Report({
      title,
      description,
      category,
      submittedBy: req.user.id
    });

    await newReport.save();
    res.status(201).json({ message: 'Report submitted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit report.' });
  }
});

  // 2. FETCH ALL REPORTS (Admin Only)
app.get('/api/reports', verifyToken, requireAdmin, async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('submittedBy', 'personal.firstName personal.lastName email')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
});

  // 3. UPDATE REPORT STATUS (Admin Only)
app.put('/api/reports/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!report) return res.status(404).json({ error: 'Report not found.' });
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update report.' });
  }
});

// Initialise Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ChangeAbility backend listening on port ${PORT}`);
});