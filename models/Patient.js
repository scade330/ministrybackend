import mongoose from "mongoose";

const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      max: [120, "Age seems invalid"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^\d{7,15}$/, "Phone number must be 7-15 digits"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    medicalHistory: {
      type: String,
      default: "None",
      maxlength: [500, "Medical history must be up to 500 characters"],
    },
  currentMedications: {
      type: String,
      default: "None",
      maxlength: [500, "Medical history must be up to 500 characters"],
    },
   allergies: {
      type: String,
      default: "None",
      maxlength: [500, "Medical history must be up to 500 characters"],
    },
      diagnosis: {
      type: String,
      default: "None",
      maxlength: [500, "Medical history must be up to 500 characters"],
    },


    physicalExam: {
  type: String,
  default: "None",
  maxlength: 500,
},
labResults: {
  type: String,
  default: "None",
  maxlength: 500,
},
treatmentPlan: {
  type: String,
  default: "None",
  maxlength: 500,
},
nextAppointment: {
  type: Date,
  default: null,
},
reason: {
  type: String,
  default: "None",
  maxlength: 500,
},
    
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
