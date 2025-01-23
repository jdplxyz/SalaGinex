import { createContext, useState } from "react";

const UserContext = createContext()

function UserProviderWrapper(props){
    const [usersWithReservation,setUsersWithReservation] =  useState([])

    const getUserWithReservation = async() =>{
        try{

        }catch(error){
            console.error()
        }
    }

    return (
        <UserContext.Provider value={{usersWithReservation,getUserWithReservation}}>
            {props.childer}
        </UserContext.Provider>
    )


}

export {UserContext,UserProviderWrapper}