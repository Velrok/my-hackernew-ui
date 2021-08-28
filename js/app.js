// import { h, Component, render } from 'https://unpkg.com/preact?module';

import {
  useState,
  useEffect,
} from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module'; // This was a pain! Thanks to https://github.com/preactjs/preact/issues/1961
// More info at: https://preactjs.com/guide/v10/getting-started#no-build-tools-route
import { html, render } from 'https://unpkg.com/htm/preact/index.mjs?module';
import { topStories } from './hn-api.js';

const isNumber = (x) => typeof x == 'number' && !isNaN(x);

const Story = ({ story, index }) =>
  html`<div class="Story" id="Story#${story.id}" tabindex=${100 + index}>
    <span class="Story_title">${story.title}</span>
  </div>`;

const StoyList = ({ items }) =>
  html`<div class="StoryList">
    ${items.map((item, idx) => html`<${Story} story=${item} index=${idx} />`)}
  </div>`;

// Create your app
const App = () => {
  const [stories, setStories] = useState([]);
  const [selectedStory, _setSelectedStory] = useState(null);
  const setSelectedStory = (i, total) => {
    let x = i % total;
    if (x < 0) {
      x = total + x;
    }
    const n = x % total;
    console.log('total', total, 'i', i, 'x', x, '->', n);
    _setSelectedStory(n);
  };

  const keydown = (e) => {
    console.log('keydown selectedStory', selectedStory);
    if (e.key == 'j') {
      isNumber(selectedStory) &&
        setSelectedStory(selectedStory + 1, stories.length);
    } else if (e.key == 'k') {
      isNumber(selectedStory) &&
        setSelectedStory(selectedStory - 1, stories.length);
    }
  };

  useEffect(async () => {
    setStories(await topStories(5));
    setSelectedStory(0, 5);
    //document.addEventListener('keydown', keydown);
  }, []);

  useEffect(() => {
    console.log('>selectedStory', selectedStory);
    const el =
      isNumber(selectedStory) &&
      document.getElementById(`Story#${stories[selectedStory].id}`);
    el && el.focus();
    el && console.log('>> focus on ', el);
  }, [selectedStory]);

  return html`<div class="App" onkeydown=${keydown}>
    <h1>HackerNews</h1>
    <${StoyList} items=${stories} />
  </div>`;
};

render(html`<${App} />`, document.body);
