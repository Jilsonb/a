const ECKey = require("ec-key");
const fs = require('fs');
const readline = require('readline');
const args = require('minimist')(process.argv.slice(2));
// console.log(args, args.k);

const prompt = 'Message: ';
var key;
var pem;

if (args.key != null)
  key = args.key;

if (key == null) {
  console.log("Please specify a signing key with option --key file");
  process.exit();
}

// Surround with try/catch to catch file not found
try {
  pem = fs.readFileSync(key);
} catch (error) {
  console.log(error);
  exit();
}
const privateKey = new ECKey(pem, "pem");

console.log('Key:', privateKey.toString('pkcs8'));
console.log('Using', privateKey.curve, 'to sign message');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  console.log('Signature:', signfunction(input));
  rl.prompt();
});
rl.setPrompt(prompt, prompt.length);
rl.prompt();

// var outputString = 'The quick brown fox jumps over the lazy dog';
function signfunction(string) {
  return privateKey.createSign("SHA256").update(string).sign("base64");
}
