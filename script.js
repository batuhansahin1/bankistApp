'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-01-28T09:15:04.904Z',
    '2019-04-01T10:17:24.185Z',
    '2019-05-27T17:01:17.194Z',
    '2019-07-11T23:36:17.929Z',
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-03-08T14:11:59.604Z',
    '2020-03-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-01-25T14:18:46.235Z',
    '2019-02-05T16:33:06.386Z',
    '2019-03-10T14:43:26.374Z',
    '2019-04-25T18:49:59.371Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-02-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'Batuhan Sahin',
  movements: [500, 1000, -400, 1500, -500, 1000, 1500, -500],
  interestRate: 2,
  pin: 5555,
  movementsDates: [
    '2019-01-25T14:18:46.235Z',
    '2019-02-05T16:33:06.386Z',
    '2019-03-10T14:43:26.374Z',
    '2019-04-25T18:49:59.371Z',
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-02-26T12:01:20.894Z',
  ],
  currency: 'TRY',
  locale: 'tr-TR',
};
//her bir kullanıcı için username oluşturmam lazım bu usernameler adı ve soyadının baş harfi oluyor
const accounts = [account1, account2, account3, account4, account5];

// Elements

//giriş yapan kişinin adı ve welcome yazısı için seçmemiz gereken alan
const labelWelcome = document.querySelector('.welcome');

//Current balance yazısının altındaki date
const labelDate = document.querySelector('.date');
console.log(labelDate);

const labelBalance = document.querySelector('.balance__value');
//aşağıdaki input output yazıları
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');

const labelSumInterest = document.querySelector('.summary__value--interest');
//süre yi yazdıracağımız yer
//60 ile bölümü dakiika 60 ile modu saniye
const labelTimer = document.querySelector('.timer');

//giriş yaptıktan sonra gözükecek kısım
const containerApp = document.querySelector('.app');
//banka hareketlerini göstermemiz gereken kısım
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
// const btnCurrency=
// giriş yapmak için kullandığımız input alanları
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
//accountslardan birine para transferi için yapılan kısım
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');

// hesabı accounts dizisinden silen kısımın inputları
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round((date1 - date2) / (60 * 60 * 24 * 1000));
  const now = new Date();
  const daysPassed = calcDaysPassed(now, date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};
const formatCurrency = (value, locale, currency) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
const displayMovements = function (acc, sorted = false) {
  containerMovements.innerHTML = '';
  if (acc) {
    const arr = sorted
      ? acc.movements.slice().sort((a, b) => a - b)
      : acc.movements;
    console.log(arr);

    arr.forEach((mov, index) => {
      const type = mov < 0 ? 'withdrawal' : 'deposit';
      let formattedDate = '';
      if (acc.movementsDates) {
        //stringi date formatında oluşturmak içi yeni bir date oluşturduk
        const date = new Date(acc.movementsDates[index]);
        formattedDate = formatMovementDate(date, acc.locale);
      }

      const formattedCur = formatCurrency(mov, acc.locale, acc.currency);
      const html = ` <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
        index + 1
      } ${type}</div>
      <div class="movements__date">${formattedDate}</div>
      <div class="movements__value">${formattedCur} </div>`;
      containerMovements.insertAdjacentHTML('afterbegin', html);
    });
  }
};
const displayWelcome = function (currentAccName) {
  labelWelcome.textContent = `Welcome ${currentAccName}`;
};

const displayBalance = function (account) {
  let totalBalance = 0;

  account.movements.forEach(mov => (totalBalance += mov));
  account.balance = totalBalance;
  const formattedCur = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
  labelBalance.textContent = `${formattedCur} `;
};
const displaySummary = function (currentAcc) {
  let income = 0;
  let outcome = 0;

  currentAcc.movements.forEach(element => {
    income += element > 0 ? element : 0;
    outcome -= element < 0 ? element : 0; // outcome ı yazdıracağım için pozitif yapıtm
  });

  // const income1 = currentAcc.movements
  //   .filter(mov => mov > 0)
  //   .reduce((acc, cur) => acc + cur, 0);
  // const outcome1 = currentAcc.movements
  //   .filter(mov => mov < 0)
  //   .reduce((acc, cur) => acc + cur, 0);
  const formattedIncome = formatCurrency(
    income,
    currentAcc.locale,
    currentAcc.currency
  );
  const formattedOutcome = formatCurrency(
    outcome,
    currentAcc.locale,
    currentAcc.currency
  );
  const formattedInterest = formatCurrency(
    (currentAcc.interestRate * (income - outcome)) / 100,
    currentAcc.locale,
    currentAcc.currency
  );
  labelSumIn.textContent = `${formattedIncome}`;
  labelSumOut.textContent = `${formattedOutcome}`;
  labelSumInterest.textContent = `${formattedInterest} `;
};
const displayDate = function () {
  const now = new Date();

  const formattedHour = now.toLocaleTimeString(currentAcc.locale, {
    hour: 'numeric',
    minute: 'numeric',
  });
  const formattedDate = new Intl.DateTimeFormat(currentAcc.locale).format(now);
  labelDate.textContent = `${formattedDate} ${formattedHour}`;
};
const displayUI = function (account) {
  //display UI
  //display balance
  displayBalance(account);
  //display ın out interest(summary)
  displaySummary(account);
  //display movements
  displayMovements(account);
};
//using fetch
//let transferringAccount;
const executeFormattedAmount = function (Curr, amount) {
  const formattedAmount = Curr * amount;
  transferringAccount.movements.push(formattedAmount);
};

const getCurData = function (senderCur, receiverCur, amount) {
  const formattedSender = senderCur.toLowerCase();
  const formattedRec = receiverCur.toLowerCase();

  try {
    fetch(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${formattedSender}/${formattedRec}.json`
    )
      .then(res => res.json())
      .then(data => executeFormattedAmount(data[formattedRec], amount));

    // if (!res.ok) throw new Error(`${data.message} (${res.status})`);
  } catch (err) {
    throw err;
  }
};
//with async function
const getData = async function (senderCur, receiverCur) {
  const formattedSender = senderCur.toLowerCase();
  const formattedRec = receiverCur.toLowerCase();
  try {
    const res = await fetch(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${formattedSender}/${formattedRec}.json`
    );
    const data = await res.json();
    console.log(typeof data);
    return data[formattedRec];
  } catch (err) {
    throw err;
  }
};
const executeAmount = async function (senderAcc, receiverAcc, amount) {
  const kur = await getData(senderAcc.currency, receiverAcc.currency);
  console.log(typeof kur);
  console.log(kur);
  const cevrilmisMiktar = kur * amount;
  receiverAcc.movements.push(cevrilmisMiktar);
};

const startTimer = function () {
  const timeHandler = function () {
    //time in - ye gitmemesi için değişkenlere atadık her timeHandler çağrıldığında dakika ve saniye yeniden atanıyor eğer bunu değişkene atamadan yapsaydık sayı - ye giderdi
    let minutes = String(parseInt(time / 60)).padStart(2, '0');
    let seconds = String(parseInt(time % 60)).padStart(2, '0');
    labelTimer.textContent = `${minutes}:${seconds}`;

    if (time === 0) {
      //burada timer 0 olduğunda  atıyor ama timer  - ye doğru saymaya devam ediyor
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';

      //böyle yapınca da giriş yapmasan bile arka planda geri sayıma devam ediyor yani programımız sonlanmadığı için hep böyle yapıcak o yüzden bunu setIntervalin dışında bir yerde istediğimiz süreye atamamaız lazım
      // timer = 60;
    }
    time--;
    //bunu burada 0 a eşitlersek set interval çalışmaz
    // timer = 60;
  };
  let time = 60;
  //önceden çağırmamaızın nedeni  set interval giriş yaptıktan 1 sn sonra çalışıyor ve orada 1:00 gözüküyor ama biz bunu çağırıp setInterval'de call'larsak. giriş yapar yapmaz 00:59dan başlıyor
  timeHandler();
  const timer = setInterval(timeHandler, 1000);
  //burada tanımlayınca da ikili saymaya ya da bazı sayıları atlamaya başladı çünkü time atanmadan geriye saymaya başlıyor
  // time = 60;
  //süre bitmesine rağmen - saymaya devam ediyor ve tekrar giriş yapınca daha hızlı eksiliyor sanki 2 kere setInterval çalışıyormuş gibi
  return timer;
};
const createUserName = function () {
  let username = '';
  //kullanıcı adı oluşturma
  accounts.forEach(account => {
    //replaceAll'a ihtiyacımız var yoksa username boşluklu oluşur
    account.owner
      .replaceAll(' ', '')
      .split('')
      .filter(letter => letter === letter.toUpperCase())
      .forEach(el => (username += el.toLowerCase()));

    account.username = username;
    username = '';
  });
};
createUserName();
//girişte username ve pin kombinasyonu doğru mu diye bakıcaztabi bu olay loginBtn ' e tıklayınca kontrol edilecek
let currentAcc, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAcc = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAcc && currentAcc.pin === +inputLoginPin.value) {
    console.log(currentAcc);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    containerApp.style.opacity = 100;
    //önceden devam eden timerı temizliyor yani bizim - ye gidip daha hızlı azalan timer ı silip yeni timer'ın kullanılmasını sağlıyor.İlk iterasyondaki setIntervali temizlemiş oluyoruz bu yüzden startTimer fonksiyonunda bir timer tanımlıyoruz ve onu return ediyoruz sonraki loginde onu temizliyoruz.ve timer'ın amacı işlem yapmadan geçirilen 10 dakika sonunda kullanıcıyı atıyor.Eğer işelm yaparsanız timer yeniden başlar
    if (timer) clearInterval(timer);

    //start timer
    timer = startTimer();
    //display welcome script
    displayWelcome(currentAcc.owner.split(' ')[0]);
    //display date
    displayDate();

    //display UI
    displayUI(currentAcc);
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(Number(inputLoanAmount.value));

  //girilen değerin yüzde 10 u total balancedan küçükse o borcu alabalir
  if (
    +inputLoanAmount.value > 0 &&
    Number(inputLoanAmount.value) * 0.1 <= currentAcc.balance
  ) {
    //adding new movement's date to the date array to display new Movements
    currentAcc.movementsDates.push(new Date());
    currentAcc.movements.push(Number(inputLoanAmount.value));

    displayUI(currentAcc);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();

  clearInterval(timer);
  timer = startTimer();
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferringAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  const amount = +inputTransferAmount.value;
  console.log(amount);
  //eğer böyle bir hesap var ise
  if (
    transferringAccount &&
    amount &&
    currentAcc.balance >= amount &&
    transferringAccount.username !== currentAcc.username
  ) {
    //miktarı kullanıcınn hesabına ekle currenttan çıkar
    // bunu movementsta ekleyip diğer tüm değerleri update et hem current hem de transferring account için
    //burada transferring account için displayleri çalıştırmadım çünkü ben current accounttayken transferring accounta geçtiğim zaman orada display işlemleri yapılacak zaten burada tekrar etmenin bi anlamı yok
    executeAmount(currentAcc, transferringAccount, amount);
    //loadCurResult(currentAcc, transferringAccount, amount);

    currentAcc.movements.push(-amount);

    //adding new movement's date to the dates array
    currentAcc.movementsDates.push(new Date());
    transferringAccount.movementsDates.push(new Date());

    displayUI(currentAcc);
    clearInterval(timer);
    timer = startTimer();
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAcc &&
    inputCloseUsername.value === currentAcc.username &&
    +inputClosePin.value === currentAcc.pin
  ) {
    const index = accounts.findIndex(
      acc => (acc.username = currentAcc.username)
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAcc, !sorted);
  sorted = !sorted;
});

//dates ve numbersı intl sectionunu izledikten sonra tekrar yapacağım ve kodu dry prensiplerine uygun şekilde düzenleyeceğim

//This project doing for understanding array manipulation concepts and some features will be add in the future maybe after watching advanced DOM Manipulation section
//Some of them is creating account class for accounts and adding website register form after that banks account will be added to take kesintiler için
