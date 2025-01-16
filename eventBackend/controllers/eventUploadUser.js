import csv from "csvtojson";
import Event from "../models/eventModel.js"; // Adjust the path as necessary
import User from "../models/userModel.js"; // Adjust the path as necessary

export const eventUploadUser = async (req, res) => {
    try {
        // Parse the CSV file into JSON format
        const response = await csv().fromFile(req.file.path);
        console.log(response);

        // Check if the CSV has data
        if (response.length === 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "The CSV file is empty. Please upload a file with data.",
            });
        }

        const invalidEventNames = []; // To track invalid event names
        const invalidRegistrationIds = []; // To track invalid registration IDs

        // Loop through the CSV data
        for (const item of response) {
            const { eventName, RegistrationId } = item;

            // Check if required fields are present
            if (!eventName || !RegistrationId) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: "Invalid CSV format. Missing eventName or RegistrationId.",
                });
            }

            // Check if the RegistrationId exists in the User database
            const userExists = await User.findOne({ registrationId: RegistrationId });
            if (!userExists) {
                // If the RegistrationId does not exist, track it as invalid
                if (!invalidRegistrationIds.includes(RegistrationId)) {
                    invalidRegistrationIds.push(RegistrationId);
                }
                continue; // Skip this record and move to the next iteration
            }

            // Find the event by name
            const event = await Event.findOne({ name: eventName });

            if (event) {
                // If the event exists, add unique RegistrationId to users
                if (!event.users.includes(RegistrationId)) {
                    event.users.push(RegistrationId);
                    await event.save();
                }
            } else {
                // If the event does not exist, track the invalid eventName
                if (!invalidEventNames.includes(eventName)) {
                    invalidEventNames.push(eventName);
                }
            }
        }

        // Construct the error message if there are invalid event names or registration IDs
        const errorMessages = [];
        if (invalidEventNames.length > 0) {
            errorMessages.push(`The following event names do not exist: ${invalidEventNames.join(', ')}`);
        }
        if (invalidRegistrationIds.length > 0) {
            errorMessages.push(`The following RegistrationIds do not exist in the User database: ${invalidRegistrationIds.join(', ')}`);
        }

        // If there are any errors, return the error response
        if (errorMessages.length > 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: errorMessages.join(' | '),
            });
        }

        // Return success response
        return res.status(200).json({
            status: 200,
            success: true,
            message: "Event users were successfully inserted or updated.",
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
