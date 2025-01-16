
import EventFlow from "../models/eventFlowModel.js";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";

// Register user By Admin
export const registerUser = async(req,res) => {
    try {
        const {registrationId, name, number, brandName, batchName, adminName} = req.body;

        if(!name || !number || !registrationId || !brandName || !batchName){
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            });
        }

        const checkRegistrationId = await User.findOne({registrationId});
        if(checkRegistrationId){
            return res.status(400).json({
                message: "This Registration Id is exist, Please go for another Id",
                success: false
            });
        }

        const expectedId = await EventFlow.findOne({expectedUserNumber: registrationId});
        if(!expectedId){
            return res.status(400).json({
                message: `This Id is not in the event flow, for registering this user first make event flow of this Id: ${registrationId}`,
                success: false
            });
        }

        expectedId.isLinkedWithUser = true;
        await expectedId.save();

        const user = await User.create({
            registrationId,
            name,
            number,
            batchName,
            brandName,
            workflow: expectedId.expectedUserNumber,
            createdBy: adminName,
            updatedBy: adminName
        });

        return res.status(200).json({
            message: `New User is created successfully`,
            user,
            success: true
        })

    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// All users
export const allUser = async (req,res) => {
    try {
        const users = await User.find();

        return res.status(200).json({
            message: "All Users",
            users,
            success: true
        });

    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// Show User Information By Id --- ByAdmin
export const userInfoById = async(req,res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message: "This user not found, try with another id or user",
                success: false
            });
        }
        return res.status(200).json({
            message: "User Information",
            user,
            success: true
        });

    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// Update user Information with the ID
// Update user Information with the ID
export const updateUserInfoById = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, number, adminName, brandName, batchName, registrationId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "This user not found, try with another id or user",
                success: false
            });
        }

        if (name) {
            user.name = name;
        }
        if (registrationId) {
            // Check if the Id is already registered with another user
            const checkRegistrationId = await User.findOne({ registrationId });
            if (checkRegistrationId) {
                return res.status(400).json({
                    message: "This Registration Id is already registered with another user",
                    success: false
                });
            }

            // Check if the Id is linked with any event flow
            const linkedId = await EventFlow.findOne({ expectedUserNumber: registrationId });
            if (!linkedId) {
                return res.status(400).json({
                    message: "First, add an event flow for this number",
                    success: false
                });
            }

            if (linkedId.isLinkedWithUser) {
                return res.status(400).json({
                    message: `This number is already linked, please use another number`,
                    success: false
                });
            }

            // Unlink previous number from event flow
            const linkedIdFalse = await EventFlow.findOne({ expectedUserNumber: user.registrationId });
            if (!linkedIdFalse) {
                return res.status(400).json({
                    message: `Event Flow not found for the old Registration Id`,
                    success: false
                });
            }

            linkedIdFalse.isLinkedWithUser = false;
            linkedIdFalse.flowSteps = [];

            // Check if the new number is already in any Event's number list
            const existingEventWithNewId = await Event.findOne({ users: registrationId });
            if (existingEventWithNewId) {
                return res.status(400).json({
                    message: `The Id ${registrationId} is already registered in an event. First, remove it from the event.`,
                    success: false
                });
            }

            // Update the user's number and workflow
            user.registrationId = registrationId;
            user.workflow = registrationId;
            await linkedIdFalse.save();
        }

        if(number){
            user.number = number;
        }

        if(batchName){
            user.batchName = batchName;
        }
        if(brandName){
            user.brandName = brandName;
        }

        // Set the user update information
        user.updatedBy = adminName;

        if (registrationId) {
            await Event.updateMany(
                { numbers: user.registrationId },
                { 
                    $addToSet: { numbers: registrationId },
                    $pull: { numbers: user.registrationId }
                }
            );
        }

        await user.save();

        return res.status(200).json({
            message: "User Updated Successfully",
            success: true,
            user
        });

    } catch (error) {
        console.error("Error while updating user:", error);
        return res.status(500).json({
            message: "An error occurred, please try again later.",
            success: false
        });
    }
};


// Delete User 
export const deleteUser = async(req,res) => {
    try {
        const Id = req.params.id;
        const user = await User.findByIdAndDelete(Id);
        if(!user){
            return res.status(400).json({
                message: "This user is not exist any more",
                success: false
            });
        }
        const eventFlow = await EventFlow.findOne({expectedUserNumber: user.registrationId});

        await EventFlow.findByIdAndDelete(eventFlow._id);
        // Remove user's number from all Event documents
        await Event.updateMany(
            { users: user.registrationId },
            { $pull: { users: user.registrationId } }
        );

        return res.status(200).json({
            message: "This User is deleted Successfully",
            success: true
        });

    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

