export const configCreateWorkspace: ValidatorObject = {
  width: {
    required: {
      message: "Width is required",
    },
    regex: {
      value: (date: string) => {
        const dateReg = /^\d+/g;
        return dateReg.test(date);
      },
      message: "Width must be number",
    },
  },
  height: {
    required: {
      message: "Height is required",
    },
    regex: {
      value: (date: string) => {
        const dateReg = /^\d+/g;
        return dateReg.test(date);
      },
      message: "Height must be number",
    },
  },
};
