require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Beneficiary = require('./models/Beneficiary');
const Team = require('./models/Team');
const Project = require('./models/Project');
const Event = require('./models/Event');
const Report = require('./models/Report');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB. Wiping existing ecosystem...');

    // 1. Clear database
    await Promise.all([
      User.deleteMany(), Beneficiary.deleteMany(), Team.deleteMany(),
      Project.deleteMany(), Event.deleteMany(), Report.deleteMany()
    ]);

    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);
    const volPass = await bcrypt.hash('volunteer123', salt);

    console.log('Injecting Personnel (Admins & Volunteers)...');
    
    // 2. Create Users
    const admin = await User.create({ email: 'admin@changeability.org', password: adminPass, role: 'Admin', status: 'Active', personal: { firstName: 'System', lastName: 'Administrator', phone: '082 123 4567' }, teamRole: 'Administrative' });
    const v1 = await User.create({ email: 'leshen@changeability.org', password: volPass, role: 'Volunteer', status: 'Active', personal: { firstName: 'Leshen', lastName: 'Naidoo', phone: '082 111 2222' }, teamRole: 'Field Activations' });
    const v2 = await User.create({ email: 'anza@changeability.org', password: volPass, role: 'Volunteer', status: 'Active', personal: { firstName: 'Anza', lastName: 'Mosehane', phone: '082 333 4444' }, teamRole: 'Logistics & Transport' });
    const v3 = await User.create({ email: 'phathu@changeability.org', password: volPass, role: 'Volunteer', status: 'Active', personal: { firstName: 'Phathu', lastName: 'Mosehane', phone: '082 555 6666' }, teamRole: 'Medical / Care' });
    const v4 = await User.create({ email: 'christopher@changeability.org', password: volPass, role: 'Volunteer', status: 'Active', personal: { firstName: 'Christopher', lastName: 'Daniels', phone: '082 777 8888' }, teamRole: 'Kitchen / Food Prep' });
    const v5 = await User.create({ email: 'sarah@changeability.org', password: volPass, role: 'Volunteer', status: 'Active', personal: { firstName: 'Sarah', lastName: 'Smit', phone: '071 222 3333' }, teamRole: 'Administrative' });
    const v6 = await User.create({ email: 'kagiso@changeability.org', password: volPass, role: 'Volunteer', status: 'Active', personal: { firstName: 'Kagiso', lastName: 'Dlamini', phone: '073 444 5555' }, teamRole: 'Field Activations' });
    const v7 = await User.create({ email: 'emma@changeability.org', password: volPass, role: 'Volunteer', status: 'Pending', personal: { firstName: 'Emma', lastName: 'Petersen', phone: '081 999 0000' }, teamRole: 'Unassigned' });

    console.log('Injecting 20 Beneficiaries for Chart Analytics...');
    
    // 3. Create Beneficiaries
    const b = await Beneficiary.insertMany([
      { personal: { firstName: 'Thabo', lastName: 'Mokoena' }, status: 'Referral', vulnerability: 'Urgent', address: 'Mamelodi' },
      { personal: { firstName: 'Sarah', lastName: 'Van Der Merwe' }, status: 'Assessed', vulnerability: 'High Need', address: 'Centurion' },
      { personal: { firstName: 'David', lastName: 'Ndlovu' }, status: 'In Support', vulnerability: 'Moderate', address: 'Pretoria CBD' },
      { personal: { firstName: 'Maria', lastName: 'Santos' }, status: 'Assisted', vulnerability: 'Routine', address: 'Akasia' },
      { personal: { firstName: 'Sipho', lastName: 'Nkosi' }, status: 'Closed', vulnerability: 'Routine', address: 'Soshanguve' },
      { personal: { firstName: 'Lerato', lastName: 'Molefe' }, status: 'In Support', vulnerability: 'High Need', address: 'Midrand' },
      { personal: { firstName: 'Johannes', lastName: 'Botha' }, status: 'Referral', vulnerability: 'Moderate', address: 'Menlyn' },
      { personal: { firstName: 'Amina', lastName: 'Patel' }, status: 'Assessed', vulnerability: 'Routine', address: 'Laudium' },
      { personal: { firstName: 'Pieter', lastName: 'Oosthuizen' }, status: 'In Support', vulnerability: 'Moderate', address: 'Montana' },
      { personal: { firstName: 'Grace', lastName: 'Mabena' }, status: 'Assisted', vulnerability: 'High Need', address: 'Atteridgeville' },
      { personal: { firstName: 'Simon', lastName: 'Khumalo' }, status: 'Closed', vulnerability: 'Routine', address: 'Mamelodi East' },
      { personal: { firstName: 'Buhle', lastName: 'Zungu' }, status: 'Referral', vulnerability: 'Urgent', address: 'Sunnyside' },
      { personal: { firstName: 'Johan', lastName: 'De Klerk' }, status: 'Assessed', vulnerability: 'Moderate', address: 'Brooklyn' },
      { personal: { firstName: 'Precious', lastName: 'Baloyi' }, status: 'In Support', vulnerability: 'High Need', address: 'Hatfield' },
      { personal: { firstName: 'Tshepo', lastName: 'Moruti' }, status: 'Assisted', vulnerability: 'Routine', address: 'Soshanguve South' },
      { personal: { firstName: 'Nadia', lastName: 'Hassan' }, status: 'Closed', vulnerability: 'Moderate', address: 'Erasmia' },
      { personal: { firstName: 'Willem', lastName: 'Nel' }, status: 'Referral', vulnerability: 'Urgent', address: 'Garsfontein' },
      { personal: { firstName: 'Lindiwe', lastName: 'Mthethwa' }, status: 'In Support', vulnerability: 'Routine', address: 'Pretoria West' },
      { personal: { firstName: 'Zandile', lastName: 'Nhlapo' }, status: 'Assessed', vulnerability: 'High Need', address: 'Eersterust' },
      { personal: { firstName: 'Kevin', lastName: 'Naidoo' }, status: 'Assisted', vulnerability: 'Moderate', address: 'Centurion' }
    ]);

    console.log('Injecting Operational Teams...');
    
    // 4. Create Teams
    const tLogistics = await Team.create({ name: 'Logistics & Transport', description: 'Handles physical transport of goods, fleet maintenance, and field mobility.', lead: v2._id, members: [v2._id, v6._id] });
    const tMedical = await Team.create({ name: 'Care & Medical Response', description: 'On-the-ground counseling, medical checks, and elderly support.', lead: v3._id, members: [v3._id, v1._id] });
    const tKitchen = await Team.create({ name: 'Central Kitchen Ops', description: 'Mass food preparation, packaging, and nutritional planning.', lead: v4._id, members: [v4._id] });
    const tAdmin = await Team.create({ name: 'Intake & Administration', description: 'Beneficiary onboarding, data verification, and reporting.', lead: admin._id, members: [admin._id, v5._id] });

    console.log('Injecting Strategic Projects...');
    
    // 5. Create Projects
    await Project.create({ title: 'Winter Thermal Drive', description: 'City-wide distribution of thermal blankets and non-perishables.', status: 'Active', assignedTeams: [tLogistics._id, tKitchen._id], targetBeneficiaries: [b[0]._id, b[2]._id, b[5]._id, b[11]._id] });
    await Project.create({ title: 'Elderly Wellness Checkups', description: 'Routine medical assessments and home repair interventions for seniors.', status: 'Active', assignedTeams: [tMedical._id], targetBeneficiaries: [b[1]._id, b[3]._id, b[9]._id, b[18]._id] });
    await Project.create({ title: 'Youth Back-to-School', description: 'Providing uniforms and stationery to vulnerable students.', status: 'Planning', assignedTeams: [tAdmin._id, tLogistics._id], targetBeneficiaries: [b[6]._id, b[8]._id, b[12]._id] });
    await Project.create({ title: 'Disaster Relief: Flood Response', description: 'Emergency housing and food parcels for flood victims in Mamelodi.', status: 'Completed', assignedTeams: [tLogistics._id, tMedical._id, tKitchen._id], targetBeneficiaries: [b[10]._id, b[14]._id, b[15]._id] });

    console.log('Injecting 30 Calendar Events & Tasks...');
    
    // 6. Create Calendar Events (Heavy population for the grid)
    const today = new Date();
    const day = 86400000; // Milliseconds in a day

    await Event.insertMany([
      // --- Personal Tasks for Admin (Dashboard Checklist) ---
      { title: 'Approve pending volunteer account (Emma)', type: 'Task', visibility: 'Personal', date: new Date(today.getTime() + day * 1), owner: admin._id, completed: false },
      { title: 'Review Q3 Analytics Export', type: 'Task', visibility: 'Personal', date: new Date(today.getTime() + day * 2), owner: admin._id, completed: false },
      { title: 'Call fleet mechanic regarding van brakes', type: 'Task', visibility: 'Personal', date: new Date(today.getTime() - day * 1), owner: admin._id, completed: true },
      { title: 'Update medical intake forms', type: 'Task', visibility: 'Personal', date: new Date(today.getTime() + day * 4), owner: admin._id, completed: false },
      { title: 'Order printer ink for Admin office', type: 'Task', visibility: 'Personal', date: new Date(today.getTime() - day * 3), owner: admin._id, completed: true },
      
      // --- Global Calendar Meetings & Events (Past, Present, Future) ---
      { title: 'Monthly Strategy Sync', type: 'Meeting', visibility: 'Global', date: new Date(today.getTime() - day * 10), owner: admin._id },
      { title: 'First Aid Refresher Course', type: 'Event', visibility: 'Global', date: new Date(today.getTime() - day * 7), owner: v3._id },
      { title: 'Kitchen Deep Clean', type: 'Event', visibility: 'Global', date: new Date(today.getTime() - day * 5), owner: v4._id },
      { title: 'Logistics Route Planning', type: 'Meeting', visibility: 'Global', date: new Date(today.getTime() - day * 2), owner: v2._id },
      { title: 'All-Hands Briefing', type: 'Meeting', visibility: 'Global', date: new Date(today.getTime() + day * 1), owner: admin._id },
      { title: 'Mamelodi Food Drop', type: 'Event', visibility: 'Global', date: new Date(today.getTime() + day * 2), owner: v2._id },
      { title: 'Centurion Medical Checks', type: 'Event', visibility: 'Global', date: new Date(today.getTime() + day * 3), owner: v3._id },
      { title: 'Volunteer Onboarding', type: 'Meeting', visibility: 'Global', date: new Date(today.getTime() + day * 5), owner: v5._id },
      { title: 'Supplier Negotiation', type: 'Meeting', visibility: 'Global', date: new Date(today.getTime() + day * 6), owner: admin._id },
      { title: 'Soshanguve Outreach', type: 'Event', visibility: 'Global', date: new Date(today.getTime() + day * 8), owner: v1._id },
      { title: 'Database Audit', type: 'Event', visibility: 'Global', date: new Date(today.getTime() + day * 10), owner: admin._id },
      { title: 'Mid-Month Review', type: 'Meeting', visibility: 'Global', date: new Date(today.getTime() + day * 14), owner: admin._id },
      { title: 'Winter Drive Kickoff', type: 'Event', visibility: 'Global', date: new Date(today.getTime() + day * 16), owner: v6._id },
      { title: 'Kitchen Inventory Count', type: 'Event', visibility: 'Global', date: new Date(today.getTime() + day * 18), owner: v4._id },
      { title: 'Board of Directors Update', type: 'Meeting', visibility: 'Global', date: new Date(today.getTime() + day * 21), owner: admin._id },
      { title: 'Pretoria CBD Distribution', type: 'Event', visibility: 'Global', date: new Date(today.getTime() + day * 23), owner: v1._id },
      { title: 'Fleet Inspection', type: 'Event', visibility: 'Global', date: new Date(today.getTime() + day * 25), owner: v2._id },
      
      // --- Personal Tasks for Volunteers (Proving DB structure works) ---
      { title: 'Submit fuel receipts', type: 'Task', visibility: 'Personal', date: today, owner: v2._id, completed: false },
      { title: 'Restock bandages', type: 'Task', visibility: 'Personal', date: today, owner: v3._id, completed: false },
    ]);

    console.log('Injecting Operational Reports...');
    
    // 7. Create Reports (Issue Explorer)
    await Report.insertMany([
      { title: 'Delivery van requires brake pad replacement', description: 'The primary delivery van (Reg: XYZ 123 GP) is squeaking heavily. Needs new brake pads before the winter drive.', category: 'Team Issue', status: 'Open', submittedBy: v2._id, createdAt: new Date(today.getTime() - day * 1) },
      { title: 'Address discrepancy for David Ndlovu', description: 'Beneficiary moved from Pretoria CBD to Sunnyside, please update the master records.', category: 'Beneficiary Data', status: 'Open', submittedBy: v1._id, createdAt: new Date(today.getTime() - day * 2) },
      { title: 'Shortage of medical supplies', category: 'Project Issue', description: 'We are running low on basic first aid kits (bandages, antiseptics) for the upcoming wellness checkups.', status: 'In Review', submittedBy: v3._id, createdAt: new Date(today.getTime() - day * 3) },
      { title: 'Duplicate entry for Sarah Van Der Merwe', category: 'Beneficiary Data', description: 'There seem to be two files for Sarah in the system. Need to merge them.', status: 'Open', submittedBy: v5._id, createdAt: new Date(today.getTime() - day * 4) },
      { title: 'Freezer temperature fluctuating', category: 'General / Other', description: 'The chest freezer in the central kitchen keeps dropping to -2C instead of -18C.', status: 'Resolved', submittedBy: v4._id, createdAt: new Date(today.getTime() - day * 5) },
      { title: 'Additional volunteers needed for Mamelodi', category: 'Project Issue', description: 'The upcoming food drop requires at least 3 more people for crowd control.', status: 'Open', submittedBy: v6._id, createdAt: today },
    ]);

    console.log('\n=======================================');
    console.log('         ✅ SEEDING COMPLETE ✅        ');
    console.log('=======================================');
    console.log('ADMIN ACCOUNT:');
    console.log('Email: admin@changeability.org');
    console.log('Pass:  admin123\n');
    console.log('VOLUNTEER ACCOUNTS (Password for all is "volunteer123"):');
    console.log('- leshen@changeability.org');
    console.log('- anza@changeability.org');
    console.log('- phathu@changeability.org');
    console.log('- christopher@changeability.org');
    console.log('- sarah@changeability.org');
    console.log('- kagiso@changeability.org');
    console.log('=======================================\n');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();