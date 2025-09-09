document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const bookingData = {
    id_number: document.getElementById("id_number").value,
    forenames: document.getElementById("forenames").value,
    surname: document.getElementById("surname").value,
    dialing_code: document.getElementById("dialing_code").value,
    cellphone: document.getElementById("cellphone").value,
    email: document.getElementById("email").value,
    appointment_date: document.getElementById("appointment_date").value,
    appointment_time: document.getElementById("appointment_time").value,
  };

  // Save data in localStorage
  localStorage.setItem("bookingData", JSON.stringify(bookingData));

  // Redirect to summary page
  window.location.href = "summary.html";
});
