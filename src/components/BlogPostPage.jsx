import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, User } from "lucide-react";

const BlogPostPage = () => {
  const { id } = useParams();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      heroImage: "../src/assets/image1.jpg",
      content: `
        As we step into 2024, the world of travel continues to evolve, offering new experiences and rediscovered gems for the adventurous soul. From pristine beaches to bustling metropolises, here's our curated list of must-visit destinations that promise unforgettable memories.

        1. Kyoto, Japan
        In the heart of Japan's cultural landscape, Kyoto stands as a testament to timeless beauty. This year, the city unveils several restored temples and gardens, offering visitors a deeper glimpse into Japanese heritage. The introduction of new bullet train routes has made accessing this cultural haven easier than ever.

        The city's famous cherry blossom season remains a prime attraction, but savvy travelers are discovering the equal beauty of autumn, when maple leaves paint the city in stunning reds and golds. Local initiatives have also introduced exclusive tea ceremony experiences and traditional craft workshops.

        2. Costa Rica's Caribbean Coast
        While the Pacific side of Costa Rica has long dominated tourist itineraries, 2024 sees the emergence of the Caribbean coast as a must-visit destination. This lesser-explored region offers a unique blend of Latin American and Caribbean culture, pristine beaches, and incredible biodiversity.

        New eco-lodges and sustainable tourism initiatives have made this region more accessible while preserving its natural beauty. Visitors can explore coral reefs, rainforests, and traditional villages, all while supporting local conservation efforts.

        3. The Scottish Highlands
        Scotland's rugged northern territory is experiencing a renaissance in sustainable tourism. New hiking trails, connecting historic castles and whisky distilleries, offer immersive experiences in Scottish culture and nature. The region's commitment to renewable energy has made it a model for ecological tourism.

        The introduction of luxury sleeper trains and boutique highland lodges has added comfort to the adventure, allowing travelers to experience the wild beauty of the Highlands without sacrificing modern amenities.

        Travel Tips and Best Practices:

        - Book accommodations well in advance, especially for peak seasons
        - Consider shoulder seasons for better deals and fewer crowds
        - Research local customs and etiquette
        - Support sustainable tourism initiatives
        - Learn basic phrases in local languages
        - Pack appropriate gear for varying weather conditions

        The Future of Travel

        As we explore these destinations, it's crucial to consider the impact of tourism on local communities and environments. Sustainable travel isn't just a trend—it's becoming a necessity. Many of these destinations are leading the way in responsible tourism, showing how we can explore the world while preserving it for future generations.
      `,
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
      heroImage: "../src/assets/image1.jpg",
      content: `
        Photography is more than just capturing moments—it's about telling stories through images. Whether you're a beginner or an experienced photographer, these essential tips will help elevate your travel photography to the next level.

        Understanding Light
        The foundation of great photography lies in understanding light. Early morning and late afternoon offer the best natural light, known as the "golden hours." During these times, the soft, warm light creates stunning shadows and highlights that add depth to your images.

        Composition Techniques
        - Rule of Thirds: Divide your frame into a 3x3 grid and place key elements along these lines
        - Leading Lines: Use natural lines in the environment to guide viewers' eyes through the image
        - Framing: Utilize natural frames like archways or branches to add depth
        - Perspective: Experiment with different angles and viewpoints

        Equipment Essentials
        While gear isn't everything, having the right equipment can make a difference:
        - A versatile zoom lens (24-70mm is ideal)
        - A lightweight tripod for low-light situations
        - Polarizing filter for reducing glare
        - Extra batteries and memory cards
        - A weather-resistant camera bag

        The Art of Storytelling
        Great travel photography isn't just about beautiful scenes—it's about capturing the essence of a place. Include elements that tell a story:
        - Local people going about their daily lives
        - Traditional architecture and street scenes
        - Food and local customs
        - Natural landscapes and wildlife

        Post-Processing Tips
        Modern photography isn't complete without some post-processing:
        - Shoot in RAW format for more editing flexibility
        - Use selective adjustments to enhance specific areas
        - Maintain natural colors and contrast
        - Create a consistent editing style for your travel series

        Remember, the best camera is the one you have with you. Focus on developing your eye for composition and storytelling, and the technical skills will follow naturally.
      `,
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
      heroImage: "../src/assets/image1.jpg",
      content: `
        Exploring Europe doesn't have to break the bank. With careful planning and smart choices, you can experience the richness of European culture, history, and cuisine while maintaining a reasonable budget. Here's your comprehensive guide to budget travel in Europe.

        Transportation
        Getting around Europe efficiently is key to budget travel:
        - Consider Eurail passes for multiple country visits
        - Book train tickets in advance for best prices
        - Use budget airlines for longer distances
        - Take advantage of city bikes and walking tours
        - Look into night trains to save on accommodation

        Accommodation Strategies
        Finding affordable places to stay:
        - Mix hostels with budget hotels
        - Try house-sitting opportunities
        - Use hospitality networks
        - Book apartments for longer stays
        - Consider camping in summer months

        Food and Dining
        Eating well without overspending:
        - Shop at local markets
        - Try street food
        - Look for lunch specials
        - Cook your own meals when possible
        - Discover local budget restaurants

        Sightseeing and Activities
        Making the most of your experience:
        - Use city tourist cards
        - Take advantage of free walking tours
        - Visit museums on free days
        - Explore free attractions
        - Look for student and youth discounts

        Money-Saving Tips
        Additional ways to stretch your budget:
        - Get a good travel credit card
        - Use local transportation passes
        - Travel during shoulder season
        - Book accommodations in advance
        - Take advantage of free WiFi spots

        Remember, budget travel doesn't mean missing out on experiences. It's about making smart choices that allow you to see more while spending less.
      `,
    },
  ];

  const post = blogs.find((blog) => blog.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen bg-emerald-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Blog post not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-950">
      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-4 pt-32  pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-emerald-200">
            <span className="flex items-center gap-2">
              <User size={16} />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={16} />
              {post.readTime}
            </span>
          </div>
        </div>
        <img
          src={post.heroImage}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-invert prose-emerald max-w-none">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="text-emerald-100 mb-6 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </article>
      </main>
    </div>
  );
};

export default BlogPostPage;
