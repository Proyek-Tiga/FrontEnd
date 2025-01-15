document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://tiket-backend-theta.vercel.app/api/konser';
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
                    <button class="btn edit" data-id="${concert.id}"><i class="fas fa-edit"></i>Edit</button>
                    <button class="btn delete"><i class="fas fa-trash"></i>Hapus</button>
                </div>
            `;
                container.appendChild(concertCard);

            });

            // Tambahkan event listener untuk tombol edit
            const editButtons = container.querySelectorAll('.btn.edit');
            editButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const concertId = e.target.closest('button').dataset.id;
                    if (concertId) {
                        openEditModal(concertId);
                    } else {
                        console.error('Concert ID tidak ditemukan pada tombol.');
                    }
                });
            });            
        } catch (error) {
            console.error('Error fetching concert data:', error);
        }
    }

    // Function to open edit modal
    async function openEditModal(concertId) {
        if (!concertId) {
            console.error('Concert ID tidak valid:', concertId);
            alert('Terjadi kesalahan, ID konser tidak ditemukan.');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/${concertId}`);
            const concert = await response.json();

            // Isi data ke form
            document.getElementById('concert-id').value = concert.id;
            document.getElementById('nama_konser').value = concert.nama_konser;
            document.getElementById('tanggal_konser').value = new Date(concert.tanggal_konser).toISOString().slice(0, 16);
            document.getElementById('harga').value = concert.harga;
            document.getElementById('image').value = concert.image || '';
            document.getElementById('jenis_bank').value = concert.jenis_bank;
            document.getElementById('atas_nama').value = concert.atas_nama;
            document.getElementById('rekening').value = concert.rekening;

            // Tampilkan modal
            document.getElementById('edit-modal').style.display = 'block';
        } catch (error) {
            console.error('Error fetching concert details:', error);
            alert('Gagal memuat data konser.');
        }
    }

    // Function to submit edited data
    document.getElementById('edit-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const concertId = document.getElementById('concert-id').value;
        const updatedData = {
            id: concertId,
            nama_konser: document.getElementById('nama_konser').value,
            tanggal_konser: new Date(document.getElementById('tanggal_konser').value).toISOString(),
            harga: parseInt(document.getElementById('harga').value, 10),
            image: document.getElementById('image').value,
            jenis_bank: document.getElementById('jenis_bank').value,
            atas_nama: document.getElementById('atas_nama').value,
            rekening: document.getElementById('rekening').value
        };

        try {
            const response = await fetch(`${API_URL}/${concertId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                alert('Konser berhasil diperbarui.');
                document.getElementById('edit-modal').style.display = 'none';
                await fetchConcerts();
            } else {
                throw new Error('Gagal memperbarui konser.');
            }
        } catch (error) {
            console.error('Error updating concert:', error);
            alert('Terjadi kesalahan saat memperbarui konser.');
        }
    });

    // Initial fetch data
    await fetchConcerts();

    // Close modal logic
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('edit-modal').style.display = 'none';
    });
});

