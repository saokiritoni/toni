const ABOUT_ITEMS = [
  {
    title: '문제를 이해하고 구조를 고민합니다.',
    body: '비즈니스 상황과 사용자의 업무를 먼저 이해하고, 문제의 특성에 맞는 구조와 기술을 선택합니다.',
  },
  {
    title: '함께 답을 찾는 과정을 중요하게 생각합니다.',
    body: '문제를 빠르게 공유하고 동료의 의견을 들으며, 혼자 해결하기보다 함께 더 나은 답을 찾아갑니다.',
  },
  {
    title: '필요한 영역이라면 배워서 개발합니다.',
    body: '백엔드를 중심으로 프론트엔드와 인프라까지, 서비스와 사용자 경험에 필요하다면 새로운 영역도 배우고 개발합니다.',
  },
]

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container-inner">
        <div className="section-head" data-reveal>
          <h2 className="section-title" id="about-title">
            About
          </h2>
        </div>
        <div className="about-cols">
          {ABOUT_ITEMS.map(({ title, body }, i) => (
            <div className="about-col" data-reveal key={i}>
              <span className="about-idx">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="about-title">{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
