async function displayError(message) {
  Swal.fire(`${message}`);
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

function handleSearch() {
  // Get search input value
  var searchValue = document.getElementById('searchInput').value.toLowerCase();

  // Get all rows in the table body
  var rows = document.querySelectorAll('tbody tr ');

  // Iterate through each row
  rows.forEach(function (row) {
    var cells = row.querySelectorAll('td ');
    var found = false;

    // Iterate through each cell in the row
    cells.forEach(function (cell, index) {
      // Check if the cell content contains the search value or matches the role
      if (
        cell.textContent.toLowerCase().includes(searchValue) ||
        (index === 1 && cell.textContent.toLowerCase().includes(searchValue))
      ) {
        found = true;
      }
    });

    // Show or hide the row based on the search result
    if (found) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Add event listener to search input field
document.getElementById('searchInput').addEventListener('input', handleSearch);

async function displayAlertAdd() {
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
      title: 'เพิ่มยานพาหนะสำเร็จ',
    });

    await document.querySelector('#modal-body form').submit();
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    swalWithBootstrapButtons.fire({
      title: 'ยกเลิก',
      text: 'คุณได้ทำการยกเลิก',
      icon: 'error',
    });
  }
}
