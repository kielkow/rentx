interface IDateProvider {
  dateNow(): Date;
  dateTomorrow(): Date;
  compareInHours(start_date: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
}

export { IDateProvider };