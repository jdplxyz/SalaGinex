import { QRCode } from "react-qr-code";

export const QRCode = () =>{
<QRCode
        value="https://ejemplo.com" 
        size={200} 
        bgColor="#ffffff" 
        fgColor="#000000"
        level="Q" 
    />
}