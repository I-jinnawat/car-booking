function displayAlert(booking) {
  Swal.fire({
    title: "คุณต้องการลบใช่หรือไม่?",
    showDenyButton: true,
    confirmButtonText: "ยืนยัน",
    denyButtonText: `ยกเลิก`,
  }).then((result) => {
    if (result.isConfirmed) {
      deleteBooking(booking);
    } else if (result.isDenied) {
      Swal.fire("การลบไม่เปลี่ยนแปลง", "", "info");
    }
  });
  return false;
}
