import React, { useEffect, useState } from 'react';
import Peer from 'peerjs';
import { Typography, Layout, Modal, Button, notification, Upload, Progress, Badge } from 'antd';
import IDDisplay from './components/IDDisplay';
import FileTransfer from './components/FileTransfer';

const { Title } = Typography;
const { Content } = Layout;

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

  useEffect(() => {
    const peer = new Peer();

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
      notification.warning({ message: "Connection closed", description: "You have been disconnected." });
    });
  };

  const handleAcceptConnection = () => {
    console.log('Connection accepted');
    setConn(incomingConnection);
    setConnectedID(incomingConnection.peer);
    setIsOnline(true);

    incomingConnection.on('open', () => {
      console.log('Handshake completed, connection established');
      showSprintNotification();
    });

    incomingConnection.on('close', () => {
      setIsOnline(false);
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

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fae6ca', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Content style={{ backgroundColor: '#fbc490', padding: '2rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Sprintora</Title>

        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <Badge
            status={isOnline ? 'success' : 'default'}
            text={isOnline ? `Online: ${connectedID}` : 'Offline'}
          />
        </div>

        <IDDisplay peerID={peerID} />

        {/* File Transfer Section */}
        <Upload beforeUpload={handleFileUpload} showUploadList={false}>
          <Button type="primary">Select File</Button>
        </Upload>

        {uploading && (
          <Progress percent={progress} status="active" />
        )}

        <FileTransfer onConnect={handleConnect} />

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
    </Layout>
  );
}

export default App;
