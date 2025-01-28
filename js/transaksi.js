// JS Code for Modal
document.addEventListener("DOMContentLoaded", () => {
    const detailButtons = document.querySelectorAll(".btn.detail");
    const modal = document.getElementById("transaction-modal");
    const modalContent = document.getElementById("transaction-detail");
    const closeModal = document.querySelector(".close-btn");

    const transactions = {
        "1": {
            noTiket: "TX12345",
            tanggal: "2024-12-30",
            namaKonser: "Konser A",
            nama: "Ahmad Taufik",
            jumlahTiket: 2,
            total: "Rp 200,000",
            qrCode: "qrcode1.png",
        },
        "2": {
            noTiket: "TX12346",
            tanggal: "2024-12-31",
            namaKonser: "Konser B",
            nama: "Siti Aisyah",
            jumlahTiket: 3,
            total: "Rp 300,000",
            qrCode: "qrcode2.png",
        },
    };

    detailButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.id;
            const data = transactions[id];
            if (data) {
                modalContent.innerHTML = `
                    <strong>No. Tiket:</strong> ${data.noTiket}<br>
                    <strong>Tanggal:</strong> ${data.tanggal}<br>
                    <strong>Nama Konser:</strong> ${data.namaKonser}<br>
                    <strong>Nama:</strong> ${data.nama}<br>
                    <strong>Jumlah Tiket:</strong> ${data.jumlahTiket}<br>
                    <strong>Total:</strong> ${data.total}<br>
                    <strong>QR Code:</strong> <img src="${data.qrCode}" alt="QR Code" style="width:100px;">
                `;
                modal.style.display = "block";
            }
        });
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", event => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});