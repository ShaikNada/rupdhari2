import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Color palette: akaroa (#D4C4A8), walnut (#5E4B3B), rhino (#2B2D42), desert (#C19A6B), sandstone (#B3A492)
const team = [
  {
    name: "Anaya Sharma",
    role: "Principal Architect",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format",
    bio: "Anaya leads with a blend of heritage wisdom and modern design. Her work reflects cultural richness and innovative spatial solutions that stand the test of time."
  },
  {
    name: "Rohan Mehta",
    role: "Landscape Designer",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&auto=format",
    bio: "Rohan transforms spaces with natural harmony and indigenous flora-focused landscapes that create sustainable ecosystems within urban environments."
  },
  {
    name: "Leela Iyer",
    role: "Interior Designer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format",
    bio: "Leela infuses every interior with warmth, elegance, and story-driven design that reflects the unique personality of each client."
  }
];

const testimonials = [
  {
    name: "Ravi Verma",
    feedback: "Rūpadhari brought our dream home to life. Their process was deeply personal and artistic, resulting in a space that feels uniquely ours while maintaining perfect functionality.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format"
  },
  {
    name: "Sonal Kapoor",
    feedback: "Their aesthetic sensibility redefined our workspace — elegant yet functional. The team's attention to detail and understanding of our brand identity was exceptional.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format"
  },
  {
    name: "Arjun Desai",
    feedback: "A rare firm that blends architecture with soul. Every detail was handled with care, from the initial concept to the final finishes. The result exceeded all expectations.",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&auto=format"
  }
];

const teamVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.32, 0.72, 0, 1]
    }
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.6,
      ease: [0.32, 0.72, 0, 1]
    }
  })
};

const testimonialVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 50 : -50,
    opacity: 0,
    rotate: direction > 0 ? 2 : -2
  }),
  center: {
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -50 : 50,
    opacity: 0,
    rotate: direction > 0 ? -2 : 2,
    transition: {
      duration: 0.8,
      ease: "easeIn"
    }
  })
};

const Story = () => {
  const [teamIndex, setTeamIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [tDirection, setTDirection] = useState(1);
  const teamTimerRef = useRef<NodeJS.Timeout | null>(null);
  const testimonialTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimers = () => {
    if (teamTimerRef.current) clearInterval(teamTimerRef.current);
    if (testimonialTimerRef.current) clearInterval(testimonialTimerRef.current);
    
    teamTimerRef.current = setInterval(() => {
      setDirection(1);
      setTeamIndex((prev) => (prev + 1) % team.length);
    }, 8000);
    
    testimonialTimerRef.current = setInterval(() => {
      setTDirection(1);
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 10000);
  };

  useEffect(() => {
    resetTimers();
    return () => {
      if (teamTimerRef.current) clearInterval(teamTimerRef.current);
      if (testimonialTimerRef.current) clearInterval(testimonialTimerRef.current);
    };
  }, []);

  const handleTeamScroll = (dir: "left" | "right") => {
    setDirection(dir === "left" ? -1 : 1);
    setTeamIndex((prev) =>
      dir === "left"
        ? (prev - 1 + team.length) % team.length
        : (prev + 1) % team.length
    );
    resetTimers();
  };

  const handleTestimonialScroll = (dir: "left" | "right") => {
    setTDirection(dir === "left" ? -1 : 1);
    setTestimonialIndex((prev) =>
      dir === "left"
        ? (prev - 1 + testimonials.length) % testimonials.length
        : (prev + 1) % testimonials.length
    );
    resetTimers();
  };

  return (
    <div className="min-h-screen bg-[#D4C4A8]">
      <Navigation />

      {/* Hero Video Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full py-16 flex justify-center bg-[#2B2D42]"
      >
        <div className="w-full max-w-6xl px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-serif text-center mb-12 text-[#D4C4A8]"
          >
            Our Story & Philosophy
          </motion.h1>
          <div className="mx-auto" style={{ maxWidth: 600, height: 340 }}>
            <div className="rounded-xl overflow-hidden shadow-2xl relative w-full h-full">
<div className="absolute inset-0 bg-gradient-to-br from-[#5E4B3B]/30 to-[#C19A6B]/30 z-10 pointer-events-none"></div>
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1&modestbranding=1&rel=0"
                title="Rūpadhari Design Process"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Philosophy Section - Moved below video */}
      <section className="py-24 bg-[#D4C4A8]">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#5E4B3B] rounded-2xl p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-serif mb-8 text-[#D4C4A8]">Our Design Philosophy</h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 bg-[#C19A6B] text-[#2B2D42] p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12h20M12 2v20M5 5l14 14M5 19l14-14"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#D4C4A8] mb-2">Harmony in Contrast</h3>
                      <p className="text-[#B3A492]">We believe in balancing modern minimalism with traditional warmth, creating spaces that feel both contemporary and timeless.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 bg-[#C19A6B] text-[#2B2D42] p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
                        <path d="M8.5 8.5v.01"/>
                        <path d="M16 15.5v.01"/>
                        <path d="M12 12v.01"/>
                        <path d="M11 17v.01"/>
                        <path d="M7 14v.01"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#D4C4A8] mb-2">Material Authenticity</h3>
                      <p className="text-[#B3A492]">We use materials in their most honest form, celebrating their natural textures and allowing them to age gracefully.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 bg-[#C19A6B] text-[#2B2D42] p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#D4C4A8] mb-2">Contextual Design</h3>
                      <p className="text-[#B3A492]">Every project responds to its unique environment, climate, and cultural context, creating architecture that belongs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 bg-[#C19A6B] text-[#2B2D42] p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3v18h18"/>
                        <path d="m19 9-5 5-4-4-3 3"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#D4C4A8] mb-2">Sustainable Futures</h3>
                      <p className="text-[#B3A492]">Our designs prioritize passive strategies and low-impact materials to create buildings that give back more than they take.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Carousel */}
      <section className="py-20 bg-[#B3A492] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl text-center font-serif mb-12 text-[#2B2D42]"
          >
            Meet Our Team
          </motion.h2>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -left-16 top-1/2 -translate-y-1/2 z-20">
              <button
                className="p-3 rounded-full bg-[#5E4B3B] text-[#D4C4A8] hover:bg-[#2B2D42] transition-all duration-300 shadow-lg hover:scale-110"
                onClick={() => handleTeamScroll("left")}
              >
                <ChevronLeft size={28} />
              </button>
            </div>
            
            <div className="absolute -right-16 top-1/2 -translate-y-1/2 z-20">
              <button
                className="p-3 rounded-full bg-[#5E4B3B] text-[#D4C4A8] hover:bg-[#2B2D42] transition-all duration-300 shadow-lg hover:scale-110"
                onClick={() => handleTeamScroll("right")}
              >
                <ChevronRight size={28} />
              </button>
            </div>
            
            <div className="relative h-[400px]">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={teamIndex}
                  custom={direction}
                  variants={teamVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 bg-[#5E4B3B] rounded-xl shadow-xl overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden">
                      <img
                        src={team[teamIndex].image}
                        alt={team[teamIndex].name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#5E4B3B]/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6">
                        <h3 className="text-3xl font-bold text-[#D4C4A8]">{team[teamIndex].name}</h3>
                        <p className="text-xl italic text-[#B3A492]">{team[teamIndex].role}</p>
                      </div>
                    </div>
                    <div className="md:w-1/2 p-8 md:p-12 flex items-center bg-[#D4C4A8]">
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-[#2B2D42] leading-relaxed"
                      >
                        {team[teamIndex].bio}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex justify-center mt-8 gap-2">
              {team.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > teamIndex ? 1 : -1);
                    setTeamIndex(index);
                    resetTimers();
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === teamIndex ? 'bg-[#2B2D42] w-6' : 'bg-[#5E4B3B]/50'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section - Updated Colors */}
      <section className="py-20 bg-[#D4C4A8] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl text-center font-serif mb-16 text-[#5E4B3B] tracking-wide drop-shadow-lg"
          >
            Client Testimonials
          </motion.h2>

          <div className="relative max-w-3xl mx-auto min-h-[320px]">
            <div className="absolute -left-12 md:-left-16 top-1/2 -translate-y-1/2 z-20">
              <button
                className="p-3 rounded-full bg-[#5E4B3B] text-[#D4C4A8] hover:bg-[#2B2D42] transition-all duration-300 shadow-lg hover:scale-110 border-2 border-[#C19A6B]"
                onClick={() => handleTestimonialScroll('left')}
              >
                <ChevronLeft size={28} />
              </button>
            </div>

            <div className="absolute -right-12 md:-right-16 top-1/2 -translate-y-1/2 z-20">
              <button
                className="p-3 rounded-full bg-[#5E4B3B] text-[#D4C4A8] hover:bg-[#2B2D42] transition-all duration-300 shadow-lg hover:scale-110 border-2 border-[#C19A6B]"
                onClick={() => handleTestimonialScroll('right')}
              >
                <ChevronRight size={28} />
              </button>
            </div>

            <div className="relative h-full flex items-center justify-center">
              <div className="flex items-center justify-center h-full">
                <AnimatePresence mode="wait" custom={tDirection} initial={false}>
                  <motion.div
                    key={testimonialIndex}
                    custom={tDirection}
                    variants={testimonialVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex items-center justify-center w-full"
                  >
                    <div className="bg-[#C19A6B] rounded-2xl p-14 shadow-2xl min-h-[340px] flex flex-col items-center border-4 border-[#5E4B3B] w-full max-w-2xl mx-auto">
                      <div className="relative mb-6">
                        <img
                          src={testimonials[testimonialIndex].image}
                          alt={testimonials[testimonialIndex].name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-[#D4C4A8] shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-[#5E4B3B] text-[#D4C4A8] p-2 rounded-full border-2 border-[#B3A492]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                          </svg>
                        </div>
                      </div>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="font-serif text-xl text-center text-[#5E4B3B] mb-6 leading-relaxed font-semibold drop-shadow-md"
                      >
                        "{testimonials[testimonialIndex].feedback}"
                      </motion.p>
                      <motion.h4 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-[#2B2D42] font-bold text-2xl tracking-wide drop-shadow-sm"
                      >
                        {testimonials[testimonialIndex].name}
                      </motion.h4>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setTDirection(index > testimonialIndex ? 1 : -1);
                    setTestimonialIndex(index);
                    resetTimers();
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === testimonialIndex ? 'bg-[#5E4B3B] w-6 border-2 border-[#C19A6B]' : 'bg-[#B3A492]/50'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Story;