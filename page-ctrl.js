document.querySelectorAll('#share-popup-backdrop, .share-popup.content .close').forEach((el) => {
  el.addEventListener('click', () => {
    document.body.style.overflow = 'unset';
    document.querySelectorAll('.share-popup')
      .forEach(el2 => el2.style.display = 'none');
  })
})

window.openSocialPopup = () => {
  document.querySelectorAll('.share-popup')
    .forEach(el2 => el2.style.display = 'flex');
}

let reachedBottom = false;
const observer = new IntersectionObserver(entries => {
  if(entries[0].isIntersecting && !reachedBottom && window.scrollY > 0) {
    reachedBottom = true;
    setTimeout(() => {
      window.openSocialPopup()
    }, 1000);
  }
}, {
  threshold:0.5
});

observer.observe(document.querySelector('#votes-vs-mandates'));

let mapPopupOpenedOnce = false;
document.querySelectorAll('#svgMap > a > path').forEach(path => {
  path.addEventListener('click', () => {
    if(!mapPopupOpenedOnce) {
      setTimeout(()=> {
        mapPopupOpenedOnce = true;
        window.openSocialPopup();
      }, 3000);
    }
  })
})
