export default function errorHandler(error, req, res, next) {
  console.error(error);

  const status = error.status ?? 500;

  let message;

  if (status >= 500) {
    message = req.t ? req.t("errors.serverError") : "Internal server error";
  } else {
    message =
      error.message ||
      (req.t ? req.t("errors.invalidInput") : "Unexpected error");
  }

  res.status(status).json({ error: message });
}