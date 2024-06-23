// Prevent Default Form Submission
document
  .querySelector('#modal-body form')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    if (event.submitter && event.submitter.id === 'updatedBtn') {
      displayAlertUpdated(this);
    }
  });
document.querySelectorAll('#modal-body form').forEach(form => {
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (event.submitter && event.submitter.id === 'updatedBtn') {
      await displayAlertUpdated(this);
    }
  });
});

document
  .getElementById('form')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form values
    var password = document.getElementById('password').value;
    var mobileNumber = document.getElementById('mobilenumber').value;
    var numberID = document.getElementById('numberID').value;

    // Initialize error messages
    var passwordError = '';
    var mobileError = '';
    var numberError = '';

    // Validate password
    if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,7}$/.test(password)) {
      passwordError = 'ต้องมีตัวอักษรขนาดใหญ่และตัวเลข 6-8 ตัว';
    }

    // Validate mobile number
    if (!/^\d{10}$/.test(mobileNumber)) {
      mobileError = 'โปรดใส่เบอร์โทรให้ครบ 10 ตัว';
    }

    if (!/^\d{8}$/.test(numberID)) {
      numberError = 'โปรดใส่รหัสให้ครบ 8 ตัว';
    }

    // Display error messages
    document.getElementById('passwordError').textContent = passwordError;
    document.getElementById('mobileError').textContent = mobileError;
    document.getElementById('numberError').textContent = numberError;

    // If no errors, proceed with SweetAlert confirmation
    if (passwordError === '' && mobileError === '' && numberError === '') {
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณต้องการยืนยันที่จะส่ง!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await Swal.fire({
          icon: 'success',
          title: 'เพิ่มสมาชิกสำเร็จ',
          showConfirmButton: false,
          timer: 1000,
        });

        // Submit the form
        this.submit();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'ยกเลิก',
          text: 'คุณได้ทำการยกเลิก',
          icon: 'error',
        });
      }
    }
  });

async function displayAlertUpdated(form) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
  });
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false,
  });
  const result = await swalWithBootstrapButtons.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการยืนยันที่จะส่ง!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    await Toast.fire({
      icon: 'success',
      title: 'แก้ไขข้อมูลสำเร็จ',
    });

    await form.submit();
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    swalWithBootstrapButtons.fire({
      title: 'ยกเลิก',
      text: 'คุณได้ทำการยกเลิก',
      icon: 'error',
    });
  }
}
function displayAlert(userID) {
  Swal.fire({
    title: 'คุณต้องการลบใช่หรือไม่?',
    showDenyButton: true,
    confirmButtonText: 'ยืนยัน',
    denyButtonText: `ยกเลิก`,
  }).then(result => {
    if (result.isConfirmed) {
      deletedMember(userID);
    } else if (result.isDenied) {
      Swal.fire('การลบไม่เปลี่ยนแปลง', '', 'info');
    }
  });
  return false;
}

function deletedMember(userID) {
  fetch(`/setting/member/delete/${userID}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }
      window.location.reload();
    })
    .catch(error => {
      console.error('Error deleting vehicle:', error);
    });
}

async function displayError() {
  Swal.fire('รหัสพนักงานมีอยู่แล้ว!');
}

// Handle Password Visibility
document.querySelectorAll("[id^='enablePassword_']").forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    togglePasswordVisibility(this);
  });
});

document
  .getElementById('enablePassword')
  .addEventListener('change', function () {
    togglePasswordVisibility(this);
  });

function togglePasswordVisibility(checkbox) {
  var userId = checkbox.id.split('_')[1];
  var passwordInput = document.getElementById(
    'passwordInput' + (userId ? '_' + userId : '')
  );
  passwordInput.disabled = !checkbox.checked;
  var toggleIcon = document.getElementById(
    'passwordVisibilityToggle' + (userId ? '_' + userId : '')
  );
  passwordInput.type = checkbox.checked ? 'text' : 'password';
}

function displayAlert(userID) {
  Swal.fire({
    title: 'คุณต้องการลบใช่หรือไม่?',
    showDenyButton: true,
    confirmButtonText: 'ยืนยัน',
    denyButtonText: `ยกเลิก`,
  }).then(result => {
    if (result.isConfirmed) {
      deletedMember(userID);
    } else if (result.isDenied) {
      Swal.fire('การลบไม่เปลี่ยนแปลง', '', 'info');
    }
  });
  return false;
}
function deletedMember(userID) {
  fetch(`/setting/member/delete/${userID}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }
      window.location.reload();
    })
    .catch(error => {
      console.error('Error deleting vehicle:', error);
    });
}

document.querySelectorAll("[id^='enablePassword_']").forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    var userId = this.id.split('_')[1];
    var passwordInput = document.getElementById('passwordInput_' + userId);
    passwordInput.disabled = !this.checked;
    document
      .getElementById('passwordVisibilityToggle_' + userId)
      .classList.toggle('bi-eye-slash');
    document
      .getElementById('passwordVisibilityToggle_' + userId)
      .classList.toggle('bi-eye');
    if (!this.checked) {
      passwordInput.type = 'password';
    } else {
      passwordInput.type = 'text';
    }
  });
});

document
  .getElementById('enablePassword')
  .addEventListener('change', function () {
    var passwordInput = document.getElementById('passwordInput');
    passwordInput.disabled = !this.checked;
    document
      .getElementById('passwordVisibilityToggle')
      .classList.toggle('bi-eye-slash');
    document
      .getElementById('passwordVisibilityToggle')
      .classList.toggle('bi-eye');
    if (!this.checked) {
      passwordInput.type = 'password';
    } else {
      passwordInput.type = 'text';
    }
  });
