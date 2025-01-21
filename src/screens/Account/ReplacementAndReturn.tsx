import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '../../common/Colors'
import { Fonts } from '../../common/Fonts'
import CommonHeader from '../../component/CommonHeader'

const ReplacementAndReturn = (props: any) => {
    const { navigation } = props;
    return (
        <View className='flex flex-1 bg-whiteColor'>
            <CommonHeader navigation={navigation} title='Replacement & Refund Policy' isCartIcon={false} />
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Return / Replacement / PoD Policy</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    ● Replacement for the same is provided under the following circumstances : 1.Damaged product received, 2.Wrong book received, 3.Old edition of the book received, 4.Different Language book received (No refund is provided in such Case only replacement is provided)
                    {'\n'}
                    {'\n'}
                    ● After Receiving the Order from our Delivery Partner, customers will have to Check the product(s). If the product(s) is / are damaged or have some issue mentioned above then, he/she can apply for Replacement of the product within 24 hrs from receiving the product(s).
                    {'\n'}
                    {'\n'}
                    ● Clikshop provides the facility for replacement of the product for a time frame of 24 hrs after delivering the product to Customer. We do not provide any facility for replacement of the product from the customer after the above mentioned time frame is ended.No Replacement request is accepted thereafter.
                    {'\n'}
                    {'\n'}
                    ● In case the Product is damaged or has some issue as mentioned above, In those Circumstances, Customer should send back the product in its original state(i.e.sellers stamp marked product) along with its original Invoice. If not, then replacement for the product shall not be accepted.
                    {'\n'}
                    {'\n'}
                    ● Replacement for the product is accepted only once.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Refund Policy</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    ● In certain cases where the seller is unable to process a replacement for any reason whatsoever, a refund will be given to the customer.
                    {'\n'}
                    {'\n'}
                    ● In Cases of prepaid orders, if the order is cancelled by the customer before delivery of the product under such circumstances refund will be provided.
                    {'\n'}
                    {'\n'}
                    ● In a situation where the product ordered by the customer is unavailable with the seller, or is out of stock, or the requested quantity is not available, under such circumstances the seller has the right to cancel the order. Refund for the same will be initiated.
                    {'\n'}
                    {'\n'}
                    ● In case the Delivery Address provided by the customer is outside our Service Area.
                    {'\n'}
                    {'\n'}
                    ● Under the circumstances where the Product is not available with the seller or we are unable to ship the product.
                    {'\n'}
                    {'\n'}
                    ● In case of cancellation before shipment, we process the refund within 24-48 business hours after receiving the cancellation request.
                    {'\n'}
                    {'\n'}
                    ● Incase of Cancellation after shipment & before delivery, we issue partial refund after deducting the shipping charges (original tarrif amount imposed on despatching the order). Also, the refund process under this circumstance starts within 48hrs after the product is recieved back to us in its original state.
                </Text>
                <Text className='text-xl font-LexendMedium text-newTextColor'>
                    Note:-
                </Text>
                <Text style={[styles.h4, {}]}>
                    1. For payments done through credit/debit cards or net banking ,the refund will be processed to the same account from which the payment was made.
                    {'\n'}
                    {'\n'}
                    2. For cash on delivery transactions ,we will initiate a bank transfer for the refund amount against the billing details shared by you. This process will be completed within 2-3 business days of us receiving the products back and your bank details on email. [Note: If a customer applies for replacement of the product and the product is not in stock with the seller, Under such circumstances a refund will be provided only if the product is sent in its original state(original stamped book and original invoice) by the customer.]
                    {'\n'}
                    {'\n'}
                    3. Refunds are Initiated within 7-15 Days after the product has been Received by us. However, it may take 3-5 working days for your bank to reflect the amount in your account. 'In case the product was not delivered and you received a delivery confirmation email/SMS, report the issue within 48hrs from the date of delivery confirmation for the seller to investigate.'
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Cancellation Policy</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    ● Cancellation of Order(s) by Customer Can be done anytime before delivering the product. For Cancelling the order before delivery, Customers can open My Account{'>'} My Orders{'>'}Order Details{'>'}Cancel Product{'>'}Cancel.
                    {'\n'}
                    {'\n'}
                    ● In a situation where the product ordered by the customer is unavailable with the seller, or is out of stock, or the asked quantity is not available, In such scenario the seller has the right to cancel the order.
                    {'\n'}
                    {'\n'}
                    ● No cancellation facility is provided by us after 24hrs of receiving the product by the customer. In such Scenario, Only Replacement of the product is provided by Clikshop. For more details on Return and Replacement refer to Returns Policy.
                    {'\n'}
                    {'\n'}
                    ● In case of cancellation of order after confirming the order in cash on delivery / pay on delivery mode, once the order is already shipped in such cases the parcel should be returned via speed post to clikshop's registered address, Any charges incurred by customer in sending those articles will not be born by clikshop.
                    {'\n'}
                    {'\n'}
                    ● In areas, where our agent is not available to pickup the return article from customer in such cases it is mandatory to ship the returned article within 24hrs by the customer & send us the image of consignment tracking slip provided by Indian post.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>CoD / PoD Policy</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    ● PoD refers to Pay on Delivery; this means Customer has to pay via link or QR generated and provided by Clikshop on Customer's respective E-mails & mobile number of the associated order amount. Customers need to pay online via scanning the Qr code or link provided by clikshop on delivery of their order.
                    {'\n'}
                    {'\n'}
                    ● Payment for PoD should be done within 24hrs of receiving the order.
                    {'\n'}
                    {'\n'}
                    ● Any default in payment will lead to legal action against Customer along with penalty if the amount is not paid within said time of 24hrs.
                    {'\n'}
                    {'\n'}
                    ● A Confirmation call by our representative is made to confirm your CoD/PoD order. If after confirming the order you change your mind and cancel your order when the order is already shipped by the seller and this behaviour is done on a constant basis (i.e, you cancelled your order after shipment in continuous 3 orders ) then we will ban you as a customer on our site and futhermore you shall not be able to make any purchase from Clikshop.
                    {'\n'}
                    {'\n'}
                    ● After Confirmation of your order, incase you cancel the order from your side after shipment of your order then in such cases, it is your responsibility to return the order via speed post within 24hrs of receiving the order and send us the image of consignment tracking slip provided by Indian Post. If not done so, then the order amount should be borne by you. If you do not follow the above condition then, strict legal action will be taken from our side.
                    {'\n'}
                    {'\n'}
                    ● Cash On Delivery is available in all parts of Chhattisgarh State. Additional 5% charge is applicable on COD. If a customer choses to pay via cash at the time of delivery then, he or she will have to pay the order total plus 5% COD charges(non refundable) of the total value at the time of delivery to our delivery partner.
                    {'\n'}
                    {'\n'}
                    ● If a person selects QR payment mode & fails(default) to pay the amount within 24hrs after recieving the order, then, Penalty will be imposed and strict legal action will be taken from our side. Fine of Rs.100 per day for late payment will be imposed on the customer from the day of delivery & all other expenses incurred in the process of collection of the default amount will be added and be borned by the customer who has made default in his/her payment.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Note:</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    ● Incase of QR payment, After recieving the order if the customer is facing some kind of technical issue in payment, then he/she should immediately update us within 24hrs time frame from recieving the order in writing stating the issue for non payment due to which they are unable to pay in prescribed time limit . Relaxation of extra 24hrs without penalty will only be provided to customers who have updated our team of the problem being faced by them in writing & in the above mentioned time frame.
                    {'\n'}
                    {'\n'}
                    ● If the customer makes default in payment and after that by seeing the penalty charges wishes to return the order, then, no returns or replacements are accepted as our replacement time is only 24hrs from recieving the order & we do not accept returns only 24hrs replacement facility is available. In such scenario, customer will have to pay the fine & keep the order.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]} className='underline'>Frequently Asked Questions (FAQ's)</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    1. Why do I see different prices for the same product? You could see different prices for the same product, as it could be listed by different Sellers.
                    {'\n'}
                    {'\n'}
                    2. If I request for a replacement, when will I get it? The replacement is initiated after the originally delivered item is picked up. For more details, Please check your SMS & email we send you for a replacement request.
                    {'\n'}
                    {'\n'}
                    3. Can items be returned after the 24hrs time frame window is closed? No, the items will not be accepted for replacement/return after the time frame window is closed.
                    {'\n'}
                    {'\n'}
                    4. How does cancellation work? ● Log into Clikshop account ● Go to My Orders ● Click on order details against the item which you wish to return/replace. ● Click on Cancel Product{'>'}Cancel.
                    {'\n'}
                    {'\n'}
                    5. I see the 'Cancel', ‘Replacement’ button but I can't click on it. Why? A grayed out and disabled 'Cancel' , ‘Replacement’ button can possibly mean that the item has been delivered and the replacement/cancellation time frame for the product is over and you cannot request for the same.
                    {'\n'}
                    {'\n'}
                    6. What should I do if my order is confirmed but hasn't been shipped yet? Sellers usually ship orders 2-3 business days before the delivery date so that they reach you on time. In case your order hasn't been shipped within this time please contact our Customer Support so that we can look into it.
                    {'\n'}
                    {'\n'}
                    7. The delivery of my order is delayed. What should I do? On the rare occasion your order is delayed, please check your email & messages for updates. A new delivery timeframe will be shared with you and you can also track its status by visiting My Orders.
                    {'\n'}
                    {'\n'}
                    8. Will the delivery be tried again if I'm not able to collect my order the first time? Yes, our Courier partner makes sure that the delivery is re-attempted the next working day if you can't collect your order the first time.
                    {'\n'}
                    {'\n'}
                    9. I missed the delivery of my order today. What should I do? In case you miss a delivery, the courier partner delivering your order usually tries to deliver it on the next business day. You can also check your SMS for more details on when the courier service will try to deliver again.
                    {'\n'}
                    {'\n'}
                    10. How do I know my order has been confirmed? An SMS and e-mail will be sent once you've successfully placed your order. We'll also let you know as soon as the seller ships the item(s) to you along with the tracking number(s) for your shipment(s). You can track your orders from the 'My Orders' section on your Clikshop Account.
                    {'\n'}
                    {'\n'}
                    11. Is it necessary to have an account to shop on Clikshop? Yes, it's necessary to log into your clikshop account to shop. Shopping as a logged-in user is fast & convenient and also provides extra security.You'll have access to a personalized shopping experience.
                    {'\n'}
                    {'\n'}
                    12. How can I add a new delivery address to my Clikshop account? ● Log in to your Clikshop account. ● Go to My Account{'>'}Manage Profiles{'>'}Add new address. ● Add details of your new address. ● Click on the ‘Save’ button.
                    {'\n'}
                    {'\n'}
                    13. Why do I need to verify my mobile number or email address to log into my Clikshop account? To make sure that your account details are always secure, verification by OTP (One Time Password) is important. This is a one-time process and you can log into your Clikshop  account hasslefree once this is done.
                    {'\n'}
                    {'\n'}
                    14. I live in a rural area. How can I send my original item for replacement once the request has been accepted? Once your replacement request has been accepted, you need to pack the product and send it back to us via India Post to the address mentioned in the invoice and provide us an image of the courier bill. The charge incurred by you for returning the product will be reimbursed to you in your respective bank account. Reimbursement will be provided only when the Product returned is in its Original state (i.e. sellers stamp marked product) along with its original Invoice)and proper Bill of the courier is attached and sent on our email address.
                    {'\n'}
                    {'\n'}
                    15. I live in an urban area.How can I send my original item for replacement once the request has been accepted? You need to pack and keep the product ready. Our courier representative will come and pick up the product. Under circumstances, where pick up of the product is not possible in such cases we will provide the address of the respective Courier station where you need to drop the product in the respective drop station.


                </Text>

                <Text style={[styles.h2, { marginTop: 20 }]}>Shipping Policy</Text>
                <Text style={[styles.h3, { marginTop: 20 }]}>What are the delivery charges?</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    Delivery charges for the product depends on the following factor i.e, your location of delivery and weight of the product ordered. Delivery charges vary depending on the location in which you want the order.
                </Text>
                <Text style={[styles.h3, { marginTop: 20 }]}>What are the delivery charges?</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    ● The delivery time based on your location pin code (usually 3-7 business days are taken  in areas where standard courier service is available). For other areas, orders will be sent by Registered Post through the Indian Postal Service which may take 1-2 weeks depending on the location. Sellers generally procure and ship the items within the time specified on the product page. Business days exclude public holidays and Sundays. Estimated delivery time depends on the following factors:
                    {'\n'}
                    {'\n'}
                    ● The Seller offering the product
                    {'\n'}
                    {'\n'}
                    ● Product's availability with the Seller
                    {'\n'}
                    {'\n'}
                    ● The destination to which you want the order shipped to and location of the Seller
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]}>Why does the delivery date not correspond to the delivery timeline of X-Y business days?</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    It is possible that the Seller or our courier partners have a holiday between the day you placed your order and the date of delivery, which is based on the timelines shown on the product page. In this case, we add a day to the estimated date. Some courier partners and Sellers do not work on Sundays and this is factored into the delivery dates.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]}>Are there any hidden costs (sales tax, octroi etc.) on items sold by Sellers on Clikshop?</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    There are NO hidden charges when you make a purchase on Clikshop. List prices are final and all-inclusive. The price you see on the product page is exactly what you would pay. Delivery charges are not hidden charges and are charged (if at all) extra depending on the shipping policy.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]}>Why does the seller not/cannot ship to my area ?</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    ● Whether your location can be serviced or not depends on
                    {'\n'}
                    {'\n'}
                    ● Whether the Seller ships to your location
                    {'\n'}
                    {'\n'}
                    ● Legal restrictions if any, in shipping particular products to your location
                    {'\n'}
                    {'\n'}
                    ● the availability of reliable courier partners in your location.
                    {'\n'}
                    {'\n'}
                    At times Sellers prefer not to ship to certain locations. This is entirely at their discretion.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]}>Why is the CoD option not offered in my location?</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    Availability of CoD depends on the availability of our courier partner servicing in your location to accept cash as payment at the time of delivery. Our courier partners have limits on the cash amount payable on delivery depending on the destination and your order value might have exceeded this limit. Please enter your pin code on the product page to check if CoD is available in your location.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]}>What is PoD? Where is it available ?</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    PoD refers to Pay on Delivery; this means Customer has to pay via link or QR generated and provided by Clikshop on their respective E-mails & mobile number of the associated order amount. Pay on Delivery is available All over Chhattisgarh, People residing in the states of Chhattisgarh get an advantage of the Pay on Delivery Method. They need to pay online via link or QR provided by us on delivery of their order.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]}>When should I pay the amount if I availed PoD facility ?</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    It is mandatory to pay the amount within 24hrs of delivery of your order. Incase you face any issue regarding payments you should immediately inform us in the customer support number provided. Any default in payment will lead to legal action against you along with penalty if the amount is not paid within said time of 24hrs.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]}>I need to return an item, how do I arrange for a pick-up?</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    Returns are easy. Contact Us to initiate a return. You will receive a call explaining the process, once you have initiated a return.
                </Text>

                <Text style={[styles.h3, { marginTop: 20 }]}>I have confirmed my cash / pay on delivery Order but i want to cancel that is it possible?</Text>
                <Text style={[styles.h4, { marginTop: 20 }]}>
                    Yes, you can cancel the order before shipment of your order i.e, in the packing stage, Once your order is despatched then. any cancellation made by you will be accepted but in that case you will have to return the parcel via speed post within 24hrs after you receive it and send us the image of consignment tracking details. Also, the amount incurred by you in sending the article will not be born by us. If the article is not sent within 24hrs then the price of the article should be paid by you & you will have to keep the order. If after 24 hrs payment is not received from your side then strict legal action will be taken against you by clikshop.
                </Text>
            </ScrollView>
        </View>
    )
}

export default ReplacementAndReturn

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