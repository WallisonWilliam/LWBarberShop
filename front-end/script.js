var monName = new Array(
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "Maio",
  "junho",
  "agosto",
  "outubro",
  "novembro",
  "dezembro"
);

var date2 = new Date();
date2.setDate(date2.getDate() - 1);

var publicip = "http://143.198.125.108:8000/schedules/";

var actualDate = new Date();
var previousDate = new Date(actualDate);
previousDate.setDate(actualDate.getDate() - 1);
var nextDate = new Date(actualDate);
nextDate.setDate(actualDate.getDate() + 1);

var actualDaySchedules;
var modal = document.getElementById("myModal");

app();

function updateDates() {
  document.getElementById("previousDay").innerHTML = previousDate.getDate();
  document.getElementById("previousDayMonth").innerHTML = monName[previousDate.getMonth()];
  document.getElementById("actualDay").innerHTML = actualDate.getDate();
  document.getElementById("actualDayMonth").innerHTML = monName[actualDate.getMonth()];
  document.getElementById("nextDay").innerHTML = nextDate.getDate();
  document.getElementById("nextDayMonth").innerHTML = monName[nextDate.getMonth()];

  if (previousDate.getTime() === date2.getTime()) document.getElementById("arrowUp").style.display = "none";
  else document.getElementById("arrowUp").style.display = "inline-block";
  
  getScheduleByDate();
  refreshTodaySchedulesList();
}

function refreshTodaySchedulesList() {
  for (let i = 0; i < actualDaySchedules.length; i++) {
    const e = actualDaySchedules[i];
    if (e == null) {
      document.getElementById(i).innerHTML = "Vazio";
    } else {
      document.getElementById(i).innerHTML = e.customer;
    }
  }
}

function goPreviousDate() {
  actualDate = previousDate;
  previousDate = new Date(actualDate);
  previousDate.setDate(actualDate.getDate() - 1);
  nextDate = new Date(actualDate);
  nextDate.setDate(actualDate.getDate() + 1);
  updateDates();
}

function goNextDate() {
  actualDate = nextDate;
  previousDate = new Date(actualDate);
  previousDate.setDate(actualDate.getDate() - 1);
  nextDate = new Date(actualDate);
  nextDate.setDate(actualDate.getDate() + 1);
  updateDates();
}

function getListToday(list) {
  actualDaySchedules = [null, null, null, null, null, null, null, null];
  list.forEach((e) => {
    switch (e.hour) {
      case "08:00":
        actualDaySchedules[0] = e;
        break;
      case "09:00":
        actualDaySchedules[1] = e;
        break;
      case "10:00":
        actualDaySchedules[2] = e;
        break;
      case "11:00":
        actualDaySchedules[3] = e;
        break;
      case "14:00":
        actualDaySchedules[4] = e;
        break;
      case "15:00":
        actualDaySchedules[5] = e;
        break;
      case "16:00":
        actualDaySchedules[6] = e;
        break;
      case "17:00":
        actualDaySchedules[7] = e;
        break;
      default:
        break;
    }
  });
}

function getHour(value) {
  switch (value) {
    case 0:
      return "08:00";
    case 1:
      return "09:00";
    case 2:
      return "10:00";
    case 3:
      return "11:00";
    case 4:
      return "14:00";
    case 5:
      return "15:00";
    case 6:
      return "16:00";
    case 7:
      return "17:00";
    default:
      break;
  }
}

var hour;

function openModal(i) {
  modal.style.display = "block";
  hour = getHour(i);
}

function closeModal() {
  modal.style.display = "none";
}

function isValidName(name) {
  if (name.trim().length <= 0) return false;
  return true;
}

function submitName() {
  var name = document.getElementById("nameInput").value;
  if (!isValidName(name)) {
    alert("Nome inválido");
  } else {
    addSchedule(name);
  }
  closeModal();
}

//API FUNCTIONS
function getScheduleByDate() {
  let day = actualDate.getDate().toString();
  if (day.length == 1) {
    day = "0" + day;
  }
  let month = (actualDate.getMonth() + 1).toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  let year = actualDate.getFullYear().toString();

  let url = publicip + day + month + year;

  axios
    .get(url)
    .then((response) => {
      getListToday(response.data);
      refreshTodaySchedulesList();
    })
    .catch((error) => {
      actualDaySchedules = [null, null, null, null, null, null, null, null];
      refreshTodaySchedulesList();
    });
}

function addSchedule(name) {
  let day = actualDate.getDate().toString();
  if (day.length == 1) {
    day = "0" + day;
  }
  let month = (actualDate.getMonth() + 1).toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  let year = actualDate.getFullYear().toString();

  var schedule = {
    customer: name,
    date: day + month + year + "",
    hour: hour,
  };

  axios
    .post(publicip, schedule)
    .then((response) => {
      alert("Cliente " + name + " foi adicionado com sucesso!");
      getScheduleByDate();
    })
    .catch((error) => {
      console.error(error);
      alert("Ocorreu um erro ao adicionar o cliente");
    });
}

function deleteSchedule(position) {
  axios
    .delete(publicip + actualDaySchedules[position].id)
    .then((x) => {
      alert("O cliente foi removido com sucesso!");
      getScheduleByDate();
    })
    .catch((error) => {
      console.error(error);
    });
}

function app() {
  updateDates();
  getScheduleByDate();
  actualDaySchedules = [null, null, null, null, null, null, null, null];
  refreshTodaySchedulesList();
}
