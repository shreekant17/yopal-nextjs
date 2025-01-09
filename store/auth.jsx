"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from "next-auth/react";
import React from 'react';


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const router = useRouter();
    
    const userAuthentication = async () => {
       
            try {
                const response = await fetch("/api/authenticate", {
                    method: "GET",
                });
    
                if (response.ok) {

                    const result = await response.json();
                    const email = result.user.email;
                    const password = result.user.password;


                    try {
    
                        const result = await signIn("credentials", {
                            email,
                            password,
                            redirect: false, // Prevent automatic redirect
                        });
            
                        if (result?.error) {
                            
                        } else {
                            //console.log("Authentication Passes");
                            setIsLoggedIn(true);
                            //router.push("/feed");
                        }
            
                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    const result = await response.json();
                  
                }
            } catch (error) {
                console.log("Error:", error);
                
            }
        }

    const logout = async () => {
        try {
            const response = await fetch("/api/logout", {
            method: "GET",
            });

            if (!response.ok) {
            return;
            }
            await signOut({ redirect: false });
        } catch (error) {
            console.error('Error during sign-out or fetching user data:', error);
        }
    }
    

    useEffect(() => {
        userAuthentication();
    }, []);



    return (<AuthContext.Provider value={{ isLoggedIn, logout }}>
        {children}
    </AuthContext.Provider>
    );

};

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new ERROR("useAuth used outside of the provider");
    }
    return authContextValue;
}






