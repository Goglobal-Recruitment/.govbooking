const BACKEND_BASE = ""; // or your backend URL if you have one
const form = document.getElementById('bookingForm');

function showAlert(msg) {
  alert(msg);
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const idNumber = form.id_number.value.trim();
  const forenames = form.forenames.value.trim();
  const surname = form.surname.value.trim();

  const dialingCode = form.dialing_code.value;
  const cellphone = form.cellphone.value.trim();

  const confirmDialingCode = form.confirm_dialing_code.value;
  const confirmCellphone = form.confirm_cellphone.value.trim();

  const email = form.email.value.trim();
  const confirmEmail = form.confirm_email.value.trim();

  // Validate required fields
  if (!idNumber || !forenames || !surname || !cellphone || !confirmCellphone) {
    showAlert("Please complete all required fields.");
    return;
  }

  // Phone numbers must match
  if (dialingCode !== confirmDialingCode || cellphone !== confirmCellphone) {
    showAlert("Phone number and confirmation do not match.");
    return;
  }

  // Email validation if provided
  if (email) {
    if (!isValidEmail(email)) {
      showAlert("Please enter a valid email address.");
      return;
    }
    if (email !== confirmEmail) {
      showAlert("Email and confirmation do not match.");
      return;
    }
  }

  // Validate ID number allows letters and digits
  if (!/^[a-zA-Z0-9]+$/.test(idNumber)) {
    showAlert("ID number must contain only letters and numbers.");
    return;
  }

  // Prepare payload
  const payload = {
    id_number: idNumber,
    forenames,
    surname,
    phone: dialingCode + cellphone,
    email: email || null
  };

  try {
    const url = (BACKEND_BASE || "") + "/auth";

    if (!BACKEND_BASE) {
      // No backend, simulate success and go next step
      sessionStorage.setItem('bookingPayload', JSON.stringify(payload));
      window.location.href = "next-step.html";
      return;
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data && (data.authorized || data.success)) {
      sessionStorage.setItem('bookingPayload', JSON.stringify(payload));
      window.location.href = "next-step.html";
    } else {
      showAlert("Authentication failed. Please check your details.");
    }
  } catch (err) {
    console.error(err);
    showAlert("Server error or no backend available. Continuing locally for testing.");
    sessionStorage.setItem('bookingPayload', JSON.stringify(payload));
    window.location.href = "next-step.html";
  }
});
