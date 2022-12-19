import React, { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Background from '../../components/common/Background';
import Logo from '../../components/common/Logo';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import TextInput from '../../components/common/TextInput';
import BackButton from '../../components/common/BackButton';
import { theme } from '../../theme/core/theme';
import { emailValidator } from '../../theme/core/utils';
import { Navigation } from '../../navigation/types';

type Props = {
    navigation: Navigation;
};
const ResetPassword = ({ navigation }: Props) => {
    const [email, setEmail] = useState({ value: '', error: '' });

    const _onSendPressed = () => {
        const emailError = emailValidator(email.value);

        if (emailError) {
            setEmail({ ...email, error: emailError });
            return;
        }

        navigation.navigate('Login');
    };

    return (
        <Background>
            {/* <BackButton goBack={() => navigation.goBack()} /> */}

            <Logo />

            <Header>Restore Password</Header>

            <TextInput
                label="E-mail address"
                returnKeyType="done"
                value={email.value}
                onChangeText={text => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />

            <Button mode="contained" onPress={_onSendPressed} style={styles.button}>
                Send Reset Instructions
            </Button>

            <TouchableOpacity
                style={styles.back}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.label}>← Back to login</Text>
            </TouchableOpacity>
        </Background>
    );
};

const styles = StyleSheet.create({
    back: {
        width: '100%',
        marginTop: 12,
    },
    button: {
        marginTop: 12,
    },
    label: {
        color: theme.colors.primary,
        width: '100%',
    },
});

export default memo(ResetPassword);