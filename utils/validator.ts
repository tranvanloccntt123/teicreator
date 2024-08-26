export const formValidate = (
  config: ConfigValidateForm,
  value: string
): ValidatorResult => {
  let message = "";
  if (config.required && !value) {
    message = config.required.message;
  }
  if (message === "" && config.max && value.length > (config.max?.value ?? 0)) {
    message = config.max.message;
  }
  if (message === "" && config.min && value.length < (config.min?.value ?? 0)) {
    message = config.min.message;
  }
  if (message === "" && config.regex && !config.regex.value(value)) {
    message = config.regex.message;
  }
  if (message === "" && config.customs && config.customs.length) {
    for (const custom of config.customs) {
      if (message !== "") {
        break;
      }
      if (!custom.value(value)) {
        message = custom.message;
      }
    }
  }
  return {
    message,
    status: message === "",
  };
};
