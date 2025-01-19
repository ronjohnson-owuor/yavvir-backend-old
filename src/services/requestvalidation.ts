export default function requestvalidation(
  body: object,
  params: string[]
) {
  /* first check if the object is empty if the body or query is emty just cancell and return return */
  let emptyObject = Object.keys(body).length === 0;
  let message: null | string = null;
  let allObjectFound = true;
  if (emptyObject) {
    params.forEach((single_param) => {
      message += `, ${single_param.split(":")[0]} requires a  ${
        single_param.split(":")[1]
      } but its null or not passed`;
    });
    return {
      proceed: false,
      message: message,
    };
  }

  /* check if the entries are in the object passed if not return that message back to the user */
  for (const single_param of params) {
    const key = single_param.split(":")[0];
    if (!(body as Record<string, any>)[key]) {
      allObjectFound = false;
      return {
        proceed: false,
        message: `${key} cannot be null, please provide a value`,
      };
    }
  }

  // check if the data type passed matches the data type specified
  if (!emptyObject) {
    params.forEach((single_param) => {
      let key = single_param.split(":")[0];
      let dataType = single_param.split(":")[1];
       // check if data is string and has just blank spaces
       if (allObjectFound && typeof (body as Record<string, any>)[key] == "string") {
        let lengthOfString = (body as Record<string, any>)[key] as string;
        if (lengthOfString.trim().length === 0) {
          message == null
            ? (message = `length of ${key} cannot be 0 please insert your ${key}`)
            : (message += `, length of ${key} cannot be 0 please insert your ${key}`);
        }
      }
      if (
        allObjectFound &&
        typeof (body as Record<string, any>)[key] !== dataType
      ) {
        message == null
          ? (message = `${key} cannot be a ${typeof (
              body as Record<string, any>
            )[key]} it should be a ${dataType}`)
          : (message += `, ${key} cannot be a ${typeof (
              body as Record<string, any>
            )[key]} it should be a ${dataType}`);

      }
    });

    if (message != null) {
      return {
        proceed: false,
        message,
      };
    }
  }

  //   validate email adress
  for (const single_param of params) {
    const key = single_param.split(":")[0];
    if (key == "email" && allObjectFound) {
      // check if the email is valid
      let emailValue = (body as Record<string, any>)[key];
      let isEmailValid = emailValue.split("@")[1];
      if (!isEmailValid) {
        message = `${emailValue} is not a valid email`;
        return {
          proceed: false,
          message,
        };
      }
    }
  }

  return {
    proceed: true,
    message: null,
  };
}
