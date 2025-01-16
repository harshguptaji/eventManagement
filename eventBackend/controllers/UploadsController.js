import csv from "csvtojson";
import User from "../models/userModel.js";

// export const uploadUser = async (req, res) => {
//     try {
//         const errors = []; // To hold validation errors
//         const insertedRecords = []; // To hold successfully inserted records

//         // Parse the CSV file
//         csv()
//             .fromFile(req.file.path)
//             .then(async (response) => {
//                 console.log(response);

//                 for (const record of response) {
//                     const { registrationId, name, number, brandName, batchName, adminName, createdTimestamp, updatedTimestamp } = record;

//                     // Validate required fields
//                     if (!registrationId || !name || !number || !brandName || !batchName || !adminName) {
//                         errors.push({
//                             registrationId: registrationId || "N/A",
//                             message: "Missing required fields in the record.",
//                         });
//                         continue; // Skip this record
//                     }

//                     // Check if `registrationId` is already in the database
//                     const existingUser = await User.findOne({ registrationId });
//                     if (existingUser) {
//                         errors.push({
//                             registrationId,
//                             message: `Registration ID '${registrationId}' already exists.`,
//                         });
//                         continue; // Skip this record if duplicate found
//                     }

//                     // Prepare new user object
//                     const newUser = new User({
//                         registrationId,
//                         name,
//                         number: parseInt(number, 10), // Ensure number is stored as an integer
//                         brandName,
//                         batchName,
//                         workflow: registrationId, // Assuming `registrationId` as the workflow
//                         createdBy: adminName,
//                         updatedBy: adminName,
//                         createdTimestamp: createdTimestamp || Date.now(), // Use current timestamp if not provided
//                         updatedTimestamp: updatedTimestamp || Date.now(),
//                     });

//                     try {
//                         // Save the user
//                         await newUser.save();
//                         insertedRecords.push({
//                             registrationId,
//                             message: "Successfully inserted.",
//                         });
//                     } catch (error) {
//                         // Handle duplicate key error and other database errors
//                         if (error.code === 11000) {
//                             errors.push({
//                                 registrationId,
//                                 message: `Duplicate key error: Registration ID '${registrationId}' already exists.`,
//                             });
//                         } else {
//                             errors.push({
//                                 registrationId,
//                                 message: `Error inserting data: ${error.message}`,
//                             });
//                         }
//                     }
//                 }

//                 // Prepare the response
//                 if (errors.length > 0) {
//                     return res.status(400).send({
//                         status: 400,
//                         success: false,
//                         validationErrors: errors,
//                     });
//                 }

//                 return res.status(200).send({
//                     status: 200,
//                     success: true,
//                     insertedRecords,
//                     message: "All records were successfully inserted.",
//                 });
//             })
//             .catch((err) => {
//                 // Handle errors while reading the CSV file
//                 return res.status(400).send({
//                     status: 400,
//                     success: false,
//                     message: `Error reading CSV file: ${err.message}`,
//                 });
//             });
//     } catch (error) {
//         // Handle unexpected errors
//         return res.status(500).send({
//             status: 500,
//             success: false,
//             message: `Internal Server Error: ${error.message}`,
//         });
//     }
// };

// export const uploadUser = async(req,res) => {
//     try {
//         var userData = [];
//         csv()
//         .fromFile(req.file.path)
//         .then( async (response) => {
//             console.log(response)

//             for(var x=0; x<response.length; x++){
//                 userData.push({
//                     name: response[x].name,
//                     number: response[x].number,
//                     registrationId: response[x].registrationId,
//                     brandName: response[x].brandName,
//                     batchName: response[x].branchName,
//                     workflow: response[x].workflow,
//                     createdBy: response[x].adminName,
//                     updatedBy: response[x].adminName,
//                     createdTimestamp: Date.now(),
//                     updatedTimestamp: Date.now()
//                 });
//             }

//             await User.insertMany(userData);
//         });


//         return res.status(200).json({
//             status: 200,
//             success: true,
//             message: "All records were successfully inserted.",
//         });
//     } catch (error) {
//         //  Handle unexpected errors
//         return res.status(500).json({
//             status: 500,
//             success: false,
//             message: `Internal Server Error: ${error.message}`,
//         });
//     }
// }

// const csv = require('csvtojson');
// const User = require('../models/User'); // Assuming this is the correct path

// export const uploadUser = async (req, res) => {
//     try {
//         // Parse the CSV file into JSON format
//         const response = await csv().fromFile(req.file.path);
//         const userData = [];

//         // Loop through the parsed CSV data
//         for (let x = 0; x < response.length; x++) {
//             userData.push({
//                 name: response[x].name || 'Unknown', // Default value for name if missing
//                 number: response[x].number || 'Unknown', // Default value for number if missing
//                 registrationId: response[x].registrationId || 'Unknown', // Default registration ID
//                 brandName: response[x].brandName || 'Unknown', // Default value for brandName
//                 batchName: response[x].batchName || 'Default Batch', // Default value for batchName
//                 workflow: response[x].workflow || 'Default Workflow', // Default value for workflow
//                 createdBy: response[x].adminName || 'Admin', // Default createdBy value
//                 updatedBy: response[x].adminName || 'Admin', // Default updatedBy value
//                 createdTimestamp: Date.now(),
//                 updatedTimestamp: Date.now()
//             });
//         }

//         // Insert the data into the User collection
//         await User.insertMany(userData);

//         // Return success response
//         return res.status(200).json({
//             status: 200,
//             success: true,
//             message: "All records were successfully inserted.",
//         });

//     } catch (error) {
//         // Handle unexpected errors
//         return res.status(500).json({
//             status: 500,
//             success: false,
//             message: `Internal Server Error: ${error.message}`,
//         });
//     }
// };



export const uploadUser = async (req, res) => {
    try {
        // Parse the CSV file into JSON format
        const response = await csv().fromFile(req.file.path);

        // Check if the CSV has data
        if (response.length === 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "The CSV file is empty. Please upload a file with data.",
            });
        }

        // Fetch all existing registrationIds from the User model
        const existingRegistrationIds = await User.find().select('registrationId');

        // Create a set of existing registrationIds for faster lookup
        const existingRegistrationIdSet = new Set(existingRegistrationIds.map(user => user.registrationId));

        const userData = [];
        const duplicateRegistrationIds = [];

        // Loop through the parsed CSV data
        for (let x = 0; x < response.length; x++) {
            const registrationId = response[x].registrationId;

            // Check if registrationId already exists in the database
            if (existingRegistrationIdSet.has(registrationId)) {
                // If registrationId exists, add it to duplicates list
                duplicateRegistrationIds.push(registrationId);
                continue; // Skip this record and move to the next one
            }

            // Push the valid record to userData
            userData.push({
                name: response[x].name || 'Unknown', // Default value for name if missing
                number: response[x].number || 'Unknown', // Default value for number if missing
                registrationId: registrationId || 'Unknown', // Default registration ID
                brandName: response[x].brandName || 'Unknown', // Default value for brandName
                batchName: response[x].batchName || 'Default Batch', // Default value for batchName
                workflow: response[x].workflow || 'Default Workflow', // Default value for workflow
                createdBy: response[x].adminName || 'Admin', // Default createdBy value
                updatedBy: response[x].adminName || 'Admin', // Default updatedBy value
                createdTimestamp: Date.now(),
                updatedTimestamp: Date.now()
            });
        }

        // If there were duplicate registrationIds, return an error
        if (duplicateRegistrationIds.length > 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: `The following registrationIds already exist and were skipped: ${duplicateRegistrationIds.join(', ')}`,
            });
        }

        // Insert the data into the User collection
        const insertResult = await User.insertMany(userData);

        // Return success response with the number of records inserted
        return res.status(200).json({
            status: 200,
            success: true,
            message: `${insertResult.length} records were successfully inserted.`,
        });

    } catch (error) {
        // Handle unexpected errors
        return res.status(500).json({
            status: 500,
            success: false,
            message: `Internal Server Error: ${error.message}`,
        });
    }
};
