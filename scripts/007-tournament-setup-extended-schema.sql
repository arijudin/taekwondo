-- Add new columns to tournaments table
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS grade_kejuaraan VARCHAR(100);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS tempat_kejuaraan VARCHAR(255);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS lokasi_kejuaraan VARCHAR(255);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS jumlah_peserta_prestasi INTEGER DEFAULT 0;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS jumlah_peserta_pemula INTEGER DEFAULT 0;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS tanggal_buka_pendaftaran DATE;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS tanggal_tutup_pendaftaran DATE;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS status_pendaftaran VARCHAR(50) DEFAULT 'closed' CHECK (status_pendaftaran IN ('open', 'closed', 'extended'));
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS status_pendaftaran_atlit VARCHAR(50) DEFAULT 'pending' CHECK (status_pendaftaran_atlit IN ('pending', 'open', 'closed'));
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS status_kelas_atlit VARCHAR(50) DEFAULT 'draft' CHECK (status_kelas_atlit IN ('draft', 'published', 'finalized'));
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS penjelasan_kejuaraan TEXT;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS kota_kejuaraan VARCHAR(255);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS nomor_surat_ijin VARCHAR(255);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS ketua VARCHAR(255);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS sekretaris VARCHAR(255);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS opsi_pendaftaran TEXT;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS lebar_ukuran_cocard INTEGER DEFAULT 85;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS tinggi_ukuran_cocard INTEGER DEFAULT 54;

-- File upload columns (storing GCP URLs)
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS gambar_cap_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS cocard_atlit_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS cocard_coach_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS cocard_manajer_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS cocard_official_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS daftar_peserta_prestasi_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS desain_kaos_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS kop_surat_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS pamflet_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS proposal_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS surat_izin_keramaian_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS surat_izin_satgas_covid_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS surat_permohonan_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS surat_permohonan_ipk_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS surat_rekomendasi_pengelola_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS ttd_ketua_url VARCHAR(500);
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS ttd_sekretaris_url VARCHAR(500);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournaments_grade ON tournaments(grade_kejuaraan);
CREATE INDEX IF NOT EXISTS idx_tournaments_kota ON tournaments(kota_kejuaraan);
CREATE INDEX IF NOT EXISTS idx_tournaments_status_pendaftaran ON tournaments(status_pendaftaran);
CREATE INDEX IF NOT EXISTS idx_tournaments_tanggal_buka ON tournaments(tanggal_buka_pendaftaran);
CREATE INDEX IF NOT EXISTS idx_tournaments_tanggal_tutup ON tournaments(tanggal_tutup_pendaftaran);
