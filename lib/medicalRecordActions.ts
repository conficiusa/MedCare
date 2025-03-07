// "use server";
// import { IMedicalRecord, IMedicalReport, ErrorReturn, SuccessReturn } from "./definitions";
// import MedicalRecord from "@/models/medicalRecords";
// import mongoose from "mongoose";
// import { auth } from "@/auth";
// import User from "@/models/User";
// import connectToDatabase from "./mongoose";

// // Connect to the database
// async function ensureDbConnection() {
//   try {
//     await connectToDatabase();
//   } catch (error) {
//     console.error("Database connection error:", error);
//     throw error;
//   }
// }

// // Utility to verify the current user can access/modify this record
// async function verifyAccess(
//   recordId: string | null,
//   patientId: string | null,
//   requiredRole: "doctor" | "patient" | "any"
// ): Promise<{ authorized: boolean; errorReturn?: ErrorReturn }> {
//   const session = await auth();
  
//   if (!session || !session.user) {
//     return {
//       authorized: false,
//       errorReturn: {
//         error: "Unauthorized",
//         message: "You must be logged in to access medical records",
//         status: "fail",
//         statusCode: 401,
//         type: "Authentication Error",
//       },
//     };
//   }

//   const currentUserId = session.user.id;
//   const user = await User.findById(currentUserId);
  
//   if (!user) {
//     return {
//       authorized: false,
//       errorReturn: {
//         error: "User not found",
//         message: "Your user profile could not be found",
//         status: "fail",
//         statusCode: 404,
//         type: "Not Found",
//       },
//     };
//   }

//   // For record creation, we just check the role
//   if (!recordId) {
//     if (requiredRole !== "any" && user.role !== requiredRole) {
//       return {
//         authorized: false,
//         errorReturn: {
//           error: "Forbidden",
//           message: `Only ${requiredRole}s can perform this action`,
//           status: "fail",
//           statusCode: 403,
//           type: "Authorization Error",
//         },
//       };
//     }
//     return { authorized: true };
//   }

//   // For existing records, check if the user has access to this specific record
//   try {
//     const record = await MedicalRecord.findById(recordId);
    
//     if (!record) {
//       return {
//         authorized: false,
//         errorReturn: {
//           error: "Record not found",
//           message: "The requested medical record could not be found",
//           status: "fail",
//           statusCode: 404,
//           type: "Not Found",
//         },
//       };
//     }

//     const isDoctor = user.role === "doctor" && record.doctorId.toString() === currentUserId;
//     const isPatient = user.role === "patient" && record.patientId.toString() === currentUserId;
    
//     if ((requiredRole === "doctor" && !isDoctor) || 
//         (requiredRole === "patient" && !isPatient) || 
//         (requiredRole === "any" && !isDoctor && !isPatient)) {
//       return {
//         authorized: false,
//         errorReturn: {
//           error: "Forbidden",
//           message: "You don't have permission to access this record",
//           status: "fail",
//           statusCode: 403,
//           type: "Authorization Error",
//         },
//       };
//     }
    
//     return { authorized: true };
//   } catch (error) {
//     console.error("Error verifying record access:", error);
//     return {
//       authorized: false,
//       errorReturn: {
//         error: "Server Error",
//         message: "Failed to verify access to the medical record",
//         status: "fail",
//         statusCode: 500,
//         type: "Server Error",
//       },
//     };
//   }
// }

// /**
//  * Create a new medical record for a patient
//  */
// export async function createMedicalRecord(
//   patientId: string,
//   doctorId: string,
//   appointmentId?: string,
//   initialData?: {
//     conditions?: string[];
//     medicalHistory?: string;
//   }
// ): Promise<ErrorReturn | SuccessReturn> {
//   try {
//     await ensureDbConnection();
    
//     // Verify doctor's access
//     const { authorized, errorReturn } = await verifyAccess(null, patientId, "doctor");
//     if (!authorized) return errorReturn!;

//     // Check if patient exists
//     const patient = await User.findById(patientId);
//     if (!patient || patient.role !== "patient") {
//       return {
//         error: "Patient not found",
//         message: "The specified patient could not be found",
//         status: "fail",
//         statusCode: 404,
//         type: "Not Found",
//       };
//     }

//     // Create new medical record
//     const medicalRecord = new MedicalRecord({
//       patientId,
//       doctorId,
//       appointmentId,
//       conditions: initialData?.conditions || patient.patientInfo?.conditions || [],
//       medicalHistory: initialData?.medicalHistory || patient.patientInfo?.medicalHistory || "",
//       reports: [],
//     });

//     await medicalRecord.save();

//     return {
//       status: "success",
//       message: "Medical record created successfully",
//       statusCode: 201,
//       data: medicalRecord,
//     };
//   } catch (error) {
//     console.error("Error creating medical record:", error);
//     return {
//       error,
//       message: "Failed to create medical record",
//       status: "fail",
//       statusCode: 500,
//       type: "Server Error",
//     };
//   }
// }

// /**
//  * Get a medical record by ID
//  */
// export async function getMedicalRecord(recordId: string): Promise<ErrorReturn | SuccessReturn> {
//   try {
//     await ensureDbConnection();
    
//     // Verify access (both patient and doctor can access)
//     const { authorized, errorReturn } = await verifyAccess(recordId, null, "any");
//     if (!authorized) return errorReturn!;

//     const medicalRecord = await MedicalRecord.findById(recordId);
    
//     if (!medicalRecord) {
//       return {
//         error: "Record not found",
//         message: "The requested medical record could not be found",
//         status: "fail",
//         statusCode: 404,
//         type: "Not Found",
//       };
//     }

//     return {
//       status: "success",
//       message: "Medical record retrieved successfully",
//       statusCode: 200,
//       data: medicalRecord,
//     };
//   } catch (error) {
//     console.error("Error retrieving medical record:", error);
//     return {
//       error,
//       message: "Failed to retrieve medical record",
//       status: "fail",
//       statusCode: 500,
//       type: "Server Error",
//     };
//   }
// }

// /**
//  * Get all medical records for a patient
//  */
// export async function getPatientMedicalRecords(patientId: string): Promise<ErrorReturn | SuccessReturn> {
//   try {
//     await ensureDbConnection();
    
//     // Verify access
//     const session = await auth();
//     if (!session || !session.user) {
//       return {
//         error: "Unauthorized",
//         message: "You must be logged in to access medical records",
//         status: "fail",
//         statusCode: 401,
//         type: "Authentication Error",
//       };
//     }

//     const currentUserId = session.user.id;
//     const user = await User.findById(currentUserId);
    
//     // Only the patient themselves or a doctor who has created records for this patient can access
//     if (!user || (user.role !== "doctor" && currentUserId !== patientId)) {
//       return {
//         error: "Forbidden",
//         message: "You don't have permission to access these records",
//         status: "fail",
//         statusCode: 403,
//         type: "Authorization Error",
//       };
//     }

//     // If doctor, fetch only records created by this doctor
//     const query = user.role === "doctor" 
//       ? { patientId, doctorId: currentUserId } 
//       : { patientId };
      
//     const records = await MedicalRecord.find(query)
//       .sort({ createdAt: -1 })
//       .populate("doctorId", "name email image")
//       .populate("appointmentId");

//     return {
//       status: "success",
//       message: "Medical records retrieved successfully",
//       statusCode: 200,
//       data: records,
//     };
//   } catch (error) {
//     console.error("Error retrieving patient medical records:", error);
//     return {
//       error,
//       message: "Failed to retrieve medical records",
//       status: "fail",
//       statusCode: 500,
//       type: "Server Error",
//     };
//   }
// }

// /**
//  * Get all medical records where the current user is the doctor
//  */
// export async function getDoctorMedicalRecords(): Promise<ErrorReturn | SuccessReturn> {
//   try {
//     await ensureDbConnection();
    
//     const session = await auth();
//     if (!session || !session.user) {
//       return {
//         error: "Unauthorized",
//         message: "You must be logged in to access medical records",
//         status: "fail",
//         statusCode: 401,
//         type: "Authentication Error",
//       };
//     }

//     const doctorId = session.user.id;
//     const user = await User.findById(doctorId);
    
//     if (!user || user.role !== "doctor") {
//       return {
//         error: "Forbidden",
//         message: "Only doctors can access this function",
//         status: "fail",
//         statusCode: 403,
//         type: "Authorization Error",
//       };
//     }

//     const records = await MedicalRecord.find({ doctorId })
//       .sort({ updatedAt: -1 })
//       .populate("patientId", "name email image")
//       .populate("appointmentId");

//     return {
//       status: "success",
//       message: "Medical records retrieved successfully",
//       statusCode: 200,
//       data: records,
//     };
//   } catch (error) {
//     console.error("Error retrieving doctor medical records:", error);
//     return {
//       error,
//       message: "Failed to retrieve medical records",
//       status: "fail",
//       statusCode: 500,
//       type: "Server Error",
//     };
//   }
// }

// /**
//  * Add a consultation report to an existing medical record
//  */
// export async function addConsultationReport(
//   recordId: string,
//   reportData: Omit<IMedicalReport, "reportId" | "date">
// ): Promise<ErrorReturn | SuccessReturn> {
//   try {
//     await ensureDbConnection();
    
//     // Verify doctor's access to this record
//     const { authorized, errorReturn } = await verifyAccess(recordId, null, "doctor");
//     if (!authorized) return errorReturn!;

//     // Generate a new report ID
//     const reportId = new mongoose.Types.ObjectId().toString();
    
//     // Add the report to the medical record
//     const updatedRecord = await MedicalRecord.findByIdAndUpdate(
//       recordId,
//       { 
//         $push: { 
//           reports: {
//             ...reportData,
//             reportId,
//             date: new Date()
//           } 
//         } 
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedRecord) {
//       return {
//         error: "Record not found",
//         message: "The medical record could not be found",
//         status: "fail",
//         statusCode: 404,
//         type: "Not Found",
//       };
//     }

//     return {
//       status: "success",
//       message: "Consultation report added successfully",
//       statusCode: 200,
//       data: updatedRecord,
//     };
//   } catch (error) {
//     console.error("Error adding consultation report:", error);
//     return {
//       error,
//       message: "Failed to add consultation report",
//       status: "fail",
//       statusCode: 500,
//       type: "Server Error",
//     };
//   }
// }

// /**
//  * Update a specific consultation report in a medical record
//  */
// export async function updateConsultationReport(
//   recordId: string,
//   reportId: string,
//   updatedData: Partial<IMedicalReport>
// ): Promise<ErrorReturn | SuccessReturn> {
//   try {
//     await ensureDbConnection();
    
//     // Verify doctor's access to this record
//     const { authorized, errorReturn } = await verifyAccess(recordId, null, "doctor");
//     if (!authorized) return errorReturn!;

//     // Create an update object with dot notation for the specific report
//     const updateObj: Record<string, any> = {};
    
//     // Prevent updating reportId or date fields
//     delete updatedData.reportId;
//     delete updatedData.date;
    
//     // Create update path for each field
//     Object.entries(updatedData).forEach(([key, value]) => {
//       updateObj[`reports.$.${key}`] = value;
//     });

//     const updatedRecord = await MedicalRecord.findOneAndUpdate(
//       { _id: recordId, "reports.reportId": reportId },
//       { $set: updateObj },
//       { new: true, runValidators: true }
//     );

//     if (!updatedRecord) {
//       return {
//         error: "Report not found",
//         message: "The specified report could not be found",
//         status: "fail",
//         statusCode: 404,
//         type: "Not Found",
//       };
//     }

//     return {
//       status: "success",
//       message: "Consultation report updated successfully",
//       statusCode: 200,
//       data: updatedRecord,
//     };
//   } catch (error) {
//     console.error("Error updating consultation report:", error);
//     return {
//       error,
//       message: "Failed to update consultation report",
//       status: "fail",
//       statusCode: 500,
//       type: "Server Error",
//     };
//   }
// }

// /**
//  * Update the basic information of a medical record (conditions, medical history)
//  */
// export async function updateMedicalRecordBasicInfo(
//   recordId: string,
//   updatedData: {
//     conditions?: string[];
//     medicalHistory?: string;
//   }
// ): Promise<ErrorReturn | SuccessReturn> {
//   try {
//     await ensureDbConnection();
    
//     // Both doctor and patient can update basic info
//     const { authorized, errorReturn } = await verifyAccess(recordId, null, "any");
//     if (!authorized) return errorReturn!;

//     const updatedRecord = await MedicalRecord.findByIdAndUpdate(
//       recordId,
//       { $set: updatedData },
//       { new: true, runValidators: true }
//     );

//     if (!updatedRecord) {
//       return {
//         error: "Record not found",
//         message: "The medical record could not be found",
//         status: "fail",
//         statusCode: 404,
//         type: "Not Found",
//       };
//     }

//     return {
//       status: "success",
//       message: "Medical record updated successfully",
//       statusCode: 200,
//       data: updatedRecord,
//     };
//   } catch (error) {
//     console.error("Error updating medical record:", error);
//     return {
//       error,
//       message: "Failed to update medical record",
//       status: "fail",
//       statusCode: 500,
//       type: "Server Error",
//     };
//   }
// }

// /**
//  * Get a specific consultation report from a medical record
//  */
// export async function getConsultationReport(
//   recordId: string,
//   reportId: string
// ): Promise<ErrorReturn | SuccessReturn> {
//   try {
//     await ensureDbConnection();
    
//     // Both doctor and patient can view reports
//     const { authorized, errorReturn } = await verifyAccess(recordId, null, "any");
//     if (!authorized) return errorReturn!;

//     const record = await MedicalRecord.findById(recordId);
    
//     if (!record) {
//       return {
//         error: "Record not found",
//         message: "The medical record could not be found",
//         status: "fail",
//         statusCode: 404,
//         type: "Not Found",
//       };
//     }

//     const report = record.reports.find(r => r.reportId === reportId);
    
//     if (!report) {
//       return {
//         error: "Report not found",
//         message: "The consultation report could not be found",
//         status: "fail",
//         statusCode: 404,
//         type: "Not Found",
//       };
//     }

//     return {
//       status: "success",
//       message: "Consultation report retrieved successfully",
//       statusCode: 200,
//       data: report,
//     };
//   } catch (error) {
//     console.error("Error retrieving consultation report:", error);
//     return {
//       error,
//       message: "Failed to retrieve consultation report",
//       status: "fail",
//       statusCode: 500,
//       type: "Server Error",
//     };
//   }
// }

// /**
//  * Search through a patient's medical records with query filtering
//  */
// export async function searchPatientMedicalRecords(
//   patientId: string,
//   searchParams: {
//     diagnosis?: string;
//     dateFrom?: Date;
//     dateTo?: Date;
//     doctorId?: string;
//   }
// ): Promise<ErrorReturn | SuccessReturn> {
//   try {
//     await ensureDbConnection();
    
//     // Verify access
//     const session = await auth();
//     if (!session || !session.user) {
//       return {
//         error: "Unauthorized",
//         message: "You must be logged in to search medical records",
//         status: "fail",
//         statusCode: 401,
//         type: "Authentication Error",
//       };
//     }

//     const currentUserId = session.user.id;
//     const user = await User.findById(currentUserId);
    
//     // Only the patient themselves or their doctors can search
//     if (!user || (user.role !== "doctor" && currentUserId !== patientId)) {
//       return {
//         error: "Forbidden",
//         message: "You don't have permission to search these records",
//         status: "fail",
//         statusCode: 403,
//         type: "Authorization Error",
//       };
//     }

//     // Build search query
//     const query: Record<string, any> = { patientId };
    
//     // If doctor is searching, restrict to their own records
//     if (user.role === "doctor" && currentUserId !== searchParams.doctorId) {
//       query.doctorId = currentUserId;
//     } else if (searchParams.doctorId) {
//       query.doctorId = searchParams.doctorId;
//     }
    
//     // Filter by date range if provided
//     if (searchParams.dateFrom || searchParams.dateTo) {
//       query["reports.date"] = {};
      
//       if (searchParams.dateFrom) {
//         query["reports.date"].$gte = searchParams.dateFrom;
//       }
      
//       if (searchParams.dateTo) {
//         query["reports.date"].$lte = searchParams.dateTo;
//       }
//     }
    
//     // Search by diagnosis if provided
//     if (searchParams.diagnosis) {
//       query["reports.diagnosis"] = { 
//         $regex: searchParams.diagnosis, 
//         $options: "i" 
//       };
//     }

//     // Execute the search
//     const records = await MedicalRecord.find(query)
//       .sort({ updatedAt: -1 })
//       .populate("doctorId", "name email image")
//       .populate("patientId", "name email image")
//       .populate("appointmentId");

//     return {
//       status: "success",
//       message: "Medical records search completed successfully",
//       statusCode: 200,
//       data: records,
//     };
//   } catch (error) {
//     console.error("Error searching medical records:", error);
//     return {
//       error,
//       message: "Failed to search medical records",
//       status: "fail",
//       statusCode: 500,
//       type: "Server Error",
//     };
//   }
// }