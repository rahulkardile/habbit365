export const getDateFromDayIndex = (dayIndex : number) => {
  const now = new Date();
  const currentDayIndex = now.getDay();
  const diff = dayIndex - currentDayIndex;
  const selectedDate = new Date(now);
  selectedDate.setDate(now.getDate() + diff);

  return selectedDate;
};

export const formatLocalDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const getFormattedDate = (year: number, month: number, day: number) => {
  const y = year;
  const m = String(month + 1).padStart(2, "0"); // month is 0-based
  const d = String(day).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

export const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
export const today = new Date().getDay();