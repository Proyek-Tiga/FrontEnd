document.querySelectorAll(".btn.detail").forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr");
      const ticketNo = row.cells[1].textContent;
      const ticketDate = row.cells[2].textContent;
      const concertName = row.cells[3].textContent;
      const buyerName = row.cells[4].textContent;
      const ticketQuantity = row.cells[5].textContent;
      const totalPrice = row.cells[6].textContent;
      const qrCodeSrc = row.cells[7].querySelector("img").src;
  
      // Isi modal dengan data
      document.getElementById("ticket-no").textContent = ticketNo;
      document.getElementById("ticket-date").textContent = ticketDate;
      document.getElementById("concert-name").textContent = concertName;
      document.getElementById("buyer-name").textContent = buyerName;
      document.getElementById("ticket-quantity").textContent = ticketQuantity;
      document.getElementById("total-price").textContent = totalPrice;
      document.getElementById("qrcode-img").src = qrCodeSrc;
  
      // Tampilkan modal
      document.getElementById("eticket-modal").style.display = "block";
    });
  });
  
  // Tutup modal
  document.querySelector(".close-btn").addEventListener("click", function () {
    document.getElementById("eticket-modal").style.display = "none";
  });
  
  // Tutup modal jika klik di luar modal
  window.addEventListener("click", function (e) {
    const modal = document.getElementById("eticket-modal");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
  