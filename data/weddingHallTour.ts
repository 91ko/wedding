/**
 * 웨딩홀 투어 체크리스트 데이터
 * 한 사람이 질문하고 한 사람이 답을 체크해서 적는 용도
 * (신부가 묻고 신랑이 답 적기 추천)
 */

export interface HallTourRow {
  id: string;
  category: string; // 교통, 기타, 예식, 비용, 옵션, 식사
  item: string;
  /** 신부 입력값 (질문/메모) */
  brideValue?: string;
  /** 신랑 입력값 (답/체크) */
  groomValue?: string;
  /** 체크 완료 여부 */
  checked?: boolean;
  /** 사용자 메모 */
  userMemo?: string;
  /** 입력 타입: text | checkbox | stars | select */
  inputType?: "text" | "checkbox" | "stars" | "select";
  /** 선택지 (select용) */
  options?: string[];
}

export interface WeddingHallTourData {
  /** 웨딩홀 이름 (여러 홀 비교용) */
  hallName: string;
  /** 투어 일자 */
  tourDate?: string;
  rows: HallTourRow[];
  updatedAt?: string;
}

// 초기 행 데이터 (구분-항목 구조)
const initialRows: Omit<HallTourRow, "id">[] = [
  // 교통
  { category: "교통", item: "주차 공간(대수)" },
  { category: "교통", item: "주차정산 방법" },
  { category: "교통", item: "주차 무료시간(초과 시 얼마)" },
  { category: "교통", item: "신랑신부 주차 지원" },
  { category: "교통", item: "혼주 차량 등록 가능 여부" },
  // 기타
  { category: "기타", item: "위치" },
  { category: "기타", item: "담당자 연락처" },
  { category: "기타", item: "현금인출기" },
  { category: "기타", item: "당일계약 혜택" },
  // 예식
  { category: "예식", item: "예식홀(단독인지)" },
  { category: "예식", item: "가능한 예식날짜" },
  { category: "예식", item: "가능한 예식시간" },
  { category: "예식", item: "예식 총 진행시간" },
  { category: "예식", item: "혼주 대기 공간 여부 및 동선" },
  { category: "예식", item: "웨딩홀 수용인원 수" },
  { category: "예식", item: "앞뒤 예식 간격" },
  // 비용
  { category: "비용", item: "대관료 (비인기 시간대 할인 여부)" },
  { category: "비용", item: "신부 대기실 화장실 여부" },
  { category: "비용", item: "웨딩홀 패키지비용 (홀+스드메 or 홀+드메)" },
  { category: "비용", item: "서비스 품목 (컨시어지 or 플샤 or 추가적인 것)" },
  { category: "비용", item: "계약금/잔금 (*계약금 10-20% 환불 불가 조건 주의)" },
  { category: "비용", item: "무료환불기간/위약금" },
  { category: "비용", item: "날짜 변경에 따른 위약금 여부" },
  { category: "비용", item: "천재지변, 불가항력 위약금 처리방식" },
  // 옵션
  { category: "옵션", item: "플라워샤워 비용 (기계식 or 수동)" },
  { category: "옵션", item: "본식스냅 (홀패키지 포함여부)", inputType: "checkbox" },
  { category: "옵션", item: "DVD 추가비용" },
  { category: "옵션", item: "웨딩컨시어지 (혼주안내들러리) 비용" },
  { category: "옵션", item: "포토테이블 (액자 여부)" },
  { category: "옵션", item: "포토부스 포함여부", inputType: "checkbox" },
  { category: "옵션", item: "웨딩홀 필수옵션비용 (대형스크린연출비, 뮤지컬연출, 현악기 피아노 연주 등)" },
  { category: "옵션", item: "웨딩홀 사회자 여부", inputType: "checkbox" },
  { category: "옵션", item: "부케 부토니아 코사지" },
  { category: "옵션", item: "식전영상 재생 여부 및 비용" },
  { category: "옵션", item: "마이크/스크린 개수" },
  { category: "옵션", item: "입/퇴장곡 준비여부" },
  { category: "옵션", item: "신랑 & 신부 헤어 메이크업" },
  { category: "옵션", item: "혼주 헤어메이크업(가족)" },
  // 식사
  { category: "식사", item: "보증인원 (언제까지 변경 가능?)" },
  { category: "식사", item: "보증인원 신랑신부 합산여부 (*각각 보증인원 주의)", inputType: "checkbox" },
  { category: "식사", item: "식대 >> 할인 쇼부 보기 (대인/소인 몇 세?)" },
  { category: "식사", item: "혼주도 식권 갖고 ?" },
  { category: "식사", item: "주류 및 음료 포함", inputType: "checkbox" },
  { category: "식사", item: "부가세 여부", inputType: "checkbox" },
  { category: "식사", item: "봉사료 여부", inputType: "checkbox" },
  { category: "식사", item: "식대 결제방법 (카드, 현금 똑같은지?)" },
  { category: "식사", item: "피로연 음식 맛", inputType: "stars" },
  { category: "식사", item: "피로연장 위치 단독", inputType: "checkbox" },
  { category: "식사", item: "피로연장 수용인원수" },
  { category: "식사", item: "무료시식 인원 및 날짜" },
  { category: "식사", item: "식사 가능시간" },
  { category: "식사", item: "보증 인원 미달 시 위약금 또는 추가 비용" },
  { category: "식사", item: "인원초과 시, 몇 명까지 얼마" },
  { category: "식사", item: "혼주메뉴, 혼주석 여부" },
  { category: "식사", item: "답례품 최소 갯수 / 남은 식권 교환 가능 여부" },
];

export function createInitialHallTourRows(): HallTourRow[] {
  return initialRows.map((row, index) => ({
    ...row,
    id: `hall-row-${index}-${row.category}-${row.item.slice(0, 5)}`,
  }));
}

export const WEDDING_HALL_TOUR_TIPS = `
• 한 사람이 질문하고 한 사람이 답을 체크해서 적으면 편해요. 미리 가기 전에 서로 상의할 것!
  (저희는 신부가 묻고 신랑이 답 적기 - 신랑에게도 결혼준비 신경쓰게 하는 효과도 있고 좋았답니다)
• 주말 예식으로 인해 웨딩홀 투어 예약이 안 되는 곳에선 하객처럼 방문해서 보고 나와야 하니 옷차림 신경 쓸 것
• 당일 혜택으로 현장에서 예약금 지불 필요할 수 있음 (카드/현금) 가능
• 홀 대관료의 5~10%, 스드메 총액의 5~10% 정도 여유 자금 준비해서 갈 것
• 미리 예식날짜가 정해진 경우 그 날짜로 문의하고, 없을 땐 가격이 좋은 날로 문의하는 것도 좋음
• 지역에 따라 날짜·요일별로 가격 차이가 나는 곳이 있음
`.trim();
