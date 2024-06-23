function displayAlert() {
  Swal.fire({
    title: 'คุณต้องการบันทึกใช่หรือไม่?dddddddddddddddd',
    showDenyButton: true,
    confirmButtonText: 'บันทึก',
    denyButtonText: `ไม่บันทึก`,
  }).then(result => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      // Proceed with form submission
      document.getElementById('updateForm').submit();
    } else if (result.isDenied) {
      Swal.fire('ไม่มีการเปลี่ยนแปลง ', '', 'info');
    }
  });
  return false;
}
