'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ArrowRight, CreditCard, Zap, Code } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useAnimation, useScroll, Variant, AnimatePresence } from 'framer-motion';

export default function Home() {
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const [isInView, setIsInView] = useState(false);
  const [particles, setParticles] = useState<Array<{left: string, top: string, color: string}>>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 남은 시간 (초) - 5초에서 10초로 변경
  const [isPaused, setIsPaused] = useState(false); // 타이머 일시 정지 상태
  
  // 카드 자동 전환 타이머
  useEffect(() => {
    // Why ColumnPay 섹션에서만 자동 전환이 작동하도록 설정
    if (activeSection !== 3) return;
    
    // 초기 타이머 설정
    setTimeLeft(10); // 5초에서 10초로 변경
    
    // 타이머 업데이트 간격 (1초)
    const timerInterval = setInterval(() => {
      if (!isPaused) { // 일시 정지 상태가 아닐 때만 타이머 진행
        setTimeLeft(prev => {
          // 0초가 되면 다음 카드로 넘어감
          if (prev <= 1) {
            // 다음 카드로 바로 넘어가지 않고, 별도 interval에서 처리
            return 10; // 5초에서 10초로 변경
          }
          return prev - 1;
        });
      }
    }, 1000);
    
    // 카드 전환 간격 (10초)
    const cardInterval = setInterval(() => {
      if (!isPaused) { // 일시 정지 상태가 아닐 때만 카드 전환
        setActiveCard((prev) => (prev + 1) % 3); // 3개의 카드를 순환
        setTimeLeft(10); // 타이머 초기화 - 5초에서 10초로 변경
      }
    }, 10000); // 5000ms에서 10000ms로 변경
    
    return () => {
      clearInterval(timerInterval);
      clearInterval(cardInterval);
    };
  }, [activeSection, isPaused]);

  // activeCard가 변경될 때마다 타이머 초기화
  useEffect(() => {
    if (activeSection === 3) {
      setTimeLeft(10);
    }
  }, [activeCard, activeSection]);

  // timeLeft가 변경될 때 프로그레스 애니메이션 업데이트
  const progressControls = useAnimation();
  
  useEffect(() => {
    progressControls.start({
      pathLength: timeLeft / 10, // 분모를 5에서 10으로 변경
      transition: { duration: 0.8, ease: "easeOut" }
    });
  }, [timeLeft, progressControls]);

  // 스크롤 이벤트에 따라 네비게이션 바 애니메이션 제어
  useEffect(() => {
    const updateNavBackground = () => {
      if (scrollY.get() > 50) {
        controls.start('scrolled');
      } else {
        controls.start('top');
      }
    };

    const unsubscribe = scrollY.onChange(updateNavBackground);
    updateNavBackground(); // 초기 상태 설정

    return () => unsubscribe();
  }, [controls, scrollY]);

  // 클라이언트 사이드에서만 파티클 생성
  useEffect(() => {
    // 20개의 파티클 정보 생성
    const newParticles = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      color: `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 100)}, 255, 0.8)`
    }));
    
    setParticles(newParticles);
  }, []);

  // 네비게이션 바 애니메이션 변형
  const navVariants = {
    top: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      boxShadow: 'none',
      height: '80px',
      padding: '1rem 0',
      backdropFilter: 'none',
    },
    scrolled: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      height: '60px',
      padding: '0.5rem 0',
    },
  };

  // 헤더 컨테이너 애니메이션 변형
  const containerVariants = {
    top: {
      maxWidth: '90%',
      width: '1200px',
    },
    scrolled: {
      maxWidth: '80%',
      width: '1000px',
    },
  };

  // 로고 애니메이션 변형
  const logoVariants = {
    top: {
      width: "30px",
      height: "30px",
    },
    scrolled: {
      width: "24px",
      height: "24px",
    },
  };

  // 로고 텍스트 애니메이션 변형
  const logoTextVariants = {
    top: {
      fontSize: "1.5rem",
    },
    scrolled: {
      fontSize: "1.25rem",
    },
  };

  // 히어로 섹션 애니메이션
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // 문자별 애니메이션 변형
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.04,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // 부유하는 애니메이션 효과
  const floatVariants = {
    initial: { y: 0 },
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut",
      },
    },
  };

  // 파티클 애니메이션
  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i) => ({
      opacity: [0, 0.8, 0],
      scale: [0, 1, 0],
      x: (i % 2 === 0) ? 50 : -50,
      y: -50,
      transition: {
        delay: i * 0.3,
        duration: 3,
        repeat: Infinity,
        repeatDelay: (i % 5) * 0.4,
      },
    }),
  };

  // 버튼 애니메이션
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.8, 
        duration: 0.5, 
        ease: "backOut"
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 0px 25px rgba(255, 255, 255, 0.5)",
      borderRadius: "9999px",
      transition: {
        duration: 0.3,
        yoyo: Infinity,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.95, 
      boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.3)",
      borderRadius: "9999px"
    },
  };

  // 특수 효과 배지 애니메이션
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0, rotateZ: -20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateZ: 0,
      transition: { 
        delay: 1,
        duration: 0.7, 
        type: "spring",
        stiffness: 200
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      boxShadow: [
        "0px 0px 0px rgba(255, 215, 0, 0.5)",
        "0px 0px 20px rgba(255, 215, 0, 0.8)",
        "0px 0px 0px rgba(255, 215, 0, 0.5)"
      ],
      borderRadius: "9999px",
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const,
      }
    }
  };

  // 섹션 스크롤 처리 함수
  const scrollToSection = (index: number) => {
    const sectionId = `section-${index}`;
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(index);
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-black to-purple-900 text-white h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth scroll-pt-0">
      {/* 네비게이션 바 */}
      <motion.nav 
        className="fixed w-full z-50 flex items-center justify-center"
        initial="top"
        animate={controls}
        variants={navVariants}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className="flex items-center justify-between"
          variants={containerVariants}
          initial="top"
          animate={controls}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <motion.svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                variants={logoVariants}
                animate={controls}
                transition={{ duration: 0.4 }}
                initial="top"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="white"/>
              </motion.svg>
              <motion.span 
                className="font-bold"
                variants={logoTextVariants}
                animate={controls}
                transition={{ duration: 0.4 }}
                initial="top"
              >
                ColumnPay
              </motion.span>
            </Link>
          </div>
          
          {/* 섹션 인디케이터 추가 */}
          <motion.div 
            className="fixed right-4 md:right-8 top-[calc(50%_-_100px)] transform -translate-y-1/2 flex flex-col space-y-3 bg-gray-900/50 backdrop-blur-md rounded-full px-2 py-4 z-50 border border-gray-700/30"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((index) => (
              <motion.button
                key={index}
                className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all duration-300 ${
                  activeSection === index 
                    ? 'bg-blue-500 h-5 md:h-6' 
                    : 'bg-gray-500 hover:bg-gray-400'
                }`}
                onClick={() => scrollToSection(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`스크롤 섹션 ${index + 1}`}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.nav>

      {/* 히어로 섹션 */}
      <motion.section 
        className="min-h-screen w-full flex flex-col items-center justify-center relative snap-start snap-always"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        onViewportEnter={() => {
          setIsInView(true);
          setActiveSection(0);
        }}
        id="section-0"
      >
        {/* 파티클 배경 효과 - 클라이언트 사이드에서만 렌더링 */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-blue-500 opacity-0"
              custom={i}
              variants={particleVariants}
              animate={isInView ? "visible" : "hidden"}
              style={{
                left: particle.left,
                top: particle.top,
                backgroundColor: particle.color,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight relative"
              variants={itemVariants}
            >
              {/* 첫번째 줄, 글자별 애니메이션 */}
              <div className="flex justify-center flex-wrap">
                {"3분만에 연동하는".split("").map((char, index) => (
                  <motion.span
                    key={`first-${index}`}
                    variants={letterVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    custom={index}
                    className="inline-block"
                    style={{ textShadow: "0px 0px 10px rgba(59, 130, 246, 0.5)" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
              <div className="h-2"></div>
              {/* 두번째 줄, 글자별 애니메이션 */}
              <div className="flex justify-center flex-wrap">
                {"가장 쉬운 구독 결제".split("").map((char, index) => (
                  <motion.span
                    key={`second-${index}`}
                    variants={letterVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    custom={index + 10} // 첫 줄 이후 딜레이
                    className="inline-block"
                    style={{ textShadow: "0px 0px 10px rgba(59, 130, 246, 0.5)" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-2xl mt-10"
              initial="initial"
              animate={isInView ? "float" : "initial"}
              variants={floatVariants}
            >
              복잡한 구독·빌링결제를 가장 빠르고 안정적으로<br />
              구축할 수 있는 단 하나의 노코드 솔루션
            </motion.p>
            
            <motion.div
              className="relative mb-12"
              variants={badgeVariants}
              initial="hidden"
              animate={isInView ? ["visible", "pulse"] : "hidden"}
            >
              <motion.p 
                className="text-yellow-400 px-6 py-2 bg-yellow-900/20 rounded-full border border-yellow-500/30"
              >
                선착순 100명에게 3개월 무료 사용권 제공
              </motion.p>
              {/* 스파클 효과 */}
              <motion.span
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
              {/* 테두리 빛나는 효과 */}
              <motion.div
                className="absolute -inset-0.5 rounded-full bg-yellow-400/30 blur-sm -z-10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            </motion.div>
            
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover="hover"
              whileTap="tap"
              className="relative"
            >
              <Button className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg border-none relative z-10 overflow-hidden group">
                <span className="relative z-10">사전예약 신청</span>
                <motion.span 
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                  initial={{ scale: 0, x: "-50%", y: "-50%" }}
                  whileHover={{ scale: 3 }}
                  transition={{ duration: 0.5 }}
                  style={{ left: "50%", top: "50%", originX: "50%", originY: "50%" }}
                />
              </Button>
              {/* 광선 효과 */}
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-70 blur-md -z-10"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                whileHover={{
                  opacity: 0.9,
                  scale: 1.1
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Feature Showcase */}
      <motion.section 
        className="min-h-screen w-full relative overflow-hidden snap-start snap-always flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        onViewportEnter={() => setActiveSection(1)}
        id="section-1"
      >
        {/* 배경 효과 애니메이션 */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <motion.div 
            className="absolute w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            style={{ left: '10%', top: '20%' }}
          />
          <motion.div 
            className="absolute w-80 h-80 rounded-full bg-purple-600/10 blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            style={{ right: '15%', top: '30%' }}
          />
        </motion.div>
        
        <div className="container mx-auto px-4 text-center relative z-10 py-24 flex flex-col items-center justify-center h-full w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.06
                }
              }
            }}
            className="mb-14"
          >
            <div className="inline-block mb-4">
              <Badge className="bg-blue-900/60 hover:bg-blue-800 text-white font-medium px-5 py-2 text-base">
                핵심 기능
              </Badge>
            </div>
            <h2 className="text-5xl font-bold flex flex-wrap justify-center gap-x-3">
              {"칼럼빌링의 특별한 기능".split("").map((char, index) => (
                <motion.span
                  key={`feature-title-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h2>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-2xl p-12 max-w-6xl mx-auto border border-gray-700/50 shadow-xl"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.7, 
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3 
            }}
            whileHover={{ 
              boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.15)"
            }}
          >
            <motion.div 
              className="mb-12 relative"
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-2xl text-blue-300 font-medium mb-8">결제 시스템 구축 과정 데모</p>
              <motion.div 
                className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center overflow-hidden relative shadow-2xl border border-gray-700/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                style={{ minHeight: "400px" }}
              >
                {/* 썸네일 또는 비디오 플레이어 */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <p className="text-3xl text-gray-400">영상 플레이스홀더</p>
                  
                  {/* 재생 버튼 */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className="w-24 h-24 rounded-full bg-blue-600/90 backdrop-blur-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" fill="white" />
                      </svg>
                    </div>
                    
                    {/* 버튼 뒤 광선 효과 */}
                    <motion.div 
                      className="absolute w-24 h-24 rounded-full bg-blue-400/20 blur-md"
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.7, 0.3, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    />
                  </motion.div>
                </div>
                
                {/* 비디오 오버레이 데코레이션 */}
                <motion.div 
                  className="absolute top-4 right-4 bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700/50 text-xs flex items-center gap-1.5"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                  LIVE DEMO
                </motion.div>
              </motion.div>
              
              {/* 시간 표시 바 */}
              <div className="mt-6 w-full bg-gray-700/30 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "65%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9, duration: 1.5 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>0:00</span>
                <span>2:45</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-6 mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <motion.span
                className="inline-block px-5 py-3 bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-700/50 text-base text-gray-300"
                whileHover={{ 
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  borderColor: "rgba(59, 130, 246, 0.5)",
                  y: -2
                }}
                transition={{ duration: 0.2 }}
              >
                🔒 간편 연동 과정
              </motion.span>
              <motion.span
                className="inline-block px-5 py-3 bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-700/50 text-base text-gray-300"
                whileHover={{ 
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  borderColor: "rgba(59, 130, 246, 0.5)",
                  y: -2
                }}
                transition={{ duration: 0.2 }}
              >
                💻 관리자 대시보드 1
              </motion.span>
              <motion.span
                className="inline-block px-5 py-3 bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-700/50 text-base text-gray-300"
                whileHover={{ 
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  borderColor: "rgba(59, 130, 246, 0.5)",
                  y: -2
                }}
                transition={{ duration: 0.2 }}
              >
                📊 데이터 분석
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CONCEPT 섹션 */}
      <motion.section 
        className="min-h-screen w-full bg-gray-900 bg-opacity-30 relative overflow-hidden snap-start snap-always flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        onViewportEnter={() => setActiveSection(2)}
        id="section-2"
      >
        {/* 배경 효과 */}
        <motion.div 
          className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        <div className="container mx-auto px-4 relative z-10 py-16 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Badge className="mx-auto mb-8 bg-blue-900 hover:bg-blue-800 text-white px-4 py-1.5 text-sm">CONCEPT</Badge>
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            단 <motion.span 
                className="text-blue-400 inline-block"
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ["#60a5fa", "#93c5fd", "#60a5fa"]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >3분</motion.span>만에<br/>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="inline-block"
            >
              구독 결제 시스템 구축 완료
            </motion.span>
            
            {/* 배경 장식 요소 - 숫자 */}
            <motion.div 
              className="absolute -z-10 opacity-5 text-9xl font-bold text-blue-500 select-none pointer-events-none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.05 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.7 }}
              style={{ top: '-50%', left: '50%', transform: 'translateX(-50%)' }}
            >
              3
            </motion.div>
          </motion.h2>

          <motion.div 
            className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <AnimatedStepCard
              number="1"
              title="요금제 생성"
              description="클릭만으로 쉽게 내 서비스에 맞는 요금제를 생성해요."
              image="/subscription-plans.png"
            />
            <AnimatedStepCard
              number="2"
              title="PG사 연동"
              description="원하는 PG사와 연동하세요. 여러 PG사를 연동할 수도 있어요."
              image="/pg-integration.png"
            />
            <AnimatedStepCard
              number="3"
              title="코드 한 줄로 구독 기능 구현"
              description="제공되는 SDK를 통해 단 한 줄의 코드로 구독 결제 기능을 구현할 수 있어요."
              image="/code-implementation.png"
            />
          </motion.div>
          
          {/* 연결 선 애니메이션 */}
          <motion.div 
            className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-blue-500/10 -z-5"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "70%", opacity: 0.2 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1 }}
          />
        </div>
      </motion.section>
      
      {/* Why ColumnPay */}
      <motion.section 
        className="min-h-screen w-full relative overflow-hidden snap-start snap-always flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        onViewportEnter={() => setActiveSection(3)}
        id="section-3"
      >
        {/* 배경 효과 애니메이션 */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-600/5 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
          <motion.div 
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-purple-600/5 blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10 py-16 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="flex justify-center mb-4"
              whileInView={{
                scale: [0.9, 1.1, 1],
                opacity: [0, 1, 1],
              }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 text-sm">WHY CHOOSE US</Badge>
            </motion.div>
            
            <motion.h2 
              className="text-4xl font-bold text-center mb-6 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="relative">
                Why <motion.span 
                  className="text-blue-400 inline-block"
                  animate={{ 
                    color: ["#60a5fa", "#93c5fd", "#60a5fa"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                >ColumnPay</motion.span>?
                <motion.div 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl font-normal text-center mt-4 text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              까다롭고 복잡한 구독 결제는 ColumnPay에게 맡기고,<br />
              가장 중요한 비즈니스에만 집중하세요.
            </motion.p>
          </motion.div>

          {/* 수직형 카드 탐색기 레이아웃 */}
          <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto mt-16 relative">
            {/* 왼쪽 카드 리스트 */}
            <motion.div 
              className="flex flex-col gap-4 w-full md:w-1/3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              {[
                {
                  icon: <Zap className="w-10 h-10 text-blue-400" />,
                  title: "3분만에 만드는 구독결제",
                  description: "최적화 API,SDK를 이용해 빠르게 연동 (직접 구현 시 2~3개월 소요)",
                  color: "blue",
                  details: "고객의 결제 및 구독 관리를 위한 모든 기능이 이미 구현되어 있습니다. 단순한 API 연동만으로 복잡한 결제 시스템을 손쉽게 구축하세요. 설정과 연동에 단 3분이면 충분합니다."
                },
                {
                  icon: <CreditCard className="w-10 h-10 text-blue-400" />,
                  title: "효율적인 노코드 운영",
                  description: "최초 연동 후 개발자의 도움 없이 언제든 쉽게 수정하고 운영",
                  color: "purple",
                  details: "직관적인 대시보드를 통해 개발자 없이도 요금제 생성, 가격 변경, 프로모션 설정 등을 손쉽게 관리할 수 있습니다. 비즈니스팀이 직접 빠르게 대응하세요."
                },
                {
                  icon: <CheckCircle className="w-10 h-10 text-blue-400" />,
                  title: "안전한 결제 데이터 관리",
                  description: "민감한 결제 데이터 보안, 간편하고 안전하게 관리",
                  color: "indigo",
                  details: "PCI DSS 인증을 받은 결제 데이터 관리 시스템으로 고객의 카드 정보를 안전하게 보호합니다. 결제 정보 유출 걱정 없이 서비스에 집중하세요."
                }
              ].map((feature, index) => (
                <CardSelector
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color={feature.color}
                  index={index}
                  details={feature.details}
                  isActive={activeCard === index}
                  onClick={() => {
                    setActiveCard(index);
                    setTimeLeft(10); // 타이머 초기화 추가
                  }}
                />
              ))}
            </motion.div>
            
            {/* 오른쪽 상세 내용 표시 */}
            <motion.div 
              className="hidden md:flex w-2/3 relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 shadow-2xl w-full"
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center"
                    style={{
                      background: activeCard === 0 ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))' :
                                 activeCard === 1 ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.2))' :
                                 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(79, 70, 229, 0.2))',
                      boxShadow: activeCard === 0 ? '0 0 20px rgba(59, 130, 246, 0.3)' :
                                 activeCard === 1 ? '0 0 20px rgba(168, 85, 247, 0.3)' :
                                 '0 0 20px rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    {activeCard === 0 ? <Zap className="w-10 h-10 text-blue-400" /> :
                     activeCard === 1 ? <CreditCard className="w-10 h-10 text-purple-400" /> :
                     <CheckCircle className="w-10 h-10 text-indigo-400" />}
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-2xl font-bold mb-4"
                  >
                    {activeCard === 0 ? "3분만에 만드는 구독결제" :
                     activeCard === 1 ? "효율적인 노코드 운영" :
                     "안전한 결제 데이터 관리"}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="text-lg text-gray-300 mb-6"
                  >
                    {activeCard === 0 ? "최적화 API,SDK를 이용해 빠르게 연동 (직접 구현 시 2~3개월 소요)" :
                     activeCard === 1 ? "최초 연동 후 개발자의 도움 없이 언제든 쉽게 수정하고 운영" :
                     "민감한 결제 데이터 보안, 간편하고 안전하게 관리"}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/30"
                  >
                    <p className="text-lg">
                      {activeCard === 0 ? "고객의 결제 및 구독 관리를 위한 모든 기능이 이미 구현되어 있습니다. 단순한 API 연동만으로 복잡한 결제 시스템을 손쉽게 구축하세요. 설정과 연동에 단 3분이면 충분합니다." :
                       activeCard === 1 ? "직관적인 대시보드를 통해 개발자 없이도 요금제 생성, 가격 변경, 프로모션 설정 등을 손쉽게 관리할 수 있습니다. 비즈니스팀이 직접 빠르게 대응하세요." :
                       "PCI DSS 인증을 받은 결제 데이터 관리 시스템으로 고객의 카드 정보를 안전하게 보호합니다. 결제 정보 유출 걱정 없이 서비스에 집중하세요."}
                    </p>
                  </motion.div>

                  {/* 인터랙티브 요소 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 flex flex-wrap items-center gap-4"
                  >
                    {[1, 2, 3].map((item) => (
                      <motion.div
                        key={item}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm flex items-center gap-2"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        {activeCard === 0 ? 
                          (item === 1 ? "빠른 연동" : item === 2 ? "직관적 API" : "간편한 설정") :
                        activeCard === 1 ? 
                          (item === 1 ? "노코드 대시보드" : item === 2 ? "실시간 변경" : "쉬운 관리") :
                        (item === 1 ? "PCI DSS 인증" : item === 2 ? "데이터 암호화" : "보안 관리")}
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              
              {/* 타이머 인디케이터 */}
              <motion.div 
                className="absolute bottom-8 right-8 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                onHoverStart={() => setIsPaused(true)}
                onHoverEnd={() => setIsPaused(false)}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative flex items-center justify-center">
                  {/* 원형 프로그레스 바 */}
                  <svg width="60" height="60" viewBox="0 0 60 60" className="transform -rotate-90">
                    {/* 원형 백그라운드 */}
                    <circle 
                      cx="30" 
                      cy="30" 
                      r="24" 
                      fill="none" 
                      strokeWidth="3" 
                      stroke="rgba(255,255,255,0.1)" 
                    />
                    {/* 프로그레스 인디케이터 */}
                    <motion.circle 
                      cx="30" 
                      cy="30" 
                      r="24" 
                      fill="none" 
                      strokeWidth="3" 
                      stroke={activeCard === 0 ? "#3b82f6" : activeCard === 1 ? "#a855f7" : "#6366f1"} 
                      strokeDasharray="151"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      animate={progressControls}
                      initial={{ pathLength: 1 }}
                      style={{ 
                        pathLength: timeLeft / 10, // 분모를 5에서 10으로 변경
                        filter: `drop-shadow(0 0 3px ${activeCard === 0 ? "#3b82f6" : activeCard === 1 ? "#a855f7" : "#6366f1"})`
                      }}
                    />
                    {/* 펄스 효과 원 */}
                    <motion.circle 
                      cx="30" 
                      cy="30" 
                      r="24" 
                      fill="none" 
                      strokeWidth="1" 
                      stroke={activeCard === 0 ? "#3b82f6" : activeCard === 1 ? "#a855f7" : "#6366f1"} 
                      opacity="0.5"
                      animate={{
                        r: [24, 28, 24],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </svg>
                  
                  {/* 남은 시간 숫자 */}
                  <motion.div 
                    className="absolute text-white font-bold flex items-center justify-center"
                    key={timeLeft}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      color: activeCard === 0 ? "#60a5fa" : activeCard === 1 ? "#c084fc" : "#818cf8",
                      textShadow: `0 0 5px ${activeCard === 0 ? "#3b82f6" : activeCard === 1 ? "#a855f7" : "#6366f1"}`
                    }}
                  >
                    {isPaused ? (
                      <motion.span 
                        className="text-base"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        II
                      </motion.span>
                    ) : (
                      <span className="text-xl">{timeLeft}</span>
                    )}
                  </motion.div>
                </div>
                
                {/* 작은 카드 인디케이터 */}
                <div className="flex gap-1.5 ml-3 items-center">
                  {[0, 1, 2].map((idx) => (
                    <motion.button
                      key={idx}
                      className={`w-2 h-2 rounded-full ${activeCard === idx ? 
                        (activeCard === 0 ? 'bg-blue-500' : activeCard === 1 ? 'bg-purple-500' : 'bg-indigo-500') : 
                        'bg-gray-500/40'}`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setActiveCard(idx);
                        setTimeLeft(10); // 5초에서 10초로 변경
                      }}
                      animate={activeCard === idx ? 
                        { 
                          scale: [1, 1.2, 1],
                          boxShadow: [
                            `0 0 0px ${activeCard === 0 ? "#3b82f6" : activeCard === 1 ? "#a855f7" : "#6366f1"}`, 
                            `0 0 3px ${activeCard === 0 ? "#3b82f6" : activeCard === 1 ? "#a855f7" : "#6366f1"}`,
                            `0 0 0px ${activeCard === 0 ? "#3b82f6" : activeCard === 1 ? "#a855f7" : "#6366f1"}`
                          ]
                        } : 
                        { scale: 1 }
                      }
                      transition={activeCard === idx ? { duration: 1.5, repeat: Infinity, repeatType: "mirror" } : {}}
                    />
                  ))}
                </div>
                
                {/* 일시정지/재생 툴팁 */}
                <motion.div 
                  className="absolute -top-8 right-0 bg-gray-800/80 backdrop-blur-md px-2 py-1 rounded text-xs text-gray-300 whitespace-nowrap"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: isPaused ? 1 : 0, y: isPaused ? 0 : 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {isPaused ? '타이머 일시정지됨' : ''}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 가장 쉬운 구독 결제 */}
      <motion.section 
        className="min-h-screen w-full bg-gray-900 bg-opacity-30 relative overflow-hidden snap-start snap-always flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1 }}
        onViewportEnter={() => setActiveSection(4)}
        id="section-4"
      >
        {/* 배경 효과 */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          {/* 메인 그라데이션 배경 */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-blue-900/20 opacity-80"></div>
          
          {/* 움직이는 그라데이션 블러 효과들 */}
          <motion.div 
            className="absolute top-20 right-20 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
          <motion.div 
            className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl"
            animate={{
              x: [0, 40, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-indigo-600/5 blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
          
          {/* 빛나는 입자 효과 */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => {
              const colors = ['blue-400/70', 'purple-400/70', 'indigo-400/70', 'cyan-400/70'];
              const colorClass = colors[i % 4];
              
              // 미리 계산된 위치 값 (각 입자마다 고정된 값 사용)
              const positions = [
                { top: 1.2054772591125973, left: 83.66491631983197 },
                { top: 48.10975194123193, left: 38.47270817145942 },
                { top: 86.41888403404008, left: 61.60718346534413 },
                { top: 53.060089778690276, left: 63.986768435626914 },
                { top: 48.8209603783522, left: 53.81176410974244 },
                { top: 11.690112450461987, left: 94.27472623454885 },
                { top: 92.91291831986585, left: 40.49912509964755 },
                { top: 98.73666444589865, left: 86.43949944672396 },
                { top: 22.420814545338864, left: 31.699377545575615 },
                { top: 65.18092330759136, left: 83.62926933253317 },
                { top: 84.5790176174406, left: 30.453292894711215 },
                { top: 40.134592098672115, left: 18.6405785684739 },
                { top: 50.54670911505781, left: 88.9415075807308 },
                { top: 94.16915722491161, left: 48.996081813171784 },
                { top: 7.775895955179446, left: 17.423686501942903 },
                { top: 98.54544182014145, left: 94.59146022721224 },
                { top: 54.41576452197907, left: 93.64436497943562 },
                { top: 84.98306381363636, left: 28.461696148449178 },
                { top: 27.534366052120518, left: 29.52050751959403 },
                { top: 37.37156209250387, left: 91.32732225876052 },
                { top: 27.697806438189442, left: 89.76236054454098 },
                { top: 61.02708891907946, left: 56.977947303244214 },
                { top: 58.04761873106925, left: 51.878266775533824 },
                { top: 76.98134378609637, left: 96.32194694969434 },
                { top: 27.042887853897124, left: 96.5070614397929 },
                { top: 5.601129209371614, left: 93.4164173823193 },
                { top: 69.28650663625349, left: 90.7618641633009 },
                { top: 39.671709739911584, left: 32.47261903166792 },
                { top: 54.50622196328334, left: 63.19958721737817 },
                { top: 68.43007205218197, left: 32.450890939747644 }
              ];
              
              // 각 컬러에 대한 고정된 backgroundColor 값 사용
              const bgColors = {
                'blue': 'rgba(96, 165, 250, 0.7)',
                'purple': 'rgba(192, 132, 252, 0.7)',
                'indigo': 'rgba(129, 140, 248, 0.7)',
                'cyan': 'rgba(34, 211, 238, 0.7)'
              };
              
              // 현재 입자의 위치 및 색상 데이터
              const position = positions[i];
              const bgColorKey = colorClass.includes('blue') ? 'blue' : 
                                 colorClass.includes('purple') ? 'purple' : 
                                 colorClass.includes('indigo') ? 'indigo' : 'cyan';
              
              return (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 rounded-full bg-${colorClass}`}
                  style={{
                    top: `${position.top}%`,
                    left: `${position.left}%`,
                    backgroundColor: bgColors[bgColorKey]
                  }}
                  animate={{
                    y: [0, -50],
                    x: [0, (i % 2 === 0 ? 25 : -25)],
                    scale: [0, 1, 0.5, 0],
                    opacity: [0, 0.8, 0.4, 0]
                  }}
                  transition={{
                    duration: 6 + (i % 4),
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </div>
          
          {/* 그리드 패턴 오버레이 */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
                               linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          ></div>
          
          {/* 톱/바텀 그라데이션 오버레이 */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-gray-900 to-transparent"></div>
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </motion.div>

        <div className="container mx-auto px-4 relative z-10 py-24 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div 
              className="flex justify-center mb-4"
              whileInView={{
                scale: [0.9, 1.1, 1],
                opacity: [0, 1, 1],
              }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 text-sm">SUBSCRIPTION MADE EASY</Badge>
            </motion.div>
            
            <motion.h2 
              className="text-5xl font-bold relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <motion.span 
                className="relative inline-block"
                whileInView={{
                  transition: {
                    staggerChildren: 0.05
                  }
                }}
              >
                {"가장 쉬운 구독 결제".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + (i * 0.03) }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.div 
                  className="absolute -bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </motion.span>
            </motion.h2>
            
            <motion.p 
              className="text-xl font-normal mt-6 text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              결제 관련 모든 기능을 <motion.span 
                className="text-blue-400 font-semibold"
                animate={{ 
                  color: ["#60a5fa", "#93c5fd", "#60a5fa"],
                  scale: [1, 1.05, 1],
                  textShadow: ["0px 0px 0px rgba(96, 165, 250, 0)", "0px 0px 5px rgba(96, 165, 250, 0.5)", "0px 0px 0px rgba(96, 165, 250, 0)"]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              >3분 안에</motion.span> 구현하세요
            </motion.p>
          </motion.div>

          {/* 카드 그리드 레이아웃으로 변경 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <AnimatedFeatureCard 
              icon={<CalendarIcon />}
              title="맞춤형 요금제"
              description="월간/연간 결제, 무료체험, 사용량 기반 과금"
              color="blue"
            />
            <AnimatedFeatureCard 
              icon={<SettingsIcon />}
              title="간편한 운영"
              description="개발자 없이 비즈니스팀이 직접 운영 가능"
              color="purple"
            />
            <AnimatedFeatureCard 
              icon={<BellIcon />}
              title="결제 알림"
              description="이메일, SMS, 카카오톡 등 다양한 채널 지원"
              color="indigo"
            />
            <AnimatedFeatureCard 
              icon={<CreditCardIcon />}
              title="멀티PG 대응"
              description="결제 실패 시 자동으로 다른 PG사로 시도"
              color="cyan"
            />
            <AnimatedFeatureCard 
              icon={<BarChartIcon />}
              title="핵심 지표"
              description="전환율/이탈률/매출 등 모든 지표 모니터링"
              color="teal"
            />
            <AnimatedFeatureCard 
              icon={<ShieldCheckIcon />}
              title="보안 시스템"
              description="PCI DSS 인증으로 안전한 결제 데이터 관리"
              color="green"
            />
          </div>
        </div>
      </motion.section>

      {/* 요금제 섹션 */}
      <motion.section 
        className="min-h-screen w-full relative overflow-hidden snap-start snap-always flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        onViewportEnter={() => setActiveSection(5)}
        id="section-5"
      >
        {/* 배경 장식 요소 */}
        <motion.div 
          className="absolute top-40 -left-20 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 -right-20 w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10 py-16 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">
              합리적인 요금제
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "120px" }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-8"
            />
            <motion.p 
              className="text-xl font-normal mt-4 text-gray-300 text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              비즈니스 규모에 맞는 최적의 요금제를 선택하세요
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard 
              title="Personal"
              subtitle="개인 및 소규모 프로젝트를 위한 기본 요금제"
              price="$40/월"
              features={[
                "활성 구독자 100명 이하",
                "나만의 요금제 생성",
                "노코드 결제 UI",
                "API & Webhook 액세스",
                "데이터 대시보드"
              ]}
              buttonText="신청하기"
              popular={false}
              badge={null}
            />
            <PricingCard 
              title="Pro"
              subtitle="성장하는 비즈니스를 위한 프로페셔널 요금제"
              price="$120/월"
              features={[
                "Personal 요금제의 모든 기능",
                "활성 구독자 2000명 이하",
                "계정 수 기반 과금",
                "사용량 기반 과금",
                "이메일/알림톡 알림",
                "멀티 PG 대응",
                "프로모션 관리"
              ]}
              buttonText="신청하기"
              popular={true}
              badge="추천 요금제"
            />
            <PricingCard 
              title="Enterprise"
              subtitle="대규모 비즈니스를 위한 맞춤형 요금제"
              price="문의"
              features={[
                "Pro 요금제의 모든 기능",
                "활성 구독자 무제한",
                "전담 매니저",
                "화이트라벨 솔루션",
                "SLA 보장",
                "전담 API 지원",
                "보안 감사 및 컴플라이언스"
              ]}
              buttonText="신청하기"
              popular={false}
              badge={null}
            />
          </div>
        </div>
      </motion.section>

      {/* CTA 섹션 */}
      <motion.section 
        className="min-h-screen w-full relative overflow-hidden snap-start snap-always flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        onViewportEnter={() => setActiveSection(6)}
        id="section-6"
      >
        {/* 배경 그라디언트 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-800/30 z-0 blur-xl"></div>
        
        {/* 배경 빛나는 원형 */}
        <motion.div 
          className="absolute w-96 h-96 rounded-full bg-blue-500/20 top-0 right-0 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        
        <div className="container mx-auto px-4 text-center relative z-10 py-24 flex flex-col items-center justify-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">지금 바로 시작하세요</h2>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="max-w-2xl mx-auto mb-10 text-gray-300 text-lg">
              복잡한 구독 결제, 이제 <span className="font-bold text-blue-300">3분만에</span> 해결하세요.<br />
              Early Access 신청하고 특별한 혜택을 받아보세요.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-7 text-lg font-medium shadow-lg shadow-blue-500/30">
                사전예약 신청하기
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-sm text-blue-300 font-medium"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            * 선착순 100명에게 6개월 프로 플랜 무료 제공
          </motion.p>
        </div>
      </motion.section>
    </div>
  );
}

function AnimatedStepCard({ number, title, description, image }) {
  // 카운트 애니메이션을 위한 상태
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  
  // 뷰포트에 들어왔을 때 카운팅 애니메이션 시작
  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        if (count < parseInt(number)) {
          setCount(count + 1);
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [count, number]);

  // 각 카드 번호에 따라 다른 시각적 요소 렌더링
  const renderVisualElement = () => {
    switch(number) {
      case "1":
        return (
          <div className="relative w-full aspect-video">
            {/* 구독 요금제 표현 - 가격표 카드들 */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-32 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl shadow-lg z-20"
              initial={{ x: "-50%", y: "-30%", opacity: 0, rotateY: -15, rotateX: 10 }}
              animate={controls}
              variants={{
                visible: {
                  x: "-50%", 
                  y: "-50%", 
                  opacity: 1, 
                  rotateY: -5,
                  rotateX: 5,
                  transition: { duration: 0.6, delay: 0.7 }
                }
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-2">
                <div className="w-full h-3 bg-white/20 rounded-full mb-2"></div>
                <div className="w-3/4 h-3 bg-white/20 rounded-full mb-4"></div>
                <div className="w-1/2 h-8 bg-white/30 rounded-lg mb-2"></div>
                <div className="w-3/4 h-2 bg-white/20 rounded-full"></div>
                <div className="w-3/4 h-2 bg-white/20 rounded-full mt-1"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-32 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl shadow-lg z-10"
              initial={{ x: "-15%", y: "-40%", opacity: 0, rotateY: 20, rotateX: 5 }}
              animate={controls}
              variants={{
                visible: {
                  x: "-20%", 
                  y: "-45%", 
                  opacity: 1, 
                  rotateY: 8,
                  rotateX: 5,
                  transition: { duration: 0.6, delay: 0.9 }
                }
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-2">
                <div className="w-full h-3 bg-white/20 rounded-full mb-2"></div>
                <div className="w-3/4 h-3 bg-white/20 rounded-full mb-4"></div>
                <div className="w-1/2 h-8 bg-white/30 rounded-lg mb-2"></div>
                <div className="w-3/4 h-2 bg-white/20 rounded-full"></div>
                <div className="w-3/4 h-2 bg-white/20 rounded-full mt-1"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-32 bg-gradient-to-br from-teal-600 to-teal-400 rounded-xl shadow-lg"
              initial={{ x: "-80%", y: "-50%", opacity: 0, rotateY: -10, rotateX: 5 }}
              animate={controls}
              variants={{
                visible: {
                  x: "-75%", 
                  y: "-40%", 
                  opacity: 1, 
                  rotateY: -5,
                  rotateX: 5,
                  transition: { duration: 0.6, delay: 0.8 }
                }
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-2">
                <div className="w-full h-3 bg-white/20 rounded-full mb-2"></div>
                <div className="w-3/4 h-3 bg-white/20 rounded-full mb-4"></div>
                <div className="w-1/2 h-8 bg-white/30 rounded-lg mb-2"></div>
                <div className="w-3/4 h-2 bg-white/20 rounded-full"></div>
                <div className="w-3/4 h-2 bg-white/20 rounded-full mt-1"></div>
              </div>
            </motion.div>
            
            {/* 장식 요소들 */}
            <motion.div 
              className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-blue-400/30 backdrop-blur-sm flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={controls}
              variants={{
                visible: {
                  scale: 1, 
                  opacity: 1,
                  transition: { duration: 0.5, delay: 1.2 }
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </motion.div>
          </div>
        );
      
      case "2":
        return (
          <div className="relative w-full aspect-video">
            {/* PG사 연동 표현 - 결제 게이트웨이 연결 */}
            <motion.div 
              className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-28 h-36 bg-gradient-to-b from-gray-800 to-gray-700 rounded-xl border border-gray-600 shadow-lg overflow-hidden"
              initial={{ x: "-80%", y: "-50%", opacity: 0 }}
              animate={controls}
              variants={{
                visible: {
                  x: "-50%", 
                  y: "-50%", 
                  opacity: 1,
                  transition: { duration: 0.6, delay: 0.7 }
                }
              }}
            >
              <div className="w-full h-8 bg-gray-600 flex items-center justify-center">
                <div className="w-16 h-4 bg-white/20 rounded"></div>
              </div>
              <div className="p-3 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/30 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-400/60"></div>
                </div>
                <div className="w-full h-4 bg-blue-400/20 rounded-full mt-3"></div>
              </div>
            </motion.div>
            
            {/* 화살표 연결 */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-y-1/2 w-12 h-1 bg-blue-400"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={controls}
              variants={{
                visible: {
                  scaleX: 1, 
                  opacity: 1,
                  transition: { duration: 0.4, delay: 1 }
                }
              }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-y-1/2 ml-11 w-3 h-3 border-t-2 border-r-2 border-blue-400 rotate-45"
              initial={{ opacity: 0 }}
              animate={controls}
              variants={{
                visible: {
                  opacity: 1,
                  transition: { duration: 0.3, delay: 1.3 }
                }
              }}
            />
            
            <motion.div 
              className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-28 h-36 bg-gradient-to-b from-indigo-900 to-indigo-800 rounded-xl border border-indigo-700 shadow-lg overflow-hidden"
              initial={{ x: "80%", y: "-50%", opacity: 0 }}
              animate={controls}
              variants={{
                visible: {
                  x: "50%", 
                  y: "-50%", 
                  opacity: 1,
                  transition: { duration: 0.6, delay: 0.9 }
                }
              }}
            >
              <div className="w-full h-8 bg-indigo-700 flex items-center justify-center">
                <div className="w-16 h-4 bg-white/20 rounded"></div>
              </div>
              <div className="p-3 flex flex-col items-center justify-center h-28">
                <div className="w-12 h-12 rounded-full bg-blue-500/30 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-400/60"></div>
                </div>
                <div className="w-full h-4 bg-blue-400/20 rounded-full mt-3"></div>
              </div>
            </motion.div>
            
            {/* 연결 점선 */}
            <motion.div
              className="absolute top-1/3 left-0 right-0 h-0.5 bg-blue-400/20"
              style={{ 
                backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(96, 165, 250, 0.2) 50%)',
                backgroundSize: '8px 1px'
              }}
              initial={{ opacity: 0 }}
              animate={controls}
              variants={{
                visible: {
                  opacity: 1,
                  transition: { duration: 0.8, delay: 1.2 }
                }
              }}
            />
            
            {/* PG사 로고들 */}
            <motion.div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3"
              initial={{ y: 20, opacity: 0 }}
              animate={controls}
              variants={{
                visible: {
                  y: 0, 
                  opacity: 1,
                  transition: { duration: 0.5, delay: 1.4 }
                }
              }}
            >
              <div className="w-8 h-8 rounded-full bg-yellow-400/70 flex items-center justify-center text-xs font-bold text-yellow-900">PG</div>
              <div className="w-8 h-8 rounded-full bg-green-400/70 flex items-center justify-center text-xs font-bold text-green-900">PG</div>
              <div className="w-8 h-8 rounded-full bg-purple-400/70 flex items-center justify-center text-xs font-bold text-purple-900">PG</div>
            </motion.div>
          </div>
        );
      
      case "3":
        return (
          <div className="relative w-full aspect-video">
            {/* 코드 한 줄로 구독 기능 구현 - 코드 에디터와 결과 */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-36 bg-gray-900 rounded-t-xl border border-gray-700 overflow-hidden font-mono text-sm"
              initial={{ y: -20, opacity: 0 }}
              animate={controls}
              variants={{
                visible: {
                  y: 0, 
                  opacity: 1,
                  transition: { duration: 0.5, delay: 0.7 }
                }
              }}
            >
              {/* 코드 에디터 상단 바 */}
              <div className="w-full h-6 bg-gray-800 flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                <div className="ml-4 text-xs text-gray-400">subscription.js</div>
              </div>
              
              {/* 코드 라인 */}
              <div className="p-4 space-y-2">
                <div className="flex">
                  <span className="text-gray-500 w-5">1</span>
                  <span className="text-blue-400">import</span>
                  <span className="text-white ml-2">&#123; ColumnPay &#125;</span>
                  <span className="text-blue-400 ml-2">from</span>
                  <span className="text-green-400 ml-2">&apos;columnpay-sdk&apos;</span><span className="text-white">;</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-5">2</span>
                  <span className="text-white"></span>
                </div>
                <motion.div 
                  className="flex"
                  initial={{ backgroundColor: "rgba(59, 130, 246, 0)" }}
                  animate={{
                    backgroundColor: ["rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0)"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                >
                  <span className="text-gray-500 w-5">3</span>
                  <motion.span 
                    className="text-purple-400 whitespace-nowrap"
                    initial={{ width: 0, opacity: 0 }}
                    animate={controls}
                    variants={{
                      visible: {
                        width: "auto", 
                        opacity: 1,
                        transition: { duration: 1.5, delay: 1 }
                      }
                    }}
                  >
                    ColumnPay.initSubscription(&#123; planId: &apos;premium&apos; &#125;);
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
            
            {/* 결과물 */}
            <motion.div 
              className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-b-xl overflow-hidden flex items-center justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={controls}
              variants={{
                visible: {
                  y: 0, 
                  opacity: 1,
                  transition: { duration: 0.5, delay: 1.2 }
                }
              }}
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3 flex items-center gap-3"
                animate={{
                  boxShadow: ["0 0 0 rgba(255,255,255,0.1)", "0 0 20px rgba(255,255,255,0.3)", "0 0 0 rgba(255,255,255,0.1)"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-green-400"
                  animate={{
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                <span className="text-white font-medium">구독 시스템 활성화 완료</span>
              </motion.div>
            </motion.div>
            
            {/* 장식 요소 - 작은 아이콘들 */}
            <motion.div 
              className="absolute right-3 top-12 flex flex-col gap-2"
              initial={{ opacity: 0, x: 10 }}
              animate={controls}
              variants={{
                visible: {
                  opacity: 1, 
                  x: 0,
                  transition: { duration: 0.5, delay: 1.5, staggerChildren: 0.1 }
                }
              }}
            >
              <div className="w-6 h-6 bg-blue-500/30 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <div className="w-6 h-6 bg-purple-500/30 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="w-6 h-6 bg-green-500/30 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </motion.div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <motion.div 
      className="flex flex-col items-center text-center relative"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      onViewportEnter={() => {
        setCount(1);
        controls.start("visible");
      }}
    >
      {/* 숫자 배경 효과 */}
      <motion.div 
        className="absolute -z-10 top-0 opacity-10 text-8xl font-bold text-blue-400"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, scale: 0.5, rotate: -10 },
          visible: { 
            opacity: 0.1, 
            scale: 1, 
            rotate: 0,
            transition: { duration: 0.5, delay: 0.2 }
          }
        }}
      >
        {number}
      </motion.div>
      
      <motion.div 
        className="text-4xl font-bold text-blue-400 mb-4 w-16 h-16 flex items-center justify-center relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={controls}
        variants={{
          hidden: { scale: 0.8, opacity: 0 },
          visible: { 
            scale: 1, 
            opacity: 1,
            transition: { duration: 0.4, delay: 0.3 }
          }
        }}
      >
        {/* 숫자 뒤 원형 배경 */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-blue-500/10 z-0"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <span className="relative z-10">{number}</span>
      </motion.div>
      
      <motion.h3 
        className="text-xl font-bold mb-2"
        initial={{ opacity: 0 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.4, delay: 0.4 }
          }
        }}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className="text-gray-300 mb-6"
        initial={{ opacity: 0 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.4, delay: 0.5 }
          }
        }}
      >
        {description}
      </motion.p>
      
      <motion.div 
        className="bg-gray-800/80 backdrop-blur-md rounded-xl p-4 w-full overflow-hidden border border-gray-700/30 h-64"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, delay: 0.6 }
          }
        }}
        whileHover={{ 
          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)",
          borderColor: "rgba(59, 130, 246, 0.3)",
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        {renderVisualElement()}
      </motion.div>
      
      {/* 연결선 효과 (모바일에서는 숨김) */}
      <motion.div 
        className="hidden md:block absolute top-8 right-0 h-0.5 bg-blue-500/10 z-0 origin-left"
        style={{ width: "calc(50% + 2rem)" }}
        initial={{ scaleX: 0 }}
        animate={controls}
        variants={{
          hidden: { scaleX: 0 },
          visible: {
            scaleX: number === "3" ? 0 : 1,
            transition: { duration: 0.8, delay: 0.9 }
          }
        }}
      />
    </motion.div>
  );
}

function StepCard({ number, title, description, image }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-4xl font-bold text-blue-400 mb-4">{number}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300 mb-6">{description}</p>
      <div className="bg-gray-800 rounded-lg p-4 w-full">
        <img src={image} alt={title} className="w-full rounded" />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="p-6 bg-gray-800 bg-opacity-50 border-0 hover:bg-opacity-70 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </Card>
  );
}

function SimpleFeature({ title, description }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function PricingCard({ title, subtitle, price, features, buttonText, popular, badge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] 
        }
      }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      <motion.div 
        className={`p-6 bg-gray-800 bg-opacity-50 border-0 rounded-2xl ${popular ? 'relative' : ''}`}
        whileHover={{ 
          boxShadow: popular 
            ? '0 0 25px rgba(59, 130, 246, 0.3)' 
            : '0 0 15px rgba(255, 255, 255, 0.1)',
          transition: { duration: 0.2 }
        }}
      >
        {popular && (
          <motion.div 
            className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 -z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            animate={{
              boxShadow: ['0 0 15px rgba(59, 130, 246, 0.3)', '0 0 20px rgba(59, 130, 246, 0.5)', '0 0 15px rgba(59, 130, 246, 0.3)'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
        )}
        
        {badge && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute -top-3 left-0 right-0 mx-auto flex justify-center"
          >
            <Badge className="bg-blue-500 text-white px-4 py-1 text-sm font-semibold shadow-lg text-center">
              {badge}
            </Badge>
          </motion.div>
        )}
        
        <motion.h3 
          className="text-xl font-bold mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-400 text-sm mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {subtitle}
        </motion.p>
        
        <motion.div 
          className="mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
        >
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">{price}</span>
        </motion.div>
        
        <motion.ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <motion.li 
              key={index} 
              className="flex items-start gap-2"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (index * 0.1), duration: 0.3 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + (index * 0.1), duration: 0.2, type: "spring" }}
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              </motion.div>
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        
        <motion.div
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <Button className={`w-full ${popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
            {buttonText}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function AnimatedFeatureCard({ icon, title, description, color }) {
  const gradientMap = {
    blue: "from-blue-500/20 to-blue-700/10",
    purple: "from-purple-500/20 to-purple-700/10",
    indigo: "from-indigo-500/20 to-indigo-700/10",
    cyan: "from-cyan-500/20 to-cyan-700/10",
    teal: "from-teal-500/20 to-teal-700/10",
    green: "from-green-500/20 to-green-700/10"
  };
  
  const glowMap = {
    blue: "rgba(59, 130, 246, 0.5)",
    purple: "rgba(168, 85, 247, 0.5)",
    indigo: "rgba(99, 102, 241, 0.5)",
    cyan: "rgba(34, 211, 238, 0.5)",
    teal: "rgba(45, 212, 191, 0.5)",
    green: "rgba(74, 222, 128, 0.5)"
  };
  
  const borderColorMap = {
    blue: "border-blue-500/20",
    purple: "border-purple-500/20",
    indigo: "border-indigo-500/20",
    cyan: "border-cyan-500/20",
    teal: "border-teal-500/20",
    green: "border-green-500/20"
  };
  
  const lineColorMap = {
    blue: "bg-blue-500/50",
    purple: "bg-purple-500/50",
    indigo: "bg-indigo-500/50",
    cyan: "bg-cyan-500/50",
    teal: "bg-teal-500/50",
    green: "bg-green-500/50"
  };
  
  const textColorMap = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    indigo: "text-indigo-400",
    cyan: "text-cyan-400",
    teal: "text-teal-400",
    green: "text-green-400"
  };
  
  const bgGlowMap = {
    blue: "bg-blue-400/20",
    purple: "bg-purple-400/20",
    indigo: "bg-indigo-400/20",
    cyan: "bg-cyan-400/20",
    teal: "bg-teal-400/20",
    green: "bg-green-400/20"
  };
  
  // 기본값 설정
  const selectedColor = color || "blue";
  const gradient = gradientMap[selectedColor] || gradientMap.blue;
  const glow = glowMap[selectedColor] || glowMap.blue;
  const borderColor = borderColorMap[selectedColor] || borderColorMap.blue;
  const lineColor = lineColorMap[selectedColor] || lineColorMap.blue;
  const textColor = textColorMap[selectedColor] || textColorMap.blue;
  const bgGlow = bgGlowMap[selectedColor] || bgGlowMap.blue;
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        className={`p-6 bg-gradient-to-b ${gradient} backdrop-blur-md rounded-xl border ${borderColor} shadow-lg relative overflow-hidden h-full`}
        whileHover={{ 
          boxShadow: `0 20px 25px -5px ${glow}`,
          transition: { duration: 0.2 }
        }}
      >
        {/* 배경 장식 효과 */}
        <motion.div 
          className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-${selectedColor}-500/10 blur-2xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        
        <motion.div 
          className="relative flex items-center justify-center mb-5 z-10 w-14 h-14 rounded-lg bg-gray-800/80 backdrop-blur-md"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          whileHover={{
            rotate: [0, -10, 0, 10, 0],
            transition: { duration: 0.6 }
          }}
        >
          {/* 아이콘 뒤 빛나는 효과 */}
          <motion.div 
            className={`absolute inset-0 rounded-lg ${bgGlow} blur-md`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
          <div className={textColor}>
            {icon}
          </div>
        </motion.div>
        
        <motion.h3 
          className="text-xl font-bold mb-3 relative inline-block"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {title}
          <motion.div 
            className={`absolute -bottom-1 left-0 h-0.5 ${lineColor} rounded-full`}
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        </motion.h3>
        
        <motion.p 
          className="text-gray-300 z-10 relative text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {description}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

function AnimatedSubscriptionFeature({ icon, title, description, color }) {
  // 색상에 따른 스타일 매핑
  const colorStyles = {
    blue: {
      gradient: "from-blue-500/20 to-blue-700/10",
      border: "border-blue-500/20",
      icon: "text-blue-400 bg-blue-500/10",
      hover: "rgba(59, 130, 246, 0.1)"
    },
    purple: {
      gradient: "from-purple-500/20 to-purple-700/10",
      border: "border-purple-500/20",
      icon: "text-purple-400 bg-purple-500/10",
      hover: "rgba(168, 85, 247, 0.1)"
    },
    indigo: {
      gradient: "from-indigo-500/20 to-indigo-700/10",
      border: "border-indigo-500/20",
      icon: "text-indigo-400 bg-indigo-500/10",
      hover: "rgba(99, 102, 241, 0.1)"
    },
    cyan: {
      gradient: "from-cyan-500/20 to-cyan-700/10",
      border: "border-cyan-500/20",
      icon: "text-cyan-400 bg-cyan-500/10",
      hover: "rgba(34, 211, 238, 0.1)"
    },
    teal: {
      gradient: "from-teal-500/20 to-teal-700/10",
      border: "border-teal-500/20",
      icon: "text-teal-400 bg-teal-500/10",
      hover: "rgba(45, 212, 191, 0.1)"
    },
    green: {
      gradient: "from-green-500/20 to-green-700/10",
      border: "border-green-500/20",
      icon: "text-green-400 bg-green-500/10",
      hover: "rgba(74, 222, 128, 0.1)"
    }
  };
  
  const style = colorStyles[color] || colorStyles.blue;
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div 
        className={`p-6 bg-gradient-to-b ${style.gradient} backdrop-blur-md rounded-xl border ${style.border} shadow-lg relative overflow-hidden h-full`}
        whileHover={{ 
          boxShadow: `0 15px 30px -5px ${style.hover}`,
          borderColor: color,
          transition: { duration: 0.3 }
        }}
      >
        {/* 배경 효과 */}
        <motion.div 
          className="absolute -right-12 -top-12 w-24 h-24 rounded-full blur-xl opacity-20"
          style={{ background: `linear-gradient(120deg, ${style.hover}, transparent)` }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        
        {/* 아이콘 */}
        <motion.div 
          className={`relative z-10 w-12 h-12 rounded-lg ${style.icon} flex items-center justify-center mb-4`}
          whileHover={{
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.5 }
          }}
        >
          {icon || 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          }
        </motion.div>
        
        {/* 제목 */}
        <motion.h3 
          className="text-lg font-bold mb-2 relative inline-block"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {title}
          <motion.div 
            className="absolute -bottom-1 left-0 h-0.5 bg-gray-400/30 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
          />
        </motion.h3>
        
        {/* 설명 */}
        <motion.p 
          className="text-gray-300 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {description}
        </motion.p>
        
        {/* 오른쪽 하단 장식 요소 */}
        <motion.div 
          className="absolute bottom-2 right-2 w-20 h-20 rounded-full opacity-5"
          style={{ background: `radial-gradient(circle, ${style.hover} 0%, transparent 70%)` }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// 아이콘 컴포넌트들
function CalendarIcon() {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      whileHover={{ scale: 1.1 }}
      animate={{ 
        rotate: [0, 2, 0, -2, 0],
        scale: [1, 1.05, 1, 1.05, 1]
      }}
      transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </motion.svg>
  );
}

function SettingsIcon() {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      whileHover={{ rotate: 90 }}
      animate={{ rotate: [0, 5, 0] }}
      transition={{ duration: 3, repeat: Infinity, type: "spring" }}
    >
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </motion.svg>
  );
}

function BellIcon() {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      whileHover={{ y: -3 }}
      animate={{ 
        y: [0, -2, 0],
        rotate: [0, 2, 0, -2, 0]
      }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </motion.svg>
  );
}

function CreditCardIcon() {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      whileHover={{ scale: 1.15 }}
      animate={{ 
        x: [0, 2, 0, -2, 0],
        scale: [1, 1.03, 1]
      }}
      transition={{ duration: 6, repeat: Infinity }}
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </motion.svg>
  );
}

function BarChartIcon() {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      whileHover={{ scale: 1.1 }}
    >
      <motion.line 
        x1="12" 
        y1="20" 
        x2="12" 
        y2="10"
        initial={{ pathLength: 0, y2: 20 }}
        animate={{ pathLength: 1, y2: 10 }}
        transition={{ delay: 0.3, duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
      />
      <motion.line 
        x1="6" 
        y1="20" 
        x2="6" 
        y2="4"
        initial={{ pathLength: 0, y2: 20 }}
        animate={{ pathLength: 1, y2: 4 }}
        transition={{ delay: 0.2, duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
      />
      <motion.line 
        x1="18" 
        y1="20" 
        x2="18" 
        y2="14"
        initial={{ pathLength: 0, y2: 20 }}
        animate={{ pathLength: 1, y2: 14 }}
        transition={{ delay: 0.4, duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
      />
    </motion.svg>
  );
}

function ShieldCheckIcon() {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      whileHover={{ scale: 1.1, y: -2 }}
      animate={{ 
        scale: [1, 1.05, 1],
        filter: ["drop-shadow(0px 0px 0px currentColor)", "drop-shadow(0px 0px 3px currentColor)", "drop-shadow(0px 0px 0px currentColor)"]
      }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <motion.path 
        d="M9 12l2 2 4-4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.svg>
  );
}

function VerticalFeatureCard({ icon, title, description, color, index }) {
  // 색상에 따른 스타일 매핑
  const colorStyles = {
    blue: {
      gradient: "from-blue-500/20 to-blue-700/10",
      border: "border-blue-500/20",
      icon: "text-blue-400 bg-blue-500/10",
      hover: "rgba(59, 130, 246, 0.1)",
      line: "bg-blue-500/30",
      glow: "0 0 15px rgba(59, 130, 246, 0.3)"
    },
    purple: {
      gradient: "from-purple-500/20 to-purple-700/10",
      border: "border-purple-500/20",
      icon: "text-purple-400 bg-purple-500/10",
      hover: "rgba(168, 85, 247, 0.1)",
      line: "bg-purple-500/30",
      glow: "0 0 15px rgba(168, 85, 247, 0.3)"
    },
    indigo: {
      gradient: "from-indigo-500/20 to-indigo-700/10",
      border: "border-indigo-500/20",
      icon: "text-indigo-400 bg-indigo-500/10",
      hover: "rgba(99, 102, 241, 0.1)",
      line: "bg-indigo-500/30",
      glow: "0 0 15px rgba(99, 102, 241, 0.3)"
    },
    cyan: {
      gradient: "from-cyan-500/20 to-cyan-700/10",
      border: "border-cyan-500/20",
      icon: "text-cyan-400 bg-cyan-500/10",
      hover: "rgba(34, 211, 238, 0.1)",
      line: "bg-cyan-500/30",
      glow: "0 0 15px rgba(34, 211, 238, 0.3)"
    },
    teal: {
      gradient: "from-teal-500/20 to-teal-700/10",
      border: "border-teal-500/20",
      icon: "text-teal-400 bg-teal-500/10",
      hover: "rgba(45, 212, 191, 0.1)",
      line: "bg-teal-500/30",
      glow: "0 0 15px rgba(45, 212, 191, 0.3)"
    },
    green: {
      gradient: "from-green-500/20 to-green-700/10",
      border: "border-green-500/20",
      icon: "text-green-400 bg-green-500/10",
      hover: "rgba(74, 222, 128, 0.1)",
      line: "bg-green-500/30",
      glow: "0 0 15px rgba(74, 222, 128, 0.3)"
    }
  };
  
  const style = colorStyles[color] || colorStyles.blue;
  
  // 연결선 표시 여부 (마지막 항목에는 연결선 없음)
  const showConnector = index < 5;
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50, x: -20 },
        visible: { 
          opacity: 1, 
          y: 0,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.7,
            delay: index * 0.1
          }
        }
      }}
      className="relative"
    >
      {/* 세로 연결선 */}
      {showConnector && (
        <motion.div 
          className={`absolute left-8 top-20 w-0.5 ${style.line} z-0`}
          initial={{ height: 0, opacity: 0 }}
          whileInView={{ height: "5rem", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
        />
      )}
      
      <motion.div 
        className={`p-6 bg-gradient-to-r ${style.gradient} backdrop-blur-md rounded-xl border ${style.border} shadow-lg relative overflow-hidden`}
        whileHover={{ 
          x: 10,
          y: -5,
          boxShadow: `0 15px 30px -5px ${style.hover}, ${style.glow}`,
          borderColor: color,
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div 
          className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ 
            x: "200%", 
            opacity: 0.3,
            transition: { duration: 1.2, ease: "easeInOut" }
          }}
        />
        
        <div className="flex items-start gap-6">
          {/* 아이콘 */}
          <motion.div 
            className={`relative z-10 w-16 h-16 rounded-lg ${style.icon} flex items-center justify-center flex-shrink-0`}
            whileHover={{
              rotate: [0, -5, 5, 0],
              scale: [1, 1.1, 1],
              transition: { duration: 0.5 }
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ 
                rotate: 360,
                transition: { duration: 0.8, ease: "easeInOut" } 
              }}
            >
              {icon || 
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              }
            </motion.div>
          </motion.div>
          
          <div className="flex-1">
            {/* 제목 */}
            <motion.h3 
              className="text-xl font-bold mb-3 relative inline-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <motion.span
                whileHover={{
                  color: `rgb(${color === 'blue' ? '96, 165, 250' : color === 'purple' ? '192, 132, 252' : '129, 140, 248'})`,
                  transition: { duration: 0.2 }
                }}
              >
                {title}
              </motion.span>
              <motion.div 
                className={`absolute -bottom-1 left-0 h-0.5 ${style.line} rounded-full`}
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
              />
            </motion.h3>
            
            {/* 설명 */}
            <motion.p 
              className="text-gray-300 text-base leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {description}
            </motion.p>
          </div>
          
          {/* 배경 효과 */}
          <motion.div 
            className="absolute -right-12 -top-12 w-40 h-40 rounded-full blur-xl opacity-20"
            style={{ background: `linear-gradient(120deg, ${style.hover}, transparent)` }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* 숫자 배지 */}
          <motion.div
            className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold opacity-40"
            style={{ background: `radial-gradient(circle, ${style.hover}, transparent 70%)` }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 0.4, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {index + 1}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 새로운 컴팩트 카드 컴포넌트 추가
function CompactFeatureCard({ icon, title, description, color, index }) {
  // 색상에 따른 스타일 매핑
  const colorStyles = {
    blue: {
      gradient: "from-blue-500/20 to-blue-700/10",
      border: "border-blue-500/20",
      icon: "text-blue-400 bg-blue-500/10",
      hover: "rgba(59, 130, 246, 0.1)",
      glow: "0 0 15px rgba(59, 130, 246, 0.3)",
      highlight: "bg-blue-500"
    },
    purple: {
      gradient: "from-purple-500/20 to-purple-700/10",
      border: "border-purple-500/20",
      icon: "text-purple-400 bg-purple-500/10",
      hover: "rgba(168, 85, 247, 0.1)",
      glow: "0 0 15px rgba(168, 85, 247, 0.3)",
      highlight: "bg-purple-500"
    },
    indigo: {
      gradient: "from-indigo-500/20 to-indigo-700/10",
      border: "border-indigo-500/20",
      icon: "text-indigo-400 bg-indigo-500/10",
      hover: "rgba(99, 102, 241, 0.1)",
      glow: "0 0 15px rgba(99, 102, 241, 0.3)",
      highlight: "bg-indigo-500"
    },
    cyan: {
      gradient: "from-cyan-500/20 to-cyan-700/10",
      border: "border-cyan-500/20",
      icon: "text-cyan-400 bg-cyan-500/10",
      hover: "rgba(34, 211, 238, 0.1)",
      glow: "0 0 15px rgba(34, 211, 238, 0.3)",
      highlight: "bg-cyan-500"
    },
    teal: {
      gradient: "from-teal-500/20 to-teal-700/10",
      border: "border-teal-500/20",
      icon: "text-teal-400 bg-teal-500/10",
      hover: "rgba(45, 212, 191, 0.1)",
      glow: "0 0 15px rgba(45, 212, 191, 0.3)",
      highlight: "bg-teal-500"
    },
    green: {
      gradient: "from-green-500/20 to-green-700/10",
      border: "border-green-500/20",
      icon: "text-green-400 bg-green-500/10",
      hover: "rgba(74, 222, 128, 0.1)",
      glow: "0 0 15px rgba(74, 222, 128, 0.3)",
      highlight: "bg-green-500"
    }
  };
  
  const style = colorStyles[color] || colorStyles.blue;
  
  return (
    <motion.div
      variants={{
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 12,
            duration: 0.5,
            delay: index * 0.08
          }
        }
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.5,
        delay: index * 0.08
      }}
      className="h-full"
    >
      <motion.div 
        className={`p-6 bg-gradient-to-br ${style.gradient} backdrop-blur-md rounded-xl border ${style.border} shadow-lg relative overflow-hidden h-full flex flex-col`}
        whileHover={{ 
          y: -8,
          boxShadow: `0 15px 30px -5px ${style.hover}, ${style.glow}`,
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* 호버 효과 */}
        <motion.div 
          className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ 
            x: "200%", 
            opacity: 0.3,
            transition: { duration: 1, ease: "easeInOut" }
          }}
        />
        
        {/* 상단 데코레이션 라인 */}
        <motion.div 
          className={`absolute top-0 left-0 right-0 h-1 ${style.highlight} opacity-60`}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
        />
        
        {/* 아이콘 */}
        <div className="mb-4 relative">
          <motion.div 
            className={`w-12 h-12 rounded-lg ${style.icon} flex items-center justify-center`}
            whileHover={{
              rotate: [0, -5, 5, 0],
              scale: [1, 1.1, 1],
              transition: { duration: 0.5 }
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {icon}
            </motion.div>
          </motion.div>
          
          {/* 아이콘 주변 빛나는 효과 */}
          <motion.div
            className="absolute -inset-1 rounded-lg opacity-0"
            initial={{ opacity: 0 }}
            whileHover={{ 
              opacity: 0.3,
              transition: { duration: 0.3 }
            }}
            style={{
              background: `radial-gradient(circle, ${style.hover} 30%, transparent 70%)`
            }}
          />
        </div>
        
        {/* 제목 */}
        <motion.h3 
          className="text-lg font-bold mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {title}
        </motion.h3>
        
        {/* 설명 */}
        <motion.p 
          className="text-gray-300 text-sm flex-grow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {description}
        </motion.p>
        
        {/* 배경 효과 */}
        <motion.div 
          className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-xl opacity-20"
          style={{ background: `radial-gradient(circle, ${style.hover} 30%, transparent 70%)` }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// 단순화된 카드 컴포넌트 추가
function SimpleFeatureCard({ icon, title, description, color }) {
  // 색상에 따른 스타일 매핑
  const colorStyles = {
    blue: {
      gradient: "from-blue-500/20 to-blue-700/10",
      border: "border-blue-500/20",
      icon: "text-blue-400 bg-blue-500/10",
      highlight: "bg-blue-500"
    },
    purple: {
      gradient: "from-purple-500/20 to-purple-700/10",
      border: "border-purple-500/20",
      icon: "text-purple-400 bg-purple-500/10",
      highlight: "bg-purple-500"
    },
    indigo: {
      gradient: "from-indigo-500/20 to-indigo-700/10",
      border: "border-indigo-500/20",
      icon: "text-indigo-400 bg-indigo-500/10",
      highlight: "bg-indigo-500"
    },
    cyan: {
      gradient: "from-cyan-500/20 to-cyan-700/10",
      border: "border-cyan-500/20",
      icon: "text-cyan-400 bg-cyan-500/10",
      highlight: "bg-cyan-500"
    },
    teal: {
      gradient: "from-teal-500/20 to-teal-700/10",
      border: "border-teal-500/20",
      icon: "text-teal-400 bg-teal-500/10",
      highlight: "bg-teal-500"
    },
    green: {
      gradient: "from-green-500/20 to-green-700/10",
      border: "border-green-500/20",
      icon: "text-green-400 bg-green-500/10",
      highlight: "bg-green-500"
    }
  };
  
  const style = colorStyles[color] || colorStyles.blue;
  
  return (
    <div className="h-full">
      <div className={`p-6 bg-gradient-to-br ${style.gradient} backdrop-blur-md rounded-xl border ${style.border} shadow-lg relative overflow-hidden h-full flex flex-col`}>
        {/* 상단 데코레이션 라인 */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${style.highlight} opacity-60`}></div>
        
        {/* 아이콘 */}
        <div className="mb-4 relative">
          <div className={`w-12 h-12 rounded-lg ${style.icon} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        
        {/* 제목 */}
        <h3 className="text-lg font-bold mb-2">
          {title}
        </h3>
        
        {/* 설명 */}
        <p className="text-gray-300 text-sm flex-grow">
          {description}
        </p>
      </div>
    </div>
  );
}

// 기존 코드 위치에 CardSelector 컴포넌트 추가 (StepCard와 FeatureCard 사이에 추가)
function CardSelector({ icon, title, description, color, index, details, isActive, onClick }) {
  const borderColorMap = {
    blue: "border-blue-500/40",
    purple: "border-purple-500/40",
    indigo: "border-indigo-500/40",
    cyan: "border-cyan-500/40",
    teal: "border-teal-500/40",
    green: "border-green-500/40"
  };
  
  const bgActiveMap = {
    blue: "bg-blue-500/10",
    purple: "bg-purple-500/10",
    indigo: "bg-indigo-500/10",
    cyan: "bg-cyan-500/10", 
    teal: "bg-teal-500/10",
    green: "bg-green-500/10"
  };
  
  const borderColor = borderColorMap[color] || borderColorMap.blue;
  const bgActive = bgActiveMap[color] || bgActiveMap.blue;
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${isActive ? `${borderColor} ${bgActive}` : 'border-gray-700/30'}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        <motion.div 
          animate={isActive ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="ml-auto"
        >
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </motion.div>
      </div>
    </motion.div>
  );
}
