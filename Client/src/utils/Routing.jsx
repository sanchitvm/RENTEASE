import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../Components/NavRoutes/Home.jsx'
import ContactUs from '../Components/NavRoutes/ContactUs.jsx'
import Blog from '../Components/NavRoutes/Blog.jsx'
import Login from '../Components/Login/Login.jsx'
import ForgotPassword from '../Components/Login/ForgotPassword.jsx'
import ResetPassword from '../Components/Login/ForgotPassword.jsx'
import Register from '../Components/Login/Register.jsx'
import VerifyOtp from '../Components/Login/VerifyOtp.jsx'
import SerchResults from '../Components/ApiDataFetched/App'
import Profile from '../Components/Profile/Profile.jsx'
import FirstTimeHomeBuyers from '../Components/BlogData/FirstTimeHomeBuyers.jsx'
import MarketTrends from '../Components/BlogData/MarketTrends.jsx'
import InvestmentProperty from '../Components/BlogData/InvestmentProperty.jsx'
import HomeDecoration from '../Components/BlogData/HomeDecoration.jsx'
import SustainableLiving from '../Components/BlogData/SustainableLiving.jsx'
import UnderstandingHomeInsurance from '../Components/BlogData/UnderstandingHomeInsurance.jsx'
import LocationImportance from '../Components/BlogData/LocationImportance.jsx'
import RentingVsBuying from '../Components/BlogData/RentingVsBuying.jsx'
import AddProperty from '../Components/Property/AddProperty.jsx'
import Chat from '../Components/Chats/Chat.jsx'
import View from '../Components/Property/MyProperties.jsx'
import MyBookings from '../Components/Property/MyBookings.jsx'
import EditProperty from '../Components/Property/EditProperty.jsx'


const Routing = () => {
  return (
    <div>
      <Routes>
        <Route path='/' exact element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verify-otp' element={<VerifyOtp />} />
        <Route path='/api/properties/search-rent' element={<SerchResults />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/blog/first-time-home-buyers' element={<FirstTimeHomeBuyers />} />
        <Route path='/blog/market-trends' element={<MarketTrends />} />
        <Route path='/blog/investment-property' element={<InvestmentProperty />} />
        <Route path='/blog/spring-home-decor' element={<HomeDecoration />} />
        <Route path='/blog/sustainable-living' element={<SustainableLiving />} />
        <Route path='/blog/home-insurance' element={<UnderstandingHomeInsurance />} />
        <Route path='/blog/location-importance' element={<LocationImportance />} />
        <Route path='/blog/renting-vs-buying' element={<RentingVsBuying />} />
        <Route path='/add-property' element={<AddProperty />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/messages' element={<Chat />} />
        <Route path='/view-properties' element={<View />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/edit-property/:id' element={<EditProperty />} />
        <Route path='/chat-properties' element={<Chat />} />
      </Routes>
    </div>
  )
}

export default Routing