import React, { useEffect, useState } from 'react';
import Peer from 'peerjs';
import { Typography, Layout, Modal, Button, notification, Upload, Progress, Badge } from 'antd';
import IDDisplay from './components/IDDisplay';
import FileTransfer from './components/FileTransfer';
import ChatSidebar from './components/ChatSidebar';
import './index.css';

const { Title } = Typography;
const { Content } = Layout;

// Sample list of words
const words = [
  // English Names
  "Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel",
  "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa",
  "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey",
  "Xray", "Yankee", "Zulu", "Blaze", "Storm", "Bolt", "Spark", "Falcon",
  "Horizon", "Zephyr", "Breeze", "Shadow", "Maverick", "Nimbus", "Vortex",
  "Flare", "Quartz", "Cosmos", "Orbit", "Glint", "Talon", "Frost", "Lunar",
  "Sonic", "Quasar", "Spectra", "Phoenix", "Raven", "Glacier", "Onyx", "Cobalt",
  "Nebula", "Solstice", "Inferno", "Stellar", "Titan", "Ember", "Tempest",
  "Galaxy", "Sable", "Archer", "Blizzard", "Aurora", "Sphinx", "Griffin",
  "Jaguar", "Pinnacle", "Summit", "Cascade", "Velocity", "Rogue", "Seraph",
  "Nova", "Hyperion", "Magnet", "Ivory", "Comet", "Blip", "Osprey", "Drift",
  "Forge", "Thorn", "Hawk", "Scorch", "Sage", "Flint", "Quill", "Crest",
  "Dawn", "Venom", "Wisp", "Aether", "Specter", "Rune", "Vega", "Bison",
  "Drake", "Cypher", "Apex", "Beacon", "Fusion", "Everest", "Striker",
  "Scorpion", "Radiant", "Saber", "Volt", "Tornado", "Thunder", "Fury",
  "Zenith", "Titanium", "Optimus", "Voyager", "Aspen", "Mistral", "Orion",
  "Chimera", "Hurricane", "Oracle", "Aegis", "Paladin", "Mirage", "Voyage",
  "Omega", "Artemis", "Drifter", "Ion", "Noble", "Vanguard", "Goliath",
  "Sentinel", "Blitz", "Atlas", "Sapphire", "Orchid", "Pyro", "Cyclone",
  "Thunderbolt", "Blade", "Cinder", "Boulder", "Stingray", "Typhoon",
  "Axel", "Laser", "Fission", "Thrasher", "Pulse", "Juno", "Exodus",
  "Nomad", "Tundra", "Starfire", "Ignite", "Solaris", "Banshee", "Hypernova",
  "Renegade", "Marauder", "Colossus", "Dusk", "Nightfall", "Quantum",
  "Whirlwind", "Axon", "Equinox", "Catalyst", "Helix", "Eclipse", "Serenade",
  "Valiant", "Zeus", "Viper", "Flame", "Firestorm", "Odyssey", "Valkyrie",
  "Ignis", "Eagle", "Triton", "Hydra", "Peregrine", "Starlight", "Magnetar",
  "Paragon", "Helios", "Ignition", "Genesis", "Radial", "Vertex", "Eon",
  "Spire", "Lumen", "Crimson", "Frostbite", "Synergy", "Infinity", "Axiom",
  "Flash", "Starfall", "Solace", "Guardian", "Zealot", "Spectral", "Strider",
  "Turbine", "Galaxia",

  // Hindi Names
  "Aarav", "Vivaan", "Aditya", "Krishna", "Aryan", "Kavya", "Dhruv", "Ishaan",
  "Neeraj", "Vihan", "Ananya", "Saanvi", "Kiran", "Tara", "Lakshya", "Rishi",
  "Nishant", "Parth", "Arjun", "Shiv", "Keshav", "Rohit", "Tanishq", "Tejas",
  "Yash", "Vivek", "Chaitanya", "Aditi", "Sneha", "Amrita", "Riya", "Aisha",
  "Raghav", "Shreya", "Varun", "Manish", "Gaurav", "Maya", "Anjali", "Ritika",
  "Swara", "Pooja", "Rahul", "Siddharth", "Nisha", "Pranav", "Bhumi", "Dev",
  "Aniket", "Arnav", "Anushka", "Harsh", "Akhil", "Kunal", "Suhana", "Ritu",
  "Niharika", "Kanika", "Sanya", "Navya", "Meera", "Reyansh", "Vidya", "Raj",
  "Samar", "Ayaan", "Sarthak", "Ira", "Samarth", "Gagan", "Devansh", "Vikas",
  "Piyush", "Aman", "Yuvraj", "Rana", "Priya", "Shruti", "Simran", "Mohan",
  "Vani", "Ruchi", "Sagar", "Kabir", "Harsha", "Sejal", "Veer", "Tanvi",
  "Ravindra", "Madhav", "Vikram", "Bhavya", "Jai", "Alok", "Rakesh", "Kartik",
  "Mitali", "Amar", "Sahil", "Nitin", "Vaibhav", "Sonia", "Rupesh", "Kriti",
  "Harshit", "Sukriti", "Srishti", "Yamini", "Jayant", "Prerna", "Siddhi",
  "Ajay", "Ananya", "Ramesh", "Mehul", "Shantanu", "Ekta", "Hemant", "Rajesh",
  "Rohini", "Sumit", "Tanuja", "Sudeep", "Anmol", "Vishal", "Neha", "Shivani",

  // Tamil Names
  "Arun", "Aakaash", "Karthik", "Vishnu", "Sanjay", "Hari", "Gokul", "Shiva", "Ravi",
  "Praveen", "Senthil", "Kavin", "Saravanan", "Ashok", "Dinesh", "Ganesh",
  "Sathya", "Rajesh", "Kumar", "Mohan", "Tharun", "Suresh", "Balaji", "Mani",
  "Vijay", "Raghavan", "Kamal", "Naveen", "Bharath", "Prakash", "Vignesh",
  "Madhan", "Sriram", "Ramesh", "Anand", "Vimal", "Deepak", "Aravind", "Surya",
  "Lakshmi", "Priya", "Divya", "Sangeetha", "Gayathri", "Anitha", "Kavitha", "Kavya",
  "Janani", "Meena", "Nithya", "Sathya", "Rani", "Latha", "Vidya", "Rekha",
  "Malar", "Sandhya", "Anu", "Bhuvana", "Sindhu", "Shalini", "Preethi", "MunnSamy",
  "Devi", "Uma", "Kala", "Radha", "Swathi", "Savitha", "Aarthi", "Asha",
  "Vani", "Sowmya", "Padma", "Rupa", "Suganya", "Geetha", "Renuka", "Roja"
];


// Function to generate a unique identifier
const generateUniqueID = () => {
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const suffix = Math.random().toString(36).substring(2, 8); // Generates 6 characters
  return randomWord + suffix; // Combine word and suffix
};

function App() {
  const [peerID, setPeerID] = useState('');
  const [peerInstance, setPeerInstance] = useState(null);
  const [conn, setConn] = useState(null);
  const [incomingConnection, setIncomingConnection] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [connectedID, setConnectedID] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    // Generate a unique ID using the custom function
    const uniqueID = generateUniqueID();

    const peer = new Peer(uniqueID); // Use the generated unique ID

    peer.on('open', (id) => {
      setPeerID(id);
      console.log(`Peer instance created with ID: ${id}`);
      notification.success({
        message: `Connected with ID: ${id}`,
        description: "You’re ready to sprint! 🚀",
        duration: 4
      });
    });

    peer.on('connection', (connection) => {
      console.log('Incoming connection request received:', connection);
      setIncomingConnection(connection);
      setIsModalVisible(true);
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      notification.error({ message: `Peer error: ${err.message}` });
    });

    setPeerInstance(peer);
  }, []);

  // The rest of your component code goes here...

  const handleConnect = (recipientID) => {
    console.log(`Attempting to connect to recipient ID: ${recipientID}`);
    const connection = peerInstance.connect(recipientID);

    connection.on('open', () => {
      console.log(`Connection successfully established with ID: ${recipientID}`);
      setConn(connection);
      setConnectedID(recipientID);
      setIsOnline(true);
      showSprintNotification();
    });

    connection.on('error', (err) => {
      console.error('Connection error:', err);
      notification.error({ message: `Connection failed: ${err.message}` });
    });

    connection.on('data', (data) => {
      if (data.type === 'file') {
        showFileReceivingModal(data);
      }
    });

    connection.on('close', () => {
      setIsOnline(false);
      setShowChat(false); // Hide chat when connection is closed
      notification.warning({ message: "Connection closed", description: "You have been disconnected." });
    });
  };

  const handleAcceptConnection = () => {
    console.log('Connection accepted');
    setConn(incomingConnection);
    setConnectedID(incomingConnection.peer);
    setIsOnline(true);
    setShowChat(true); // Show chat when connection is accepted

    incomingConnection.on('open', () => {
      console.log('Handshake completed, connection established');
      showSprintNotification();
    });

    incomingConnection.on('close', () => {
      setIsOnline(false);
      setShowChat(false); // Hide chat when connection is closed
      notification.warning({ message: "Connection closed", description: "You have been disconnected." });
    });

    setIsModalVisible(false);
  };

  const handleRejectConnection = () => {
    console.log('Connection rejected');
    incomingConnection.close();
    setIsModalVisible(false);
  };

  const showSprintNotification = () => {
    console.log('Displaying sprint notification for successful connection');
    notification.success({
      message: "You're In! 🚀",
      description: `Connected to ID: ${connectedID}`,
      duration: 4,
      placement: "top",
      onClose: () => console.log('Sprint message closed')
    });
  };

  const showFileReceivingModal = (file) => {
    const acceptFile = () => {
      const blob = new Blob([file.content], { type: 'application/octet-stream' });
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = file.name;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      notification.info({
        message: `File Received: ${file.name}`,
        description: "Your file is now being downloaded.",
        duration: 4,
      });
    };

    const rejectFile = () => {
      notification.warning({
        message: `File Rejected: ${file.name}`,
        description: "You have rejected the incoming file.",
        duration: 4,
      });
      incomingConnection.send({ type: 'fileRejected', name: file.name });
    };

    Modal.confirm({
      title: `Incoming File: ${file.name}`,
      content: (
        <div>
          <p>Do you want to accept this file?</p>
          <p>Size: {file.size} bytes</p>
        </div>
      ),
      onOk: acceptFile,
      onCancel: rejectFile,
    });
  };

  const handleFileUpload = (file) => {
    console.log(`Sending file: ${file.name}`);
    setUploading(true);
    const reader = new FileReader();

    reader.onload = () => {
      const data = {
        type: 'file',
        name: file.name,
        size: file.size,
        content: reader.result,
      };

      conn.send(data);
      setUploading(false);
      notification.success({
        message: `File Sent: ${file.name}`,
        description: "Your file has been successfully sent.",
        duration: 4,
      });
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    reader.readAsArrayBuffer(file);

    return false; // Prevent default upload behavior
  };

  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  return (
    <Layout
      style={{
        minHeight: '97vh',
        backgroundColor: '#fae6ca',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderRadius: '20px',
        padding: '20px'
      }}
    >
      {/* Sprintora Title Outside the Box */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
        }}
      >
        <Title
          level={2}
          style={{
            fontFamily: 'RocGrotesk',
            margin: '10px',
          }}
        >
          Sprintora
        </Title>
      </div>

      <Content
        style={{
          backgroundColor: 'var(--color-200)', // light background
          padding: '2rem',
          margin: '10px',
          marginTop: '40px',
          borderRadius: '15px',
          maxHeight: '35rem',
          boxShadow: 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset',
          position: 'relative',
          color: 'var(--text-color-primary)', // primary text color
        }}
      >
        {/* Online Status Badge */}
        <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
          <Badge
            status={isOnline ? 'success' : 'default'}
            text={isOnline ? `Online: ${connectedID}` : 'Offline'}
          />
        </div>

        {/* Display Peer ID */}
        <IDDisplay peerID={peerID} />

        {/* File Transfer Section */}
        <Upload beforeUpload={handleFileUpload} showUploadList={false}>
          <Button type="primary">Select File</Button>
        </Upload>

        {/* Uploading Progress */}
        {uploading && <Progress percent={progress} status="active" />}

        {/* Connection Handler */}
        <FileTransfer onConnect={handleConnect} />

        {/* Show Chat Button */}
        {isOnline && (
          <Button
            type="primary"
            style={{ marginTop: '1rem' }}
            onClick={() => setShowChat((prev) => !prev)}
          >
            {showChat ? 'Hide Chat' : 'Show Chat'}
          </Button>
        )}

        {/* Chat Sidebar */}
        {showChat && <ChatSidebar peer={peerInstance} conn={conn} showChat={showChat} />}

        {/* Modal for Incoming Connection */}
        <Modal
          title="Incoming Connection"
          visible={isModalVisible}
          onCancel={handleRejectConnection}
          footer={[
            <Button key="reject" onClick={handleRejectConnection}>
              Reject
            </Button>,
            <Button key="accept" type="primary" onClick={handleAcceptConnection}>
              Accept
            </Button>,
          ]}
        >
          <p>Someone is trying to connect to you!</p>
        </Modal>
      </Content>
    </Layout >
  );
}

export default App;
