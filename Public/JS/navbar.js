let isSidebarOpen = false;
function toggleNav() {
  const sidenav = document.getElementById("mySidenav");
  const main = document.getElementById("main");
  const toggleIcon = document.getElementById("toggleIcon");
  
  isSidebarOpen = !isSidebarOpen;
  if (isSidebarOpen) {
    sidenav.style.width = "250px";
    main.style.marginLeft = "250px";
    toggleIcon.classList.remove("fi-rr-indent");
    toggleIcon.classList.add("fi-rr-outdent");
  } else {
    sidenav.style.width = "0";
    main.style.marginLeft = "0";
    toggleIcon.classList.remove("fi-rr-outdent");
    toggleIcon.classList.add("fi-rr-indent");
  }
}
