import mongoose from "mongoose";

const patientClinic3Schema = new mongoose.Schema(
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

export default mongoose.model(
  "PatientClinic3",
  patientClinic3Schema,
  "patientclinic3"
);
