'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-07-10T17:01:17.194Z',
    '2023-07-11T23:36:17.929Z',
    '2023-07-12T10:51:36.790Z',
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
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2023-07-11T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDays = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const day = `${date.getDate()}`.padStart(2, 0);
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//Display movements function
const movementDisplay = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDays(date, acc.locale);

    // const options = {
    //   style: 'currency',
    //   currency: acc.currency,
    // };

    const formattedCurrency = formattedCurrencymMov(
      acc.label,
      acc.currency,
      mov
    );
    //  new Intl.NumberFormat(acc.locale, options).format(
    //   mov
    // );
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
    
        <div class="movements__value">${formattedCurrency}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// ---> Balance

const formattedCurrencymMov = function (locale, currency, value) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
const calcDisplayMethod = function (acc) {
  // const options = {
  //   style: 'currency',
  //   currency: acc.currency,
  // };
  acc.balance = acc.movements.reduce((acc, num) => acc + num);
  labelBalance.textContent = formattedCurrencymMov(
    acc.locale,
    acc.currency,
    acc.balance
  );
  //  `${new Intl.NumberFormat(
  //   acc.locale,
  //   options
  // ).format(acc.balance)}`;
};

const createUsersName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsersName(accounts);
//Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumIn.textContent = formattedCurrencymMov(
    acc.label,
    acc.currency,
    incomes
  );
  // `${incomes.toFixed(2)}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formattedCurrencymMov(
    acc.label,
    acc.currency,
    outcomes
  );
  // `${Math.abs(outcomes.toFixed(2))}€`;
  // console.log(outcomes);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formattedCurrencymMov(
    acc.label,
    acc.currency,
    interest
  );
  // `${interest.toFixed(2)}€`;
};
const updateUI = function (acc) {
  //Display Movements
  movementDisplay(acc);

  //Display Balance
  calcDisplayMethod(acc);
  //Display Summary
  calcDisplaySummary(acc);
};
// --->TImer
const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    //in each call print the remaining timer to ui
    labelTimer.textContent = `${min}:${sec}`;
    // if timer = 0 => stop it and disappear the window

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get stated';
    }
    //make time increase after 1 second

    time--;
  };
  // set time
  let time = 120;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
let currentAccount, timer;
// Fake always login
// currentAccount = account1;
// containerApp.style.opacity = 100;
// updateUI(currentAccount);
//login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI and messages
    labelWelcome.textContent = `Welcome, ${
      currentAccount.owner.split(' ')[0]
    } !`;
    containerApp.style.opacity = 100;

    //--->Date
    // const now = new Date();
    // const year = now.getFullYear();
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const minumtes = `${now.getMinutes()}`.padStart(2, 0);
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year} , ${hour}:${minumtes}`;

    setInterval(() => {
      const now = new Date();
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        // weekday: 'long',
        year: '2-digit',
        second: 'numeric',
      };
      // const locale = navigator.language;

      labelDate.textContent = new Intl.DateTimeFormat(
        currentAccount.locale,
        options
      ).format(now);
    }, 1000);
    // hide login field
    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    updateUI(currentAccount);
  }
  // } else {
  //   containerApp.textContent = 'ERROR EMAIL OR PASSWORD';
  // }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiveAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  // console.log(receiveAcc);
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc?.userName !== currentAccount.userName
  ) {
    //doing transfer
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);
    receiveAcc.movementsDates.push(new Date().toISOString());
    currentAccount.movementsDates.push(new Date().toISOString());

    //reset timer
    clearInterval(timer);
    timer = startLogoutTimer();

    //udate ui
    updateUI(currentAccount);
  }
});

// ----> Close account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputClosePin.value = inputCloseUsername.value = '';
    inputClosePin.blur();
    inputCloseUsername.blur();
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(+inputLoanAmount.value);
  if (currentAccount.movements.some(acc => acc >= amount * 0.1) && amount > 0) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      // put date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update ui
      updateUI(currentAccount);
    }, 3000);
    clearInterval(timer);
    timer = startLogoutTimer();
    inputLoanAmount.value = '';
  }
});
let sorted = true;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  movementDisplay(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// console.log(0.1 + 0.2);

//--->parsing
/*
console.log(parseInt('39,34px', 10));
console.log(parseInt('39', 2));
console.log(parseInt('2.5 rem'));
//parseFloat
console.log(parseFloat('2.5 rem'));
console.log('HERE /////////');
console.log(parseFloat('10px'));

// Number.isNaN()
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN('20X'));
console.log(Number.isNaN(23 / 0));

//Number is finite
console.log('///////IsFinitew///////');
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite('20X'));
console.log(Number.isFinite(23 / 0));

//isInteger
console.log('///////IsInger()///////');
console.log(Number.isInteger(20.4));
console.log(Number.isInteger(20));
console.log(Number.isInteger(20.0));
console.log(Number.isInteger('20'));
console.log(Number.isInteger(+'20X'));
console.log(Number.isInteger('20X'));
console.log(Number.isInteger(23 / 0));
console.log(5 + '5');
console.log('5' + 5);

//--->Max and Minimum it make type corcion
console.log(Math.max(1, 2, 3, 34, 5));
console.log(Math.max(1, 2, 3, '34', 5));
console.log(Math.max(1, 2, 3, '34px', 5));

//minimum
console.log(Math.min(1, 2, 3, '34px', 5));
//Pi of circuit
console.log(Math.PI);

//--->Random number between max and min

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
console.log(randomInt(5, 10));

//--->Rounding integers
//nearst only
console.log(Math.round(1.2));
console.log(Math.round(-1.8));

// floor // to smallest //floor is better than trunc
console.log(Math.floor(1.2));
console.log(Math.floor(1.8));
console.log(Math.floor(-1.1));

//ceiling to biggest

console.log(Math.ceil(1.2));
console.log(Math.ceil(-1.2));
console.log(Math.ceil(-1.8));
console.log(Math.ceil(1.1));

//trunc //to zero
console.log(Math.trunc(1.2));
console.log(Math.trunc(1.8));
console.log(Math.trunc(-1.8));
//SO trunc like ceil if ceil negative and trunc like floor if floor positive

//toFixed
console.log((1.2234).toFixed(2));
// to make it number
console.log(+(1.2234).toFixed(2));
console.log(+(3.99).toFixed(2));
console.log(+(5.679).toFixed(2));

//--->sqr

console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
//cubic root
console.log(8 ** (1 / 3));
console.log(Number.parseFloat('10px'));
*/
//--->Reamainder operator
/*
console.log(8 % 3);
const isEven = num => {
  num % 2 === 0
    ? console.log(`Number ${num} is Even`)
    : console.log('not Even');
};
isEven(5);
isEven(4);

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach((mov, i) => {
    if (i % 2 === 0) mov.style.backgroundColor = 'orangered';

    if (i % 3 === 0) mov.style.backgroundColor = 'blue';
  });
});

//Numeric separators
console.log(223_0000);
// console.log(3._143);
console.log(Number('234_888'));
console.log(parseInt('234_888'));
console.log(parseFloat('234_888'));

//--->BigInt
//operations
console.log(13454353450043534543534500n);
// console.log(BigInt(13454353450043534543534500))
//bigInt(used in smaller numbers);

// console.log(23432424324324244234n * 3);
console.log(23432424324324244234n * 3n);
// console.log(Math.sqrt(16n));
const huge = 322323232323444454353n;
const num = 23;
console.log(huge + BigInt(num));

//Exeptions
console.log(20n == 20);
console.log(20n === 20);
console.log('20n' == 20);
console.log(20n > 15);
console.log(typeof 20n);
console.log(huge + ' is Big');

//Division

console.log(20000000n / 5n);
*/
//--->Dates
/*
const now = new Date();
console.log(now);
//month is zero base
console.log(new Date(2030, 7, 13, 12, 10, 12));
console.log(new Date('Aug 17 2033 13:02:01'));

console.log(new Date(account1.movementsDates[0]));

console.log(new Date('aug 17 2022'));

console.log(new Date(0));
//# days after start time
console.log(new Date(3 * 24 * 60 * 60 * 1000));

// ..Working with dates
*/
/*
const future = new Date(2045, 7, 12, 4, 34, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDay());
console.log(future.getTime());
console.log(future.getHours());
console.log(future.getSeconds());
console.log(future.getMinutes());
console.log(future.toISOString());
console.log(future.toDateString());

console.log('///////////');
console.log(new Date(2386114463000));
//set time
console.log(future.setFullYear(2099));
console.log(future);
*/

//--->NUmber Formatting
// const num = 23334433.23;
// const options = {
//   style: 'currency',
//   unit: 'celsius',
//   currency: 'USD',
// };
// console.log(`America: ${Intl.NumberFormat('en-US', options).format(num)}`);
// console.log(`Egypt: ${Intl.NumberFormat('ar-EG', options).format(num)}`);
// console.log(`portugal: ${Intl.NumberFormat('pt-PT', options).format(num)}`);
// console.log(`Greece: ${Intl.NumberFormat('el-GR', options).format(num)}`);

//--->TimeOUt
const ingredients = ['spanich', 'tomato', 'test'];
// setTimeout(
//   (ing1, ing2) => console.log(`we have pizza ${ing1} and ${ing2}🍕`),
//   3000,
//   'spanish',
//   'tomato'
// );

// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`we have pizza ${ing1} and ${ing2}🍕`),
//   3000,
//   ...ingredients
// );
// console.log('Waiting ....');
// if (ingredients.includes('spanich')) clearTimeout(pizzaTimer);
//--->interval
// setInterval(() => {
//   const newDate = new Date();
//   const hour = newDate.getHours();
//   const minumtes = newDate.getMinutes();
//   const seconds = newDate.getSeconds();
//   console.log(`${hour} : ${minumtes} : ${seconds}`);
// }, 1000);
// console.log(newDate);
// console.log(hour);

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = '';
});
