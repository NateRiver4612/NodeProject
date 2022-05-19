const header_profile = document.getElementById("header-profile");
const home_link = document.getElementById("home-link");
const services_link = document.getElementById("services-link");

console.log("Connected to main");

//Load current_user info
async function httpSetCurrentUser() {
  try {
    const response = await fetch(`http://localhost:8000/user/info`);
    const user = await response.json();
    header_profile.innerHTML = user["username"];
  } catch (error) {
    header_profile.innerHTML = "Account";
  }
}
//Load current_user info
function setCurrentPageLink() {
  const currentpage = location.pathname.split("/")[2];
  const current_service = location.pathname.split("/")[3];

  if (current_service && current_service == "recharge") {
    services_link.innerHTML = "Lịch sử nạp tiền";
  } else if (current_service && current_service == "mobile") {
    services_link.innerHTML = "Lịch sử mua thẻ ĐT";
  } else if (current_service && current_service == "withdraw") {
    services_link.innerHTML = "Lịch sử rút tiền";
  } else if (current_service && current_service == "transfer") {
    services_link.innerHTML = "Lịch sử chuyển tiền";
  }

  if (currentpage == "home") {
    home_link.style.color = "#086efc";
  } else {
    services_link.color = "blue";
  }
}

setCurrentPageLink();
httpSetCurrentUser();
