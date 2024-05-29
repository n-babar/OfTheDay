// Modal component presenting terms and conditions with acceptance functionality, integral for user registration flow.

import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements'; // Import CheckBox component

const TermsModal = ({ visible, onClose, setIsChecked, isChecked }) => {

    const handleAccept = () => {
        if (isChecked) {
            // Accept logic, possibly just call onClose
            onClose(); // This can trigger the logic in parent component
        } else {
            alert('Please read and accept the terms and conditions.');
        }
    };

    return (    
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView>
                        <Text>Welcome to Of The Day (OTD), a vibrant social media platform designed to celebrate and share daily moments of joy, inspiration, and creativity with friends and peers around the world. By accessing or using our app, you acknowledge and agree to comply with the following terms and conditions of service. These terms govern your use of OTD and constitute a legally binding agreement between you and OTD. If you do not agree with any part of these terms, you must refrain from accessing or using the app.

                            OTD provides users with the opportunity to share their "Of The Day" moments, including but not limited to culinary delights, travel adventures, artistic endeavors, and personal achievements, through a variety of multimedia formats, such as photos, videos, and text. While users retain ownership of the content they upload, by sharing it on OTD, they grant OTD a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content for promotional and other purposes related to the operation of the app.

                            Users are required to register an account to access certain features of OTD. By registering, you agree to provide accurate, current, and complete information about yourself as prompted by the registration form and to maintain and promptly update this information to keep it accurate, current, and complete. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. OTD reserves the right to suspend or terminate your account if any information provided during the registration process or thereafter is inaccurate, untrue, or incomplete.

                            As part of the registration process and continued use of OTD, you may be required to provide personal information, including but not limited to your name, email address, and date of birth. OTD may collect, store, and use this information in accordance with its Privacy Policy. OTD respects the privacy of its users and is committed to protecting the personal information provided to us. We do not sell, rent, or lease our customer lists or personal information to third parties.

                            In addition to personal information, OTD may also collect usage data, such as interactions with the app, time spent on the app, and preferences. This data is collected to improve the overall user experience, enhance the functionality of the app, and personalize content and recommendations. By using OTD, you consent to the collection, storage, and use of this data in accordance with our Privacy Policy.

                            Users are solely responsible for the content they post on OTD, including but not limited to photos, videos, comments, and other materials. You agree not to post any content that is unlawful, defamatory, obscene, harmful, offensive, or otherwise objectionable. OTD reserves the right to remove any content that violates these terms or is deemed inappropriate, offensive, or harmful to others.

                            Users may encounter links to third-party websites or services while using OTD. These third-party sites have their own terms of service and privacy policies, which may differ from those of OTD. OTD is not responsible for the content or practices of these third-party sites and encourages users to review their terms of service and privacy policies before accessing or using them.

                            OTD may contain advertisements and sponsored content from third-party advertisers and sponsors. These advertisers and sponsors are solely responsible for ensuring that their ads comply with all applicable laws and regulations. OTD does not endorse or guarantee the accuracy or reliability of any information, products, or services provided by third-party advertisers or sponsors.

                            Users acknowledge and agree that their use of OTD is at their own risk. OTD is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. OTD does not warrant that the app will be uninterrupted or error-free, that defects will be corrected, or that the app or server that makes it available is free of viruses or other harmful components. OTD makes no warranties regarding the accuracy, completeness, reliability, or suitability of the content provided on the app.

                            In no event shall OTD or its affiliates, officers, directors, employees, agents, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use OTD, whether based on warranty, contract, tort (including negligence), or any other legal theory, even if OTD has been informed of the possibility of such damages.

                            OTD reserves the right to modify or discontinue, temporarily or permanently, the app or any part thereof with or without notice. OTD shall not be liable to you or any third party for any modification, suspension, or discontinuance of the app.

                            These terms and conditions constitute the entire agreement between you and OTD regarding your use of OTD and supersede all prior or contemporaneous communications and proposals, whether oral or written, between you and OTD.

                            OTD may update these terms and conditions from time to time without notice. Your continued use of OTD after any changes to these terms and conditions will constitute your acceptance of such changes. It is your responsibility to review these terms and conditions periodically for changes.

                            These terms and conditions shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles. Any dispute arising out of or relating to these terms and conditions or your use of OTD shall be exclusively resolved by arbitration conducted in Stanford, California, in accordance with the rules of the American Arbitration Association.

                            If any provision of these terms and conditions is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect. Failure by OTD to enforce any provision of these terms and conditions shall not be deemed a waiver of such provision or any other provision.</Text>

                        <View style={styles.checkboxContainer}>
                            <CheckBox
                                checked={isChecked}
                                onPress={() => setIsChecked(!isChecked)}
                            />
                            <Text style={styles.agreement}>I have read the terms and conditions.</Text>
                        </View>
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleAccept}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => { onClose(); setIsChecked(false); }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({

    agreement: {
        marginTop: 17,
        fontWeight: 'bold'
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '95%',
        maxHeight: '80%',
    },

    checkboxContainer: {
        marginTop: 10,
        marginBottom: 20,
        flexDirection: 'row',
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },

    cancelButton: {
        backgroundColor: '#e74c3c',
    },

    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TermsModal;
