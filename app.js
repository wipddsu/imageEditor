// 편집기 관련 변수
const slider = document.getElementById("slider");
const filterBtn = document.querySelectorAll(".btnContainer .btn");
const sliderLabel = document.querySelector(".rangeContainer label");
const ragnePirnt = document.getElementById("rangePrint");
const resetBtn = document.getElementById("reset");
const savedValue = {
  grayscale: 0,
  brightness: 100,
  invert: 0,
  saturate: 100,
  sepia: 0,
  contrast: 100,
};

const SUFFIX = "%";

// 이미지 로드 관련 변수
const editorCanvas = document.getElementById("editorCanvas");
const ctx = editorCanvas.getContext("2d");
const imageInput = document.getElementById("file");
const saveImg = document.getElementById("saveImg");

let originalImage = null;

// 편집기 패널 조작
function updateInput() {
  const inputName = this.id;

  slider.setAttribute("name", inputName);
  sliderLabel.innerHTML = inputName;

  if (inputName === "contrast") {
    slider.setAttribute("max", 200);
  } else {
    slider.setAttribute("max", 100);
  }

  const value = savedValue[inputName] || 0;
  slider.value = value;
  ragnePirnt.innerHTML = `${value}%`;

  if (!this.classList.contains("active")) {
    filterBtn.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
  }
}

// 필터 업데이트
function filterUpdate() {
  const currentName = this.name;

  editorCanvas.style.setProperty(`--${currentName}`, this.value + SUFFIX);
  savedValue[currentName] = this.value;
  ragnePirnt.innerHTML = `${this.value}%`;
}

// 필터 초기화
function resetFilter() {
  const savedValueKeys = Object.keys(savedValue);
  savedValueKeys.forEach((key) => {
    savedValue[key] =
      key.includes("brightness") ||
      key.includes("contrast") ||
      key.includes("saturate")
        ? 100
        : 0;
    editorCanvas.style.setProperty(`--${key}`, savedValue[key] + SUFFIX);

    if (slider.name === key) {
      slider.value = savedValue[key];
      ragnePirnt.innerHTML = `${savedValue[key]}%`;
    }
  });
}

slider.addEventListener("input", filterUpdate);
filterBtn.forEach((option) => option.addEventListener("click", updateInput));
resetBtn.addEventListener("click", resetFilter);

// 저장된 이미지 데이터로 canvas에 그리기
function drawImage() {
  ctx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
  ctx.drawImage(originalImage, 0, 0, editorCanvas.width, editorCanvas.height);
}

// 이미지 로드
function loadImage(file, callback) {
  const reader = new FileReader();

  reader.addEventListener("load", function (e) {
    const img = new Image();
    img.src = e.target.result;

    img.addEventListener("load", function () {
      callback(img);
    });
  });

  reader.readAsDataURL(file);
}

// 이미지 업로드
function handleImageUpload(e) {
  const file = imageInput.files[0];
  const noImgTxt = document.querySelector(".noImage");

  if (file) {
    loadImage(file, function (img) {
      originalImage = img;
      drawImage();
    });
  }

  noImgTxt.classList.add("hidden");
  slider.removeAttribute("disabled");
  saveImg.removeAttribute("disabled");
}

imageInput.addEventListener("change", handleImageUpload);

// 이미지 다운로드
saveImg.addEventListener("click", function () {
  domtoimage.toBlob(document.getElementById("image__")).then(function (blob) {
    window.saveAs(blob, "image__.png");
  });
});
