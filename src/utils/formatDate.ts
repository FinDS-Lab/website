type props = {
  source: Date,
  showTime?: boolean
  locale?: string
}

export const formatDateWithLocale = ({source, showTime, locale}: props) => {
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(source);

  const formattedTime = source.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  return showTime ? `${formattedDate} ${formattedTime}` : formattedDate;
}

export const formatDateRange = (startDate: string, endDate: string) => {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const start = new Date(startDate);
  const end = new Date(endDate);

  const startMonth = start.getMonth() + 1;
  const startDay = start.getDate();
  const startDayOfWeek = daysOfWeek[start.getDay()];
  const startHour = start.getHours().toString().padStart(2, '0');
  const startMinute = start.getMinutes().toString().padStart(2, '0');

  const endDay = end.getDate();
  const endHour = end.getHours().toString().padStart(2, '0');
  const endMinute = end.getMinutes().toString().padStart(2, '0');

  const totalDays = endDay - startDay + 1;

  return `${startMonth}월 ${startDay}일(${totalDays > 1 ? `${totalDays}일` : startDayOfWeek}) ${startHour}:${startMinute} - ${endHour}:${endMinute}`;
}

export const formatDate = ({source, showTime}: props) => {
  const dateDelimiter = '-';
  const timeDelimiter = ':';

  const year = source.getFullYear();
  const month = (source.getMonth() + 1).toString().padStart(2, '0');
  const day = source.getDate().toString().padStart(2, '0');
  const date = [year, month, day].join(dateDelimiter);

  const hour = source.getHours().toString().padStart(2, '0');
  const minute = source.getMinutes().toString().padStart(2, '0');
  // const second = source.getSeconds().toString().padStart(2, '0');
  const time = [hour, minute].join(timeDelimiter);

  return showTime ? [date, time].join(' ') : date;
}
