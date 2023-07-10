// Server-side code

// Assuming the energy consumption formula is: Energy = Voltage * Current * Time

// Function to calculate energy consumption
function calculateEnergyConsumption(voltage, current, time) {
    // Convert voltage to float
    voltage = parseFloat(voltage);
  
    // Convert current to float
    current = parseFloat(current);
  
    // Convert time to float
    time = parseFloat(time);
  
    // Calculate energy consumption
    const energy = voltage * current * time;
  
    return energy;
  }
  
  // Example usage
//   const deviceVoltage = // Get voltage from the database for the specific device
//   const deviceCurrent = Math.random() * 10; // Generate a random current value
//   const registrationTime = new Date(); // Get the initial registration time
  
  // Calculate the time difference in milliseconds
  const currentTime = new Date();
  const timeDifference = currentTime - registrationTime;
  
  // Convert the time difference to hours
  const timeDifferenceHours = timeDifference / (1000 * 60 * 60);
  
  // Call the function to calculate energy consumption
  const energyConsumption = calculateEnergyConsumption(deviceVoltage, deviceCurrent, timeDifferenceHours);
  
  // Print the result
  console.log("Energy Consumption:", energyConsumption);
  