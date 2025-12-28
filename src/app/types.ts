export type VisitStatus = 'Đang thăm' | 'Đã về đơn vị';

export type TutuongRating = 'Tốt' | 'Khá' | 'Trung bình' | 'Yếu';

export interface Soldier {
  id: number;
  hovaten: string;
  ngaysinh?: string;
  nhapngu?: string;
  capbac?: string;
  chucvu?: string;
  donvi?: string;
  dantoc?: string;
  tongiao?: string;
  vanhoa?: string;
  hotencha?: string;
  queQuan?: string;
  sdtGiaDinh?: string;
  ghiChu?: string;
  trangthaiTutuong?: TutuongRating;
}

export interface VisitRecord {
  id: string;
  quannhanId: number;
  hotenNguoitham: string;
  moiQuanHe: string;
  soDienThoai: string;
  thoiGianBatDau: string;
  thoiGianKetThuc?: string;
  trangThai: VisitStatus;
  tuNgay: string;
  denNgay: string;
  ghiChu?: string;
}
