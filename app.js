
let cards = [];
let deck = JSON.parse(localStorage.getItem('mushiDeck') || '[]');

function show(id) {
  document.querySelectorAll('main section').forEach(section => {
    section.classList.add('hidden');
  });

  document.getElementById(id).classList.remove('hidden');
}

function renderCards() {
  const list = document.getElementById('cardlist');
  const search = document.getElementById('search').value.trim();

  list.innerHTML = '';

  const filtered = cards.filter(card =>
    card.name.includes(search)
  );

  filtered.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <div style="padding:12px;background:#17251d;border-radius:8px">
        <strong>${card.name}</strong>
        <p>${card.rarity || ''}</p>
      </div>
      <button onclick="addDeck('${card.id}')">デッキに追加</button>
    `;

    list.appendChild(div);
  });
}

function addDeck(id) {
  const card = cards.find(c => c.id === id);
  if (!card) return;

  deck.push(id);
  saveDeck();
}

function removeDeck(index) {
  deck.splice(index, 1);
  saveDeck();
}

function saveDeck() {
  localStorage.setItem('mushiDeck', JSON.stringify(deck));
  renderDeck();
}

function renderDeck() {
  const list = document.getElementById('decklist');
  document.getElementById('deckcount').textContent = deck.length;

  list.innerHTML = '';

  deck.forEach((id, index) => {
    const card = cards.find(c => c.id === id);
    if (!card) return;

    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <div style="padding:12px;background:#17251d;border-radius:8px">
        <strong>${card.name}</strong>
      </div>
      <button onclick="removeDeck(${index})">削除</button>
    `;

    list.appendChild(div);
  });
}

fetch('cards.json')
  .then(response => {
    if (!response.ok) throw new Error('cards.jsonが読み込めません');
    return response.json();
  })
  .then(data => {
    cards = data;
    renderCards();
    renderDeck();
  })
  .catch(error => {
    console.error(error);
    document.getElementById('cardlist').textContent =
      'カードデータを準備中です。';
  });
