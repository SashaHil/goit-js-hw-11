import axios from 'axios';
import { createItems } from '../index';
import { Notification } from '../index';

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
