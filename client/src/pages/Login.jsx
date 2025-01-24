import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import { useContext } from "react";
import { parseJwt } from "../utils/ParseJwt";
import { Link } from "react-router-dom";
import { API_URL } from "../utils/ApiUrl";



export const Login = () => {
  const [correo_electronico, setCorreoElectronico] = useState("");
  const [clave, setClave] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [tokenExistAndIsValid, setTokenExistAndIsValid] = useState(false);


  useEffect(()=>{
      const timer = setTimeout(()=>{
        setMessage("")
        setClave("")
      },2000)
      return ()=> clearTimeout(timer)
  },[message])

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const tokenData = parseJwt(token);
      if (tokenData.exp * 1000 > Date.now()) {
        setTokenExistAndIsValid(true);
        navigate('/');
      }
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo_electronico, clave }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        if(data.user.rol === 'Admin'){
          if(data.token){
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('rol',data.user.rol)
            localStorage.setItem('email',data.user.correo_electronico)
            setIsAuthenticated(true); 
            navigate('/dashboard');
          }
        }
        else{
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('rol',data.user.rol)
          localStorage.setItem('email',data.user.correo_electronico)
          setIsAuthenticated(true); 
          navigate('/inicio');
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (tokenExistAndIsValid) {
    return null; 
  }
  return (
    <>
      <section className="w-full flex flex-col items-center justify-center gap-3">
        <form onSubmit={handleSubmit} className="w-[100%] h-auto bg-white flex flex-col gap-5 p-5 sm:w-[50%] xl:w-[30%] sm:shadow-lg sm:rounded-lg sm:mt-5 sm:py-5 sm:mt-[25px]">
          <header className="w-full flex flex-col items-center">
            <a href="/inicio">
              <img
                className="w-30 h-[120px] rounded-[50%]"
                src="data:image/jpeg;base64,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"
                alt="Sala Ginex Logo"
              />
            </a>
            <p className="text-xl font-bold mt-5">Inicia sesión con tu cuenta</p>
          </header>
          <section className="w-full flex flex-col items-center sm:w-[100%] sm:mx-auto sm:flex sm:flex-col sm:items-center">
            <div className="flex flex-col w-full p-2">
              <label className="p-1 text-lg font-medium" htmlFor="email">
                Correo Electronico:{" "}
              </label>
              <input
                className="p-3 border rounded-[10px] text-lg"
                type="email"
                id="email"
                name="correoElectronico"
                placeholder="Ingresa tu correo electronico"
                value={correo_electronico}
                onChange={(e) => setCorreoElectronico(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full p-2">
              <label className="p-1 text-lg font-medium" htmlFor="password">
                {" "}
                Contraseña:
              </label>
              <input
                className="p-3 border rounded-[10px] text-lg"
                type="password"
                name="password"
                id="clave"
                placeholder="Ingresa tu contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </div>
          </section>
          <section className="w-full flex flex-col items-center">
            <button
              type="submit"
              className="p-3 w-[40%] bg-[#010739] text-white text-xl font-medium rounded-[25px] mt-5 sm:w-[200px]"
            >
              Ingresar
            </button>
          </section>
          <a href="/recovery" className="text-[#bbb] text-center text-[18px]">
            ¿Olvidaste la contraseña?
          </a>
          <Link to='/register' className="text-[#bbb] text-center  text-[19px]">¿No tienes cuenta? Crear una</Link>
          {message && <p className="mx-auto w-full p-4 bg-red-500 text-white text-center text-lg font-medium rounded-[10px]">{message}</p>}
        </form>
      </section>
    </>
  );
};