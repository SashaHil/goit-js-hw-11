import './css/styles.css';
import { instance } from './services/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  btnloadMore: document.querySelector('.load-more'),
};

let page = 1;

refs.btnloadMore.style.display = 'none';
refs.form.addEventListener('submit', onSubmit);
refs.btnloadMore.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();

  page = 1;

  refs.gallery.innerHTML = '';

  const name = refs.input.value.trim();

  if (name !== '') {
    const data = await instance(name);
    createItems(data);
  } else {
    refs.btnloadMore.style.display = 'none';
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function onLoadMore() {
  const name = refs.input.value.trim();
  page += 1;
  const data = await instance(name, page);
  createItems(data, true);
}

export function createItems(photos, append = false) {
  const markup = photos.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<a class ="photo-link" href="${largeImageURL}">
    <div class="photo-card">
        <div class="photo">
     <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
        </div>
     <div class="info">
       <p class="info-item">
         <b>Likes: ${likes}</b>
       </p>
       <p class="info-item">
         <b>Views: ${views}</b>
       </p>
       <p class="info-item">
         <b>Comments: ${comments}</b>
       </p>
       <p class="info-item">
         <b>Downloads: ${downloads}</b>
       </p>
     </div>
     </div>
   </a>`
    )
    .join('');
  if (append) {
    refs.gallery.insertAdjacentHTML('beforeend', markup);
  } else {
    refs.gallery.innerHTML = markup;
  }
  simpleLightbox.refresh();
}

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function Notification(length, totalHits) {
  if (length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else if (page === 1) {
    refs.btnloadMore.style.display = 'flex';

    Notify.success(`Hooray! We found ${totalHits} images.`);
  } else if (page >= Math.ceil(totalHits / 40)) {
    refs.btnloadMore.style.display = 'none';
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
