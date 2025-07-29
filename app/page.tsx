"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MessageCircle, Gift, ChevronDown, Copy, ChevronRight, Volume2, VolumeX, Pause, Play } from "lucide-react"
import PhotoGallery from "@/components/photo-gallery"
import RSVPForm from "@/components/rsvp-form"
const MUSIC_FILE_PATH = "/public/song.mp3"; // If in public/assets
export default function WeddingInvitation() {
  const [currentSection, setCurrentSection] = useState(0)
  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    phone: "",
    guests: 1,
    attendance: "",
  })
  const [wishForm, setWishForm] = useState("")
  const [wishes, setWishes] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())
  const [showGallery, setShowGallery] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showMusicControl, setShowMusicControl] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showPopup, setShowPopup] = useState(true);
  const hasInteracted = useRef(false); 
  // Hardcoded wedding images
  const weddingImages = {
    mainPhoto: "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783383/IMG_5431_nwpu0r.jpg",
    albumPhotos: [
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783382/IMG_5447_14_11zon_pvuqui.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783392/IMG_5446_kexzf6.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783379/IMG_5445_13_11zon_sdwxam.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783394/IMG_5443_12_11zon_vcaqml.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783391/IMG_5442_11_11zon_m5mtvz.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783389/IMG_5441_10_11zon_khffpd.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783383/IMG_5437_9_11zon_x68g5m.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783386/IMG_5435_8_11zon_ruiwcs.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783396/IMG_5433_czhic5.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783383/IMG_5431_nwpu0r.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783382/IMG_5428_rokgba.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783378/IMG_5426_7_11zon_kyehz7.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783378/IMG_5426_7_11zon_kyehz7.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783388/IMG_5424_cqcnmo.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753777468/IMG_5421_11zon_1_lkexey.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783380/IMG_5420_6_11zon_rbwi6i.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783376/IMG_5396_bw7gaf.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783377/IMG_5401_3_11zon_pdb602.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783378/IMG_5408_svhzfh.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783390/IMG_5419_xvuoze.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783379/IMG_5415_t4edaq.jpg",
      "https://res.cloudinary.com/da4wi5yxi/image/upload/v1753783378/IMG_5404_m7z6ss.jpg",
     
    ],
  }

  // Banking information with VietQR
  const bankingInfo = [
    {
      name: "Trần Anh Huy",
      bank: "Vietcombank",
      accountNumber: "0721000653710",
      bankCode: "VCB",
      qrCode: `https://img.vietqr.io/image/VCB-1234567890-compact2.png?amount=&addInfo=Mung%20cuoi%20Anh%20Huy%20Cam%20Vang&accountName=TRAN%20ANH%20HUY`,
    },
    {
      name: "Mai Thị Cẩm Vang",
      bank: "Vietcombank",
      accountNumber: "0921000710627",
      bankCode: "VCB",
      qrCode: `https://img.vietqr.io/image/TCB-0987654321-compact2.png?amount=&addInfo=Mung%20cuoi%20Anh%20Huy%20Cam%20Vang&accountName=MAI%20THI%20CAM%20VANG`,
    },
  ]

   // Music control functions
   const playMusic = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (error) {
        console.log("Autoplay prevented:", error)
        setShowMusicControl(true)
      }
    }
  }

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMusic = () => {
    if (isPlaying) {
      pauseMusic()
    } else {
      playMusic()
    }
  } 



  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  useEffect(() => {
    setIsVisible(true);

    // Initialize audio
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 30%
    }

    // Attempt to play music on initial load
    playMusic();

    // Intersection Observer for scroll animations (giữ nguyên)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    const animatedElements = document.querySelectorAll("[data-animate]");
    animatedElements.forEach((el) => {
      observer.observe(el);
    });

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const newSection = Math.floor(scrollPosition / windowHeight);
      setCurrentSection(Math.min(newSection, 7));
    };

    window.addEventListener("scroll", handleScroll);

    // Add event listener to track user interaction
    const handleUserInteraction = () => {
      hasInteracted.current = true;
      // Optionally, you can try playing again here if it initially failed
      if (!isPlaying && audioRef.current && showMusicControl) {
        playMusic();
        setShowMusicControl(false); // Hide the popup after successful play
      }
      // Remove the listener after the first interaction
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };

    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('mousedown', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      observer.disconnect();
    };
  }, []);


  // Music control functions (giữ nguyên)
 

  const handlePlay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        setShowPopup(true);
      });
      setIsPlaying(true);
      setShowPopup(false);
    }
  }, [audioRef, setShowPopup, setIsPlaying]);
  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
  }, [setShowPopup]);

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (wishForm.trim()) {
      setWishes([...wishes, wishForm])
      setWishForm("")
    }
  }
  const handleCloseFullscreen = useCallback(() => {
    setShowPopup(false);
  }, [setShowPopup]);
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(type)
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  const isElementVisible = (id: string) => visibleElements.has(id)

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
     <div>
     {showPopup && !isPlaying && (
        <div
              className="font-ooohbaby"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "black", // Solid black background
            color: "white",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "3em", fontWeight: "normal", marginBottom: "10px" }}>
            Thêm chút nhạc?
          </h1>
          <p 
          style={{ fontSize: "1em", color: "#ccc", marginBottom: "30px",

            fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif', // Serif font for the title

           }}>
            Một bản nhạc đặc biệt cho khoảnh khắc đặc biệt
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            <button
              onClick={handlePlay}
              style={{
                background: "white",
                color: "black",
                border: "none",
                borderRadius: "30px",
                padding: "15px 40px",
                cursor: "pointer",
                fontSize: "1.1em",
            fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif', // Serif font for the title
            fontWeight:200,

                transition: "background-color 0.3s ease, color 0.3s ease",
               
              }}
            >
              Có
            </button>
            <button
              onClick={handleClosePopup}
              style={{
                background: "transparent",
                color: "white",
                border: "1px solid white",
                borderRadius: "30px",
                padding: "15px 40px",
                cursor: "pointer",
                fontSize: "1.1em",
            fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif', // Serif font for the title

                fontWeight:200,
                transition: "border-color 0.3s ease, color 0.3s ease",
              
              }}
            >
              Không
            </button>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        src="/music/song.mp3"
        loop // Keep loop for continuous playback
        preload="auto"
      >
        <track
          kind="captions"
          src="./assets/audio/music.vtt"
          srcLang="vi"
          label="Vietnamese"
        />
        Trình duyệt của bạn không hỗ trợ phát audio.
      </audio>
    </div>

    

      {/* Music Control Button */}
      {!showMusicControl && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={toggleMusic}
            variant="outline"
            size="icon"
            className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-accent shadow-lg rounded-full transition-all duration-300 hover:scale-110"
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-accent" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-500" />
            )}
          </Button>
        </div>
      )}
      {/* Music Control Notification */}
     
      {/* Section 0: Main Wedding Photo Layout */}
      <section className="h-screen flex items-center justify-center relative bg-white overflow-hidden">
        <div className="w-full h-screen relative">
          {/* Main Photo Frame */}
          <div className="relative w-full h-screen bg-white overflow-hidden">
            {/* Wedding Photo */}
            <div className="w-full h-full relative">
              <img
                src={weddingImages.mainPhoto || "/placeholder.svg"}
                alt="Ảnh cưới chính - Anh Huy & Cẩm Vang"
                className="w-full h-full object-cover animate-ken-burns"
                loading="eager"
              />

              {/* Subtle overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20"></div>
            </div>

            {/* Overlay Text - Top */}
            <div className="absolute top-20 sm:top-12 left-4 right-4 sm:left-6 sm:right-6 animate-slide-down z-10">
              <h1
                className="text-[40px] sm:text-[40px] text-white text-center drop-shadow-2xl font-ooohbaby"
                style={{
                  transform: "rotate(-8deg)",
                }}
              >
                Join Ân - Cát Hạ
              </h1>
            </div>



            {/* Overlay Text - Bottom Right */}
            <div className="absolute bottom-8 sm:bottom-12 right-4 sm:right-6 animate-slide-up z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
                <div className="space-y-2 sm:space-y-3 text-right">
                  <p
                    className="text-base sm:text-xl font-medium text-primary tracking-wide font-ooohbaby"
                    style={{ color: "white" }}
                  >
                    Thư mời thiệp cưới
                  </p>
                  <div className="w-full h-px bg-gray-200"></div>
                  <p
                    className="text-sm sm:text-base font-light text-gray-600"
                    style={{ fontFamily: "Playfair Display, serif",color: "white" }}
                  >
                    THỨ 7 - 18H00
                  </p>
                  <p
                    className="text-xl sm:text-2xl font-light text-primary tracking-[0.2em]"
                    style={{ fontFamily: "Playfair Display, serif",color: "white" }}
                  >
                    27.09.2025
                  </p>
                  <div className="w-full h-px bg-accent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/19 transform -translate-x-1/2 animate-bounce-gentle z-10">
          <ChevronDown className="w-5 h-5 text-white drop-shadow-lg" />
        </div> */}
      </section>
 {/* Section 0: Main Wedding Photo Layout */}
 <section className="h-screen flex items-center justify-center relative bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden" data-animate id="section-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 text-center">
          {/* Bible Verse - Top */}
          <div className={`mb-8 sm:mb-12 transition-all duration-1000 ${isElementVisible("section-0") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"}`} style={{ animationDelay: "0.2s" }}>
            <div className="max-w-2xl mx-auto">
            <p
              className="text-lg sm:text-lg text-gray-600 italic leading-relaxed font-light"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              "Nếu Đức Chúa Trời yêu thương chúng ta như thế, chúng cũng phải yêu thương nhau."
            </p>
            <p className="text-sm text-gray-500 font-light mt-2" style={{ fontFamily: "Playfair Display, serif" }}>
              (1 Giăng 4:11)
            </p>
            </div>
          </div>

          {/* Top Decorative Element */}
          <div className={`mb-8 sm:mb-12 transition-all duration-1000 ${isElementVisible("section-0") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"}`} style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center justify-center space-x-4 sm:space-x-6">
              <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <div className="w-16 sm:w-24 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>
          </div>

          {/* Main Title */}
          <div className={`mb-12 sm:mb-16 transition-all duration-1000 ${isElementVisible("section-0") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"}`} style={{ animationDelay: "0.6s" }}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-primary tracking-[0.1em] mb-4 font-ooohbaby">
              Join Ân
            </h1>
            
            {/* Cross with Flying Birds */}
            <div className={`flex items-center justify-center space-x-6 sm:space-x-8 my-8 transition-all duration-1000 ${isElementVisible("section-0") ? "animate-scale-in opacity-100" : "opacity-0 scale-90"}`} style={{ animationDelay: "0.8s" }}>
              <div className="relative">
                {/* Cross */}
                <div className="w-8 sm:w-12 h-8 sm:h-12 relative">
                  <div className="absolute top-0 left-1/2 w-px h-8 sm:h-12 bg-gray-400 transform -translate-x-1/2"></div>
                  <div className="absolute top-1/2 left-0 w-8 sm:w-12 h-px bg-gray-400 transform -translate-y-1/2"></div>
                </div>
                
                {/* Flying Birds */}
                <div className="absolute -top-3 -left-2 animate-float-slow">
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 4a10.9 10.9 0 0 0-3.14-1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 4z"/>
                  </svg>
                </div>
                <div className="absolute -top-2 -right-1 animate-float-slow" style={{ animationDelay: '0.5s' }}>
                  <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 4a10.9 10.9 0 0 0-3.14-1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 4z"/>
                  </svg>
                </div>
                <div className="absolute -bottom-2 -left-1 animate-float-slow" style={{ animationDelay: '1s' }}>
                  <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 4a10.9 10.9 0 0 0-3.14-1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 4z"/>
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-2 animate-float-slow" style={{ animationDelay: '1.5s' }}>
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 4a10.9 10.9 0 0 0-3.14-1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 4z"/>
                  </svg>
                </div>
                
                {/* Wedding Rings */}
                <div className="absolute -top-1 -right-2">
                  <div className="w-3 sm:w-4 h-3 sm:h-4 border border-accent rounded-full animate-pulse"></div>
                  <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 border border-accent rounded-full absolute top-0.5 left-1.5 sm:left-2 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
            </div>
            
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-light text-primary tracking-[0.1em] font-ooohbaby">
              Cát Hạ
            </h2>
          </div>

          {/* Wedding Date */}
          <div
              className={`text-2xl sm:text-3xl text-gray-600 font-light tracking-[0.1em] transition-all duration-1000 ${isElementVisible("section-1") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                }`}
              style={{ fontFamily: "Playfair Display, serif", animationDelay: "0.8s" }}
            >
              27.09.2025
            </div>

          {/* Bottom Decorative Element */}
          <div className={`transition-all duration-1000 ${isElementVisible("section-0") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"}`} style={{ animationDelay: "1.2s" }}>
            <div className="flex items-center justify-center space-x-4 sm:space-x-6">
              <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent "></div>
              <div className="w-12 sm:w-16 h-px bg-gradient-to-l from-transparent "></div>
            </div>
          </div>
          <div
            className={`space-y-6 transition-all duration-1000 ${isElementVisible("section-0") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
              }`}
            style={{ animationDelay: "1s" }}
          >
            <div className="flex items-center justify-center space-x-4 sm:space-x-6">
              <div className="w-20 sm:w-24 h-px bg-gray-300"></div>
              <span
                className="text-sm text-gray-600 tracking-[0.15em] font-light"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                KÍNH MỜI
              </span>
              <div className="w-20 sm:w-24 h-px bg-gray-300"></div>
           
            </div>
            
          </div>
          
        </div>
        <div className="absolute bottom-8 transform -translate-x-1/2 animate-bounce-gentle">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
        {/* Scroll Indicator */}

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-10 animate-float-slow">
          <div className="w-2 h-2 bg-accent rounded-full"></div>
        </div>
        <div className="absolute top-32 right-16 opacity-10 animate-float-slow" style={{ animationDelay: '1s' }}>
          <div className="w-1 h-1 bg-accent rounded-full"></div>
        </div>
        <div className="absolute bottom-32 left-20 opacity-10 animate-float-slow" style={{ animationDelay: '2s' }}>
          <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
        </div>
        <div className="absolute bottom-40 right-24 opacity-10 animate-float-slow" style={{ animationDelay: '1.5s' }}>
          <div className="w-1 h-1 bg-accent rounded-full"></div>
        </div>
      </section>
      {/* Section 1: Elegant Cover with Quote */}
      {/* <section className="h-screen flex items-center justify-center relative bg-white overflow-hidden">
        <div className="text-center space-y-12 sm:space-y-16 w-full max-w-md mx-auto px-4" data-animate id="section-1">
          <div
            className={`space-y-4 transition-all duration-1000 ${isElementVisible("section-1") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
              }`}
            style={{ animationDelay: "0.2s" }}
          >
            <p
              className="text-lg sm:text-xl text-gray-600 italic leading-relaxed font-light"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              "Nếu Đức Chúa Trời yêu thương chúng ta như thế, chúng cũng phải yêu thương nhau."
            </p>
            <p className="text-sm text-gray-500 font-light" style={{ fontFamily: "Playfair Display, serif" }}>
              (1 Giăng 4:11)
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            <div
              className={`space-y-6 sm:space-y-8 transition-all duration-1000 ${isElementVisible("section-1") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                }`}
              style={{ animationDelay: "0.4s" }}
            >
              <h1
                className="text-4xl sm:text-5xl text-primary font-light tracking-[0.1em]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                JOIN ÂN
              </h1>

              <div
                className={`flex items-center justify-center space-x-6 sm:space-x-8 transition-all duration-1000 ${isElementVisible("section-1") ? "animate-scale-in opacity-100" : "opacity-0 scale-90"
                  }`}
                style={{ animationDelay: "0.6s" }}
              >
                <div className="w-16 sm:w-20 h-px bg-gray-300"></div>
                <div className="relative">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 relative">
                    <div className="absolute top-0 w-px h-6 sm:h-8 bg-gray-400 transform -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-0 w-6 sm:w-8 h-px bg-gray-400 transform -translate-y-1/2"></div>
                  </div>
                  <div className="absolute -top-1 -right-2">
                    <div className="w-3 sm:w-4 h-3 sm:h-4 border border-accent rounded-full animate-pulse-gentle"></div>
                    <div
                      className="w-2.5 sm:w-3 h-2.5 sm:h-3 border border-accent rounded-full absolute top-0.5 left-1.5 sm:left-2 animate-pulse-gentle"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 sm:w-20 h-px bg-gray-300"></div>
              </div>

              <h2
                className="text-4xl sm:text-5xl text-primary font-light tracking-[0.1em]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                CÁT HẠ
              </h2>
            </div>

            <div
              className={`text-2xl sm:text-3xl text-gray-600 font-light tracking-[0.1em] transition-all duration-1000 ${isElementVisible("section-1") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                }`}
              style={{ fontFamily: "Playfair Display, serif", animationDelay: "0.8s" }}
            >
              27.09.2025
            </div>
          </div>

          <div
            className={`space-y-6 transition-all duration-1000 ${isElementVisible("section-1") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
              }`}
            style={{ animationDelay: "1s" }}
          >
            <div className="flex items-center justify-center space-x-4 sm:space-x-6">
              <div className="w-20 sm:w-24 h-px bg-gray-300"></div>
              <span
                className="text-sm text-gray-600 tracking-[0.15em] font-light"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                KÍNH MỜI
              </span>
              <div className="w-20 sm:w-24 h-px bg-gray-300"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 transform -translate-x-1/2 animate-bounce-gentle">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </section> */}

      {/* Section 2: Huy Vang với background số ngày */}
      <section className="h-screen flex items-center justify-center relative bg-white overflow-hidden">
        {/* Background Numbers - Large and Faded with Ocean Wave Effect */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div
            className={`text-center opacity-[0.08] transition-all duration-2000 ${currentSection >= 2 ? "animate-ocean-wave" : ""
              }`}
          >
            <div
              className="text-[200px] sm:text-[300px] font-light text-gray-700 leading-[0.8] animate-wave-ripple"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              27
            </div>
            <div
              className="text-[200px] sm:text-[300px] font-light text-gray-700 leading-[0.8] animate-ocean-wave-delay-1"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              09
            </div>
            <div
              className="text-[200px] sm:text-[300px] font-light text-gray-700 leading-[0.8] animate-ocean-wave-delay-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              25
            </div>
          </div>
        </div>

        {/* Floating Bubble Elements */}
        <div className="absolute top-20 left-10 opacity-20 animate-bubble-float">
          <div className="w-4 h-4 bg-accent rounded-full"></div>
        </div>
        <div className="absolute top-32 right-16 opacity-15 animate-bubble-float-delay-1">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
        </div>
        <div className="absolute bottom-32 left-20 opacity-20 animate-bubble-float-delay-2">
          <div className="w-5 h-5 bg-accent rounded-full"></div>
        </div>
        <div className="absolute bottom-40 right-24 opacity-15 animate-bubble-float">
          <div className="w-2 h-2 bg-accent rounded-full"></div>
        </div>

        {/* Couple Names - Foreground with Zoom In and Dreamy Float */}
        <div className="text-center space-y-8 sm:space-y-12 z-10 px-4" data-animate id="section-2">
          <h1
            className={`text-6xl sm:text-8xl text-primary font-normal transition-all duration-1000 ${isElementVisible("section-2") ? "animate-zoom-in-bounce" : "opacity-0 scale-0.3"
              }`}
            style={{ fontFamily: "Playfair Display, serif", fontSize: "100px"  }}
          >
            Ân
          </h1>
         <p className={`text-8xl sm:text-8xl text-primary mb-4 font-ooohbaby transition-all duration-1000 ${isElementVisible("section-2") ? "animate-dreamy-float" : "opacity-0"}`} style={{ animationDelay: "0.3s" }}>
            &
          </p>
          <h2
            className={`text-6xl sm:text-8xl text-primary font-normal transition-all duration-1000 ${isElementVisible("section-2") ? "animate-zoom-in-bounce" : "opacity-0 scale-0.3"
              }`}
            style={{ fontFamily: "Playfair Display, serif", animationDelay: "0.6s", fontSize: "100px" }}
          >
            Hạ
          </h2>
        </div>

        {/* Scroll Indicator with Gentle Bounce */}
        <div className="absolute bottom-12 transform -translate-x-1/2 animate-gentle-bounce z-10">
          <ChevronDown className="w-6 h-6 text-gray-300" />
        </div>
      </section>

      {/* Section 3: Clean Wedding Invitation */}
      <section className="min-h-screen flex items-center justify-center bg-gray-50 py-3 sm:py-16">
        <div className="w-full max-w-md mx-auto px-2" data-animate id="section-3">
          <div
            className={`text-center space-y-8 bg-white border border-gray-300 rounded-lg py-8 px-4 sm:p-10 shadow-sm transition-all duration-1000 ${isElementVisible("section-3") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
              }`}
          >
            {/* Decorative Wreath Header - Positioned to overlap border */}
            {/* <div className="relative -mt-12 mb-8">
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/3">
                <div className="relative">
                  
                  <div className="relative z-10">
                    <div className="bg-white rounded-full p-2 inline-block">
                      <img 
                        src="/images/logo2.PNG"
                        alt="Wedding Logo"
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="text-center">
                <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide" style={{ fontFamily: "Playfair Display, serif" }}>
                  Nhà Trai
                </h4>
                <div className="text-xs text-gray-600 space-y-3" style={{ fontFamily: "Playfair Display, serif" }}>
                  <p className="font-medium text-[10px] leading-tight">Ông: ...</p>
                  <p className="font-medium text-[10px] leading-tight">Bà: ...</p>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide" style={{ fontFamily: "Playfair Display, serif" }}>
                  Nhà Gái
                </h4>
                <div className="text-xs text-gray-600 space-y-3" style={{ fontFamily: "Playfair Display, serif" }}>
                  <p className="font-medium text-[10px] leading-tight">Ông: ...</p>
                  <p className="font-medium text-[10px] leading-tight">Bà: ...</p>
                </div>
              </div>
            </div>

            {/* Announcement */}
            <div className="mb-10">
              <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide" style={{ fontFamily: "Playfair Display, serif" }}>
                Trân Trọng Báo Tin
              </p>
              <p className="text-xs text-gray-600 leading-relaxed" style={{ fontFamily: "Playfair Display, serif" }}>
                Lễ Thành Hôn Của Con Chúng Tôi
              </p>
            </div>

            {/* Couple Names */}
            <div className="mb-10">
              <h3 className="text-2xl sm:text-2xl text-primary font-light font-greatvibes mb-3 leading-tight">
                Join Ân
              </h3>
              <p className="text-xs text-gray-500 mb-4 flex items-center justify-center space-x-2" style={{ fontFamily: "Playfair Display, serif" }}>
                <span>Quý Nam</span>
                <img 
                  src="/images/ring.PNG"
                  alt="Wedding Ring"
                  className="w-4 h-4 object-contain"
                />
                <span>Trưởng Nữ</span>
              </p>
              <h3 className="text-2xl sm:text-2xl text-primary font-light font-greatvibes leading-tight">
                Cát Hạ
              </h3>
            </div>

            {/* Wedding Details */}
            <div className="space-y-8">
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide" style={{ fontFamily: "Playfair Display, serif" }}>
                  Hôn Lễ Được Cử Hành
                </p>
                <p className="text-base font-medium text-primary mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  Vào Lúc 17:30, Thứ 7 - 27.09.2025
                </p>
                <p className="text-xs text-gray-500 italic" style={{ fontFamily: "Playfair Display, serif" }}>
                  Nhằm ngày 06 tháng 08 năm Ất Tỵ
                </p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide" style={{ fontFamily: "Playfair Display, serif" }}>
                  Tại Nhà Hàng
                </p>
                <p className="text-base font-medium text-primary mb-2 " style={{ fontFamily: "Playfair Display, serif" }}>
                  ABC
                </p>
                <p className="text-xs text-gray-600 " style={{ fontFamily: "Playfair Display, serif" }}>
                  (793/57/16 Trần Xuân Soạn, Phường Tân Hưng, Quận 7)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Wedding Photo Album Layout */}
      <section className="min-h-screen flex items-center justify-center bg-white py-8 sm:py-16">
        <div className="w-full max-w-sm mx-auto text-center px-4" data-animate id="section-4">
          <div
            className={`space-y-4 sm:space-y-6 mb-8 sm:mb-12 transition-all duration-1000 ${isElementVisible("section-4") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
              }`}
          >
            <h2
              className="text-6xl sm:text-4xl text-primary font-light tracking-wide font-ooohbaby"
              // style={{ fontFamily: "Playfair Display, serif" }}
            >
              Album Ảnh Cưới
            </h2>
            <p className="text-sm text-gray-600 tracking-widest font-light" style={{ fontFamily: "Playfair Display, serif" }}>NHỮNG KHOẢNH KHẮC ĐẸP NHẤT</p>
            <div className="w-full h-px bg-gray-300"></div>
          </div>

          {/* Photo Layout */}
          <div className="space-y-4 sm:space-y-6">
            {/* Three Photos Layout */}
            <div
              className={`grid grid-cols-3 gap-2 transition-all duration-1000 ${isElementVisible("section-4") ? "animate-stagger-up opacity-100" : "opacity-0 translate-y-8"
                }`}
              style={{ animationDelay: "0.2s" }}
            >
              {/* Left Photo */}
              <div className="relative group">
                <div className="w-full h-24 sm:h-32 rounded-lg bg-white shadow-sm overflow-hidden border border-gray-200">
                  <img
                    src={weddingImages.albumPhotos[0] || "/placeholder.svg"}
                    alt="Ảnh cưới 1"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Center Photo - Larger */}
              <div className="relative group">
                <div className="w-full h-32 sm:h-40 rounded-lg bg-white shadow-sm overflow-hidden border border-gray-200">
                  <img
                    src={weddingImages.albumPhotos[1] || "/placeholder.svg"}
                    alt="Ảnh cưới 2"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Right Photo */}
              <div className="relative group">
                <div className="w-full h-24 sm:h-32 rounded-lg bg-white shadow-sm overflow-hidden border border-gray-200">
                  <img
                    src={weddingImages.albumPhotos[2] || "/placeholder.svg"}
                    alt="Ảnh cưới 3"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>

            {/* Additional Album Photos */}
            <div
              className={`grid grid-cols-2 gap-3 transition-all duration-1000 ${isElementVisible("section-4") ? "animate-stagger-up opacity-100" : "opacity-0 translate-y-8"
                }`}
              style={{ animationDelay: "0.4s" }}
            >
              <div className="relative group">
                <div className="w-full h-24 sm:h-32 rounded-lg bg-white shadow-sm overflow-hidden border border-gray-200">
                  <img
                    src={weddingImages.albumPhotos[3] || "/placeholder.svg"}
                    alt="Ảnh cưới 4"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="relative group">
                <div className="w-full h-24 sm:h-32 rounded-lg bg-white shadow-sm overflow-hidden border border-gray-200">
                  <img
                    src={weddingImages.albumPhotos[4] || "/placeholder.svg"}
                    alt="Ảnh cưới 5"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>

            {/* Event Title */}


            {/* Date Display */}


            {/* View More Button */}
            <div
              className={`pt-6 transition-all duration-1000 ${isElementVisible("section-4") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                }`}
              style={{ animationDelay: "1s" }}
            >
              <Button
                onClick={() => setShowGallery(true)}
                className="bg-primary hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-light transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center space-x-2 font-ephesis" style={{ fontFamily: "Playfair Display, serif" }} >
                  <span >Xem Thêm Ảnh</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Calendar */}
      <section className="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-16">
        <div className="w-full max-w-md mx-auto text-center px-4" data-animate id="section-5">
          <div className="space-y-6 sm:space-y-10">
            {/* Event Title */}
            <div
              className={`space-y-2 transition-all duration-1000 ${isElementVisible("section-5") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                }`}
            >
              <h2
                className="text-xl sm:text-2xl text-primary font-light tracking-wide font-ooohbaby"
                // style={{ fontFamily: "Playfair Display, serif" }}
              >
                TIỆC MỪNG LỄ THÀNH HÔN
              </h2>
            </div>

            {/* Time */}
            <div
              className={`space-y-4 sm:space-y-6 transition-all duration-1000 ${isElementVisible("section-5") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                }`}
              style={{ animationDelay: "0.2s" }}
            >
              <p className="text-lg sm:text-xl text-primary" style={{ fontFamily: "Playfair Display, serif" }}>
                Vào Lúc <span className="font-medium">18H00 - THỨ BẢY</span>
              </p>

              {/* Date Display with Dividers */}
              <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                <div className="text-center">
                  <p className="text-lg sm:text-xl text-gray-600 font-ooohbaby">
                    Tháng 09
                  </p>
                </div>
                <div className="h-8 sm:h-12 w-px bg-gray-300"></div>
                <div className="text-center">
                  <p
                    className="text-4xl sm:text-5xl text-primary font-light animate-pulse-gentle"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    27
                  </p>
                </div>
                <div className="h-8 sm:h-12 w-px bg-gray-300"></div>
                <div className="text-center">
                  <p className="text-lg sm:text-xl text-gray-600" style={{ fontFamily: "Playfair Display, serif" }}>
                    2025
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500 italic" style={{ fontFamily: "Playfair Display, serif" }}>
                (Tức Ngày 06 Tháng 08 Năm Ất Tỵ)
              </p>
            </div>

            {/* Calendar Header */}
            <div
              className={`flex items-end space-x-2 justify-center transition-all duration-1000 ${isElementVisible("section-5") ? "animate-scale-in opacity-100" : "opacity-0 scale-90"
                }`}
              style={{ animationDelay: "0.4s" }}
            >
              <h3
                className="text-4xl sm:text-4xl text-gray-600 italic font-light font-ooohbaby"
                // style={{ fontFamily: "Playfair Display, serif" }}
              >
                Tháng 9
              </h3>
              <h3
                className="text-4xl sm:text-6xl text-primary font-light mb-[-5px]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                2025
              </h3>
            </div>

            {/* Calendar Grid */}
            <div
              className={`border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-1000 ${isElementVisible("section-5") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                }`}
              style={{ animationDelay: "0.6s" }}
            >
              {/* Days of Week */}
              <div className="grid grid-cols-7">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, index) => (
                  <div key={day} className="p-2 text-xs font-medium text-white text-center bg-primary">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7">
                {/* Actual days */}
                {Array.from({ length: 30 }, (_, i) => {
                  const date = i + 1
                  const isWeddingDay = date === 27
                  return (
                    <div
                      key={date}
                      className={`p-3 sm:p-4 text-center border border-gray-100 relative transition-all duration-300 hover:bg-accent-light ${isWeddingDay ? "bg-accent-light" : ""}`}
                    >
                      <span className={` font-ooohbaby text-sm ${isWeddingDay ? "text-primary font-medium" : "text-gray-500"}`}>
                        {date}
                      </span>

                      {isWeddingDay && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 sm:w-10 h-8 sm:h-10 border-2 border-accent rounded-full absolute animate-pulse-gentle"></div>
                          <svg
                            className="absolute -bottom-1 -right-1 w-5 sm:w-6 h-5 sm:h-6 text-accent animate-heartbeat"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Decorative Footer */}
            <div
              className={`relative h-8 mt-6 sm:mt-8 flex items-center justify-center transition-all duration-1000 ${isElementVisible("section-5") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                }`}
              style={{ animationDelay: "0.8s" }}
            >
              <div className="w-full h-px bg-gray-300"></div>
              <div className="absolute right-4 bg-gray-50 px-2">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-pulse-gentle">
                  <Heart className="w-3 h-3 text-white fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Enhanced RSVP */}
      <section className="min-h-screen flex items-center justify-center bg-white py-8 sm:py-16">
        <div className="w-full max-w-lg mx-auto px-4" data-animate id="section-6">
          {/* Header with elegant design */}
          <div
            className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${isElementVisible("section-6") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
              }`}
          >
            <div className="relative">
              <h2
                className="text-3xl sm:text-4xl text-primary font-light tracking-wide mb-4 sm:mb-6 font-ooohbaby"
                // style={{ fontFamily: "Playfair Display, serif" }}
              >
                Xác Nhận Tham Gia
              </h2>

              {/* Decorative elements */}
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
                <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
                <div className="relative">
                  <Heart className="w-5 sm:w-6 h-5 sm:h-6 text-accent fill-current animate-heartbeat" />
                  <div className="absolute -inset-2 bg-accent-light rounded-full opacity-20 animate-ping"></div>
                </div>
                <div className="w-16 sm:w-20 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
              </div>

              <p
                className="text-gray-600 text-base sm:text-lg font-light leading-relaxed"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Sự hiện diện của bạn sẽ làm cho ngày đặc biệt của chúng tôi trở nên hoàn hảo hơn
              </p>
            </div>
          </div>

          {/* Enhanced RSVP Card */}
        {/* RSVP Form Component */}
        <div
            className={`transition-all duration-1000 ${
              isElementVisible("section-6") ? "animate-scale-in opacity-100" : "opacity-0 scale-90"
            }`}
            style={{ animationDelay: "0.3s" }}
          >
            <RSVPForm 
              onSubmit={async (data) => {
                // This is where you'll integrate Google Sheets later
                console.log("RSVP Data:", data)
              }}
            />
          </div>

          {/* Additional Info */}
          <div
            className={`text-center mt-6 sm:mt-8 transition-all duration-1000 ${isElementVisible("section-6") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
              }`}
            style={{ animationDelay: "0.6s" }}
          >
            <p className="text-gray-500 text-sm font-light">
              Vui lòng xác nhận trước ngày <span className="font-medium text-primary">20/09/2025</span>
            </p>
          </div>
        </div>
      </section>

      {/* Section 7: Map Location */}
      <section className="min-h-screen flex items-center justify-center bg-gray-50 py-8 sm:py-16">
        <div className="w-full max-w-lg mx-auto text-center px-4" data-animate id="section-7">
          {/* Header */}
          <div
            className={`space-y-4 sm:space-y-6 mb-8 sm:mb-12 transition-all duration-1000 ${isElementVisible("section-7") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
              }`}
          >
            <h2
              className="text-3xl sm:text-4xl text-primary font-light tracking-wide font-ooohbaby"
              // style={{ fontFamily: "Playfair Display, serif" }}
            >
              Địa Điểm Tổ Chức
            </h2>
            <div className="flex items-center justify-center space-x-4 sm:space-x-6">
              <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse-gentle"></div>
              <div className="w-16 sm:w-20 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>
          </div>

          {/* Location Info Card */}
          <Card
            className={`bg-white border border-gray-200 rounded-3xl shadow-xl mb-6 sm:mb-8 overflow-hidden transition-all duration-1000 ${
              isElementVisible("section-7") ? "animate-scale-in opacity-100" : "opacity-0 scale-90"
            }`}
            style={{ animationDelay: "0.3s" }}
          >
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-4 sm:space-y-6">
                {/* Venue Name */}
                <div className="text-center">
                  <h3
                    className="text-xl sm:text-2xl font-medium text-primary mb-2"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    NHÀ HÀNG SUNNY FARM
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg">173/1 Bình Lợi, Phường 13, Quận Bình Thạnh</p>
                  <p className="text-gray-500 text-sm sm:text-base mt-2">Thành phố Hồ Chí Minh</p>
                </div>

                {/* Map - Real Google Maps */}
                <div className="relative group">
                  <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0234567890123!2d106.7123456789!3d10.8123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ4JzQ0LjQiTiAxMDbCsDQyJzQ0LjQiRQ!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Bản đồ Nhà Hàng Sunny Farm"
                      className="transition-all duration-300 group-hover:brightness-110"
                    />
                    
                    {/* Overlay for better interaction */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 text-primary font-medium shadow-lg">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>Xem toàn màn hình</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Updated with real functionality */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <Button
                    onClick={() => window.open('https://www.google.com/maps/dir//173%2F1+B%C3%ACnh+L%E1%BB%A3i%2C+Ph%C6%B0%E1%BB%9Dng+13%2C+B%C3%ACnh+Th%E1%BA%A1nh%2C+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh', '_blank')}
                    variant="outline"
                    className="flex items-center justify-center space-x-2 py-2 sm:py-3 rounded-xl border-2 border-gray-200 hover:border-accent hover:bg-accent-light transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-primary font-medium text-sm sm:text-base">Chỉ Đường</span>
                  </Button>

                  <Button
                    onClick={() => window.open('tel:+84123456789', '_self')}
                    variant="outline"
                    className="flex items-center justify-center space-x-2 py-2 sm:py-3 rounded-xl border-2 border-gray-200 hover:border-accent hover:bg-accent-light transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-primary font-medium text-sm sm:text-base">Gọi Điện</span>
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Thời gian:</span>
                    <span className="text-primary text-sm sm:text-base">18:00 - 22:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Ngày:</span>
                    <span className="text-primary text-sm:text-base">Thứ Bảy, 14/06/2025</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Dress code:</span>
                    <span className="text-primary text-sm:text-base">Trang trọng</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Note */}
          <div
            className={`text-center transition-all duration-1000 ${isElementVisible("section-7") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
              }`}
            style={{ animationDelay: "0.6s" }}
          >
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Nhà hàng có bãi đỗ xe rộng rãi và thuận tiện
              <br />
              Vui lòng đến đúng giờ để không bỏ lỡ những khoảnh khắc đặc biệt
            </p>
          </div>
        </div>
      </section>

      {/* Section 8: Well Wishes & Gifts */}
      <section className="min-h-screen flex items-center justify-center bg-white py-8 sm:py-16">
        <div className="w-full max-w-lg mx-auto space-y-8 sm:space-y-12 px-4" data-animate id="section-8">
          {/* <div className="text-center">
            <div
              className={`space-y-4 sm:space-y-6 mb-8 sm:mb-12 transition-all duration-1000 ${isElementVisible("section-8") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                }`}
            >
              <h2
                className="text-2xl sm:text-3xl text-primary font-light tracking-wide font-ooohbaby"
              >
                Gửi Lời Chúc
              </h2>
              <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                <div className="w-12 sm:w-16 h-px bg-gray-300"></div>
                <MessageCircle className="w-4 h-4 text-accent animate-pulse-gentle" />
                <div className="w-12 sm:w-16 h-px bg-gray-300"></div>
              </div>
            </div>

            <Card
              className={`bg-white border border-gray-200 rounded-2xl shadow-sm mb-6 sm:mb-8 transition-all duration-1000 ${isElementVisible("section-8") ? "animate-scale-in opacity-100" : "opacity-0 scale-90"
                }`}
              style={{ animationDelay: "0.3s" }}
            >
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleWishSubmit} className="space-y-4">
                  <Textarea
                    placeholder="Gửi lời chúc mừng đến cặp đôi..."
                    value={wishForm}
                    onChange={(e) => setWishForm(e.target.value)}
                    className="border-gray-200 focus:border-accent rounded-xl min-h-[100px] sm:min-h-[120px] text-sm transition-all duration-300"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-gray-800 text-white rounded-xl font-light transition-all duration-300 transform hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    GỬI LỜI CHÚC
                  </Button>
                </form>
              </CardContent>
            </Card>

            {wishes.length > 0 && (
              <div
                className={`space-y-3 sm:space-y-4 transition-all duration-1000 ${isElementVisible("section-8") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                  }`}
                style={{ animationDelay: "0.6s" }}
              >
                <h3
                  className="text-base sm:text-lg text-primary font-light"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Lời Chúc Từ Bạn Bè
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {wishes.map((wish, index) => (
                    <Card
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm animate-slide-up"
                    >
                      <CardContent className="p-3 sm:p-4">
                        <p className="text-gray-600 italic text-sm font-light">"{wish}"</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div> */}

          <div className="text-center">
            <div
              className={`space-y-4 sm:space-y-6 mb-8 sm:mb-12 transition-all duration-1000 ${isElementVisible("section-8") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                }`}
              style={{ animationDelay: "0.4s" }}
            >
              <h2
                className="text-2xl sm:text-3xl text-primary font-light tracking-wide font-ooohbaby"
                // style={{ fontFamily: "Playfair Display, serif" }}
              >
                Món Quà Yêu Thương
              </h2>
              <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                <div className="w-12 sm:w-16 h-px bg-gray-300"></div>
                <Gift className="w-4 h-4 text-accent animate-pulse-gentle" />
                <div className="w-12 sm:w-16 h-px bg-gray-300"></div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <p
                className={`font-manrope text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm font-light transition-all duration-1000 ${isElementVisible("section-8") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                  }`}
                style={{ fontFamily: "Playfair Display, serif", animationDelay: "0.6s" }}
              >
                Nếu bạn muốn gửi một món quà nhỏ để chúc mừng hạnh phúc của chúng tôi, bạn có thể chuyển khoản qua thông
                tin sau:
              </p>

              {/* Banking Information Cards */}
              {bankingInfo.map((bank, index) => (
                <Card
                  key={index}
                  className={`bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden transition-all duration-1000 ${isElementVisible("section-8") ? "animate-stagger-up opacity-100" : "opacity-0 translate-y-8"
                    }`}
                  style={{ animationDelay: `${0.8 + index * 0.2}s` }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {/* Bank Name Header */}
                      <div className="text-center border-b border-gray-100 pb-3">
                        <h4
                          className="text-lg font-medium text-primary"
                          style={{ fontFamily: "Playfair Display, serif" }}
                        >
                          {bank.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{bank.bank}</p>
                      </div>

                      {/* Compact Mobile Layout */}
                      <div className="space-y-4">
                        {/* QR Code - Centered */}
                        {/* <div className="flex justify-center">
                          <div className="bg-white p-3 rounded-xl border-2 border-gray-200 shadow-sm">
                            <img
                              src={bank.qrCode || "/placeholder.svg"}
                              alt={`QR Code ${bank.name}`}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src =
                                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2Y5ZmFmYiIgc3Ryb2tlPSIjZTVlN2ViIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSI2NCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY5NzU4ZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD4KPC9PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY5NzU4ZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD4KPC9zdmc+"
                              }}
                            />
                          </div>
                        </div> */}

                        {/* Banking Details - Compact */}
                        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Ngân hàng:</span>
                            <span className="text-sm text-primary font-medium">{bank.bank}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">STK:</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-primary font-mono font-medium">{bank.accountNumber}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(bank.accountNumber, `account-${index}`)}
                                className="h-6 w-6 p-0 border-gray-300 hover:border-accent hover:bg-accent-light transition-all duration-300"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {copiedAccount === `account-${index}` && (
                            <div className="text-center">
                              <div className="text-xs text-accent font-medium animate-fade-in-up">✓ Đã sao chép!</div>
                            </div>
                          )}
                        </div>

                        {/* Note */}
                        <div className="text-center">
                          <p className="text-xs text-gray-500 leading-relaxed">
                            Chuyển khoản theo thông tin: Tên của bạn
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <p
                className={`text-gray-500 mt-4 sm:mt-6 italic text-sm font-light transition-all duration-1000 ${isElementVisible("section-8") ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                  }`}
                style={{ fontFamily: "Playfair Display, serif", animationDelay: "1.4s" }}
              >
                Đây là tùy chọn, sự hiện diện của bạn là món quà quý giá nhất!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Component */}
      <PhotoGallery isOpen={showGallery} onClose={() => setShowGallery(false)} photos={weddingImages.albumPhotos} />

      {/* Hidden Background Music */}
      {/* {backgroundMusic && (
        <iframe
          src="https://www.youtube.com/embed/XqgyD0yadH0?autoplay=1&loop=1&playlist=XqgyD0yadH0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&cc_load_policy=0&start=0&end=0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="fixed -top-96 -left-96 w-1 h-1 opacity-0 pointer-events-none z-0"
          title="Background Music"
        />
      )} */}
    </div>
  )
}

