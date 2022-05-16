const header_profile = document.getElementById("header-profile");
const home_link = document.getElementById("home-link");
const services_link = document.getElementById("services-link");
const account_balance = document.getElementById("account_balance");

console.log("Connected to main");

//Load current_user info
async function httpSetCurrentUser() {
  try {
    const response = await fetch(`http://localhost:8000/user/info`);
    const user = await response.json();
    header_profile.innerHTML = user["username"];
  } catch (error) {
    header_profile.innerHTML = "Username";
  }
}

//Load current_user info
function setCurrentPageLink() {
  const currentpage = location.pathname.split("/")[2];
  if (currentpage == "home") {
    home_link.style.color = "#086efc";
  } else {
    services_link.color = "#086efc";
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

//Set current_user_account_balance
async function setCurrentPageLink() {
  const response = await fetch(`http://localhost:8000/user/info`);
  const user = await response.json();

  account_balance.placeholder = `${numberWithCommas(user.account_balance)} đ`;
}

setCurrentPageLink();
httpSetCurrentUser();
setCurrentPageLink();
