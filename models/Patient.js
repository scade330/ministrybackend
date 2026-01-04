import mongoose from "mongoose";

const { Schema } = mongoose;

// Main Patient schema
const patientSchema = new Schema(
  {
    // Personal Info
    firstName: { type: String, required: true, trim: true, minlength: 2 },
    lastName: { type: String, required: true, trim: true, minlength: 2 },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: { type: String, required: true, unique: true, match: /^\d{7,15}$/ },
    address: { type: String, required: true, trim: true },

    // Medical Info
    medicalHistory: { type: String, default: "None", maxlength: 1000, trim: true },
    currentMedications: { type: String, default: "None", maxlength: 1000, trim: true },
    allergies: { type: String, default: "None", maxlength: 1000, trim: true },
    diagnosis: { type: String, default: "None", maxlength: 1000, trim: true },
    physicalExam: { type: String, default: "None", maxlength: 1000, trim: true },
    labResults: { type: String, default: "None", maxlength: 1000, trim: true },

    // Unified treatment plan directly in Patient schema
    treatmentPlan: [
      {
        medication: { type: String, required: true, maxlength: 1000, trim: true },
        dosage: { type: String, default: "None", maxlength: 1000, trim: true },
        instructions: { type: String, default: "None", maxlength: 1000, trim: true },
      },
    ],

    nextAppointment: { type: Date, default: null },

    // Reason for next appointment or treatment
    reason: { type: String, default: "None", maxlength: 1000, trim: true },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
