import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // For image selection
import supabase from '../../utils/client'; // Adjust the import path as needed

const EditProfile = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userId, setUserId] = useState(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get the current user from Supabase authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          Alert.alert('Error', 'Unable to retrieve user information.');
          console.error(authError);
          return;
        }

        setUserId(user.id); // Store user ID

        const { data, error } = await supabase
          .from('profiles')
          .select('username, student_id, phone, avatar_url')
          .eq('id', user.id) // Match the user's ID
          .single(); // Fetch only one record

        if (error) {
          Alert.alert('Error', 'Failed to fetch profile data.');
          console.error(error);
          return;
        }

        setName(data.username);
        setStudentId(data.student_id);
        setPhoneNumber(data.phone);
        setImage(data.avatar_url);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Something went wrong while fetching data.');
      }
    };

    fetchProfile();
  }, []);

  // Function to pick an image
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to grant permission to access the media library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      // Upload the image to Supabase storage
      const fileName = uri.split('/').pop();
      const fileType = fileName.split('.').pop();
      const file = { uri, name: fileName, type: `image/${fileType}` };

      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.storage
        .from('avatars') // Specify the bucket name
        .upload(`public/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        Alert.alert('Error', 'Failed to upload image.');
        console.error(error);
        return;
      }

      // Get the public URL of the uploaded image
      const avatarUrl = `${supabase.storageUrl}/storage/v1/object/public/avatars/public/${data.path}`;
      setImage(avatarUrl); // Set the image URL in state
    }
  };

  // Function to save the profile
  const saveProfile = async () => {
    if (!name || !studentId || !phoneNumber) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: name,
          student_id: studentId,
          phone: phoneNumber,
          avatar_url: image, // Update avatar_url with the new image URL
        })
        .eq('id', userId);

      if (error) {
        Alert.alert('Error', 'Failed to update profile.');
        console.error(error);
        return;
      }

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong while saving the profile.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Choose a Picture</Text>
        )}
      </TouchableOpacity>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      {/* Student ID Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your student ID"
        value={studentId}
        onChangeText={setStudentId}
        keyboardType="numeric"
      />

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#D9D9FF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    color: '#888',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;
