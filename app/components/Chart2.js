import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { VictoryChart, VictoryLine } from "victory-native";
import { VictoryZoomContainer ,VictoryTheme} from "victory-native";
import data from "../data.json";
import SelectDropdown from "react-native-select-dropdown";
import Button from "./Button";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Chart2 = () => {
  const [jsondata, setJsondata] = useState(data);
  const [selectedField, setSelectedField] = useState("field1");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [selected, setSelected] = useState("");

  const [dateText1, setdateText1] = useState(false);
  const [dateText2, setdateText2] = useState(false);
  const [startDateText, setStartDateText] = useState("?");
  const [endDateText, setEndDateText] = useState("?");
  const [startformateddate, setStartformateddate] = useState("");
  const [endformateddate, setEndformateddate] = useState("");

  const [orientation, setOrientation] = useState("PORTRAIT");
  const [height, setheight] = useState();
  const [width, setwidth] = useState();

  useEffect(() => {
    Dimensions.addEventListener("change", ({ window: { width, height } }) => {
      if (width < height) {
        setOrientation("PORTRAIT");
      } else {
        setOrientation("LANDSCAPE");
      }
      setheight(height);
      setwidth(width);
    });
  }, []);

  async function getData() {
    try {
      //console.warn("https://api.thingspeak.com/channels/2016748/feeds.json?api_key=RNXN4S5EV3OTJ2RV&start="+startformateddate+"&end="+endformateddate);
      const response = await axios(
        "https://api.thingspeak.com/channels/2016748/feeds.json?api_key=RNXN4S5EV3OTJ2RV&start="+startformateddate+"&end="+endformateddate
      );
      console.log(startDateText);
      var x = response.data;
      setJsondata(x);
      setChartKey(chartKey - 1);
      //console.log(x);
    } catch (error) {
      console.log("error with data");
    }
  }
  const handleFieldSelection = (field) => {
    setSelectedField("field" + field);
  };

  const getChartData = () => {
    const feeds = jsondata.feeds.map((feed) => ({
      x: new Date(feed.created_at),
      y: parseFloat(feed[selectedField]),
    }));

    return [{ data: feeds }];
  };
  const formatDate = (date) => {
    let dd =
      date.getFullYear() +
      "-" +
      (date.getMonth() +
      1 )+
      "-" +
      date.getDate() +
      "%20" +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();
    return dd;
  };
  const handleConfirm = (date) => {
    setDatePickerVisibility(false);
    if (dateText1) {
      setStartDateText(date + "");
      setStartformateddate(formatDate(date));
    } else if (dateText2) {
      setEndDateText(date + "");
      setEndformateddate(formatDate(date));
    }

    setdateText1(false);
    setdateText2(false);
  };
  const styles = getStyles(orientation);
  useEffect(() => {
    console.log(orientation);
  }, [orientation]);
  key = { chartKey };
  const [chartKey, setChartKey] = useState(0);

  const sensors = ["Temperature", "MQ5", "MQ6", "MQ9", "MQ135"];
  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <VictoryChart
        theme={VictoryTheme.material}
          key={chartKey}
          width={width}
          height={300}
          padding={{ left: 60 , right:30 ,top:30,bottom:30 }}
          
         
          containerComponent={<VictoryZoomContainer zoomDimension="x" />}
        >
          <VictoryLine
            style={{ data: { stroke: "#15f", strokeWidth: 2 } }}
            data={getChartData()[0].data}
          />
        </VictoryChart>
      </View>
      {orientation === "PORTRAIT" && (
        <View style={styles.selectorContainer}>
          <Text>Select a field:</Text>

          <SelectDropdown
            dropdownBackgroundColor="red"
            data={sensors}
            defaultValue="Temperature"
            buttonStyle={styles.dropdown4BtnStyle}
            buttonTextStyle={styles.dropdown4BtnTxtStyle}
            rowStyle={styles.dropdown4RowStyle}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              handleFieldSelection(index + 1);
              setChartKey(chartKey + 1);
            }}
          />

          <Text
            style={styles.dateText}
            onPress={() => {
              setDatePickerVisibility(true);
              setdateText1(true);
            }}
          >
            Start Date : {startDateText}
          </Text>
          <Text
            style={styles.dateText}
            onPress={() => {
              setDatePickerVisibility(true);
              setdateText2(true);
            }}
          >
            End Date : {endDateText}
          </Text>

          <Button title="Enter" onPress={() => getData()} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={() => {
              setDatePickerVisibility(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

function getStyles(orientation) {
  return StyleSheet.create({
    container: {
      display: "flex",
      height: "100%",
      width: "100%",
    },
    selectorContainer: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      backgroundColor: "#59347F",

      borderTopEndRadius: 75,
      borderTopStartRadius: 75,
    },
    chart: {
      flex: 1,
      width: "100%",
      //backgroundColor: orientation === "LANDSCAPE" ? "black" : "#baf",
      backgroundColor: "#baf",
      marginBottom: 0,
      marginLeft:10,
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
    },
    dateText: {
      color: "white",

      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: "black",
    },
    dropdown4BtnStyle: {
      width: "50%",
      height: 50,
      backgroundColor: "#000",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#444",
    },
    dropdown4BtnTxtStyle: { color: "#fff" },

    dropdown4RowStyle: {
      backgroundColor: "#EFEFEF",
      borderBottomColor: "#C5C5C5",
    },
  });
}

export default Chart2;
