import PatientClinic2 from "../models/patientsClinic2.js";

// -----------------------------
// Register new patient
// -----------------------------
export const registerPatient = async (req, res) => {
  try {
    const patient = new PatientClinic2({
      ...req.body,
      createdBy: req.user?.id,
    });

    await patient.save();
    res.status(201).json({ success: true, patient });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// -----------------------------
// Get all patients
// -----------------------------
export const getAllPatients = async (req, res) => {
  try {
    const patients = await PatientClinic2.find().sort({ createdAt: -1 });
    res.json({ success: true, patients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// -----------------------------
// Get patient by ID
// -----------------------------
export const getPatientById = async (req, res) => {
  try {
    const patient = await PatientClinic2.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found" });
    }
    res.json({ success: true, patient });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// -----------------------------
// Get patient by phone
// -----------------------------
export const getPatientByPhone = async (req, res) => {
  try {
    const { phone } = req.query;
    const patient = await PatientClinic2.findOne({ phone });
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found" });
    }
    res.json({ success: true, patient });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// -----------------------------
// Update patient (general info)
// -----------------------------
export const updatePatient = async (req, res) => {
  try {
    const patient = await PatientClinic2.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user?.id },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found" });
    }

    res.json({ success: true, patient });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// -----------------------------
// Add treatment
// -----------------------------
export const addTreatment = async (req, res) => {
  try {
    const patient = await PatientClinic2.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found" });
    }

    const { medication, dosage = "None", instructions = "None" } = req.body;

    if (!medication || medication.trim() === "") {
      return res.status(400).json({ success: false, error: "Medication is required" });
    }

    patient.treatmentPlan.push({
      medication,
      dosage,
      instructions,
    });

    await patient.save();
    res.json({ success: true, patient });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// -----------------------------
// Remove treatment
// -----------------------------
export const removeTreatment = async (req, res) => {
  try {
    const patient = await PatientClinic2.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found" });
    }

    const index = Number(req.params.index);
    if (isNaN(index) || index < 0 || index >= patient.treatmentPlan.length) {
      return res.status(400).json({ success: false, error: "Invalid treatment index" });
    }

    patient.treatmentPlan.splice(index, 1);
    await patient.save();

    res.json({ success: true, patient });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// -----------------------------
// Add vaccination
// -----------------------------
export const addVaccination = async (req, res) => {
  try {
    const patient = await PatientClinic2.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found" });
    }

    const { vaccineName, doseNumber, dateGiven, administeredBy, notes } = req.body;

    if (!vaccineName || !doseNumber || !dateGiven) {
      return res.status(400).json({
        success: false,
        error: "vaccineName, doseNumber, and dateGiven are required",
      });
    }

    patient.vaccinations.push({
      vaccineName,
      doseNumber,
      dateGiven,
      administeredBy,
      notes,
    });

    await patient.save();
    res.json({ success: true, patient });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// -----------------------------
// Remove vaccination
// -----------------------------
export const removeVaccination = async (req, res) => {
  try {
    const patient = await PatientClinic2.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found" });
    }

    const index = Number(req.params.index);
    if (isNaN(index) || index < 0 || index >= patient.vaccinations.length) {
      return res.status(400).json({ success: false, error: "Invalid vaccination index" });
    }

    patient.vaccinations.splice(index, 1);
    await patient.save();

    res.json({ success: true, patient });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// -----------------------------
// Filter patients by provider type
// -----------------------------
export const getPatientsByProviderType = async (req, res) => {
  try {
    const { type } = req.query;

    const patients = await PatientClinic2.find({
      healthProviderType: type,
    }).sort({ createdAt: -1 });

    res.json({ success: true, patients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// -----------------------------
// Delete patient
// -----------------------------
export const deletePatient = async (req, res) => {
  try {
    const patient = await PatientClinic2.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: "Patient not found" });
    }

    res.json({
      success: true,
      message: "Patient deleted successfully",
      deletedBy: req.user?.id,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
