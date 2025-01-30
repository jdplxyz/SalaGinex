import {createContext, useState } from "react";

 const CurrencyContext = createContext()

function CurrencyProviderWraper(props){
    
    const [currencyRate,setCurrencyRate] = useState(null)


    const getRateCurrency = async (value,currency) =>{
        try{
            const response = await fetch(`https://pydolarve.org/api/v1/dollar/conversion?type=${currency}&value=${value}&page=alcambio&monitor=enparalelovzla`)
            const data = await response.json()
            setCurrencyRate(60)
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
