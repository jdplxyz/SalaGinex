export const formatDate = (dateString) => {
    if (!dateString) return ""; // Maneja casos donde dateString es undefined o null
  
    // Intenta convertir la fecha a un objeto Date
    const date = new Date(dateString);
  
    // Verifica si la fecha es válida
    if (isNaN(date.getTime())) {
      console.error("Fecha no válida:", dateString);
      return ""; // Retorna una cadena vacía si la fecha no es válida
    }
  
    // Formatea la fecha como YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };