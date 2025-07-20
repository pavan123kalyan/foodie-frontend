import React, { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../context/StoreContext'

const FoodDisplay = ({ category }) => {
    const { food_list, searchQuery } = useContext(StoreContext);

    const filteredFoodList = food_list.filter(item => {
        const matchesCategory = category === "All" || category === item.category;
        const matchesSearch = item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {filteredFoodList.map((item, index) => {
                    return <FoodItem key={item._id || index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
                })}
            </div>
        </div>
    )
}

export default FoodDisplay
