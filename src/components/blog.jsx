import React, { useEffect, useRef, useState } from "react";
import "./blog.css";
const BlogSelector = () => {
  const backgroundTextRef = useRef(null);
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;

      if (section) {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementHeight = rect.height;

        let progress =
          (viewportHeight - rect.top) / (viewportHeight + elementHeight);
        progress = Math.min(Math.max(progress, 0), 1);

        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const backgroundText = backgroundTextRef.current;
    if (backgroundText) {
      const xPosition = (scrollProgress - 0.5) * 200;
      backgroundText.style.transform = `translate(-50%, -50%) translateX(${xPosition}%)`;
    }
  }, [scrollProgress]);

  const blogs = [
    {
      id: 1,
      title: "Top 10 Travel Destinations for 2024",
      excerpt:
        "Discover the most exciting places to visit this year, from hidden gems to popular hotspots.",
      author: "Sarah Wilson",
      date: "April 15, 2024",
      category: "Travel",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Essential Travel Photography Tips",
      excerpt:
        "Learn how to capture stunning photos during your travels with these professional techniques.",
      author: "David Chen",
      date: "April 12, 2024",
      category: "Photography",
      readTime: "8 min read",
    },
    {
      id: 3,
      title: "Budget Travel Guide: Europe Edition",
      excerpt:
        "Everything you need to know about traveling through Europe on a budget.",
      author: "Emma Thompson",
      date: "April 10, 2024",
      category: "Travel Tips",
      readTime: "10 min read",
    },
  ];

  return (
    <div className="blog-selector" ref={sectionRef}>
      <div className="heading-container">
        <h2 className="background-text" ref={backgroundTextRef}>
          BLOG POSTS
        </h2>
        <h2 className="main-heading">LATEST ARTICLES</h2>
      </div>
      <div className="blog-grid">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <div className="blog-content">
              <div className="blog-meta">
                <span className="blog-category">{blog.category}</span>
                <span className="blog-read-time">{blog.readTime}</span>
              </div>
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-excerpt">{blog.excerpt}</p>
              <div className="blog-footer">
                <span className="blog-author">{blog.author}</span>
                <span className="blog-date">{blog.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSelector;
