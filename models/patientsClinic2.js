import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Patient Schema for Clinical Management
 * Strictly enforces data types and provides defaults to avoid casting errors.
 */
const patientSchema = new Schema(
  {
    // Personal Information
    firstName: { type: String, required: true, trim: true, minlength: 2 },
    lastName: { type: String, required: true, trim: true, minlength: 2 },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: { 
      type: String, 
      enum: ["Male", "Female", "Other"], 
      required: true 
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{7,15}$/, "Phone number must be between 7 and 15 digits."],
    },
    address: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },

    // Health Provider Type
    healthProviderType: {
      type: String,
      enum: ["Public Hospital", "Private Hospital", "MCH", "Clinic", "Health Center"],
      required: true,
    },

    // Medical Information
    medicalHistory: { type: String, default: "", trim: true },
    currentMedications: { type: String, default: "", trim: true },
    allergies: { type: String, default: "", trim: true },
    diagnosis: { type: String, default: "", trim: true },
    physicalExam: { type: String, default: "", trim: true },
    labResults: { type: String, default: "", trim: true },

    // Vaccination Records
    vaccinations: [
      {
        vaccineName: { type: String, default: "", trim: true },
        doseNumber: { type: Number, min: 1, default: 1 },
        dateGiven: { type: Date, default: null },
        administeredBy: { type: String, trim: true, default: "" },
        notes: { type: String, default: "", trim: true },
      },
    ],

    // Treatment Plan
    treatmentPlan: [
      {
        medication: { type: String, default: "", trim: true },
        dosage: { type: String, default: "", trim: true },
        instructions: { type: String, default: "", trim: true },
      },
    ],

    // Global Follow-up
    nextAppointment: { type: Date, default: null }, 
    reason: { type: String, default: "", trim: true },
  },
  { 
    timestamps: true 
  }
);

// Fix: Check for existing model to prevent OverwriteModelError
// We name the variable 'Patient', distinct from the schema 'patientSchema'
const patientsClinic2 = mongoose.models.Patient || mongoose.model("patientclinic2", patientSchema);

export default patientsClinic2;