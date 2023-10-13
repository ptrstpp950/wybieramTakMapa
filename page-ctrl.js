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

let seenPopup = false;
const observer = new IntersectionObserver(entries => {
  if(entries[0].isIntersecting && !seenPopup && window.scrollY > 0) {
    seenPopup = true;
    setTimeout(() => {
      window.openSocialPopup()
    }, 1000);
  }
}, {
  threshold:0.5
});

observer.observe(document.querySelector('#votes-vs-mandates'));

document.querySelectorAll('#svgMap > a > path').forEach(path => {
  path.addEventListener('click', () => {
    if(!seenPopup) {
      seenPopup = true;
      setTimeout(()=> {
        window.openSocialPopup();
      }, 3000);
    }
  })
})
