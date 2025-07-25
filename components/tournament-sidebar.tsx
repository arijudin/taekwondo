"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Trophy,
  FileText,
  Users,
  User,
  Calendar,
  DollarSign,
  Settings,
  Target,
  Clock,
  Layers,
  UserCheck,
  UserPlus,
  Briefcase,
  Shield,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Medal,
  Clipboard,
  Layout,
  Map,
  UserX,
  PenTool,
  Database,
  ArrowLeft,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInput,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface TournamentSidebarProps {
  tournamentId: number
  tournamentName: string
}

export function TournamentSidebar({ tournamentId, tournamentName }: TournamentSidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState("")

  // Helper function to create tournament-specific links
  const tournamentLink = (path: string) => `/tournament/${tournamentId}${path}`

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-lg font-semibold truncate">{tournamentName}</h2>
        </div>
        <div className="px-4 py-2">
          <SidebarInput placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link href={tournamentLink("")}>
                    <Trophy className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Kejuaraan Menu */}
        <SidebarGroup>
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Kejuaraan</span>
                </div>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Kelengkapan Kejuaraan">
                      <Link href={tournamentLink("/setup")}>
                        <Settings className="h-4 w-4" />
                        <span>Kelengkapan Kejuaraan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Penyelengara">
                      <Link href={tournamentLink("/organizer")}>
                        <Users className="h-4 w-4" />
                        <span>Penyelengara</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Penanggung Jawab">
                      <Link href={tournamentLink("/responsible")}>
                        <User className="h-4 w-4" />
                        <span>Penanggung Jawab</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Ketua Panitia">
                      <Link href={tournamentLink("/chairman")}>
                        <UserCheck className="h-4 w-4" />
                        <span>Ketua Panitia</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Wasit">
                      <Link href={tournamentLink("/referee")}>
                        <Shield className="h-4 w-4" />
                        <span>Wasit</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Bendahara">
                      <Link href={tournamentLink("/treasurer")}>
                        <DollarSign className="h-4 w-4" />
                        <span>Bendahara</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Admin Kejuaraan">
                      <Link href={tournamentLink("/admin")}>
                        <Database className="h-4 w-4" />
                        <span>Admin Kejuaraan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Biaya">
                      <Link href={tournamentLink("/fees")}>
                        <DollarSign className="h-4 w-4" />
                        <span>Biaya</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Acara">
                      <Link href={tournamentLink("/events")}>
                        <Calendar className="h-4 w-4" />
                        <span>Acara</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Antrian">
                      <Link href={tournamentLink("/queue")}>
                        <Clock className="h-4 w-4" />
                        <span>Antrian</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Kelas Umur">
                      <Link href={tournamentLink("/age-classes")}>
                        <Layers className="h-4 w-4" />
                        <span>Kelas Umur</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Kelas Kejuaraan">
                      <Link href={tournamentLink("/tournament-classes")}>
                        <Target className="h-4 w-4" />
                        <span>Kelas Kejuaraan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Pengaturan Pertandingan">
                      <Link href={tournamentLink("/match-settings")}>
                        <Settings className="h-4 w-4" />
                        <span>Pengaturan Pertandingan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Antrian Pertandingan">
                      <Link href={tournamentLink("/match-queue")}>
                        <Clock className="h-4 w-4" />
                        <span>Antrian Pertandingan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Data Rekap Kejuaraan Menu */}
        <SidebarGroup>
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Data Rekap Kejuaraan</span>
                </div>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Team Submenu */}
                  <SidebarMenuItem>
                    <Collapsible className="group/collapsible w-full">
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          <span>Team</span>
                        </div>
                        <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={tournamentLink("/teams/all")}>Semua Team</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={tournamentLink("/teams/recap")}>Rekap Team</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={tournamentLink("/teams/registration-status")}>
                                Status Registrasi Kelas Team
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={tournamentLink("/teams/managers")}>Manager</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>

                  {/* Peserta Submenu */}
                  <SidebarMenuItem>
                    <Collapsible className="group/collapsible w-full">
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Peserta</span>
                        </div>
                        <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={tournamentLink("/participants/all")}>Semua Peserta</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={tournamentLink("/participants/recap")}>Rekap Peserta</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={tournamentLink("/participants/individual")}>Rekap Peserta Individu</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={tournamentLink("/participants/pair")}>Rekap Peserta Pair</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={tournamentLink("/participants/team")}>Rekap Peserta Beregu</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={tournamentLink("/participants/freestyle-individual")}>
                                Rekap Free Style Individu
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={tournamentLink("/participants/freestyle-pair")}>Rekap Free Style Pair</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link href={tournamentLink("/participants/freestyle-team")}>Rekap Free Style Beregu</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* BPJS Menu */}
        <SidebarGroup>
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>BPJS</span>
                </div>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Peserta Individu">
                      <Link href={tournamentLink("/bpjs/individual")}>
                        <User className="h-4 w-4" />
                        <span>Peserta Individu</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Peserta Pair">
                      <Link href={tournamentLink("/bpjs/pair")}>
                        <Users className="h-4 w-4" />
                        <span>Peserta Pair</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Peserta Beregu">
                      <Link href={tournamentLink("/bpjs/team")}>
                        <Users className="h-4 w-4" />
                        <span>Peserta Beregu</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Peserta Individu Freestyle">
                      <Link href={tournamentLink("/bpjs/freestyle-individual")}>
                        <User className="h-4 w-4" />
                        <span>Peserta Individu Freestyle</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Peserta Pair Freestyle">
                      <Link href={tournamentLink("/bpjs/freestyle-pair")}>
                        <Users className="h-4 w-4" />
                        <span>Peserta Pair Freestyle</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Peserta Beregu Freestyle">
                      <Link href={tournamentLink("/bpjs/freestyle-team")}>
                        <Users className="h-4 w-4" />
                        <span>Peserta Beregu Freestyle</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Kelas Kejuaraan Menu */}
        <SidebarGroup>
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  <span>Kelas Kejuaraan</span>
                </div>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Rekap Kelas Kejuaraan">
                      <Link href={tournamentLink("/classes/recap")}>
                        <FileText className="h-4 w-4" />
                        <span>Rekap Kelas Kejuaraan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Rekap Kelas Kejuaraan Pair">
                      <Link href={tournamentLink("/classes/pair-recap")}>
                        <FileText className="h-4 w-4" />
                        <span>Rekap Kelas Kejuaraan Pair</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Rekap Kelas Kejuaraan Beregu">
                      <Link href={tournamentLink("/classes/team-recap")}>
                        <FileText className="h-4 w-4" />
                        <span>Rekap Kelas Kejuaraan Beregu</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Rekap Kelas Kejuaraan Freestyle">
                      <Link href={tournamentLink("/classes/freestyle-recap")}>
                        <FileText className="h-4 w-4" />
                        <span>Rekap Kelas Kejuaraan Freestyle</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Rekap Freestyle Pair">
                      <Link href={tournamentLink("/classes/freestyle-pair-recap")}>
                        <FileText className="h-4 w-4" />
                        <span>Rekap Freestyle Pair</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Rekap Freestyle Beregu">
                      <Link href={tournamentLink("/classes/freestyle-team-recap")}>
                        <FileText className="h-4 w-4" />
                        <span>Rekap Freestyle Beregu</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Cocard Menu */}
        <SidebarGroup>
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Clipboard className="mr-2 h-4 w-4" />
                  <span>Cocard</span>
                </div>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Official">
                      <Link href={tournamentLink("/cocard/official")}>
                        <Shield className="h-4 w-4" />
                        <span>Official</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Manager">
                      <Link href={tournamentLink("/cocard/manager")}>
                        <Briefcase className="h-4 w-4" />
                        <span>Manager</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Coach">
                      <Link href={tournamentLink("/cocard/coach")}>
                        <UserCheck className="h-4 w-4" />
                        <span>Coach</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Atlet">
                      <Link href={tournamentLink("/cocard/athlete")}>
                        <User className="h-4 w-4" />
                        <span>Atlet</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Bagan dan Drawing Menu */}
        <SidebarGroup>
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Layout className="mr-2 h-4 w-4" />
                  <span>Bagan dan Drawing</span>
                </div>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Hari">
                      <Link href={tournamentLink("/brackets/day")}>
                        <Calendar className="h-4 w-4" />
                        <span>Hari</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Lapangan">
                      <Link href={tournamentLink("/brackets/court")}>
                        <Map className="h-4 w-4" />
                        <span>Lapangan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Jumlah Kelas Atlet">
                      <Link href={tournamentLink("/brackets/athlete-classes")}>
                        <Layers className="h-4 w-4" />
                        <span>Jumlah Kelas Atlet</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Pindah Kelas Atlet">
                      <Link href={tournamentLink("/brackets/change-class")}>
                        <UserPlus className="h-4 w-4" />
                        <span>Pindah Kelas Atlet</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Atlet Tanpa Lawan">
                      <Link href={tournamentLink("/brackets/no-opponent")}>
                        <UserX className="h-4 w-4" />
                        <span>Atlet Tanpa Lawan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Kelola Bagan">
                      <Link href={tournamentLink("/brackets/manage")}>
                        <Settings className="h-4 w-4" />
                        <span>Kelola Bagan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Atlet Bahan">
                      <Link href={tournamentLink("/brackets/athlete-materials")}>
                        <User className="h-4 w-4" />
                        <span>Atlet Bahan</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Hasil Kejuaraan Menu */}
        <SidebarGroup>
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Hasil Kejuaraan</span>
                </div>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Pengaturan Piagam">
                      <Link href={tournamentLink("/results/certificate-settings")}>
                        <FileText className="h-4 w-4" />
                        <span>Pengaturan Piagam</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Hasil Pertandingan Kelas">
                      <Link href={tournamentLink("/results/class-results")}>
                        <BarChart3 className="h-4 w-4" />
                        <span>Hasil Pertandingan Kelas</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Hasil Pertandingan Tim">
                      <Link href={tournamentLink("/results/team-results")}>
                        <BarChart3 className="h-4 w-4" />
                        <span>Hasil Pertandingan Tim</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Daftar Atlet Juara">
                      <Link href={tournamentLink("/results/champion-athletes")}>
                        <Medal className="h-4 w-4" />
                        <span>Daftar Atlet Juara</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Operator Menu */}
        <SidebarGroup>
          <Collapsible className="group/collapsible">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Operator</span>
                </div>
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Manajemen Operator">
                      <Link href={tournamentLink("/operators/manage")}>
                        <Users className="h-4 w-4" />
                        <span>Manajemen Operator</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Penetuan Juara Partai">
                      <Link href={tournamentLink("/operators/champions")}>
                        <Trophy className="h-4 w-4" />
                        <span>Penetuan Juara Partai</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Penetuan Juara Partai (Manual)">
                      <Link href={tournamentLink("/operators/champions-manual")}>
                        <PenTool className="h-4 w-4" />
                        <span>Penetuan Juara Partai (Manual)</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2 space-y-2">
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/tournament">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Back to Tournaments</span>
            </Link>
          </Button>
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/dashboard">
              <User className="mr-2 h-4 w-4" />
              <span>Main Dashboard</span>
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
