import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import Emoji from 'react-native-emoji';

const EMOJIS = [
  "joy",
  "stuck_out_tongue_closed_eyes",
  "rage",
  "scream",
  "sunglasses"
]

export default function App() {
  const [hasPermission, setHasPermission] = useState(null)

  const [faceX, setFaceX] = useState(null)
  const [faceY, setFaceY] = useState(null)
  const [faceWidth, setFaceWidth] = useState(null)

  const [emoji, setEmoji] = useState(EMOJIS[0])

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

  const showFace = faceX && faceY && faceWidth

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.front}
        onFacesDetected={({faces}) => {
          if (faces.length > 0) {
            setFaceX(faces[0].bounds.origin.x)
            setFaceY(faces[0].bounds.origin.y)
            setFaceWidth(faces[0].bounds.size.width)
          } else {
            setFaceX(null)
            setFaceY(null)
            setFaceWidth(null)
          }
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
          {showFace && <React.Fragment>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                const nextIdx = EMOJIS.indexOf(emoji) + 1
                setEmoji(EMOJIS[nextIdx >= EMOJIS.length ? 0 : nextIdx])
              }}
            >
              <Emoji name={emoji} style={{position: 'absolute', fontSize: faceWidth, top: faceY, left: faceX}} />
            </TouchableOpacity>
          </React.Fragment>}
        </View>
      </Camera>
    </View>
  )
}