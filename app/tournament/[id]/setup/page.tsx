"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUpload } from "@/components/ui/file-upload"
import { useGetTournamentQuery, useUpdateTournamentMutation } from "@/lib/api/tournamentApi"
import { Trophy, Users, DollarSign, Settings, MapPin, Calendar, FileText, Upload, Save, AlertCircle, CheckCircle } from 'lucide-react'

interface TournamentSetupForm {
  // Basic Information
  name: string
  grade_kejuaraan: string
  registration_fee: string
  tempat_kejuaraan: string
  lokasi_kejuaraan: string
  jumlah_peserta_prestasi: string
  jumlah_peserta_pemula: string
  
  // Dates
  start_date: string
  end_date: string
  tanggal_buka_pendaftaran: string
  tanggal_tutup_pendaftaran: string
  
  // Status
  status_pendaftaran: string
  status_pendaftaran_atlit: string
  status_kelas_atlit: string
  
  // Details
  penjelasan_kejuaraan: string
  kota_kejuaraan: string
  nomor_surat_ijin: string
  ketua: string
  sekretaris: string
  opsi_pendaftaran: string
  
  // Cocard Settings
  lebar_ukuran_cocard: string
  tinggi_ukuran_cocard: string
  
  // File URLs
  gambar_cap_url: string | null
  cocard_atlit_url: string | null
  cocard_coach_url: string | null
  cocard_manajer_url: string | null
  cocard_official_url: string | null
  daftar_peserta_prestasi_url: string | null
  desain_kaos_url: string | null
  kop_surat_url: string | null
  pamflet_url: string | null
  proposal_url: string | null
  surat_izin_keramaian_url: string | null
  surat_izin_satgas_covid_url: string | null
  surat_permohonan_url: string | null
  surat_permohonan_ipk_url: string | null
  surat_rekomendasi_pengelola_url: string | null
  ttd_ketua_url: string | null
  ttd_sekretaris_url: string | null
}

const initialFormData: TournamentSetupForm = {
  name: "",
  grade_kejuaraan: "",
  registration_fee: "",
  tempat_kejuaraan: "",
  lokasi_kejuaraan: "",
  jumlah_peserta_prestasi: "0",
  jumlah_peserta_pemula: "0",
  start_date: "",
  end_date: "",
  tanggal_buka_pendaftaran: "",
  tanggal_tutup_pendaftaran: "",
  status_pendaftaran: "closed",
  status_pendaftaran_atlit: "pending",
  status_kelas_atlit: "draft",
  penjelasan_kejuaraan: "",
  kota_kejuaraan: "",
  nomor_surat_ijin: "",
  ketua: "",
  sekretaris: "",
  opsi_pendaftaran: "",
  lebar_ukuran_cocard: "85",
  tinggi_ukuran_cocard: "54",
  gambar_cap_url: null,
  cocard_atlit_url: null,
  cocard_coach_url: null,
  cocard_manajer_url: null,
  cocard_official_url: null,
  daftar_peserta_prestasi_url: null,
  desain_kaos_url: null,
  kop_surat_url: null,
  pamflet_url: null,
  proposal_url: null,
  surat_izin_keramaian_url: null,
  surat_izin_satgas_covid_url: null,
  surat_permohonan_url: null,
  surat_permohonan_ipk_url: null,
  surat_rekomendasi_pengelola_url: null,
  ttd_ketua_url: null,
  ttd_sekretaris_url: null,
}

export default function TournamentSetupPage() {
  const params = useParams()
  const router = useRouter()
  const tournamentId = Number.parseInt(params.id as string)

  const [formData, setFormData] = useState<TournamentSetupForm>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: tournament, isLoading, error } = useGetTournamentQuery(tournamentId)
  const [updateTournament] = useUpdateTournamentMutation()

  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name || "",
        grade_kejuaraan: tournament.grade_kejuaraan || "",
        registration_fee: tournament.registration_fee?.toString() || "",
        tempat_kejuaraan: tournament.tempat_kejuaraan || "",
        lokasi_kejuaraan: tournament.lokasi_kejuaraan || "",
        jumlah_peserta_prestasi: tournament.jumlah_peserta_prestasi?.toString() || "0",
        jumlah_peserta_pemula: tournament.jumlah_peserta_pemula?.toString() || "0",
        start_date: tournament.start_date ? new Date(tournament.start_date).toISOString().split('T')[0] : "",
        end_date: tournament.end_date ? new Date(tournament.end_date).toISOString().split('T')[0] : "",
        tanggal_buka_pendaftaran: tournament.tanggal_buka_pendaftaran ? new Date(tournament.tanggal_buka_pendaftaran).toISOString().split('T')[0] : "",
        tanggal_tutup_pendaftaran: tournament.tanggal_tutup_pendaftaran ? new Date(tournament.tanggal_tutup_pendaftaran).toISOString().split('T')[0] : "",
        status_pendaftaran: tournament.status_pendaftaran || "closed",
        status_pendaftaran_atlit: tournament.status_pendaftaran_atlit || "pending",
        status_kelas_atlit: tournament.status_kelas_atlit || "draft",
        penjelasan_kejuaraan: tournament.penjelasan_kejuaraan || "",
        kota_kejuaraan: tournament.kota_kejuaraan || "",
        nomor_surat_ijin: tournament.nomor_surat_ijin || "",
        ketua: tournament.ketua || "",
        sekretaris: tournament.sekretaris || "",
        opsi_pendaftaran: tournament.opsi_pendaftaran || "",
        lebar_ukuran_cocard: tournament.lebar_ukuran_cocard?.toString() || "85",
        tinggi_ukuran_cocard: tournament.tinggi_ukuran_cocard?.toString() || "54",
        gambar_cap_url: tournament.gambar_cap_url || null,
        cocard_atlit_url: tournament.cocard_atlit_url || null,
        cocard_coach_url: tournament.cocard_coach_url || null,
        cocard_manajer_url: tournament.cocard_manajer_url || null,
        cocard_official_url: tournament.cocard_official_url || null,
        daftar_peserta_prestasi_url: tournament.daftar_peserta_prestasi_url || null,
        desain_kaos_url: tournament.desain_kaos_url || null,
        kop_surat_url: tournament.kop_surat_url || null,
        pamflet_url: tournament.pamflet_url || null,
        proposal_url: tournament.proposal_url || null,
        surat_izin_keramaian_url: tournament.surat_izin_keramaian_url || null,
        surat_izin_satgas_covid_url: tournament.surat_izin_satgas_covid_url || null,
        surat_permohonan_url: tournament.surat_permohonan_url || null,
        surat_permohonan_ipk_url: tournament.surat_permohonan_ipk_url || null,
        surat_rekomendasi_pengelola_url: tournament.surat_rekomendasi_pengelola_url || null,
        ttd_ketua_url: tournament.ttd_ketua_url || null,
        ttd_sekretaris_url: tournament.ttd_sekretaris_url || null,
      })
    }
  }, [tournament])

  const handleInputChange = (field: keyof TournamentSetupForm, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = "Nama kejuaraan wajib diisi"
    if (!formData.grade_kejuaraan.trim()) newErrors.grade_kejuaraan = "Grade kejuaraan wajib diisi"
    if (!formData.tempat_kejuaraan.trim()) newErrors.tempat_kejuaraan = "Tempat kejuaraan wajib diisi"
    if (!formData.lokasi_kejuaraan.trim()) newErrors.lokasi_kejuaraan = "Lokasi kejuaraan wajib diisi"
    if (!formData.start_date) newErrors.start_date = "Tanggal kejuaraan wajib diisi"
    if (!formData.end_date) newErrors.end_date = "Tanggal berakhir kejuaraan wajib diisi"
    if (!formData.kota_kejuaraan.trim()) newErrors.kota_kejuaraan = "Kota kejuaraan wajib diisi"
    if (!formData.ketua.trim()) newErrors.ketua = "Ketua wajib diisi"
    if (!formData.sekretaris.trim()) newErrors.sekretaris = "Sekretaris wajib diisi"

    // Date validation
    if (formData.start_date && formData.end_date) {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        newErrors.end_date = "Tanggal berakhir harus setelah tanggal mulai"
      }
    }

    if (formData.tanggal_buka_pendaftaran && formData.tanggal_tutup_pendaftaran) {
      if (new Date(formData.tanggal_tutup_pendaftaran) < new Date(formData.tanggal_buka_pendaftaran)) {
        newErrors.tanggal_tutup_pendaftaran = "Tanggal tutup pendaftaran harus setelah tanggal buka"
      }
    }

    // Number validation
    if (formData.registration_fee && isNaN(Number(formData.registration_fee))) {
      newErrors.registration_fee = "Biaya pendaftaran harus berupa angka"
    }

    if (isNaN(Number(formData.jumlah_peserta_prestasi)) || Number(formData.jumlah_peserta_prestasi) < 0) {
      newErrors.jumlah_peserta_prestasi = "Jumlah peserta prestasi harus berupa angka positif"
    }

    if (isNaN(Number(formData.jumlah_peserta_pemula)) || Number(formData.jumlah_peserta_pemula) < 0) {
      newErrors.jumlah_peserta_pemula = "Jumlah peserta pemula harus berupa angka positif"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const updateData = {
        ...formData,
        registration_fee: formData.registration_fee ? Number(formData.registration_fee) : null,
        jumlah_peserta_prestasi: Number(formData.jumlah_peserta_prestasi),
        jumlah_peserta_pemula: Number(formData.jumlah_peserta_pemula),
        lebar_ukuran_cocard: Number(formData.lebar_ukuran_cocard),
        tinggi_ukuran_cocard: Number(formData.tinggi_ukuran_cocard),
      }

      await updateTournament({
        id: tournamentId,
        data: updateData
      }).unwrap()

      // Show success message and redirect
      router.push(`/tournament/${tournamentId}`)
    } catch (error) {
      console.error("Failed to update tournament:", error)
      setErrors({ submit: "Gagal menyimpan data. Silakan coba lagi." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading tournament data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load tournament data. Please try again.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kelengkapan Kejuaraan</h1>
        <p className="text-gray-600 mt-2">Lengkapi semua informasi kejuaraan</p>
      </div>

      {errors.submit && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Informasi Dasar
            </CardTitle>
            <CardDescription>Informasi dasar tentang kejuaraan</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kejuaraan <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Masukkan nama kejuaraan"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade_kejuaraan">Grade Kejuaraan <span className="text-red-500">*</span></Label>
              <Select value={formData.grade_kejuaraan} onValueChange={(value) => handleInputChange("grade_kejuaraan", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih grade kejuaraan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nasional">Nasional</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
                  <SelectItem value="provinsi">Provinsi</SelectItem>
                  <SelectItem value="kabupaten">Kabupaten/Kota</SelectItem>
                  <SelectItem value="lokal">Lokal</SelectItem>
                </SelectContent>
              </Select>
              {errors.grade_kejuaraan && <p className="text-sm text-red-500">{errors.grade_kejuaraan}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_fee">Biaya Pendaftaran (IDR)</Label>
              <Input
                id="registration_fee"
                type="number"
                value={formData.registration_fee}
                onChange={(e) => handleInputChange("registration_fee", e.target.value)}
                placeholder="0"
              />
              {errors.registration_fee && <p className="text-sm text-red-500">{errors.registration_fee}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kota_kejuaraan">Kota Kejuaraan <span className="text-red-500">*</span></Label>
              <Input
                id="kota_kejuaraan"
                value={formData.kota_kejuaraan}
                onChange={(e) => handleInputChange("kota_kejuaraan", e.target.value)}
                placeholder="Masukkan kota kejuaraan"
              />
              {errors.kota_kejuaraan && <p className="text-sm text-red-500">{errors.kota_kejuaraan}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempat_kejuaraan">Tempat Kejuaraan <span className="text-red-500">*</span></Label>
              <Input
                id="tempat_kejuaraan"
                value={formData.tempat_kejuaraan}
                onChange={(e) => handleInputChange("tempat_kejuaraan", e.target.value)}
                placeholder="Masukkan tempat kejuaraan"
              />
              {errors.tempat_kejuaraan && <p className="text-sm text-red-500">{errors.tempat_kejuaraan}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lokasi_kejuaraan">Lokasi Kejuaraan <span className="text-red-500">*</span></Label>
              <Input
                id="lokasi_kejuaraan"
                value={formData.lokasi_kejuaraan}
                onChange={(e) => handleInputChange("lokasi_kejuaraan", e.target.value)}
                placeholder="Alamat lengkap lokasi kejuaraan"
              />
              {errors.lokasi_kejuaraan && <p className="text-sm text-red-500">{errors.lokasi_kejuaraan}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomor_surat_ijin">Nomor Surat Ijin</Label>
              <Input
                id="nomor_surat_ijin"
                value={formData.nomor_surat_ijin}
                onChange={(e) => handleInputChange("nomor_surat_ijin", e.target.value)}
                placeholder="Nomor surat ijin kejuaraan"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="penjelasan_kejuaraan">Penjelasan Kejuaraan</Label>
              <Textarea
                id="penjelasan_kejuaraan"
                value={formData.penjelasan_kejuaraan}
                onChange={(e) => handleInputChange("penjelasan_kejuaraan", e.target.value)}
                placeholder="Deskripsi lengkap tentang kejuaraan"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Peserta
            </CardTitle>
            <CardDescription>Informasi jumlah peserta</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="jumlah_peserta_prestasi">Jumlah Peserta Prestasi</Label>
              <Input
                id="jumlah_peserta_prestasi"
                type="number"
                min="0"
                value={formData.jumlah_peserta_prestasi}
                onChange={(e) => handleInputChange("jumlah_peserta_prestasi", e.target.value)}
              />
              {errors.jumlah_peserta_prestasi && <p className="text-sm text-red-500">{errors.jumlah_peserta_prestasi}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jumlah_peserta_pemula">Jumlah Peserta Pemula</Label>
              <Input
                id="jumlah_peserta_pemula"
                type="number"
                min="0"
                value={formData.jumlah_peserta_pemula}
                onChange={(e) => handleInputChange("jumlah_peserta_pemula", e.target.value)}
              />
              {errors.jumlah_peserta_pemula && <p className="text-sm text-red-500">{errors.jumlah_peserta_pemula}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tanggal Penting
            </CardTitle>
            <CardDescription>Jadwal kejuaraan dan pendaftaran</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="start_date">Tanggal Kejuaraan <span className="text-red-500">*</span></Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange("start_date", e.target.value)}
              />
              {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Tanggal Kejuaraan Berakhir <span className="text-red-500">*</span></Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
              />
              {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal_buka_pendaftaran">Tanggal Buka Pendaftaran</Label>
              <Input
                id="tanggal_buka_pendaftaran"
                type="date"
                value={formData.tanggal_buka_pendaftaran}
                onChange={(e) => handleInputChange("tanggal_buka_pendaftaran", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanggal_tutup_pendaftaran">Tanggal Tutup Pendaftaran</Label>
              <Input
                id="tanggal_tutup_pendaftaran"
                type="date"
                value={formData.tanggal_tutup_pendaftaran}
                onChange={(e) => handleInputChange("tanggal_tutup_pendaftaran", e.target.value)}
              />
              {errors.tanggal_tutup_pendaftaran && <p className="text-sm text-red-500">{errors.tanggal_tutup_pendaftaran}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Status
            </CardTitle>
            <CardDescription>Status pendaftaran dan kelas</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status_pendaftaran">Status Pendaftaran</Label>
              <Select value={formData.status_pendaftaran} onValueChange={(value) => handleInputChange("status_pendaftaran", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Buka</SelectItem>
                  <SelectItem value="closed">Tutup</SelectItem>
                  <SelectItem value="extended">Diperpanjang</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status_pendaftaran_atlit">Status Pendaftaran Atlit</Label>
              <Select value={formData.status_pendaftaran_atlit} onValueChange={(value) => handleInputChange("status_pendaftaran_atlit", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="open">Buka</SelectItem>
                  <SelectItem value="closed">Tutup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status_kelas_atlit">Status Kelas Atlit</Label>
              <Select value={formData.status_kelas_atlit} onValueChange={(value) => handleInputChange("status_kelas_atlit", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="finalized">Finalized</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Officials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pengurus
            </CardTitle>
            <CardDescription>Informasi pengurus kejuaraan</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ketua">Ketua <span className="text-red-500">*</span></Label>
              <Input
                id="ketua"
                value={formData.ketua}
                onChange={(e) => handleInputChange("ketua", e.target.value)}
                placeholder="Nama ketua kejuaraan"
              />
              {errors.ketua && <p className="text-sm text-red-500">{errors.ketua}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sekretaris">Sekretaris <span className="text-red-500">*</span></Label>
              <Input
                id="sekretaris"
                value={formData.sekretaris}
                onChange={(e) => handleInputChange("sekretaris", e.target.value)}
                placeholder="Nama sekretaris kejuaraan"
              />
              {errors.sekretaris && <p className="text-sm text-red-500">{errors.sekretaris}</p>}
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="opsi_pendaftaran">Opsi Pendaftaran</Label>
              <Textarea
                id="opsi_pendaftaran"
                value={formData.opsi_pendaftaran}
                onChange={(e) => handleInputChange("opsi_pendaftaran", e.target.value)}
                placeholder="Opsi dan ketentuan pendaftaran"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cocard Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Pengaturan Cocard
            </CardTitle>
            <CardDescription>Ukuran cocard dalam milimeter</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lebar_ukuran_cocard">Lebar Ukuran Cocard (mm)</Label>
              <Input
                id="lebar_ukuran_cocard"
                type="number"
                min="1"
                value={formData.lebar_ukuran_cocard}
                onChange={(e) => handleInputChange("lebar_ukuran_cocard", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tinggi_ukuran_cocard">Tinggi Ukuran Cocard (mm)</Label>
              <Input
                id="tinggi_ukuran_cocard"
                type="number"
                min="1"
                value={formData.tinggi_ukuran_cocard}
                onChange={(e) => handleInputChange("tinggi_ukuran_cocard", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* File Uploads - Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Gambar
            </CardTitle>
            <CardDescription>Upload file gambar yang diperlukan</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload
              label="Gambar Cap"
              value={formData.gambar_cap_url}
              onChange={(url) => handleInputChange("gambar_cap_url", url)}
              accept="image/*"
              options={{ allowedTypes: ['image/*'], maxSize: 5 * 1024 * 1024 }}
            />

            <FileUpload
              label="Cocard Atlit"
              value={formData.cocard_atlit_url}
              onChange={(url) => handleInputChange("cocard_atlit_url", url)}
              accept="image/*"
              options={{ allowedTypes: ['image/*'], maxSize: 5 * 1024 * 1024 }}
            />

            <FileUpload
              label="Cocard Coach"
              value={formData.cocard_coach_url}
              onChange={(url) => handleInputChange("cocard_coach_url", url)}
              accept="image/*"
              options={{ allowedTypes: ['image/*'], maxSize: 5 * 1024 * 1024 }}
            />

            <FileUpload
              label="Cocard Manajer"
              value={formData.cocard_manajer_url}
              onChange={(url) => handleInputChange("cocard_manajer_url", url)}
              accept="image/*"
              options={{ allowedTypes: ['image/*'], maxSize: 5 * 1024 * 1024 }}
            />

            <FileUpload
              label="Cocard Official"
              value={formData.cocard_official_url}
              onChange={(url) => handleInputChange("cocard_official_url", url)}
              accept="image/*"
              options={{ allowedTypes: ['image/*'], maxSize: 5 * 1024 * 1024 }}
            />

            <FileUpload
              label="Desain Kaos"
              value={formData.desain_kaos_url}
              onChange={(url) => handleInputChange("desain_kaos_url", url)}
              accept="image/*"
              options={{ allowedTypes: ['image/*'], maxSize: 5 * 1024 * 1024 }}
            />

            <FileUpload
              label="Kop Surat"
              value={formData.kop_surat_url}
              onChange={(url) => handleInputChange("kop_surat_url", url)}
              accept="image/*"
              options={{ allowedTypes: ['image/*'], maxSize: 5 * 1024 * 1024 }}
            />

            <FileUpload
              label="Pamflet"
              value={formData.pamflet_url}
              onChange={(url) => handleInputChange("pamflet_url", url)}
              accept="image/*"
              options={{ allowedTypes: ['image/*'], maxSize: 5 * 1024 * 1024 }}
            />

            <FileUpload
              label="TTD Ketua (PNG)"
              value={formData.ttd_ketua_url}
              onChange={(url) => handleInputChange("ttd_ketua_url", url)}
              accept=".png"
              options={{ allowedTypes: ['.png'], maxSize: 2 * 1024 * 1024 }}
            />

            <FileUpload
              label="TTD Sekretaris (PNG)"
              value={formData.ttd_sekretaris_url}
              onChange={(url) => handleInputChange("ttd_sekretaris_url", url)}
              accept=".png"
              options={{ allowedTypes: ['.png'], maxSize: 2 * 1024 * 1024 }}
            />
          </CardContent>
        </Card>

        {/* File Uploads - Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload Dokumen
            </CardTitle>
            <CardDescription>Upload file dokumen yang diperlukan (PDF)</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload
              label="Daftar Peserta Prestasi (PDF)"
              value={formData.daftar_peserta_prestasi_url}
              onChange={(url) => handleInputChange("daftar_peserta_prestasi_url", url)}
              accept=".pdf"
              options={{ allowedTypes: ['.pdf'], maxSize: 10 * 1024 * 1024 }}
            />

            <FileUpload
              label="Proposal (PDF)"
              value={formData.proposal_url}
              onChange={(url) => handleInputChange("proposal_url", url)}
              accept=".pdf"
              options={{ allowedTypes: ['.pdf'], maxSize: 10 * 1024 * 1024 }}
            />

            <FileUpload
              label="Surat Izin Keramaian (PDF)"
              value={formData.surat_izin_keramaian_url}
              onChange={(url) => handleInputChange("surat_izin_keramaian_url", url)}
              accept=".pdf"
              options={{ allowedTypes: ['.pdf'], maxSize: 10 * 1024 * 1024 }}
            />

            <FileUpload
              label="Surat Izin Satgas COVID (PDF)"
              value={formData.surat_izin_satgas_covid_url}
              onChange={(url) => handleInputChange("surat_izin_satgas_covid_url", url)}
              accept=".pdf"
              options={{ allowedTypes: ['.pdf'], maxSize: 10 * 1024 * 1024 }}
            />

            <FileUpload
              label="Surat Permohonan (PDF)"
              value={formData.surat_permohonan_url}
              onChange={(url) => handleInputChange("surat_permohonan_url", url)}
              accept=".pdf"
              options={{ allowedTypes: ['.pdf'], maxSize: 10 * 1024 * 1024 }}
            />

            <FileUpload
              label="Surat Permohonan IPK (PDF)"
              value={formData.surat_permohonan_ipk_url}
              onChange={(url) => handleInputChange("surat_permohonan_ipk_url", url)}
              accept=".pdf"
              options={{ allowedTypes: ['.pdf'], maxSize: 10 * 1024 * 1024 }}
            />

            <FileUpload
              label="Surat Rekomendasi Pengelola (PDF)"
              value={formData.surat_rekomendasi_pengelola_url}
              onChange={(url) => handleInputChange("surat_rekomendasi_pengelola_url", url)}
              accept=".pdf"
              options={{ allowedTypes: ['.pdf'], maxSize: 10 * 1024 * 1024 }}
            />
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
