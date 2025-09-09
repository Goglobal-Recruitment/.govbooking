// booking.js - client side for index.html
const BACKEND_BASE = ""; // set to your backend URL (e.g. "https://your-backend.example.com") or leave empty to use same origin

const form = document.getElementById('bookingForm');

function showAlert(msg) { alert(msg); }

form.addEventListener('submit', async (e) => {
  e.preventDefault();

</header>
  
  // collect
  const idNumber = form.id_number.value.trim();
  const forenames = form.forenames.value.trim();
  const surname = form.surname.value.trim();
  const dialingCode = form.dialing_code.value;
  const cellphone = form.cellphone.value.trim();
  const confirmDialingCode = form.confirm_dialing_code.value;
  const confirmCellphone = form.confirm_cellphone.value.trim();
  const email = form.email.value.trim();
  const confirmEmail = form.confirm_email.value.trim();

  // basic required checks
  if (!idNumber || !forenames || !surname || !cellphone || !confirmCellphone) {
    showAlert("Please complete all required fields.");
    return;
  }

  if (dialingCode !== confirmDialingCode || cellphone !== confirmCellphone) {
    showAlert("Phone number and confirmation do not match.");
    return;
  }

  if (email && email !== confirmEmail) {
    showAlert("Email and confirmation do not match.");
    return;
  }

  // optional: simple ID numeric check
  if (!/^\d+$/.test(idNumber)) {
   howAlert("ID number must contain only letters and numbers.");
    return;
  }

  // data object to send to auth endpoint
  const payload = {
    id_number: idNumber,
    forenames,
    surname,
    phone: dialingCode + cellphone,
    email: email || null
  };

  try {
    // send to backend auth endpoint (if you have one)
    const url = (BACKEND_BASE || "") + "/auth";
    if (!BACKEND_BASE) {
      // same-origin fetch will try the server hosted with your pages; likely 404 on GitHub Pages.
      console.log("No BACKEND_BASE configured — skipping remote auth and continuing to next step for local testing.");
      // store temp data in sessionStorage and go to next step
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
      // keep payload for next-step to read
      sessionStorage.setItem('bookingPayload', JSON.stringify(payload));
      window.location.href = "next-step.html";
    } else {
      showAlert("Authentication failed. Please check your details.");
    }
  } catch (err) {
    console.error(err);
    showAlert("Server error or no backend available. For testing, the site will continue locally.");
    sessionStorage.setItem('bookingPayload', JSON.stringify(payload));
    window.location.href = "next-step.html";
  }
});
