let selectedFile = null;
let widthInput = document.getElementById("width");
let heightInput = document.getElementById("height");
let resizeBtn = document.getElementById("resizeBtn");

window.addEventListener("load", function (params) {
  disableFields(true);
});

function disableFields(disabled) {
  widthInput.disabled = disabled;
  heightInput.disabled = disabled;
  resizeBtn.disabled = disabled;
}

function resize() {
  readFile(selectedFile);
}

function changeFile(input) {
  let file = input.files[0];
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

  let size = (file.size / (1024 * 1024)).toFixed(2);
  return size;
}

function displayFileSize(size) {
  let elm = document.getElementById("sizeOutput");
  elm.innerText = size;
}

function readFile(file) {
  var reader = new FileReader();

  reader.onloadend = function () {
    processFile(reader.result, file.type);
  };

  reader.onerror = function () {
    alert("There was an error reading the file!");
  };

  reader.readAsDataURL(file);
}

function processFile(dataURL, fileType) {
  var maxWidth = widthInput.value;
  var maxHeight = heightInput.value;

  var image = new Image();
  image.src = dataURL;

  image.onload = function () {
    var width = image.width;
    var height = image.height;
    var shouldResize = width > maxWidth || height > maxHeight;

    if (!shouldResize) {
      console.log("Image not resize");
      displayOutput(dataURL);
      return;
    }

    var newWidth;
    var newHeight;

    if (width > height) {
      newHeight = height * (maxWidth / width);
      newWidth = maxWidth;
    } else {
      newWidth = width * (maxHeight / height);
      newHeight = maxHeight;
    }

    var canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;

    var context = canvas.getContext("2d");
    context.drawImage(this, 0, 0, newWidth, newHeight);

    dataURL = canvas.toDataURL(fileType);
    displayOutput(dataURL);
  };

  image.onerror = function () {
    alert("There was an error processing your file!");
  };
}

function displayOutput(url) {
  let output = document.getElementById("output");
  output.src = url;
}
