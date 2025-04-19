import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./TestimonialsSlider.css";

export function TestimonialsSlider() {
  const testimonials = [
    {
      name: "Ava R.",
      quote:
        "Absolutely loved the Ancient Egypt exhibit. The details blew my mind!",
    },
    {
      name: "Michael B.",
      quote: "Super clean, super fun, and surprisingly educational. 10/10.",
    },
    {
      name: "Lina G.",
      quote: "The Roman Empire exhibit was the highlight of my week!",
    },
  ];

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <section className="testimonials-section">
      <h2 className="section-title">What Visitors Are Saying</h2>
      <Slider {...settings}>
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card">
            <p className="quote">“{t.quote}”</p>
            <p className="name">- {t.name}</p>
          </div>
        ))}
      </Slider>
    </section>
  );
}
