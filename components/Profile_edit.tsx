import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import { Profile, useAuth } from "@/providers/auth-provider";

export default function ProfileEditor() {
  const { profile, updateProfile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({
    username: "",
    full_name: "",
    avatar_url: "",
    website: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        full_name: profile.full_name || "",
        avatar_url: profile.avatar_url || "",
        website: profile.website || "",
        city: profile.city || "",
        country: profile.country || "",
      });
    }
  }, [profile]);

  const handleChange = (key: keyof Profile, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.username) {
      Alert.alert("Error", "Username is required");
      return;
    }

    setLoading(true);
    try {
      const { success, error } = await updateProfile(formData);

      if (success) {
        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert("Error", error?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const uploadAvatar = async (uri: string) => {
    if (!user) return;

    setUploading(true);
    try {
      // Convert URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create a unique file path
      const fileExt = uri.substring(uri.lastIndexOf(".") + 1);
      const filePath = `avatars/${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with new avatar URL
      setFormData((prev) => ({ ...prev, avatar_url: data.publicUrl }));
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Alert.alert("Error", "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage} disabled={uploading}>
          {formData.avatar_url ? (
            <Image
              source={{ uri: formData.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {formData.username ? formData.username[0].toUpperCase() : "?"}
              </Text>
            </View>
          )}
          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.avatarLabel}>Tap to change avatar</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Username *</Text>
        <TextInput
          style={styles.input}
          value={formData.username || ""}
          onChangeText={(text) => handleChange("username", text)}
          placeholder="Username"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={formData.full_name || ""}
          onChangeText={(text) => handleChange("full_name", text)}
          placeholder="Full Name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={formData.website || ""}
          onChangeText={(text) => handleChange("website", text)}
          placeholder="Website"
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={formData.city || ""}
          onChangeText={(text) => handleChange("city", text)}
          placeholder="City"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={formData.country || ""}
          onChangeText={(text) => handleChange("country", text)}
          placeholder="Country"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 40,
    color: "#fff",
  },
  avatarLabel: {
    marginTop: 8,
    color: "#666",
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0284c7",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
