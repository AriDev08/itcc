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


let shuffleIndex = 0;
const shuffleInterval = setInterval(() => {
  shuffleIndex = (shuffleIndex + 1) % (shuffleImages.length - 1);
  cardsStack[3].src = shuffleImages[shuffleIndex];
}, 150);


setTimeout(() => {
  clearInterval(shuffleInterval);
  cardsStack[3].src = shuffleImages[3]; 


  if (cardsStack[3].complete) {
    finishLoading();
  } else {
    cardsStack[3].onload = () => finishLoading();
    cardsStack[3].onerror = () => finishLoading();
  }
}, 2000);

function finishLoading() {
  gsap.to(cardsStack[3], {
    duration: 1,
    ease: "power4.in",
    onComplete: () => {
      loadingScreen.remove();
      ScrollTrigger.refresh();
      animateCards();
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
  