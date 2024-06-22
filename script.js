const challenges = [
  {prompt: 'Password must not be empty.', check: (text) => text.length > 0},
  {prompt: 'Password must include a number.', check: (text) => /\d/.test(text)},
  {prompt: 'Password must include a special character.', check: (text) => /[^a-zA-Z0-9]/.test(text)},
  {prompt: 'Password must be atleast 8 characters.', check: (text) => text.length >= 8},
  {prompt: 'Password must include both lower case and upper case characters.', check: (text) => /[a-z]/.test(text) && /[A-Z]/.test(text)},
  {prompt: 'The Password must include a "?".', check: (text) => text.includes('?')},
  {prompt: (text) => `The character at the 4th position ("${text[3]}") must be numberic.`, check: (text) => !isNaN(parseFloat(text[3]))},
  {prompt: (text) => `Password must only include each letter (upper- and lowercase separately) once, at maximum. (Duplicate letters: ${getDuplicateLetters(text).length > 0 ? getDuplicateLetters(text).map((l) => `"${l}"`).join(', ') : 'None! ☺'})`, check: (text) => getDuplicateLetters(text).length === 0},
  {prompt: (text) => `Password must not have more than 40 characters. <i>(Currently: ${text.length} characters)</i>`, check: (text) => text.length <= 40},
  {prompt: (text) => `Password must not be made out of a total number of characters that is a multiple of 7. <i>(Currently: ${text.length} characters)</i>`, check: (text) => text.length % 7 > 0},
  {prompt: 'Password must include the title of a Key work.', check: (text) => convert(/(?:clannad|rewrite|kamisama|kanon|air|clannad|summer pockets|planetarian|little busters|harmonia|kud wafter|angel beats|charlotte)/i).test(text)},
  {prompt: `Password must include one of the names of the following nuggets.
    <div class="image-container">
      <img src="assets/ayu.jpg">
      <img src="assets/fuko.jpg">
      <img src="assets/renge.png">
    </div>`, check: (text) => convert(/(?:ayu|fuko|renge)/i).test(text)},
  {prompt: 'Password must also include a literal nugget (🐥).', check: (text) => text.includes('🐥')},
  {prompt: 'Password must not repeat any characters right after each other.', check: (text) => !/(.)\1/.test(text)},
  {prompt: '<img src="assets/leatherhead.jfif">', check: (text) => convert(/(?:fuck|fock)/i).test(text)},
  {prompt: 'The Password must end on 3 digits.', check: (text) => /\d{3}$/.test(text)},
  {prompt: 'Password must include the German word for shit.', check: (text) => convert(/(?:scheiße|scheisse)/i).test(text)},
  {prompt: 'Babe wake up it\'s ____ Saturday!', check: (text) => convert(/vivy/i).test(text)},
  {prompt: (text) => `Password must have a total sum of all digits equal to 5. <i>(Current total sum: ${checksum(text)})</i>`, check: (text) => {
    return checksum(text) === 5;
  }},
  {prompt: 'Password must include any of the parts of this:<br/><audio controls><source src="assets/copium.mp3" type="audio/mp3"></audio>', check: (text) => convert(/(?:gatrandis|babel|ziguret|ziggurat|shiguret|emustolronzen|fine|baral|zizzl|zill|edenal|edenahl)/i).test(text)},
  {prompt: `Password must not include any part that contains more than 3 consecutive letters.</br>But hey, you can use <span onclick="alert(Object.entries(leetspeakTable).map(([key, value]) => key + ' -> ' + value.join(', ')).join('\\n'))"><b>l33t5p34k</b></span> (<i>partly, atleast.</i>)!`, check: (text) => !/[a-zA-Z]{4}/gi.test(text), modify: 'midnight'},
  {prompt: (text) => `The character at the 10th position ("${text[9]}") must be numberic.`, check: (text) => !isNaN(parseFloat(text[9]))},
  {prompt: 'Password must not include the letter "E".', check: (text) => !/e/i.test(text)},
  {prompt: `<b>Help!</b> R. Kelly is trapped inside the closet!<br/><img src="assets/trapped.jpg" style="max-height:22vh"><br/>Include the solution of <img src="assets/equation.png"> at the start of the Password to free Kelly!`, check: (text) => /^32/.test(text)},
  {prompt: 'The Password must have alternating upper- and lowercase characters next to each other, if applicable.', check: (text) => !/(?:[a-z]{2}|[A-Z]{2})/.test(text)},
  {prompt: '麻_准 ?', check: (text) => text.includes('枝')},
  {prompt: (text) => `The Password must include its own length as a number inside of it. <i>(Currently: ${text.length} characters)</i>`, check: (text) => text.includes(text.length)},
  {prompt: (text) => `The next number to the right and left of 🐥 (<i>${closestNumbersTo('🐥', text).join(', ')} </i>) must be a prime, "0" or "1".`, check: (text) => {
      const result = closestNumbersTo('🐥', text);

      if(result.length < 2) return false;
      return isPrime(result[0]) === -1 && isPrime(result[1]) === -1;
    }},
  {prompt: 'Gur Cnffjbeq zhfg vapyhqr na :rtt:', check: (text) => text.includes('🥚')},
  {prompt: 'The Password must include a X=X equation, where X is the same number.</br>You may now <b>reverse</b> all words!', check: (text) => /(\d)=\1/.test(text), modify:'winter'},
  {prompt: 'To answer the question of which came first and which second, the Password must first include "🥚?" and then afterwards "🐥!"', check: (text) => /🥚?.*🐥!/.test(text)},
  {prompt: (text) => `The character at the 27th position ("${text[26]}") must be numberic.`, check: (text) => !isNaN(parseFloat(text[26]))},
];
const solution = "the key";
let passedLevel = 4;

let outputDiv;

const closestNumbersTo = (symbol, text) => {
  const result = [...text.matchAll(new RegExp('(\\d+)\\D*' + symbol + '\\D*(\\d+)', 'g'))][0] ?? [];
  if(result.length < 2) return [];

  return [result[1], result[2]];
};

const getDuplicateLetters = (text) => {
  const charCount = {};
  for (let char of text) {
      if(char < 'A' || char > 'z') continue;

      if (charCount[char]) {
          charCount[char]++;
      } else {
          charCount[char] = 1;
      }
  }

  const duplicates = [];
  for (let char in charCount) {
      if (charCount[char] > 1) {
          duplicates.push(char);
      }
  }

  return duplicates;
}

const leetspeakTable = {
  a: ['4'],
  b: ['8'],
  c: ['\\('],
  e: ['3'],
  f: ['|='],
  g: ['6'],
  h: ['8', '#'],
  i: ['1', '!'],
  l: ['1', '!'],
  n: ['2'],
  o: ['0'],
  p: ['9'],
  q: ['0'],
  r: ['2'],
  s: ['5'],
  t: ['7'],
  z: ['2'],
}

const convert = (regex) => {
  let source = regex.source;
  let reversedSource = [...regex.source.matchAll(/[^?:|()]+/gm)];
  reversedSource = reversedSource.map((token) => token[0].split("").reverse().join(""));

  source = source + '|(?:' + reversedSource.join('|') + ')';

  Object.entries(leetspeakTable).forEach(([key, value]) => {
    source = source.replaceAll(new RegExp(`(${key.toLowerCase()}|${key.toUpperCase()})`, 'g'), (res) => `(?:${res}|${value.join('|')})`);
  });

  const newRegex = new RegExp(source, regex.flags);
  return newRegex;
}

const isPrime = (num) => {
  for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
      if(num % i === 0) return i;
  }
  return -1;
};

const checksum = (text) => {
  const result = text.matchAll(/\d/g);
  if(result === null) return 0;

  let res = result.reduce((previous, current) => {
    return previous + +current;
  }, 0);

  if(res > 9) {
    res = checksum('' + res);
  }

  return res;
};

document.addEventListener("DOMContentLoaded", function() {
  let inputBox = document.getElementById("inputBox");
  outputDiv = document.getElementById("challenges");

  inputBox.addEventListener("input", () => updateRules(inputBox.value));
  setup();
});

const setup = () => {
  let previous = undefined;

  challenges.forEach((challenge, i) => {
    const div = document.createElement('div');
    div.id = 'challenge-' + i;
    div.className = 'challenge unsolved mt-2 shadow-sm';

    div.classList.add((i > passedLevel) ? 'hidden' : 'visible');
    
    const check = document.createElement('div');
    check.id = 'checkmark-' + i;
    check.className = 'challengeCheckmark';
    check.innerHTML = '❌';
    div.appendChild(check);
    
    const body = document.createElement('div');
    const bodyText = document.createElement('div');
    bodyText.innerHTML = typeof challenge.prompt === 'function' ? challenge.prompt('') : challenge.prompt;
    bodyText.id = 'text-' + i;
    body.appendChild(bodyText);
    body.className = 'challengeBody mb-1';

    div.appendChild(body);
  
    if(previous === undefined) {
      outputDiv.appendChild(div);
    } else {
      outputDiv.insertBefore(div, previous);
    }
    previous = div;
  });
};
const updateRules = (text) => {
  let failed = false;

  challenges.forEach((challenge, i) => {
    const element = document.getElementById('challenge-' + i);
    const checkmark = document.getElementById('checkmark-' + i);
    
    // Show next challenge.
    if(!failed && i >= 4 && i == passedLevel + 1) {
      element.classList.remove('hidden');
      element.classList.add('visible');
    }

    //Update text
    if(typeof challenge.prompt === 'function') {
      const bodyText = document.getElementById('text-' + i);
      bodyText.innerHTML = challenge.prompt(text);
    }

    // Progress style to "next level".
    if(!failed && challenge.modify !== undefined && passedLevel < i) {
      const background = document.getElementById('background');
      const oldStyle = [...background.classList.values()].find((s) => s.match('background-'));

      background.classList.remove(oldStyle);
      background.classList.add('background-' + challenge.modify);

      const div = document.getElementById('mainDiv');
      const oldStyleDiv = [...div.classList.values()].find((s) => s.match('dreamy-form-'));

      div.classList.remove(oldStyleDiv);
      div.classList.add('dreamy-form-' + challenge.modify);
    }

    if(challenge.check(text)) {
      checkmark.innerHTML = '✅';
      element.classList.remove('unsolved');
      element.classList.add('solved');

      if(!failed && i > passedLevel) passedLevel = i;
    } else {
      checkmark.innerHTML = '❌';
      element.classList.remove('solved');
      element.classList.add('unsolved');

      failed = true;
    }
  });

  const register = document.getElementById('register');
  register.disabled = failed;
};