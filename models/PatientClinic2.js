import mongoose from "mongoose";

const patientClinic2Schema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    age: Number,
    gender: String,
    phone: String,
    address: String,
    diagnosis: String,
  },
  { timestamps: true }
);

// Explicit collection name
export default mongoose.model(
  "PatientClinic2",
  patientClinic2Schema,
  "patientclinic2"
);
