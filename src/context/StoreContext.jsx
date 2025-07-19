import { createContext,useEffect,useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) =>{

    const [cartItems,setCartItems]=useState({});
    const url="https://foodie-backend-t7kv.onrender.com"
    const [token,setToken]=useState("");
    const [food_list,setFoodList]=useState([]);

    const addToCart= async(itemId)=>{
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        if(token){
            try {
                await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
            } catch (error) {
                console.error("Error adding to cart on backend:", error);
            }
        }
    }

    const removeFromCart= async(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(token){
            try {
                await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
            } catch (error) {
                console.error("Error removing from cart on backend:", error);
            }
        }
    }

    const getTotalCartAmount =() =>{
        if (food_list.length === 0) return 0; // Ensure food_list is loaded

        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let iteminfo=food_list.find((product)=>product._id===item);
                if (iteminfo) { // Ensure iteminfo is found
                    totalAmount += iteminfo.price * cartItems[item];
                } else {
                    console.warn(`Food item with ID ${item} not found in food_list.`);
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async ()=>{
        try {
            const response =await axios.get(url+"/api/food/list");
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    }

    const loadcartData = async (token) =>{
        try {
            const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
            if (response.data.success) {
                setCartItems(response.data.cartData);
            } else {
                console.error("Failed to load cart data from backend:", response.data.message);
                setCartItems({});
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
            setCartItems({});
        }
    }

    useEffect(()=>{
        async function loadData(){
            await fetchFoodList();
            if (localStorage.getItem("token")){
                const storedToken = localStorage.getItem("token");
                setToken(storedToken);
                await loadcartData(storedToken);
            }
        }
        loadData();
    },[])

    const contextValue={
        food_list,
        cartItems,
        setCartItems, // <--- Ensure setCartItems is exported here
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }

    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
