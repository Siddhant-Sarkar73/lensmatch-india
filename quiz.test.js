/**
 * Unit tests for LensMatch India quiz logic.
 * Loads index.html in JSDOM to access inline script globals (LENSES, IDX, scoreLens, show, etc.).
 */

const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let win;
let document;

beforeAll(() => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  const dom = new JSDOM(html, { runScripts: 'dangerously' });
  win = dom.window;
  document = win.document;
});

describe('IDX and BUDGET_LIMIT', () => {
  test('IDX.budget maps answer values to 0-3', () => {
    expect(win.IDX.budget.budget1).toBe(0);
    expect(win.IDX.budget.budget2).toBe(1);
    expect(win.IDX.budget.budget3).toBe(2);
    expect(win.IDX.budget.budget4).toBe(3);
  });

  test('IDX.shoot maps answer values to 0-3', () => {
    expect(win.IDX.shoot.casual).toBe(0);
    expect(win.IDX.shoot.events).toBe(1);
    expect(win.IDX.shoot.street).toBe(2);
    expect(win.IDX.shoot.studio).toBe(3);
  });

  test('IDX.exp maps answer values to 0-3', () => {
    expect(win.IDX.exp.beginner).toBe(0);
    expect(win.IDX.exp.intermediate).toBe(1);
    expect(win.IDX.exp.advanced).toBe(2);
    expect(win.IDX.exp.professional).toBe(3);
  });

  test('IDX.af maps answer values to 0-2', () => {
    expect(win.IDX.af.af_crit).toBe(0);
    expect(win.IDX.af.af_mod).toBe(1);
    expect(win.IDX.af.af_low).toBe(2);
  });

  test('IDX.ois maps answer values to 0-2', () => {
    expect(win.IDX.ois.ois_yes).toBe(0);
    expect(win.IDX.ois.ois_maybe).toBe(1);
    expect(win.IDX.ois.ois_no).toBe(2);
  });

  test('BUDGET_LIMIT has correct caps for each budget tier', () => {
    expect(win.BUDGET_LIMIT[0]).toBe(15000);
    expect(win.BUDGET_LIMIT[1]).toBe(35000);
    expect(win.BUDGET_LIMIT[2]).toBe(70000);
    expect(win.BUDGET_LIMIT[3]).toBe(Infinity);
  });
});

function setAns(win, answers) {
  if (win.ans && typeof win.ans === 'object') {
    Object.keys(win.ans).forEach((k) => delete win.ans[k]);
  }
  if (win.ans) Object.assign(win.ans, answers);
}

describe('scoreLens', () => {
  beforeEach(() => {
    setAns(win, {});
  });

  test('returns -1 when lens price exceeds selected budget limit', () => {
    setAns(win, { 0: 'budget1', 1: 'casual', 2: 'beginner', 3: 'af_crit', 4: 'ois_no' });
    const expensiveLens = win.LENSES.find((l) => l.price > 15000);
    expect(expensiveLens).toBeDefined();
    expect(win.scoreLens(expensiveLens)).toBe(-1);
  });

  test('returns a number in 0-100 range when within budget', () => {
    setAns(win, { 0: 'budget1', 1: 'casual', 2: 'beginner', 3: 'af_crit', 4: 'ois_no' });
    const nikon50 = win.LENSES.find((l) => l.id === 'nikon-50-18g');
    const score = win.scoreLens(nikon50);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('entry budget + casual + beginner yields Nikon 50mm f/1.8G as top lens', () => {
    setAns(win, { 0: 'budget1', 1: 'casual', 2: 'beginner', 3: 'af_crit', 4: 'ois_no' });
    const scored = win.LENSES.map((l) => ({ ...l, score: win.scoreLens(l) }))
      .filter((l) => l.score >= 0)
      .sort((a, b) => b.score - a.score);
    expect(scored.length).toBeGreaterThan(0);
    expect(scored[0].id).toBe('nikon-50-18g');
  });
});

describe('section visibility (show)', () => {
  test('show("home-section") hides quiz and results', () => {
    win.show('home-section');
    expect(document.getElementById('home-section').style.display).toBe('block');
    expect(document.getElementById('quiz-section').style.display).toBe('none');
    expect(document.getElementById('results-section').style.display).toBe('none');
  });

  test('show("results-section") shows results and hides others', () => {
    win.show('results-section');
    expect(document.getElementById('results-section').style.display).toBe('block');
    expect(document.getElementById('home-section').style.display).toBe('none');
    expect(document.getElementById('quiz-section').style.display).toBe('none');
  });
});
