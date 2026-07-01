// "The Question" — a small daily prediction the reader answers before the
// idea is revealed. Understanding-before-recommendation, made active. The
// reveal never scolds a wrong guess; it teaches, the way a patient professor
// would. Educational only — no advice, no products. Client-side, deterministic.

export const predictContent = {
  en: {
    kicker: 'The question',
    revealLabel: 'What most people find',
    prompts: [
      {
        question: 'What tends to shrink spending more — a strict budget, or simply watching where the money goes?',
        options: [
          { key: 'A', label: 'A strict budget with hard limits' },
          { key: 'B', label: 'Just watching, without any rules' },
        ],
        answer: 'B',
        insight:
          'Attention beats willpower. Just <strong>seeing</strong> where money goes tends to reduce it on its own — no rules required. That\u2019s why \u201Ctrack it for a week\u201D quietly outperforms a strict plan that usually snaps back.',
      },
      {
        question: 'Which stings more for most people — losing $100, or the good feeling of gaining $100?',
        options: [
          { key: 'A', label: 'Losing $100 hurts more' },
          { key: 'B', label: 'They feel about equal' },
        ],
        answer: 'A',
        insight:
          'For most of us, a loss hurts about <strong>twice</strong> as much as the same gain feels good. That\u2019s why a small safety net matters more than it looks on paper \u2014 it guards against a pain that\u2019s outsized, not just a number.',
      },
      {
        question: 'For long-term saving, what usually matters more — how long your money grows, or picking the perfect moment to start?',
        options: [
          { key: 'A', label: 'Timing the perfect moment' },
          { key: 'B', label: 'How long it grows' },
        ],
        answer: 'B',
        insight:
          'Time in the market, not timing it. How <strong>long</strong> your money grows tends to matter far more than when you begin \u2014 which is why a small start today often beats a big, clever effort years from now.',
      },
      {
        question: 'A big tax refund each spring is best thought of as\u2026',
        options: [
          { key: 'A', label: 'A yearly bonus you earned' },
          { key: 'B', label: 'Your own money, returned to you late' },
        ],
        answer: 'B',
        insight:
          'A refund is usually just your <strong>own money</strong> handed back to you later, without interest. Nothing wrong with it \u2014 but steady awareness through the year tends to serve you better than a spring surprise.',
      },
      {
        question: 'In a given year, a typical working adult is more likely to\u2026',
        options: [
          { key: 'A', label: 'Become disabled and unable to work' },
          { key: 'B', label: 'Pass away' },
        ],
        answer: 'A',
        insight:
          'For a typical working adult, becoming disabled in a given year is <strong>more likely</strong> than dying \u2014 yet disability protection is one of the most overlooked. Worth knowing which risks you\u2019ve quietly set aside, and which you haven\u2019t.',
      },
      {
        question: 'Which order makes saving actually happen for most people?',
        options: [
          { key: 'A', label: 'Spend first, save what\u2019s left' },
          { key: 'B', label: 'Save first, spend what\u2019s left' },
        ],
        answer: 'B',
        insight:
          'When saving comes <strong>before</strong> spending \u2014 a small transfer on payday, before you see it \u2014 it tends to survive. This single ordering trick sits quietly behind most savings systems that work.',
      },
    ],
  },
  ko: {
    kicker: '오늘의 질문',
    revealLabel: '많은 사람이 발견하는 것',
    prompts: [
      {
        question: '지출을 더 줄이는 건 무엇일까요 \u2014 엄격한 예산일까요, 아니면 그저 돈이 어디로 가는지 지켜보는 것일까요?',
        options: [
          { key: 'A', label: '한도가 딱 정해진 엄격한 예산' },
          { key: 'B', label: '규칙 없이, 그냥 지켜보기' },
        ],
        answer: 'B',
        insight:
          '의지력보다 주의가 이겨요. 돈이 어디로 가는지 <strong>보기만</strong> 해도 저절로 줄어드는 경향이 있어요 \u2014 규칙은 필요 없죠. 그래서 \u201C일주일만 적어 보기\u201D가 되튀기 쉬운 엄격한 계획을 조용히 이깁니다.',
      },
      {
        question: '많은 사람에게 더 크게 느껴지는 건 무엇일까요 \u2014 10만 원을 잃는 아픔일까요, 10만 원을 얻는 기쁨일까요?',
        options: [
          { key: 'A', label: '잃는 아픔이 더 커요' },
          { key: 'B', label: '비슷해요' },
        ],
        answer: 'A',
        insight:
          '대부분에게 손실의 아픔은 같은 크기의 이득이 주는 기쁨보다 약 <strong>두 배</strong> 커요. 그래서 작은 안전망은 숫자보다 더 중요해요 \u2014 단순한 금액이 아니라, 유난히 큰 고통으로부터 지켜 주니까요.',
      },
      {
        question: '장기 저축에서 더 중요한 건 무엇일까요 \u2014 돈이 자라는 시간일까요, 완벽한 시작 시점일까요?',
        options: [
          { key: 'A', label: '완벽한 타이밍 맞추기' },
          { key: 'B', label: '얼마나 오래 자라는가' },
        ],
        answer: 'B',
        insight:
          '타이밍이 아니라 시장에 머문 시간이에요. 돈이 <strong>얼마나 오래</strong> 자라느냐가 언제 시작하느냐보다 훨씬 중요하곤 해요 \u2014 그래서 오늘의 작은 시작이 몇 년 뒤의 영리한 큰 노력을 이기곤 합니다.',
      },
      {
        question: '봄마다 받는 큰 세금 환급은 어떻게 보는 게 맞을까요?',
        options: [
          { key: 'A', label: '내가 번 연례 보너스' },
          { key: 'B', label: '내 돈을 늦게 돌려받는 것' },
        ],
        answer: 'B',
        insight:
          '환급은 대개 <strong>내 돈</strong>을 이자 없이 늦게 돌려받는 것뿐이에요. 나쁠 건 없지만 \u2014 봄의 깜짝 선물보다 연중 꾸준한 감각이 더 도움이 되곤 합니다.',
      },
      {
        question: '어느 해에 평범한 직장인에게 더 흔한 일은 무엇일까요?',
        options: [
          { key: 'A', label: '장애로 일을 못 하게 되는 것' },
          { key: 'B', label: '이른 사망' },
        ],
        answer: 'A',
        insight:
          '평범한 직장인에게 어느 해에 장애를 겪을 확률은 이른 사망 확률보다 <strong>더 높아요</strong> \u2014 그런데도 장애 보장은 가장 간과되는 것 중 하나죠. 어떤 위험을 조용히 대비해 두었는지 알아 둘 만해요.',
      },
      {
        question: '많은 사람에게 저축이 실제로 이뤄지게 하는 순서는?',
        options: [
          { key: 'A', label: '먼저 쓰고, 남으면 저축' },
          { key: 'B', label: '먼저 저축하고, 남으면 쓰기' },
        ],
        answer: 'B',
        insight:
          '저축이 지출보다 <strong>먼저</strong> 올 때 \u2014 월급날, 보기도 전에 작은 금액을 옮겨 둘 때 \u2014 살아남는 경향이 있어요. 이 하나의 순서 요령이 잘 굴러가는 저축 시스템 대부분의 뒤에 조용히 있습니다.',
      },
    ],
  },
}
