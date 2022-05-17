const account_balance = document.getElementById("account_balance");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

//Set current_user_account_balance
async function setProfilePageLink() {
  const response = await fetch(`http://localhost:8000/user/info`);
  const user = await response.json();

  account_balance.placeholder = `${numberWithCommas(user.account_balance)} VND`;
}

setProfilePageLink();
