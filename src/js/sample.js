function throttle (callback) {
  var timer
  return function () {
    clearTimeout(timer)
    var args = [].slice.call(arguments)
    timer = setTimeout(function () {
      callback.apply(this, args)
    }, 100)
  }
}
debugger;

function sayHi(){
  debugger;
  console.log("hello");
}