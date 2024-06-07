import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);
const getCart=()=>{
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [all_img, setAll_product] = useState([]);
    const [cartItem, setCartItem] = useState(getCart());

    useEffect(() => {
        fetch('http://localhost:5000/allproduct')
            .then((response) => response.json())
            .then((data) => setAll_product(data.products)); // Lấy mảng sản phẩm từ dữ liệu trả về và gán cho all_img
    }, []);

    const addToCart = (itemId) => {
        setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    };

    const removeToCart = (itemId) => {
        setCartItem((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
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
                total += itemInfor.new_price * cartItem[item];
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
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
