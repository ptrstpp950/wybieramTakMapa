document.querySelectorAll('#share-popup-backdrop, .share-popup.content .close').forEach((el) => {
  el.addEventListener('click', () => {
    document.body.style.overflow = 'unset';
    document.querySelectorAll('.share-popup')
      .forEach(el2 => el2.style.display = 'none');
  })
})

window.openSocialPopup = () => {
  /*document.querySelectorAll('.share-popup')
    .forEach(el2 => el2.style.display = 'flex');*/
}

let seenPopup = localStorage.getItem('seenPopup') ?? true;
const observer = new IntersectionObserver(entries => {
  if(entries[0].isIntersecting  && !isSilenced && !seenPopup && window.scrollY > 0) {
    seenPopup = true;
    setTimeout(() => {
      //window.openSocialPopup()
    }, 1000);
  }
}, {
  threshold:0.5
});

observer.observe(document.querySelector('#votes-vs-mandates'));

document.querySelectorAll('#svgMap > a > path').forEach(path => {
  path.addEventListener('click', () => {
    if(!seenPopup && !isSilenced) {
      seenPopup = true;
      setTimeout(()=> {
        //window.openSocialPopup();
      }, 3000);
    }
  })
})

// silencer
function hideShare() {
  document.querySelectorAll('.silence-hidable').forEach(
    el => el.style.display = 'none'
  );
}
function showShare() {
  //window.location.reload();
}
const start = new Date('2023-10-13T23:59:59+02:00');
const end = new Date('2023-10-15T21:00:00+02:00');
let isSilenced = true;
if(Date.now() <= +end) {
  let intervalId = setInterval(() => {
    if(Date.now() > +start && Date.now() <= +end) {
      isSilenced = true;
      hideShare();
    }
    if(Date.now()>+end && intervalId) {
      isSilenced = false;
      clearInterval(intervalId)
      showShare();
    }
  }, 1000);
}
