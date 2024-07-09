import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, PermissionsAndroid, Platform, Alert } from "react-native";
import Text from "../components/text";
import LinearGradient from "react-native-linear-gradient";
// import { launchImageLibrary, launchCamera } from 'react-native-image-picker';


const SpecificSurvey = ({ route }) => {
  const { title } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);
  
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Gallery Access Permission',
          message: 'This app needs access to your gallery to upload photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
    );
    console.log(granted);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleImagePick = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        Alert.alert('Permission Denied', 'Permission to access the gallery is required.');
        throw new Error('Gallery permission denied');
      }

      const response = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 1,
      });

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        throw new Error(response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri);
      } else {
        console.log('Unknown error occurred');
        throw new Error('Unknown error occurred');
      }
    } catch (error) {
      console.log('Error while picking image: ', error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.gradientContainer}>
          <View
            style={[
              styles.greyGradient,
              styles.gradientPosition,
            ]}
          />
          <LinearGradient
            style={[styles.gradient, styles.gradientPosition]}
            locations={[0, 1]}
            colors={["#072b69", "#0d54cf"]}
            useAngle={true}
            angle={270}
          />
        </View>
        <View style={styles.infoContainer}>
          <Image
            style={styles.frameIcon}
            resizeMode="cover"
            source={require("../images/tick-1.png")}
          />
          <Text style={[styles.text1, styles.typo]}>
            Location Verified
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.card} onPress={handleImagePick}>
        <View style={styles.uploadContainer}>
          <Image
            style={styles.groupIcon}
            resizeMode="cover"
            source={selectedImage ? { uri: selectedImage } : require("../images/upload.png")}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.text2, styles.typo]}>Upload Photo</Text>
            <Text style={[styles.text3, styles.typo]}>
              Take one or more photos
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Navigate to the next screen
        }}
      >
        <Text style={[styles.next, styles.typo]}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0F0",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    padding: 20,
  },
  title: {
    fontSize: 13,
    marginBottom: 10,
    color: 'black',
    fontWeight: '600',
  },
  gradientContainer: {
    width: "100%",
    marginBottom: 10,
  },
  gradient: {
    width: "50%",
    height: "100%",
    backgroundColor: "transparent",
  },
  greyGradient: {
    width: "100%",
    backgroundColor: "#E0E0E0",
    opacity: 0.8,
  },
  gradientPosition: {
    height: 12,
    borderRadius: 15,
    top: 0,
    left: 0,
    position: "absolute",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 10,
  },
  frameIcon: {
    width: 20,
    height: 20,
    marginRight: 7,
  },
  text1: {
    fontSize: 13,
    color: "#5cb85c",
    marginTop: 2,
  },
  uploadContainer: {
    flexDirection: "column", 
    alignItems: "center", 
    marginTop: 30,
    marginBottom: 30,
  },
  groupIcon: {
    width: 50,
    height: 50,
    marginBottom: 10, // Add margin bottom for spacing
  },
  textContainer: {
    alignItems: "center", // Center text horizontally
  },
  text2: {
    fontSize: 16,
    fontWeight: "600",
    color: 'black',
  },
  text3: {
    fontSize: 14,
    color: "#777",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  next: {
    fontSize: 16,
    color: "white",
  },
});

export default SpecificSurvey;
