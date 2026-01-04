import express from "express";
import {
  registerPatient,
  getAllPatients,
  getPatientById,
  getPatientByPhone,
  updatePatient,
  deletePatient,
  addTreatment,
  removeTreatment,
} from "../controller/patientController.js";

const patientRoutes = express.Router();

// Create new patient
patientRoutes.post("/", registerPatient);

// Get all patients
patientRoutes.get("/", getAllPatients);

// Get patient by phone (query param ?phone=123456789) -> must be **before /:id**
patientRoutes.get("/search/by-phone", getPatientByPhone);

// Get patient by ID
patientRoutes.get("/:id", getPatientById);

// Update patient (including reason or entire treatmentPlan)
patientRoutes.put("/:id", updatePatient);

// Delete patient
patientRoutes.delete("/:id", deletePatient);

// Add treatment to patient's treatmentPlan
patientRoutes.post("/:id/treatment", addTreatment);

// Remove treatment from patient's treatmentPlan by index
patientRoutes.delete("/:id/treatment/:index", removeTreatment);

export default patientRoutes;
