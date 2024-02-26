'use strict';






const account1 = {
  owner: 'Ahmed Nagy',
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
  owner: 'Mohamed Test',
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


    const formattedCurrency = formattedCurrencymMov(
      acc.label,
      acc.currency,
      mov
    );
   
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

  acc.balance = acc.movements.reduce((acc, num) => acc + num);
  labelBalance.textContent = formattedCurrencymMov(
    acc.locale,
    acc.currency,
    acc.balance
  );

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



//--->TimeOUt
const ingredients = ['spanich', 'tomato', 'test'];

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = '';
});
