import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';

const BeerReviewForm = ({ beer, visible, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);

  const handleSubmit = () => {
    const wordCount = text.trim().split(/\s+/).length; 
  
    const MIN_WORDS = 15 // cambiar a 15 antes de entregar
    if (wordCount < MIN_WORDS) {
      alert('Your review must be at least 15 words long.');
      return;
    }
  
    onSubmit({ text, rating });
    onClose();
  };
  
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>{beer.name} Review</Text>
          <TextInput
            style={styles.input}
            placeholder="Write your review"
            placeholderTextColor="gray"
            value={text}
            onChangeText={setText}
          />
          <View style={styles.sliderContainer}>
            <Text>Rating: {rating.toFixed(1)}</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={5}
              step={0.1}
              value={rating}
              onValueChange={setRating}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 0.6,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default BeerReviewForm;