// Data detail pembeli
const details = {
    1: {
        nama: "Ahmad Taufik",
        email: "ahmad.taufik@example.com",
        role: "Pembeli",
    },
    2: {
        nama: "Siti Aisyah",
        email: "siti.aisyah@example.com",
        role: "Pembeli",
    },
    3: {
        nama: "Roni Saputra",
        email: "roni.saputra@example.com",
        role: "Pembeli",
    },
};

// Event Listener untuk tombol detail
document.querySelectorAll(".btn.detail").forEach((button) => {
    button.addEventListener("click", (event) => {
        const id = event.target.closest("button").dataset.id;
        const detail = details[id];
        if (detail) {
            // Menampilkan data pada placeholder
            document.getElementById("popup-nama").textContent = detail.nama;
            document.getElementById("popup-email").textContent = detail.email;
            document.getElementById("popup-role").textContent = detail.role;
            document.getElementById("popup").style.display = "flex";
        }
    });
});

// Event Listener untuk tombol close
document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("popup").style.display = "none";
});
