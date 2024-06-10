import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BlynkControlApp.css'; // Import CSS file for styling

const BlynkControlApp = () => {
  const [currentPattern, setCurrentPattern] = useState("OFF");
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isSliderSet, setIsSliderSet] = useState(false);
  const [isDeviceOnline, setIsDeviceOnline] = useState(false);
  const [buttonText, setButtonText] = useState("Pattern");
  const [sliderValue, setSliderValue] = useState(0);

  const blynkAuthToken = 'uRxhxeAdh9hS0NkU9ix_lqlcpEb-EW7a';
  const blynkServerAddress = 'http://sgp1.blynk.cloud';
  const getApiUrl = `${blynkServerAddress}/external/api/get?token=${blynkAuthToken}&pin=V5`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(getApiUrl);
        setCurrentPattern(response.data[0]);
        setButtonText(`Change Pattern (${response.data[0]})`);
      } catch (error) {
        console.error('Error fetching current pattern:', error);
      }
    };

    fetchData();
  }, [getApiUrl]);

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
    
      await axios.get(`${blynkServerAddress}/external/api/update?token=${blynkAuthToken}&pin=V1&value=${nextPattern}`);
      setCurrentPattern(nextPattern);
      setButtonText(`Change Pattern (${nextPattern})`);
    } catch (error) {
      console.error('Error changing pattern:', error);
    }
  };

  const handleSpeedMultiplierChange = async (multiplier) => {
    try {
      await axios.get(`${blynkServerAddress}/external/api/update?token=${blynkAuthToken}&pin=V${multiplier + 6}&value=${multiplier}`);
      setSpeedMultiplier(multiplier);
    } catch (error) {
      console.error('Error changing speed multiplier:', error);
    }
  };

  const handleSliderChange = async (event) => {
    try {
      const value = parseInt(event.target.value, 10);
      setSliderValue(value);
      await axios.get(`${blynkServerAddress}/external/api/update?token=${blynkAuthToken}&pin=V0&value=${value}`);
      setIsSliderSet(true);
    } catch (error) {
      console.error('Error handling slider change:', error);
    }
  };

  return (
    <div className="centered-container">
      <h1>Blynk Device Control</h1>
      <div className="centered-container">
        <h2>Device Status:</h2>
        <div className={`status-indicator ${isDeviceOnline ? 'online' : 'offline'}`}></div>
      </div>

      <div className="centered-container">
        <h2>Change Pattern</h2>
        <button disabled={sliderValue !== 0} className="change-pattern-button" onClick={changePattern}>{buttonText}</button>
      </div>

      <div className="centered-container">
        <h2>Select Speed</h2>
        <div className="speed-buttons">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} disabled={sliderValue !== 0} className={`speed-button ${speedMultiplier === value ? 'active' : ''}`} onClick={() => handleSpeedMultiplierChange(value)}>{value}x</button>
          ))}
        </div>
      </div>

      <div className="centered-container">
        <h2>Control</h2>
        <input type="range" min="0" max="1023" onChange={handleSliderChange} />
      </div>
    </div>
  );
};

export default BlynkControlApp;
