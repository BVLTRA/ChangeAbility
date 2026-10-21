const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { verifyToken, requireAdmin } = require('./middleware/auth');

const Beneficiary = require('./models/Beneficiary');

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

// 4. FETCH ALL USERS (Admin Only)
app.get('/api/users', verifyToken, requireAdmin, async (req, res) => {
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

// Initialise Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ChangeAbility backend listening on port ${PORT}`);
});