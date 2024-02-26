'use strict';
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const textContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const dotContainer = document.querySelector('.dots');

///////////////////////////////////////
//add cookie message
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = `We use cookied for improved functionality and
analytics. <button class="btn btn--close-cookie">Got it</button>`;



header.prepend(message);
header.before(message);
// after

header.after
//--->Styles

message.style.backgroundColor = '#37383d';
// Delete Element
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();

    // message.parentElement.removeChild(message);
  });
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
//--->click anywahere to close the pop up window
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//--->Tabbed Component

textContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  //---> Guard Clause
  if (!clicked) return;
  //Disactive classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Activiate Tabs
  clicked.classList.add('operations__tab--active');

  //Activiate Content Area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');

});

// Menu Animation

const opacityAnimation = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    const logo = link.closest('.nav').querySelector('img');
    // console.log(logo);
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', opacityAnimation.bind(0.5));

nav.addEventListener('mouseout', opacityAnimation.bind(1));


const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
});
headerObserver.observe(header);

//---> Reveal Section
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//--->Images Lazy loading
const imgTarget = document.querySelectorAll('img[data-src]');
const loading = function (entries, observer) {
  const [entry] = entries;
  //--->it excuted earlier beacause 8rem transformY that you added
  console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});
imgTarget.forEach(img => imgObserver.observe(img));

//Excute Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  //

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
    //-100%,0%,100,200,300
  };
  const activeDot = function (slide) {
    const dots = document.querySelectorAll('.dots__dot');
    dots.forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  let currentSlide = 0;
  const maxSlide = slides.length;
  // For Testing

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(.4) translateX(-400px)';
  // slider.style.overflow = 'visible';
  //Functions
  const createDots = function (e) {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const nextSlide = function () {
    if (maxSlide - 1 === currentSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    goToSlide(currentSlide);
    activeDot(currentSlide);
    //-100%,0%,100,200,300
  };
  const leftSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }

    goToSlide(currentSlide);
    activeDot(currentSlide);
    // console.log(currentSlide);
  };
  const init = function () {
    goToSlide(0);
    createDots();
    activeDot(0);
  };
  init();
  //Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', leftSlide);
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && leftSlide();
  });
  //Activiate Dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      currentSlide = parseInt(slide, 10);

      //to convert it to numv=ber and fix the bug
      // const slide = +e.target.slide;
      //FIX the Bug
      goToSlide(slide);
      activeDot(slide);
    }
  });
};
slider();

//--->implemting Scorlling

btnScrollTo.addEventListener('click', function (e) {


  //Current view port
  console.log(
    'Height/Widhth view port',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
 
  //--->Modern
  section1.scrollIntoView({ behavior: 'smooth' });
});

//--->implement scrolling using Event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

console.log(logo.classList.contains('d')); //not include
console.log(logo.classList);


//--->LIfe Cycle DOM Events
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built', e);
});

window.addEventListener('load', function (e) {
  console.log('Page Fully Loaded ', e);
});
