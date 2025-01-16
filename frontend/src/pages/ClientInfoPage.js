import React from 'react';
import ClientEventFlowForm from '../components/ClientEventFlowForm';
import JFWlogo from "../store/JFW-logo.png";
import "../styling/ClientInfoPage.css"

const ClientInfoPage = () => {
    return (
        // <div className='client-page'>
        //     <img className='logo' src={JFWlogo} alt="Juniors Fashion Week" />
        //     <h1 className='title'>Client Event Information</h1>
        //     <ClientEventFlowForm/>
        // </div>
        <div className='main-div'>
        <div className="background-video">
            <iframe
            src="https://www.youtube.com/embed/vaY9X5Mxi-M?autoplay=1&mute=1&loop=1&playlist=vaY9X5Mxi-M&controls=0&modestbranding=1&disablekb=1&rel=0&showinfo=0&cc_load_policy=0"
            title="YouTube Video Background"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            ></iframe>
        </div>
        <div className="video-overlay"></div>
        <div className="content">
        <div className='client-page'>
             <img className='logo' src={JFWlogo} alt="Juniors Fashion Week" />
             <h1 className='title'>Client Event Information</h1>
             <ClientEventFlowForm/>
         </div>
        </div>
      </div>
    );
};

export default ClientInfoPage;
