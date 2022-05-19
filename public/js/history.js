var status_docs = document.getElementsByClassName("status");
var total_docs = document.getElementsByClassName("total");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

for (var i = 0; i < status_docs.length; i++) {
  const status = status_docs[i].value;
  console.log(status);
  if (status == "pending") {
    status_docs[i].className = "history-status alert-warning";
  } else if (status == "cancel") {
    status_docs[i].className = "history-status alert-danger";
  }
}

for (var i = 0; i < total_docs.length; i++) {
  total_docs[i].innerHTML = numberWithCommas(total_docs[i].innerHTML);
}
