function displayAlert() {
  Swal.fire({
    title: "คุณต้องการลบใช่หรือไม่?",
    showDenyButton: true,
    confirmButtonText: "ยืนยัน",
    denyButtonText: `ยกเลิก`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      // Proceed with form submission
      document.getElementById("updateForm").submit();
    } else if (result.isDenied) {
      Swal.fire("การลบไม่เปลี่ยนแปลง", "", "info");
    }
  });
  return false;
}
