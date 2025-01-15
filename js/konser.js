const API_URL = 'https://tiket-backend-theta.vercel.app/api/konser';
const closeModal = document.querySelector('.close');
const editForm = document.getElementById('edit-form');
const token = localStorage.getItem("authToken");
    if (!token) {
        alert('Token tidak ditemukan. Harap login ulang.');
        return; // Hentikan eksekusi jika token tidak ditemukan
    }

// Function to fetch and display data
async function fetchConcerts() {
    try {
        const response = await fetch(API_URL);
        const concerts = await response.json();

        const container = document.querySelector('.card-container');
        
        // Hapus hanya elemen dinamis (kartu konser), bukan elemen statis seperti judul
        const cards = container.querySelectorAll('.concert-card');
        cards.forEach(card => card.remove());

        concerts.forEach(concert => {
            const concertCard = document.createElement('div');
            concertCard.classList.add('concert-card');

            // Format tanggal
            const formattedDate = new Date(concert.tanggal_konser).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });

            concertCard.innerHTML = `
                <img src="${concert.image || 'https://via.placeholder.com/300x200'}" alt="Concert Image" class="concert-image">
                <div class="concert-header">
                    <h3>${concert.nama_konser}</h3>
                    <select class="status-dropdown">
                        <option value="approved" ${concert.status === 'approved' ? 'selected' : ''}>Approved</option>
                        <option value="pending" ${concert.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="rejected" ${concert.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </div>
                <div class="concert-details">
                    <p><strong>Tanggal:</strong> ${formattedDate}</p>
                    <p><strong>Jumlah Tiket:</strong> ${concert.jumlah_tiket}</p>
                    <p><strong>Harga:</strong> Rp ${concert.harga.toLocaleString('id-ID')}</p>
                    <p><strong>Bank:</strong> ${concert.jenis_bank}</p>
                    <p><strong>Atas Nama:</strong> ${concert.atas_nama}</p>
                </div>
                <div class="concert-actions">
                    <button class="btn edit">Edit</button>
                    <button class="btn delete">Hapus</button>
                </div>
            `;
            container.appendChild(concertCard);

            // Add event listener to the dropdown for status changes
            const dropdown = concertCard.querySelector('.status-dropdown');
            dropdown.addEventListener('change', async (event) => {
                const newStatus = event.target.value;

                try {
                    await updateConcertStatus(concert.id, newStatus);
                    alert(`Status konser "${concert.nama_konser}" berhasil diubah menjadi "${newStatus}".`);
                } catch (error) {
                    console.error(`Gagal mengubah status konser "${concert.nama_konser}":`, error);
                    alert('Terjadi kesalahan saat memperbarui status.');
                }
            });
        });
    } catch (error) {
        console.error('Error fetching concert data:', error);
    }
}

// Open modal function
function openEditModal(concert) {
    modal.style.display = 'flex';

    // Populate form fields with concert data
    document.getElementById('concert-id').value = concert.id;
    document.getElementById('nama_konser').value = concert.nama_konser;
    document.getElementById('tanggal_konser').value = new Date(concert.tanggal_konser).toISOString().slice(0, 16);
    document.getElementById('harga').value = concert.harga;
    document.getElementById('image').value = concert.image;
    document.getElementById('jenis_bank').value = concert.jenis_bank;
    document.getElementById('atas_nama').value = concert.atas_nama;
    document.getElementById('rekening').value = concert.rekening;
}

// Close modal function
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Handle form submission
editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const concertId = document.getElementById('concert-id').value;
    const updatedConcert = {
        nama_konser: document.getElementById('nama_konser').value,
        tanggal_konser: new Date(document.getElementById('tanggal_konser').value).toISOString(),
        harga: parseInt(document.getElementById('harga').value, 10),
        image: document.getElementById('image').value,
        jenis_bank: document.getElementById('jenis_bank').value,
        atas_nama: document.getElementById('atas_nama').value,
        rekening: parseInt(document.getElementById('rekening').value, 10),
    };

    try {
        const response = await fetch(`${API_URL}/${concertId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updatedConcert),
        });

        if (response.ok) {
            alert('Konser berhasil diperbarui!');
            modal.style.display = 'none';
            fetchConcerts(); // Reload concert data
        } else {
            alert('Gagal memperbarui konser.');
        }
    } catch (error) {
        console.error('Error updating concert:', error);
    }
});

// Add event listener to Edit buttons
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit')) {
        const card = event.target.closest('.concert-card');
        const concert = {
            id: card.dataset.id,
            nama_konser: card.querySelector('h3').textContent,
            tanggal_konser: card.dataset.tanggalKonser,
            harga: parseInt(card.dataset.harga, 10),
            image: card.querySelector('img').src,
            jenis_bank: card.dataset.jenisBank,
            atas_nama: card.dataset.atasNama,
            rekening: card.dataset.rekening,
        };
        openEditModal(concert);
    }
});

// Load data when the page loads
document.addEventListener('DOMContentLoaded', fetchConcerts);
