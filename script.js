// Sample data for candidates
const candidates = {
    1: {
        ketua: "Anies Baswedan",
        wakil: "Muahmin Iskandar",
        photo: "ANIES.png",
        visi: "Membangun OSIS yang inklusif dan inovatif untuk semua siswa.",
        misi: "1. Meningkatkan fasilitas belajar.<br>2. Mengadakan kegiatan ekstrakurikuler lebih banyak.<br>3. Memperkuat komunikasi antar siswa dan guru."
    },
    2: {
        ketua: "Prabowo Subianto",
        wakil: "Gibran Rakabuming Raka",
        photo: "PRABOWO.png",
        visi: "OSIS yang berfokus pada pengembangan kepemimpinan siswa.",
        misi: "1. Pelatihan kepemimpinan rutin.<br>2. Kolaborasi dengan komunitas luar.<br>3. Program pengabdian masyarakat."
    },
    3: {
        ketua: "Ganjar",
        wakil: "Teuapal",
        photo: "GANJAR.png",
        visi: "Menciptakan lingkungan sekolah yang ramah dan berkelanjutan.",
        misi: "1. Kampanye lingkungan hijau.<br>2. Dukungan kesehatan mental siswa.<br>3. Peningkatan teknologi di sekolah."
    },
    4: {
        ketua: "Mas Nazriel Ganteng",
        wakil: "Istrinya Anime",
        photo: "MAS NAZRIEL.png",
        visi: "OSIS yang mendukung Nonton Anime Harem,Ecchi,Hentai(WAJIB).",
        misi: "1. Membangun Semua Siswa Harus Nonton Anime.<br>2. Membangun Semua Siswa Harus Wibu.<br>3. Membangun Semua Siswa Harus Harem,Ecchi,Hentai."
    }
};

// No student data loading needed, using shared password

let currentCandidate = null;
let isVotingDisabled = false;
let currentStudent = null;
let votes = JSON.parse(localStorage.getItem('votes')) || [];
let loggedIn = JSON.parse(localStorage.getItem('loggedIn')) || [];
const successEl = document.getElementById('successMessage');

function updateCounts() {
    // Update vote counts from votes array
    const voteCounts = {1: 0, 2: 0, 3: 0, 4: 0};
    votes.forEach(vote => {
        if (voteCounts[vote.candidateId] !== undefined) {
            voteCounts[vote.candidateId]++;
        }
    });
    localStorage.setItem('voteCounts', JSON.stringify(voteCounts));
}

function openModal(id) {
    currentCandidate = id;
    const cand = candidates[id];
    document.getElementById('modal-name').innerHTML = "Ketua: " + cand.ketua + "<br>Wakil: " + cand.wakil;
    document.getElementById('modal-photo').src = cand.photo;
    document.getElementById('modal-visi').textContent = cand.visi;
    document.getElementById('modal-misi').innerHTML = cand.misi;
    document.getElementById('thanks').style.display = 'none';
    document.getElementById('vote-btn').disabled = isVotingDisabled;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function vote() {
    if (isVotingDisabled) return;

    // Check if student already voted
    if (votes.some(v => v.studentName === currentStudent.name && v.studentClass === currentStudent.class)) {
        alert("Anda sudah memilih sebelumnya.");
        return;
    }

    isVotingDisabled = true;
    document.getElementById('vote-btn').disabled = true;

    // Save vote with student info
    votes.push({
        studentName: currentStudent.name,
        studentClass: currentStudent.class,
        studentMajor: currentStudent.major,
        candidateId: currentCandidate
    });
    localStorage.setItem('votes', JSON.stringify(votes));
    updateCounts();

    // Close modal immediately
    closeModal();

    // Show thanks screen for 3 seconds
    document.getElementById('thanks-screen').style.display = 'flex';
    document.getElementById('successMessage').textContent = 'Terima kasih telah memilih, semoga paslon yang kamu pilih bisa memajukan sekolah SMK PLUS YSB SURYALAYA';

    // After 3 seconds, hide thanks screen and show animation for 2 seconds
    setTimeout(() => {
        document.getElementById('thanks-screen').style.display = 'none';
        document.getElementById('animation-screen').style.display = 'flex';
    }, 3000);

    // After another 2 seconds (total 5 seconds), reset and go back to login
    setTimeout(() => {
        document.getElementById('animation-screen').style.display = 'none';
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('studentPassword').value = '';
        document.getElementById('loginError').textContent = '';
        currentStudent = null;
        isVotingDisabled = false;
    }, 5000);
}

// Login form handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const passwordInput = document.getElementById('studentPassword').value.trim();
    const loginError = document.getElementById('loginError');



    // Use a shared password for all students
    if (passwordInput !== "osis") {
        loginError.textContent = "Password tidak valid. Silakan coba lagi.";
        return;
    }

    // Set a dummy student for voting (unique per login to allow multiple votes)
    currentStudent = { name: "Student" + Date.now(), class: "Shared", major: "Voting" };

    // Clear error
    loginError.textContent = "";

    // Hide login screen and show main content
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
});

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Initialize counts
updateCounts();
