const thumbnails = require('./data/data.json');
const orderDatas = require('./data/orders.json');
const axios = require('axios');

async function clearPhotos() {
  const photos = await getPhotos();
  for (const photo of photos) {
    await axios.delete(`http://www.everywear.site/api/photos/${photo.id}`);
  }
}

async function clearOrders() {
  const orders = await getOrders();
  for (const order of orders) {
    await axios.delete(`http://www.everywear.site/api/orders/${order.id}`);
  }
}

async function clearUsers() {
  const users = await getUsers();
  for (const user of users) {
    await axios.delete(`http://www.everywear.site/api/users/${user.id}`);
  }
}

async function getPhotos() {
  try {
    const { data } = await axios.get('http://www.everywear.site/api/photos?_limit=9999');
    return data || [];
  } catch (e) {
    return [];
  }
}

async function getOrders() {
  try {
    const { data } = await axios.get('http://www.everywear.site/api/orders?_limit=9999');
    return data || [];
  } catch (e) {
    return [];
  }
}

async function getUsers() {
  try {
    const { data } = await axios.get('http://www.everywear.site/api/users?bot=true&_limit=9999');
    return data || [];
  } catch (e) {
    return [];
  }
}

function getNewPhotos() {
  const newThumbnailPhotos = [];
  const newDetailPhotos = [];

  for (const thumbnail of thumbnails) {
    const base = thumbnail.name.split('.')[0];
    const type = base.split('_')[0];
    const photoId = Number(base.split('_')[1]);
    const index = Number(base.split('_')[2]);
    const url = thumbnail.formats.large.url;

    if (type === 't') {
      newThumbnailPhotos.push({ type, photoId, index, url });
    } else {
      newDetailPhotos.push({ type, photoId, index, url });
    }
  }

  newThumbnailPhotos.sort((p1, p2) => p1.index > p2.index ? 1 : (p1.index < p2.index ? -1 : 0));
  newThumbnailPhotos.sort((p1, p2) => p1.photoId > p2.photoId ? 1 : (p1.photoId < p2.photoId ? -1 : 0));
  newDetailPhotos.sort((p1, p2) => p1.index > p2.index ? 1 : (p1.index < p2.index ? -1 : 0));
  newDetailPhotos.sort((p1, p2) => p1.photoId > p2.photoId ? 1 : (p1.photoId < p2.photoId ? -1 : 0));

  const newPhotos = [...newThumbnailPhotos, ...newDetailPhotos];
  return newPhotos;
}

async function applyPhotos() {
  console.log('Apply Photos...');
  const photos = getNewPhotos();

  for (const photo of photos) {
    const { data } = await axios.get(`http://www.everywear.site/api/orders?mapping=${encodeURI(`d_${photo.photoId}`)}`);
    const order = data[0];

    if (order) {
      const _photo = {
        name: `${photo.type}_${photo.photoId}_${photo.index}`,
        url: photo.url
      };

      if (photo.type === 't') {
        _photo.thumbnail_order = order.id;
      } else {
        _photo.detail_order = order.id;
      }

      await axios.post(`http://www.everywear.site/api/photos`, _photo);
    }
  }
}

async function applyOrders() {
  console.log('Apply Orders...');
  for (const order of orderDatas) {
    const { data } = await axios.get(`http://www.everywear.site/api/users?username=${encodeURI(order.username)}`);
    const user = data[0];
    const _order = {
      title: order.name,
      description: order.description,
      mapping: order.mapping,
      ea: order.ea,
      deadline: order.deadline,
      address: order.address,
      phone: order.phone,
      user: user.id,
      location: order.location
    };

    try {

      await axios.post(`http://www.everywear.site/api/orders`, _order);
    } catch (e) {
      console.log(e);
    }
  }
}

async function applyUsers() {
  console.log('Apply Users...');
  for (const order of orderDatas) {
    const { data } = await axios.get(`http://www.everywear.site/api/users?username=${encodeURI(order.username)}`);
    const user = data[0];
    if (!user) {
      const _user = {
        username: order.username,
        bot: true,
        type: 'upper',
        email: `${order.username}@everyfactory.site`,
        provider: 'emai',
        password: '!hashstring',
        confirmed: true,
        blocked: false,
      }

      await axios.post(`http://www.everywear.site/api/users`, _user);
    }
  }
}

async function main() {
  await clearPhotos();
  await clearOrders();
  await clearUsers();

  await applyUsers();
  await applyOrders();
  await applyPhotos();
}

main();