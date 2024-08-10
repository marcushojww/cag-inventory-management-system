export const debounce = (mainFunction: () => void, delay: number) => {
  // Declare a variable called 'timer' to store the timer ID
  let timer: string | number | NodeJS.Timeout | undefined;

  // Return an anonymous function that takes in any number of arguments
  return function () {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(timer);

    // Set a new timer that will execute 'mainFunction' after the specified delay
    timer = setTimeout(() => {
      mainFunction();
    }, delay);
  };
};
