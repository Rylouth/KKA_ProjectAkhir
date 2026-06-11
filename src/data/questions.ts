/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from "../types";

export const QUESTION_BANK: Question[] = [
  // --- MATEMATIKA ---
  {
    id: "m1",
    category: "Matematika",
    questionText: "Berapakah hasil dari 12 + 8 × 3 - 6?",
    options: ["54", "30", "26", "20"],
    correctAnswerIndex: 1,
    explanation: "Sesuai aturan urutan operasi (KABATAKU), perkalian dikerjakan terlebih dahulu: 8 × 3 = 24. Kemudian penjumlahan dan pengurangan: 12 + 24 - 6 = 30."
  },
  {
    id: "m2",
    category: "Matematika",
    questionText: "Jika sebuah segitiga memiliki alas 10 cm dan tinggi 8 cm, berapakah luasnya?",
    options: ["80 cm²", "40 cm²", "20 cm²", "60 cm²"],
    correctAnswerIndex: 1,
    explanation: "Rumus luas segitiga adalah Luas = 1/2 × alas × tinggi. Maka Luas = 1/2 × 10 cm × 8 cm = 40 cm²."
  },
  {
    id: "m3",
    category: "Matematika",
    questionText: "Berapakah nilai dari x jika 3x - 5 = 16?",
    options: ["7", "6", "5", "8"],
    correctAnswerIndex: 0,
    explanation: "3x - 5 = 16 => 3x = 16 + 5 => 3x = 21 => x = 21/3 = 7."
  },
  {
    id: "m4",
    category: "Matematika",
    questionText: "Bilangan prima berikutnya setelah 19 adalah...",
    options: ["21", "23", "25", "29"],
    correctAnswerIndex: 1,
    explanation: "Bilangan prima adalah bilangan yang hanya habis dibagi 1 dan dirinya sendiri. Setelah 19, bilangan primanya adalah 23 (21 habis dibagi 3, 25 habis dibagi 5)."
  },
  {
    id: "m5",
    category: "Matematika",
    questionText: "Berapa hasil dari 25% dari 200?",
    options: ["25", "40", "50", "75"],
    correctAnswerIndex: 2,
    explanation: "25% sama dengan 1/4. Maka, 1/4 × 200 = 50."
  },
  {
    id: "m6",
    category: "Matematika",
    questionText: "Deret angka: 2, 4, 8, 16, ... Berapakah angka selanjutnya?",
    options: ["24", "32", "64", "20"],
    correctAnswerIndex: 1,
    explanation: "Deret ini mengalami perkalian 2 dikali setiap sukunya (geometri rasio 2). Maka suku berikutnya setelah 16 adalah 16 × 2 = 32."
  },

  // --- BAHASA INDONESIA ---
  {
    id: "bi1",
    category: "Bahasa Indonesia",
    questionText: "Manakah penulisan kata baku yang benar menurut KBBI?",
    options: ["Apotik", "Apotek", "Apoteek", "Apotika"],
    correctAnswerIndex: 1,
    explanation: "Kata baku yang tepat menurut Kamus Besar Bahasa Indonesia (KBBI) adalah 'Apotek'. Orang yang bekerja di apotek disebut apoteker."
  },
  {
    id: "bi2",
    category: "Bahasa Indonesia",
    questionText: "Lawan kata (antonim) dari kata 'Progresif' adalah...",
    options: ["Aktif", "Modern", "Regresif", "Inovatif"],
    correctAnswerIndex: 2,
    explanation: "Progresif berarti mengalami kemajuan atau berkembang ke arah positif, sedangkan regresif berarti mengalami kemunduran atau berjalan lambat/mundur."
  },
  {
    id: "bi3",
    category: "Bahasa Indonesia",
    questionText: "Ide pokok dalam sebuah paragraf yang terletak di akhir paragraf disebut paragraf...",
    options: ["Deduktif", "Induktif", "Campuran", "Naratif"],
    correctAnswerIndex: 1,
    explanation: "Paragraf Deduktif memiliki gagasan utama di awal. Paragraf Induktif memiliki gagasan utama di akhir paragraf."
  },
  {
    id: "bi4",
    category: "Bahasa Indonesia",
    questionText: "Ungkapan 'Meja hijau' dalam bahasa Indonesia berarti...",
    options: ["Perabotan mewah", "Pasar tradisional", "Mahkamah atau Pengadilan", "Tempat makan"],
    correctAnswerIndex: 2,
    explanation: "Meja hijau merupakan ungkapan bermakna kiasan (idiom) yang berarti pengadilan atau mahkamah hukum."
  },
  {
    id: "bi5",
    category: "Bahasa Indonesia",
    questionText: "Unsur intrinsik yang menjelaskan tempat, waktu, dan suasana dalam cerita disebut...",
    options: ["Tema", "Alur", "Latar (Setting)", "Amanat"],
    correctAnswerIndex: 2,
    explanation: "Latar atau setting merupakan keterangan mengenai ruang (tempat), waktu, serta suasana terjadinya peristiwa-peristiwa dalam cerita."
  },

  // --- BAHASA INGGRIS ---
  {
    id: "be1",
    category: "Bahasa Inggris",
    questionText: "She ______ to school by bus every day.",
    options: ["go", "goes", "going", "gone"],
    correctAnswerIndex: 1,
    explanation: "Kalimat ini menggunakan Simple Present Tense untuk kebiasaan ('every day'). Karena subjeknya tunggal ketiga orang ('She'), kata kerjanya ditambahkan s/es menjadi 'goes'."
  },
  {
    id: "be2",
    category: "Bahasa Inggris",
    questionText: "What is the synonym of the word 'Anxious'?",
    options: ["Happy", "Worried", "Angry", "Calm"],
    correctAnswerIndex: 1,
    explanation: "Anxious memiliki arti cemas atau khawatir, yang bersinonim dengan kata 'Worried'."
  },
  {
    id: "be3",
    category: "Bahasa Inggris",
    questionText: "Please choose the correct past form of the irregular verb 'Write':",
    options: ["Writes", "Writed", "Written", "Wrote"],
    correctAnswerIndex: 3,
    explanation: "Verb 'Write' adalah irregular verb. Bentuk V1: write, V2 (past): wrote, V3: written."
  },
  {
    id: "be4",
    category: "Bahasa Inggris",
    questionText: "If it rains tomorrow, we ______ the picnic.",
    options: ["will cancel", "canceled", "would cancel", "canceling"],
    correctAnswerIndex: 0,
    explanation: "Ini adalah Conditional Sentence Type 1 (kemungkinan di masa depan): If + Simple Present (it rains), Will + Bare Infinitive (will cancel)."
  },
  {
    id: "be5",
    category: "Bahasa Inggris",
    questionText: "Which of the following is an adjective?",
    options: ["Beautifully", "Beauty", "Beautiful", "Beautify"],
    correctAnswerIndex: 2,
    explanation: "'Beautiful' adalah kata sifat (adjective), 'beautifully' adalah kata keterangan (adverb), 'beauty' adalah kata benda (noun), dan 'beautify' adalah kata kerja (verb)."
  },

  // --- IPA (SCIENCE) ---
  {
    id: "ipa1",
    category: "IPA",
    questionText: "Planet terdekat kedua dari Matahari di tata surya kita adalah...",
    options: ["Merkurius", "Venus", "Bumi", "Mars"],
    correctAnswerIndex: 1,
    explanation: "Urutan planet dari yang terdekat dengan Matahari adalah Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus."
  },
  {
    id: "ipa2",
    category: "IPA",
    questionText: "Bagian darah yang berfungsi mengikat oksigen dan mengedarkannya ke tubuh adalah...",
    options: ["Sel darah putih (Leukosit)", "Keping darah (Trombosit)", "Sel darah merah (Eritrosit)", "Plasma darah"],
    correctAnswerIndex: 2,
    explanation: "Sel darah merah (Eritrosit) memiliki hemoglobin yang bertugas mengikat oksigen dari paru-paru dan membawanya ke bagian tubuh yang membutuhkan."
  },
  {
    id: "ipa3",
    category: "IPA",
    questionText: "Simbol kimia untuk unsur emas adalah...",
    options: ["Fe", "Ag", "Au", "Cu"],
    correctAnswerIndex: 2,
    explanation: "Au berasal dari kata Latin 'Aurum' yang merupakan simbol kimia emas. Fe (Besi/Ferrum), Ag (Perak/Argentum), Cu (Tembaga/Cuprum)."
  },
  {
    id: "ipa4",
    category: "IPA",
    questionText: "Peristiwa perubahan wujud benda padat menjadi gas secara langsung tanpa fase cair disebut...",
    options: ["Mencair", "Menguap", "Menyublim", "Mengkristal"],
    correctAnswerIndex: 2,
    explanation: "Menyublim adalah perubahan wujud zat padat langsung menjadi gas, contohnya pada kapur barus yang diletakkan di lemari pakaian."
  },
  {
    id: "ipa5",
    category: "IPA",
    questionText: "Organel sel yang berfungsi sebagai tempat respirasi sel dan penghasil energi utama adalah...",
    options: ["Nukleus", "Mitokondria", "Ribosom", "Kloroplas"],
    correctAnswerIndex: 1,
    explanation: "Mitokondria sering disebut 'the powerhouse of the cell' karena bertanggung jawab menghasilkan molekul pembawa energi (ATP) melalui respirasi molekuler."
  },

  // --- IPS (SOCIAL SCIENCE) ---
  {
    id: "ips1",
    category: "IPS",
    questionText: "Organisasi regional negara-negara di kawasan Asia Tenggara adalah...",
    options: ["APEC", "OPEC", "ASEAN", "NATO"],
    correctAnswerIndex: 2,
    explanation: "ASEAN (Association of Southeast Asian Nations) didirikan pada tanggal 8 Agustus 1967 di Bangkok oleh 5 negara pendiri termasuk Indonesia."
  },
  {
    id: "ips2",
    category: "IPS",
    questionText: "Sifat interaksi sosial di mana ada dua pihak atau lebih berkompetisi memperebutkan suatu hal yang terbatas disebut...",
    options: ["Asosiatif", "Akulturasi", "Persaingan (Kompetisi)", "Kooperasi"],
    correctAnswerIndex: 2,
    explanation: "Kompetisi atau persaingan adalah bentuk interaksi sosial disosiatif di mana pihak berjuang memperoleh tujuan tertentu yang persediaannya terbatas."
  },
  {
    id: "ips3",
    category: "IPS",
    questionText: "Kebutuhan manusia yang mutlak harus dipenuhi agar kelangsungan hidupnya tetap terjaga dinamakan kebutuhan...",
    options: ["Sekunder", "Primer", "Tersier", "Jasmani"],
    correctAnswerIndex: 1,
    explanation: "Kebutuhan Primer (seperti makanan, pakaian, tempat tinggal) merupakan kebutuhan utama yang harus dipenuhi paling awal demi bertahan hidup."
  },
  {
    id: "ips4",
    category: "IPS",
    questionText: "Berdasarkan letak geografisnya, Indonesia terletak di antara dua samudra, yaitu...",
    options: ["Hindia dan Pasifik", "Hindia dan Atlantik", "Arktik dan Hindia", "Pasifik dan Atlantik"],
    correctAnswerIndex: 0,
    explanation: "Secara geografis, Indonesia diapit oleh Benua Asia dan Benua Australia, serta Samudra Hindia dan Samudra Pasifik."
  },
  {
    id: "ips5",
    category: "IPS",
    questionText: "Pemberian bantuan langsung berupa barang atau jasa oleh pemerintah tanpa imbal balik dikenal dengan nama...",
    options: ["Subsidi", "Pajak", "Ekspor", "Investasi"],
    correctAnswerIndex: 0,
    explanation: "Subsidi merupakan bantuan finansial atau bantuan barang/jasa dari pemerintah kepada masyarakat agar harga komoditas penting tetap terjangkau."
  },

  // --- SEJARAH ---
  {
    id: "sej1",
    category: "Sejarah",
    questionText: "Kapan teks Proklamasi Kemerdekaan Indonesia dibacakan?",
    options: ["1 Juni 1945", "17 Agustus 1945", "18 Agustus 1945", "20 Mei 1908"],
    correctAnswerIndex: 1,
    explanation: "Kemerdekaan Indonesia diproklamasikan oleh Ir. Soekarno didampingi Drs. Mohammad Hatta pada tanggal 17 Agustus 1945 pukul 10.00 WIB."
  },
  {
    id: "sej2",
    category: "Sejarah",
    questionText: "Candi Borobudur sebagai candi Buddha terbesar di dunia didirikan pada masa kerajaan...",
    options: ["Majapahit", "Tarumanegara", "Syailendra (Mataram Kuno)", "Sriwijaya"],
    correctAnswerIndex: 2,
    explanation: "Candi Borobudur didirikan sekitar abad ke-8 pada masa pemerintahan Dinasti Syailendra dari Kerajaan Mataram Kuno penganut Buddha Mahayana."
  },
  {
    id: "sej3",
    category: "Sejarah",
    questionText: "Siapakah tokoh yang mengetik naskah asli Proklamasi Kemerdekaan Indonesia?",
    options: ["Sayuti Melik", "Sukarni", "Ahmad Soebardjo", "Latief Hendraningrat"],
    correctAnswerIndex: 0,
    explanation: "Naskah Proklamasi yang dirumuskan oleh Bung Karno, Bung Hatta, dan Ahmad Soebardjo diketik secara rapi oleh Sayuti Melik dengan mesin tik."
  },
  {
    id: "sej4",
    category: "Sejarah",
    questionText: "Pahlawan nasional Indonesia yang memimpin perang gerilya melawan kolonialisme meski dalam keadaan sakit paru-paru adalah...",
    options: ["Pangeran Diponegoro", "Jenderal Sudirman", "Cut Nyak Dien", "Kapitan Pattimura"],
    correctAnswerIndex: 1,
    explanation: "Jenderal Besar Sudirman memimpin aksi militer gerilya dengan ditandu sejauh ratusan kilometer saat mengidap penyakit paru-paru parah."
  },
  {
    id: "sej5",
    category: "Sejarah",
    questionText: "Kongres pemuda II melahirkan keputusan bersejarah 'Sumpah Pemuda' pada tanggal...",
    options: ["28 Oktober 1928", "20 Mei 1908", "10 November 1945", "17 Agustus 1945"],
    correctAnswerIndex: 0,
    explanation: "Kongres Pemuda II diselenggarakan di Jakarta pada 27-28 Oktober 1928 menghasilkan ikrar persatuan tanah air, bangsa, dan bahasa Indonesia."
  },

  // --- GEOGRAFI ---
  {
    id: "geo1",
    category: "Geografi",
    questionText: "Manakah gurun pasir terluas di dunia?",
    options: ["Gurun Gobi", "Gurun Sahara", "Gurun Kalahari", "Gurun Arab"],
    correctAnswerIndex: 1,
    explanation: "Gurun Sahara yang terletak di bagian utara benua Afrika merupakan gurun pasir panas terbesar dan terluas di dunia."
  },
  {
    id: "geo2",
    category: "Geografi",
    questionText: "Apakah nama ibukota dari negara Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctAnswerIndex: 2,
    explanation: "Ibukota federasi dan pusat administrasi kemegahan dari negara Australia adalah kota Canberra, bukan Sydney maupun Melbourne."
  },
  {
    id: "geo3",
    category: "Geografi",
    questionText: "Sungai terpanjang di dunia yang melintasi beberapa negara di benua Afrika adalah...",
    options: ["Sungai Amazon", "Sungai Nil", "Sungai Yangtze", "Sungai Mississippi"],
    correctAnswerIndex: 1,
    explanation: "Sungai Nil merupakan sungai terpanjang di dunia (sekitar 6.650 km), disusul oleh Sungai Amazon sebagai sungai dengan volume air terbesar di dunia."
  },
  {
    id: "geo4",
    category: "Geografi",
    questionText: "Garis khayal yang melingkari Bumi secara horizontal dan membagi menjadi belahan Utara dan Selatan dinamakan...",
    options: ["Garis Bujur", "Garis Khatulistiwa (Ekuator)", "Garis Meridian", "Garis Greenwick"],
    correctAnswerIndex: 1,
    explanation: "Garis Khatulistiwa atau Ekuator adalah garis lintang 0 derajat yang membelah permukaan bumi secara horizontal seimbang utara-selatan."
  },
  {
    id: "geo5",
    category: "Geografi",
    questionText: "Puncak tertinggi di dunia yang berada dalam rantai pegunungan Himalaya adalah puncak...",
    options: ["Kilimanjaro", "K2", "Everest", "Mont Blanc"],
    correctAnswerIndex: 2,
    explanation: "Gunung Everest memiliki puncak tertinggi di dunia dengan ketinggian sekitar 8.848 meter di atas permukaan laut, terletak di perbatasan Nepal dan Tibet."
  },

  // --- PENGETAHUAN UMUM ---
  {
    id: "pu1",
    category: "Pengetahuan Umum",
    questionText: "Lambang negara Republik Indonesia adalah...",
    options: ["Burung Kenari", "Burung Merpati", "Burung Garuda", "Banteng"],
    correctAnswerIndex: 2,
    explanation: "Lambang negara kebanggaan Indonesia adalah Garuda Pancasila dengan semboyan legendaris Bhinneka Tunggal Ika."
  },
  {
    id: "pu2",
    category: "Pengetahuan Umum",
    questionText: "Siapa penemu lampu pijar praktis yang terkenal?",
    options: ["Albert Einstein", "Nikola Tesla", "Thomas Alva Edison", "Alexander Graham Bell"],
    correctAnswerIndex: 2,
    explanation: "Thomas Alva Edison mematentkan model lampu pijar komersial yang praktis dan tahan lama pada tahun 1879, membuka era pencahayaan modern."
  },
  {
    id: "pu3",
    category: "Pengetahuan Umum",
    questionText: "Berapa banyak provinsi yang ada di Indonesia saat ini (hingga penetapan tahun 2023)?",
    options: ["34 Provinsi", "36 Provinsi", "38 Provinsi", "40 Provinsi"],
    correctAnswerIndex: 2,
    explanation: "Dengan adanya pemekaran wilayah di daerah Papua pada akhir tahun 2022, jumlah provinsi di Indonesia saat ini tercatat ada 38 Provinsi."
  },
  {
    id: "pu4",
    category: "Pengetahuan Umum",
    questionText: "Batik Indonesia secara resmi dinobatkan sebagai Warisan Kemanusiaan untuk Budaya Lisan dan Nonbendawi oleh organisasi PBB yaitu...",
    options: ["UNICEF", "UNESCO", "WHO", "WTO"],
    correctAnswerIndex: 1,
    explanation: "UNESCO menetapkan Batik Indonesia sebagai karya agung warisan budaya tak benda pada tanggal 2 Oktober 2009, yang kini diperingati sebagai Hari Batik Nasional."
  },
  {
    id: "pu5",
    category: "Pengetahuan Umum",
    questionText: "Mata uang resmi dari negara Jepang adalah...",
    options: ["Yuan", "Ringgit", "Yen", "Won"],
    correctAnswerIndex: 2,
    explanation: "Mata uang resmi negara Jepang adalah Yen. Won digunakan di Korea, Yuan digunakan di Tiongkok, dan Ringgit digunakan di Malaysia."
  }
];

export const CATEGORY_ICONS: Record<string, string> = {
  "Matematika": "Calculator",
  "Bahasa Indonesia": "BookOpen",
  "Bahasa Inggris": "Globe",
  "IPA": "Atom",
  "IPS": "Users",
  "Sejarah": "Hourglass",
  "Geografi": "Compass",
  "Pengetahuan Umum": "Lightbulb"
};

export const CATEGORY_COLORS: Record<string, string> = {
  "Matematika": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "Bahasa Indonesia": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  "Bahasa Inggris": "bg-amber-500/10 text-amber-400 border-amber-500/30",
  "IPA": "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  "IPS": "bg-purple-500/10 text-purple-400 border-purple-500/30",
  "Sejarah": "bg-rose-500/10 text-rose-400 border-rose-500/30",
  "Geografi": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  "Pengetahuan Umum": "bg-orange-500/10 text-orange-400 border-orange-500/30"
};
