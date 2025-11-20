import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '₹ ';
    const delivery_fee = 50;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const [user, setUser] = useState(null);
    const navigate = useNavigate();


    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserCart = async ( token ) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getUserProfile = async () => {
        try {
            if (!token) {
                console.log('No token available for getUserProfile');
                return getUserDataFromToken();
            }
            
            console.log('Attempting to fetch user profile from API...');
            console.log('Backend URL:', backendUrl);
            console.log('Token:', token.substring(0, 20) + '...');
            
            const response = await axios.post(backendUrl + '/api/user/profile', {}, { headers: { token } });
            console.log('Profile API response:', response.data);
            
            if (response.data.success) {
                console.log('User profile fetched successfully:', response.data.user);
                setUser(response.data.user);
                // Store user data in localStorage as backup
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                return response.data.user;
            } else {
                console.log('API returned error:', response.data.message);
                toast.error(response.data.message);
                // Fallback to token-based user data if API fails
                return getUserDataFromToken();
            }
        } catch (error) {
            console.log('Profile API request failed:', error.message);
            console.log('Full error:', error);
            
            // Check if it's a network error
            if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
                toast.warn('Backend server not available, using offline mode');
            }
            
            // Fallback to token-based user data
            return getUserDataFromToken();
        }
    }

    const getUserDataFromToken = () => {
        try {
            if (!token) {
                console.log('No token available for getUserDataFromToken');
                return null;
            }
            
            console.log('Attempting to get user data from token/localStorage...');
            
            // Try to get from localStorage first
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
                console.log('Found stored user data:', storedUserData);
                const userData = JSON.parse(storedUserData);
                setUser(userData);
                return userData;
            }
            
            // Fallback: decode token and create user data
            console.log('Decoding token for user data...');
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const fallbackUser = {
                id: tokenData.id,
                name: localStorage.getItem('userName') || 'User',
                email: localStorage.getItem('userEmail') || 'user@example.com',
                joinDate: new Date(tokenData.iat * 1000).toISOString()
            };
            
            console.log('Created fallback user:', fallbackUser);
            setUser(fallbackUser);
            localStorage.setItem('userData', JSON.stringify(fallbackUser));
            return fallbackUser;
            
        } catch (error) {
            console.log('Error decoding token:', error);
            // Last fallback: create minimal user data
            const minimalUser = {
                id: 'temp-id',
                name: localStorage.getItem('userName') || 'Guest User',
                email: localStorage.getItem('userEmail') || 'guest@example.com',
                joinDate: new Date().toISOString()
            };
            console.log('Using minimal user data:', minimalUser);
            setUser(minimalUser);
            return minimalUser;
        }
    }

    const updateUserProfile = async (profileData) => {
        try {
            if (!token) {
                toast.error('Please login to update profile');
                return { success: false, message: 'No authentication token' };
            }
            
            console.log('Attempting to update user profile via API...');
            console.log('Update data:', profileData);
            
            const response = await axios.post(backendUrl + '/api/user/update-profile', profileData, { headers: { token } });
            console.log('Update API response:', response.data);
            
            if (response.data.success) {
                console.log('Profile updated successfully via API');
                setUser(response.data.user);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                toast.success(response.data.message);
                return response.data;
            } else {
                toast.error(response.data.message);
                return response.data;
            }
        } catch (error) {
            console.log('Update API request failed:', error.message);
            console.log('Full error:', error);
            
            // Fallback: update locally stored data
            const currentUser = user || getUserDataFromToken();
            if (currentUser) {
                const updatedUser = {
                    ...currentUser,
                    name: profileData.name || currentUser.name,
                    // Note: Can't update password locally for security
                };
                
                console.log('Using local fallback update');
                setUser(updatedUser);
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                
                // Update individual localStorage items for backward compatibility
                if (profileData.name) {
                    localStorage.setItem('userName', profileData.name);
                }
                
                toast.success('Profile updated successfully (offline mode)');
                return { success: true, message: 'Profile updated locally', user: updatedUser };
            } else {
                toast.error('Failed to update profile');
                return { success: false, message: 'Failed to update profile' };
            }
        }
    }

    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
            getUserProfile()
        }
    }, [token])

    const value = {
        products, currency, delivery_fee,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, user, setUser,
        getUserProfile, updateUserProfile
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;