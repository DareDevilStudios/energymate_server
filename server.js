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
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });


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
  res.send({ user:user,message: "Login successful" });
});

app.post("/device_register", async (req, res) => {
  const { data , UserId } = req.body;

  // inserting into already set user
  const user = await Device.findOne({userId:UserId})
  // console.log(user)
  if(user)
  {
    if(user.AllDevices.map(device => device.device_name !== data.deviceName))
    {
      const deviceInfo = {
        device_name: data.deviceName,
        volt: data.volt,
        register_date: Date.now(),
      }
  
      await Device.updateOne({ userId: UserId }, { $push: { AllDevices: deviceInfo} });
      console.log("device updated")
      
      res.send({ message: "Device updated successfully" });
    }
    else{
      res.status(401).send({ message: "Device already registered" });
    }
  }
  else{
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

//fetch devicess corresponding to userid

app.post("/available_devices", async (req, res) => {
  const { userId } = req.body;
  const user = await Device.findOne({ userId: userId });
  if (!user) {
    return res.status(401).send({ message: "Authentication failed. User not found." });
  }
  console.log(user.AllDevices)
  res.send(user.AllDevices);
});

app.post("/toggle_switch", async (req, res) => {
  const { deviceName,userId } = req.body;
  const Devices = await Device.findOne({ userId: userId});
  if (!Devices) {
    return res.status(401).send({ message: "Authentication failed. User not found." });
  }
  Devices.AllDevices.map(device => {
    if(device.device_name === deviceName)
    {
      if(device.isOn){
        device.isOn = false;
        device.start_date = null;
      }
      else{
        device.isOn = true;
        device.start_date = Date.now();
      }
    }
  });
  const resullt = await Devices.save()
  console.log(resullt)
  
  res.send(resullt);
  
});


  

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
