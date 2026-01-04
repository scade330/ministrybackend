import Patient from "../models/Patient.js";

// Create new patient
export const registerPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body); // body includes treatmentPlan array and reason
    await patient.save();
    res.status(201).json({ success: true, patient });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json({ success: true, patients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get patient by ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, error: "Patient not found" });
    res.json({ success: true, patient });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get patient by phone
export const getPatientByPhone = async (req, res) => {
  try {
    const { phone } = req.query;
    const patient = await Patient.findOne({ phone });
    if (!patient) return res.status(404).json({ success: false, error: "Patient not found" });
    res.json({ success: true, patient });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update patient (including reason or treatmentPlan)
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // ensures treatmentPlan and reason are validated
    );
    if (!patient) return res.status(404).json({ success: false, error: "Patient not found" });
    res.json({ success: true, patient });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Add a new treatment to patient's treatmentPlan
export const addTreatment = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, error: "Patient not found" });

    patient.treatmentPlan.push(req.body); // body contains medication, dosage, instructions
    await patient.save();

    res.json({ success: true, patient });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Remove a treatment from patient's treatmentPlan by index
export const removeTreatment = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, error: "Patient not found" });

    const index = req.params.index;
    if (index < 0 || index >= patient.treatmentPlan.length) {
      return res.status(400).json({ success: false, error: "Invalid treatment index" });
    }

    patient.treatmentPlan.splice(index, 1);
    await patient.save();

    res.json({ success: true, patient });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ success: false, error: "Patient not found" });
    res.json({ success: true, message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
