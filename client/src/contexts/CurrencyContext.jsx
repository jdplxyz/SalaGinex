import {createContext, useState } from "react";

 const CurrencyContext = createContext()

function CurrencyProviderWraper(props){
    
    const [currencyRate,setCurrencyRate] = useState(60)


    const getRateCurrency = async (value,currency) =>{
        try{
            const response = await fetch(`https://pydolarve.org/api/v1/dollar/conversion?type=${currency}&value=${value}&page=alcambio&monitor=enparalelovzla`)
            const data = await response.json()
            
        }catch(error){
            console.error(error)
        }
    }
 

    return (
        <CurrencyContext.Provider value={{currencyRate,getRateCurrency}}>
            {props.children}
        </CurrencyContext.Provider>
    )

}

export {CurrencyContext,CurrencyProviderWraper}
