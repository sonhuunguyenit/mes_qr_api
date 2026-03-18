import * as yup from "yup";

const ValidationHelper = {
  login: yup
    .object({
      username: yup.string().required("Vui lòng nhập tên đăng nhập"),
      password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(6, "Ít nhất 6 ký tự"),
    })
    .required(),
};

export type LoginSchema = yup.InferType<typeof ValidationHelper.login>;

export default ValidationHelper;
