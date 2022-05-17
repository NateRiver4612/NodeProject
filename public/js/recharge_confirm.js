const confirm_total = document.getElementById("confirm-total");
const confirm_card_number = document.getElementById("confirm-card_number");
const confirm_expired = document.getElementById("confirm-expired");
const confirm_cvv = document.getElementById("confirm-cvv");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

//Set confirm page
async function setConfirmPage() {
  const url = window.location.search.split("?")[1];
  const urlArr = url.split("&");

  console.log(urlArr);
  const card_number = urlArr[0].split("=")[1];
  const expired = urlArr[1].split("=")[1];
  const cvv = urlArr[2].split("=")[1];
  const money = urlArr[3].split("=")[1];

  console.log(card_number, money);

  confirm_total.value = numberWithCommas(parseInt(money) * 1000);
  confirm_card_number.value = card_number;
  confirm_expired.value = expired;
  confirm_cvv.value = cvv;
}

setConfirmPage();
