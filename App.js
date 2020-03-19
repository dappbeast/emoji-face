import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import Emoji from 'react-native-emoji';
import * as FaceDetector from 'expo-face-detector';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null)

  const [faces, setFaces] = useState({})

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }, [])

  if (hasPermission === null) {
    return <View />
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  const faceValues = Object.values(faces)

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.front}
        onFacesDetected={({faces}) => {
          const newFaces = {}
          faces.forEach(face => {
            let emoji = null;
            const smiling = face.smilingProbability
            const eyesOpen = (face.leftEyeOpenProbability + face.rightEyeOpenProbability)/2
            if (smiling >= 0.5) {
              emoji = "grinning"
            } else if (smiling < 0.5) {
              emoji = "neutral_face"
              if (eyesOpen < 0.25) {
                emoji = "rage"
              }
            }
            newFaces[face.faceID] = {
              style: {
                left: face.bounds.origin.x,
                top: face.bounds.origin.y,
                fontSize: (face.bounds.size.width + face.bounds.size.height)/2
              },
              emoji: emoji
            }
          })
          setFaces(newFaces)
        }}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.none,
          runClassifications: FaceDetector.Constants.Classifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      >
        {faceValues.length > 0 && <Emoji name={faceValues[0].emoji} style={{
          position: 'absolute',
          ...faceValues[0].style
        }} />}
      </Camera>
    </View>
  )
}