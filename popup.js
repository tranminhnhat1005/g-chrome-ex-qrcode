document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generate-btn").addEventListener("click", () => {
    const text = document.getElementById("text-input").value;
    if (text.trim() === "") return;

    // Xóa mã QR cũ nếu có
    const qrCodeCanvas = document.getElementById("qr-code");
    qrCodeCanvas.innerHTML = "";  // Nếu dùng <div> làm container

    // Tạo mã QR mới
    new QRCode(qrCodeCanvas, {
      text: text,
      width: 128,
      height: 128
    });
  });
});
