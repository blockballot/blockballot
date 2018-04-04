export default function formatDate (string) {
    if (string === null) {
      return null;
    }
    let date = new Date(string);
    let day = date.getDate();   
    let month = date.getMonth() + 1; 
    let year = date.getFullYear();    
    let fullDate = month + '/' + day + '/' + year;
  
    let period = 'am';
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (hours === 0 || hours === 24) {
      hours = '12';
      period = 'am';
    } else if (hours === 12) {
      period = 'pm';
    } else if (hours > 12) {
      hours -= 12;
      period = 'pm';
    }
    let fullTime = hours + ':' + minutes + ' ' + period;
  
    return fullDate + ' at ' + fullTime;
  }

