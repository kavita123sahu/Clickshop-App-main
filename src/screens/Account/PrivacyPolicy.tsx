import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../common/Colors'
import { Fonts } from '../../common/Fonts'
import CommonHeader from '../../component/CommonHeader'

const PrivacyPolicy = (props: any) => {
    const { navigation } = props;
    return (
        <View className='flex flex-1 bg-whiteColor'>
            <CommonHeader navigation={navigation} title='Privacy & Policy' isCartIcon={false} />
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={[styles.h3, { marginTop: 20 }]}>Privacy Policy</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}> Updated March 6, 2022 </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Introduction</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    We value the trust you place in us and acknowledge the importance of secure transactions and information privacy. This Privacy Policy describes how Clikshop (collectively “Clikshop, we, our, us”) collect, use, share or otherwise process your personal information through Clikshop website www.clikshop.co.in, its mobile application and m- site, (henceforth referred to as the “Platform”).
                    While you may be able to browse certain sections of the Platform without registering with us, however, please note we do not offer any product or service under this Platform outside India. Your personal information will primarily be stored and processed in India and may have data protection laws that are different from those that apply in the country in which you are located. By visiting this Platform, providing your information or availing out product/service, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of use  and the applicable service/product terms and conditions, and agree to be governed by the laws of India including but not limited to the laws applicable to data protection and privacy. If you do not agree please do not use or access our Platform.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Collection of Your Personal Information</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    When you use our Platform, we collect and store your information which is provided by you from time to time. In general, you can browse the Platform without telling us who you are or revealing any personal information about yourself. Once you give us your personal information, you are not anonymous to us. Where possible, we indicate which fields are required and which fields are optional. You always have the option to not provide information by choosing not to use a particular service, product or feature on the Platform.

                    We may collect personal information (such as name, phone number, email address, delivery address, credit card/debit card and other payment instrument details) from you when you set up an account or transact with us. While you can browse some sections of our Platform without being a registered member, Activities like placing an order do require registration. We use your contact information to send you offers based on your previous orders and your interests.

                    If you choose to post messages on our message boards, or other message areas or leave feedback on the Platform or the social media handles maintained by us. We will collect that information you provide to us. We retain this information as necessary to resolve disputes, provide customer support, troubleshoot problems or for internal research and analysis as permitted by law.

                    We use your personal information to provide you with the products and services that you request. To the extent we use your personal information to market to you, we will provide you the ability to opt-out of such uses. We use your personal information to assist sellers and business partners in handling and fulfilling orders; enhancing customer experience; resolve disputes; troubleshoot problems; help promote a safe service; collect money; measure consumer interest in our products and services; inform you about online and offline offers, products, services, and updates; customize and enhance your experience; detect and protect us against error, fraud and other criminal activity; enforce our terms and conditions; and as otherwise described to you at the time of collection of information.

                    In our efforts to continually improve our product and service offerings, we collect and analyze demographic and profile data about our users' activity on our Platform. We identify and use your IP address to help diagnose problems with our server, and to administer our Platform. Your IP address is also used to help identify you and to gather broad demographic information.

                    We will occasionally ask you to participate in optional surveys conducted by us. These surveys may ask you for personal information, contact information, date of birth, demographic information (like pin code, age, or income level), attributes such as your interests, household or lifestyle information, your purchasing behaviour or history, preferences, and other such information that you may choose to provide. The surveys may involve collection of voice data or video recordings, the participation of which would purely be voluntary in nature. We use this data to tailor your experience at our Platform, providing you with content that we think you might be interested in and to display content according to your preferences.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Sharing of information</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    We may disclose your personal information to third parties, such as sellers, business partners. This disclosure may be required for us to provide you access to our products and services; for fulfillment of your orders; for enhancing your experience; for providing feedback on products; to collect payments from you; to comply with our legal obligations; to conduct market research or surveys; to enforce our Terms of Use; to facilitate our marketing and advertising activities; to analyze data; for customer service assistance; to prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our product and services. We do not disclose your personal information to third parties for their marketing and advertising purposes without your explicit consent.

                    We may disclose personal information if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process. We may disclose personal information to law enforcement agencies, third party rights owners, or others in the good faith belief that such disclosure is reasonably necessary to: enforce our Terms of Use or Privacy Policy; respond to claims that an advertisement, posting or other content violates the rights of a third party; or protect the rights, property or personal safety of our users or the general public.

                    We and our affiliates will share / sell some or all of your personal information with another business entity should we (or our assets) plan to merge with, or be acquired by that business entity, or reorganization, amalgamation, restructuring of business. Should such a transaction occur that other business entity (or the new combined entity) will be required to follow this Privacy Policy with respect to your personal information.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Data Retention</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    We retain your personal information in accordance with applicable laws, for a period no longer than is required for the purpose for which it was collected or as required under any applicable law. However, we may retain data related to you if we believe it may be necessary to prevent fraud or future abuse, to enable Clikshop to exercise its legal rights and/or defend against legal claims or if required by law or for other legitimate purposes. We may continue to retain your data in anonymised form for analytical and research purposes.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Security Precautions</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    We maintain reasonable physical, electronic and procedural safeguards to protect your information. Whenever you access your account information, we offer the use of a secure server. Once your information is in our possession, we adhere to our security guidelines to protect it against unauthorized access. However, by using the Platform, the users accept the inherent security implications of data transmission over the internet and the World Wide Web which cannot always be guaranteed as completely secure, and therefore, there would always remain certain inherent risks regarding use of the Platform. Users are responsible for ensuring the protection of login and password records for their account.
                </Text>


                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Use of Children Information</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    Use of our Platform is available only to persons who can form a legally binding contract under the Indian Contract Act, 1872. We do not knowingly solicit or collect personal information from children under the age of 18 years. If you have shared any personal information of children under the age of 18 years, you represent that you have the authority to do so and permit us to use the information in accordance with this Privacy Policy.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Your Rights</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    We take every reasonable step to ensure that your personal information that we process is accurate and, where necessary, kept up to date, and any of your personal information that we process that you inform us is inaccurate (having regard to the purposes for which they are processed) is erased or rectified. You may access, correct, and update your personal information directly through the functionalities provided on the Platform. You may delete certain non-mandatory information by logging into our website. You can also write to us at the contact information provided below to assist you with these requests.
                    You have an option to withdraw your consent that you have already provided by writing to us at the contact information provided below. Please mention “for withdrawal of consent” in the subject line of your Email. We will verify such requests before acting upon your request. Please note, however, that withdrawal of consent will not be retroactive and will be in accordance with the terms of this Privacy Policy, related Terms of Use and applicable laws. In the event you withdraw consent given to us under this Privacy Policy, such withdrawal may hamper your access to the Platform or restrict provision of our services to you for which we consider that information to be necessary.
                </Text>


                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Choice/Opt-Out</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    We provide all users with the opportunity to opt-out of receiving non-essential (promotional, marketing-related) communications after setting up an account with us. If you do not wish to receive promotional communications from us.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'> Your Consent</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    By visiting our Platform or by providing your information, you consent to the collection, use, storage, disclosure and otherwise processing of your information (including sensitive personal information) on the Platform in accordance with this Privacy Policy. If you disclose to us any personal information relating to other people, you represent that you have the authority to do so and to permit us to use the information in accordance with this Privacy Policy.

                    You, while providing your personal information over the Platform or any partner platforms or establishments, consent to us (including our other corporate entities, technology partners, marketing channels, and business partners) to contact you through SMS, instant messaging apps, call and/or e-mail for the purposes specified in this Privacy Policy.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Changes made to this Privacy Policy</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    Please check our Privacy Policy periodically for changes. We may update this Privacy Policy to reflect changes to our information practices. We will alert you to significant changes by posting the date our policy got last updated, placing a notice on our Platform, or by sending you an email when we are required to do so by applicable law.

                    Note: Our privacy policy is subject to change at any time without notice. To make sure you are aware of any changes, please review this policy periodically.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Grievance Officer</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    In accordance with Information Technology Act 2000 and rules made there under, the name and contact details of the Grievance Officer are provided below:

                    Name :   Mr. Lokesh Kesharwani

                    Designation: Senior Managing Partner & CEO

                    Shop No - 53, Ward No - 46, Near Gaytri Temple, Shyama Prasad Mukharjee Nagar,

                    Bilaspur 495001 Chhattisgarh.

                    Time: Mon - Sat (11:00am - 5:00pm)
                </Text>
                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Contact us</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    You can reach our customer support team to address any of your queries or complaints related to product and services by writing to contact@Clikshop.co.in

                    Phone: 8109658338 Time: Mon - Sat (11:00am - 5:00pm).

                    Phone: 7389980438 Time: Mon - Sat (11:00am - 5:00pm).
                </Text>

            </ScrollView>
        </View>
    )
}

export default PrivacyPolicy

const styles = StyleSheet.create({
    contentContainer: {
        padding: 20
    },
    h1: {
        fontSize: 24,
        color: Colors.newTextColor,
        fontFamily: Fonts.LexendMedium
    },
    h2: {
        fontSize: 18,
        color: Colors.newTextColor,
        fontFamily: Fonts.LexendRegular
    },
    h3: {
        fontSize: 16,
        color: Colors.newTextColor,
        fontFamily: Fonts.LexendRegular
    },
    h4: {
        fontSize: 14,
        color: Colors.newTextColor,
        fontFamily: Fonts.Lexendlight,
        lineHeight: 24
    }
})