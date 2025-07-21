export const log = (message: any): void => {
  const curDate = new Date();
  const dateTime = `${curDate.getDate()}/${curDate.getMonth() + 1}/${curDate.getFullYear()} ${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`;
  console.log(`Logging: ${dateTime}`);
  console.log(message);
}