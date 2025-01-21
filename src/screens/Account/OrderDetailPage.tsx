import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonHeader from '../../component/CommonHeader';
import { Fonts } from '../../common/Fonts';
import { BaseUrl } from '../../config/Key';
import * as _ORDER_SERVICE from '../../services/OrderService';
import Toast from 'react-native-toast-message';
import { Colors } from '../../common/Colors';
import moment from 'moment';

const { width } = Dimensions.get('window');

const OrderDetailPage = (props: any) => {
  const { order } = props.route.params;
  const { navigation } = props;
  const [loader, setLoader] = useState(false);
  const [updatedOrderDetails, setUpdatedOrderDetails] = useState(
    order.order_details,
  );
  const shippingAddress = JSON.parse(order?.shipping_address);

  const cancelProduct = async (
    productId: number,
    action: 'cancel' | 'replace',
  ) => {
    try {
      setLoader(true);
      const dataToSend = { order_detail_id: productId };
      const result: any = await _ORDER_SERVICE.cancel_order(dataToSend);

      const { status_code, message = '' } = result;
      if (status_code === 200) {
        setUpdatedOrderDetails((prevDetails: any) =>
          prevDetails.map((product: any) =>
            product.id === productId
              ? {
                ...product,
                delivery_status:
                  action === 'cancel' ? 'cancelled' : 'withdraw_request',
              }
              : product,
          ),
        );
        setLoader(false);
        Toast.show({
          // text1: 'Success!',
          text2: message,
          type: 'success',
          position: 'bottom',
          text1Style: {
            fontSize: 16,
            fontFamily: Fonts.LexendBold,
            color: 'green',
          },
          text2Style: {
            fontSize: 12,
            fontFamily: Fonts.LexendMedium,
            color: 'green',
          },
        });
      } else {
        Toast.show({
          text1: 'Error!',
          text2: message,
          type: 'error',
          position: 'bottom',
          text1Style: {
            fontSize: 16,
            fontFamily: Fonts.LexendBold,
            color: 'red',
          },
          text2Style: {
            fontSize: 12,
            fontFamily: Fonts.LexendMedium,
            color: 'red',
          },
        });
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#4CAF50';
      case 'shipped':
        return '#2196F3';
      case 'pending':
        return '#FFC107';
      case 'cancelled':
        return '#F44336';
      case 'withdraw_request':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'truck-delivery-outline';
      case 'shipped':
        return 'truck-delivery';
      case 'pending':
        return 'progress-clock';
      case 'cancelled':
        return 'cancel';
      case 'withdraw_request':
        return 'autorenew';
      default:
        return 'information-outline';
    }
  };

  const getReplacementApprovalStatus = (status: number) => {
    switch (status) {
      case 0:
        return 'Replacement Request Pending ';
      case 1:
        return 'Replacement Accepted';
      case 2:
        return 'Replacement Cancelled';
      default:
        return;
    }
  };

  const getBgColor = (status: number) => {
    switch (status) {
      case 1:
        return '#16a34a';
      case 2:
        return '#F44336';
      default:
        return '#FFC107';
    }
  };

  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const calculateTotalAmount = () => {
    return updatedOrderDetails.reduce(
      (total: number, product: any) =>
        total + product.price,
      0,
    );
  };

  const renderProductItem = (product: any, index: number) => {
    return (
      <View key={index}>
        <View style={styles.productItem}>
          <FastImage
            style={styles.productImage}
            source={{ uri: `${BaseUrl.base}public/${product?.product_image}` }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product?.product_name}</Text>
            <Text style={styles.authorName}>{product?.author}</Text>
            {order?.estimated_delivery_date && (
              <Text style={[styles.authorName, { marginTop: 4 }]}>
                Estimated delivery:
                <Text className="font-LexendMedium text-xs text-black">
                  {' ' + order?.estimated_delivery_date}
                </Text>
              </Text>
            )}
            <Text style={styles.productPrice}>₹{product?.price}</Text>
            <View style={styles.statusContainer}>
              <Icon
                name={getStatusIcon(product?.delivery_status)}
                size={16}
                color={getStatusColor(product?.delivery_status)}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(product.delivery_status) },
                ]}>
                {capitalizeFirstLetter(product?.delivery_status == "on_delivery" ? "Out for delivery" : product.delivery_status.replaceAll("_", " "))}{' '}
                {product?.cancelled_by === 'admin' ||
                  product?.cancelled_by === 'seller'
                  ? `by ${capitalizeFirstLetter(product?.cancelled_by)}`
                  : null}
              </Text>
            </View>
            {product.delivery_status !== 'delivered' &&
              product.delivery_status !== 'cancelled' && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#FF5722' }]}
                  onPress={() => cancelProduct(product.id, 'cancel')}
                  disabled={loader}>
                  <Text style={styles.actionButtonText}>Cancel Product</Text>
                </TouchableOpacity>
              )}
            {product.delivery_status === 'delivered' &&
              moment().isBefore(moment(product.delivery_date).add(1, 'days')) &&
              !product.product_return_status && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
                  onPress={() =>
                    navigation.navigate('ReplacementReason', {
                      productId: product.id,
                    })
                  }
                  disabled={loader}>
                  <Text style={styles.actionButtonText}>Replace Product</Text>
                </TouchableOpacity>
              )}
            {product.delivery_status === 'delivered' &&
              product?.refund !== null &&
              !product.product_refund_status && (
                <View
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: getBgColor(
                        product?.refund?.replace_status,
                      ),
                    },
                  ]}>
                  <Text style={styles.actionButtonText}>
                    {getReplacementApprovalStatus(
                      product?.refund?.replace_status,
                    )}
                  </Text>
                </View>
              )}

            {product?.refund !== null && product?.product_refund_status && (
              <View
                style={[styles.actionButton]}
                className={`${product?.product_refund_status === 'refund_initiated'
                  ? 'bg-yellow-400'
                  : 'bg-green-600'
                  }`}>
                <Text style={styles.actionButtonText}>
                  {product?.product_refund_status === 'refund_initiated'
                    ? 'Refund Initiated'
                    : 'Refund Successfully'}
                </Text>
              </View>
            )}
          </View>
        </View>
        {index < updatedOrderDetails.length - 1 && (
          <View style={styles.productDivider} />
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader
        title="Order Details"
        navigation={navigation}
        isCartIcon={false}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.orderInfoContainer}>
          <Text style={styles.orderIdText}>Order ID: #{order?.order_code}</Text>
          <Text style={[styles.dateText, { marginTop: 10 }]}>
            Order Date: {moment(order?.date).format('DD MMM YYYY')}
          </Text>
          {/* <Text style={[styles.dateText, { marginTop: 10 }]}>Delivery Date: {order?.delivery_date}</Text> */}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Products</Text>
          {updatedOrderDetails.map((product: any, index: number) => {
            return renderProductItem(product, index);
          })}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.divider}></View>
          <Text style={styles.infoText}>
            Payment Method:{' '}
            {capitalizeFirstLetter(order?.payment_type?.replaceAll('_', ' '))}
          </Text>
          <Text style={styles.infoText}>
            Payment Status: {capitalizeFirstLetter(order?.payment_status)}
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.divider}></View>
          <Text style={styles.infoText}>
            {shippingAddress?.name},{'\n'}
            {shippingAddress?.phone},{'\n'}
            {shippingAddress?.address},{'\n'}
            {shippingAddress?.city},{'\n'}
            {shippingAddress?.state},{'\n'}
            {shippingAddress?.pincode}
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.divider}></View>
          <View style={styles.summaryRow}>
            <Text style={styles.infoText}>Total items</Text>
            <Text style={styles.infoText}>₹ {calculateTotalAmount()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.infoText}>Shipping cost</Text>
            <Text style={styles.infoText}>₹ {order?.total_shipping_cost}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalText}>Grand Total</Text>
            <Text style={styles.totalAmount}>
              ₹ {calculateTotalAmount() + order?.total_shipping_cost}
            </Text>
          </View>
        </View>
      </ScrollView>
      {loader && (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={Colors.primaryColor}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 32,
  },
  orderInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  orderIdText: {
    fontFamily: Fonts.LexendMedium,
    fontSize: 16,
    color: '#212121',
    marginBottom: 8,
  },
  dateText: {
    fontFamily: Fonts.LexendRegular,
    fontSize: 14,
    color: '#757575',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontFamily: Fonts.LexendMedium,
    fontSize: 18,
    color: '#212121',
    marginBottom: 7,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  productImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontFamily: Fonts.LexendMedium,
    fontSize: 14,
    color: '#212121',
    marginBottom: 4,
  },
  authorName: {
    fontFamily: Fonts.LexendRegular,
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  productPrice: {
    fontFamily: Fonts.LexendMedium,
    fontSize: 16,
    color: '#FF5722',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    marginLeft: 4,
    fontFamily: Fonts.LexendMedium,
    fontSize: 14,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: Fonts.LexendMedium,
    fontSize: 12,
  },
  infoText: {
    fontFamily: Fonts.LexendRegular,
    fontSize: 14,
    color: '#212121',
    marginBottom: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalText: {
    fontFamily: Fonts.LexendMedium,
    fontSize: 16,
    color: '#212121',
  },
  totalAmount: {
    fontFamily: Fonts.LexendBold,
    fontSize: 16,
    color: '#212121',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
  },
  productDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
});

export default OrderDetailPage;
