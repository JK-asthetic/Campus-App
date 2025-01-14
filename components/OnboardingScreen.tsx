import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  type: 'order' | 'payment';
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ type, onComplete }) => {
  const OrderIllustration = () => (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Background Circle */}
      <Circle cx="100" cy="100" r="60" fill="#4ADE80" />
      
      {/* Plate with Food */}
      <Circle cx="100" cy="100" r="40" fill="#FFF" />
      <Path
        d="M80 90 h25 a5 5 0 0 1 0 10 h-25"
        fill="#FF6B6B"
      />
      <Circle cx="95" cy="105" r="12" fill="#FFD93D" />
      
      {/* Fries */}
      <Rect x="75" y="115" width="5" height="15" fill="#FFB347" />
      <Rect x="85" y="115" width="5" height="15" fill="#FFB347" />
      <Rect x="95" y="115" width="5" height="15" fill="#FFB347" />
      
      {/* Drink */}
      <Rect x="140" y="90" width="20" height="30" fill="#000" />
      <Path d="M140 85 h20 l-10 -15 z" fill="#000" />
    </Svg>
  );

  const PaymentIllustration = () => (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Phone */}
      <Rect x="60" y="50" width="80" height="140" rx="10" fill="#000" />
      <Rect x="65" y="55" width="70" height="130" fill="#FFF" />
      
      {/* Payment Elements */}
      <Circle cx="100" cy="90" r="15" fill="#4ADE80" />
      <Rect x="75" y="120" width="50" height="8" rx="4" fill="#4ADE80" />
      
      {/* Person */}
      <Circle cx="150" cy="100" r="15" fill="#000" />
      <Rect x="135" y="115" width="30" height="40" fill="#000" />
    </Svg>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Background Dots */}
        <View style={styles.dotsContainer}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          {type === 'order' ? <OrderIllustration /> : <PaymentIllustration />}
        </View>

        {/* Text Content */}
        <Text style={styles.title}>
          {type === 'order' ? 'Order for Food' : 'Easy Payment'}
        </Text>
        <Text style={styles.description}>
          {type === 'order' 
            ? 'Browse through our menu and order your favorite dishes with just a few taps.'
            : 'Quick and secure payment options to complete your food orders hassle-free.'}
        </Text>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={onComplete}
        >
          <Text style={styles.buttonText}>{type === 'order' ? 'Next' : 'Get Started'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  dotsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ADE80',
    opacity: 0.2,
    margin: 15,
  },
  illustrationContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ADE80',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    width: width - 48,
    height: 56,
    backgroundColor: '#4ADE80',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;