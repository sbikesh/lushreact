import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlynkControlApp = () => {
  const [currentPattern, setCurrentPattern] = useState("OFF");
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isSliderSet, setIsSliderSet] = useState(false);
  const [isDeviceOnline, setIsDeviceOnline] = useState(false);

  const blynkAuthToken = 'uRxhxeAdh9hS0NkU9ix_lqlcpEb-EW7a';
  const blynkServerAddress = 'http://sgp1.blynk.cloud';
  const baseUrl = `${blynkServerAddress}/external/api/update?token=${blynkAuthToken}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}&pin=V5`);
        setCurrentPattern(response.data);
      } catch (error) {
        console.error('Error fetching current pattern:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDeviceStatus = async () => {
      try {
        const response = await axios.get(`${blynkServerAddress}/external/api/isHardwareConnected?token=${blynkAuthToken}`);
        setIsDeviceOnline(response.data);
      } catch (error) {
        console.error('Error fetching device status:', error);
      }
    };

    fetchDeviceStatus();
  }, []);

  const changePattern = async () => {
    try {
      const patterns = [0, 1, 2, 3, 4];
      const currentIndex = patterns.indexOf(currentPattern);
      const nextIndex = (currentIndex + 1) % patterns.length;
      const nextPattern = patterns[nextIndex];
    
      await axios.get(`${baseUrl}&pin=V1&value=${nextPattern}`);
      setCurrentPattern(nextPattern);
    } catch (error) {
      console.error('Error changing pattern:', error);
    }
  };
  
  

  

  const handleSpeedMultiplierChange = async (multiplier) => {
    try {
      await axios.get(`${baseUrl}&pin=V${multiplier + 6}&value=${multiplier}`);
      setSpeedMultiplier(multiplier);
    } catch (error) {
      console.error('Error changing speed multiplier:', error);
    }
  };

  const handleSliderChange = async (event) => {
    try {
      const sliderValue = event.target.value;
      await axios.get(`${baseUrl}&pin=V0&value=${sliderValue}`);
      setIsSliderSet(true);
    } catch (error) {
      console.error('Error handling slider change:', error);
    }
  };

  return (
    <div>
      <h1>Blynk Device Control</h1>
      <div>
        <h2>Device Status:</h2>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: isDeviceOnline ? 'green' : 'red' }}></div>
      </div>

      <div>
        <h2>Pattern: {currentPattern}</h2>
        <button onClick={changePattern}>Pattern</button>
      </div>

      <div>
        <h2>Select Speed</h2>
        <div>
          <button style={{ backgroundColor: speedMultiplier === 1 ? 'green' : 'white' }} onClick={() => handleSpeedMultiplierChange(1)}>1x</button>
          <button style={{ backgroundColor: speedMultiplier === 2 ? 'green' : 'white' }} onClick={() => handleSpeedMultiplierChange(2)}>2x</button>
          <button style={{ backgroundColor: speedMultiplier === 3 ? 'green' : 'white' }} onClick={() => handleSpeedMultiplierChange(3)}>3x</button>
          <button style={{ backgroundColor: speedMultiplier === 4 ? 'green' : 'white' }} onClick={() => handleSpeedMultiplierChange(4)}>4x</button>
          <button style={{ backgroundColor: speedMultiplier === 5 ? 'green' : 'white' }} onClick={() => handleSpeedMultiplierChange(5)}>5x</button>
        </div>
      </div>

      <div>
        <h2>Control</h2>
        <input type="range" min="0" max="1023" onChange={handleSliderChange} />
      </div>
    </div>
  );
};

export default BlynkControlApp;

