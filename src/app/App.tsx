import { useEffect, useMemo, useState } from 'react';
import { format, isSameMonth, parseISO } from 'date-fns';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Separator } from './components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import type { Soldier, TutuongRating, VisitRecord, VisitStatus } from './types';

type EnrichedVisit = VisitRecord & {
  soldier?: Soldier;
  startDate: Date;
  endDate?: Date;
};

const soldierRoster: Soldier[] = [
  {
    id: 1,
    hovaten: 'Nguyễn Văn An',
    capbac: 'Đại úy',
    chucvu: 'Chính trị viên',
    donvi: 'Tiểu đoàn 1',
    trangthaiTutuong: 'Tốt',
    queQuan: 'Nam Định',
    sdtGiaDinh: '0912 123 456',
    ghiChu: 'Gia đình ở xa, ưu tiên bố trí khu A',
  },
  {
    id: 2,
    hovaten: 'Trần Minh Quang',
    capbac: 'Thượng úy',
    chucvu: 'Đại đội trưởng',
    donvi: 'Tiểu đoàn 3',
    trangthaiTutuong: 'Khá',
    queQuan: 'Quảng Ninh',
    sdtGiaDinh: '0987 654 321',
  },
  {
    id: 3,
    hovaten: 'Lê Thị Hương',
    capbac: 'Trung úy',
    chucvu: 'Trợ lý hậu cần',
    donvi: 'Phòng Hậu cần',
    trangthaiTutuong: 'Tốt',
    queQuan: 'Nghệ An',
    sdtGiaDinh: '0903 777 888',
  },
  {
    id: 4,
    hovaten: 'Phạm Văn Dũng',
    capbac: 'Đại tá',
    chucvu: 'Chỉ huy trưởng',
    donvi: 'Bộ chỉ huy',
    trangthaiTutuong: 'Trung bình',
    queQuan: 'Hà Nội',
    sdtGiaDinh: '0906 111 222',
    ghiChu: 'Yêu cầu báo cáo trước 24h khi tiếp đón',
  },
];

const visitSeed: VisitRecord[] = [
  {
    id: 'DK-2025-001',
    quannhanId: 1,
    hotenNguoitham: 'Trần Thu Trang',
    moiQuanHe: 'Vợ',
    soDienThoai: '0912 222 888',
    thoiGianBatDau: '2025-01-05T07:30:00+07:00',
    thoiGianKetThuc: '2025-01-05T16:30:00+07:00',
    trangThai: 'Đang thăm',
    tuNgay: '2025-01-05',
    denNgay: '2025-01-05',
    ghiChu: 'Yêu cầu phòng yên tĩnh, có khu vực cho trẻ nhỏ',
  },
  {
    id: 'DK-2025-002',
    quannhanId: 2,
    hotenNguoitham: 'Nguyễn Văn Bình',
    moiQuanHe: 'Cha',
    soDienThoai: '0904 555 222',
    thoiGianBatDau: '2025-01-06T09:00:00+07:00',
    thoiGianKetThuc: '2025-01-06T18:00:00+07:00',
    trangThai: 'Đang thăm',
    tuNgay: '2025-01-06',
    denNgay: '2025-01-06',
    ghiChu: 'Di chuyển bằng xe đơn vị, hỗ trợ dẫn đường',
  },
  {
    id: 'DK-2025-003',
    quannhanId: 3,
    hotenNguoitham: 'Lê Văn Hùng',
    moiQuanHe: 'Anh trai',
    soDienThoai: '0974 888 333',
    thoiGianBatDau: '2025-01-02T14:00:00+07:00',
    thoiGianKetThuc: '2025-01-02T20:00:00+07:00',
    trangThai: 'Đã về đơn vị',
    tuNgay: '2025-01-02',
    denNgay: '2025-01-02',
    ghiChu: 'Đã hoàn thành, không phát sinh sự cố',
  },
  {
    id: 'DK-2025-004',
    quannhanId: 4,
    hotenNguoitham: 'Phạm Thị Mai',
    moiQuanHe: 'Vợ',
    soDienThoai: '0911 333 444',
    thoiGianBatDau: '2025-01-08T08:00:00+07:00',
    thoiGianKetThuc: '2025-01-08T17:30:00+07:00',
    trangThai: 'Đang thăm',
    tuNgay: '2025-01-08',
    denNgay: '2025-01-08',
    ghiChu: 'Có lãnh đạo dự, chuẩn bị phòng tiếp khách',
  },
  {
    id: 'DK-2025-005',
    quannhanId: 1,
    hotenNguoitham: 'Nguyễn Văn Hải',
    moiQuanHe: 'Em trai',
    soDienThoai: '0905 777 999',
    thoiGianBatDau: '2025-01-12T13:00:00+07:00',
    thoiGianKetThuc: '2025-01-12T19:00:00+07:00',
    trangThai: 'Đã về đơn vị',
    tuNgay: '2025-01-12',
    denNgay: '2025-01-12',
    ghiChu: 'Tham gia bữa ăn tại nhà khách',
  },
];

const statusBadge: Record<VisitStatus, string> = {
  'Đang thăm': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Đã về đơn vị': 'bg-blue-50 text-blue-700 border border-blue-200',
};

const mindsetBadge: Record<TutuongRating, string> = {
  Tốt: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Khá: 'bg-sky-50 text-sky-700 border border-sky-200',
  'Trung bình': 'bg-amber-50 text-amber-700 border border-amber-200',
  Yếu: 'bg-rose-50 text-rose-700 border border-rose-200',
};

export default function App() {
  const [visits, setVisits] = useState<VisitRecord[]>(visitSeed);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VisitStatus>('all');
  const [unitFilter, setUnitFilter] = useState<'all' | string>('all');
  const [mindsetFilter, setMindsetFilter] = useState<'all' | TutuongRating>('all');
  const [monthFilter, setMonthFilter] = useState<'all' | 'this' | 'next'>('all');
  const [selectedVisitId, setSelectedVisitId] = useState<string>(visitSeed[0]?.id ?? '');

  const soldierLookup = useMemo(() => {
    const map = new Map<number, Soldier>();
    soldierRoster.forEach((soldier) => map.set(soldier.id, soldier));
    return map;
  }, []);

  const enrichedVisits = useMemo<EnrichedVisit[]>(
    () =>
      visits.map((visit) => ({
        ...visit,
        soldier: soldierLookup.get(visit.quannhanId),
        startDate: parseISO(visit.thoiGianBatDau),
        endDate: visit.thoiGianKetThuc ? parseISO(visit.thoiGianKetThuc) : undefined,
      })),
    [soldierLookup, visits],
  );

  const filteredVisits = useMemo(() => {
    const now = new Date();
    return enrichedVisits.filter((visit) => {
      if (statusFilter !== 'all' && visit.trangThai !== statusFilter) return false;
      if (unitFilter !== 'all' && visit.soldier?.donvi !== unitFilter) return false;
      if (mindsetFilter !== 'all' && visit.soldier?.trangthaiTutuong !== mindsetFilter)
        return false;

      if (monthFilter !== 'all') {
        const visitMonth = visit.startDate;
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        if (
          (monthFilter === 'this' && !isSameMonth(visitMonth, thisMonth)) ||
          (monthFilter === 'next' && !isSameMonth(visitMonth, nextMonth))
        ) {
          return false;
        }
      }

      const haystack = `${visit.soldier?.hovaten ?? ''} ${visit.hotenNguoitham} ${
        visit.soldier?.donvi ?? ''
      } ${visit.moiQuanHe}`.toLowerCase();
      return haystack.includes(search.trim().toLowerCase());
    });
  }, [enrichedVisits, mindsetFilter, monthFilter, search, statusFilter, unitFilter]);

  useEffect(() => {
    if (!filteredVisits.some((visit) => visit.id === selectedVisitId) && filteredVisits[0]) {
      setSelectedVisitId(filteredVisits[0].id);
    }
  }, [filteredVisits, selectedVisitId]);

  const selectedVisit =
    filteredVisits.find((visit) => visit.id === selectedVisitId) ?? filteredVisits[0];

  const totalToday = enrichedVisits.filter(
    (visit) =>
      visit.startDate.toDateString() === new Date().toDateString() &&
      visit.trangThai === 'Đang thăm',
  ).length;

  const unitOptions = Array.from(
    new Set(soldierRoster.map((soldier) => soldier.donvi).filter(Boolean)),
  ) as string[];

  const handleStatusChange = (visitId: string, status: VisitStatus) => {
    setVisits((prev) =>
      prev.map((visit) => (visit.id === visitId ? { ...visit, trangThai: status } : visit)),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-white text-slate-900">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.1),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.12),transparent_25%),radial-gradient(circle_at_40%_60%,rgba(6,182,212,0.12),transparent_30%)]" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="flex flex-col gap-4 rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-indigo-600">Nhà khách Quân nhân</p>
            <h1 className="mt-1 text-3xl font-bold leading-tight text-slate-900">
              Quản lý đăng ký thăm nhà khách
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Theo dõi thông tin quân nhân, lượt đăng ký, trạng thái tư tưởng và điều phối lịch thăm
              trong tháng.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
              Xuất danh sách
            </Button>
            <Button className="bg-indigo-500 text-white shadow-sm hover:bg-indigo-500/90">
              Đăng ký mới
            </Button>
          </div>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardDescription className="text-slate-500">Tổng lượt trong tháng</CardDescription>
              <CardTitle className="text-3xl text-slate-900">{enrichedVisits.length}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Bao gồm tất cả các lượt đăng ký đã ghi nhận.
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardDescription className="text-slate-500">Đang thăm</CardDescription>
              <CardTitle className="text-3xl text-slate-900">
                {enrichedVisits.filter((visit) => visit.trangThai === 'Đang thăm').length}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Hiện diện tại nhà khách, cần giám sát tiến độ.
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardDescription className="text-slate-500">Hoàn thành</CardDescription>
              <CardTitle className="text-3xl text-slate-900">
                {enrichedVisits.filter((visit) => visit.trangThai === 'Đã về đơn vị').length}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Đã kết thúc, lưu trữ đầy đủ ghi chú và đánh giá.
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardDescription className="text-slate-500">Đang đón trong ngày</CardDescription>
              <CardTitle className="text-3xl text-slate-900">{totalToday}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Lượt có mặt trong ngày hôm nay để chủ động điều phối.
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardDescription className="text-slate-500">Bộ lọc thông tin</CardDescription>
              <CardTitle className="text-xl text-slate-900">Thu hẹp danh sách đăng ký</CardTitle>
            </div>
            <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm tên quân nhân, người thăm, đơn vị..."
                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-500"
              />
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as VisitStatus | 'all')}
              >
                <SelectTrigger className="border-slate-200 bg-white text-slate-900">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white text-slate-900">
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Đang thăm">Đang thăm</SelectItem>
                  <SelectItem value="Đã về đơn vị">Đã về đơn vị</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={unitFilter}
                onValueChange={(value) => setUnitFilter(value as 'all' | string)}
              >
                <SelectTrigger className="border-slate-200 bg-white text-slate-900">
                  <SelectValue placeholder="Đơn vị" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white text-slate-900">
                  <SelectItem value="all">Tất cả đơn vị</SelectItem>
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={mindsetFilter}
                onValueChange={(value) => setMindsetFilter(value as TutuongRating | 'all')}
              >
                <SelectTrigger className="border-slate-200 bg-white text-slate-900">
                  <SelectValue placeholder="Tư tưởng" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white text-slate-900">
                  <SelectItem value="all">Tất cả tư tưởng</SelectItem>
                  <SelectItem value="Tốt">Tốt</SelectItem>
                  <SelectItem value="Khá">Khá</SelectItem>
                  <SelectItem value="Trung bình">Trung bình</SelectItem>
                  <SelectItem value="Yếu">Yếu</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={monthFilter}
                onValueChange={(value) => setMonthFilter(value as 'all' | 'this' | 'next')}
              >
                <SelectTrigger className="border-slate-200 bg-white text-slate-900">
                  <SelectValue placeholder="Thời gian" />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white text-slate-900">
                  <SelectItem value="all">Mọi thời gian</SelectItem>
                  <SelectItem value="this">Trong tháng này</SelectItem>
                  <SelectItem value="next">Tháng tiếp theo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
            <CardHeader>
              <CardDescription className="text-slate-500">
                Danh sách đăng ký thăm nhà khách
              </CardDescription>
              <CardTitle className="text-xl text-slate-900">Theo dõi và cập nhật trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">
              <div className="space-y-3 md:hidden">
                {filteredVisits.map((visit) => (
                  <button
                    key={visit.id}
                    onClick={() => setSelectedVisitId(visit.id)}
                    className={`w-full rounded-xl border p-3 text-left transition hover:shadow-sm ${
                      visit.id === selectedVisitId ? 'border-indigo-200 bg-indigo-50/70' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{visit.soldier?.hovaten}</p>
                        <p className="text-xs text-slate-500">{visit.soldier?.capbac} · {visit.soldier?.donvi}</p>
                      </div>
                      <Badge className={statusBadge[visit.trangThai]}>{visit.trangThai}</Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <p className="font-medium text-slate-800">{visit.hotenNguoitham}</p>
                      <p className="text-right">{visit.moiQuanHe}</p>
                      <p>{format(visit.startDate, 'dd/MM/yyyy')}</p>
                      <p className="text-right">
                        {format(visit.startDate, 'HH:mm')} - {visit.endDate ? format(visit.endDate, 'HH:mm') : '...'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <Table className="hidden md:table">
                <TableHeader className="border-slate-200 text-slate-500">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Mã</TableHead>
                    <TableHead>Quân nhân</TableHead>
                    <TableHead>Người thăm</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Tư tưởng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-200">
                  {filteredVisits.map((visit) => (
                    <TableRow
                      key={visit.id}
                      className={`cursor-pointer transition hover:bg-slate-50 ${
                        visit.id === selectedVisitId ? 'bg-indigo-50/70' : ''
                      }`}
                      onClick={() => setSelectedVisitId(visit.id)}
                    >
                      <TableCell className="font-mono text-xs text-slate-600">{visit.id}</TableCell>
                      <TableCell className="space-y-1">
                        <div className="font-semibold text-slate-900">{visit.soldier?.hovaten}</div>
                        <p className="text-xs text-slate-500">
                          {visit.soldier?.capbac} · {visit.soldier?.donvi}
                        </p>
                      </TableCell>
                      <TableCell className="space-y-1">
                        <div className="text-slate-900">{visit.hotenNguoitham}</div>
                        <p className="text-xs text-slate-500">
                          {visit.moiQuanHe} · {visit.soDienThoai}
                        </p>
                      </TableCell>
                      <TableCell className="space-y-1 text-sm text-slate-800">
                        <div>{format(visit.startDate, 'dd/MM/yyyy')}</div>
                        <p className="text-xs text-slate-500">
                          {format(visit.startDate, 'HH:mm')} -{' '}
                          {visit.endDate ? format(visit.endDate, 'HH:mm') : '...'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusBadge[visit.trangThai]}>{visit.trangThai}</Badge>
                      </TableCell>
                      <TableCell>
                        {visit.soldier?.trangthaiTutuong ? (
                          <Badge className={mindsetBadge[visit.soldier.trangthaiTutuong]}>
                            {visit.soldier.trangthaiTutuong}
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-700 border border-slate-200">Chưa cập nhật</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredVisits.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">
                  Không có lượt thăm nào khớp bộ lọc đã chọn.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardDescription className="text-slate-500">Thông tin chi tiết</CardDescription>
                <CardTitle className="text-xl text-slate-900">Lượt thăm được chọn</CardTitle>
              </CardHeader>
              {selectedVisit ? (
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Quân nhân</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {selectedVisit.soldier?.hovaten}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedVisit.soldier?.capbac} · {selectedVisit.soldier?.chucvu}
                      </p>
                    </div>
                    <Badge className={statusBadge[selectedVisit.trangThai]}>
                      {selectedVisit.trangThai}
                    </Badge>
                  </div>
                  <Separator className="bg-slate-200" />
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                    <div>
                      <p className="text-xs text-slate-500">Đơn vị</p>
                      <p className="text-slate-900">{selectedVisit.soldier?.donvi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Thời gian</p>
                      <p className="text-slate-900">
                        {format(selectedVisit.startDate, 'dd/MM/yyyy')} ·{' '}
                        {format(selectedVisit.startDate, 'HH:mm')} -{' '}
                        {selectedVisit.endDate ? format(selectedVisit.endDate, 'HH:mm') : '...'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Người thăm</p>
                      <p className="text-slate-900">{selectedVisit.hotenNguoitham}</p>
                      <p className="text-xs text-slate-500">
                        {selectedVisit.moiQuanHe} · {selectedVisit.soDienThoai}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Tư tưởng</p>
                      {selectedVisit.soldier?.trangthaiTutuong ? (
                        <Badge className={mindsetBadge[selectedVisit.soldier.trangthaiTutuong]}>
                          {selectedVisit.soldier.trangthaiTutuong}
                        </Badge>
                      ) : (
                        <p className="text-slate-900">Chưa cập nhật</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Ghi chú</p>
                    <p className="text-sm text-slate-700">
                      {selectedVisit.ghiChu || 'Không có ghi chú'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {selectedVisit.trangThai === 'Đang thăm' ? (
                      <Button
                        className="flex-1 bg-emerald-500 text-white shadow-sm hover:bg-emerald-500/90"
                        onClick={() => handleStatusChange(selectedVisit.id, 'Đã về đơn vị')}
                      >
                        Ghi nhận đã về
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 bg-indigo-500 text-white shadow-sm hover:bg-indigo-500/90"
                        onClick={() => handleStatusChange(selectedVisit.id, 'Đang thăm')}
                      >
                        Mở lại lượt thăm
                      </Button>
                    )}
                    <Button variant="outline" className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50">
                      In phiếu
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="text-sm text-slate-600">
                  Chọn một lượt thăm để xem chi tiết.
                </CardContent>
              )}
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardDescription className="text-slate-500">Lịch dự kiến</CardDescription>
                <CardTitle className="text-xl text-slate-900">Lượt thăm sắp diễn ra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrichedVisits
                  .filter((visit) => visit.trangThai === 'Đang thăm')
                  .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                  .slice(0, 4)
                  .map((visit) => (
                    <div
                      key={visit.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {visit.soldier?.hovaten}
                          </p>
                          <p className="text-xs text-slate-600">{visit.soldier?.donvi}</p>
                        </div>
                        <Badge className="bg-slate-100 text-slate-800 border border-slate-200">
                          {format(visit.startDate, 'dd/MM')}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-slate-700">
                        {visit.hotenNguoitham} ({visit.moiQuanHe}) ·{' '}
                        {format(visit.startDate, 'HH:mm')} -{' '}
                        {visit.endDate ? format(visit.endDate, 'HH:mm') : '...'}
                      </p>
                    </div>
                  ))}
                {enrichedVisits.filter((visit) => visit.trangThai === 'Đang thăm').length === 0 && (
                  <p className="text-sm text-slate-600">Chưa có lịch thăm trong thời gian tới.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
