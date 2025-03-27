import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/providers/auth-provider";

export default function EditProfilePage() {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    website: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    // Pre-fill form with existing profile data when component mounts
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        website: profile.website || "",
        city: profile.city || "",
        country: profile.country || "",
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const { success, error } = await updateProfile(formData);

      if (success) {
        Alert.alert("Success", "Profile updated successfully");
        setIsEditing(false);
      } else {
        Alert.alert("Error", error?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        website: profile.website || "",
        city: profile.city || "",
        country: profile.country || "",
      });
    }
    setIsEditing(false);
  };

  // Profile Field component for both view and edit modes
  const ProfileField = ({
    label,
    value,
    field,
    icon,
    placeholder,
  }: {
    label: string;
    value: string;
    field: string;
    icon: keyof typeof Ionicons.glyphMap;
    placeholder: string;
  }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldIconContainer}>
        <Ionicons name={icon} size={20} color="#1BC464" />
      </View>
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={formData[field as keyof typeof formData]}
            onChangeText={(text) => handleInputChange(field, text)}
            placeholder={placeholder}
            placeholderTextColor="#999"
          />
        ) : (
          <Text style={styles.fieldValue}>{value || "Not provided"}</Text>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1BC464" />
          </Pressable>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            style={styles.editButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#1BC464" />
            ) : (
              <Text style={styles.editButtonText}>
                {isEditing ? "Save" : "Edit"}
              </Text>
            )}
          </Pressable>
        </View>

        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <Image
            source={{
              uri:
                profile?.avatar_url ||
                "https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            }}
            style={styles.profileImage}
          />
          {isEditing && (
            <Pressable style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </Pressable>
          )}
        </View>

        {/* Profile Fields */}
        <View style={styles.fieldsContainer}>
          <ProfileField
            label="Full Name"
            value={profile?.full_name || ""}
            field="full_name"
            icon="person"
            placeholder="Enter your full name"
          />
          <ProfileField
            label="Username"
            value={profile?.username || ""}
            field="username"
            icon="at"
            placeholder="Enter your username"
          />
          <ProfileField
            label="Website"
            value={profile?.website || ""}
            field="website"
            icon="globe"
            placeholder="Enter your website"
          />
          <ProfileField
            label="City"
            value={profile?.city || ""}
            field="city"
            icon="location"
            placeholder="Enter your city"
          />
          <ProfileField
            label="Country"
            value={profile?.country || ""}
            field="country"
            icon="flag"
            placeholder="Enter your country"
          />
        </View>

        {/* Cancel Button (only visible in edit mode) */}
        {isEditing && (
          <Pressable
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  editButton: {
    padding: 5,
  },
  editButtonText: {
    color: "#1BC464",
    fontWeight: "600",
    fontSize: 16,
  },
  profileImageSection: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePhotoButton: {
    padding: 5,
  },
  changePhotoText: {
    color: "#1BC464",
    fontWeight: "500",
  },
  fieldsContainer: {
    padding: 15,
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 15,
  },
  fieldIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f8f4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cancelButton: {
    alignItems: "center",
    margin: 15,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
  },
  cancelButtonText: {
    color: "#999",
    fontWeight: "600",
    fontSize: 16,
  },
});
