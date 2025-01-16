import EventFlow from "../models/eventFlowModel.js";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";

//Giving number and event name give event flow for the clients
export const clientEventInfo = async(req,res) => {
    try {
        const {registrationId, eventName} = req.body;

        if(!registrationId || !eventName){
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            });
        }

        const event = await Event.findOne({name: eventName});
        if(!event){
            return res.status(400).json({
                message: "You entered wronf event name, try with another",
                success: false
            });
        }
        
        const numberExist = event.users.includes(registrationId);
        if(!numberExist){
            if(!isNaN(registrationId)){
                const user = await User.findOne({number: registrationId});
                if(!user){
                    return res.status(400).json({
                        message: "This registrationId is not exist in this event",
                        success: false
                    });
                }

                const allEventFlowInfo = await EventFlow.findOne({expectedUserNumber: user.registrationId});
                if(!allEventFlowInfo){
                    return res.status(400).json({
                        message: "Admin has not made Event Flow for you",
                        success: false
                    });
                }
                return res.status(200).json({
                    message: "Your Juniors Updates of event",
                    eventInfo:{
                        flowSteps: allEventFlowInfo.flowSteps,
                    },
                    success: true
                });  
            }
            else{
                return res.status(400).json({
                    message: "Please enter valid number or registration-id",
                    success: false
                });
            }
            
        }

        const allEventFlowInfo = await EventFlow.findOne({expectedUserNumber: registrationId});
        if(!allEventFlowInfo){
            return res.status(400).json({
                message: "Admin has not made Event Flow for you",
                success: false
            });
        }
        return res.status(200).json({
            message: "Your Juniors Updates of event",
            eventInfo:{
                flowSteps: allEventFlowInfo.flowSteps,
            },
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