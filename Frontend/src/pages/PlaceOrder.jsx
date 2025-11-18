import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Card } from '../components/ui';

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipcode.trim()) newErrors.zipcode = 'Zipcode is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    if (!token) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod":
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            setCartItems({});
            toast.success('Order placed successfully!');
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;

        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        default:
          toast.error('Please select a payment method');
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="container-wide pt-8 pb-16">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <Title text1="CHECKOUT" text2="& PAYMENT" />
            <p className="text-neutral-600 text-lg">Complete your order with secure payment</p>
          </div>

          <form onSubmit={onSubmitHandler} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Delivery Information */}
            <div className="space-y-6">
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900">Delivery Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">First Name *</label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="firstName"
                        value={formData.firstName}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-neutral-300'}`}
                        type="text"
                        placeholder="Enter first name"
                      />
                      {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Last Name *</label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="lastName"
                        value={formData.lastName}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-neutral-300'}`}
                        type="text"
                        placeholder="Enter last name"
                      />
                      {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">Email Address *</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="email"
                      value={formData.email}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500 bg-red-50' : 'border-neutral-300'}`}
                      type="email"
                      placeholder="Enter email address"
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">Street Address *</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="street"
                      value={formData.street}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.street ? 'border-red-500 bg-red-50' : 'border-neutral-300'}`}
                      type="text"
                      placeholder="Enter street address"
                    />
                    {errors.street && <p className="text-sm text-red-600">{errors.street}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">City *</label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="city"
                        value={formData.city}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.city ? 'border-red-500 bg-red-50' : 'border-neutral-300'}`}
                        type="text"
                        placeholder="Enter city"
                      />
                      {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">State</label>
                      <input
                        onChange={onChangeHandler}
                        name="state"
                        value={formData.state}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        type="text"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Zipcode *</label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="zipcode"
                        value={formData.zipcode}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.zipcode ? 'border-red-500 bg-red-50' : 'border-neutral-300'}`}
                        type="text"
                        placeholder="Enter zipcode"
                      />
                      {errors.zipcode && <p className="text-sm text-red-600">{errors.zipcode}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">Country *</label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="country"
                        value={formData.country}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.country ? 'border-red-500 bg-red-50' : 'border-neutral-300'}`}
                        type="text"
                        placeholder="Enter country"
                      />
                      {errors.country && <p className="text-sm text-red-600">{errors.country}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700">Phone Number *</label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="phone"
                      value={formData.phone}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${errors.phone ? 'border-red-500 bg-red-50' : 'border-neutral-300'}`}
                      type="tel"
                      placeholder="Enter phone number"
                    />
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Side - Order Summary & Payment */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="p-8">
                <CartTotal />
              </Card>

              {/* Payment Method */}
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900">Payment Method</h3>
                  </div>

                  <div className="space-y-4">
                    <div
                      onClick={() => setMethod("stripe")}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-primary-300 ${
                        method === "stripe" ? "border-primary-500 bg-primary-50" : "border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          method === "stripe" ? "border-primary-500" : "border-neutral-300"
                        }`}>
                          {method === "stripe" && <div className="w-3 h-3 bg-primary-500 rounded-full"></div>}
                        </div>
                        <img className="h-6" src={assets.stripe_logo} alt="Stripe" />
                        <span className="text-sm font-medium text-neutral-700">Credit/Debit Card</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setMethod("cod")}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-primary-300 ${
                        method === "cod" ? "border-primary-500 bg-primary-50" : "border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          method === "cod" ? "border-primary-500" : "border-neutral-300"
                        }`}>
                          {method === "cod" && <div className="w-3 h-3 bg-primary-500 rounded-full"></div>}
                        </div>
                        <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm font-medium text-neutral-700">Cash on Delivery</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading}
                    size="large"
                    className="w-full"
                  >
                    {isLoading ? "Processing..." : "PLACE ORDER"}
                  </Button>
                </div>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
