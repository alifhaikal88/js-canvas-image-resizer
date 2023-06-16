const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const resizeBtn = document.getElementById("resizeBtn");

let selectedFile = null;

window.addEventListener("load", function () {
  disableFields(true);
});

function disableFields(disabled) {
  widthInput.disabled = disabled;
  heightInput.disabled = disabled;
  resizeBtn.disabled = disabled;
}

function resize() {
  if (!selectedFile) {
    alert("Please select a file first!");
    return;
  }
  readFile(selectedFile);
}

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

function calculateFileSize(file) {
  if (!file) {
    return 0;
  }

  const size = (file.size / (1024 * 1024)).toFixed(2);
  return size;
}

function displayFileSize(size) {
  const elm = document.getElementById("sizeOutput");
  elm.innerText = size;
}

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

function displayOutput(url) {
  const output = document.getElementById("output");
  output.src = url;
}
