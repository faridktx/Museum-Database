import "./EventsList.css";

export function EventsList() {
  const events = [
    {
      title: "Lunar Exhibit Opening",
      date: "May 3, 2025",
      description: "Be among the first to explore our new moon landing showcase.",
    },
    {
      title: "Curator Q&A: Behind the Scenes",
      date: "May 9, 2025",
      description: "A live session with our head curator discussing artifact curation.",
    },
    {
      title: "Night at the Museum",
      date: "May 15, 2025",
      description: "Experience the museum after hours with immersive storytelling and live actors.",
    },
  ];

  return (
    <section className="events-section">
      <h2 className="section-title">Upcoming Events</h2>
      <div className="events-grid">
        {events.map((event, i) => (
          <div className="event-card" key={i}>
            <h3>{event.title}</h3>
            <p className="event-date">{event.date}</p>
            <p className="event-desc">{event.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}