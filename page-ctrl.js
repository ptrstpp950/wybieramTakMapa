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
  if(entries[0].isIntersecting && !reachedBottom)
    setTimeout(() => {
      reachedBottom = true;
      window.openSocialPopup()
    }, 500);
}, {
  threshold:1
});

observer.observe(document.querySelector('.who-we-are'));
