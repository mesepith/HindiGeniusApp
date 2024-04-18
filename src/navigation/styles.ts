import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    userInfoSection: {
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: 'gray',
        paddingTop: 5,
    },
    bottomLogoContainer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo: {
        width: 100,
        height: 100,
      },
});

export default styles;
