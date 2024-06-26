import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdRefresh } from 'react-icons/md';
import './BlynkControlApp.css';

const BlynkControlApp = () => {
  const [currentPattern, setCurrentPattern] = useState("OFF");
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isSliderSet, setIsSliderSet] = useState(false);
  const [isDeviceOnline, setIsDeviceOnline] = useState(false);
  const [buttonText, setButtonText] = useState("Pattern");
  const [sliderValue, setSliderValue] = useState(0);

  const blynkAuthToken = 'uRxhxeAdh9hS0NkU9ix_lqlcpEb-EW7a';
  const blynkServerAddress = 'https://sgp1.blynk.cloud';
  const getApiUrl = `${blynkServerAddress}/external/api/get?token=${blynkAuthToken}&pin=V5`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(getApiUrl);
        setCurrentPattern(response.data);
        setButtonText(`${response.data}`);
      } catch (error) {
        console.error('Error fetching current pattern:', error);
      }
    };

    const intervalId = setInterval(fetchData, 100);

    return () => clearInterval(intervalId);
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
      const patterns = [1, 2, 3, 4];
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

  const resetSlider = async () => {
    try {
      setSliderValue(0);
      await axios.get(`${blynkServerAddress}/external/api/update?token=${blynkAuthToken}&pin=V0&value=0`);
      setIsSliderSet(false);
    } catch (error) {
      console.error('Error resetting slider:', error);
    }
  };

  return (
    <div className="centered-container">
      <h1 className='text-4xl font-bold mb-4 mt-16'>Wow Lush</h1>
      <div className="centered-container">
        <h2>Device Status:</h2>
        <div className={`status-indicator ${isDeviceOnline ? 'online' : 'offline'}`}></div>
      </div>

      <div className="centered-container">
        <h2 className='text-2xl font-bold mb-4'>Change Pattern</h2>
        <button disabled={sliderValue !== 0} className={`bg-blue-500 text-white px-4 w-80 py-2 rounded ${sliderValue !== 0 ? 'button-disabled' : ''}`} onClick={changePattern}>{buttonText}</button>
      </div>

      <div className="centered-container">
        <h2 className='text-2xl font-bold mb-4'>Select Speed</h2>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button 
              key={value} 
              disabled={sliderValue !== 0} 
              className={`px-4 py-2 rounded ${speedMultiplier === value ? 'bg-green-500 text-white' : 'bg-gray-200'} ${sliderValue !== 0 ? 'button-disabled' : ''}`} 
              onClick={() => handleSpeedMultiplierChange(value)}
            >
              {value}x
            </button>
          ))}
        </div>
      </div>

      <div className="centered-container">
        <h2 className='text-2xl font-bold mb-4'>Manual Control</h2>
        <div className="flex items-center space-x-4">
          <input type="range" min="0" max="1023" value={sliderValue} onChange={handleSliderChange} className="w-80" />
          <button onClick={resetSlider} className="bg-red-500 text-white p-2 rounded">
            <MdRefresh size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlynkControlApp;
