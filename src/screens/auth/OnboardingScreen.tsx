import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../theme/colors";
import { Button } from "../../components/common";


const SLIDES = [
  {
    id: "1",
    color: "#E0F2F1",
    heading: "Your trip, on your phone",
    sub: "Itinerary, hotel room, and emergency contacts are available even offline.",
    image: require("../../../assets/onboarding/itinerary.jpg"),
  },
  {
    id: "2",
    color: "#E3F2FD",
    heading: "Check in with one tap",
    sub: "Check in yourself and your whole family from a single screen instantly.",
    image: require("../../../assets/onboarding/checkin.jpg"),
  },
  {
    id: "3",
    color: "#F3E5F5",
    heading: "Get updates instantly",
    sub: "Your organiser can reach you in seconds with important announcements.",
    image: require("../../../assets/onboarding/updates.jpg"),
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const [layoutWidth, setLayoutWidth] = useState(Dimensions.get("window").width);
  const listRef = useRef<FlatList>(null);
  const navigation = useNavigation<any>();

  const complete = () => {
    navigation.replace("Main");
  };

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      listRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    } else {
      complete();
    }
  };

  return (
    <View 
      className="flex-1 bg-white"
      onLayout={(e) => {
        const { width: w } = e.nativeEvent.layout;
        if (w > 0) setLayoutWidth(w);
      }}
    >
      <Pressable 
        onPress={complete} 
        className="absolute top-14 right-6 z-10 px-4 py-2"
        hitSlop={20}
      >
        <Text className="text-text-muted font-jakarta-bold text-sm">Skip</Text>
      </Pressable>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / layoutWidth);
          setIndex(newIndex);
        }}
        getItemLayout={(_, i) => ({
          length: layoutWidth,
          offset: layoutWidth * i,
          index: i,
        })}
        renderItem={({ item }) => (
          <View style={{ width: layoutWidth }} className="flex-1 items-center justify-center px-10">
            <View 
              style={{ backgroundColor: item.color }} 
              className="w-72 h-72 rounded-[48px] items-center justify-center mb-10 overflow-hidden shadow-sm"
            >
              <Image
                source={item.image}
                className="w-4/5 h-4/5"
                resizeMode="contain"
              />
            </View>
            <View className="items-center">
              <Text className="text-3xl font-jakarta-extrabold text-text-primary text-center mb-4 leading-9">
                {item.heading}
              </Text>
              <Text className="text-base text-text-secondary text-center font-jakarta-medium leading-6">
                {item.sub}
              </Text>
            </View>
          </View>
        )}
      />
      
      <View className="px-8 pb-12 items-center">
        {/* Pagination Dots */}
        <View className="flex-row mb-8">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full mx-1 ${i === index ? "w-8 bg-primary" : "w-2 bg-border-light"}`}
            />
          ))}
        </View>

        <Button
          label={index === SLIDES.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          variant="teal"
          size="lg"
          fullWidth
          className="rounded-2xl shadow-xl shadow-primary/20"
        />
      </View>
    </View>
  );
}




