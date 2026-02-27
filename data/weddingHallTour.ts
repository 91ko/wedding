/**
 * 라붐 웨딩홀 계약 정보 데이터
 */

export interface HallTourRow {
  id: string;
  category: string;
  item: string;
  /** 값 */
  groomValue?: string;
  /** 체크 완료 여부 */
  checked?: boolean;
  /** 사용자 메모 */
  userMemo?: string;
  /** 입력 타입: text | checkbox | stars */
  inputType?: "text" | "checkbox" | "stars" | "select";
}

export interface WeddingHallTourData {
  hallName: string;
  rows: HallTourRow[];
  updatedAt?: string;
  /** 데이터 버전 (계약 정보 전환 감지용) */
  dataVersion?: number;
}

/** 현재 데이터 버전 */
export const CURRENT_DATA_VERSION = 2;

// 라붐 계약 정보 (사진에서 추출 + 사용자 제공 정보)
const contractRows: Omit<HallTourRow, "id">[] = [
  // 비용 총정리
  { category: "비용", item: "대관료", groomValue: "75만원" },
  { category: "비용", item: "스드메 패키지", groomValue: "330만원" },
  { category: "비용", item: "식대 (대인)", groomValue: "47,000원" },
  { category: "비용", item: "식대 (소인)" },
  { category: "비용", item: "부가세", inputType: "checkbox" },
  { category: "비용", item: "봉사료", inputType: "checkbox" },
  { category: "비용", item: "계약금" },
  { category: "비용", item: "잔금 납부 시기" },

  // 예식 정보
  { category: "예식", item: "예식 일시" },
  { category: "예식", item: "예식홀 (단독 여부)" },
  { category: "예식", item: "예식 진행시간" },
  { category: "예식", item: "수용인원" },
  { category: "예식", item: "앞뒤 예식 간격" },

  // 스드메 포함사항
  { category: "스드메", item: "스튜디오" },
  { category: "스드메", item: "드레스" },
  { category: "스드메", item: "메이크업" },
  { category: "스드메", item: "본식스냅 포함", inputType: "checkbox" },
  { category: "스드메", item: "DVD 포함", inputType: "checkbox" },
  { category: "스드메", item: "신랑 & 신부 헤어메이크업 포함", inputType: "checkbox" },
  { category: "스드메", item: "혼주 헤어메이크업", inputType: "checkbox" },

  // 옵션/서비스
  { category: "옵션", item: "플라워샤워" },
  { category: "옵션", item: "부케/부토니아/코사지" },
  { category: "옵션", item: "포토테이블/액자" },
  { category: "옵션", item: "포토부스", inputType: "checkbox" },
  { category: "옵션", item: "웨딩컨시어지 (혼주안내/들러리)" },
  { category: "옵션", item: "사회자", inputType: "checkbox" },
  { category: "옵션", item: "연출비 (스크린/음향/조명)" },
  { category: "옵션", item: "식전영상" },
  { category: "옵션", item: "입/퇴장곡" },

  // 식사
  { category: "식사", item: "보증인원" },
  { category: "식사", item: "보증인원 변경 가능 시점" },
  { category: "식사", item: "보증인원 합산 여부", inputType: "checkbox", userMemo: "신랑신부 각각 보증인원인지 확인" },
  { category: "식사", item: "식대 결제방법" },
  { category: "식사", item: "주류/음료 포함", inputType: "checkbox" },
  { category: "식사", item: "피로연장 (단독 여부)" },
  { category: "식사", item: "식사 가능시간" },
  { category: "식사", item: "혼주메뉴/혼주석" },
  { category: "식사", item: "보증 미달 시 추가비용" },
  { category: "식사", item: "인원초과 시 추가비용" },

  // 환불/변경
  { category: "환불/변경", item: "무료환불 기간" },
  { category: "환불/변경", item: "날짜 변경 위약금" },
  { category: "환불/변경", item: "취소 위약금" },
  { category: "환불/변경", item: "천재지변 처리방식" },

  // 기타
  { category: "기타", item: "주차 (대수/무료시간)" },
  { category: "기타", item: "신랑신부 주차 지원", inputType: "checkbox" },
  { category: "기타", item: "혼주 차량 등록", inputType: "checkbox" },
  { category: "기타", item: "담당자 연락처" },
  { category: "기타", item: "신부 대기실 화장실", inputType: "checkbox" },
  { category: "기타", item: "혼주 대기공간", inputType: "checkbox" },
];

export function createInitialHallTourRows(): HallTourRow[] {
  return contractRows.map((row, index) => ({
    ...row,
    id: `contract-${index}-${row.category}-${row.item.slice(0, 5)}`,
  }));
}
