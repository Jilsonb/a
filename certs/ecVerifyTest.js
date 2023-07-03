const crypto = require('crypto');
const ECKey = require("ec-key");
const fs = require('fs');
const readline = require('readline');
const args = require('minimist')(process.argv.slice(2));

const prompt = 'Input (Message#Signature): ';
var cert;
var pem;

if (args.cert != null) {
  cert = args.cert
}

if (cert == null) {
  console.log("Please specify a validation key with option --key file");
  process.exit();
}
// Surround with try/catch to catch file not found
try {
  pem = fs.readFileSync(cert);
} catch (error) {
  console.log(error);
  exit();
}
let pubKey = crypto.createPublicKey(pem).export({ type: 'spki', format: 'pem' });
var publicKey = new ECKey(pubKey, "pem");

console.log('Key:', publicKey.toString('spki'));
console.log('Using', publicKey.curve, 'to verify message');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  let data = input.toString().split('#');
  let message = data[0];
  let signature = data[1];
  console.log(verifyfunction(message, signature));
  rl.prompt();
});

rl.setPrompt(prompt, prompt.length);
rl.prompt();

function verifyfunction(message, signature) {
  return (publicKey.createVerify('SHA256')
    .update(message)
    .verify(signature, 'base64') ? 'Valid Signature' : 'Invalid Signature');
}
