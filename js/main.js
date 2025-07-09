import { gsap } from '../lib/gsap/esm/gsap-core.js';
import { CSSPlugin } from '../lib/gsap/esm/CSSPlugin.js';
import { ScrollTrigger } from '../lib/gsap/esm/ScrollTrigger.js';
gsap.registerPlugin(CSSPlugin, ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const navList = document.querySelector(".nav-list");
  const cards = gsap.utils.toArray(".card2 img");

  burger.addEventListener("click", () => {
    navList.classList.toggle("show");
  });

  const loadingScreen = document.createElement("div");
loadingScreen.id = "loading-screen";
loadingScreen.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: black;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;
document.body.appendChild(loadingScreen);

// Disable scroll
document.body.style.overflow = 'hidden';
document.documentElement.style.overflow = 'hidden';

// Kartu yang akan di-shuffle
const shuffleImages = [
  "assets/ATTACKERS_BACK.png",
  "assets/DEFENDERS_BACK.png",
  "assets/PLANNERS_BACK.png",
  "assets/COLLABORATOR_BACK.png"
];

const cardsStack = [];

shuffleImages.forEach((src, i) => {
  const card = document.createElement("img");
  card.src = src;
  card.style.position = "absolute";
  card.style.top = "51%";
  card.style.left = "50%";
  const extraOffset = (i === 2 || i === 3) ? 1 : 0;
  card.style.transform = `translate(-50%, -50%) translateY(${extraOffset}px)`;
  card.style.width = "489px";
  card.style.zIndex = 1000 + i;
  card.style.pointerEvents = "none";
  card.style.transition = "transform 0.3s ease";
  card.style.borderRadius = "12px";
  cardsStack.push(card);
  loadingScreen.appendChild(card);
});

// --- Shuffle Logic ---
let shuffleIndex = 0;
const shuffleInterval = setInterval(() => {
  shuffleIndex = (shuffleIndex + 1) % (shuffleImages.length - 1);
  cardsStack[3].src = shuffleImages[shuffleIndex];
}, 150);

// --- End loading setelah 2 detik ---
setTimeout(() => {
  clearInterval(shuffleInterval);
  cardsStack[3].src = shuffleImages[3]; // gambar terakhir tetap

  // pastikan gambar sudah load dulu
  if (cardsStack[3].complete) {
    finishLoading();
  } else {
    cardsStack[3].onload = () => finishLoading();
    cardsStack[3].onerror = () => finishLoading();
  }
}, 2000);

// --- Selesaikan loading ---
function finishLoading() {
  gsap.to(cardsStack[3], {
    duration: 1,
    ease: "power4.in",
    onComplete: () => {
      loadingScreen.remove();

      // Enable scroll lagi
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      ScrollTrigger.refresh(); // penting setelah loading
      animateCards(); // lanjut animasi lain
    }
  });
}
  function animateCards() {
    const card = document.querySelector(".card");
    const images = Array.from(document.querySelectorAll(".card img"));

    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    const positions = images.map((el) => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      return {
        el,
        dx: cardCenterX - elCenterX,
        dy: cardCenterY - elCenterY,
        distance: Math.abs(cardCenterX - elCenterX)
      };
    });

    gsap.to(".logo2 img", {
      y: -100,
      delay: 2,
      duration: 2,
      ease: "power2.out"
    });

    positions.sort((a, b) => b.dx - a.dx);

    positions.forEach((pos) => {
      gsap.set(pos.el, {
        x: pos.dx,
        y: pos.dy,
        scale: 1.5
      });
    });

    positions.forEach((pos, i) => {
      gsap.to(pos.el, {
        delay: 0.4 + i * 0.35,
        duration: 1.2,
        x: 0,
        y: 0,
        scale: 1,
        ease: "power4.out"
      });
    });

    if (window.innerWidth <= 768) {
      gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "center center",
          end: "bottom center",
          scrub: 1,
        }
      }).to(".card", {
        y: 100,
        duration: 2,
        opacity: 0
      });
    } else {
      gsap.from(".hero p", {
        y: 200,
        duration: 2
      });
    
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "center center",
          end: "bottom center",
          scrub: 1,
          markers: false
        }
      });
    
      tl1.to(".hero p", { opacity: 0 })
        .to(images, {
          duration: 1.2,
          ease: "expo.inOut",
          x: (i, el) => {
            const centerX = card.offsetWidth / 2;
            const imageCenter = el.offsetLeft + el.offsetWidth / 2;
            return centerX - imageCenter;
          },
          scale: 0.5,
          stagger: { each: 0.15, from: "center" }
        }, "<")
        .to(images, {
          duration: 3,
          y: 520,
          ease: "expo.inOut"
        }, "+=0.2");
    
      // Animasi Role Cards
      const cards2 = gsap.utils.toArray('.card2');
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: '.role',
          start: 'top+=400 bottom',
          end: 'bottom bottom',
          scrub: 1,
          // markers: true,
        },
        defaults: { duration: 0.6, ease: 'power2.out' }
      });
    
      tl2.from(cards2, {
        y: -600,
        scale: 0.3,
        opacity: 0,
        duration: 2,
        ease: 'power4.out',
        stagger: 0.15
      }, 0);
    
      tl2.to(cards2, {
        x: (i) => (i - (cards2.length - 1) / 2) * 345,
        stagger: 0.15
      }, '+=0.2');
    
      tl2.to(cards2, {
        rotationY: 180,
        transformOrigin: 'center center',
        stagger: 0.15
      }, '+=0.2');
    
      tl2.from(".wrapper_role h1 span", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      });
    
      // Animasi Cyber Security Section
      const tl3 = gsap.timeline({
        scrollTrigger: {
          trigger: '.cyber-scurity',
          start: 'top center',
          end: 'top+=500 center',
          scrub: 1,
          // markers: true
        }
      });
    
      tl3.from(".wrapper h1 span", {
        y: 100,
        opacity: 0,
        scale: 1.5,
        filter: "blur(6px)",
        color: "#00ffff",
        stagger: {
          each: 0.06,
          from: "random"
        },
        ease: "expo.out",
        duration: 1.5
      });
      tl3.fromTo(".qna-item", 
        {
          opacity: 0,
          y: 80,
          rotateX: 45,
          transformOrigin: "top center",
          filter: "blur(4px)",
          scale: 0.9,
        }, 
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          scale: 1,
          stagger: 0.2,
          ease: "back.out(1.7)",
          duration: 1
        }
      );
    }      
  }});
  const items = document.querySelectorAll(".autoBlur");

  items.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => setActive(el),
      onEnterBack: () => setActive(el),
      onLeave: () => unsetActive(el),
      onLeaveBack: () => unsetActive(el),
      // markers: true
    });
  });
  
  function setActive(activeEl) {
    document.querySelectorAll(".autoBlur").forEach(el => {
      el.classList.remove("active");
    });
    activeEl.classList.add("active");
  }
  
  function unsetActive(el) {
    el.classList.remove("active");
  }



  const binaryContainer = document.getElementById('binaryContainer');
  const binary = document.getElementById('binaryText');
  const overlay = binaryContainer.querySelector('.overlay');
  const rightList = binaryContainer.querySelector('.list');
  let interval;

  function generateBinaryFull() {
    const containerHeight = binaryContainer.clientHeight;
    const containerWidth = binaryContainer.clientWidth;

    const fontSize = 11;     // Sesuai dengan CSS
    const lineHeight = 13;
    const charWidth = 6;     // Lebar karakter monospace estimasi

    const numRows = Math.floor(containerHeight / lineHeight);
    const numCols = Math.floor(containerWidth / charWidth);

    let output = '';
    for (let i = 0; i < numRows; i++) {
      let line = '';
      for (let j = 0; j < numCols; j++) {
        line += Math.random() < 0.5 ? '0' : '1';
      }
      output += line + '\n';
    }
    return output;
  }

  binaryContainer.addEventListener('mouseenter', () => {
    gsap.to(overlay, { opacity: 1, duration: 0.5 });
    gsap.to(binary, { opacity: 1, duration: 0.5 });
    gsap.to(rightList, { opacity: 1, duration: 0.5 });

    interval = setInterval(() => {
      binary.textContent = generateBinaryFull();
    }, 120); // Durasi ganti binary
  });

  binaryContainer.addEventListener('mouseleave', () => {
    gsap.to(overlay, { opacity: 0, duration: 0.5 });
    gsap.to(binary, { opacity: 0, duration: 0.5 });
    gsap.to(rightList, { opacity: 0, duration: 0.3 });
    clearInterval(interval);
  });

  // Zigzag Chart Hover
  const middle = document.getElementById('middleContainer');
  const zigzag = document.getElementById('zigzagGrid');
  const chartBoxes = zigzag.querySelectorAll('.chart-box');
  const middleList = middle.querySelector('.list');

  middle.addEventListener('mouseenter', () => {
    gsap.to(zigzag, { opacity: 1, duration: 0.3 });
    gsap.to(middleList, { opacity: 1, duration: 0.5 });

    const distance = 60;

    const angle320 = 320 * (Math.PI / 180);
    const offsetX320 = Math.cos(angle320) * distance;
    const offsetY320 = Math.sin(angle320) * distance;

    [0, 1].forEach(i => {
      gsap.fromTo(chartBoxes[i],
        { opacity: 0, x: offsetX320, y: offsetY320 },
        { opacity: 1, x: 0, y: 0, duration: 0.6, ease: "power3.out" }
      );
    });

    const angle140 = 140 * (Math.PI / 180);
    const offsetX140 = Math.cos(angle140) * distance;
    const offsetY140 = Math.sin(angle140) * distance;

    [2, 3].forEach(i => {
      gsap.fromTo(chartBoxes[i],
        { opacity: 0, x: offsetX140, y: offsetY140 },
        { opacity: 1, x: 0, y: 0, duration: 0.6, ease: "power3.out" }
      );
    });
  });

  middle.addEventListener('mouseleave', () => {
    gsap.to(zigzag, { opacity: 0, duration: 0.3 });
    gsap.to(middleList, { opacity: 0, duration: 0.3 });

    chartBoxes.forEach((box) => {
      gsap.to(box, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in"
      });
    });
  });

  // Left Container Hover Image Show (ZIGZAG KHUSUS)
  const leftContainer = document.getElementById('leftContainer');
  const floatImages = leftContainer.querySelectorAll('.image-float img');
  const leftList = leftContainer.querySelector('.list');
  let imageFloatTween;

  leftContainer.addEventListener('mouseenter', () => {
    if (imageFloatTween) imageFloatTween.kill();

    gsap.to(leftList, { opacity: 1, duration: 0.5 });

    imageFloatTween = gsap.to(floatImages, {
      opacity: 1,
      y: 0,
      x: (i) => (i === 0 || i === 2) ? 50 : -50,
      duration: 0.6,
      stagger: 0.25,
      ease: "power2.out"
    });
  });

  leftContainer.addEventListener('mouseleave', () => {
    if (imageFloatTween) imageFloatTween.kill();

    gsap.to(leftList, { opacity: 0, duration: 0.3 });

    gsap.to(floatImages, {
      opacity: 0,
      y: 30,
      x: 0,
      duration: 0.3,
      ease: "power2.in"
    });
  });
  