import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal } from 'react-native';
import Slider from '@react-native-community/slider';

const BeerReviewForm = ({ beer, visible, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);

  const handleSubmit = () => {
    const wordCount = text.trim().split(/\s+/).length; 
  
    if (wordCount < 15) {
      alert('Your review must be at least 15 words long.');
      return;
    }
  
    onSubmit({ text, rating });
    onClose();
  };
  
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>{beer.name} Review</Text>
        <TextInput
          style={styles.input}
          placeholder="Write your review"
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
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