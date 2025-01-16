import Event from '../models/eventModel.js';
import EventFlow from '../models/eventFlowModel.js';

// Controller function to analyze events based on status filter and last step completion
export const analyzeEventsWithStatusFilterAndLastStep = async (req, res) => {
    try {
        // Fetch all events
        const events = await Event.find({}, { name: 1, users: 1 }).lean(); // Only fetch necessary fields

        const eventAnalysisPromises = events.map(async (event) => {
            const { name: eventName, users } = event;

            // Initialize status-based structure for each event
            const statusData = {
                NotStarted: { count: 0, steps: [] },
                InProgress: { count: 0, steps: [] }
            };
            const lastStepCompleted = [];

            // Fetch EventFlows for the users in this event
            const eventFlows = await EventFlow.find({ expectedUserNumber: { $in: users } }).lean();

            // Process each EventFlow for this event
            for (const eventFlow of eventFlows) {
                const { _id: flowId, expectedUserNumber, flowSteps } = eventFlow;

                // Sort flow steps by flowOrder to identify the last step
                const sortedFlowSteps = flowSteps.sort((a, b) => a.flowOrder - b.flowOrder);
                const lastStep = sortedFlowSteps[sortedFlowSteps.length - 1];

                // Check if the last step is marked as "Completed"
                if (lastStep && lastStep.flowStatus === "Completed") {
                    lastStepCompleted.push({
                        flowId,
                        expectedUserNumber,
                        flowName: lastStep.flowName,
                        lastUpdatedBy: lastStep.lastUpdatedBy
                    });
                }

                // Group other steps by status (excluding "Completed")
                sortedFlowSteps.forEach((step) => {
                    const { flowStatus, flowName, flowOrder, lastUpdatedBy } = step;

                    if (flowStatus === "Not Started") {
                        statusData.NotStarted.count++;
                        statusData.NotStarted.steps.push({
                            flowId,
                            flowName,
                            expectedUserNumber,
                            lastUpdatedBy
                        });
                    } else if (flowStatus === "In Progress") {
                        statusData.InProgress.count++;
                        statusData.InProgress.steps.push({
                            flowId,
                            flowName,
                            expectedUserNumber,
                            lastUpdatedBy
                        });
                    }
                });
            }

            return {
                eventName,
                statusData,
                lastStepCompleted: lastStepCompleted.length > 0 ? lastStepCompleted : null
            };
        });

        // Resolve all promises and compile the analysis result
        const eventAnalysis = await Promise.all(eventAnalysisPromises);

        res.status(200).json({ success: true, data: eventAnalysis });
    } catch (error) {
        console.error("Error analyzing events:", error);
        res.status(500).json({ success: false, message: "Server error while analyzing events" });
    }
};

