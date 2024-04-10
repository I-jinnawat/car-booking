// Get all stepper items
const stepperItems = document.querySelectorAll(".stepper-item");

// Update progress function
function updateProgress(currentStep) {
  // Remove 'active' class from all steps
  stepperItems.forEach((item) => {
    item.classList.remove("active");
  });

  // Add 'active' class to the current step and all previous steps
  for (let i = 0; i <= currentStep; i++) {
    stepperItems[i].classList.add("active");
  }
}

// Example usage:
// Update progress to step 2
updateProgress(2);
