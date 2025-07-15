// app/schedule-dashboard/mock-data.ts

export type Status = 'OK' | 'CONFLICT' | 'WARNING';

export interface CommitteeMember {
  name: string;
  role: string;
}

export interface Conflict {
  resource: string;
  status: Status;
  details: string;
}

export interface ScheduledSession {
  id: string;
  studentName: string;
  thesisTitle: string;
  advisorName: string;
  room: string;
  timeSlot: string;
  status: Status;
  committee: CommitteeMember[];
  conflicts: Conflict[];
}

export const timeSlots = [
  '08:00 - 08:45',
  '08:45 - 09:30',
  '09:30 - 10:15',
  '10:15 - 11:00',
];

export const rooms = ['Phòng A.101', 'Phòng B.203', 'Phòng C.405'];

export const scheduledSessions: ScheduledSession[] = [
  {
    id: 'session1',
    studentName: 'Trần Văn C',
    thesisTitle: 'Xây dựng hệ thống gợi ý sản phẩm',
    advisorName: 'PGS.TS. A',
    room: 'Phòng A.101',
    timeSlot: '08:00 - 08:45',
    status: 'OK',
    committee: [
      { name: 'PGS.TS. Trần Văn B', role: 'Chủ tịch' },
      { name: 'ThS. Lê Thị C', role: 'Phản biện' },
    ],
    conflicts: [
      { resource: 'Phòng họp A.101', status: 'OK', details: 'Sẵn sàng' },
      { resource: 'PGS.TS. Trần Văn B', status: 'OK', details: 'Sẵn sàng' },
      { resource: 'ThS. Lê Thị C', status: 'OK', details: 'Sẵn sàng' },
    ],
  },
  {
    id: 'session2',
    studentName: 'Nguyễn Thị D',
    thesisTitle: 'Phân tích dữ liệu mạng xã hội',
    advisorName: 'TS. B',
    room: 'Phòng B.203',
    timeSlot: '08:00 - 08:45',
    status: 'CONFLICT',
    committee: [
      { name: 'TS. Phạm Hùng D', role: 'Chủ tịch' },
      { name: 'PGS.TS. Trần Văn B', role: 'Phản biện' },
    ],
    conflicts: [
      { resource: 'Phòng họp B.203', status: 'OK', details: 'Sẵn sàng' },
      { resource: 'TS. Phạm Hùng D', status: 'OK', details: 'Sẵn sàng' },
      {
        resource: 'PGS.TS. Trần Văn B',
        status: 'CONFLICT',
        details: 'Trùng lịch chấm tại Phòng A.101 cùng thời điểm',
      },
    ],
  },
  {
    id: 'session3',
    studentName: 'Lê Văn E',
    thesisTitle: 'Ứng dụng AI trong y tế',
    advisorName: 'ThS. C',
    room: 'Phòng A.101',
    timeSlot: '08:45 - 09:30',
    status: 'WARNING',
    committee: [
      { name: 'PGS.TS. Trần Văn B', role: 'Chủ tịch' },
      { name: 'ThS. Lê Thị C', role: 'Phản biện' },
    ],
    conflicts: [
      { resource: 'Phòng họp A.101', status: 'OK', details: 'Sẵn sàng' },
      {
        resource: 'PGS.TS. Trần Văn B',
        status: 'WARNING',
        details: 'Có lịch chấm ngay ca liền trước',
      },
      {
        resource: 'ThS. Lê Thị C',
        status: 'WARNING',
        details: 'Có lịch chấm ngay ca liền trước',
      },
    ],
  },
];
