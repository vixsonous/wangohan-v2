export const getTimeAgo = (timeDiff: number):string => {
  let time = timeDiff / 1000;
  let text = 'seconds';

  if(time >= (24 * 60 * 60 * 7 * 30 * 12)) {
    time = time / (24 * 60 * 60 * 7 * 30 * 12);
    text = time === 1 ? 'year' : 'years';
  }else if(time >= (24 * 60 * 60 * 7 * 30)) {
    time = time / (24 * 60 * 60 * 7 * 30);
    text = time === 1 ? 'month' : 'months';
  } else if(time >= (24 * 60 * 60 * 7)) {
    time = time / (24 * 60 * 60 * 7);
    text = time === 1 ? 'week' : 'weeks';
  }else if(time >= (24 * 60 * 60)) {
    time = time / (24 * 60 * 60);
    text = time === 1 ? 'day' : 'days';
  }else if(time >= (60 * 60)) {
    time = time / (60 * 60);
    text = time === 1 ? 'hour' : 'hours';
  } else if(time >= 60) {
    time = time / 60;
    text = time === 1 ? 'minute' : 'minutes';
  }

  return `${Math.floor(time)} ${text} ago`;
}