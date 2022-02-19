import React, {useEffect, useState,useRef} from 'react';
import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,Image } from 'react-native';
import { Camera } from 'expo-camera';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as mediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

export default function App() {

  const [type,setType] = useState(Camera.Constants.Type.back)//Front ou Back
  const [hasPermission,setHasPermission] = useState(null);//pedir permissao para o usuario.
  const camRef = useRef(null);//sinal da camera
  const [capturedPhoto,setCapturedPhoto] = useState(null);//foto tirada
  const [open,setOpen] = useState(false)


  useEffect(()=>{
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    if(hasPermission === null){
      return <View/>
    }
    if(hasPermission === false){
      return <Text>Acesso negado!</Text>
    }//sistema de permissao 

    (async () => {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasPermission(status === 'granted');
    })();

  },[])

 async function takePicture(){//tirar foto
    if(camRef){
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
      console.log(data)
    }
 }

 async function savePicture(){//salvar foto
   const asset = await mediaLibrary.createAssetAsync(capturedPhoto)
   .then(()=>{
    alert('Salvo com sucesso')
   }).catch(error => {
     console.log('err', error)
   })
 }

 async function openAlbun(){//abrir album
       // No permissions request is necessary for launching the image library
       let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      

      if (!result.cancelled) {
        setCapturedPhoto(result.uri);
        setOpen(true);
      }
 }

  return (
    <SafeAreaView style={styles.container}>
     <Camera
        style={styles.camera}
        type={type}//iniciar com a camera frontal ou de tras
        ref={camRef}
     >
      <View style={styles.camera1}>
          <TouchableOpacity style={styles.botton} onPress={()=> setType(
            type === Camera.Constants.Type.back 
            ? Camera.Constants.Type.front
            :Camera.Constants.Type.back
          )}>
            <AntDesign name="retweet" size={40} color="white" />
          </TouchableOpacity>
          
            <TouchableOpacity style={styles.botton} onPress={takePicture}>
              <Ionicons name="radio-button-on" size={80} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.botton} onPress={openAlbun}>
               <MaterialIcons name="photo-size-select-actual" size={40} color="white" />
            </TouchableOpacity>
      </View>
     </Camera>
     { capturedPhoto &&
      <Modal
        animationType="slide"
        transparent={false}
        visible={open}
      >
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'black'}}>
          <View style={[styles.camera1,{backgroundColor:'black',width:'100%',alignItems:'center'}]}>
            <TouchableOpacity style={{margin:20}} onPress={()=>setOpen(false)}>
              <Text style={styles.text}>x</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{margin:20}} onPress={()=>savePicture()}>
              <Text style={styles.text}>upload</Text>
            </TouchableOpacity>
          </View>
          <Image 
            style={{width:'100%',height:700}}
            source={{uri: capturedPhoto}}
          />
        </View>
      </Modal>
     }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'black'
  },
  camera:{
    flex:1
  },
  camera1:{
    flex:1,
    backgroundColor:'transparent',
    flexDirection:'row',
    justifyContent:'space-around'
  },
  botton:{
    justifyContent:'flex-end',
    marginBottom:20,
    marginLeft:20,   
  },
  text:{
    fontSize:35,
    padding:10,
    fontWeight:'bold',
    color:'white'
  }
});
