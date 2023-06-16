// Get references to the DOM elements for the width, height, and resize button
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const resizeBtn = document.getElementById("resizeBtn");

// Initialize the selectedFile variable to null, and disable the input fields and resize button on page load
let selectedFile = null;
window.addEventListener("load", function () {
  disableFields(true);
});

// Disable or enable the input fields and resize button based on the supplied parameter
function disableFields(disabled) {
  widthInput.disabled = disabled;
  heightInput.disabled = disabled;
  resizeBtn.disabled = disabled;
}

// Event handler for the resize button. Reads and resizes the selected file if it exists.
function resize() {
  if (!selectedFile) {
    alert("Please select a file first!");
    return;
  }
  readFile(selectedFile);
}

// Event handler for the file input field. Stores the selected file and enables the input fields and resize button.
// If the selected file is an image file, reads the file and displays its file size.
function changeFile(input) {
  const file = input.files[0];
  selectedFile = file;

  disableFields(false);

  if (file) {
    if (/^image\//i.test(file.type)) {
      readFile(file);
      displayFileSize(calculateFileSize(file));
    } else {
      alert("Not a valid image!");
    }
  }
}

// Calculates the file size of the given file in MB and returns it as a string with two decimal places.
function calculateFileSize(file) {
  if (!file) {
    return 0;
  }

  const size = (file.size / (1024 * 1024)).toFixed(2);
  return size;
}

// Displays the given file size string in the DOM element with the "sizeOutput" id.
function displayFileSize(size) {
  const elm = document.getElementById("sizeOutput");
  elm.innerText = size;
}

// Reads the given file as a data URL and passes it to the processImageData function.
function readFile(file) {
  const reader = new FileReader();

  reader.onloadend = function () {
    processImageData(reader.result, file.type);
  };

  reader.onerror = function () {
    alert("There was an error reading the file!");
  };

  reader.readAsDataURL(file);
}

// Processes the given data URL as an image, resizes it if necessary, and displays the resulting image.
function processImageData(dataURL, fileType) {
  const maxWidth = widthInput.value;
  const maxHeight = heightInput.value;

  const image = new Image();
  image.src = dataURL;

  image.onload = function () {
    const width = image.width;
    const height = image.height;
    const shouldResize = width > maxWidth || height > maxHeight;

    if (!shouldResize) {
      console.log("Image not resize");
      displayOutput(dataURL);
      return;
    }

    let newWidth;
    let newHeight;

    if (width > height) {
      newHeight = height * (maxWidth / width);
      newWidth = maxWidth;
    } else {
      newWidth = width * (maxHeight / height);
      newHeight = maxHeight;
    }

    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;

    const context = canvas.getContext("2d");
    context.drawImage(this, 0, 0, newWidth, newHeight);

    dataURL = canvas.toDataURL(fileType);
    displayOutput(dataURL);
  };

  image.onerror = function () {
    alert("There was an error processing your file!");
  };
}

// Displays the given URL as an image in the DOM element with the "output" id.
function displayOutput(url) {
  const output = document.getElementById("output");
  output.src = url;
}
