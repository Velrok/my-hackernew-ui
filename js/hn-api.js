export const fetchItem = (id) =>
  fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) =>
    r.json()
  );

export const topStories = (count) => {
  return fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {})
    .then((r) => r.json())
    .then((ids) => {
      return Promise.all(ids.slice(0, count).map(fetchItem));
    });
};
