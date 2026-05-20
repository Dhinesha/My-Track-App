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
  SharedValue,
} from 'react-native-reanimated';
import { useAuthStore } from '../../store/authStore';
import { Colors, Typography, Spacing, Shadows } from '../../constants/theme';

// Illustrations
import Slide1Illustration from '../../components/onboarding/Slide1Illustration';
import Slide2Illustration from '../../components/onboarding/Slide2Illustration';
import Slide3Illustration from '../../components/onboarding/Slide3Illustration';

const LIGHT_GRAY = Colors.neutral.divider;

const SLIDES = [
  {
    id: '1',
    title: 'Your trip, on your phone',
    subtitle: 'Itinerary, hotel room, and emergency contacts are available offline.',
    illustrationBg: Colors.primary.lightBg,
    Illustration: Slide1Illustration,
  },
  {
    id: '2',
    title: 'Check in with one tap',
    subtitle: 'Check in yourself and your whole family from a single screen.',
    illustrationBg: Colors.info.lightBg,
    Illustration: Slide2Illustration,
  },
  {
    id: '3',
    title: 'Get updates instantly',
    subtitle: 'Your organiser can reach you in seconds with important announcements.',
    illustrationBg: Colors.warning.lightBg,
    Illustration: Slide3Illustration,
  },
];

const Dot = ({ index, currentIndex }: { index: number; currentIndex: SharedValue<number> }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(currentIndex.value) === index;
    return {
      width: withTiming(isActive ? 24 : 8, { duration: 300 }),
      backgroundColor: isActive ? Colors.primary.main : LIGHT_GRAY,
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
      
      {/* Skip Button */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={complete} style={styles.skipBtn} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList for Slides */}
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
            Shadows.md,
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
    backgroundColor: '#FFFFFF',
  },
  topRow: {
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.screenPaddingH,
  },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipText: {
    color: Colors.neutral.textMuted,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Typography.fontFamilies.semibold,
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
    width: 280,
    height: 280,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    overflow: 'hidden',
  },
  textBox: {
    paddingHorizontal: 36,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    fontFamily: Typography.fontFamilies.regular,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  bottomArea: {
    paddingHorizontal: Spacing.screenPaddingH,
    paddingBottom: 40,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  nextBtn: {
    backgroundColor: Colors.primary.main,
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Typography.fontFamilies.bold,
  },
});
