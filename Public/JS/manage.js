// Get the select element
const selectElement = document.querySelector('.form-select');

// Add event listener to handle select change
selectElement.addEventListener('change', function () {
  // Get the selected value
  const selectedValue = this.value;

  // Get all table rows
  const rows = document.querySelectorAll('tbody tr');

  // Loop through each row and update visibility based on selected option
  rows.forEach(row => {
    const statusCell = row.querySelector('td:nth-child(2)');
    const statusText = statusCell.textContent.trim();

    // Show row if "All" is selected or if the row status matches the selected option
    if (selectedValue === '4') {
      if (statusText === 'ถูกยกเลิก') {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    } else if (selectedValue === '3') {
      if (statusText === '4.เสร็จสิ้น') {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    } else if (selectedValue === '1') {
      if (statusText === '1.ทำการจองเสร็จ รอหัวหน้าอนุมัติ') {
        row.style.display = '';
      } else if (statusText === '2.หัวหน้างานอนุมัติเสร็จ รอคนจัดรถ') {
        row.style.display = '';
      } else if (statusText === '3.จัดรถสำเร็จ,พร้อมใช้งาน') {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    } else if (selectedValue === '2') {
      if (statusText === '1.ทำการจองเสร็จ รอหัวหน้าอนุมัติ') {
        row.style.display = '';
      } else if (statusText === '2.หัวหน้างานอนุมัติเสร็จ รอคนจัดรถ') {
        row.style.display = '';
      } else if (statusText === '3.จัดรถสำเร็จ,พร้อมใช้งาน') {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    } else {
      row.style.display = '';
    }
  });
});

// Add event listener to search input field
document.getElementById('searchInput').addEventListener('input', handleSearch);

//   <!-- Display Unapprove -->

async function displayAlertUnapprove() {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false,
  });
  const result = await swalWithBootstrapButtons.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'คุณต้องการยืนยันที่จะไม่อนุมัติ!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    // await Toast.fire({
    //     icon: 'success',
    //     title: 'Success',
    // })
    document.getElementById('status').value = 5;
    document.getElementById('cancelerName').value = '<%= user.username%>';
    await document.querySelector('#modal-body form').submit();
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    swalWithBootstrapButtons.fire({
      title: 'ยกเลิก',
      text: 'คุณได้ทำการยกเลิก',
      icon: 'error',
    });
  }
}

// <!-- Display Approve -->

async function displayAlertApprove() {
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
    text: 'คุณต้องการยืนยันที่จะอนุมัติ!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    await Toast.fire({
      icon: 'success',
      title: 'Success',
    });
    document.getElementById('status').value = 2;
    document.getElementById('approverName').value = '<%= user.username %>';
    await document.querySelector('#modal-body form').submit();
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    swalWithBootstrapButtons.fire({
      title: 'ยกเลิก',
      text: 'คุณได้ทำการยกเลิก',
      icon: 'error',
    });
  }
}
