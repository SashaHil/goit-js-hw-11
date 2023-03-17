import './css/styles.css';
import { instance } from './services/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

let page = 1;

refs.loadMore.style.display = 'none';
refs.form.addEventListener('submit', onSubmit);
refs.loadMore.addEventListener('click', onLoadMore);

function onSubmit(e) {
  e.preventDefault();

  page = 1;

  refs.gallery.innerHTML = '';

  const name = refs.input.value.trim();

  if (name !== '') {
    instance(name);
  } else {
    refs.loadMore.style.display = 'none';
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function onLoadMore() {
  const name = refs.input.value.trim();
  page += 1;
  instance(name, page);
}

export function createItems(photos) {
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
  refs.gallery.insertAdjacentHTML('beforeend', markup);
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
    refs.loadMore.style.display = 'flex';

    Notify.success(`Hooray! We found ${totalHits} images.`);
  } else if (length < 40) {
    refs.loadMore.style.display = 'none';

    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
