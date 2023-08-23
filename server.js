import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import User from "./models/user.js";
import Device from "./models/device.js";
const app = express();
app.use(bodyParser.json()); // Add this line to parse JSON data

mongoose.connect('mongodb+srv://energymate005:energymate005@energymate.b6m5nd8.mongodb.net/energymate?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    startHourlyUnitCalculation();
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });


// Function to calculate units for each device and total units every hour
function calculateUnitsAndTotal() {
  Device.find({})
    .then((devices) => {
      devices.forEach((device) => {
        let tot_units = 0;
        let today_units = 0;
        let monthly_units = 0;

        device.AllDevices.forEach((deviceData) => {
          // function generateRandomReading() {
          //   // Generate a random reading between 8 and 18 kWh
          //   return Math.random() * 50 + 50;
          // }

          // for (let i = 0; i < 12; i++) {
          //   const reading = generateRandomReading();
          //   deviceData.monthly_unit.push(reading);
          // }

          if (deviceData.isOn) {
            const current = 0.05; // Use absolute value
            const start_date = deviceData.start_date;
            const current_date = Date.now() / 1000; // Use Date.now() and convert to seconds
            const time_diff = Math.abs((start_date.getTime() / 1000 - current_date) / (60 * 60)); // Use absolute value and convert to hours
            const unit_calc = Number(Number((current * time_diff * deviceData.volt) / 1000).toFixed(5)); // Round to two decimal places and parse as number
            deviceData.units += unit_calc;
            today_units = deviceData.units
            monthly_units = deviceData.units

            // console.log("Device: " + deviceData.device_name);
            // console.log("Current: " + current);
            // console.log("Start Date: " + start_date);
            // console.log("Current Date: " + current_date);
            // console.log("Time Difference: " + time_diff);
            // console.log("Units: " + deviceData.units);
            // console.log("today_units: " + today_units);
            // console.log("monthly_units: " + monthly_units);
          }

          tot_units += deviceData.units;
        });

        device.total_units = tot_units;
        console.log("Total Units: " + tot_units);

        let billAmount = 0;

        // Define the rates for each unit range
        const rates = [1.5, 3.15, 3.95, 5.0, 6.8, 8.0, 8.0];

        // Define the limits for each unit range
        const limits = [40, 50, 100, 150, 200, 250];

        // Loop through the rates and limits
        for (let i = 0; i < rates.length; i++) {
          // If the total units are less than or equal to the current limit, multiply by the current rate and break the loop
          if (tot_units <= limits[i] || i === rates.length - 1) {
            billAmount += tot_units * rates[i];
            break;
          } else {
            // Otherwise, subtract the current limit from the total units and multiply by the current rate
            billAmount += limits[i] * rates[i];
            tot_units -= limits[i];
          }
        }

        device.total_bill = billAmount.toFixed(3);
        

        // Check if 24 hours have passed since the register date
        const twentyFourHoursPassed = (Date.now() - device.register_date) / (1000 * 60 * 60) >= 0.5;
        // console.log("is true : " + twentyFourHoursPassed)

        if (twentyFourHoursPassed) {
          // Update today's units and reset it for the next 24 hours
          device.AllDevices.forEach((deviceData) => {
            deviceData.today_unit.push(deviceData.units);
            console.log("today_array : " + deviceData.today_unit)
            deviceData.units = 0;
          });

          // Update monthly units
          // device.AllDevices.forEach((deviceData) => {
          //   deviceData.monthly_unit.push(today_units);
          // });

          // Reset today's units for the next 24 hours
          today_units = 0;
        }

        device.save()
          .then((savedDevice) => {
            console.log("Device updated:");
          })
          .catch((error) => {
            console.error("Error updating device:", error);
          });
      });
    })
    .catch((error) => {
      console.error("Error retrieving devices:", error);
    });
}


function startHourlyUnitCalculation() {
  // Calculate units and total every hour
  setInterval(calculateUnitsAndTotal, 300000); // Run every hour (3600000 milliseconds)
}


app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  console.log(email, password, username)

  const user = new User({
    email: email,
    password: password,
    username: username,
  })

  await user.save()

  // Perform any necessary operations with the received data
  // For example, you can save the email to a database

  // Send a response back to the client
  res.send({ message: "Signup successful" });
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email, password: password });
  if (!user) {
    return res.status(401).send({ message: "Authentication failed. User not found." });
  }
  console.log("login successful")
  // Send a response back to the client
  res.send({ user: user, message: "Login successful" });
});

app.post("/device_register", async (req, res) => {
  const { data, UserId } = req.body;

  // inserting into already set user
  const user = await Device.findOne({ userId: UserId })
  // console.log(user)
  if (user) {
    if (user.AllDevices.map(device => device.device_name !== data.deviceName)) {
      const deviceInfo = {
        device_name: data.deviceName,
        volt: data.volt,
        register_date: Date.now(),
      }

      await Device.updateOne({ userId: UserId }, { $push: { AllDevices: deviceInfo } });
      console.log("device updated")

      res.send({ message: "Device updated successfully" });
    }
    else {
      res.status(401).send({ message: "Device already registered" });
    }
  }
  else {
    const device = new Device({
      userId: UserId,
      AllDevices: {
        device_name: data.deviceName,
        volt: data.volt,
      },
    })
    const result = await device.save();

    console.log(result)
    res.send({ message: "Device registered successfully" });
  }
});

app.post("/device_details", async (req, res) => {
  const { userId } = req.body;
  const user = await Device.findOne({ userId: userId });
  if (!user) {
    return res.status(401).send({ message: "Authentication failed. User not found." });
  }
  console.log(user)
  res.send({ data: user });
})

app.post("/delete_device", async (req, res) => {
  const { _id, userId } = req.body;
  console.log("id is : " + _id);
  const devices = await Device.findOne({ userId: userId })
  if (!devices) {
    return res.status(401).send({ message: "devices not found" });
  }

  devices.AllDevices.map(device => {
    if (JSON.stringify(device._id) == JSON.stringify(_id)) {
      device.isOn = false;
      device.status = 'requested';
    }
  })


  await devices.save()

  res.send({ data: devices });
})

app.post("/available_devices", async (req, res) => {
  const { userId } = req.body;
  const user = await Device.findOne({ userId: userId });
  if (!user) {
    return res.status(401).send({ message: "Authentication failed. User not found." });
  }

  const actualDevices = user.AllDevices.filter(device => device.status !== 'requested');
  // console.log(user.AllDevices)
  res.send(actualDevices);
});

app.post("/PowerCalculation", async (req, res) => {
  const { userId } = req.body;
  const user = await Device.findOne({ userId: userId });
  if (!user) {
    return res.status(401).send({ message: "Authentication failed. User not found." });
  }

  let tot_units = 0;
  let tot_bill = 0;

  user.AllDevices.forEach((device, index) => {


    if (device.isOn === true) {
      const current = 0.05 // Use absolute value
      const start_date = new Date(device.start_date);
      const current_date = Date.now() / 1000; // Use Date.now() and convert to seconds
      const time_diff = Math.abs((start_date.getTime() / 1000 - current_date) / (60 * 60)); // Use absolute value and convert to hours

      const unit_calc = Number(Number((current * time_diff * device.volt) / 1000).toFixed(5)); // Round to two decimal places and parse as number
      device.units += unit_calc;

      console.log("device: " + device.device_name)
      console.log("current: " + current)
      console.log("start_date: " + start_date)
      console.log("current_date: " + current_date)
      console.log("time_diff: " + time_diff)
      console.log("units: " + device.units)
    }

    tot_units += device.units;
    console.log("total units each time " + tot_units)

  });


  // Calculate bill based on consumption units
  let billAmount = 0;

  // Define the rates for each unit range
  const rates = [1.5, 3.15, 3.95, 5.0, 6.8, 8.0, 8.0];

  // Define the limits for each unit range
  const limits = [40, 50, 100, 150, 200, 250];

  // Loop through the rates and limits
  for (let i = 0; i < rates.length; i++) {
    // If the total units are less than or equal to the current limit, multiply by the current rate and break the loop
    if (tot_units <= limits[i] || i === rates.length - 1) {
      billAmount += tot_units * rates[i];
      break;
    } else {
      // Otherwise, subtract the current limit from the total units and multiply by the current rate
      billAmount += limits[i] * rates[i];
      tot_units -= limits[i];
    }
  }

  tot_bill = billAmount.toFixed(3);

  user.total_units = tot_units;
  user.total_bill = tot_bill;

  await user.save();


  res.send({ units: tot_units, bill: tot_bill });
});



app.post("/toggle_switch", async (req, res) => {
  const { deviceName, userId } = req.body;
  const Devices = await Device.findOne({ userId: userId });
  if (!Devices) {
    return res.status(401).send({ message: "Authentication failed. User not found." });
  }
  Devices.AllDevices.map(device => {
    if (device.device_name === deviceName) {
      if (device.isOn) {
        device.isOn = false;
        device.start_date = null;
      }
      else {
        device.isOn = true;
        device.start_date = Date.now();
        // infinite loop
      }
    }
  });
  const resullt = await Devices.save()
  console.log(resullt)

  res.send(resullt);

});


const port = process.env.PORT || 3001;


// Start the server
app.listen(port, () => {
  console.log("Server is running on port " + port + ".");
});
