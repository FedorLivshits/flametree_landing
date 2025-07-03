document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('demoModal');
  const form = document.getElementById('demoForm');
  const btnSend = form.querySelector('.btn-send');

  /* ----------------- toast ----------------- */
  function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    // Скрыть через duration мс
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

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
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // подготовка
    btnSend.disabled = true;
    const origText = btnSend.textContent;
    btnSend.textContent = 'Sending…';

    // собираем полезную нагрузку
    const payload = {
      firstname: form.firstName.value.trim(),
      lastname: form.lastName.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      const response = await fetch(
        'https://portal.flametree.dev.enfint.ai/api/v1/public/book-a-demo',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        // можно парсить JSON-ошибку: await response.json()
        throw new Error(`Server error ${response.status}`);
      }

      // при успехе — закрываем и оповещаем пользователя
      closeModal();
      // здесь можно показывать нотификацию вместо alert
      showToast('Your demo request has been sent. Thank you!');
    } catch (err) {
      console.error(err);
      showToast('Oops! Something went wrong. Please try again later.');
    } finally {
      // восстанавливаем кнопку
      btnSend.disabled = false;
      btnSend.textContent = origText;
    }
  });
});
