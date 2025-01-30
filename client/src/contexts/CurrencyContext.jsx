import {createContext, useState } from "react";

 const CurrencyContext = createContext()

function CurrencyProviderWraper(props){
    
    const [currencyRate,setCurrencyRate] = useState(60)
 

    return (
        <CurrencyContext.Provider value={{currencyRate}}>
            {props.children}
        </CurrencyContext.Provider>
    )

}

export {CurrencyContext,CurrencyProviderWraper}
