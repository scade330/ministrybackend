import Patient from "../models/Patient.js";

// Create a patient (already exists)
export const registerPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save(); // Mongoose will validate automatically

    res.status(201).json({
      message: "Patient registered successfully",
      patient,
    });
  } catch (error) {
    // Send clean error messages
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages });
    }

    if (error.code === 11000) {
      // duplicate key (e.g., phone)
      return res.status(400).json({ error: "Phone number already exists" });
    }

    res.status(500).json({ error: "Server error" });
  }
};


// Get all patients (already exists)
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json({
      message: "Patients fetched successfully",
      patients,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single patient by ID
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update patient by ID
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the patient first
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // List all fields you want to allow updating
    const allowedFields = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "phone",
  "address",
  "medicalHistory",
  "currentMedications",
  "allergies",
  "diagnosis",
  "physicalExam",
  "labResults",
  "treatmentPlan",
  "nextAppointment", // <--- added
  "reason",          // <--- added
];

    // Update fields if provided in request body
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field];
      }
    });

    // Save with validation
    await patient.save();

    res.status(200).json({
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    // Validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages });
    }

    if (error.code === 11000) {
      return res.status(400).json({ error: "Phone number already exists" });
    }

    res.status(500).json({ error: "Server error" });
  }
};



// Delete patient by ID
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search patient by phone number
export const getPatientByPhone = async (req, res) => {
  try {
    const { phone } = req.query; // get phone from query string
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    const patient = await Patient.findOne({ phone });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
