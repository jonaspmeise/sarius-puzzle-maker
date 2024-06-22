const challenges = [
  {prompt: 'Password must not be empty.', check: (text) => text.length > 0},
  {prompt: 'Password must include a number.', check: (text) => /\d/.test(text)},
  {prompt: 'Password must include a special character.', check: (text) => /[^a-zA-Z0-9]/.test(text)},
  {prompt: 'Password must be atleast 8 characters.', check: (text) => text.length >= 8},
  {prompt: 'Password must include both lower case and upper case characters.', check: (text) => /[a-z]/.test(text) && /[A-Z]/.test(text)},
  {prompt: `Password must include not include any even digits.`, check: (text) => /(?:0|2|4|6|8)/.test(text)},
  {prompt: (text) => `Password must have an equal number of characters. (Currently: ${text.length})`, check: (text) => text.length % 2 === 0},
  {prompt: 'Password must not have more than 32 characters.', check: (text) => text.length <= 32},
  {prompt: 'Password must include the title of a Key work.', check: (text) => /(?:clannad|rewrite|kamisama|kanon|air|clannad|summer pockets|planetarian|little busters|harmonia|kud wafter|angel beats|charlotte)/i.test(text)},
  {prompt: `Password must include one of the names of the following nuggets.
    <div class="image-container">
      <img src="assets/ayu.jpg">
      <img src="assets/fuko.jpg">
      <img src="assets/renge.png">
    </div>`, check: (text) => /(?:ayu|fuko|renge)/i.test(text)},
  {prompt: 'Password must a literal nugget (🐥).', check: (text) => text.includes('🐥')},
  {prompt: 'Password must not repeat any numbers right after each other.', check: (text) => !/\d\1/.test(text)},
  {prompt: 'Password must not include the letter "E".', check: (text) => !/e/i.test(text)},
  {prompt: `Password must have a total sum of all digits equal to 5. (Current total sum: ${checksum(text)})`, check: (text) => {
    return checksum(text) === 5;
  }},
  {prompt: 'Password must include the German word for shit.', check: (text) => /(?:scheiße|scheisse)/i.test(text)},
  {prompt: 'a', check: (text) => true},
  {prompt: 'a', check: (text) => true},
  {prompt: 'a', check: (text) => true},
  {prompt: 'a', check: (text) => true},
  {prompt: 'a', check: (text) => true},
  {prompt: 'a', check: (text) => true},
  {prompt: 'a', check: (text) => true},
  {prompt: 'a', check: (text) => true},
  {prompt: 'a', check: (text) => true},
  {prompt: 'a', check: (text) => true},
  {prompt: 'a', check: (text) => true},
];
const solution = "the key";
let passedLevel = 4;

let outputDiv;

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
    div.className = 'challenge unsolved';

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
    if(passedLevel >= 4 && i == passedLevel + 1) {
      element.classList.remove('hidden');
      element.classList.add('visible');
    }

    //Update text
    if(typeof challenge.prompt === 'function') {
      const bodyText = document.getElementById('text-' + i);
      bodyText.innerHTML = challenge.prompt(text);
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

    // Scroll to last solved riddle.
  });

  const register = document.getElementById('register');
  register.disabled = failed;
};