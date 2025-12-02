import express from "express";
import {
  registerPatient,
  getAllPatients,
  getPatientById,
  getPatientByPhone,
  updatePatient,
  deletePatient
} from "../controller/patientController.js";
import { authenticate } from "../middleware/authMiddleware.js";


const patientRouter = express.Router();
// Register a new patient
patientRouter.post("/create",registerPatient);

// Get all patients
patientRouter.get("/all", getAllPatients);







// Search by phone
patientRouter.get("/search", getPatientByPhone);

// Get single patient by ID
patientRouter.get("/id/:id", getPatientById);

// Update patient
patientRouter.put("/id/:id", updatePatient);

// Delete patient
patientRouter.delete("/id/:id" ,deletePatient);

export default patientRouter;
