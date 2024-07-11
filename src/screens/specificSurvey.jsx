import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert, Modal, ScrollView, Switch } from "react-native";
import Text from "../components/text";
import LinearGradient from "react-native-linear-gradient";
import { launchImageLibrary } from 'react-native-image-picker';
import { request, PERMISSIONS } from 'react-native-permissions';
import { BlurView } from '@react-native-community/blur';


const SpecificSurvey = ({ route }) => {
  const { title } = route.params;
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [sendNowActive, setSendNowActive] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false); // State for success modal



  const requestPermissions = (permission) => {
    return request(permission).then(result => {
      console.log("Result: " + result);
      return result;  
    }).catch(error => {
      console.log("Permission request error: ", error);
      throw error;  
    });
  };

  const handleImagePick = async () => {
    try {
      let hasPermissions = await requestPermissions(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
      console.log("Perm: " + hasPermissions);

      if (hasPermissions !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access the gallery is required.');
        throw new Error('Gallery permission denied');
      }

      const response = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 1,
        selectionLimit: 0, // 0 means unlimited selection
      });

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        throw new Error(response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setSelectedImages([...selectedImages, ...response.assets.map(asset => asset.uri)]);
      } else {
        console.log('Unknown error occurred');
        throw new Error('Unknown error occurred');
      }
    } catch (error) {
      console.log('Error while picking image: ', error);
    }
  };

  const removeImage = (uri) => {
    setSelectedImages(selectedImages.filter(imageUri => imageUri !== uri));
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleSubmitModal = () => {
    setIsSubmitModalVisible(!isSubmitModalVisible);
  };

  const toggleSendNow = () => {
    setSendNowActive(!sendNowActive);
  };

  const toggleSuccessModal = () => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
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

        <View style={[styles.uploadContainer, styles.card]}>
          {selectedImages.length === 0 ? (
            <Image
              style={styles.groupIcon}
              resizeMode="cover"
              source={require("../images/upload.png")}
            />
          ) : (
            <View style={styles.selectedImagesContainer}>
              {selectedImages.slice(0, 2).map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    style={styles.selectedImage}
                    resizeMode="cover"
                    source={{ uri }}
                  />
                  <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(uri)}>
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {selectedImages.length > 2 && (
                <TouchableOpacity onPress={toggleModal}>
                  <Text style={styles.moreImagesText}>+{selectedImages.length - 2} more</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {selectedImages.length > 0 && (
            <TouchableOpacity style={styles.addMoreButton} onPress={handleImagePick}>
              <Text style={styles.addMoreButtonText}>Add more +</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleImagePick}>
            <View style={styles.textContainer}>
              <Text style={[styles.text2, styles.typo]}>Upload Photo</Text>
              <Text style={[styles.text3, styles.typo]}>
                Take one or more photos
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      <TouchableOpacity style={styles.nextButton} onPress={toggleSubmitModal}>
        <Text style={[styles.next, styles.typo]}>Next</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <BlurView
          style={styles.blur}
          blurType="light"
          blurAmount={5}
          reducedTransparencyFallbackColor="white"
        />
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScrollView}>
              {selectedImages.map((uri, index) => (
                <View key={index} style={styles.modalImageWrapper}>
                  <Image
                    style={styles.modalImage}
                    resizeMode="cover"
                    source={{ uri }}
                  />
                  <TouchableOpacity style={styles.removeImageButtonModal} onPress={() => removeImage(uri)}>
                    <Text style={styles.removeImageTextModal}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeModalButton} onPress={toggleModal}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Success Modal */}
      <Modal visible={isSuccessModalVisible} transparent={true} animationType="fade">
        <BlurView
          style={styles.blur}
          blurType="light"
          blurAmount={5}
          reducedTransparencyFallbackColor="white"
        />
        <View style={styles.modalContainer}>
          <View style={styles.innerModal}>
            <Image
              style={styles.tickImage}
              source={require('../images/tick-1.png')}
              resizeMode="cover"
            />
            <Text style={styles.successText}>Survey Submitted Successfully</Text>
            <TouchableOpacity style={styles.closeButton} onPress={toggleSuccessModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
    </Modal>


      {/* Survey Modal */}
        <Modal visible={isSubmitModalVisible} transparent={true} animationType="fade">
          <BlurView
            style={styles.blurBackground}
            blurType="light"
            blurAmount={2}
            reducedTransparencyFallbackColor="white"
          />
            <View style={styles.bottomModal}>
              <View style={styles.surveyParent}>
                <Text style={styles.survey}>Survey</Text>
                <TouchableOpacity onPress={toggleSubmitModal}>
                  <Image
                    style={styles.iconX}
                    resizeMode="cover"
                    source={require("../images/cross.png")}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.rectangle} />
              <View style={styles.textGroup}>
                <Text style={styles.text4}>Recurring Reload Copying 2 Survey Machine</Text>
                <View style={styles.frameView}>
                  <TouchableOpacity style={styles.sendNowParent} onPress={toggleSendNow}>
                    <Text style={styles.sendNow}>Send Now</Text>
                    <View style={styles.switchContainer}>
                      <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={sendNowActive ? '#007bff' : '#f4f3f4'}
                        onValueChange={toggleSendNow}
                        value={sendNowActive}
                        style={styles.switch} 
                        touchSoundDisabled={true}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={[styles.text5, sendNowActive ? styles.textActive : styles.textInactive]}>
                    {sendNowActive ? "Results will be sent now." : "You can send later."}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.typebuttonType2secondary1} onPress={() => {
                toggleSubmitModal(); // Close the submit modal
                toggleSuccessModal(); // Show success modal
              }}>
                <Text style={styles.submitSurveyText}>Submit Survey</Text>
              </TouchableOpacity>
            </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0F0",
  },
  blur: {
    position: "absolute",
    top: 0, left: 0, bottom: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
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
    marginBottom: 30,
    paddingVertical: 50,
  },
  groupIcon: {
    width: 50,
    height: 50,
    marginBottom: 10, 
  },
  textContainer: {
    alignItems: "center", 
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
  selectedImagesContainer: {
    flexDirection: "row",
  },
  selectedImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  removeImageButton: {
    position: "absolute",
    top: -3,
    right: 7,
    backgroundColor: "black",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "white",
    fontSize: 17,
    paddingBottom: 5,
  },
  removeImageButtonModal: {
    position: "absolute",
    top: -4,
    right: -2,
    backgroundColor: "black",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageTextModal: {
    color: "white",
    fontSize: 17,
    paddingBottom: 5,
  },
  moreImagesText: {
    fontSize: 14,
    color: "#777",
    alignSelf: "center",
    marginTop: 25,
  },
  addMoreButton: {
    backgroundColor: "#ffffff",
    padding: 7,
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 50,
    marginVertical: 10,
  },
  addMoreButtonText: {
    fontSize: 14,
    color: "blue",
  },
  nextButton: {
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
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 16,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  modalScrollView: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  modalImageWrapper: {
    position: "relative",
    margin: 5,
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  closeModalButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginRight: 10,
  },
  closeModalButtonText: {
    fontSize: 16,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  tickImage: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
  closeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Styling for the 'Next' Button popup modal
  blurBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bottomModal: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  surveyParent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  survey: {
    fontSize: 24,
    color: 'black',
    fontFamily: "SourceSans3-Bold",
  },
  iconX: {
    width: 25,
    height: 25,
  },
  textGroup: {
    marginBottom: 20,
  },
  text4: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
    fontFamily: 'Outfit-SemiBold',
  },
  frameView: {
    flexDirection: "column",
    marginTop: 10,
  },
  sendNowParent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  sendNow: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'Outfit-SemiBold',
  },
  text5: {
    fontSize: 13,
    marginBottom: 10,
  },
  switchContainer: {
    justifyContent: 'center', 
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.3 }], 
  },
  textActive: {
    color: "#007bff", // blue color
  },
  textInactive: {
    color: "#555", // grey color
  },
  rectangle: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  typebuttonType2secondary1: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitSurveyText: {
    fontSize: 16,
    color: "white",
  },
});

export default SpecificSurvey;
