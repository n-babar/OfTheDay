import React, { createContext, useContext, useState, useEffect } from 'react';

const TabContext = createContext();

export const useTab = () => useContext(TabContext);

export const TabProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('Sign In');
    const [isBottomBarVisible, setIsBottomBarVisible] = useState(false);

    useEffect(() => {
        // Control the visibility of the bottom bar based on the active tab
        if (activeTab === 'Sign In' || activeTab === 'Sign In Again') {
            setIsBottomBarVisible(false);
        } else {
            setIsBottomBarVisible(true);
        }
    }, [activeTab]); // Dependency on activeTab ensures this runs whenever activeTab changes

    const changeTab = (tab) => {
        setActiveTab(tab);
    };

    return (
        <TabContext.Provider value={{ activeTab, setActiveTab, isBottomBarVisible, setIsBottomBarVisible, changeTab }}>
            {children}
        </TabContext.Provider>
    );
};