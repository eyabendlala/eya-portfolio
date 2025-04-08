import React, { useState } from 'react';
import {
  ChakraProvider,
  theme,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Container,
  Box,
} from '@chakra-ui/react';
import addNotification from 'react-push-notification';


export async function handlePublierEmploiClick() {
  // Check if the Notification API is available
  if (!("Notification" in window)) {
    alert("Browser does not support notifications");
    return;
  }

  // Request permission if needed
  if (Notification.permission === "granted") {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // Permission granted, show the notification
        addNotification({
          title: 'khedma', 
          message: 'Merci de vous abonner. Restez à jour!',
          duration: 5000,
          image: '/media/images/logokhedmanotification.png',
         
          style: {
            backgroundColor: 'blue',
            color: 'white',
            border: '2px solid red',
            // Add other CSS properties as needed to style your notification.
          }
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  } else {
    // Permission already granted, show the notification
    addNotification({
      title: 'khedma', 
      message: 'Merci de vous abonner. Restez à jour!',
      duration: 5000,
      image: '/media/images/logokhedmanotification.png',
      native: true
    });
  }
}

function Notification({ dismissNotification}) {
  const [userResponded, setUserResponded] = useState(false);

 
  function enableNotifsAndClose() {
    handlePublierEmploiClick(); // Call the function to request notification permission
    setUserResponded(true);
    dismissNotification(); // Dismiss the modal when the user interacts with it
  }

  function disableNotifsAndClose() {
    setUserResponded(true);
    dismissNotification(); // Dismiss the modal when the user interacts with it
  }

  return !userResponded && Notification.permission !== "granted" ? (
    <ChakraProvider theme={theme}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999, // Ensure it's above everything else
        }}
      >
        <Container>
          <Alert
            status="success"
            bg="white" // White background
            borderRadius="lg" // Rounded corners
            boxShadow="lg" // Shadow
          >
            <AlertIcon />
            <Box>
              <AlertTitle>Notification</AlertTitle>
              <AlertDescription>
                Ne manquez plus rien! <br /> Abonnez-vous pour les dernières opportunités d'emploi.
              </AlertDescription>
            </Box>
            <Button
              colorScheme="blue" // Blue button color
              size="sm"
              onClick={enableNotifsAndClose}
              borderRadius="full" // Rounded button
            >
              Autoriser!
            </Button>
            <Button
              colorScheme="gray" // Gray button color
              size="sm"
              onClick={disableNotifsAndClose}
              borderRadius="full" // Rounded button
            >
              Non merci!
            </Button>
          </Alert>
        </Container>
      </div>
    </ChakraProvider>
  ) : (
    <></>
  );
}

export default Notification;
