import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  ImageBackground,
  Text,
} from "react-native";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

interface CustomSplashProps {
  onAnimationComplete: () => void;
}

const CustomSplash: React.FC<CustomSplashProps> = ({ onAnimationComplete }) => {
  const titleOpacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/hero-splashing.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <Animated.Text
              style={[
                styles.title,
                {
                  opacity: titleOpacity,
                },
              ]}
            >
              Welcome to{"\n"}
              Foodu! 👋
            </Animated.Text>

            <Animated.Text
              style={[
                styles.subtitle,
                {
                  opacity: textOpacity,
                },
              ]}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Animated.Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    paddingBottom: 100,
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4ADE80",
    marginBottom: 16,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
    opacity: 0.8,
    textAlign: "left",
  },
});

export default CustomSplash;
