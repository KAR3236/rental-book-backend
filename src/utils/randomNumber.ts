export const randomAlphaNumeric = (length) => {
  let s = '';
  Array.from({ length }).forEach(() => {
    s += Math.random().toString(36).charAt(2);
  });
  return s;
};

export const randomName = randomAlphaNumeric(16);
