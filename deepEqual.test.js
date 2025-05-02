import deepEqual from "./deepEqual.js";

// Цветное оформление консоли
const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const white = "\x1b[0m";

function testDeepEqual(actual, expected) {
  const result = deepEqual(actual, expected);

  if (result.equal) {
    console.log(`✅  OK
${green}──────${white}`);
    return true;
  }

  console.log(`
${red}❌  Error:${white}
${yellow}▸ Путь: ${white} ${result.path}
${yellow}▸ Фактическое: ${white} ${JSON.stringify(actual)}
${yellow}▸ Ожидаемое: ${white} ${JSON.stringify(expected)}
${red}─────────${white}
`);

  return false;
}

const obj1 = { a: { b: 1 } };
const obj2 = { a: { b: 2 } };
const obj3 = { a: { b: 1 } };

testDeepEqual(obj1, obj1); // ✅ OK
testDeepEqual(obj1, obj2); // ❌ Error: $.a.b
testDeepEqual(obj1, obj3); // ✅ OK
