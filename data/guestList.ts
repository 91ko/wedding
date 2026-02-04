/**
 * 하객 명단 데이터
 * 번호, 측, 관계, 이름/그룹, 인원, 참석 여부, 비고, 개별 이름들
 */

export interface GuestRow {
  id: string;
  number: number;
  side: string; // 신랑 측 | 신부 측
  relation: string; // 가족 | 친구 | 친척 | 회사 | 부모님 하객 등
  nameGroup: string;
  headcount: number | "";
  attendance: string; // O | X | ""
  notes: string;
  /** 개별 하객 이름 (여러 칸) */
  guests: string[];
}

export interface GuestListData {
  rows: GuestRow[];
  updatedAt?: string;
}

const GUEST_SLOTS = 12; // 행당 이름 칸 개수

function makeId(n: number): string {
  return `guest-row-${n}`;
}

export const initialGuestRows: GuestRow[] = [
  {
    id: makeId(1),
    number: 1,
    side: "신랑 측",
    relation: "가족",
    nameGroup: "직계 가족",
    headcount: 5,
    attendance: "O",
    notes: "어머님, 아버님 포함 / 가족 식대는 어떻게 되는건지",
    guests: ["아버님", "어머님", "형", "형수님", "은성", "", "", "", "", "", "", ""],
  },
  {
    id: makeId(2),
    number: 2,
    side: "신부 측",
    relation: "가족",
    nameGroup: "직계 가족",
    headcount: 4,
    attendance: "O",
    notes: "어머님, 아버님 포함",
    guests: ["아버님", "어머님", "언니", "형부", "예준(3-4세)", "", "", "", "", "", "", ""],
  },
  {
    id: makeId(3),
    number: 3,
    side: "신랑 측",
    relation: "친구",
    nameGroup: "양동친구",
    headcount: 22,
    attendance: "O",
    notes: "20~23명 예상",
    guests: ["시훈", "민창", "경석", "상협", "승철", "홍건", "태형(미정)", "강빈", "홍규", "윤우", "성훈", ""],
  },
  {
    id: makeId(4),
    number: 4,
    side: "신랑 측",
    relation: "친구",
    nameGroup: "고등학교 4인방",
    headcount: 8,
    attendance: "O",
    notes: "해원이오빠네 인원수 확실 X",
    guests: ["현진", "해원", "성광", "영영", "지은", "하영(출산일정 확인)", "정현", "지연", "와이프", "여친", "은별", ""],
  },
  {
    id: makeId(5),
    number: 5,
    side: "신랑 측",
    relation: "친구",
    nameGroup: "고등학교",
    headcount: 0,
    attendance: "",
    notes: "",
    guests: ["지현", "언니", "나라", "윤서", "도경", "애기", "", "", "", "", "", ""],
  },
  {
    id: makeId(6),
    number: 6,
    side: "신랑 측",
    relation: "친구",
    nameGroup: "언니 두명",
    headcount: 0,
    attendance: "",
    notes: "",
    guests: ["명지", "정주", "", "", "", "", "", "", "", "", "", ""],
  },
  {
    id: makeId(7),
    number: 7,
    side: "신랑 측",
    relation: "친구",
    nameGroup: "기타",
    headcount: 0,
    attendance: "O",
    notes: "",
    guests: ["", "", "", "", "", "", "", "", "", "", "", ""],
  },
  { id: makeId(8), number: 8, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(9), number: 9, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(10), number: 10, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(11), number: 11, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(12), number: 12, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(13), number: 13, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(14), number: 14, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(15), number: 15, side: "신부 측", relation: "친척", nameGroup: "", headcount: 0, attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(16), number: 16, side: "신부 측", relation: "친척", nameGroup: "", headcount: 0, attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  {
    id: makeId(17),
    number: 17,
    side: "신부 측",
    relation: "친구",
    nameGroup: "중학교",
    headcount: 8,
    attendance: "O",
    notes: "주현 2",
    guests: ["명규", "민수", "도호", "승민", "재만 2", "명훈(미정)", "", "", "", "", "", ""],
  },
  {
    id: makeId(18),
    number: 18,
    side: "신부 측",
    relation: "친구",
    nameGroup: "고등학교",
    headcount: 0,
    attendance: "",
    notes: "",
    guests: ["채은", "지현", "정연 2", "하영 2", "수빈", "유리(미정)", "", "", "", "", "", ""],
  },
  {
    id: makeId(19),
    number: 19,
    side: "신부 측",
    relation: "친구",
    nameGroup: "대전 회사",
    headcount: 4,
    attendance: "",
    notes: "미정",
    guests: ["도영", "효경", "강부장님", "시현과장님", "", "", "", "", "", "", "", ""],
  },
  { id: makeId(20), number: 20, side: "신부 측", relation: "친구", nameGroup: "기타", headcount: 0, attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(21), number: 21, side: "신부 측", relation: "회사", nameGroup: "", headcount: 0, attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(22), number: 22, side: "신부 측", relation: "부모님 하객", nameGroup: "", headcount: 0, attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(23), number: 23, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(24), number: 24, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(25), number: 25, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(26), number: 26, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(27), number: 27, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(28), number: 28, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
  { id: makeId(29), number: 29, side: "", relation: "", nameGroup: "", headcount: "", attendance: "", notes: "", guests: Array(GUEST_SLOTS).fill("") },
];

export const GUEST_SLOTS_PER_ROW = GUEST_SLOTS;
