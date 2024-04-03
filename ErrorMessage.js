// Component for displaying error messages with auto-clear functionality after a set duration.

import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const ErrorMessage = ({ message, setErrorMessage }) => {

  useEffect(() => {
    if (message != "") {
      const timerId = setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      return () => clearTimeout(timerId);
    }
  }, [message]);

  const errorMessageStyle = {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: 20,
    textAlign: "center",
    fontSize: 15,
  };

  return (
    <Text style={errorMessageStyle}>
      {message}
    </Text>
  );
};

export default ErrorMessage;
