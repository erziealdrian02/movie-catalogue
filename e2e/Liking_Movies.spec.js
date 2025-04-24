const assert = require('assert');

Feature('Liking Movies');

Before(({ I }) => {
  I.amOnPage('/#/like');
});

Scenario('showing empty liked movies', ({ I }) => {
  I.seeElement('#query');
  // I.seeElement('.query'); // membuat test menjadi gagal
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');
});

Scenario('liking one movie', async ({ I }) => {
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');

  I.amOnPage('/');

  I.seeElement('.movie__title a');

  const firstFilm = locate('.movie__title a').first();
  const firstFilmTitle = await I.grabTextFrom(firstFilm);
  I.click(firstFilm);

  I.seeElement('#likeButton');
  I.click('#likeButton');

  I.amOnPage('/#/like');
  I.seeElement('.movie-item');
  const likedFilmTitle = await I.grabTextFrom('.movie__title');

  assert.strictEqual(firstFilmTitle, likedFilmTitle);
});

Scenario('searching movies', async ({ I }) => {
  I.amOnPage('/#/like');
  I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');

  I.amOnPage('/');
  I.seeElement('.movie__title a');

  // Like 3 movies
  const titles = [];
  for (let i = 1; i <= 3; i++) {
    I.click(locate('.movie__title a').at(i));
    I.waitForElement('#likeButton', 5);
    I.click('#likeButton');
    const title = await I.grabTextFrom('.movie__title');
    titles.push(title);
    I.amOnPage('/');
  }

  I.amOnPage('/#/like');
  I.waitForElement('#query', 5);

  // Use full title for search
  const searchQuery = titles[1].toLowerCase();
  I.fillField('#query', searchQuery);
  I.pressKey('Enter');
  I.waitForElement('.movie-item', 5);

  const matchingMovies = titles.filter((title) =>
    title.toLowerCase().includes(searchQuery)
  );

  for (let index = 0; index < matchingMovies.length; index++) {
    const visibleTitle = await I.grabTextFrom(
      locate('.movie__title').at(index + 1)
    );
    assert.strictEqual(
      matchingMovies[index].toLowerCase(),
      visibleTitle.toLowerCase()
    );
  }
});
