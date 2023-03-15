import './css/styles.css';
// import { onSubmit } from './services/markup';
// import { getAllPhotos } from './requests/images';
// import { instance } from './services/api';

// async function addImages() {
//   const imageInfo = await getAllPhotos();
//   console.log([addImages]);
//   onSubmit(addImages.name);
// }

// addImages();

import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
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

export async function instance(name, page) {
  const BASE_URL = 'https://pixabay.com/api/';

  const options = {
    params: {
      key: '34416296-fda96b516d83885efe030181a',
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  };
  try {
    const response = await axios.get(BASE_URL, options);

    Notification(response.data.hits.length, response.data.total);

    createItems(response.data);
  } catch (error) {
    console.log(error);
  }
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

function Notification(length, totalHits) {
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
