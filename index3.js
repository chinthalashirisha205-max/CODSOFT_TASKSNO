const display = document.getElementById('display');

function appendValue(val) {
  if (display.value === '0' || display.value === 'Error') {
    display.value = val;
  } else {
    display.value += val;
  }
}

function clearDisplay() {
  display.value = '0';
}

function deleteLast() {
  if (display.value.length === 1 || display.value === 'Error') {
    display.value = '0';
  } else {
    display.value = display.value.slice(0, -1);
  }
}

function calculate() {
  try {
    display.value = Function('"use strict"; return (' + display.value + ')')();
  } catch (e) {
    display.value = 'Error';
    setTimeout(clearDisplay, 1500);
  }
}