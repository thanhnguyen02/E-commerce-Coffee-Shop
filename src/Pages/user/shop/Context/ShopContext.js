import React,{createContext, useState,useEffect} from 'react'
import all_img from '../../../img/all_img';

export const ShopContext = createContext(null);

const getCart=()=>{
    let cart = {};
    for (let index = 0; index < all_img.length+1; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props)=>{
    const [cartItem,setCartItem]=useState(getCart());
    
    const addToCart=(itemId)=>{
        setCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        
    }

    const removeToCart=(itemId)=>{
        setCartItem((prev)=>({...prev,[itemId]:prev[itemId]-1}));
    }
    const getQuantityCart=()=>{
        let totalquantity=0;
        for(const item in cartItem)
        {
            if(cartItem[item]>0)
                {
                   totalquantity+=cartItem[item];
                }
        }return totalquantity;
    }
    
    const getTotalCart=()=>{
        let total = 0;
        for(const item in cartItem)
            {
                if(cartItem[item]>0)
                    {
                        let itemInfor = all_img.find((product)=>product.id===Number(item))
                        total+=itemInfor.new_price * cartItem[item];
                    }
            }
            return total;
    }

    const contextValue ={getQuantityCart,getTotalCart,all_img,cartItem,addToCart,removeToCart};
    
    return(
        <ShopContext.Provider value = {contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;
