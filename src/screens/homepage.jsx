import React, { useState } from "react";
import { Image, StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import TapOnMyLocationSuggested from "./tapOnLocation";
import Text from '../components/text';

const Homepage = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const cardsData = [
    {
      title: "Recurring Reload Copying 2 Survey Machine",
      location: "+ 2023 Locations",
      info1: "Ends May 31st 2024",
      info2: "3 hours ago",
      shapeText: "125",
    },
    {
      title: "Another Survey Title",
      location: "+ 1500 Locations",
      info1: "Ends June 15th 2024",
      info2: "5 hours ago",
      shapeText: "200",
    },
    {
      title: "Survey XYZ",
      location: "+ 1200 Locations",
      info1: "Ends July 5th 2024",
      info2: "1 day ago",
      shapeText: "90",
    },
    {
      title: "Annual Customer Feedback",
      location: "+ 3000 Locations",
      info1: "Ends August 10th 2024",
      info2: "2 days ago",
      shapeText: "300",
    },
    {
      title: "Product Satisfaction Survey",
      location: "+ 1800 Locations",
      info1: "Ends Sep 20th 2024",
      info2: "1 week ago",
      shapeText: "180",
    },
    {
      title: "Employee Engagement Survey",
      location: "+ 2500 Locations",
      info1: "Ends Oct 15th 2024",
      info2: "2 weeks ago",
      shapeText: "250",
    },
    {
      title: "Customer Experience Evaluation",
      location: "+ 2800 Locations",
      info1: "Ends Nov 5th 2024",
      info2: "3 weeks ago",
      shapeText: "280",
    },
    {
      title: "Market Research Survey",
      location: "2102 Vons REDONDO BEACH",
      info1: "Ends Dec 1st 2024",
      info2: "1 month ago",
      shapeText: "200",
    },
  ];

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  
  const handleSearchChange = (text) => {
    setSearchText(text);
    // Implement your search logic here if needed
  };

  const handleLocationSelect = (locationTitle) => {
    setSearchText(locationTitle || ''); 
    toggleModal(); 
  };

  const handleCardPress = (card) => {
    console.log(card);
    if (card && card.title) {
      navigation.navigate("SpecificSurvey", {
        title: card.title,
        location: card.location,
      });
    } else {
      console.warn("Card title is undefined or not found:", card);
    }
  };

  const filteredCards = searchText.trim() === ""
    ? cardsData 
    : cardsData.filter(card =>
        card.title.toLowerCase().includes(searchText.toLowerCase()) ||
        card.location.toLowerCase().includes(searchText.toLowerCase())
    );


  return (
    <View style={styles.homepage}>
      <Image
        style={styles.menuIcon}
        resizeMode="cover"
        source={require("../images/drawer-icon.png")}
      />
      <View style={styles.logoContainer}>
        <Image
          source={require('../images/logo-1.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Image
        style={styles.vectorIcon}
        resizeMode="cover"
        source={require("../images/vector1.png")}
      />
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Image
            style={styles.searchIcon}
            resizeMode="cover"
            source={require("../images/search-icon.png")}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Location / Number#"
            placeholderTextColor={"#666666"}
            value={searchText}
            onChangeText={handleSearchChange}
            autoFocus={false} 
            autoCorrect={false} 
            autoCapitalize="none" 
            keyboardType="default" 
          />
        </View>
        <TouchableOpacity onPress={toggleModal}>
          <LinearGradient
            style={styles.gradientBackground}
            locations={[0, 1]}
            colors={["#0d54cf", "#072b69"]}
            useAngle={true}
            angle={180}
          >
            <Image
              style={styles.locationIcon}
              resizeMode="cover"
              source={require("../images/location-icon.png")}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={styles.surveysParent}>
        <Text style={[styles.surveys, styles.textTypo1]}>Surveys</Text>
        <Text style={styles.responses}>Responses</Text>
      </View>


      {/* Repeatable card view */}
      <ScrollView style={styles.cardScrollView}>
        {filteredCards.map((card, index) => (
            <TouchableOpacity key={index} activeOpacity={0.95}>
                <View style={styles.cardContainer}>
                    <TouchableOpacity onPress={() => handleCardPress(card)}>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{card.title}</Text>
                        <Text style={styles.cardlocation}>{card.location}</Text>
                        <View style={[styles.infoContainer, { width: card.info1.length * 7.3 }]}>
                            <Text style={styles.infoText}>{card.info1}</Text>
                        </View>
                        <View>
                            <Text style={styles.lightGrayText}>{card.info2}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.shapeContainer}>
                        <Text style={styles.shapeText}>{card.shapeText}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        ))}
        </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalOverlay}>
            <View style={styles.modalWrapper}>
                <TapOnMyLocationSuggested onClose={toggleModal} onLocationSelect={handleLocationSelect}/>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  homepage: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    paddingTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent to simulate blur
    justifyContent: 'flex-end',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  menuIcon: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 30,
    height: 30,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',  // Center the logo horizontally
    height: 80,
  },
  logo: {
    width: 150,
    height: 150,
  },
  vectorIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 30,
    height: 30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    // paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 20,
    marginLeft: 15,
    flex: 1, // Ensure it takes remaining space
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666666",
    flex: 1, // Take remaining space
    fontFamily: 'Outfit-Regular', // Apply the global font family here
    fontWeight: "400",
  },
  gradientBackground: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginRight: 15,
  },
  locationIcon: {
    width: 25,
    height: 25,
  },
  surveysParent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // Ensure it takes full width
    paddingHorizontal: 25, // Add padding as needed
    paddingTop: 20,
  },
  surveys: {
    fontSize: 20, // Adjust size as needed
    fontWeight: "500",
    color: "#666666",
  },
  responses: {
    fontSize: 14, 
    color: "#666666",
  },
  cardScrollView: {
    // marginTop: 20,
    width: "100%",
  },
  cardContainer: {
    marginTop: 10,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    color: 'black',
  },
  cardlocation: {
    color: "#007bff",
    fontSize: 11,
    marginTop: 3,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: '#F0F8FF',
    paddingVertical: 6,
    justifyContent: "flex-start",
    borderRadius: 20,
    paddingLeft: 10,
  },
  infoText: {
    width: '100%',
    color: "black",
    fontSize: 12,
  },
  lightGrayText: {
    color: '#999999', // Light gray color
    fontSize: 12, // Adjust the font size as needed
    marginTop: 5,
    marginLeft: 8,
  },
  shapeContainer: {
    justifyContent: "center",
    alignItems: 'center', // Center items horizontally
    backgroundColor: "#333333",
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  shapeText: {
    fontSize: 12, // Adjust font size as needed
    color: '#ffffff',
  },
});

export default Homepage;
