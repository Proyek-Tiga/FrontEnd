document.addEventListener("DOMContentLoaded", () => {
    const tiketTableBody = document.getElementById("tiketTableBody");
    const popupTambahTiket = document.getElementById("popupTambahTiket");
    const popupEditTiket = document.getElementById("popupEditTiket");
    const popupHapusTiket = document.getElementById("popupHapusTiket");

    const btnTambahTiket = document.getElementById("btnTambahTiket");
    const btnBatalTambahTiket = document.getElementById("btnBatalTambahTiket");
    const btnBatalEditTiket = document.getElementById("btnBatalEditTiket");
    const btnKonfirmasiHapusTiket = document.getElementById("btnKonfirmasiHapusTiket");
    const btnBatalHapusTiket = document.getElementById("btnBatalHapusTiket");

    const formTambahTiket = document.getElementById("formTambahTiket");
    const formEditTiket = document.getElementById("formEditTiket");

    const editTiketId = document.getElementById("editTiketId");
    const editNamaTiket = document.getElementById("editNamaTiket");
    const editHargaTiket = document.getElementById("editHargaTiket");
    const editKonser = document.getElementById("editKonser");

    let tiketToDeleteId = null;

    // Fungsi untuk menampilkan atau menyembunyikan popup
    function togglePopup(popup, show) {
        popup.style.display = show ? "block" : "none";
    }

    // Tambah Tiket
    btnTambahTiket.addEventListener("click", () => {
        togglePopup(popupTambahTiket, true);
    });

    btnBatalTambahTiket.addEventListener("click", () => {
        togglePopup(popupTambahTiket, false);
    });

    formTambahTiket.addEventListener("submit", (e) => {
        e.preventDefault();
        const namaTiket = formTambahTiket.namaTiket.value.trim();
        const hargaTiket = formTambahTiket.hargaTiket.value.trim();
        const konser = formTambahTiket.konser.value.trim();
        const jumlahTiket = formTambahTiket.jumlahTiket.value.trim();

        if (namaTiket && hargaTiket && konser && jumlahTiket) {
            const newRow = document.createElement("tr");
            const newId = Date.now(); // Simulasi ID unik

            newRow.setAttribute("data-id", newId);
            newRow.innerHTML = `
                <td>${tiketTableBody.children.length + 1}</td>
                <td>${namaTiket}</td>
                <td>${hargaTiket}</td>
                <td>${konser}</td>
                <td>${jumlahTiket}</td>
                <td>
                    <button class="btn edit" data-id="${newId}" aria-label="Edit Tiket"><i class="fas fa-edit"></i></button>
                    <button class="btn delete" data-id="${newId}" aria-label="Hapus Tiket"><i class="fas fa-trash"></i></button>
                </td>
            `;

            tiketTableBody.appendChild(newRow);
            addRowEventListeners(newRow); // Tambahkan listener untuk tombol baru
            togglePopup(popupTambahTiket, false);
            formTambahTiket.reset();
        }
    });

    // Edit Tiket
    tiketTableBody.addEventListener("click", (e) => {
        if (e.target.closest(".edit")) {
            const row = e.target.closest("tr");
            const tiketId = row.getAttribute("data-id");
            const cells = row.children;

            editTiketId.value = tiketId;
            editNamaTiket.value = cells[1].textContent.trim();
            editHargaTiket.value = cells[2].textContent.trim();
            editKonser.value = cells[3].textContent.trim();

            togglePopup(popupEditTiket, true);
        }
    });

    btnBatalEditTiket.addEventListener("click", () => {
        togglePopup(popupEditTiket, false);
    });

    formEditTiket.addEventListener("submit", (e) => {
        e.preventDefault();
        const tiketId = editTiketId.value;
        const namaTiket = editNamaTiket.value.trim();
        const hargaTiket = editHargaTiket.value.trim();
        const konser = editKonser.value.trim();

        if (tiketId && namaTiket && hargaTiket && konser) {
            const row = tiketTableBody.querySelector(`tr[data-id="${tiketId}"]`);
            if (row) {
                const cells = row.children;
                cells[1].textContent = namaTiket;
                cells[2].textContent = hargaTiket;
                cells[3].textContent = konser;

                togglePopup(popupEditTiket, false);
            }
        }
    });

    // Hapus Tiket
    tiketTableBody.addEventListener("click", (e) => {
        if (e.target.closest(".delete")) {
            const row = e.target.closest("tr");
            tiketToDeleteId = row.getAttribute("data-id");
            togglePopup(popupHapusTiket, true);
        }
    });

    btnBatalHapusTiket.addEventListener("click", () => {
        togglePopup(popupHapusTiket, false);
        tiketToDeleteId = null;
    });

    btnKonfirmasiHapusTiket.addEventListener("click", () => {
        if (tiketToDeleteId) {
            const row = tiketTableBody.querySelector(`tr[data-id="${tiketToDeleteId}"]`);
            if (row) {
                tiketTableBody.removeChild(row);
                togglePopup(popupHapusTiket, false);
                tiketToDeleteId = null;

                // Perbarui nomor urut
                Array.from(tiketTableBody.children).forEach((tr, index) => {
                    tr.children[0].textContent = index + 1;
                });
            }
        }
    });

    // Fungsi untuk menambahkan event listener pada baris baru
    function addRowEventListeners(row) {
        const editButton = row.querySelector(".edit");
        const deleteButton = row.querySelector(".delete");

        if (editButton) {
            editButton.addEventListener("click", () => {
                editButton.click();
            });
        }

        if (deleteButton) {
            deleteButton.addEventListener("click", () => {
                deleteButton.click();
            });
        }
    }
});
