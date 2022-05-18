const confirm_total = document.getElementById("confirm-total");
const confirm_note = document.getElementById("confirm-note");
const phone_number_doc = document.getElementById("receiver_phone");
const pay_side_doc = document.getElementById("pay_side");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

//Set confirm page
async function setConfirmPage() {
  const url = window.location.search.split("?")[1];
  const urlArr = url.split("&");

  console.log(urlArr);
  const phone_number = urlArr[0].split("=")[1];
  const money = urlArr[1].split("=")[1];
  const note = urlArr[2].split("=")[1].replaceAll("+", " ");
  const pay_side = urlArr[3].split("=")[1];

  //   console.log(note);

  confirm_total.value = numberWithCommas(parseInt(money) * 1000);
  confirm_note.value = note;
  phone_number_doc.value = phone_number;
  pay_side_doc.value = pay_side == "sender" ? "Người chuyển" : "Người nhận";
}

setConfirmPage();
