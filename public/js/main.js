const Url = window.location.pathname;
const UrlArr = window.location.pathname.split("/");
const page = UrlArr[2];

const header_profile = document.getElementById("header-profile");
const admin_header_profile = document.getElementById("admin-header-profile");

const home_link = document.getElementById("home-link");
const services_link = document.getElementById("services-link");

const currentpage = location.pathname.split("/")[2];
const current_service = location.pathname.split("/")[3];

if (services_link) {
  if (current_service && current_service == "recharge" && UrlArr[1] == "user") {
    services_link.innerHTML = "Lịch sử nạp tiền";
  } else if (
    current_service &&
    current_service == "mobile" &&
    UrlArr[1] == "user"
  ) {
    services_link.innerHTML = "Lịch sử mua thẻ ĐT";
  } else if (
    current_service &&
    current_service == "withdraw" &&
    UrlArr[1] == "user"
  ) {
    services_link.innerHTML = "Lịch sử rút tiền";
  } else if (
    current_service &&
    current_service == "transfer" &&
    UrlArr[1] == "user"
  ) {
    services_link.innerHTML = "Lịch sử chuyển tiền";
  }

  if (currentpage == "home") {
    home_link.style.color = "#086efc";
  } else {
    services_link.color = "blue";
  }
}

//Load current_user info
async function httpSetCurrentUser() {
  const response = await fetch(`http://localhost:8000/user/info`);
  const user = await response.json();
  if (admin_header_profile) {
    admin_header_profile.innerHTML = `Log out`;
  }

  if (user) {
    header_profile ? (header_profile.innerHTML = user["username"]) : "";
  } else {
    header_profile ? (header_profile.innerHTML = "Account") : "";
  }
}
//Load current_user info

httpSetCurrentUser();

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

//JSS FOR DETAIL PAGES
if (UrlArr[4]) {
  var total_doc = document.getElementById("total");
  var price_doc = document.getElementById("price");
  var fee_doc = document.getElementById("fee");

  if (total_doc) {
    total_doc.innerHTML = numberWithCommas(total_doc.innerHTML);
  }

  if (price_doc) {
    price_doc.innerHTML = numberWithCommas(price_doc.innerHTML);
  }

  if (fee_doc) {
    fee_doc.innerHTML = numberWithCommas(fee_doc.innerHTML);
  }
}

const admin_services_link = document.getElementById("admin-services-link");
const admin_accounts_link = document.getElementById("admin-accounts-link");

//JSS FOR ADMIN LAYOUT
if (UrlArr[1] == "admin" && UrlArr[2] == "accounts") {
  if (UrlArr[3] == "pending") {
    admin_accounts_link.innerHTML = "Tài khoản chờ kích hoạt";
  }
  if (UrlArr[3] == "activated") {
    admin_accounts_link.innerHTML = "Tài khoản đã kích hoạt";
  }
  if (UrlArr[3] == "canceled") {
    admin_accounts_link.innerHTML = "Tài khoản bị từ chối kích hoạt";
  }
  if (UrlArr[3] == "locked") {
    admin_accounts_link.innerHTML = "Tài khoản bị khóa";
  }
}

if (UrlArr[1] == "admin" && UrlArr[2] == "services") {
  if (UrlArr[3] == "transfer") {
    admin_services_link.innerHTML = "Giao dịch chuyển tiền ";
  }
  if (UrlArr[3] == "withdraw") {
    console.log("fuck");
    admin_services_link.innerHTML = "Giao dịch rút tiền";
  }
}

//JSS FOR PROFILE
if (page == "profile" || (UrlArr[1] == "admin" && UrlArr[4])) {
  const account_balance = document.getElementById("account_balance");
  const user_profile_status = document.getElementById("user_profile_status");

  const status = user_profile_status ? user_profile_status.ariaPlaceholder : "";

  if (status == "activated") {
    user_profile_status.className = "profile-status alert-success";
  } else if (status == "canceled") {
    user_profile_status.className = "profile-status alert-danger";
  } else if (status.includes("locked")) {
    user_profile_status.className = "profile-status alert-dark";
  }
  if (account_balance) {
    account_balance.placeholder = `${numberWithCommas(
      account_balance.placeholder
    )} VND`;
  }
}
if (page == "history" || (UrlArr[1] == "admin" && UrlArr[3])) {
  //JSS FOR HISTORY
  var status_docs = document.getElementsByClassName("history-status");
  var total_docs = document.getElementsByClassName("total");

  for (var i = 0; i < status_docs.length; i++) {
    const status = status_docs[i].value;

    if (status == "pending") {
      status_docs[i].className = "history-status status alert-warning";
    } else if (status == "canceled") {
      status_docs[i].className = "history-status status alert-danger";
    } else if (status == "activated") {
      status_docs[i].className = "history-status status alert-success";
    }
  }

  for (var i = 0; i < total_docs.length; i++) {
    total_docs[i].innerHTML = numberWithCommas(total_docs[i].innerHTML);
  }
}

//JSS FOR CONFIRM TRANSACTIONS PAGES
if (UrlArr[3]) {
  //RECHARGE TRANSACTION
  if (page == "service" && UrlArr[3] == "recharge") {
    const confirm_total = document.getElementById("confirm-total");
    const confirm_card_number = document.getElementById("confirm-card_number");
    const confirm_expired = document.getElementById("confirm-expired");
    const confirm_cvv = document.getElementById("confirm-cvv");

    //Set confirm page

    const search = window.location.search.split("?")[1];
    const searchArr = search.split("&");

    const card_number = searchArr[0].split("=")[1];
    const expired = searchArr[1].split("=")[1];
    const cvv = searchArr[2].split("=")[1];
    const money = searchArr[3].split("=")[1];

    confirm_total.value = numberWithCommas(parseInt(money) * 1000);
    confirm_card_number.value = card_number;
    confirm_expired.value = expired;
    confirm_cvv.value = cvv;
  }
  //WITHDRAW TRANSACTION
  if (page == "service" && UrlArr[3] == "withdraw") {
    const confirm_total = document.getElementById("confirm-total");
    const confirm_card_number = document.getElementById("confirm-card_number");
    const confirm_expired = document.getElementById("confirm-expired");
    const confirm_cvv = document.getElementById("confirm-cvv");
    const confirm_note = document.getElementById("confirm-note");

    //Set confirm page

    const search = window.location.search.split("?")[1];
    const searchArr = search.split("&");

    const card_number = searchArr[0].split("=")[1];
    const expired = searchArr[1].split("=")[1];
    const cvv = searchArr[2].split("=")[1];
    const money = searchArr[3].split("=")[1];
    const note = searchArr[4].split("=")[1].replaceAll("+", " ");

    confirm_total.value = numberWithCommas(parseInt(money) * 1000);
    confirm_card_number.value = card_number;
    confirm_expired.value = expired;
    confirm_cvv.value = cvv;
    confirm_note.value = note;
  }
  //TRANSFER TRANSACTION
  if (page == "service" && UrlArr[3] == "transfer") {
    const confirm_total = document.getElementById("confirm-total");
    const confirm_note = document.getElementById("confirm-note");
    const phone_number_doc = document.getElementById("receiver_phone");
    const pay_side_doc = document.getElementById("pay_side");

    //Set confirm page

    const search = window.location.search.split("?")[1];
    const searchArr = search.split("&");

    const phone_number = searchArr[0].split("=")[1];
    const money = searchArr[1].split("=")[1];
    const note = searchArr[2].split("=")[1].replaceAll("+", " ");
    const pay_side = searchArr[3].split("=")[1];

    console.log(pay_side);

    confirm_total.value = numberWithCommas(parseInt(money) * 1000);
    confirm_note.value = note;
    phone_number_doc.value = phone_number;
    pay_side_doc.value = pay_side == "sender" ? "Người chuyển" : "Người nhận";
  }
}
