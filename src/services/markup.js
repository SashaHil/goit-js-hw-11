// import { getAllPhotos } from '../requests/images';

// const refs = {
//   form: document.querySelector('#search-form'),
//   input: document.querySelector('input[name="searchQuery"]'),
//   gallery: document.querySelector('.gallery'),
// };

// refs.form.addEventListener('submit', onSubmit);

// export async function onSubmit(e) {
//   e.preventDefault();
//   page = 1;
//   onClear();
//   const {
//     webformatURL,
//     largeImageURL,
//     tags,
//     likes,
//     views,
//     comments,
//     downloads,
//   } = await getAllPhotos(e.target.elements.querySelector.value);
//   const markup = `div class="photo-card">
//     <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//     <div class="info">
//       <p class="info-item">
//         <b>Likes: ${likes}</b>
//       </p>
//       <p class="info-item">
//         <b>Views: ${views}</b>
//       </p>
//       <p class="info-item">
//         <b>Comments: ${comments}</b>
//       </p>
//       <p class="info-item">
//         <b>Downloads: ${downloads}</b>
//       </p>
//     </div>
//   </div>`;
//   refs.gallery.insertAdjacentHTML('beforeend', markup);
// }

// function onClear() {
//   refs.gallery.innerHTML = '';
// }
