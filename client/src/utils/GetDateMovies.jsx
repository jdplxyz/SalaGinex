export const getNextWeekendDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const nextFriday = new Date(today);
    const nextSaturday = new Date(today);
    const nextSunday = new Date(today);

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

    return {
      nextFriday: nextFriday.toISOString().split("T")[0], // Formato YYYY-MM-DD
      nextSaturday: nextSaturday.toISOString().split("T")[0],
      nextSunday: nextSunday.toISOString().split("T")[0],
    };
  };