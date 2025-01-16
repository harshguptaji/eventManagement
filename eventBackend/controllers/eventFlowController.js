import Admin from "../models/adminModel.js";
import EventFlow from "../models/eventFlowModel.js";
import Tag from "../models/tagModel.js";

// Function for adding new Event-Flow
export const addEventFlow = async(req,res) => {
    try {
        const {registrationId, adminName} = req.body;
        if(!registrationId){
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            });
        }

        const checkRegistartion = await EventFlow.findOne({expectedUserNumber: registrationId});

        if(checkRegistartion){
            return res.status(400).json({
                message: `Please try with anothet expected Id , this Id. ${registrationId} is already register in the event-flow`,
                success: false
            });
        }

        

        const eventFlow = await EventFlow.create({
            expectedUserNumber: registrationId,
            lastUpdateBy: adminName
        });

        return res.status(200).json({
            message: "New Event Flow is created successfully",
            eventFlow,
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

// Function to show all event-flow
export const allEventFlow = async(_,res) => {
    try {
        const eventFlows = await EventFlow.find();

        return res.status(200).json({
            message: "All Event Flows",
            eventFlows,
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

//Function to show particular event - BY ID
export const eventFlowInfoById = async(req,res) => {
    try {
        const Id = req.params.id;
        const eventFlow = await EventFlow.findById(Id);
        if(!eventFlow){
            return res.status(400).json({
                message: "This event flow is not exist any more",
                success: false
            })
        }
        if(eventFlow.isLinkedWithUser === false){
            return res.status(400).json({
                message: `For detailing of this event flow , first linked with the user: ${eventFlow.expectedUserNumber}`,
                success: false
            });
        }

        return res.status(200).json({
            message: "Sucessfully Fetch",
            eventFlow,
            success: true
        });

    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
}

// Function for update event-flow number
export const updateEventFlowNumber = async(req,res) => {
    try {
        const Id = req.params.id;
        const {registrationId, adminName} = req.body;
        if(!registrationId){
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            });
        }
        

        const checkRegisterId = await EventFlow.findOne({expectedUserNumber: registrationId});

        if(checkRegisterId){
            return res.status(400).json({
                message: `Please try with anothet expected number , this no. ${registrationId} is already register in the event-flow`
            });
        }

        const eventFlow = await EventFlow.findById(Id);
        if(!eventFlow){
            return res.status(400).json({
                message: "This Event-Flow is not exist any more",
                success: false
            })
        }

        if(eventFlow.isLinkedWithUser === true){
            return res.status(400).json({
                message: "This event flow is linked with the user, now the number can not be update, only solution is to delete user of this number , this event flow automatically deleted",
                success: false
            });
        }

        
        const adminInfo = await Admin.findOne({name: adminName});
        if(!adminInfo){
            return res.status(400).json({
                message: "You are not authorized to access this api",
                success: false
            })
        }
        if(registrationId){
            eventFlow.expectedUserNumber = registrationId;
        }
        eventFlow.lastUpdateBy = adminInfo.name;
        await eventFlow.save();
        return res.status(200).json({
            message: "For this event , Id is updated successfully"
        });

    } catch (error) {
        console.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};

// Function for adding new Step-Flow in the event flow
export const addStepFlow = async(req,res) => {
    try {
        const Id = req.params.id;
        const {flowName,flowOrder,flowDescription,flowTag, adminName} = req.body;
       
        const eventFlow = await EventFlow.findById(Id);
        if(!eventFlow){
            return res.status(400).json({
                message: "This event is not exist any more",
                success: false
            });
        }
        if(!flowName || !flowOrder || !flowDescription || !flowTag || !adminName) {
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            });
        }

        if(eventFlow.isLinkedWithUser === false){
            return res.status(400).json({
                message: "Can not add step flow beacuse, you have not linked with user",
                success: fasle
            });
        }

        const tag = await Tag.findOne({name: flowTag});
        if(!tag){
            return res.status(400).json({
                message: `This tag: ${flowTag} is not registered in the Tag model`,
                success: false
            });
        }

       const isNameExist = eventFlow.flowSteps.some(
        (step) => step.flowName === flowName
       );

       if (isNameExist) {
            return res.status(400).json({ 
                message: `This Name ${flowName} is used before in this work flow, try with another name`,
                success: false 
            });
        }

        const isOrderExist = eventFlow.flowSteps.some(
            (step) => step.flowOrder === flowOrder
        );
    
        if (isOrderExist) {
            return res.status(400).json({ 
                message: `This Order ${flowOrder} is used before in this work flow, try with another Order`,
                success: false 
            });
        }

        const isTagExist = eventFlow.flowSteps.some(
            (step) => step.flowTag === flowTag
        );
    
        if (isTagExist) {
            return res.status(400).json({ 
                message: `This tag ${flowTag} is used before in this work flow, try with another Tag`,
                success: false 
            });
        }

        
        const adminInfo = await Admin.findOne({ name:adminName});
        if(!adminInfo){
            return res.status(400).json({
                message: "You are not authorized to add new api",
                success: false
            })
        }

        // Check this tag includes in the admin or not 
        if(adminInfo.role === 'admin'){}
        else if (adminInfo.role === 'subAdmin'){
            const checkTag = adminInfo.tags.includes(flowTag);
            if(!checkTag){
                return res.status(400).json({
                    message: `Admin blocked you to add step flow for this tag: ${flowTag}`,
                    success: false
                });
            }
        }
        else{
            return res.status(400).json({
                message: `Some thing went wrong , please go to the admin and update your role`,
                success: false
            });
        }

        eventFlow.flowSteps.push({
            flowName,
            flowOrder,
            flowDescription,
            flowTag,
            lastUpdatedBy: adminInfo.name,
            lastUpdateTiming: new Date()
        });

        // Sort array on the basis of order
        eventFlow.flowSteps.sort((a,b) => a.flowOrder - b.flowOrder);

        // Update status
        for (let i = 0; i < eventFlow.flowSteps.length; i++) {
            const currentStep = eventFlow.flowSteps[i];
            const previousStep = eventFlow.flowSteps[i - 1];

            if (i === 0) {
                // The first step, status remains as provided (could be "Not Started" or any other)
                continue;
            }

            // If the previous step is "Completed", set the current step to "In Progress"
            if (previousStep.flowStatus === 'Completed' && currentStep.flowStatus !== 'Completed') {
                currentStep.flowStatus = 'In Progress';
            }

            // If the previous step is "Not Started", set all subsequent steps to "Not Started"
            if (previousStep.flowStatus === 'Not Started') {
                currentStep.flowStatus = 'Not Started';
            }

            // If the previous step is "In Progress", set all subsequent steps to "Not Started"
            if (previousStep.flowStatus === 'In Progress') {
                currentStep.flowStatus = 'Not Started';
            }
        }

        await eventFlow.save();

        const flowStepIndex = eventFlow.flowSteps.findIndex(
            (step) => step.flowOrder === flowOrder
        );

        const flowStep = eventFlow.flowSteps[flowStepIndex];    

        res.status(200).json({
            message: 'Flow step added successfully',
            flowStep,
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

// Delete Partcular step flow   
export const removeStepFlow = async(req,res) => {
    try {
        const Id = req.params.id;
        const {stepFlowId, adminName} = req.body;
        if(!stepFlowId){
            return res.status(400).json({
                message: "step flow id blank",
                success: false
            })
        }

        const eventFlow = await EventFlow.findById(Id);
        if(!eventFlow){
            return res.status(400).json({
                message: "This event flow is not exist any more",
                success: false
            });
        }

        if(eventFlow.isLinkedWithUser === false){
            return res.status(400).json({
                message: `You have not linked this event flow with the user, please linked with ${eventFlow.expectedUserNumber}`,
                success: false
            });
        }

        // checking this step flow is exist or not
        const flowStepExists = eventFlow.flowSteps.find((step) => {
            if (!step._id) {
              console.error('Missing _id in step:', step);
            }
            if (!stepFlowId) {
              console.error('Missing stepFlowId:', stepFlowId);
            }
            return step._id.toString() === stepFlowId.toString();
          });

        if (!flowStepExists) {
            return res.status(404).json({ message: 'Flow step not found in this event flow', success: false });
        }

        const adminInfo = await Admin.findOne({name: adminName});
        if(!adminInfo){
            return res.status(400).json({
                message: "You are not authorized to access this api",
                success: false
            })
        }

        // Check this tag includes in the admin or not 
        if(adminInfo.role === 'admin'){}
        else if (adminInfo.role === 'subAdmin'){
            const checkTag = adminInfo.tags.includes(flowStepExists.flowTag);
            if(!checkTag){
                return res.status(400).json({
                    message: `Admin blocked you to delete this step flow for this tag: ${flowStepExists.flowTag}`,
                    success: false
                });
            }
        }
        else{
            return res.status(400).json({
                message: `Some thing went wrong , please go to the admin and update your role`,
                success: false
            });
        }

        // Remove the specific flow step by filtering it out
        eventFlow.flowSteps = eventFlow.flowSteps.filter(step => step._id.toString() !== stepFlowId);
        eventFlow.lastUpdateBy = adminInfo.name;

        // Save the updated event flow document
        await eventFlow.save();

        return res.status(200).json({
            message: `This steplflow is deleted successfully`,
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


// Update Info particular step flow  
export const updateInfoStepFlow = async(req,res) => {
    try {
        const Id = req.params.id;
        const {flowId, flowName, flowDescription, flowTag} = req.body;

        if(!flowId){
            return res.status(400).json({
                message: "Please fill the id, frontend issue",
                success: false
            });
        }

        const eventFlow = await EventFlow.findById(Id);
        if(!eventFlow){
            return res.status(400).json({
                message: "This event flow is not exist any more",
                success: false
            });
        }

        if(eventFlow.isLinkedWithUser === false){
            return res.status(400).json({
                message: `You have not linked this event flow with the user, please linked with ${eventFlow.expectedUserNumber}`,
                success: false
            });
        }


         // Checking this new tag is exist in database
         if(flowTag){
            const tag = await Tag.findOne({name: flowTag});
            if(!tag){
                return res.status(400).json({
                    message: `This tag: ${flowTag} is not registered in the Tag model`,
                    success: false
                });
            }
         }
        

        // checking this step flow is exist or not
        const flowStepExists = eventFlow.flowSteps.find(step => step._id.toString() === flowId);
        if (!flowStepExists) {
            return res.status(404).json({ message: 'Flow step not found in this event flow' });
        }

        if (flowName){
            const isNameExist = eventFlow.flowSteps.some(
                (step) => step.flowName === flowName
            );
        
            if (isNameExist) {
                return res.status(400).json({ 
                    message: `This Name ${flowName} is used before in this work flow, try with another name`,
                    success: false 
                });
            }
            flowStepExists.flowName = flowName;  
        }

        if(flowDescription){
            flowStepExists.flowDescription = flowDescription;
        }

        if(flowTag){
            const isTagExist = eventFlow.flowSteps.some(
                (step) => step.flowTag === flowTag
            );

            if (isTagExist) {
                return res.status(400).json({ 
                    message: `This tag ${flowTag} is used before in this work flow, try with another Tag`,
                    success: false 
                });
            }
            flowStepExists.flowTag = flowTag;
        }       
        
        const adminId = req.admin.id;
        const adminInfo = await Admin.findById(adminId);
        if(!adminInfo){
            return res.status(400).json({
                message: "You are not authorized to access this api",
                success: false
            })
        }

        // Check this tag includes in the admin or not 
        if(adminInfo.role === 'admin'){}
        else if (adminInfo.role === 'subAdmin'){
            const checkTag = adminInfo.tags.includes(flowStepExists.flowTag);
            if(!checkTag){
                return res.status(400).json({
                    message: `Admin blocked you to update this step flow for this tag: ${flowStepExists.flowTag}`,
                    success: false
                });
            }
        }
        else{
            return res.status(400).json({
                message: `Some thing went wrong , please go to the admin and update your role`,
                success: false
            });
        }

        if(flowTag){
            if(adminInfo.role === 'admin'){}
            else if (adminInfo.role === 'subAdmin'){
                const checkTag = adminInfo.role.includes(flowTag);
                if(!checkTag){
                    return res.status(400).json({
                        message: `Admin blocked you to update this step flow for this tag: ${flowStepExists.flowTag}`,
                        success: false
                    });
                }
            }
            else{
                return res.status(400).json({
                    message: `Some thing went wrong , please go to the admin and update your role`,
                    success: false
                });
            }
        }

        // Update the specific flow step
       flowStepExists.lastUpdatedBy = adminInfo.name;
       flowStepExists.lastUpdateTiming = new Date();

        // Save the updated event flow document
        await eventFlow.save();

        return res.status(200).json({
            message: `This steplflow is Updated successfully`,
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


// Update status particular step flow checking the previuos and next stage
export const updateStatusStepFlow = async(req,res) => {
    try {
        const Id = req.params.id;
        const {flowId, flowStatus, adminName} = req.body;

        if(!flowId || !flowStatus){
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            });
        }

        const eventFlow = await EventFlow.findById(Id);
        if(!eventFlow){
            return res.status(400).json({
                message: "This event flow is not exist any more",
                success: false
            });
        }

        if(eventFlow.isLinkedWithUser === false){
            return res.status(400).json({
                message: `You have not linked this event flow with the user, please linked with ${eventFlow.expectedUserNumber}`,
                success: false
            });
        }
         

        // checking this step flow is exist or not
        const flowStepExists = eventFlow.flowSteps.find((step) => {
            if (!step._id) {
              console.error('Missing _id in step:', step);
            }
            if (!flowId) {
              console.error('Missing stepFlowId:', flowId);
            }
            return step._id.toString() === flowId.toString();
          });
        if (!flowStepExists) {
            return res.status(404).json({ message: 'Flow step not found in this event flow' });
        }

      
        const adminInfo = await Admin.findOne({name: adminName});
        if(!adminInfo){
            return res.status(400).json({
                message: "You are not authorized to access this api",
                success: false
            })
        }

        // Check this tag includes in the admin or not 
        if(adminInfo.role === 'admin'){}
        else if (adminInfo.role === 'subAdmin'){
            const checkTag = adminInfo.tags.includes(flowStepExists.flowTag);
            if(!checkTag){
                return res.status(400).json({
                    message: `Admin blocked you to update this step flow for this tag: ${flowStepExists.flowTag}`,
                    success: false
                });
            }
        }
        else{
            return res.status(400).json({
                message: `Some thing went wrong , please go to the admin and update your role`,
                success: false
            });
        }


        const flowStepIndex = eventFlow.flowSteps.findIndex(step => step._id.toString() === flowId.toString());
        if (flowStepIndex === -1) {
            return res.status(404).json({ message: 'Flow step not found in this event flow' });
        }

        const currentStep = eventFlow.flowSteps[flowStepIndex];
        
        // If this is the first flow step (index 0), skip the checks and update directly
        if (flowStepIndex === 0) {
            currentStep.flowStatus = flowStatus;
            currentStep.lastUpdatedBy = adminInfo.name; // Set the admin updating the status
            currentStep.lastUpdateTiming = new Date(); // Update timestamp
        } else {
            // For other steps, retrieve the previous step
            const previousStep = eventFlow.flowSteps[flowStepIndex - 1];
            
            // Enforce conditions based on the previous step's status
            if (previousStep.flowStatus === 'Not Started') {
                return res.status(400).json({
                    message: 'Cannot update current step because the previous step has not started.',
                });
            }
            if (previousStep.flowStatus === 'In Progress') {
                return res.status(400).json({
                    message: 'Cannot complete current step because the previous step is still in progress.',
                });
            }
            // If conditions are met, update the current step's status
            if (previousStep.flowStatus === 'Completed') {
                currentStep.flowStatus = flowStatus;
                currentStep.lastUpdatedBy = adminInfo.name; // Set the admin updating the status
                currentStep.lastUpdateTiming = new Date(); // Update timestamp
            }
            
        }

        // Check if the current step was completed, and if so, set the next step to "In Progress"
        if (flowStatus === 'Completed' && flowStepIndex < eventFlow.flowSteps.length - 1) {
            const nextStep = eventFlow.flowSteps[flowStepIndex + 1];
            if (nextStep.flowStatus === 'Not Started') {
                nextStep.flowStatus = 'In Progress';
            }
        }

        // Check if we do in Progress or Not started, then do all next stages to not started
        if (flowStatus === 'In Progress' || flowStatus === 'Not Started') {
            for (let i = flowStepIndex + 1; i < eventFlow.flowSteps.length; i++) {
                eventFlow.flowSteps[i].flowStatus = 'Not Started';
            }
        }
       
        // Save the updated event flow document with status
        await eventFlow.save();

        return res.status(200).json({
            message: `This steplflow is status updated successfully`,
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

// Update the order, then sort and start updating the status automatically from update order
export const updateOrderStepFlow = async(req,res) => {
    try {
        const Id = req.params.id;
        const {stepFlowId, flowOrder, adminName} = req.body;

        const eventFlow = await EventFlow.findById(Id);
        if(!eventFlow){
            return res.status(400).json({
                message: "This event flow is not exist any more",
                success: false
            });
        }

        if(eventFlow.isLinkedWithUser === false){
            return res.status(400).json({
                message: `You have not linked this event flow with the user, please linked with ${eventFlow.expectedUserNumber}`,
                success: false
            });
        }

        // checking this step flow is exist or not
        const flowStepExists = eventFlow.flowSteps.find(step => step._id.toString() === stepFlowId.toString());
        if (!flowStepExists) {
            return res.status(404).json({ message: 'Flow step not found in this event flow' });
        }

        // Order exist or not
        const isOrderExist = eventFlow.flowSteps.some(
            (step) => step.flowOrder === flowOrder
        );
    
        if (isOrderExist) {
            return res.status(400).json({ 
                message: `This Order ${flowOrder} is used before in this work flow, try with another Order`,
                success: false 
            });
        }

        
        const adminInfo = await Admin.findOne({name: adminName});
        if(!adminInfo){
            return res.status(400).json({
                message: "You are not authorized to access this api",
                success: false
            })
        }

        // Check this tag includes in the admin or not 
        if(adminInfo.role === 'admin'){}
        else if (adminInfo.role === 'subAdmin'){
            const checkTag = adminInfo.tags.includes(flowStepExists.flowTag);
            if(!checkTag){
                return res.status(400).json({
                    message: `Admin blocked you to delete this step flow for this tag: ${flowStepExists.flowTag}`,
                    success: false
                });
            }
        }
        else{
            return res.status(400).json({
                message: `Some thing went wrong , please go to the admin and update your role`,
                success: false
            });
        }

        // Update the flow order for the specified step
        flowStepExists.flowOrder = flowOrder;
        flowStepExists.lastUpdatedBy = adminInfo.name;
        flowStepExists.lastUpdateTiming = new Date();

        // Sort the flowSteps array based on the updated flowOrder
        eventFlow.flowSteps.sort((a, b) => a.flowOrder - b.flowOrder);

        // Update status
        for (let i = 0; i < eventFlow.flowSteps.length; i++) {
            const currentStep = eventFlow.flowSteps[i];
            const previousStep = eventFlow.flowSteps[i - 1];

            if (i === 0) {
                // The first step, status remains as provided (could be "Not Started" or any other)
                continue;
            }

            // If the previous step is "Completed", set the current step to "In Progress"
            if (previousStep.flowStatus === 'Completed' && currentStep.flowStatus !== 'Completed') {
                currentStep.flowStatus = 'In Progress';
            }

            // If the previous step is "Not Started", set all subsequent steps to "Not Started"
            if (previousStep.flowStatus === 'Not Started') {
                currentStep.flowStatus = 'Not Started';
            }

            // If the previous step is "In Progress", set all subsequent steps to "Not Started"
            if (previousStep.flowStatus === 'In Progress') {
                currentStep.flowStatus = 'Not Started';
            }
        }


        // Save the updated event flow document
        eventFlow.lastUpdateBy = adminInfo.name;
        const flow = await eventFlow.save();

        return res.status(200).json({
            message: `This steplflow Order Updated successfully`,
            flow,
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

// Function for deleting eventFlow when not linked with user after linking first user delete, then eventflow automatically delete
export const deleteEventFlow = async(req,res) => {
    try {
        const Id = req.params.id;
        const eventFlow = await EventFlow.findById(Id);
        if(!eventFlow){
            return res.status(400).json({
                message: "This event flow is not exist any more, cannot delete",
                success: false
            });
        }
        if(eventFlow.isLinkedWithUser === true){
            return res.status(400).json({
                message: "This event flow can not delete , it is linked with user",
                success: false
            });
        }

        await EventFlow.findByIdAndDelete(Id);

        return res.status(200).json({
            message: "Event Flow deleted successfully",
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

// searching Event Flow by number
export const searchingEventFlow = async(req,res) => {
    try {
        const {registrationId} = req.body;
        if(!registrationId){
            return res.status(400).json({
                message: "Please fill all required fields",
                success: false
            })
        }
        const eventFlow = await EventFlow.findOne({expectedUserNumber: registrationId});
        
        if(!eventFlow){
            return res.status(400).json({
                message: `This ${registrationId} is not found, try with another Id`,
                success: false
            });
        }

        return res.status(200).json({
            eventFlow,
            success: true
        });

    } catch (error) {
        onsole.log(`Error, not insert in the processor :- ${error}`);
        return res.status(500).json({
            message: "An error occurred,try another time",
            success: false
        });
    }
};