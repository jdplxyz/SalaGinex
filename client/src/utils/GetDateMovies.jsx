export const getNextWeekendDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const nextFriday = new Date(today);
  const nextSaturday = new Date(today);
  const nextSunday = new Date(today);

  // Ajustar las fechas para el próximo viernes, sábado y domingo
  if (dayOfWeek === 5) {
      nextFriday.setDate(today.getDate());
  } else {
      nextFriday.setDate(today.getDate() + ((5 - dayOfWeek + 7) % 7));
  }

  if (dayOfWeek === 6) {
      nextSaturday.setDate(today.getDate());
  } else {
      nextSaturday.setDate(today.getDate() + ((6 - dayOfWeek + 7) % 7));
  }

  if (dayOfWeek === 0) {
      nextSunday.setDate(today.getDate());
  } else {
      nextSunday.setDate(today.getDate() + ((7 - dayOfWeek + 7) % 7));
  }

  // Formatear las fechas en formato YYYY-MM-DD sin cambiar la zona horaria
  const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
  };

  return {
      nextFriday: formatDate(nextFriday),
      nextSaturday: formatDate(nextSaturday),
      nextSunday: formatDate(nextSunday),
  };
};