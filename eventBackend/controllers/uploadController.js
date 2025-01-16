import EventFlow from "../models/eventFlowModel.js";
import csv from "csvtojson";
import Tag from "../models/tagModel.js";

export const importUser = async (req, res) => {
    try {
        const errors = []; // To hold error messages
        const insertedRecords = [];  // To hold successfully inserted records

        // Process the CSV file
        csv()
            .fromFile(req.file.path)
            .then(async (response) => {
                console.log(response);

                const seenUserNumbers = new Set();
            
                for (const record of response) {
                    const { expectedUserNumber, flowSteps, lastUpdateBy, isLinkedWithUser } = record;
                
                    // Convert isLinkedWithUser to boolean
                    const isLinked = isLinkedWithUser === "TRUE"; // Convert "TRUE" string to true and "FALSE" to false
                
                    // Parse the flowSteps string into an actual array
                    let parsedFlowSteps = [];
                    try {
                        parsedFlowSteps = JSON.parse(flowSteps);
                    } catch (e) {
                        errors.push({
                            expectedUserNumber,
                            message: `Error parsing flowSteps for expectedUserNumber ${expectedUserNumber}: ${e.message}`,
                        });
                        continue; // Skip this record if parsing fails
                    }
                
                    if (seenUserNumbers.has(expectedUserNumber)) {
                        errors.push({
                            expectedUserNumber,
                            message: `Duplicate expected user number '${expectedUserNumber}' found.`,
                        });
                        continue; // Skip this record if duplicate is found
                    }
                    seenUserNumbers.add(expectedUserNumber);
                
                    // Check if the expectedUserNumber already exists in the database
                    const existingEvent = await EventFlow.findOne({ expectedUserNumber });
                    if (existingEvent) {
                        errors.push({
                            expectedUserNumber,
                            message: `Expected User number ${expectedUserNumber} already exists in the model`,
                        });
                        continue;
                    }
                
                    // Check flowSteps uniqueness: flowName, flowOrder, flowTag should be unique per array
                    const uniqueFlowNames = new Set();
                    const uniqueFlowOrders = new Set();
                    const uniqueFlowTags = new Set();
                    let flowTagValidationFailed = false;
                
                    // Loop through flowSteps to check for duplicates and validation
                    for (const flowStep of parsedFlowSteps) {
                        const { flowName, flowOrder, flowTag } = flowStep;
                
                        // Check for missing or undefined flowName
                        if (!flowName) {
                            errors.push({
                                expectedUserNumber,
                                message: `Flow name is missing or undefined in the flow step.`,
                            });
                            continue; // Skip this flow step if flowName is missing
                        }
                
                        // Check for uniqueness of flowName, flowOrder, and flowTag
                        if (uniqueFlowNames.has(flowName)) {
                            errors.push({
                                expectedUserNumber,
                                message: `Flow name '${flowName}' is repeated.`,
                            });
                            continue; // Skip this flow step if flowName is repeated
                        }
                        uniqueFlowNames.add(flowName);
                
                        if (uniqueFlowOrders.has(flowOrder)) {
                            errors.push({
                                expectedUserNumber,
                                message: `Flow order '${flowOrder}' is repeated.`,
                            });
                            continue; // Skip this flow step if flowOrder is repeated
                        }
                        uniqueFlowOrders.add(flowOrder);
                
                        if (uniqueFlowTags.has(flowTag)) {
                            errors.push({
                                expectedUserNumber,
                                message: `Flow tag '${flowTag}' is repeated.`,
                            });
                            continue; // Skip this flow step if flowTag is repeated
                        }
                        uniqueFlowTags.add(flowTag);
                
                        // Check if flowTag exists in the Tag model
                        const tagExists = await Tag.findOne({ name: flowTag });
                        if (!tagExists) {
                            errors.push({
                                expectedUserNumber,
                                message: `Flow tag '${flowTag}' does not exist in the Tag model.`,
                            });
                            flowTagValidationFailed = true;
                            break; // Stop processing this record if tag is invalid
                        }
                    }
                
                    // Skip inserting the record if any flow tag validation failed
                    if (flowTagValidationFailed) {
                        continue;
                    }
                
                    // If there are no errors, insert the valid record into the database
                    if (errors.length === 0) {
                        const newEventFlow = new EventFlow({
                            expectedUserNumber,
                            isLinkedWithUser: isLinked,  // Use the boolean value here
                            flowSteps: parsedFlowSteps,  // Use parsed flowSteps here
                            lastUpdateBy,
                        });
                
                        try {
                            await newEventFlow.save();
                            insertedRecords.push({ expectedUserNumber, message: 'Successfully inserted.' });
                        } catch (error) {
                            errors.push({
                                expectedUserNumber,
                                message: `Error inserting data: ${error.message}`,
                            });
                        }
                    }
                }
                
                // Send response with the validation errors or successfully inserted records
                if (errors.length > 0) {
                    return res.status(400).send({
                        status: 400,
                        success: false,
                        validationErrors: errors,
                    });
                } else {
                    return res.status(200).send({
                        status: 200,
                        success: true,
                        insertedRecords,
                        msg: "CSV Imported successfully with no errors",
                    });
                }
            })
            .catch((err) => {
                // Handle error when reading the CSV file
                return res.status(400).send({
                    status: 400,
                    success: false,
                    msg: `Error reading CSV file: ${err.message}`,
                });
            });
    } catch (error) {
        // Handle unexpected errors
        return res.status(400).send({
            status: 400,
            success: false,
            msg: error.message,
        });
    }
};
