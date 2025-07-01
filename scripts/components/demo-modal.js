document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('demoModal');
  const form = document.getElementById('demoForm');
  const btnSend = form.querySelector('.btn-send');

  /* ----------------- modal open / close ----------------- */
  const openModal = () => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    form.reset();
    btnSend.disabled = true;
    clearErrors();
    setTimeout(() => form.firstName.focus(), 50);
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-demo-open]').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    })
  );

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-modal-close]')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  /* ----------------- validation ----------------- */
  const emailRe = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;

  const showError = (field, msg) => {
    field.classList.add('invalid');
    const errorEl = field.parentElement.querySelector('.error-msg');
    if (errorEl) errorEl.textContent = msg;
  };

  const clearError = (field) => {
    field.classList.remove('invalid');
    const errorEl = field.parentElement.querySelector('.error-msg');
    if (errorEl) errorEl.textContent = '';
  };

  const clearErrors = () => {
    form.querySelectorAll('input, textarea').forEach(clearError);
    form.querySelectorAll('.error-msg').forEach((el) => (el.textContent = ''));
  };

  const validate = () => {
    let valid = true;

    const name = form.firstName;
    // const lastName = form.lastName;
    const email = form.email;
    const message = form.message;

    if (!name.value.trim()) {
      showError(name, 'First name required');
      valid = false;
    } else {
      clearError(name);
    }

    if (!emailRe.test(email.value.trim())) {
      showError(email, 'Invalid email');
      valid = false;
    } else {
      clearError(email);
    }

    if (message.value.length > 500) {
      showError(message, 'Message too long');
      valid = false;
    } else {
      clearError(message);
    }

    btnSend.disabled = !valid;
    return valid;
  };

  form.addEventListener('input', validate);

  /* ----------------- form submit ----------------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    // alert('Demo request sent!');

    closeModal();
  });
});
