const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

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

// 1. Create new Beneficiary (Triggered by AddBeneficiary.jsx)
app.post('/api/beneficiaries', async (req, res) => {
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