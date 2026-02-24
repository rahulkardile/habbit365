export function getFutureDate(endDate: number) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + endDate);
    return newDate;
}