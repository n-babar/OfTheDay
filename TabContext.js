import React, { createContext, useContext, useState } from 'react';

const TabContext = createContext();

export const useTab = () => useContext(TabContext);

export const TabProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState('Sign In');

    const changeTab = (tab) => {
        setActiveTab(tab);
        // console.log("Active tab set to:", tab);
    };

    return (
        <TabContext.Provider value={{ activeTab, changeTab }}>
            {children}
        </TabContext.Provider>
    );
};
