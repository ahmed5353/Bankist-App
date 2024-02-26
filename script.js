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
// message.textContent = `We use cookied for improved functionality and
// analytics. <button class="btn btn--close-cookie">Got it</button>`;

// header.append(message);
//before
header.prepend(message);
header.before(message);
// after
// header.append(message);
header.after(message);
//--->cloneNode(true)///---> to make copy of element
// header.append(message.cloneNode(true));
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
  // document
  //   .querySelector(`.operations__content--${clicked.dataset.tab}`)
  //   .classlist.add('operations__content--active');
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

//--->Sticky Navigation
// const intialCoords = section1.getBoundingClientRect();
// console.log(intialCoords);
// window.addEventListener('scroll', function () {
//   //---> will not work because top is not live
//   // if (intialCoords.top < 0) nav.classList.add('sticky');
//   if (this.window.scrollY > intialCoords.top) nav.classList.add('sticky');
//   else {
//     nav.classList.remove('sticky');
//   }
//   // console.log(window.scrollY);
// });

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
    // currentSlide++;
    // slides.forEach((s, i) => {
    //   s.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    // });
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
// LECTURES/////////////////////////////
/////////////////////////////////////
////////////////////////////
/////////////////
/*
//DOM
//selecting Elements
``;
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);
// const header = document.querySelector('header');
// //select all sections
// const allSections = document.querySelectorAll('.section');
console.log(allSections);
document.getElementById('section--1');
const allBtns = document.getElementsByTagName('button');
console.log(allBtns);
//--->what is the difference between querySelectorAll and getElementsByNameTag

//--->well //---> QSA is static
//---> getElementsByNameTag is live so it is better
// const allBtns2 = document.querySelectorAll('button');
// console.log(allBtns2);

const btnClass = document.getElementsByClassName('btn');
console.log(btnClass);
*/

//--->Styles
/*
message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
//--->  How to console the styles
console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message));
console.log(getComputedStyle(message).height);
console.log(getComputedStyle(message).color);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//change root color
// document.documentElement.style.setProperty('--color-primary', 'orangered');
*/
//--->implemting Scorlling

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log('X/Y scrolled', window.pageXOffset, pageYOffset);

  //Current view port
  console.log(
    'Height/Widhth view port',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  //Scrolling
  // window.scrollTo(
  ////////////////////////+الشوية اللي انت عملتهم سكرول
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + pageYOffset
  // );
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + pageYOffset,
  //   behavior: 'smooth',
  // });
  //--->Modern
  section1.scrollIntoView({ behavior: 'smooth' });
});
//page Navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
//--->implement scrolling using Event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
// LECTURES/////////////////////////
///////////////////////////////////////////
//Attributes
/*
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log('get attribute//');
console.log(logo.getAttribute('src'));
console.log(logo.className);
logo.alt = 'Buetiful minimlize logo';
console.log(logo.alt);

//Get attribute when not standard
const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));
//-->Data Attributes
console.log(logo.dataset.versionNumber);

//--->Classes

logo.classList.add('c', 'a');
logo.classList.remove('c');
// logo.classList.toggle('a');
console.log(logo.classList.contains('d')); //not include
console.log(logo.classList);

/*
const h1alert = function (e) {
  alert('This is alert by mouseenter, Great! :D');
  h1.removeEventListener('mouseenter', h1alert);
};
const h1 = document.querySelector('h1');
// old school
// h1.onmouseenter = h1alert;
//Modern
h1.addEventListener('mouseenter', h1alert);
// setTimeout(() => h1.removeEventListener('mouseenter', h1alert), 3000);*/
//--->Bubbling and capturing and target
/*
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('link', e.target, e.currentTarget);
  console.log(this === e.currentTarget);
  //to stop prapagation, it is not good to use
  // e.stopPropagation();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  }
  // true to make capture work
);
*/
// --->DOM Traversing
/*
const h1 = document.querySelector('h1');

console.log(h1.childNodes);
console.log(h1.children);
console.log(h1.firstElementChild);
console.log(h1.lastElementChild);
h1.firstElementChild.style.color = 'red';
h1.lastElementChild.style.color = 'blue';

//go upwards
console.log(h1.parentNode);
console.log(h1.parentElement);

//Closest
h1.closest('.header').style.background = 'var(--color-secondary)';

// Going sideways : siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// next
console.log(h1.nextElementSibling.nextElementSibling);
const h4 = document.querySelector('h4');
console.log(h4.nextElementSibling);

//Node
console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(el => {
  if (el !== h1) {
    el.style.transform = 'scale(.5)';
  }
});
console.log([...h1.parentElement.children]);
*/

//--->LIfe Cycle DOM Events
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built', e);
});

window.addEventListener('load', function (e) {
  console.log('Page Fully Loaded ', e);
});
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   e.returnValue = '';
// });
