import { ChangeEvent, useState } from 'react';
import styled from 'styled-components';

type ChangeByInRangeParamKeys = ['value', 'amount', 'min', 'max'];
type ChangeByInRangeParams = {
  [K in ChangeByInRangeParamKeys[number]]: number;
};

function changeByInRange(params: ChangeByInRangeParams) {
  const { value, amount, min, max } = params;

  const isIncrement = amount >= 0;

  let newValue = value + amount;

  if (isIncrement) {
    while (newValue > max) {
      newValue = newValue - max + min - 1;
    }
    return newValue;
  }

  while (newValue < min) {
    newValue = newValue + max - min + 1;
  }
  return newValue;
}

function cesarEncryption(msg: string, num: number) {
  const splitMessageChars = msg.split('');

  const encryptedCharacters = splitMessageChars.map((char) => {
    const charCode = char.charCodeAt(0);

    const isUpperCase = charCode >= 65 && charCode <= 90;
    const isLowerCase = charCode >= 97 && charCode <= 122;
    const shouldBeEncrypted = isLowerCase || isUpperCase;

    // const startIndex = isUpperCase ? 65 : 97;
    // const alphabetLength = 26;
    // let currentIndex = charCode - startIndex + num;
    // currentIndex = currentIndex < 0 ? 26 + currentIndex : currentIndex;
    // const encryptedCharCode = startIndex + (currentIndex % alphabetLength);

    const max = isUpperCase ? 90 : 122;
    const min = isUpperCase ? 65 : 97;

    const encryptedCharCode = changeByInRange({
      value: charCode,
      amount: num,
      min,
      max,
    });

    return shouldBeEncrypted ? String.fromCharCode(encryptedCharCode) : char;
  });

  return encryptedCharacters.join('');
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    alert('Error copying text: ' + err);
    console.error('Error copying text: ' + err);
  }
}

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;

  * {
    box-sizing: border-box;
  }

  input {
    min-width: 280px;
    height: 36px;
    padding: 10px;
    margin-bottom: 12px;
  }

  p {
    max-width: 600px;
  }
`;

export function App() {
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [encryptionNumber, setEncryptionNumber] = useState('1');
  const [message, setMessage] = useState('');

  const handleOnChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleOnChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setEncryptionNumber(e.target.value);
  };

  const handleOnClickEncrypt = (isDecryption: boolean) => () => {
    if (isNaN(parseInt(encryptionNumber))) {
      alert('Invalid number');
      return;
    }

    const parsedNumber = parseInt(encryptionNumber);
    const number = isDecryption ? parsedNumber * -1 : parsedNumber;

    const encryptedMsg = cesarEncryption(message, number);

    setEncryptedMessage(encryptedMsg);
  };

  const handleOnClickCopy = () => {
    if (encryptedMessage) copyToClipboard(encryptedMessage);
  };

  return (
    <StyledApp>
      <h1>Cesar Encryption</h1>

      <input
        name="message"
        placeholder="Encode/Decode message"
        value={message}
        onChange={handleOnChangeMessage}
      />

      <input
        name="number"
        type="number"
        placeholder="Secret number"
        value={encryptionNumber}
        onChange={handleOnChangeNumber}
      />

      <div>
        <button onClick={handleOnClickEncrypt(false)}>Encrypt</button>
        <button onClick={handleOnClickEncrypt(true)}>Decrypt</button>
      </div>

      {Boolean(encryptedMessage) && (
        <div>
          <p>{encryptedMessage}</p>
          <button onClick={handleOnClickCopy}>Copy result</button>
        </div>
      )}
    </StyledApp>
  );
}

export default App;
