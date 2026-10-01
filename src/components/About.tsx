import PixelArt from './PixelArt'
import { ABOUT_PIXELS, SECTION_PIXELS } from '../data/pixels'

const ABOUT_ITEMS = [
  {
    title: '업무를 이해하고 구조를 고민합니다.',
    body: '사용자의 업무와 데이터 흐름을 먼저 이해하고, 요구사항에 맞는 구조와 기술을 선택합니다.',
  },
  {
    title: '문제를 공유하고 함께 해결합니다.',
    body: '막히는 부분을 빠르게 공유하고 동료의 의견을 들으며 해결 방법을 찾습니다.',
  },
  {
    title: '필요한 영역까지 직접 다룹니다.',
    body: '백엔드를 중심으로 화면과 인프라까지 경험하며, 기능 구현과 운영 과정에서 생기는 문제를 해결해 왔습니다.',
  },
]

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container-inner">
        <div className="section-head" data-reveal>
          <PixelArt pattern={SECTION_PIXELS.about} className="section-mark" />
          <h2 className="section-title" id="about-title">
            About
          </h2>
        </div>
        <div className="about-cols">
          {ABOUT_ITEMS.map(({ title, body }, i) => (
            <div className="about-col" data-reveal key={i}>
              <div className="about-card">
                <div className="about-card-top">
                  <PixelArt pattern={ABOUT_PIXELS[i]} cell={7} />
                  <span className="about-idx">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="about-title">{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
