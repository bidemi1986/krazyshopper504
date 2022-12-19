import React, { memo, useState, useContext } from "react";
import { TouchableOpacity, StyleSheet, Text, View, Alert } from "react-native";
import { Context } from "../../context"; 
import Background from "../../components/common/Background";
import Logo from "../../components/common/Logo";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import TextInput from "../../components/common/TextInput";
import BackButton from "../../components/common/BackButton"; 
import Activity from "../../components/common/Activity";
import { theme } from "../../theme/core/theme";
import { signup } from "../../functions/auth/signup-functions";
import { firstNameValidator, lastNameValidator, emailValidator, passwordValidator } from "../../theme/core/utils";
import { Navigation } from "../../navigation/types";
type Props = {
  navigation: Navigation;
};
const Signup = ({ navigation }: Props) => {
  const { state, dispatch } = useContext(Context);
  const [firstName, setFirstName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [indicator, setIndicator] = useState(false);
  const _onSignUpPressed = async () => {
     
    if (indicator) return;
    const firstNameError = firstNameValidator(firstName.value);
    const lastNameError = lastNameValidator(lastName.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || firstNameError || lastNameError) {
      setFirstName({ ...firstName, error: firstNameError });
      setLastName({ ...lastName, error: lastNameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setIndicator(true);
    
    let payload = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    };
    try {
      let res = await signup(payload);
      console.log(" data received on _onSignUpPressed ",res)
      if (res.msg === "SUCCESS") {
        dispatch({
          type: "USER_ID_AVAILABLE",
          payload: res.data,
        });
      }
      Alert.alert("You have successfully signed up! Pls check your email to complete your verification");
      // navigation.navigate('Dashboard');
    } catch (err) {
      console.log(" something went wrong on _onSignUpPressed ",err)
      Alert.alert("something went wrong pls try again");
    }
    setIndicator(false);
  };

  return (
    <Background>
      {/* <BackButton goBack={() => navigation.navigate('Splash')} /> */}

      <Logo />

      <Header>Create Account</Header>

      <TextInput
        label="First Name"
        returnKeyType="next"
        value={firstName.value}
        onChangeText={(text) => setFirstName({ value: text, error: "" })}
        error={!!firstName.error}
        errorText={firstName.error}
      />

      <TextInput
        label="Last Name"
        returnKeyType="next"
        value={lastName.value}
        onChangeText={(text) => setLastName({ value: text, error: "" })}
        error={!!lastName.error}
        errorText={lastName.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
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
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      /> 
      <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
        {!indicator ?"Sign Up":<Activity color={theme.colors.secondary}/>}
      </Button> 
      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.primary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
export default memo(Signup);
