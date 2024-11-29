import React, { createContext, useState, useContext } from 'react';

const CheckInContext = createContext();

export const CheckInProvider = ({ children }) => {
  const [checkIns, setCheckIns] = useState({});

  const updateCheckIn = (eventId, checkedIn) => {
    setCheckIns(prevCheckIns => ({
      ...prevCheckIns,
      [eventId]: checkedIn,
    }));
  };

  return (
    <CheckInContext.Provider value={{ checkIns, updateCheckIn }}>
      {children}
    </CheckInContext.Provider>
  );
};

export const useCheckIn = () => useContext(CheckInContext);
