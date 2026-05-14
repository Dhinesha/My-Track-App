import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Pressable,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';

// Illustrations
import Slide1Illustration from '../../components/onboarding/Slide1Illustration';
import Slide2Illustration from '../../components/onboarding/Slide2Illustration';
import Slide3Illustration from '../../components/onboarding/Slide3Illustration';

const PRIMARY = '#2b8cee';
const GRAY = '#888';
const LIGHT_GRAY = '#D3D1C7';

const SLIDES = [
  {
    id: '1',
    title: 'Your trip, on your phone',
    subtitle: 'Itinerary, hotel room, and emergency\ncontacts are available offline.',
    illustrationBg: '#F0FFF8',
    Illustration: Slide1Illustration,
  },
  {
    id: '2',
    title: 'Check in with one tap',
    subtitle: 'Check in yourself and your whole\nfamily from a single screen.',
    illustrationBg: '#F0F7FF',
    Illustration: Slide2Illustration,
  },
  {
    id: '3',
    title: 'Get updates instantly',
    subtitle: 'Your organiser can reach you in\nseconds with important announcements.',
    illustrationBg: '#FFF9F0',
    Illustration: Slide3Illustration,
  },
];

const Dot = ({ index, currentIndex }: { index: number; currentIndex: Animated.SharedValue<number> }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(currentIndex.value) === index;
    return {
      width: withTiming(isActive ? 24 : 8, { duration: 300 }),
      backgroundColor: isActive ? PRIMARY : LIGHT_GRAY,
    };
  });

  return <Animated.View style={[{ height: 8, borderRadius: 4, marginHorizontal: 4 }, animatedStyle]} />;
};

export default function OnboardingScreen() {
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);
  const [index, setIndex] = useState(0);
  const currentIndex = useSharedValue(0);
  const listRef = useRef<FlatList>(null);
  const navigation = useNavigation<any>();

  const complete = async () => {
    const user = useAuthStore.getState().user;
    if (user) {
      useAuthStore.getState().setUser({
        ...user,
        onboarding_complete: true,
      });
    }
    navigation.replace('Main');
  };

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      const nextIdx = index + 1;
      listRef.current?.scrollToIndex({ index: nextIdx, animated: true });
      setIndex(nextIdx);
      currentIndex.value = nextIdx;
    } else {
      complete();
    }
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIdx = Math.round(offsetX / containerWidth);
    if (newIdx !== index) {
      setIndex(newIdx);
      currentIndex.value = newIdx;
    }
  };

  const onLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. Skip Button */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={complete} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* 2. FlatList for Slides */}
      <View style={styles.listContainer} onLayout={onLayout}>
        <FlatList
          ref={listRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.id}
          getItemLayout={(_, i) => ({
            length: containerWidth,
            offset: containerWidth * i,
            index: i,
          })}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width: containerWidth }]}>
              {/* Illustration Area */}
              <View style={[styles.illustrationBox, { backgroundColor: item.illustrationBg }]}>
                <item.Illustration />
              </View>

              {/* Text Area */}
              <View style={styles.textBox}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Bottom Area */}
      <View style={styles.bottomArea}>
        {/* Dot Indicators */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <Dot key={i} index={i} currentIndex={currentIndex} />
          ))}
        </View>

        {/* Next / Get Started Button */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.nextBtn,
            { transform: [{ scale: pressed ? 0.98 : 1 }] }
          ]}
        >
          <Text style={styles.nextBtnText}>
            {index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  skipBtn: {
    padding: 16,
  },
  skipText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationBox: {
    width: 300,
    height: 300,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    overflow: 'hidden',
  },
  textBox: {
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
  },
  nextBtn: {
    backgroundColor: PRIMARY,
    width: '100%',
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
