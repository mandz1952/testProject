//header carousel

const slideOne = document.querySelector(".slider-one .slider-wrap");
const slides = document.querySelectorAll(".slider-one .slide");
const slideCount = slides.length;
let currentIndex = 0;

const firstClone = slides[0].cloneNode(true);
slideOne.appendChild(firstClone);

function moveSlide() {
  currentIndex++;
  if (currentIndex >= slideCount) {
    setTimeout(() => {
      slideOne.style.transition = "none";
      currentIndex = 0;
      slideOne.style.transform = `translateX(0%)`;
    }, 1000);
  }
  slideOne.style.transition = "transform 1s ease";
  slideOne.style.transform = `translateX(-${currentIndex * 100}%)`;
}
let interval;
function startCarousel() {
  interval = setInterval(moveSlide, 3000);
}
function stopCarousel() {
  clearInterval(interval);
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopCarousel();
  } else {
    startCarousel();
  }
});
startCarousel();

//header_titel

const spanElements = document.querySelectorAll(".content_titel span");
function updateUnderlines() {
  spanElements.forEach((spanElement) => {
    const rect = spanElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const underlineTop = rect.top;
    const underlineBottem = rect.bottom;
    if (underlineBottem > 0 && underlineTop < windowHeight) {
      const visibleRadio = Math.min(
        1,
        Math.max(0, ((windowHeight - underlineBottem) / windowHeight) * 1.5)
      );
      spanElement.style.setProperty(
        "--underline-width",
        `${visibleRadio * 100}%`
      );
    } else {
      spanElement.style.setProperty("--underline-width", `0%`);
    }
  });
}
window.addEventListener("scroll", updateUnderlines);
updateUnderlines();

//backround_change

// function updateUnderlines_background() {
//     let isElementVisible_background = false;

//     spanElements_background.forEach((spanElement_background) => {
//         const rect_background = spanElement_background.getBoundingClientRect();
//         const windowHeight_background = document.documentElement.clientHeight;

//         if (
//             //rect_background.bottom > 0 && rect_background.top < windowHeight_background
//             rect_background.top<2500 && rect_background.top>0) {
//             isElementVisible_background = true;

//         }

//     });

//     if (isElementVisible_background) {
//         document.body.style.backgroundColor = "#212027";
//         document.documentElement.style.setProperty('--black', '#FCFAF7');

//     } else {
//         document.body.style.backgroundColor = "white";
//         document.documentElement.style.setProperty('--black', '#212027');

//     }
// }

// window.addEventListener("scroll", ()=>{
//     let scroll= window.scrollY
//     console.log(scroll);

const observer = new IntersectionObserver((entries) => {
    
    entries.forEach(entry => {
        // console.log(screen_width)
      if (entry.isIntersecting && screen_width>790) {
        
        document.body.style.backgroundColor = "#212027";
        document.documentElement.style.setProperty('--black', '#FCFAF7');
      } else{
        document.body.style.backgroundColor = "white";
        document.documentElement.style.setProperty('--black', '#212027');
      }
    });
  });
  
  // Target element
  const spanElements_background = document.querySelectorAll(".my_work .content_titel ");
  spanElements_background.forEach(el=>{
    observer.observe(el);
  }
  )

  



// updateUnderlines_background();

// console.log(document.body.scrollTop);

// window.addEventListener("scroll", updateUnderlines_background);
// // updateUnderlines_background();

// // ===== my_works КАРУСЕЛЬ =====

// const sliderWrap3 = document.querySelector('.slider-two .slider-wrap');
// let sliderItems = document.querySelectorAll('.slider-two .slider-item');
// const slideCount3 = sliderItems.length;

// sliderWrap3.append(sliderItems[0].cloneNode(true));
// sliderWrap3.append(sliderItems[1].cloneNode(true));
// sliderWrap3.append(sliderItems[2].cloneNode(true));

// sliderItems = document.querySelectorAll('.slider-two .slider-item');
// const resetScale = function() {
//     sliderItems.forEach(function(item, index) {
//         if(index % 2 == 0) item.style.transform = 'rotate(10deg) scale(0.6)';
//         else item.style.transform = 'rotate(-10deg) scale(0.6)';
//     }, 3000);
// }

// resetScale();

// let currentIndex3 = 1;
// sliderItems[currentIndex3].style.transform = rotate(${currentIndex3 % 2 == 0 ? 10 : -10}deg) scale(1);

// sliderWrap3.style.transition = '0.3s';

// const moveSlide3 = function() {

//     resetScale();
//     currentIndex3++;
//     if(parseInt(sliderWrap3.style.top) <= 190 - ((slideCount3 + 1) * 300)) {
//         sliderWrap3.style.transition = 'none';
//         sliderWrap3.classList.remove('slider-anim');
//         currentIndex3 = 1;
//         sliderWrap3.style.top = '-110px';
//         setTimeout(function() {
//             sliderWrap3.style.transition = '0.3s';
//             sliderWrap3.classList.add('slider-anim');
//         }, 0)
//     } else sliderWrap3.style.top = ${parseInt(sliderWrap3.style.top) - 300}px;

//     sliderItems[currentIndex3].style.transform = rotate(${currentIndex3 % 2 == 0 ? 10 : -10}deg) scale(1);

//     if(currentIndex3 == 1) setTimeout(moveSlide3, 0);
//     else setTimeout(moveSlide3, 1000);

// }

// setTimeout(moveSlide3, 1000);

const photos_work = document.querySelector(".slider_two .slider-wrap");
let photos = document.querySelectorAll(".slider_two .slider-item ");

let photo_intex = 1;

photos_work.appendChild(photos[0].cloneNode(true));
photos_work.appendChild(photos[1].cloneNode(true));
photos_work.appendChild(photos[2].cloneNode(true));
photos = document.querySelectorAll(".slider_two .slider-item img");
const photosCount = photos.length;
function rotation() {
  photos.forEach(function (item) {
    item.style.transform = "rotate(10deg) scale(0.9)";
  });
}

function movePhotos(){

    rotation()
    photo_intex++

    if (photo_intex>photosCount-2){
        photo_intex = 1
        photos_work.style.top="-110px"

        photos_work.style.transition="2ms"

    }
    else{

        photos_work.style.top=`${parseInt(photos_work.style.top)-(photos[photo_intex].naturalHeight)}px`
        photos_work.style.transition="0.5s"

    }
    photos[photo_intex-1].style.transform="scale(1) rotate(-10deg)"
    photo_intex==1?setTimeout(movePhotos,0):setTimeout(movePhotos,2000)
}


function movePhotos_photos() {
    
  photo_intex++;
  photos[1].style.height=`${screen_width}px`
  photos[1].style.width=`${screen_width-screen_width*0.1}px`
  photos[photo_intex].style.width=`${screen_width-screen_width*0.1}px`
    photos[photo_intex].style.height=`${screen_width}px`
 
  console.log(photos[photo_intex].style.width)
  if (photo_intex > photosCount - 2) {
    photo_intex = 1;
    photos_work.style.left = "0px";

    photos_work.style.transition = "2ms";
  } else {
    photos_work.style.left = `${parseInt(photos_work.style.left || 0) - 550}px`;
    photos_work.style.transition = "0.5s";
  }
  photo_intex == 1
    ? setTimeout(movePhotos_photos, 0)
    : setTimeout(movePhotos_photos, 2000);
}

let screen_width = document.documentElement.clientWidth
screen_width<790?setTimeout(movePhotos_photos, 1000):setTimeout(movePhotos,1000)
//carousel reviews

const photos_revieuw = document.querySelector(".review_slider .slider_wrap");
let reviews = document.querySelectorAll(".review_slider .slide");
let review_index = 1;

const gap = window.getComputedStyle(photos_revieuw).gap;
const numericGap = parseInt(gap);

photos_revieuw.appendChild(reviews[0].cloneNode(true));
photos_revieuw.appendChild(reviews[1].cloneNode(true));
photos_revieuw.appendChild(reviews[2].cloneNode(true));

reviews = document.querySelectorAll(".review_slider .slide");
photos_revieuw.appendChild(reviews[3].cloneNode(true));
photos_revieuw.appendChild(reviews[0].cloneNode(true));
photos_revieuw.appendChild(reviews[1].cloneNode(true));
photos_revieuw.appendChild(reviews[2].cloneNode(true));
const review_Count = reviews.length;

function moveReviews() {
  reviews.forEach((reslide) => {
    reslide.classList.remove("active");
  });
  reviews[review_index].classList.add("active");

  review_index == 5
    ? setTimeout(moveReviews, 0)
    : setTimeout(moveReviews, 3000);

  if (review_index >= review_Count - 2) {
    photos_revieuw.style.transition = "none";
    review_index = 1;
    photos_revieuw.style.transform = `translateX(0%)`;
  } else {
    photos_revieuw.style.transition = "transform 1s ease";

    photos_revieuw.style.transform = `translateX(-${
      review_index * (reviews[0].getBoundingClientRect().width + numericGap)
    }px)`;
    review_index++;
  }
}

setTimeout(moveReviews, 3000);

// document.addEventListener('visibilitychange', ()=>{
//     if (document.hidden){
//         stopCarousel_3()
//     }
//     else {
//         startCarousel_3()
//     }
// })

//phone burger menu
const burger_m = document.querySelector(".menu_phone_in");
const top_bar = document.querySelector(".top_bar");
const three_lines = document.querySelector(".menu_phone");
const exit = document.querySelector(".button_exet");

let menuOpen = false;

// function burger_menu(){
//     if (menuOpen){
//         burger_m.style.display='none'
//         top_bar.style.margin='21px 0px 21px 0px'
//         menuOpen=false
//     }
//     else{
//         burger_m.style.display='block'
//         top_bar.style.margin='0px'
//         burger_m.style.top='0px'
//         menuOpen=true
//     }

// }

three_lines.addEventListener("click", () => {
  burger_m.classList.toggle("active_phone_in");
});
exit.addEventListener("click", () => {
  burger_m.classList.toggle("active_phone_in");
});
