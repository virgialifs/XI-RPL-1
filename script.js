// XI RPL 1 Dashboard — JavaScript dasar untuk interaksi.
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// Tanggal dan tahun otomatis.
function updateDate() {
  const now = new Date();
  $("#todayDate").textContent = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  $("#year").textContent = now.getFullYear();
}
updateDate();

// Navigasi: mengubah judul halaman ketika menu diklik.
$$(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    $$(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    $("#pageTitle").textContent = link.dataset.page;
    $("#sidebar").classList.remove("open");
    if (link.dataset.page !== "Dashboard") {
      showToast(
        "Bagian " + link.dataset.page + "",
      );
    }
  });
});

// Menu samping untuk layar HP.
$("#mobileMenu").addEventListener("click", () =>
  $("#sidebar").classList.toggle("open"),
);

// Mode terang/gelap, pilihan disimpan di browser.
const savedTheme = localStorage.getItem("xi-rpl-theme");
if (savedTheme === "light") document.body.classList.add("light");
$("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "xi-rpl-theme",
    document.body.classList.contains("light") ? "light" : "dark",
  );
  showToast(
    document.body.classList.contains("light")
      ? "Mode terang aktif."
      : "Mode gelap aktif.",
  );
});

// Pencarian sederhana pada daftar materi/tugas dan pengumuman.
$("#globalSearch").addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase().trim();
  let found = 0;
  $$(".task-row, .announcement, .event-row, .student-person").forEach(
    (item) => {
      const match = item.textContent.toLowerCase().includes(query);
      item.style.display = match ? "" : "none";
      if (match && query) found++;
    },
  );
  if (query.length > 1) {
    // Pesan tidak muncul setiap ketikan supaya tidak mengganggu.
    $("#pageTitle").textContent = found ? "Hasil pencarian" : "Tidak ditemukan";
  } else {
    $("#pageTitle").textContent = "Dashboard";
    $$(".nav-link").forEach((item) =>
      item.classList.toggle("active", item.dataset.page === "Dashboard"),
    );
  }
});

$("#notifyBtn").addEventListener("click", () =>
  showToast("Belum ada notifikasi baru."),
);
$("#showAllTasks").addEventListener("click", () =>
  showToast(
    "Tambahkan materi dan tugas kelas di bagian taskList pada index.html.",
  ),
);
$("#showStudents").addEventListener("click", () =>
  showToast("Ganti contoh nama dengan data siswa kelas lu."),
);
$("#addEvent").addEventListener("click", () => {
  const title = prompt("Nama agenda kelas:");
  if (!title || !title.trim()) return;
  const date = prompt("Tanggal agenda (contoh: 22 OKT):", "22 OKT");
  const time = prompt("Jam/lokasi agenda:", "08.00 · Ruang kelas");
  const parts = (date || "22 OKT").trim().split(/\s+/);
  const day = (parts[0] || "22").replace(/\D/g, "").slice(0, 2) || "22";
  const month = (parts[1] || "OKT").toUpperCase().slice(0, 3);
  const row = document.createElement("article");
  row.className = "event-row";
  row.innerHTML = `<div class="event-date"><b></b><small></small></div><div class="event-details"><b></b><small></small></div><span class="event-dot blue-dot"></span>`;
  row.querySelector(".event-date b").textContent = day;
  row.querySelector(".event-date small").textContent = month;
  row.querySelector(".event-details b").textContent = title.trim();
  row.querySelector(".event-details small").textContent = (
    time || "Waktu belum ditentukan"
  ).trim();
  $("#eventList").appendChild(row);
  $("#eventCount").textContent = String(
    $("#eventList").children.length,
  ).padStart(2, "0");
  showToast(
    "Agenda berhasil ditambahkan. Catatan ini hanya tersimpan selama halaman terbuka.",
  );
});

// Angka demo: ubah sesuai data kelas asli.
$("#studentCount").textContent = "35";
$("#taskCount").textContent = "0";
$("#eventCount").textContent = String($("#eventList").children.length).padStart(
  2,
  "0",
);
