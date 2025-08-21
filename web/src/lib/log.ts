// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const log = (message: any): void => {
  const curDate = new Date();
  const dateTime = `${curDate.getDate()}/${String(curDate.getMonth() + 1).padStart(2, '0')}/${curDate.getFullYear()} ${String(curDate.getHours()).padStart(2, '0')}:${String(curDate.getMinutes()).padStart(2, '0')}:${String(curDate.getSeconds()).padStart(2, '0')}`;
  console.log(`Logging: ${dateTime}`);
  console.log(message);
}