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
patientRouter.post("/create",authenticate ,registerPatient);

// Get all patients
patientRouter.get("/all", authenticate, getAllPatients);







// Search by phone
patientRouter.get("/search",authenticate, getPatientByPhone);

// Get single patient by ID
patientRouter.get("/id/:id",authenticate, getPatientById);

// Update patient
patientRouter.put("/id/:id",authenticate, updatePatient);

// Delete patient
patientRouter.delete("/id/:id", authenticate ,deletePatient);

export default patientRouter;
