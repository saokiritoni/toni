const ABOUT_ITEMS = [
  <>백엔드를 중심으로 프론트엔드와 인프라까지 경험하며, 하나의 기능이 사용자에게 전달되고 안정적으로 운영되는 과정 전체를 고민해왔습니다.</>,
  <>업무의 규칙을 이해해 데이터와 시스템 구조에 반영하고, 반복되는 문제는 더 나은 방식으로 바꾸는 것을 좋아합니다.</>,
  <>
    <b>기술이 왜 필요한지, 어떤 문제를 더 잘 해결할 수 있는지</b>를 먼저 생각하는 개발자가 되고자 합니다.
  </>,
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
          {ABOUT_ITEMS.map((text, i) => (
            <div className="about-col" data-reveal key={i}>
              <span className="about-idx">{String(i + 1).padStart(2, '0')}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
