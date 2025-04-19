import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ExhibitCarousel.css";

export function ExhibitCarousel() {
  const [exhibits] = useState([
    {
      exhibit_name: "Roman Empire",
      description: "Weapons, architecture, busts",
      image: "https://images.unsplash.com/photo-1568132930457-20ac2189f20b"
    },
    {
      exhibit_name: "Medieval Europe",
      description: "Swords, armor, castles",
      image: "https://images.unsplash.com/photo-1725404436765-dc3b1cb968b3"
    },
    {
      exhibit_name: "Ancient Egypt",
      description: "Mummies and pyramids",
      image: "https://images.unsplash.com/photo-1566288592443-0a0d6853dddc"
    }
  ]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <section className="carousel-section">
      <h2 className="section-title">Featured Exhibits</h2>
      <Slider {...settings}>
        {exhibits.map((exhibit, idx) => (
          <div className="exhibit-slide" key={idx}>
            <div className="exhibit-card">
              <img
                src={exhibit.image}
                alt={exhibit.exhibit_name}
                className="exhibit-img"
              />
              <h3>{exhibit.exhibit_name}</h3>
              <p>{exhibit.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}