const BACKEND_BASE = ""; // your backend URL or empty string if none
const form = document.getElementById('bookingForm');

function showAlert(msg) {
  alert(msg);
}
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Disable weekends for appointment date
const appointmentDateInput = document.getElementById('appointment_date');
appointmentDateInput.addEventListener('input', (e) => {
  const date = new Date(e.target.value);
  if (date.getDay() === 0 || date.getDay() === 6) {
    showAlert('Weekends are not allowed. Please select a weekday.');
    e.target.value = ''; // clear invalid date
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const idNumber = form.id_number.value.trim();
  const forenames = form.forenames.value.trim();
  const surname = form.surname.value.trim();

  const dialingCode = form.dialing_code.value;
  const cellphone = form.cellphone.value.trim();

  const email = form.email.value.trim();

  const appointmentDate = form.appointment_date.value;
  const appointmentTime = form.appointment_time.value;

  // Basic validation
  if (!idNumber || !forenames || !surname || !cellphone || !appointmentDate || !appointmentTime) {
    showAlert('Please complete all required fields.');
    return;
  }

  if (!/^[a-zA-Z0-9]+$/.test(idNumber)) {
    showAlert('ID number must contain only letters and numbers.');
    return;
  }

  if (email && !isValidEmail(email)) {
    showAlert('Please enter a valid email address.');
    return;
  }

  const date = new Date(appointmentDate);
  if (date.getDay() === 0 || date.getDay() === 6) {
    showAlert('Selected appointment date falls on a weekend. Please choose a weekday.');
    return;
  }

  // Prepare data payload
  const payload = {
    id_number: idNumber,
    forenames,
    surname,
    phone: dialingCode + cellphone,
    email: email || null,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime
  };

  try {
    if (!BACKEND_BASE) {
      // No backend: simulate success
      sessionStorage.setItem('bookingPayload', JSON.stringify(payload));
      window.location.href = 'next-step.html';
      return;
    }

    const url = `${BACKEND_BASE}/auth`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data && (data.authorized || data.success)) {
      sessionStorage.setItem('bookingPayload', JSON.stringify(payload));
      window.location.href = 'next-step.html';
    } else {
      showAlert('Authentication failed. Please check your details.');
    }
  } catch (err) {
    console.error(err);
    showAlert('Server error or no backend available. Continuing locally for testing.');
    sessionStorage.setItem('bookingPayload', JSON.stringify(payload));
    window.location.href = 'next-step.html';
  }
});
