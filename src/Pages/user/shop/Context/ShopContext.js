import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ShopContext = createContext(null);

const getCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
}

const ShopContextProvider = (props) => {
  const [all_img, setAll_product] = useState([]);
  const [cartItem, setCartItem] = useState(getCart());
  const [userInfo, setUserData] = useState({});
  const [bills, setBills] = useState([]); // Thêm state để lưu trữ thông tin hóa đơn

  useEffect(() => {
    fetch('http://localhost:5000/allproduct')
      .then((response) => response.json())
      .then((data) => setAll_product(data.products));

    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:5000/getcart', {
        method: 'POST',
        headers: {
          'auth-token': `${localStorage.getItem('auth-token')}`,
        },
        body: '',
      })
        .then((response) => response.json())
        .then((data) => setCartItem(data));

      fetch('http://localhost:5000/user', {
        method: 'POST',
        headers: {
          'auth-token': `${localStorage.getItem('auth-token')}`,
        },
      })
        .then(response => response.json())
        .then(data => setUserData(data.data))
        .catch(error => console.error(error));
    }
  }, []);

  const fetchBills = useCallback(() => {
    const authToken = localStorage.getItem('auth-token');
    if (authToken) {
      fetch('http://localhost:5000/bills', {
        method: 'POST',
        headers: {
          'auth-token': authToken,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success === 1) {
            setBills(data.data);
          } else {
            console.error(data.message);
          }
        })
        .catch(error => console.error('Error fetching bills:', error));
    }
  }, []);

  const addToCart = (itemId) => {
    setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    const authToken = localStorage.getItem('auth-token');
    if (authToken) {
      fetch('http://localhost:5000/addtocart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error:', error));
    }
  };

  const removeToCart = (itemId) => {
    setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    const authToken = localStorage.getItem('auth-token');
    if (authToken) {
      fetch('http://localhost:5000/removefromcart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error:', error));
    }
  };

  const getQuantityCart = () => {
    let totalquantity = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        totalquantity += cartItem[item];
      }
    }
    return totalquantity;
  };

  const getTotalCart = () => {
    let total = 0;
    for (const item in cartItem) {
      if (cartItem[item] > 0) {
        let itemInfor = all_img.find((product) => product.id === Number(item));
        if (itemInfor && itemInfor.new_price) {
          total += itemInfor.new_price * cartItem[item];
        }
      }
    }
    return total;
  };

  const contextValue = {
    getQuantityCart,
    getTotalCart,
    all_img,
    cartItem,
    addToCart,
    removeToCart,
    userInfo,
    fetchBills, // Thêm hàm fetchBills vào context
    bills, // Thêm state bills vào context
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
