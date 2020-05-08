export async function routes(): Promise<Result> {
  const errors: Error[] = [];
  let response: Response;
  try {
    response = await fetch(
      'https://islandexplorertracker.availtec.com/InfoPoint/rest/Routes/GetVisibleRoutes'
    );
  } catch (err) {
    errors.push(err);
  }

  const result: Result = {};
  if (response) {
    result.response = response;
    try {
      result.data = await response.json();
    } catch (err) {
      errors.push(err);
    }
  }

  if (errors.length) {
    result.errors = errors;
  }

  return result;
}

type Result = {
  data?: any;
  errors?: Error[];
  response?: Response;
};
