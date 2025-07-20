import React,{useState, useContext} from 'react' // Import useContext
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import { StoreContext } from '../../context/StoreContext'; // Import StoreContext

const Home = () => {
    // Consume category and setCategory from StoreContext
    const { category, setCategory } = useContext(StoreContext); // <--- GET category and setCategory from context

    return (
        <div>
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category}/>
            <AppDownload />
        </div>
    )
}

export default Home
