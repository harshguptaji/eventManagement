// import Admin from "../models/adminModel.js";
import Event from "../models/eventModel.js";
import EventFlow from "../models/eventFlowModel.js"
import User from "../models/userModel.js";
import moment from "moment";

// for adding new event
export const addNewEvent = async(req,res) => {
    try {
        const {name,description,venue,date,adminName} = req.body
        
        if(!name || !description || !venue || !date){
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            });
        }

        const checkName = await Event.findOne({name});
        if(checkName){
            return res.status(400).json({
                message: "This Event name is already register, please try with different event name",
                success: false
            });
        }

        // Validate and convert the date to a JavaScript Date object
        const parsedDate = moment(date, "DD.MM.YYYY", true);

        if (!parsedDate.isValid()) {
            return res.status(400).json({
                message: "Please provide a valid date in DD.MM.YYYY format.",
                success: false,
            });
        }

       

        await Event.create({
            name,
            description,
            venue,
            date: parsedDate.toDate(),
            createdBy: adminName,
            updatedBy: adminName
        });

        return res.status(200).json({
            message: "New Event created successfully",
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

// For Showing All Events.
export const allEvents = async (req,res) => {
    try {
        const events = await Event.find();

        return res.status(200).json({
            message: "All Events",
            events,
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

// Function for showing event details - By Id
export const eventInfoById = async(req,res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);

        if(!event){
            return res.status(400).json({
                message: "This Event is not exist any more",
                success: false
            });
        }
        return res.status(200).json({
            message: "Found Successfully",
            event,
            success: true
        });

    } catch (error) {
        console.log(`Error, not enetered for processing : ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// Function For Update Event Information - By Id
export const updateEventInfoById = async(req,res) => {
    try {
        const eventId = req.params.id;
        const {name,description,venue,date, adminName} = req.body;

        const event = await Event.findById(eventId);
        if(!event){
            return res.status(400).json({
                message: "This event is not exist any more",
                success: false
            });
        }

        if(name){
            const checkName = await Event.findOne({name});
            if(checkName){
                return res.status(400).json({
                    message: "Please use different name, this name is already register",
                    success: false
                });
            }
            event.name = name;
        }

        if(description){
            event.description = description;
        }

        if(venue){
            event.venue = venue;
        }

        if(date){
            // Validate and convert the date to a JavaScript Date object
            const parsedDate = moment(date, "DD.MM.YYYY", true);

            if (!parsedDate.isValid()) {
                return res.status(400).json({
                    message: "Please provide a valid date in DD.MM.YYYY format.",
                    success: false,
                });
            }

            event.date = parsedDate.toDate();
        }

      

        event.updatedBy = adminName;

        await event.save();

        return res.status(200).json({
            message: "Event Information updated successfully",
            event,
            success: true
        })

    } catch (error) {
        console.log(`Error, not enetered for processing : ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// Function for adding user in an event
export const addUserInEvent = async(req,res) => {
    try {
        const eventId = req.params.id;
        const {userRegistration, adminName} = req.body;

        const event = await Event.findById(eventId);

        if(!event){
            return res.status(400).json({
                message: "This event is not exist any more",
                success: false
            });
        }
        
        if(!userRegistration){
            return res.status(400).json({
                message: "Please fill all required Fields",
                success: false
            });
        }

        const checkRegistrationId = await User.findOne({registrationId: userRegistration});
        if(!checkRegistrationId){
            return res .status(400).json({
                message: "This Register is not register in the user Database",
                success: false
            });
        }

        const eventFlow = await EventFlow.findOne({expectedUserNumber: userRegistration});
        if(eventFlow.isLinkedWithUser === false){
            return res.status(400).json({
                message: "First Linked this user, then add user",
                success: false
            });
        }

        

        event.updatedBy = adminName;

        if(!event.users.includes(userRegistration)){
            event.users.push(userRegistration);
            await event.save();
        } else {
            return res.status(400).json({
                message: `Number: ${userRegistration}, already exists in this Event ${event.name}`,
                success: false
            })
        }

        return res.status(200).json({
            message: "User add successfully in this event",
            event,
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

// Function for removing users from the event

export const removeUserFromEvent = async(req,res) => {
    try {
        const eventId = req.params.id;
        const {userRegistration,adminName} = req.body;

        const event = await Event.findById(eventId);

        if(!event){
            return res.status(400).json({
                message: "This event is not exist any more",
                success: false
            });
        }
        
        if(!userRegistration){
            return res.status(400).json({
                message: "Please fill all required Fields",
                success: false
            });
        }
        

        
        event.updatedBy = adminName;

        if(event.users.includes(userRegistration)){
            event.users.pull(userRegistration);
            await event.save();
        } else {
            return res.status(400).json({
                message: `Number: ${userRegistration}, is not exists in this Event: ${event.name}`,
                success: false
            })
        }

        return res.status(200).json({
            message: "User remove successfuly from this event",
            success: true,
            eventDetail: event
        });



    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// Function for searching user in the particular event
export const searchingNumberInAllEvents = async (req,res) => {
    try {
        const {registrationId} = req.body;

        const user = await User.findOne({ registrationId });
        
        if (!user) {
            if(!isNaN(registrationId)){
                const user1 = await User.findOne({number: registrationId});
                if(!user1){
                    return res.status(404).json({
                        message: `This Id: ${registrationId} is not registered with us`,
                        success: false
                    });
                }

                // Find all events that contain this number in their 'numbers' array
                const events = await Event.find({ users: user1.registrationId });
                console.log(events);

                if (events.length === 0) {
                    return res.status(404).json({
                        message: `This Id: ${user1.registrationId} is not associated with any event.`,
                        success: false
                    });
                }

                //Find EventFlow with this number
                const eventFlows = await EventFlow.findOne({expectedUserNumber: user1.registrationId});

                return res.status(200).json({
                    message: `Id: ${user1.registrationId} found in the following events.`,
                    success: true,
                    user: {
                        userId: user1._id,
                        userName: user1.name,
                        userBrand: user1.brandName,
                        batchName: user1.batchName
                    },
                    events: events.map(event => ({
                        eventId: event._id,
                        eventName: event.name
                    })),
                    flows: {
                        flowId: eventFlows._id,
                        flowNumber: eventFlows.expectedUserNumber
                    }
                });
            }
            else{
                return res.status(400).json({
                    message: "Please enter valid number or registration-id",
                    success: false
                })
            }
        }

        // Find all events that contain this number in their 'numbers' array
        const events = await Event.find({ users: registrationId });
        console.log(events);

        if (events.length === 0) {
            return res.status(404).json({
                message: `This Id: ${registrationId} is not associated with any event.`,
                success: false
            });
        }

        //Find EventFlow with this number
        const eventFlows = await EventFlow.findOne({expectedUserNumber: registrationId});

        return res.status(200).json({
            message: `Id: ${registrationId} found in the following events.`,
            success: true,
            user: {
                userId: user._id,
                userName: user.name,
                userBrand: user.brandName,
                batchName: user.batchName
            },
            events: events.map(event => ({
                eventId: event._id,
                eventName: event.name
            })),
            flows: {
                flowId: eventFlows._id,
                flowNumber: eventFlows.expectedUserNumber
            }
        });


    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred while searching for the number in all events.",
            success: false
        });
    }
};

// Function for deleting Event -- ById
export const deleteEvent = async(req,res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findByIdAndDelete(eventId);
        if(!event){
            return res.status(400).json({
                message: "This event is not exist any more",
                success: false
            });
        }

        return res.status(200).json({
            message: "Event is deleted successfully",
            success: true
        });

    } catch (error) {
        console.log(`Error, not enetered for processing : ${error}`);
    }
};
