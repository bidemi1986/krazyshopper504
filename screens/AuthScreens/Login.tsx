import React, { memo, useState, useContext, } from 'react';
//import  "../../firebase/firebaseConfig"
//import "firebase/firestore";
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native'; 
import Activity from '../../components/common/Activity';
import Background from '../../components/common/Background';
import Logo from '../../components/common/Logo';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import TextInput from '../../components/common/TextInput';
import BackButton from '../../components/common/BackButton';
import { theme } from '../../theme/core/theme';
import { emailValidator, passwordValidator } from '../../theme/core/utils';
import { Navigation } from '../../navigation/types';
import { Context } from '../../context';
import {login} from "../../functions/auth/signup-functions"

type Props = {
  navigation: Navigation;
};

const Login = ({ navigation }: Props) => {
  const { state, dispatch } = useContext(Context)
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [indicator, setIndicator] = useState(false);
 
  const _onLoginPressed = async() => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    setIndicator(true);
    let payload = { 
      email: email.value,
      password: password.value,
    };
    try{
      let res = await login(payload);
      console.log(" res is ", res)
      if (res.status === "SUCCESS") {
        dispatch({
          type: "USER_ID_AVAILABLE",
          payload: res.data,
        });
      }else{
        let ERR = ""
        if (res.msg ==="Firebase: Error (auth/wrong-password)."){
           ERR = "😧 Password is incorrect."
           setPassword({ ...password, error: ERR || res.msg });
          }
        else if (res.msg ==="Firebase: Error (auth/user-not-found)."){ 
          ERR = "🤔 Can't find this email on record!"
          setEmail({ ...email, error: ERR || res.msg  });
        }
        else if(res.msg ==="Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."){
          ERR = "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later"
          setEmail({ ...email, error: ERR || res.msg  });
        }else{
          setEmail({ ...email, error: res.msg  });
        } 
      }
    }catch(err){
      console.log(" err ", err)
      setPassword({ ...password, error: passwordError });
      Alert.alert("unable to login, pls try again later...");
    }  
    setIndicator(false);
  };

  return (
    <View style={{ flex: 1 }} >
    <Background>
      {/* <BackButton goBack={() => navigation.navigate('Splash')} /> */}

      <Logo />

      <Header>Welcome back.</Header>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={()=>_onLoginPressed()}>
      {!indicator ?"Login":<Activity color={theme.colors.secondary}/>}
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
    </View>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.primary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(Login);
