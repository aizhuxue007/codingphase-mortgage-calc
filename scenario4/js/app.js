let totalLoan,
  totalMonths,
  monthtlyInterest,
  monthlyPrincipalInterest,
  monthlyPropertyTaxes,
  monthlyHomeInsurance,
  monthlyHOA,
  monthlyTotal,
  label = ["Principal & Interest", "Property Tax", "Home Insurance", "HOA"],
  data = [12, 19, 3, 5, 2, 3],
  backgroundColors = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
  ];

let state = {
  price: getNumber(document.querySelectorAll('[name="price"]')[0].value),
  loan_years: getNumber(
    document.querySelectorAll('[name="loan_years"]')[0].value
  ),
  down_payment: getNumber(
    document.querySelectorAll('[name="down_payment"]')[0].value
  ),
  interest_rate: getNumber(
    document.querySelectorAll('[name="interest_rate"]')[0].value
  ),
  property_tax: getNumber(
    document.querySelectorAll('[name="property_tax"]')[0].value
  ),
  home_insurance: getNumber(
    document.querySelectorAll('[name="home_insurance"]')[0].value
  ),
  hoa: getNumber(document.querySelectorAll('[name="hoa"]')[0].value),
};

var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: label,
    datasets: [
        {
            label: label,
            backgroundColor: backgroundColors,
            data: [
              monthlyPrincipalInterest,
              monthlyPropertyTaxes,
              monthlyHomeInsurance,
              monthlyHOA,
            ],
        }
    ],
  },
});
myChart.options.animation = false;

function getNumber(str) {
  return Number(str.replace(/[^0-9\.-]+/g, ""));
}

function updateInputState(event) {
  let name = event.target.name;
  let value = event.target.value;
  let labelElement = document.getElementsByClassName(`total__${name}`)[0];
  if (name == "price") {
    value = getNumber(value);
  } else if (
    event.target.name == "home_insurance" ||
    event.target.name == "hoa"
  ) {
    labelElement.innerHTML = `$${value}`;
  } else {
    labelElement.innerHTML = `${value} %`;
  }
  state = {
    ...state,
    [name]: value,
  };
  calculateData();
}

function calculatePrincipalInterest() {
    if (state.interest_rate) {
        console.log('hi')
        return (
            totalLoan * (
                
                    (monthlyInterest * ((1 + monthlyInterest) ** totalMonths)) / 
                    ((1 + monthlyInterest) ** totalMonths - 1)
                
            )
        ).toFixed(2);
    } else {
        return 0;
    }
}

function calculateData() {
    totalLoan = state.price - (state.price * (state.down_payment / 100));
    totalMonths = state.loan_years * 12;
    monthlyInterest = (state.interest_rate / 100) / 12;
    monthlyPrincipalInterest = calculatePrincipalInterest();
    monthlyPropertyTaxes = (
        (state.price * (state.property_tax / 100)) / 12
    ).toFixed(2);
    monthlyHomeInsurance = (state.home_insurance / 12).toFixed(2);
    monthlyHOA = (state.hoa / 12).toFixed(2);
    monthlyTotal = 
        parseFloat(monthlyPrincipalInterest) +
        parseFloat(monthlyPropertyTaxes) +
        parseFloat(monthlyHomeInsurance) +
        parseFloat(monthlyHOA);
    updateInfo();
    updateChart();
}

function updateInfo() {
    document.getElementsByClassName('info__numbers--principal')[0].innerHTML = `$${monthlyPrincipalInterest}`;
    propertyTaxSpan = document.getElementsByClassName('info__numbers--property_taxes')[0].innerHTML = `$${monthlyPropertyTaxes}`;
    homeInsuranceSpan = document.getElementsByClassName('info__numbers--home_insurance')[0].innerHTML = `$${monthlyHomeInsurance}`;
    hoaSpan = document.getElementsByClassName('info__numbers--hoa')[0].innerHTML = `$${monthlyHOA}`;
    totalSpan = document.getElementsByClassName('info__numbers--total')[0].innerHTML = `$${monthlyTotal}`;
}

function updateChart() {
    myChart.data.datasets.pop()
    myChart.data.datasets.push(
        {
            label: label,
            backgroundColor: backgroundColors,
            data: [
              monthlyPrincipalInterest,
              monthlyPropertyTaxes,
              monthlyHomeInsurance,
              monthlyHOA,
            ],
        },
    )
    myChart.options.transitions.active.animation.duration = 0;
    myChart.update();
}

// add event listener to inputs from form-group
let inputArray = Array.from(document.getElementsByClassName("form-group"));
inputArray.splice(0, 7).forEach((input) => {
  input.addEventListener("input", updateInputState);
});

const form = document.getElementsByTagName('form')[0];
form.addEventListener('submit', (event) => {
    event.preventDefault();
    document.getElementsByClassName('mg-page__right')[0].classList.add('mg-page__right--animate');
    calculateData();
});
