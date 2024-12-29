document.addEventListener('DOMContentLoaded', () => {
    const addConcertBtn = document.getElementById('addConcertBtn');
    const popupForm = document.getElementById('popupForm');
    const closePopup = document.getElementById('closePopup');
    const cancelBtn = document.getElementById('cancelBtn');
    const concertForm = document.getElementById('concertForm');
    const concertTableBody = document.querySelector('#concertTable tbody');

    // Membuka popup
    addConcertBtn.addEventListener('click', () => {
        popupForm.style.display = 'flex';
    });

    // Menutup popup
    const closePopupForm = () => {
        popupForm.style.display = 'none';
        concertForm.reset();
    };

    closePopup.addEventListener('click', closePopupForm);
    cancelBtn.addEventListener('click', closePopupForm);

    window.addEventListener('click', (event) => {
        if (event.target === popupForm) {
            closePopupForm();
        }
    });

    // Menambahkan data ke tabel
    concertForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Ambil data dari form
        const no = document.getElementById('concertNo').value;
        const lokasi = document.getElementById('concertLocation').value;
        const kapasitas = document.getElementById('concertCapacity').value;

        // Tambahkan data ke tabel
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no}</td>
            <td>${lokasi}</td>
            <td>${kapasitas}</td>
            <td>
                <button class="btn-secondary btn-delete">Hapus</button>
            </td>
        `;

        // Tombol hapus
        row.querySelector('.btn-delete').addEventListener('click', () => {
            row.remove();
        });

        concertTableBody.appendChild(row);

        // Tutup popup
        closePopupForm();
    });
});
