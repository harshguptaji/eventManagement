// src/components/EventAnalysisComponent.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEventAnalysis } from "../redux/slices/eventAnalysisSlice";
import { Link } from "react-router-dom";
import "../styling/EventAnalysisComponent.css";

const EventAnalysisComponent = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.eventAnalysis);

  useEffect(() => {
    dispatch(fetchEventAnalysis());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="analysis-container">
      <h1 className="analysis-title">Event Analysis</h1>
      {data.length === 0 ? (
        <p className="data-null">No event data found.</p>
      ) : (
        data.map((event) => (
          <div key={event.eventName}>
            <h2 className="event-analysis-title">{event.eventName}</h2>

            {/* <h3 className="event-analysis-title1">Status Data</h3> */}
            <div className="analysis-flex">
              {Object.entries(event.statusData).map(([status, statusInfo]) => (
                <div key={status} className="analysis-inner-container scrollable-container">
                  <h4 className="analysis-inner-container-title">
                    {status} - Total: {statusInfo.count}
                  </h4>
                  {statusInfo.count === 0 ? (
                    <p></p>
                  ) : (
                    <ul className="analysis-title-flex">
                      <li>Flow Name</li>
                      <li>Register Id</li>
                      <li className="hide">Last Update</li>
                    </ul>
                  )}

                  <ul className="analysis-flex-1">
                    {statusInfo.steps.map((step) => (
                      <li key={step.flowId} className="analysis-flex-1">
                        <div className="analysis-flex-1-div">
                          {step.flowName}
                        </div>
                        <div className="analysis-flex-1-div">
                          <Link
                            className="link"
                            to={`/eventflow/${step.flowId}`}
                          >
                            {step.expectedUserNumber}
                          </Link>
                        </div>
                        <div className="analysis-flex-1-div hide">
                          {step.lastUpdatedBy}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* {event.lastStepCompleted && (
                            <>
                                <h3>Last Step Completed - Total : {event.lastStepCompleted.length}</h3>
                                <ul>
                                    {event.lastStepCompleted.map((step) => (
                                        <li key={step.flowId}>
                                            <strong>Flow Name:</strong> {step.flowName} | 
                                            <strong>User </strong> <Link to={`/eventflow/${step.flowId}`}>{step.expectedUserNumber}</Link>| 
                                            <strong>Last Updated By:</strong> {step.lastUpdatedBy}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )} */}
          </div>
        ))
      )}
    </div>
  );
};

export default EventAnalysisComponent;
