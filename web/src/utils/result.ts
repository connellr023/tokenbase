type Result<T, E = string> = {
  ok?: T;
  error?: E;
};

export default Result;
